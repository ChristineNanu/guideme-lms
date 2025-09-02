import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GuidePage from "./GuidePage";
import HomePage from "./HomePage"; 
import LoginPage from "./LoginPage";
import LandingPage from "./LandingPage";    
import RegisterPage from "./RegisterPage"; 
import CourseDetails from "./CourseDetails";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default landing page */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Main app pages */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/guide" element={<GuidePage />} />
        <Route path="/course-details" element={<CourseDetails />} />

      </Routes>
    </Router>
  );
}

export default App;
