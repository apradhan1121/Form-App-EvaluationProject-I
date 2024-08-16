import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderPlus, faPlusCircle, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './CSS/DashboardPage.css';

const API_URL = 'https://form-app-server-evaluationproject-i.onrender.com';
function DashboardPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userName, setUserName] = useState('');
    const [folders, setFolders] = useState([]);
    const [bots, setBots] = useState([]);
    const [forms, setForms] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        axios.get(`${API_URL}/verifyToken`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(response => {
            if (response.data.status === 'SUCCESS') {
                setIsAuthenticated(true);
                console.log(response.data.user)
                setUserName(response.data.user.fname);
                fetchForms(token);
            } else {
                navigate('/login');
            }
        })
        .catch(error => {
            console.error('Token verification failed', error);
            navigate('/login');
        });
    }, [navigate]);

    const fetchForms = (token) => {
        axios.get(`${API_URL}/forms`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(response => {
            if (response.data.status === 'SUCCESS') {
                setForms(response.data.forms);
                console.log("Forms fetched successfully",response.data.forms)
            } else {
                console.error('Failed to fetch forms:', response.data.message);
            }
        })
        .catch(error => {
            console.error('Error fetching forms:', error);
        });
    };

    const handleCreateFolder = () => {
        const folderName = prompt("Enter folder name:");
        if (folderName) {
            setFolders([...folders, folderName]);
        }
    };

    const handleCreateBot = () => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/form-builder', { state: { token } });
        } else {
            navigate('/login');
        }
    };

    const handleFormClick = (formId) => {
        navigate(`/form-builder/${formId}`);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (!isAuthenticated) {
        return <p>Loading...</p>;
    }

    return (
        <div className="dashboard-container">
            <div className="top-bar">
                <h1>Welcome, {userName}!</h1>
                <button onClick={handleLogout} className="logout-button">
                    <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                </button>
            </div>
            <div className="actions">
                <button onClick={handleCreateFolder} className="create-folder">
                    <FontAwesomeIcon icon={faFolderPlus} /> Create a Folder
                </button>
                <button onClick={handleCreateBot} className="create-bot">
                    <FontAwesomeIcon icon={faPlusCircle} /> Create a Bot
                </button>
            </div>
            <div className="forms-list">
                <h2>Your Forms</h2>
                {forms.length === 0 ? (
                    <p>No forms available. Create a new form to get started.</p>
                ) : (
                    <ul>
                        {forms.map((form) => (
                            <li key={form._id} onClick={() => handleFormClick(form._id)}>
                                {form.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default DashboardPage;
