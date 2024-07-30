import React from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Logo from '../assets/Logo.png';
import HomeBody from './HomeBody';

function FormNavbar() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <>
    <Navbar expand="lg" className="bg-dark navbar-dark">
      <Container>
        <div><img src={Logo} alt="FormBot Logo" height="40" className="me-3" />
        <Navbar.Brand href="/">FormBot</Navbar.Brand></div>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* Add other navigation items here if needed */}
          </Nav>
          <Button variant="outline-success" className="me-2" onClick={handleLoginClick}>Sign in</Button>
          <Button variant="primary">Create a FormBot</Button>
        </Navbar.Collapse>
      </Container> 
    </Navbar>
    {/* <HomeBody/> */}
    </>
    
  );
}

export default FormNavbar;
