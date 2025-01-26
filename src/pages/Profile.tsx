import React from "react";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

const Profile: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/"); 
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-screen-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Your Profile</h1>
      <div className="bg-white p-6 rounded shadow mb-6">
        <p className="text-lg font-semibold">Name: {auth.currentUser?.displayName || "Guest"}</p>
        <p className="text-lg">Email: {auth.currentUser?.email || "Not available"}</p>
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