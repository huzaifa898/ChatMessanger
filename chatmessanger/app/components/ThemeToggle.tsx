"use client";

import { useTheme } from "@/context/ThemeContext";
import { MdLightMode, MdDarkMode } from "react-icons/md";

const ThemeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className="
        p-2 
        rounded-full 
        hover:bg-gray-100 
        dark:hover:bg-gray-700 
        transition
        fixed
        bottom-4
        right-4
        z-50
        bg-white
        dark:bg-gray-800
        shadow-lg
        flex
        items-center
        justify-center
      "
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? (
        <MdLightMode className="h-6 w-6 text-yellow-500" />
      ) : (
        <MdDarkMode className="h-6 w-6 text-gray-500" />
      )}
    </button>
  );
};

export default ThemeToggle; 