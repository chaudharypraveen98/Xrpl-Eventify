import React, { useState, useEffect } from "react";
import axios from "axios";
import CardList from "../components/CardList";
import { exploreList } from "../constants/MockupData";
import "../styles/Explore.css";
import Header from "../components/Header";
import Search from "../components/Search";
import BurnModal from "../components/BurnModal";
import CustomTable from "../components/base/Table";
const Explore = () => {
  const wallet = JSON.parse(localStorage.getItem("wallet"));
  const [search, setSearch] = useState(wallet);
  const tableHeads = [
    "Cancel - Delete",
    // "Sell Order",
    "NFTokenID",
    "Src",
    "Issuer",
    "NFTokenTaxon",
  ];
  const importedSearchResults = JSON.parse(
    localStorage.getItem("searchResults")
  );
  const importedExploreListXrpl = JSON.parse(
    localStorage.getItem("exploreListXrpl")
  );
  const [searchResults, setSearchResults] = useState(
    importedSearchResults
      ? importedSearchResults
      : {
        results: [],
        showButtons: false,
      }
  );
  const [exploreListXrpl, setExploreListXrpl] = useState(
    importedExploreListXrpl ? importedExploreListXrpl : []
  );

  const [openBurnModal, setOpenBurnModal] = useState({
    show: false,
    idValue: "",
  });

  function showBurnModal(nftIndex) {
    setOpenBurnModal({
      show: true,
      idValue: searchResults.results[nftIndex].NFTokenID,
    });
  }
  function hex_to_ascii(str1) {
    var hex = str1.toString();
    var str = "";
    for (var n = 0; n < hex.length; n += 2) {
      str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }
    return str;
  }

  const tableClickHandler = (row = 0, column = 0) => {
    if (column === 0) {
      showBurnModal(row);
    } else {
      if (column === 1) {
        let body = {
          account: search,
          nft_id: searchResults.results[row].NFTokenID
        };
        axios.post("/api/getTokenInfo", { metadata: body }).then((res) => {
          console.log("res adta", res.data)
        })
          .then((err) => {
            console.log("yoken error", err)
          })
      }
    }
  };
  useEffect(() => {
    if (wallet && search && !importedExploreListXrpl && !importedSearchResults) {
      console.log("why calling")
      activateSearch();
    } else {
      console.log("good going")
    }
  }, []);

  useEffect(() => {
    setSearch(wallet);
  }, [wallet]);

  async function activateSearch() {
    let body = {
      account: search,
    };
    axios.post("/api/getTokensFromLedger", { metadata: body }).then((res) => {
      let decodedData = [];
      res?.data?.forEach((nft, index) => {
        nft.Src = hex_to_ascii(nft?.URI);
        decodedData.push({
          name: `Test NFT #${index}`,
          description:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
          src: hex_to_ascii(nft?.URI),
        });
      });
      localStorage.setItem("exploreListXrpl", JSON.stringify(decodedData));
      localStorage.setItem(
        "searchResults",
        JSON.stringify({ results: res?.data, showButtons: true })
      );
      setExploreListXrpl(decodedData);

      setSearchResults({ results: res?.data, showButtons: true });
    });
  }
  return (
    <div id="explore">
      <Header />
      {openBurnModal.show && (
        <div className="overlayModalContainer">
          <BurnModal
            closeModal={() => {
              setOpenBurnModal({ show: false, idValue: "" });
            }}
            idValue={openBurnModal.idValue}
          />
        </div>
      )}

      <Search
        textChange={(event) => setSearch(event.target.value)}
        iconClick={activateSearch}
      />
      <div className="table-title">
        <h3>Your Created Events</h3>
      </div>
      <div id="list-container">
        <CardList list={exploreListXrpl ? exploreListXrpl : exploreList} />
      </div>
      <div className="table-title">
        <h3>MANAGE Events</h3>
      </div>
      {searchResults.results.length > 0 ? (
        <div className="result-table-nft-container">
          <div className="result-table-nft">
            <CustomTable
              items={searchResults.results}
              tableHeads={tableHeads}
              tableClickHandler={tableClickHandler}
            />
          </div>
        </div>
      ) : (
        <h2 style={{ textAlign: 'center', color: 'white' }}>No NFTs exist for this account.</h2>
      )}
    </div>
  );
};

export default Explore;
