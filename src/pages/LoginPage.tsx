import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

const LoginPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); 

  const email = location.state?.email || "";

  useEffect(() => {
    const fetchUserName = async () => {
      if (!email) return;
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          setUserName(querySnapshot.docs[0].data().name || "Guest");
        } else {
          console.warn("User not found in Firestore.");
          setUserName("Guest");
        }
      } catch (error) {
        console.error("Error fetching user name from Firestore:", error);
        setUserName("Guest");
      }
    };

    fetchUserName();
  }, [email]);

  const handleLogin = async () => {
    if (!email || !password) return;

    setLoading(true); 
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home");
    } catch (error) {
      console.error("Error during login:", error);
    } finally {
      setLoading(false); 
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
          disabled={loading} 
          className={`p-2 rounded w-full ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;