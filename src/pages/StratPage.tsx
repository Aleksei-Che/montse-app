import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchSignInMethodsForEmail } from "firebase/auth";
import { auth } from "../firebaseConfig";
import Logo from "./Logo";

const StartPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [animationStage, setAnimationStage] = useState<"intro" | "fade-out" | "welcome">("intro");
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    // Таймеры для управления анимациями
    const introTimer = setTimeout(() => setAnimationStage("fade-out"), 3000);
    const welcomeTimer = setTimeout(() => setAnimationStage("welcome"), 4000);
    const logoTimer = setTimeout(() => setShowLogo(true), 4000);

    return () => {
      clearTimeout(introTimer);
      clearTimeout(welcomeTimer);
      clearTimeout(logoTimer);
    };
  }, []);

  const handleCheckEmail = async () => {
    if (!email.trim()) {
      setError("Email cannot be empty.");
      return;
    }

    setIsLoading(true);
    try {
      setError("");
      const trimmedEmail = email.trim();
      const methods = await fetchSignInMethodsForEmail(auth, trimmedEmail);

      if (methods.length > 0) {
        // Если email зарегистрирован, перенаправляем на LoginPage
        navigate("/loginpage", { state: { email: trimmedEmail } });
      } else {
        // Если email не зарегистрирован, перенаправляем на RegisterPage
        navigate("/registerpage", { state: { email: trimmedEmail } });
      }
    } catch (error) {
      console.error("Unexpected error during email check:", error);
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
          className="border border-gray-300 focus:ring-2 focus:ring-blue-400 p-3 mb-4 w-full rounded-lg"
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
          {isLoading ? "Checking..." : "Get Started"}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default StartPage;