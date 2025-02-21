"use client";

import useConversation from "@/hooks/useConversation";
import useRoutes from "@/hooks/useRoutes";
import MobileItem from "./MobileItem";
import { useTheme } from "@/context/ThemeContext";
import { MdLightMode, MdDarkMode } from "react-icons/md";

const MobileFooter = () => {
  const routes = useRoutes();
  const { isOpen } = useConversation();
  const { isDarkMode, toggleDarkMode } = useTheme();

  if (isOpen) {
    return null;
  }

  return ( 
    <div
      className="
        fixed
        justify-between
        w-full
        bottom-0
        z-40
        flex
        items-center
        bg-white
        dark:bg-gray-900
        border-t-[1px]
        lg:hidden
      "
    >
      {routes.map((route) => (
        <MobileItem
          key={route.href}
          href={route.href}
          active={route.active}
          icon={route.icon}
          onClick={route.onClick}
        />
      ))}
      <div
        onClick={toggleDarkMode}
        className="cursor-pointer hover:opacity-75 transition p-4"
      >
        {isDarkMode ? (
          <MdLightMode className="h-6 w-6 text-yellow-500" />
        ) : (
          <MdDarkMode className="h-6 w-6 text-gray-500" />
        )}
      </div>
    </div>
   );
}
 
export default MobileFooter;