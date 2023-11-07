// src/App.tsx
import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Map from "./pages/Map";
import Authentication from "./pages/Authentication";
import { LoadScript } from "@react-google-maps/api";
import { AuthProvider } from "./contexts/AuthContext";
import AuthWrapper from "./components/AuthWrapper";
import InitialPage from "./pages/InitialPage";
import AboutUs from "./pages/AboutUs";
import Services from "./pages/Services";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ServerProvider } from "./contexts/ServerContext";

const App: React.FC = () => {
  return (
    <LoadScript googleMapsApiKey="AIzaSyAZ4Ce8G0WK9ElAtz5sNeMAwygI4yntNlI">
      <Router>
        <AuthProvider>
          <LanguageProvider>
            <ServerProvider>
              <Routes>
                <Route path="/" element={<InitialPage />} />
                <Route
                  path="/home"
                  element={
                    <AuthWrapper>
                      <Dashboard />
                    </AuthWrapper>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <AuthWrapper>
                      <Profile />
                    </AuthWrapper>
                  }
                />
                <Route
                  path="/map"
                  element={
                    <AuthWrapper>
                      <Map />
                    </AuthWrapper>
                  }
                />
                <Route path="/auth" element={<Authentication />} />
                <Route path="/aboutus" element={<AboutUs />} />
                <Route path="/service" element={<Services />} />
              </Routes>
            </ServerProvider>
          </LanguageProvider>
        </AuthProvider>
      </Router>
    </LoadScript>
  );
};

export default App;
