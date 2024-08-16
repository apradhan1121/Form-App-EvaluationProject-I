import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./CSS/ResponsePage.css"; // Import CSS for styling

function ResponsePage() {
  const { formId } = useParams();
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = 'https://form-app-server-evaluationproject-i.onrender.com';

  useEffect(() => {
    const fetchResponseData = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(
          `${API_URL}/forms/${formId}/responses`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Response data is:", response);

        if (response.data.status === "SUCCESS") {
          setResponseData(response.data);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError("Error fetching response data.");
        console.error("Error fetching response data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResponseData();
  }, [formId]);

  if (loading) return <p>Loading response data...</p>;
  if (error) return <p>Error: {error}</p>;

  // Create a unique list of column headers based on interactions
  const uniqueElements = [
    ...new Set(responseData.interactions.map((interaction) => interaction.element))
  ];

  // Create a mapping between element names and column indices
  const columnElementMap = uniqueElements.map((element) => element);

  return (
    <div className="response-page">
      <h2>Response Analysis</h2>
      {responseData ? (
        <>
          <div className="response-metrics">
            <div className="metric-box">
              <h3>Views</h3>
              <p>{responseData.views || 0}</p>
            </div>
            <div className="metric-box">
              <h3>Starts</h3>
              <p>{responseData.starts || 0}</p>
            </div>
            <div className="metric-box">
              <h3>Completion Rate</h3>
              <p>
                {responseData.completionRate
                  ? `${responseData.completionRate}%`
                  : "N/A"}
              </p>
            </div>
          </div>
          <table className="response-table">
            <thead>
              <tr>
                <th>Submitted at (Time)</th>
                {columnElementMap.map((element, idx) => (
                  <th key={idx}>{element}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {responseData.interactions.map((interaction, idx) => {
                console.log("Current interaction is:", interaction);
                console.log("Current key is:", idx);

                return (
                  <tr key={idx}>
                    <td>
                      {new Date(interaction.submittedAt).toLocaleString()}
                    </td>
                    {columnElementMap.map((col, colIdx) => (
                      <td key={colIdx}>
                        {interaction.element === col ? interaction.input : ""}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      ) : (
        <p>No response data available.</p>
      )}
    </div>
  );
}

export default ResponsePage;
