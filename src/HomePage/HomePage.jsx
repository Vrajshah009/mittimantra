import React, { useState, useEffect } from "react";
import "./HomePage.css";

const HomePage = () => {

  const redirectToLocation = () => {
    window.location.href = "/location";
  };
  
  return (
    <div className="homepage">
      <div className="navbar">
       <div className="navname">
          <img src='src\HomePage\logo1.png' alt="Logo" className="logo-img"/>
      </div>
      </div>
      <div className="hero-section">
        <div className="hero-section-text">
          <img src="src\HomePage\Frame 199.svg" alt="" className="orginal-img" />
          <div className="hero-section-heading-yellow">Agriculture Matters</div>
          <div className="hero-section-heading">Good Production</div>
          <p className="hero-section-description">MittiMantra is an AI-powered platform that provides real-time soil insights and optimized farming recommendations, eliminating manual testing through machine learning and geo-intelligence.</p>
          <div onClick={redirectToLocation} className="button">DISCOVER MORE</div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
