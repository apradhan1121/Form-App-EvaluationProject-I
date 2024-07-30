import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function RegisterPage() {
  const [fname,setFirstName] = useState('');
  const [lname,setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  /* const handleSubmit = (event) => {
    event.preventDefault();
  
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'http://localhost:5000/User/signup';
  
    const fields = {
      username,
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
  
    document.body.appendChild(form);
    form.submit();
  }; */
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  
    try {
      // Send POST request with axios
      const response = await axios.post("http://localhost:5000/User/signup", {
        fname,
        lname,
        username,
        email,
        password
      });
  
      // Access the response data directly
      const data = response.data;
      console.log(data);
  
      if (data.status === 'success') {
        // Redirect to the login page after successful registration
        navigate('/login');
      } else {
        setError(data.message || 'An error occurred during registration');
      }
    } catch (error) {
      setError('An error occurred during registration');
    }
  };
  
  
  
  

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <Form className="p-4 shadow rounded" style={{ maxWidth: '400px', width: '100%', color: 'white' }} onSubmit={handleSubmit}>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form.Group className="mb-3" controlId="formBasicUsername">
          <Form.Label style={{marginLeft:'-18rem'}}>First Name</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Enter Name" 
            value={fname} 
            onChange={(e) => setFirstName(e.target.value)} 
            size="sm" 
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicUsername">
          <Form.Label style={{marginLeft:'-18rem'}}>Last Name</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Enter Name" 
            value={lname} 
            onChange={(e) => setLastName(e.target.value)} 
            size="sm" 
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicUsername">
          <Form.Label style={{marginLeft:'-17rem'}}>Username</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Enter username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            size="sm" 
          />
        </Form.Group>

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
          <Form.Label style={{marginLeft:'-17rem'}}>Password</Form.Label>
          <Form.Control 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            size="sm" 
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
          <Form.Label style={{marginLeft:'-14rem'}} >Confirm Password</Form.Label>
          <Form.Control 
            type="password" 
            placeholder="Confirm Password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            size="sm" 
          />
        </Form.Group>

        <Button variant="primary" type="submit" style={{width:'21rem'}}>
          Sign Up
        </Button>

        <div className="mt-3">
          <p className="mb-0">Already have an account? <Link to="/login">Login</Link></p>
        </div>

      {/*   <div className="mt-3 text-center">
          <p>Already have an account? <a href="/login">Login</a></p>
        </div> */}
      </Form>
    </div>
  );
}

export default RegisterPage;
