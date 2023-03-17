import React ,{ useState, useEffect }from "react";
import { toast } from "react-toastify";

import "./AddressModal.css";
import TextInput from "./base/TextInput";

function AddressModal({ closeModal }) {
    const [walletAddress, setWalletAddress] = useState("");
    const saveAddress = () => {
        console.log("saving in local")
        localStorage.setItem('wallet', JSON.stringify(walletAddress));
        toast.success('🦄 "successfully saved address"', {
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
                    <TextInput type="text" placeholder ="Enter r-address" textChange={(e)=>setWalletAddress(e.target.value)}/>
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
