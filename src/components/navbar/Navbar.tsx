import React from "react";
import { NavLink } from "react-router-dom";
import { MdBookmark } from "react-icons/md";
import { MdOutlineExplore } from "react-icons/md";
import { FaUserAstronaut } from "react-icons/fa";

const Navbar: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-blue-500 text-white flex justify-around py-2 z-40 shadow-md">
      <NavLink
        to="/home"
        className={({ isActive }) =>
          isActive ? "text-yellow-300 font-bold" : "hover:text-yellow-300"
        }
      >
        <div className="flex flex-col items-center">
          <MdBookmark className="w-6 h-6" />
          <span className="text-xs">Home</span>
        </div>
      </NavLink>
      
      <NavLink
        to="/explore"
        className={({ isActive }) =>
          isActive ? "text-yellow-300 font-bold" : "hover:text-yellow-300"
        }
      >
        <div className="flex flex-col items-center">
          <MdOutlineExplore className="w-6 h-6"/>
          <span className="text-xs">Explore</span>
        </div>
      </NavLink>
      
      <NavLink
        to="/profile"
        className={({ isActive }) =>
          isActive ? "text-yellow-300 font-bold" : "hover:text-yellow-300"
        }
      >
        <div className="flex flex-col items-center">
          <FaUserAstronaut className="w-6 h-6" />
          <span className="text-xs">Profile</span>
        </div>
      </NavLink>
    </nav>
  );
};

export default Navbar;
