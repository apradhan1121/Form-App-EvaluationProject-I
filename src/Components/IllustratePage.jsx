import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './CSS/IllustratePage.css';

const API_URL = 'http://localhost:5000';
function IllustratePage() {
  const { formId } = useParams();
  const [formElements, setFormElements] = useState([]);
  const [currentElementIndex, setCurrentElementIndex] = useState(0);
  const [userInputs, setUserInputs] = useState({});
  const [isWaitingForInput, setIsWaitingForInput] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [interactions, setInteractions] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    console.log("illustrate page: useffect-1")
    const fetchFormElements = async () => {
      try {
        // const localStorageFormElements = JSON.parse(localStorage.getItem(formId));
        const localStorageFormElements = null;

        if (localStorageFormElements) {
          setFormElements(localStorageFormElements);
        } else {
          // console.log("calling the http://localhost:5000/forms/${formId} in 1 ")
          const response = await axios.get(`${API_URL}/forms/${formId}`);
          // console.log("response fetched in 1:",response)
          if (response.data.status === 'SUCCESS') {
            setFormElements(response.data.form.elements);
            localStorage.setItem(formId, JSON.stringify(response.data.form.elements));
          }
        }
        console.log('calling the http://localhost:5000/forms/${formId}/increment-view in 1')
        await axios.post(`${API_URL}/forms/${formId}/increment-view`);
      } catch (error) {
        console.error('Error fetching form elements:', error);
      }
    };

    fetchFormElements();
  }, [formId]);

  useEffect(() => {
    console.log("illustrate page: useffect-2")
    const proceedToNextElement = () => {
      if (currentElementIndex < formElements.length) {
        const currentElement = formElements[currentElementIndex];
        if (['Number', 'Email', 'Phone', 'Date', 'Rating', 'Itext', 'Button'].includes(currentElement.type.split(' ')[0])) {
          setIsWaitingForInput(true);
        } else {
          setIsWaitingForInput(false);
          setTimeout(() => {
            setCurrentElementIndex(currentElementIndex + 1);
          }, 3000); // 3-second delay for bot messages
        }
      }
    };

    if (!isWaitingForInput && currentElementIndex < formElements.length) {
      proceedToNextElement();
    }
  }, [currentElementIndex, formElements, isWaitingForInput]);

  useEffect(() => {
    console.log("illustrate page: useffect-3")
    const fetchResponseData = async () => {
      try { 
        console.log("calling the http://localhost:5000/forms/${formId}/responses in 3")
        const response = await axios.get(`${API_URL}/forms/${formId}/responses`);
        console.log("Responses fetched in 3:",response)
        if (response.data.status === 'SUCCESS') {
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
          await axios.post(`${API_URL}/forms/${formId}/increment-start`);
          setHasStarted(true);
        }

        const newInteraction = {
          submittedAt: new Date(),
          element: formElements[currentElementIndex].type,
          input: userInputs[currentElementIndex]
        };

        setInteractions([...interactions, newInteraction]);

        await axios.post(`${API_URL}/forms/${formId}/interactions`, { interaction: newInteraction });

        setIsWaitingForInput(false);
        setCurrentElementIndex(currentElementIndex + 1);
      } catch (error) {
        console.error('Error saving user input:', error);
      }
    }
  };

  const handleButtonClick = async () => {
    try {
      if (!hasStarted) {
        await axios.post(`${API_URL}/forms/${formId}/increment-start`);
        setHasStarted(true);
      }

      const newInteraction = {
        submittedAt: new Date(),
        element: formElements[currentElementIndex].type,
        input: ''
      };

      setInteractions([...interactions, newInteraction]);

      await axios.post(`${API_URL}/forms/${formId}/interactions`, newInteraction);

      setIsWaitingForInput(false);
      setCurrentElementIndex(currentElementIndex + 1);
    } catch (error) {
      console.error('Error saving button click:', error);
    }
  };

  useEffect(() => {
    console.log("useeffect-4 and currentElementIndex and formElements.length & isCompleted",currentElementIndex, formElements.length,isCompleted)
    if (currentElementIndex+1 == formElements.length && !isCompleted) {
      const submitInteractions = async () => {
        try {
          console.log("Calling the complete axios operation")
          await axios.post(`${API_URL}/forms/${formId}/complete`, {
            interactions: interactions
          });
          setIsCompleted(true);
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
        {formElements.slice(0, currentElementIndex).map((element, index) => (
          <div
            key={index}
            className={`chat-container ${['Btext', 'Image', 'Video', 'GIF'].includes(element.type.split(' ')[0]) ? 'bubble-left' : 'bubble-right'}`}
          >
            {['Btext', 'Image', 'Video', 'GIF'].includes(element.type.split(' ')[0]) && (
              <div className="bubble bubble-left">
                {element.type.split(' ')[0] === 'Btext' && <div>{element.content}</div>}
                {element.type.split(' ')[0] === 'Image' && <img src={element.content} alt="Media" />}
                {element.type.split(' ')[0] === 'Video' && <video src={element.content} controls />}
                {element.type.split(' ')[0] === 'GIF' && <img src={element.content} alt="Media" />}
              </div>
            )}
            {['Number', 'Email', 'Phone', 'Date', 'Rating', 'Itext'].includes(element.type.split(' ')[0]) && (
              <div className="bubble bubble-right">
                {userInputs[index] || element.content}
              </div>
            )}
            {element.type.split(' ')[0] === 'Button' && (
              <div className="bubble bubble-right">
                <button className="button-chat" onClick={handleButtonClick} disabled={index !== currentElementIndex}>
                  {element.content}
                </button>
              </div>
            )}
          </div>
        ))}
        {currentElement && ['Number', 'Email', 'Phone', 'Date', 'Rating', 'Itext'].includes(currentElement.type.split(' ')[0]) && (
          <div className="input-chat">
            <input
              type={currentElement.type.split(' ')[0] === 'Phone' ? 'tel' : currentElement.type.split(' ')[0] === 'Date' ? 'date' : 'text'}
              placeholder={`Enter ${currentElement.type.split(' ')[0]}`}
              value={userInputs[currentElementIndex] || ''}
              onChange={handleInputChange}
              disabled={!isWaitingForInput}
            />
            <button className="send-button" onClick={handleSendClick} disabled={!userInputs[currentElementIndex]}>
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default IllustratePage;
