import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './CSS/FormBuilderPage.css';
import removeIcon from '../assets/delete.png'; // Import the remove icon

const API_URL = 'https://form-app-server-evaluationproject-i.onrender.com';
function FormBuilderPage() {
  const [elements, setElements] = useState([{ type: 'Start', content: 'Start' }]);
  const [publicUrl, setPublicUrl] = useState('');
  const [formName, setFormName] = useState('');
  const [startClicked, setStartClicked] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [elementCounts, setElementCounts] = useState({
    Btext: 0, Image: 0, Video: 0, GIF: 0,
    Itext: 0, Number: 0, Email: 0, Phone: 0, Date: 0, Rating: 0, Button: 0
  });
  const navigate = useNavigate();
  const { formId } = useParams();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    axios.get(`${API_URL}/verifyToken`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      if (response.data.status === 'SUCCESS') {
        setIsAuthenticated(true);
      } else {
        navigate('/login');
      }
    })
    .catch(error => {
      console.error('Token verification failed', error);
      navigate('/login');
    });

    if (formId) {
      axios.get(`${API_URL}/forms/${formId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        if (response.data.status === 'SUCCESS') {
          setElements(response.data.form.elements);
          setFormName(response.data.form.name);
          setPublicUrl(`${window.location.origin}/illustrate/${formId}`);
        } else {
          console.error('Failed to fetch form:', response.data.message);
        }
      })
      .catch(error => {
        console.error('Error fetching form:', error);
      });
    }
  }, [navigate, formId]);

  const handleAddElement = (type) => {
    if (!startClicked) return; // Prevent adding elements if Start prompt not clicked

    const lastElement = elements[elements.length - 1];
    if (['Btext', 'Image', 'Video', 'GIF', 'Button'].includes(lastElement.type) && !lastElement.content) {
      setValidationError('Required Field');
      return;
    }

    setValidationError(null);

    const newElementCounts = { ...elementCounts, [type]: elementCounts[type] + 1 };
    setElementCounts(newElementCounts);

    const sequenceNumber = newElementCounts[type];

    const isInput = ['Itext', 'Number', 'Email', 'Phone', 'Date', 'Rating', 'Button'].includes(type);
    if (isInput && type !== 'Button') {
      setElements([...elements, { type: `${type} ${sequenceNumber}`, content: '' }]);
    } else if (type === 'Button') {
      setElements([...elements, { type: `${type} ${sequenceNumber}`, content: `Button ${sequenceNumber}` }]);
    } else {
      setElements([...elements, { type: `${type} ${sequenceNumber}`, content: '' }]);
    }
  };

  const handleContentChange = (index, content) => {
    const updatedElements = [...elements];
    updatedElements[index].content = content;
    setElements(updatedElements);
    if (validationError && content) setValidationError(null);
  };

  const handleRemoveElement = (index) => {
    const updatedElements = [...elements];
    updatedElements.splice(index, 1);
    setElements(updatedElements);
  };

  const handleOkClick = () => {
    if (!formName) {
      setShowPrompt(true);
      return;
    }
    console.log("Save button is clicked");
    const token = localStorage.getItem('token');
    const formData = {
      name: formName,
      elements
    };
    //Checking if the form is new or existing
    if (formId) {
      console.log("Updating the existing form");
      axios.put(`${API_URL}/forms/${formId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        if (response.data.status === 'SUCCESS') {
          console.log("Updated the existing form", response.data.form)
          setPublicUrl(`${window.location.origin}/illustrate/${formId}`);
          setShowPrompt(false);
        } else {
          console.error('Failed to save form:', response.data.message);
        }
      })
      .catch(error => {
        console.error('Error saving form:', error);
      });
    } else {
      console.log("Calling the backend /form api to save the new form in the db");
      axios.post(`${API_URL}/forms`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        if (response.data.status === 'SUCCESS') {
          const newFormId = response.data.form._id;
          setPublicUrl(`${window.location.origin}/illustrate/${newFormId}`);
          // setPublicUrl(`/illustrate/${newFormId}`);
          setShowPrompt(false);
        } else {
          console.error('Failed to save form:', response.data.message);
        }
      })
      .catch(error => {
        console.error('Error saving form:', error);
      });
    }
  };

  const handleShareClick = () => {
    if (publicUrl) {
      navigator.clipboard.writeText(publicUrl)
        .then(() => {
          alert('Public URL copied to clipboard!');
        })
        .catch(error => {
          console.error('Failed to copy URL:', error);
        });
    }
  };

  const handleStartClick = () => {
    setStartClicked(true);
  };

  const handleResponseClick = () => {
    // Navigate to the response analysis page
    navigate(`/response/${formId}`);
  };

  if (!isAuthenticated) {
    return <p>Loading...</p>;
  }

  return (
    <div className="form-builder-container">
      <div className="top-navbar">
        <input
          type="text"
          placeholder="Enter Form Name"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          className="form-name-input"
          required
        />
        <div className="middle-buttons">
          <button>Flow</button>
          <button>Theme</button>
          <button onClick={handleResponseClick}>Response</button>
        </div>
        <div className="right-buttons">
          <button onClick={handleOkClick}>Save</button>
          <button onClick={handleShareClick} disabled={!publicUrl}>Share</button>
        </div>
      </div>
      <div className="left-navbar">
        <h3>Bubbles</h3>
        <div className="button-container">
          <button onClick={() => handleAddElement('Btext')}>Btext</button>
          <button onClick={() => handleAddElement('Image')}>Image</button>
          <button onClick={() => handleAddElement('Video')}>Video</button>
          <button onClick={() => handleAddElement('GIF')}>GIF</button>
        </div>

        <h3>Inputs</h3>
        <div className="button-container">
          <button onClick={() => handleAddElement('Itext')}>Itext</button>
          <button onClick={() => handleAddElement('Number')}>Number</button>
          <button onClick={() => handleAddElement('Email')}>Email</button>
          <button onClick={() => handleAddElement('Phone')}>Phone</button>
          <button onClick={() => handleAddElement('Date')}>Date</button>
          <button onClick={() => handleAddElement('Rating')}>Rating</button>
          <button onClick={() => handleAddElement('Button')}>Button</button>
        </div>
      </div>
      <div className="workspace">
        {elements.map((element, index) => (
          <div key={index} className="element">
            <h7>{element.type}</h7>
            {element.type !== 'Start' && (
              <button className="remove-button" onClick={() => handleRemoveElement(index)}>
                <img src={removeIcon} alt="Remove" />
              </button>
            )}
            {['Btext', 'Image', 'Video', 'GIF', 'Button'].includes(element.type.split(' ')[0]) && (
              <input
                type="text"
                placeholder={`Enter ${element.type.split(' ')[0]} Content`}
                value={element.content}
                onChange={(e) => handleContentChange(index, e.target.value)}
                required
              />
            )}
            {element.type === 'Start' && (
              <button className="start-button" onClick={handleStartClick}>
                {element.content}
              </button>
            )}
          </div>
        ))}
        {validationError && <div className="validation-error">{validationError}</div>}
      </div>
      {showPrompt && (
        <div className="form-name-prompt">
          <p>Please enter a form name</p>
          <button onClick={() => setShowPrompt(false)}>OK</button>
        </div>
      )}
    </div>
  );
}

export default FormBuilderPage;
