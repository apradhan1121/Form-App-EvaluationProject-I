import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './CSS/IllustratePage.css';

function IllustratePage() {
  const { formId } = useParams();
  const [formElements, setFormElements] = useState([]);
  const [currentElementIndex, setCurrentElementIndex] = useState(0);
  const [userInputs, setUserInputs] = useState({});
  const [isWaitingForInput, setIsWaitingForInput] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [hasStarted, setHasStarted] = useState(false); // Track if interaction has started
  const [interactions, setInteractions] = useState([]); // Track all interactions
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const fetchFormElements = async () => {
      try {
        const localStorageFormElements = JSON.parse(localStorage.getItem(formId));

        if (localStorageFormElements) {
          setFormElements(localStorageFormElements);
        } else {
          // Token-based authentication is always true since URL is public
          const response = await axios.get(`http://localhost:5000/forms/${formId}`);
          if (response.data.status === 'SUCCESS') {
            console.log("Fetched form elements from the DB:", response.data.form.elements);
            setFormElements(response.data.form.elements);
            localStorage.setItem(formId, JSON.stringify(response.data.form.elements));
          }
        }

        // Increment view count when the page first loads
        await axios.post(`http://localhost:5000/forms/${formId}/increment-view`);
      } catch (error) {
        console.error('Error fetching form elements:', error);
      }
    };

    fetchFormElements();
  }, [formId]);

  useEffect(() => {
    const proceedToNextElement = () => {
      if (currentElementIndex < formElements.length) {
        const currentElement = formElements[currentElementIndex];
        if (['Number', 'Email', 'Phone', 'Date', 'Rating', 'Itext', 'Button'].includes(currentElement.type.split(' ')[0])) {
          setIsWaitingForInput(true);
        } else {
          setIsWaitingForInput(false);
          setCurrentElementIndex(currentElementIndex + 1);
        }
      }
    };

    if (!isWaitingForInput && currentElementIndex < formElements.length) {
      const timer = setTimeout(proceedToNextElement, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentElementIndex, formElements, isWaitingForInput]);

  useEffect(() => {
    const fetchResponseData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/forms/${formId}/responses`);
        if (response.data.status === 'SUCCESS') {
          console.log("Fetched response data:", response.data);
          setResponseData(response.data);
        }
      } catch (error) {
        console.error('Error fetching response data:', error);
      }
    };

    fetchResponseData();
  }, [formId]);

  const handleInputChange = (e) => {
    setUserInputs({
      ...userInputs,
      [currentElementIndex]: e.target.value
    });
  };

  const handleSendClick = async () => {
    if (userInputs[currentElementIndex]) {
      try {
        if (!hasStarted) {
          await axios.post(`http://localhost:5000/forms/${formId}/increment-start`);
          setHasStarted(true);
        }

        const newInteraction = {
          submittedAt: new Date(),
          element: formElements[currentElementIndex].type,
          input: userInputs[currentElementIndex]
        };

        setInteractions([...interactions, newInteraction]);
        console.log("Sending each interaction to backend", newInteraction);

        await axios.post(`http://localhost:5000/forms/${formId}/interactions`, { interaction: newInteraction });

        setIsWaitingForInput(false);
        setCurrentElementIndex(currentElementIndex + 1);
        setUserInputs({ ...userInputs, [currentElementIndex]: '' }); // Clear input field after send
      } catch (error) {
        console.error('Error saving user input:', error);
      }
    }
  };

  const handleButtonClick = async () => {
    try {
      if (!hasStarted) {
        await axios.post(`http://localhost:5000/forms/${formId}/increment-start`);
        setHasStarted(true);
      }

      const newInteraction = {
        submittedAt: new Date(),
        element: formElements[currentElementIndex].type,
        input: ''
      };

      setInteractions([...interactions, newInteraction]);

      await axios.post(`http://localhost:5000/forms/${formId}/interactions`, newInteraction);

      setIsWaitingForInput(false);
      setCurrentElementIndex(currentElementIndex + 1);
    } catch (error) {
      console.error('Error saving button click:', error);
    }
  };

  useEffect(() => {
    if (currentElementIndex >= formElements.length && !isCompleted) {
      const submitInteractions = async () => {
        try {
          console.log("Form is completed... Calling complete api");
          await axios.post(`http://localhost:5000/forms/${formId}/complete`, {
            interactions: interactions
          });
          setIsCompleted(true); // Set the flag to true after completion
        } catch (error) {
          console.error('Error marking form as completed:', error);
        }
      };
      submitInteractions();
    }
  }, [currentElementIndex, formElements, interactions, formId, isCompleted]);

  if (currentElementIndex >= formElements.length) {
    return <p>Thank you for your input!</p>;
  }

  const currentElement = formElements[currentElementIndex];

  return (
    <div className="chat-box">
      <div className="illustrate-container">
        {formElements.slice(0, currentElementIndex + 1).map((element, index) => (
          <div
            key={index}
            className={`chat-container ${['Btext', 'Image', 'Video', 'GIF'].includes(element.type.split(' ')[0]) ? 'bubble-left' : 'input-right'}`}
          >
            {['Btext', 'Image', 'Video', 'GIF'].includes(element.type.split(' ')[0]) && (
              <div className="bubble bubble-left">
                {element.type.split(' ')[0] === 'Btext' && <div>{element.content}</div>}
                {element.type.split(' ')[0] === 'Image' && <img src={element.content} alt="Media" />}
                {element.type.split(' ')[0] === 'Video' && <video src={element.content} controls />}
                {element.type.split(' ')[0] === 'GIF' && <img src={element.content} alt="Media" />}
              </div>
            )}
            {['Number', 'Email', 'Phone', 'Date', 'Rating', 'Itext'].includes(element.type.split(' ')[0]) && index === currentElementIndex && (
              <div className="input-chat">
                <input
                  type={element.type.split(' ')[0] === 'Phone' ? 'tel' : element.type.split(' ')[0] === 'Date' ? 'date' : 'text'}
                  placeholder={`Enter ${element.type.split(' ')[0]}`}
                  value={userInputs[currentElementIndex] || ''}
                  onChange={handleInputChange}
                  disabled={!isWaitingForInput}
                />
                <button className="send-button" onClick={handleSendClick} disabled={!userInputs[currentElementIndex]}>
                  →
                </button>
              </div>
            )}
            {element.type.split(' ')[0] === 'Button' && (
              <div className="input-chat">
                <button className="button-chat" onClick={handleButtonClick} disabled={index !== currentElementIndex}>
                  {element.content}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default IllustratePage;
