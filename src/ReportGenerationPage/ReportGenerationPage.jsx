import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./ReportGenerationPage.css";

const ReportGenerationPage = () => {

    const location = useLocation();
    const { crop, cropVariant, previousCrop, soilType, irrigation, fertilizer, acres } = location.state || {};
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const prompt = `
                You are an AI assistant specialized in agricultural analysis. Your task is to create a comprehensive soil and crop assessment report for farmers. The report should include a suitability score, key observations, and actionable recommendations based on the provided user input. Ensure the report is easy to understand, using simple language and avoiding technical jargon. The response should be accurately generated based on the user input, not copied from the sample response.

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

                Generate a detailed report with the following sections:

                1. **Suitability Score**: Provide a precise score out of 10 based on factors such as soil type, crop suitability, fertilizer efficiency, climate compatibility, and irrigation method. Example: 7.8/10.

                2. **Overview**: A brief summary of the soil and crop compatibility based on the provided inputs, highlighting key suitability and challenges.

                3. **Key Observations**: Detailed observations regarding soil texture, nutrient availability, moisture retention, drainage capacity, and compatibility with the selected crop.

                4. **Assessments**: A scientific assessment including potential yield percentage compared to optimal conditions, average expected production per acre (in kg/tons), and limitations caused by soil or climate factors.

                5. **Soil and Weather Analysis**: An analytical breakdown of soil composition, pH range, organic matter percentage, and how local weather patterns (average rainfall, temperature variations, etc.) affect crop growth.

                6. **Fertilizer Evaluation**: Analysis of how well the selected fertilizer meets crop nutrient demands, NPK ratio balance, and additional recommended amendments for optimal growth.

                7. **Farming Recommendations**: Best agronomic practices to improve yield, soil health, and irrigation efficiency. Includes ideal planting depth, spacing, and disease prevention strategies.

                8. **Suggested Farming Method**: A tailored farming method recommendation based on land size, soil type, and irrigation method, such as precision farming, crop rotation, or organic techniques.

                9. **Alternative Crops**: If the selected crop has moderate or poor suitability, suggest better alternative crops that align with soil conditions and climate.

                10. **Recommendations**: Data-backed action points such as ideal fertilizer dosage (in kg per acre), irrigation frequency (times per week), pest control measures, and expected yield improvement percentages if recommended changes are implemented.

                Ensure the report is clear, concise, and provides actionable insights for the farmer.
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

            console.log("Parsed API Response:", data.response);

            setData(data.response);

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
        if (crop && cropVariant && previousCrop && soilType && irrigation && fertilizer && acres) {
            callApi();
        }
    }, [crop, cropVariant, previousCrop, soilType, irrigation, fertilizer, acres]);

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
