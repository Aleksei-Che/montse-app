import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const RegisterPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState(location.state?.email || "");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!name.trim()) {
      setError("Name cannot be empty.");
      return;
    }
    if (!email.trim()) {
      setError("Email cannot be empty.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Обновляем профиль, добавляем имя
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: name });
      }
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid, // Уникальный идентификатор
        name,
        email,
        createdAt: new Date().toISOString(),
      });

      console.log("User registered:", userCredential.user);
      alert("Registration successful!");

      // Переход на Home с передачей имени пользователя
      navigate("/home", { state: { name } });
    } catch (error) {
      console.error("Error during registration:", error);
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Универсальная функция для обработки ввода
  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setError(""); // Сбрасываем ошибку при вводе
      setter(e.target.value);
    };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-500 to-indigo-700 text-white">
      <h1 className="text-3xl font-bold mb-6">Register</h1>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm text-black"
      >
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={handleInputChange(setName)}
          className="border border-gray-300 focus:ring-2 focus:ring-blue-400 p-3 mb-4 w-full rounded-lg"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleInputChange(setEmail)}
          className="border border-gray-300 focus:ring-2 focus:ring-blue-400 p-3 mb-4 w-full rounded-lg"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={handleInputChange(setPassword)}
          className="border border-gray-300 focus:ring-2 focus:ring-blue-400 p-3 mb-4 w-full rounded-lg"
          required
        />
        <button
          type="button"
          onClick={handleRegister}
          className={`bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 w-full mt-2 transition-all duration-300 ${
            isLoading ? "cursor-wait opacity-70" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Registering..." : "Register"}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default RegisterPage;