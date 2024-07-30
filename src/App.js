import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import FormNavbar from "./Components/FormNavbar";
import HomeBody from "./Components/HomeBody";
import LoginPage from "./Components/LoginPage";
import "bootstrap/dist/css/bootstrap.min.css";
import RegisterPage from "./Components/RegisterPage";
import DashboardPage from "./Components/DashboardPage";
import FormBuilderPage from "./Components/FormBuilderPage";
import IllustratePage from "./Components/IllustratePage";
import ResponsePage from './Components/ResponsePage'; 


function App() {
  return (
    <Router>
      <div className="App" style={{ backgroundColor: "#171923" }}>
        {/* <div className="App"> */}
        {/* <FormNavbar /> */}
        <Routes>
          <Route path="/" element={<HomeBody />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/userDashboardF" element={<DashboardPage />} />
          <Route path="/form-builder" element={<FormBuilderPage />} />
          <Route path="/illustrate/:formId" element={<IllustratePage />} />{" "}
          <Route path="/form-builder/:formId" element={<FormBuilderPage />} />
          <Route path="/response/:formId" element={<ResponsePage />} />
          {/* This route should match the URL structure */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
