import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth"; // Импорт функции отдельно
import { auth } from "../firebaseConfig";

const LoginPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState<string | null>(null);

  // Получаем email из переданных данных
  const email = location.state?.email || "";

  // Получение имени пользователя из Firebase
  useEffect(() => {
    const fetchUserName = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUserName(currentUser.displayName || null);
      }
    };

    fetchUserName();
  }, []);

  const handleLogin = async () => {
    try {
      // Логика авторизации
      await signInWithEmailAndPassword(auth, email, password);

      // Получаем имя пользователя после успешного входа
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUserName(currentUser.displayName || "User");
      }

      alert("Login successful!");
      navigate("/home");
    } catch (error) {
      console.error("Error during login:", error);
      alert("Invalid password or login failed.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4">
          Hello, {userName || email || "User"}!
        </h1>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 mb-4 w-full rounded"
        />
        <button
          type="button"
          onClick={handleLogin}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 w-full"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default LoginPage;