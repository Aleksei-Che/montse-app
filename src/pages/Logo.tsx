import React from "react";

const Logo: React.FC = () => {
  return (
    <div className="flex items-center">
      <h1 className="text-4xl font-serif font-bold text-white">
        Montse
      </h1>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="36"
        height="36"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="text-blue-200 transform translate-y-2 -ml-1"
      >
        <circle cx="12" cy="12" r="6" />
      </svg>
    </div>
  );
};

export default Logo;