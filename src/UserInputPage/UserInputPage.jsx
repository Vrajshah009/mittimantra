import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './UserInputPage.css';

const categories = {
  Crops: ["rice", "wheat", "barley", "tobacco"],
  Soil: ["alluvial", "red", "black", "desert"],
  Fertilizer: ["urea", "dap", "npk", "ssp"],
  Irrigation: ["drip", "sprinkler", "surface", "sub-surface"],
  AreaSize: ["1-5", "5-10", "10+"]
};

const UserInputPage = () => {
  const [selected, setSelected] = useState({
    Crop: null,
    Soil: null,
    Fertilizer: null,
    Irrigation: null,
    AreaSize: null
  });

  const navigate = useNavigate();

  const handleSelect = (category, option) => {
    setSelected((prev) => ({ ...prev, [category]: option }));
  };

  const handleSubmit = () => {
    navigate("/report", { state: selected });
  };

  return (
    <div className='userinput-page'>
      <div className='userinputpage-heading'>Personalized your Report</div>
      {Object.entries(categories).map(([category, options]) => (
        <div className='categories' key={category}>
          <div className='category'>
            <div className='opts-title'>Select {category}</div>
            <div className='opts'>
              {options.map((option) => (
                <div>
                  <img src={`src/UserInputPage/Images/${category}/${option}.svg`} />
                  <div
                    className='opt'
                    key={option}
                    onClick={() => handleSelect(category, option)}
                  >
                    {option}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
      <div>
        <h3>Selected Options:</h3>
        <pre>{JSON.stringify(selected, null, 2)}</pre>
        <button
          onClick={handleSubmit}
          disabled={!Object.values(selected).every((value) => value !== null)}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default UserInputPage;