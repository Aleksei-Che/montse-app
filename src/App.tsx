import { Routes, Route, useLocation } from "react-router-dom";
import Explore from "./pages/Explore";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import Profile from "./pages/Profile";
import RegisterPage from "./pages/RegisterPage";
import StartPage from "./pages/StratPage";
import Navbar from "./components/navbar/Navbar";
import "./App.css";

function App() {
  const location = useLocation();
  const hideNavbarPath = ["/", "/loginpage", "/registerpage"];
  const shouldShowNavbar = !hideNavbarPath.includes(location.pathname);

  return (
    <div>
      {shouldShowNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/home" element={<Home />} />
        <Route path="/loginpage" element={<LoginPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/registerpage" element={<RegisterPage />} />
      </Routes>
    </div>
  );
}

export default App;