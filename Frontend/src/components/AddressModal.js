import React ,{ useState, useEffect }from "react";
import { toast } from "react-toastify";
import { activateSearch, getNftMetaData } from "../services/nftServices";

import "./AddressModal.css";
import TextInput from "./base/TextInput";

function AddressModal({ closeModal }) {
    const wallet = JSON.parse(localStorage.getItem("wallet"));
    const [walletAddress, setWalletAddress] = useState(wallet);
    const saveAddress = async () => {
        localStorage.removeItem("exploreListXrpl");
        localStorage.removeItem("searchResults");
        console.log("saving in local")
        localStorage.setItem('wallet', JSON.stringify(walletAddress));
        toast.success('🦄 "successfully saved address. Fetching nfts..."', {
            position: "bottom-right"
        });
        closeModal(false)
        const searchedData = await activateSearch(walletAddress)
        toast.info('🦄 "Fetched Nfts from ledger. Getting metadata from IPFS.."', {
            position: "bottom-right"
        });
        await getNftMetaData(searchedData);
        toast.success('🦄 "Success"', {
            position: "bottom-right"
        });
    }
    console.log("walletAddress",walletAddress)
    return (
        <div className="addressBackground">
            <div className="addressContainer">
                <div className="titleCloseBtn">
                    <button onClick={() => closeModal(false)}> X </button>
                </div>

                <div className="title"></div>

                <div className="body">
                    <TextInput type="text" placeholder="Enter r-address" textChange={(e) => setWalletAddress(e.target.value)} text={walletAddress} maxLength={50} />
                </div>

                <div className="footer">
                    <button id="cancelBtn" onClick={() => closeModal(false)}>
                        Cancel
                    </button>
                    <button onClick={saveAddress}>Save Address</button>
                </div>
            </div>
        </div>
    );
}

export default AddressModal;