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
      console.log("useAuth: Auth state changed. Current User:", currentUser);

      // Предотвращаем лишние обновления, если пользователь не изменился
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

  // Меморизация возвращаемого объекта, чтобы исключить лишние рендеры
  const authState = useMemo(() => ({ user, loading }), [user, loading]);

  return authState;
};