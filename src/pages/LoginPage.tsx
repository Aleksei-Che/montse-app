import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

const LoginPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState<string | null>(null);

  // Получаем email из переданных данных
  const email = location.state?.email || "";

  const handleLogin = async () => {
    try {
      // Проверяем email и пароль
      await signInWithEmailAndPassword(auth, email, password);

      // Получаем имя пользователя из профиля
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUserName(currentUser.displayName || "User"); // Устанавливаем имя пользователя
      }

      alert("Login successful!");
      navigate("/home"); // Перенаправляем на страницу Home
    } catch (error) {
      console.error("Error during login:", error);
      alert("Invalid password or login failed.");
    }
  };

  return (
    <div>
      <h1>Hello, {userName || email || "User"}!</h1>
      <input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginPage;