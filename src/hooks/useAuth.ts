import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebaseConfig";

interface AuthState {
  user: User | null;
  loading: boolean;
}

export const useAuth = (): AuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("useAuth initialized");

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("onAuthStateChanged triggered. Current User:", currentUser);

      // Условие предотвращает лишние обновления
      setUser((prevUser) => (prevUser?.uid === currentUser?.uid ? prevUser : currentUser));
      console.log("useAuth - Updated user state:", currentUser);
      setLoading(false);
    });

    return () => {
      console.log("useAuth cleanup: unsubscribing auth listener");
      unsubscribe();
    };
  }, []);

  console.log("useAuth - user:", user, "loading:", loading);

  return { user, loading };
};