import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch } from "./hooks/useAppDispatch";
import { fetchBooksFromFirestore } from "./bookUtils/booksSlice";
import { useAuth } from "./hooks/useAuth";
import Explore from "./pages/Explore";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import Profile from "./pages/Profile";
import RegisterPage from "./pages/RegisterPage";
import StartPage from "./pages/StratPage";
import Navbar from "./components/navbar/Navbar";
import PrivateRoute from "./privateRoute/Privateroute";
import "./App.css";

function App() {
  const dispatch = useAppDispatch();
  const { user } = useAuth(); // Получаем текущего пользователя
  const location = useLocation();
  const hideNavbarPath = ["/", "/loginpage", "/registerpage"];
  const shouldShowNavbar = !hideNavbarPath.includes(location.pathname);
  
  useEffect(() => {
    if (user) {
      dispatch(fetchBooksFromFirestore(user.uid)); // Загружаем книги пользователя
    }
  }, [dispatch, user]);
  return (
    <div>
      {shouldShowNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/explore" element={<PrivateRoute><Explore /></PrivateRoute>} />
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/loginpage" element={<LoginPage />} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/registerpage" element={<RegisterPage />} />
      </Routes>
    </div>
  );
}

export default App;