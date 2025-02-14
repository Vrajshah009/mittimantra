import * as React from 'react';
import { useNavigate } from "react-router-dom";
import './Personalize.css';
import { AnimatePresence, motion } from 'framer-motion';

const Personalize = () => {
  const navigate = useNavigate();

  const [selected, setSelected] = React.useState({
    crop: '',
    cropVariant: '',
    previousCrop: '',
    soilType: '',
    irrigation: '',
    fertilizer: '',
    acres: ''
  });

  const [step, setStep] = React.useState(0);

  const fields = [
    { label: 'Crop:', name: 'crop' },
    { label: 'Crop Variant:', name: 'cropVariant' },
    { label: 'Previous Crop:', name: 'previousCrop' },
    { label: 'Soil Type:', name: 'soilType' },
    { label: 'Irrigation:', name: 'irrigation' },
    { label: 'Fertilizer:', name: 'fertilizer' },
    { label: 'Acres:', name: 'acres' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelected((prevSelected) => ({
      ...prevSelected,
      [name]: value
    }));
  };

  const handleNext = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (step < fields.length - 1) {
        setStep(step + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleSubmit = () => {
    navigate("/report", { state: selected });
  };

  const variants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 }
  };

  return (
    <div className='personalize-page'>
      <div className='personalize-heading'>Personalize your Report</div>
      <span style={{
        color: "white",
        fontWeight: "300"
      }}>
        Fill the following form to get your agriculture report.
      </span>
      <form className='personalize-form'
        style={{ backdropFilter: "blur(10px)" }}
        onSubmit={(e) => e.preventDefault()}
      >
        <AnimatePresence exitBeforeEnter>
          <motion.div
            key={step}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}
          >
            <div className='input-group'>
              <label>{fields[step].label}</label>
              <input
                type='text'
                name={fields[step].name}
                value={selected[fields[step].name]}
                onChange={handleChange}
                onKeyDown={handleNext}
                autoFocus
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </form>
      <div className='button-container'>
        {step === fields.length - 1 && (
          <div className='button' onClick={handleSubmit}>
            Submit
          </div>
        )}
      </div>
    </div>
  );
}

export default Personalize;