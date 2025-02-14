import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const ReportGenerationPage = () => {

    const location = useLocation();
    const { crop, soil, fertilizer, irrigationMethod, weather, Season, AreaSize, Location } = location.state || {};
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const prompt = `You are a chatbot working as an analyst for farmer issues. Create a detailed soil and crop assessment report with a suitability score, key observations, and recommendations. Ensure the score and all other details are evaluated based on the given user input (e.g., soil type, crop, fertilizer, location, etc.). The response should be easy to understand for farmers, using simple language and avoiding technical jargon. Do not add any extra information beyond the required fields. The response should be accurately generated based on the user input, not copied from the sample response.

User Input:
{
  "soil_type": ${soil},
  "crop": ${crop},
  "selected_fertilizer": ${fertilizer},
  "irrigation_method": ${irrigationMethod},
  "location": ${Location},
  "area_size": ${AreaSize},
  "season": ${Season}"
}

Sample Response:
{
  "score": "A precise score out of 10 based on soil type, crop suitability, fertilizer efficiency, climate compatibility, and irrigation method like 7.8/10",
  "overview": "A brief summary of the soil and crop compatibility based on the provided inputs, highlighting key suitability and challenges.",
  "key_observations": "Detailed observations regarding soil texture, nutrient availability, moisture retention, drainage capacity, and compatibility with the selected crop.",
  "assessments": "A scientific assessment including potential yield percentage compared to optimal conditions, average expected production per acre (in kg/tons), and limitations caused by soil or climate factors.",
  "soil_and_weather_analysis": "An analytical breakdown of soil composition, pH range, organic matter percentage, and how local weather patterns (average rainfall, temperature variations, etc.) affect crop growth.",
  "fertilizer_evaluation": "Analysis of how well the selected fertilizer meets crop nutrient demands, NPK ratio balance, and additional recommended amendments for optimal growth.",
  "farming_recommendation": "Best agronomic practices to improve yield, soil health, and irrigation efficiency. Includes ideal planting depth, spacing, and disease prevention strategies.",
  "suggested_farming_method": "A tailored farming method recommendation based on land size, soil type, and irrigation method, such as precision farming, crop rotation, or organic techniques.",
  "alternative_crops": "If the selected crop has moderate or poor suitability, suggest better alternative crops that align with soil conditions and climate.",
  "recommendations": "Data-backed action points such as ideal fertilizer dosage (in kg per acre), irrigation frequency (times per week), pest control measures, and expected yield improvement percentages if recommended changes are implemented."
}

`;

    // const parse = (data) => {
    //     const parsedData = `{${data}}`.replace(/'/g, '"');
    //     const dataObject = JSON.parse(parsedData);
    //     setData(dataObject);
    // };

    useEffect(() => {
        if (crop && soil && fertilizer && irrigationMethod && weather && Location && Season && AreaSize) {
            callApi();
        }
    }, [crop, soil, fertilizer, irrigationMethod, weather, Location, Season, AreaSize]);

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
            console.log("Parsed API Response:", JSON.parse(data.response));

            const parsedData = JSON.parse(data.response);

            setData(parsedData);

        } catch (error) {
            console.error("Error calling API:", error.message);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // const formatRecommendations = (text) => {
    //     if (!text) return null;
    //     const formatted = text
    //         .replace('To optimize crop yield, consider the following recommendations:', '')
    //         .split(/\d+\./)
    //         .filter(Boolean)
    //         .map((item, index) => (
    //             <li key={index}>{item.trim()}</li>
    //         ));
    //     return <ul>{formatted}</ul>;
    // };

    if (loading) {
        return (
            <div className="app-container">
                <h1>Soil & Crop Assessment</h1>
                <p>Generating report...</p>
            </div>
        );
    }

    return (
        <div className="app-container">
            <h1>Soil & Crop Assessment</h1>
            <p>Click the button below to generate the report.</p>

            <button onClick={callApi} disabled={loading}>
                {loading ? "Generating..." : "Generate Report"}
            </button>

            {error && (
                <div className="error-container">
                    <h2>Error: {error}</h2>
                </div>
            )}

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
                </div>
            )}
        </div>
    );
};

export default ReportGenerationPage;
