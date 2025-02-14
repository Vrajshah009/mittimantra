import React, { useState, useEffect } from 'react';

const HomePage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rawData = `'score': '7.5 out of 10', 'key_observations': 'The Sandy Soil in Gujarat has good drainage properties but tends to be low in nutrients, which is ideal for cotton growth as it prefers well-drained soils. However, the sandy nature of the soil may require more frequent irrigation due to its higher water requirements.', 'recommendations': 'To optimize crop yield, consider the following recommendations: 1. Use a balanced NPK fertilizer in accordance with the recommended dosage for cotton cultivation in Sandy Soil. This will provide essential nutrients required by the crop. 2. Given the sandy nature of the soil and the higher water requirements of cotton, it is advisable to use Sprinkler Irrigation to ensure adequate moisture levels are maintained throughout the growing season. 3. Monitor soil moisture regularly and adjust irrigation schedules as needed to prevent overwatering or underwatering. 4. Consider incorporating organic matter such as compost or farmyard manure into the soil to improve its fertility and water-holding capacity.'`;

        await new Promise(resolve => setTimeout(resolve, 1000));

        const parsedData = `{${rawData}}`.replace(/'/g, '"');
        const dataObject = JSON.parse(parsedData);
        setData(dataObject);
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatRecommendations = (text) => {
    return text
      .replace('To optimize crop yield, consider the following recommendations:', '')
      .split(/\d+\./)
      .filter(Boolean)
      .map((item, index) => <li key={index}>{item.trim()}</li>);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h3>Score (આંક): {data.score}</h3>
      <p><strong>Key Observations:</strong> {data.key_observations}</p>
      <div>
        <strong>Recommendations:</strong>
        <ul>{formatRecommendations(data.recommendations)}</ul>
      </div>
    </div>
  );
};

export default HomePage;
