import React from "react";
import Logo from "../assets/DALogo.png"; // make sure this path is correct

const Navbar = ({ step = 0, totalSteps = 3 }) => {
  const progressPercent = ((step + 1) / totalSteps) * 100;

  return (
    <nav className="w-full bg-white shadow-md py-4 px-6 flex flex-col items-center fixed top-0 left-0 z-50">
      {/* Logo */}
      <img src={Logo} alt="Logo" className="h-24 w-auto mb-3" />

      {/* Progress Bar */}
      <div className="w-full max-w-6xl">
        <div className="w-full bg-gray-300 h-2 rounded-full">
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%`, backgroundColor: "#2e3192" }}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
