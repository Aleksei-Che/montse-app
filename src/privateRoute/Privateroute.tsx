import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  console.log("PrivateRoute - user:", user, "loading:", loading);

  if (loading) {
    return <div>Loading...</div>; // Показываем загрузку
  }

  if (!user) {
    console.log("PrivateRoute - User not authenticated, redirecting to /loginpage");
  }

  return user ? children : <Navigate to="/loginpage" />;
};

export default PrivateRoute;