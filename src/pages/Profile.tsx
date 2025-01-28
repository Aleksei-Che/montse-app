import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

const Profile: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const handleLogout = async () => {
    try {
      console.log("Logging out...");
      await auth.signOut();
      setTimeout(() => {
        console.log("User successfully signed out. Navigating to '/'...");
        navigate("/");
      }, 500); // Добавляем небольшую задержку
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-screen-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Your Profile</h1>
      <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded shadow mb-6">
        <p className="text-lg font-semibold">
          Name: {user?.displayName || "Guest"}
        </p>
        <p className="text-lg">Email: {user?.email || "Not available"}</p>
      </div>
      <div className="mb-6">
        <button
          onClick={toggleDarkMode}
          className="bg-blue-500 dark:bg-gray-700 text-white px-4 py-2 rounded hover:bg-blue-600 dark:hover:bg-gray-600 w-full sm:w-auto"
        >
          {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </button>
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full sm:w-auto"
      >
        Log Out
      </button>
    </div>
  );
};

export default Profile;