import React from "react";
import { NavLink } from "react-router-dom";


const Navbar: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-blue-500 text-white flex justify-around py-4 z-40 shadow-md">
      <NavLink
        to="/home"
        className={({ isActive }) =>
          isActive ? "text-yellow-300 font-bold" : "hover:text-yellow-300"
        }
      >
        Home
      </NavLink>
      <NavLink
        to="/explore"
        className={({ isActive }) =>
          isActive ? "text-yellow-300 font-bold" : "hover:text-yellow-300"
        }
      >
        Explore
      </NavLink>
      <NavLink
        to="/profile"
        className={({ isActive }) =>
          isActive ? "text-yellow-300 font-bold" : "hover:text-yellow-300"
        }
      >
        Profile
      </NavLink>
    </nav>
  );
};

export default Navbar;
