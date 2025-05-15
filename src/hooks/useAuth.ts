import { useEffect, useState, useMemo } from "react";
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
    console.log("useAuth: Initializing authentication listener");

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser((prevUser) =>
        prevUser?.uid === currentUser?.uid ? prevUser : currentUser
      );
      setLoading(false);
    });

    return () => {
      console.log("useAuth: Cleaning up authentication listener");
      unsubscribe();
    };
  }, []);

  const authState = useMemo(() => ({ user, loading }), [user, loading]);

  return authState;
};