import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './CSS/ResponsePage.css'; // Import CSS for styling

function ResponsePage() {
  const { formId } = useParams();
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResponseData = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await axios.get(`http://localhost:5000/forms/${formId}/responses`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.status === 'SUCCESS') {
          setResponseData(response.data);
          console.log()
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError('Error fetching response data.');
        console.error('Error fetching response data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResponseData();
  }, [formId]);

  if (loading) return <p>Loading response data...</p>;
  if (error) return <p>Error: {error}</p>;

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
              <p>{responseData.completionRate ? `${responseData.completionRate}%` : 'N/A'}</p>
            </div>
          </div>
          <table className="response-table">
            <thead>
              <tr>
                <th>Submitted at (Time)</th>
                {responseData.columns && responseData.columns.map((col, idx) => (
                  <th key={idx}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {responseData.interactions && responseData.interactions.map((interaction, idx) => (
                <tr key={idx}>
                  <td>{new Date(interaction.submittedAt).toLocaleString()}</td>
                  {responseData.columns.map((col, colIdx) => (
                    <td key={colIdx}>{interaction.element === col ? interaction.input : ''}</td>
                  ))}
                </tr>
              ))}
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
