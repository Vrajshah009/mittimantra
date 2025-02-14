import React, { useState } from 'react';
import "./UserInputPage.css";
import { useNavigate } from "react-router-dom";

const categories = {
  Crop: ["Wheat", "Rice", "Corn", "Barley"],
  Soil: ["Loamy", "Clayey", "Sandy", "Silty"],
  Fertilizer: ["Urea", "DAP", "NPK", "Compost"],
  Irrigation: ["Drip", "Sprinkler", "Surface", "Subsurface"],
  Season: ["Rabi", "Kharif", "Zaid"],
  AreaSize: ["Small (1-5 acres)", "Medium (5-20 acres)", "Large (20+ acres)"],
  Location: ["Desert", "Forest", "Plains", "Mountains"]
};

const UserInputPage = () => {
  const [formData, setFormData] = useState({
    crop: "",
    soil: "",
    fertilizer: "",
    irrigationMethod: "",
    weather: "",
    location: "",
    size: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = () => {
    navigate("/report", { state: selected });
  };

  const [selected, setSelected] = useState({
    Crop: null,
    Soil: null,
    Fertilizer: null,
    Irrigation: null,
    Season: null,
    AreaSize: null,
    Location: null
  });

  const handleSelect = (category, option) => {
    setSelected((prev) => ({ ...prev, [category]: option }));
  };

  return (
    <div className="p-8 bg-gray-900 text-white min-h-screen flex flex-col gap-6">
      <h2 className="text-3xl font-bold text-center">Select Options</h2>
      {Object.entries(categories).map(([category, options]) => (
        <div key={category} className="mb-4">
          <h3 className="text-xl font-semibold">{category}</h3>
          <div className="flex gap-4 mt-2">
            {options.map((option) => (
              <button
                key={option}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${selected[category] === option
                  ? "bg-yellow-500 text-black shadow-lg scale-105"
                  : "bg-gray-700 hover:bg-gray-600"
                  }`}
                onClick={() => handleSelect(category, option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}
      <div className="mt-6 p-4 bg-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold">Selected Options:</h3>
        <pre className="text-yellow-400">{JSON.stringify(selected, null, 2)}</pre>
        <button
          onClick={handleSubmit}
          className={`mt-4 px-6 py-2 rounded-lg ${Object.values(selected).every((value) => value !== null) ? "bg-green-500 text-black" : "bg-gray-500 text-gray-300 cursor-not-allowed"}`}
          disabled={!Object.values(selected).every((value) => value !== null)}
        >
          Submit
        </button>

      </div>
    </div >
  );
}

export default UserInputPage;