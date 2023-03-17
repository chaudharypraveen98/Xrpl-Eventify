import React, { useContext,useState,useEffect } from "react";
import { Link } from "react-router-dom";
// import { useEthers, useEtherBalance } from "@usedapp/core";
import AddressModal from "./AddressModal";

const Header = () => {

    // Meta mask
    // const {activateBrowserWallet, account} = useEthers();
    // const etherBalance = useEtherBalance(account);

    // const handleWallet = () => {
    //   activateBrowserWallet();

    // }
    const [openAddressModal, setOpenAddressModal] = useState(false);
    const wallet = JSON.parse(localStorage.getItem('wallet'));
    const [show, setShow] = useState(true);
    // const [lastScrollY, setLastScrollY] = useState(0);

  const controlNavbar = () => {
    if (typeof window !== 'undefined') { 
      if (window.scrollY > 100) { // if scroll down hide the navbar
        setShow(false); 
      } else { // if scroll up show the navbar
        setShow(true);  
      }

      // remember current page location to use in the next move
      // setLastScrollY(window.scrollY); 
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);

      // cleanup function
      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, []);
  // }, [lastScrollY]);


    return (
        <div id="header" style={{position:show?'relative':'fixed'}}>
        <Link to='/' id='logo'>Eventify</Link>

        <div id="link-containers">
          <Link to='/create'>Create Event</Link>
          <Link to='/explore'>Explore</Link>
          <button id="connect-wallet" onClick={()=>setOpenAddressModal(!openAddressModal)} >{!wallet ? 'Enter Wallet' : wallet}</button>
          {openAddressModal &&
          <AddressModal closeModal={()=>setOpenAddressModal(false)} />
          }
          

          {/* <button id="connect-wallet" onClick={handleWallet} >{!account ? 'Connect Wallet' : account}</button> */}
        </div>
      </div>
    );
}

export default Header;