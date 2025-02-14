import { useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom"; // Ensure HomePage.jsx is correctly recognized
import HomePage from "./HomePage/HomePage.jsx";
import UserInputPage from "./UserInputPage/UserInputPage.jsx";
import ReportGenerationPage from "./ReportGenerationPage/ReportGenerationPage.jsx";
import GeoLocationPage from "./GeoLocationPage/GeoLocationPage.jsx";
import Personalize from "./Personalize/Personalize.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/location" element={<GeoLocationPage />} />
        <Route path='/personalize' element={<Personalize />} />
        <Route path="/user-input" element={<UserInputPage />} />
        <Route path="/report" element={<ReportGenerationPage />} />
      </Routes>
    </>
  );
}

export default App;
