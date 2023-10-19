import logo from "./logo.svg";
import "./App.css";

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Map from "./pages/Map";
import Authentication from "./pages/Authentication";
import { LoadScript } from "@react-google-maps/api";

const App: React.FC = () => {
  return (
    <LoadScript googleMapsApiKey="AIzaSyAZ4Ce8G0WK9ElAtz5sNeMAwygI4yntNlI">
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/map" element={<Map />} />
          <Route path="/auth" element={<Authentication />} />
        </Routes>
      </Router>
    </LoadScript>
  );
};

export default App;
