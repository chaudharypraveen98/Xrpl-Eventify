import React ,{ useState, useEffect }from "react";
import { toast } from "react-toastify";
import { activateSearch } from "../services/nftServices";

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
        const [decodedData, searchData] = await activateSearch(walletAddress)
        toast.success('🦄 "successfully saved address. Refresh!!"', {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
        closeModal(false)
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
                    <TextInput type="text" placeholder="Enter r-address" textChange={(e) => setWalletAddress(e.target.value)} text={walletAddress} />
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
