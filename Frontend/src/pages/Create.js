import React, { useEffect, useState } from "react";
import axios from "axios";
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
  const [data, setData] = useState(null);
  const [showQR, setShowQR] = useState(false);

  function activateMinting() {
    if (date === "" || location === "" || description === "" || file === null) {
      setMessage("Please fill out the entire form");
    }
    var bodyFormData = new FormData();
    bodyFormData.append('date', date);
    bodyFormData.append('location', location);
    bodyFormData.append('description', description);
    bodyFormData.append('file', file);
    bodyFormData.append('filename', file?.name);
    axios({
      method: "post",
      url: "/api/xummMintV1",
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" }
    })
      .then((res) => {
        console.log("xumm data coming");
        console.log(res);
        setData({ xummData: res });
        setShowQR(true)
      });
  }

  return (
    <>
      <Header />
      <div className="modalMintBackground" style={{
        backgroundImage: `url("https://images.unsplash.com/photo-1573221566340-81bdde00e00b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80")`
      }}>
        <div className="modalMintContainer">
          <div className="title"></div>
          <div className="modal-body">
            {data && showQR ? (
              <QrModal2
                qr_png={data.xummData.data.refs.qr_png}
                uuid={data.xummData.data.uuid}
                closeModal={() => setShowQR(false)}
              />
            ) : (
              <MintModalInput
                setDate={setDate}
                setDescription={setDescription}
                setLocation={setLocation}
                setFile={setFile}
                file={file}
                message={message}
              />
            )}
          </div>

          <div className="footer">
            <button id="cancelBtn"
            // onClick={() => closeModal(false)}
            >
              Cancel
            </button>
            <button onClick={activateMinting}>Continue</button>
          </div>
        </div>
      </div></>
  );
};

export default Create;
