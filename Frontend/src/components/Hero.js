import React, { useState, useEffect } from "react";
import "../styles/Hero.css";
import { useNavigate } from "react-router-dom";

import BarramundiFish from "../assets/models/BarramundiFish.glb";

const Hero = () => {
  let navigate = useNavigate();

  const goExplore = () => {
    navigate("/explore");
  };
  const goCreate = () => {
    navigate("/create");
  };

  return (
    <div
      id="hero"
      style={{
        backgroundImage: `url("https://images.unsplash.com/photo-1638913974023-cef988e81629?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80")`,
      }}
    >
      <div id="header-text-first"> Eventify</div>
      <div id="header-subtext">Host, Plan and Manage Events Easily</div>
      <div id="header-summary">
        Customizable event pages, Ticketing and Registration services, Payment
        processing, analytics and Reporting, and more
      </div>

      <div id="hero-buttons">
        <button id="explore" onClick={goExplore}>
          Explore
        </button>
        <button id="create" onClick={goCreate}>
          Create
        </button>
      </div>
    </div>
  );
};

export default Hero;
