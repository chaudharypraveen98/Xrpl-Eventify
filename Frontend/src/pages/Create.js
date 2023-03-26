import React, { useEffect, useState } from "react";
import api from "../services";
// import Accordion from "../components/base/Accordion";
// import AccordionHeader from "../components/base/AccordionHeader";
// import Button from "../components/base/Button";
// import Card from "../components/base/Card";
// import Checkbox from "../components/base/Checkbox";
// import Image from "../components/base/Image";
// import Select from "../components/base/Select";
// import TextInput from "../components/base/TextInput";
// import { Colors } from "../constants/Colors";
// import { AiOutlineSearch } from 'react-icons/ai';
import Header from "../components/Header";
// import { useEthers, useEtherBalance } from "@usedapp/core";
import MintModalInput from "../components/MintModalInput";
import QrModal2 from "../components/QrModal2";

import "../components/MintModal.css";
import { Router, useNavigate } from "react-router";
import TextInput from "../components/base/TextInput";
import CustomTable from "../components/base/Table";
import { toast } from "react-toastify";

const Create = () => {
  // Metamask
  // const {activateBrowserWallet, account} = useEthers();
  // const etherBalance = useEtherBalance(account);

  // useEffect(()=>{
  //   activateBrowserWallet();
  // },[])
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState();
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [data, setData] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const navigate = useNavigate();
  const [ticketCount, setTicketCount] = useState(1);
  const wallet = JSON.parse(localStorage.getItem("wallet"));
  const [activeTab, setActiveTab] = useState("create_event");
  const [fetchedTickets, setFetchedTickets] = useState([]);
  const tableHeads = [
    "TicketSequence",
    // "Sell Order",
    "index",
    "LedgerEntryType"
  ];

  const activateMinting = () => {
    if (date === "" || location === "" || description === "" || file === null) {
      setMessage("Please fill out the entire form");
    }
    var bodyFormData = new FormData();
    bodyFormData.append("date", date);
    bodyFormData.append("location", location);
    bodyFormData.append("name", name);
    bodyFormData.append("description", description);
    bodyFormData.append("file", file);
    bodyFormData.append("filename", file?.name);
    toast.info('🦄 Sending the transaction to Ledger', {
      position: "bottom-right"
    });
    api({
      method: "post",
      url: "/api/xummMintV2",
      // url: "/api/xummMintV1",
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
    }).then((res) => {
      console.log("xumm data coming");
      console.log(res);
      toast.info('🦄 Please sign the transaction', {
        position: "bottom-right"
      });
      setData({ xummData: res });
      setShowQR(true);
    });
  }

  const createTickets = () => {
    const body = {
      TicketCount: ticketCount,
      account: wallet,
    };
    api
      .post("/api/createTickets", { metadata: body })
      .then((res) => {
        console.log("xumm data coming", res.data);
        console.log(res);
        setData({ xummData: res });
        setShowQR(true);
      })
      .catch((err) => {
        console.log("yoken error", err);
      });
  };
  const tableClickHandler = (row = 0, column = 0) => {
    console.log(row, column)
  };
  const getTickets = () => {
    const body = {
      account: wallet,
    };
    console.log("body", body);
    api
      .post("/api/ticket_info", { metadata: body })
      .then((res) => {
        console.log("res adta", res.data);
        setFetchedTickets(res?.data);
      })
      .catch((err) => {
        console.log("yoken error", err);
      });
  };
  return (
    <>
      <Header />
      <div
        className="createContainerBackground"
        style={{
          backgroundImage: `url("https://images.unsplash.com/photo-1573221566340-81bdde00e00b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80")`,
        }}
      >
        <div className="modalMintContainer">
          <div className="modal-body">
            <div className="manage-tab-container">
              <div
                className={`tab-element${activeTab === "create_event" ? " activ-tab" : ""
                  }`}
                onClick={() => setActiveTab("create_event")}
              >
                <p>Create Event</p>
              </div>
              <div
                className={`tab-element${activeTab === "create_ticket" ? " activ-tab" : ""
                  }`}
                onClick={() => setActiveTab("create_ticket")}
              >
                <p>Create Tickets</p>
              </div>
              <div
                className={`tab-element${activeTab === "get_ticket" ? " activ-tab" : ""
                  }`}
                onClick={() => setActiveTab("get_ticket")}
              >
                <p>Get Tickets</p>
              </div>
              <div
                className={`tab-element${activeTab === "mint_ticket" ? " activ-tab" : ""
                  }`}
                onClick={() => setActiveTab("mint_ticket")}
              >
                <p>Mint Tickets</p>
              </div>
            </div>
            {data && showQR ? (
              <QrModal2
                qr_png={data.xummData.data.refs.qr_png}
                uuid={data.xummData.data.uuid}
                closeModal={() => setShowQR(false)}
              />
            ) : (
                <>
                  {activeTab === "create_event" && (
                    <MintModalInput
                      setDate={setDate}
                      setDescription={setDescription}
                      setLocation={setLocation}
                      setFile={setFile}
                      setEventName={setName}
                      file={file}
                      message={message}
                    />
                )}
                {activeTab === "create_ticket" && (
                  <div>
                    <label>TicketCount</label>
                    <TextInput
                      type="text"
                      placeholder="TicketCount"
                      textChange={(e) => setTicketCount(e.target.value)}
                    />
                  </div>
                )}
                {activeTab === "get_ticket" && (
                  <CustomTable
                    items={fetchedTickets}
                    tableHeads={tableHeads}
                    tableClickHandler={tableClickHandler}
                  />
                )}
                {activeTab === "mint_ticket" && (
                  <p><b>Batch minting coming soon <a href="https://xrpl.org/batch-minting.html">Xrpl docs</a></b></p>
                )}
              </>
            )}
          </div>

          <div className="footer">
            {activeTab === "create_ticket" && <button onClick={() => createTickets()}>Create Tickets</button>}
            {activeTab === "get_ticket" && (
              <>
                {fetchedTickets?.length > 0 ? (
                  <>
                    <p>You have <b>{fetchedTickets.length} tickets</b></p>
                    <button onClick={() => setActiveTab("mint_ticket")}>Mint Tickets</button></>
                ) : (
                  <button onClick={() => getTickets()}>
                    Get Tickets
                  </button>
                )}
              </>
            )}
          </div>
          {activeTab === "create_event" &&

            <div className="footer">
              <button id="cancelBtn" onClick={() => navigate("/")}>
              Cancel
            </button>
            <button onClick={activateMinting}>Continue</button>
            </div>}
        </div>
      </div>
    </>
  );
};

export default Create;
