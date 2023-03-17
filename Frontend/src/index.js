import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { About } from "./components/About";
import { Dashboard } from "./components/Dashboard";
import Home from "./pages/Home";
import Create from "./pages/Create";
import Explore from "./pages/Explore";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//dapp
import { DAppProvider } from "@usedapp/core";
import NFTDetail from "./pages/NFTDetail";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<DAppProvider config={{}}><Home /></DAppProvider>} />
      <Route path="/create" element={<DAppProvider><Create /></DAppProvider>} />
      <Route path="/explore" element={<DAppProvider config={{}}><Explore /></DAppProvider>} />
      <Route path="/detail" element={<DAppProvider config={{}}><NFTDetail /></DAppProvider>} />
      <Route path="/About" element={<About />} />
    </Routes>
    <ToastContainer position="bottom-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light" 
      />
  </BrowserRouter>
  //</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
