import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { user, authChecked } = useAuth();
  if (authChecked) {
    if (!user) {
      return <Navigate to="/" replace />;
    }
  }
  return <>{children}</>;
};

export default AuthWrapper;
