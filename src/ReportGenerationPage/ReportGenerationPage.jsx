import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./ReportGenerationPage.css";
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const fetchWeatherData = async () => {
    const apiKey = "c4eba89c97fc09fc1a233d28ca043b4e";
    const lat = 22.554029;
    const lon = 72.948936;
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`);
    const data = await response.json();
    return data.list.map(entry => ({
        temperature: entry.main.temp,
        humidity: entry.main.humidity,
        pressure: entry.main.pressure,
        time: entry.dt_txt
    }));
};


const ReportGenerationPage = () => {

    const location = useLocation();
    const { crop, cropVariant, previousCrop, soilType, irrigation, fertilizer, acres } = location.state || {};
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const [weatherData, setWeatherData] = useState([]);

    const prompt = `
You are an AI assistant specialized in agricultural analysis. Your task is to create a comprehensive soil and crop assessment report for farmers in the following JSON format. The report should be accurately generated based on the user input and provide actionable insights. Ensure the response is written in simple, farmer-friendly language, avoiding technical jargon.

User Input:
{
  "soil_type": "${soilType}",
  "crop": "${crop}",
  "crop_variant": "${cropVariant}",
  "previous_crop": "${previousCrop}",
  "selected_fertilizer": "${fertilizer}",
  "irrigation_method": "${irrigation}",
  "area_size": "${acres} acres"
}

Generate the response in the following JSON format:

{
  "score": "Provide a suitability score out of 10 in this format: 'The suitability score for growing ${crop} in your ${acres} of ${soilType} is X.X/10.'",
  "overview": "Summarize the overall suitability of the provided soil, crop, and conditions in 1-2 sentences.",
  "key_observations": "Highlight key observations about soil texture, nutrient availability, and crop compatibility in 2-3 sentences.",
  "assessments": "Provide potential yield percentage compared to optimal conditions, average expected yield per acre, and any soil or climate-related limitations.",
  "soil_and_weather_analysis": "Analyze soil composition, pH range, organic matter percentage, and how local weather affects crop growth.",
  "fertilizer_evaluation": "Evaluate the selected fertilizer's effectiveness and recommend additional nutrients or amendments if needed.",
  "farming_recommendation": "Provide recommendations on planting depth, spacing, irrigation frequency, and disease prevention strategies.",
  "suggested_farming_method": "Recommend a farming method based on the farm size, irrigation method, and soil type.",
  "alternative_crops": "Suggest 1-2 alternative crops if the selected crop is not highly suitable, explaining why they may be better options.",
  "recommendations": "List specific actionable steps for fertilizer dosage, irrigation frequency, pest control, and expected yield improvements."
}
Ensure the response is concise, clear, and provides practical advice for farmers. Generate only the JSON object without any additional text.
`;

    const callApi = async () => {
        setLoading(true);
        setError(null);

        try {

            console.log("API has been called");

            const response = await fetch("http://localhost:11434/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "mistral",
                    prompt: prompt,
                    stream: false
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to call API");
            }

            const data = await response.json();


            // console.log("Raw API Response:", data);
            console.log("Parsed API Response:", (data.response));

            const parsedData = JSON.parse(data.response);

            setData(parsedData);

            // Clear the state to prevent repeated API calls
            location.state.crop = null;
            location.state.cropVariant = null;
            location.state.soilType = null;
            location.state.irrigation = null;
            location.state.fertilizer = null;
            location.state.acres = null;

        } catch (error) {
            console.error("Error calling API:", error.message);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {

        const fetchWeather = async () => {
            const weatherData = await fetchWeatherData();
            setWeatherData(weatherData);
        };

        fetchWeather();

        if (crop && cropVariant && previousCrop && soilType && irrigation && fertilizer && acres) {
            callApi();
        }

        return () => {
            // Destroy all charts to avoid canvas reuse error
            Object.values(Chart.instances).forEach(instance => {
                if (instance) {
                    instance.destroy();
                }
            });
        };
    }, [crop, cropVariant, previousCrop, soilType, irrigation, fertilizer, acres]);

    if (loading) {
        return (
            <div className="app-container">
                <h1>Soil & Crop Assessment</h1>
                <p>Generating report...</p>
            </div>
        );
    }

    const weatherChartData = {
        labels: weatherData.map(entry => entry.time),
        datasets: [
            {
                label: 'Temperature (K)',
                data: weatherData.map(entry => entry.temperature),
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            },
            {
                label: 'Humidity (%)',
                data: weatherData.map(entry => entry.humidity),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            },
            {
                label: 'Pressure (hPa)',
                data: weatherData.map(entry => entry.pressure),
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 1
            }
        ]
    };

    return (
        <div className="app-container">
            <h1>Soil & Crop Assessment</h1>

            {/* {error && (
                <div className="error-container">
                    <h2>Error: {error}</h2>
                </div>
            )} */}

            {data && (
                <div className="parsed-data-container">
                    <h3>Summary (सारांश/સારાંશ)</h3>
                    <p><strong>Score (अंक/આંક): </strong> {data['score']}</p>
                    <p><strong>Overview (सिंहावलोकन/વિહંગાવલોકન): </strong> {data['overview']}</p>
                    <p><strong>Assessments (आकलन/આકારણીઓ): </strong> {data['assessments']}</p>
                    <p><strong>Key Observations (मुख्य टिप्पणियाँ/મુખ્ય અવલોકનો): </strong> {data['key_observations']}</p>
                    <p><strong>Soil and weather analysis (मिट्टी एवं मौसम विश्लेषण/જમીન અને હવામાન વિશ્લેષણ): </strong> {data['soil_and_weather_analysis']}</p>
                    <p><strong>Fertilizer Evaluation (उर्वरक मूल्यांकन/ખાતર મૂલ્યાંકન): </strong> {data['fertilizer_evaluation']}</p>
                    <p><strong>Farming recommendation (खेती की सिफ़ारिश/ખેતીની ભલામણ): </strong> {data['farming_recommendation']}</p>
                    <p><strong>Alternative Crops (वैकल्पिक फसलें/વૈકલ્પિક પાક): </strong> {data['alternative_crops']}</p>
                    <p><strong>Recommendations (सिफारिशों/ભલામણો): </strong> {data['recommendations']}</p>
                    {weatherData.length > 0 && (
                        <div>
                            <h3>Weather Details</h3>
                            <Line
                                key="weather_chart"
                                data={weatherChartData}
                                options={{ responsive: true }}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ReportGenerationPage;
