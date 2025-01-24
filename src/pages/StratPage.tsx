import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import Logo from "./Logo";

const StartPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [animationStage, setAnimationStage] = useState<"intro" | "fade-out" | "welcome">("intro");
  const [showLogo, setShowLogo] = useState(false);

  // Таймеры для управления анимациями
  useEffect(() => {
    const introTimer = setTimeout(() => setAnimationStage("fade-out"), 3000);
    const welcomeTimer = setTimeout(() => setAnimationStage("welcome"), 4000);
    const logoTimer = setTimeout(() => setShowLogo(true), 4000);

    return () => {
      clearTimeout(introTimer);
      clearTimeout(welcomeTimer);
      clearTimeout(logoTimer);
    };
  }, []);

  // Проверка email в Firestore
  const getUserData = async (email: string) => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const handleCheckEmail = async () => {
    if (!email.trim()) {
      setError("Email cannot be empty.");
      return;
    }

    setIsLoading(true);
    try {
      setError("");
      const trimmedEmail = email.trim().toLowerCase();

      const userExists = await getUserData(trimmedEmail);

      if (userExists) {
        navigate("/loginpage", { state: { email: trimmedEmail } });
      } else {
        navigate("/registerpage", { state: { email: trimmedEmail } });
      }
    } catch (error) {
      console.error("Error during Firestore check:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-700 text-white">
      {/* Логотип */}
      {showLogo && (
        <div className="absolute top-6 left-6 animate-fade-in">
          <Logo />
        </div>
      )}

      {/* Анимация приветствия */}
      <div className="mb-8 text-center">
        {animationStage === "intro" && (
          <h1 className="text-4xl font-bold animate-fade-in">Hi! I'm Montse.</h1>
        )}
        {animationStage === "fade-out" && (
          <h1 className="text-4xl font-bold animate-fade-out">Hi! I'm Montse.</h1>
        )}
        {animationStage === "welcome" && (
          <h1 className="text-4xl font-bold animate-fade-in">Welcome</h1>
        )}
        <p className="mt-4 text-lg opacity-75 animate-fade-in">
          Your habit of reading is about to level up.
        </p>
      </div>

      {/* Форма ввода */}
      <form className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm text-black">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 mb-4 w-full rounded"
          required
        />
        <button
          type="button"
          onClick={handleCheckEmail}
          className={`bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 w-full mt-2 transition-all duration-300 ${
            isLoading ? "cursor-wait opacity-70" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Checking..." : "Next"}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default StartPage;