import { useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom"; // Ensure HomePage.jsx is correctly recognized
import HomePage from "./HomePage/HomePage.jsx";
import UserInputPage from "./UserInputPage/UserInputPage.jsx";
import ReportGenerationPage from "./ReportGenerationPage/ReportGenerationPage.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/location" element={<Geolocation />} />
        <Route path="/user-input" element={<UserInputPage />} />
        <Route path="/report" element={<ReportGenerationPage />} />
      </Routes>
    </>
  );
}

export default App;
