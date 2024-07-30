import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

 /*  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      // Send POST request with axios
      const response = await axios.post("http://localhost:5000/User/LoginUser", {
        email: email, // assuming email is used as username
        password
      });

      // Access the response data directly
      const data = response.data;
      console.log(data);

      if (data.status === 'Success') {
        // Store the JWT token (if needed) and redirect to the dashboard
        localStorage.setItem('token', data.token); // or use any other storage method
        navigate('/userDashboard');
      } else {
        setError(data.message || 'An error occurred during login');
      }
    } catch (error) {
      setError('An error occurred during login');
      console.error('Login error:', error);
    }
  }; */



  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      // Send POST request with axios
      const response = await axios.post("http://localhost:5000/User/LoginUser", {
        email: email, // assuming email is used as username
        password
      });

      // Access the response data directly
      const data = response.data;
      console.log(data);

      if (data.status === 'Success') {
        // Store the JWT token (if needed) and redirect to the dashboard
        localStorage.setItem('token', data.token); // or use any other storage method
        console.log("User logged in succussfully and token is stored.")
        console.log("Redirecting to dashboard page")
        navigate('/userDashboardF');
      } else {
        setError(data.message || 'An error occurred during login');
      }
    } catch (error) {
      setError('An error occurred during login');
      console.error('Login error:', error);
    }
  }; 






  /* const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
  
    // Create a new form element
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'http://localhost:5000/User/LoginUser';
  
    // Add email and password to the form as hidden fields
    const fields = {
      email,
      password
    };
  
    for (const [key, value] of Object.entries(fields)) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    }
  
    // Append the form to the document body
    document.body.appendChild(form);
  
    const iframe = document.createElement('iframe');
    iframe.name = 'hidden_iframe';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    // Set the form target to the hidden iframe
    form.target = 'hidden_iframe';

    // Handle the response from the server
    iframe.onload = function () {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        const responseText = iframeDoc.body.textContent;
        const data = JSON.parse(responseText);

        if (data.status === 'Success') {
          // Store the JWT token (if needed) and redirect to the dashboard
          localStorage.setItem('token', data.token); // or use any other storage method
          navigate('/dashboard');
        } else {
          setError(data.message || 'An error occurred during login');
        }
      } catch (error) {
        setError('An error occurred during login');
        console.error('Login error:', error);
      } finally {
        // Clean up the created form and iframe
        document.body.removeChild(form);
        document.body.removeChild(iframe);
      }
    };

    // Submit the form
    form.submit();
  };
 */
  

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <Form className="p-4 shadow rounded" style={{ maxWidth: '400px', width: '100%', color: 'white' }} onSubmit={handleSubmit}>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label style={{marginLeft:'-19rem'}}>Email</Form.Label>
          <Form.Control 
            type="email" 
            placeholder="Enter email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            size="sm" 
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label style={{marginLeft:'-18rem'}}>Password</Form.Label>
          <Form.Control 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            size="sm" 
          />
        </Form.Group>
        <Button variant="primary" type="submit" style={{width:'21rem'}}>
          Log In
        </Button>
        <div className="mt-3">
          <p className="mb-0">Don't have an account? <Link to="/register">Register Now</Link></p>
        </div>
      </Form>
    </div>
  );
}

export default LoginPage;
