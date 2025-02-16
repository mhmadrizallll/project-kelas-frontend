import React from "react";
import { Navigate } from "react-router";

const Protected: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default Protected;
