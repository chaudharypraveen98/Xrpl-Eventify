import React, { useState, useEffect } from "react";
import api from "../services";
import CardList from "../components/CardList";
import { exploreList } from "../constants/MockupData";
import "../styles/Explore.css";
import Header from "../components/Header";
import Search from "../components/Search";
import BurnModal from "../components/BurnModal";
import CustomTable from "../components/base/Table";
import { activateSearch, getNftMetaData } from "../services/nftServices";
import { toast } from "react-toastify";
import { Colors } from "../constants/Colors";
import Button from "../components/base/Button";
const Explore = () => {
  const wallet = JSON.parse(localStorage.getItem("wallet"));
  const [search, setSearch] = useState(wallet);
  const tableHeads = [
    "Cancel - Delete",
    // "Sell Order",
    "NFTokenID",
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


  const tableClickHandler = (row = 0, column = 0) => {
    if (column === 0) {
      showBurnModal(row);
    } else {
      if (column === 1) {
        let body = {
          account: search,
          nft_id: searchResults.results[row].NFTokenID
        };
        api.post("/api/getTokenInfo", { metadata: body }).then((res) => {
          console.log("res adta", res.data)
        })
          .catch((err) => {
            console.log("yoken error", err)
          })
      }
    }
  };
  const fetchDataFromService = async () => {
    toast.info('🦄 Connecting to Ledger....', {
      position: "bottom-right"
    });
    const searchedData = await activateSearch(search)
    toast.info('🦄 "Fetched Nfts from ledger. Getting metadata from IPFS.."', {
      position: "bottom-right"
    });
    await getNftMetaData(searchedData);
    toast.success('🦄 "Success"', {
      position: "bottom-right"
    });
    if (searchedData?.length < 1) {
      toast.error('🦄 No Nft Found', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }
  useEffect(() => {
    if (wallet && search && !importedExploreListXrpl && !importedSearchResults) {
      console.log("why calling")
      void fetchDataFromService()
    } else {
      console.log("good going")
    }
  }, []);

  useEffect(() => {
    setSearch(wallet);
  }, [wallet]);

  const clearStorage = () => {
    localStorage.removeItem("exploreListXrpl");
    localStorage.removeItem("searchResults");
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
        iconClick={() => activateSearch(search)}
      />
      <div style={{ textAlign: 'center', width: "100%", marginTop: 10 }}>
        <Button
          width="150px"
          height="30px"
          textContent="Fetch Latest Nfts"
          color={Colors.buttons.secondary}
          onClick={() => fetchDataFromService()}
        />
        <Button
          width="150px"
          height="30px"
          textContent="View Latest/Refresh"
          color={Colors.buttons.secondary}
          onClick={() => window.location.reload()}
        />
      </div>

      <div className="table-title">
        <h3>Your Created Events</h3>
      </div>
      <div id="list-container">
        <CardList list={exploreListXrpl ? exploreListXrpl : exploreList} />
      </div>
      <div className="table-title">
        <h3>MANAGE Events</h3>
      </div>
      {searchResults?.results?.length > 0 ? (
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
