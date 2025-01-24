import React from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebaseConfig";

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const user = auth.currentUser; // Проверяем текущего пользователя

  // Если пользователь не авторизован, перенаправляем на страницу входа
  return user ? children : <Navigate to="/loginpage" />;
};

export default PrivateRoute;