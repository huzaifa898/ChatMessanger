'use client'
import useRoutes from "@/hooks/useRoutes"
import { useState } from "react"
import DesktopItem from "./DesktopItem"
import {User} from "@prisma/client"
import Avatar from "../Avatar"
import SettingModal from "./SettingsModal"
import { MdLightMode, MdDarkMode } from "react-icons/md"
import { useTheme } from "@/context/ThemeContext"

interface DesktopSidebarProps{
    currentUser: User
}

const DesktopSidebar : React.FC<DesktopSidebarProps> = ({currentUser}) => {
    const routes = useRoutes();
    const [isOpen, setIsOpen] = useState(false);
    const { isDarkMode, toggleDarkMode } = useTheme();

    console.log({currentUser})
    return(
      <>
      <SettingModal
         currentUser = {currentUser}
         isOpen = {isOpen}
         onClose ={() => setIsOpen(false)}
      />
        <div className="
           hidden
          lg:fixed
          lg:inset-y-0
          lg:left-0
          lg:z-40
          lg:w-20
          xl:px-6
          lg:overflow-y-auto
          lg:bg-white
          dark:lg:bg-gray-900
          lg:border-r-[1px]
          lg:pb-4
          lg:flex
          lg:flex-col
          justify-between
        ">
            <nav
          className="
            mt-4
            flex
            flex-col
            justify-between
          "
        >
          <ul
            role="list"
            className="
              flex
              flex-col
              items-center
              space-y-1
            "
          >
            {routes.map((item) => (
              <DesktopItem
                key={item.label}
                href={item.href}
                label={item.label}
                icon={item.icon}
                active={item.active}
                onClick={item.onClick}
              />
            ))}
          </ul>
        </nav>
        <nav
          className="
            mt-4
            flex
            flex-col
            justify-between
            items-center
          "
        >
          <div
            onClick={toggleDarkMode}
            className="
              cursor-pointer
              hover:opacity-75
              transition
            "
          >
            {isDarkMode ? (
              <MdLightMode className="h-6 w-6 text-yellow-500" />
            ) : (
              <MdDarkMode className="h-6 w-6 text-gray-500" />
            )}
          </div>
          <div
            onClick={() => setIsOpen(true)}
            className="
              cursor-pointer
              hover:opacity-75
              transition
              mt-4
            "
          >
            <Avatar user={currentUser} />
          </div>
        </nav>
        </div>
        </>
    );
}
export default DesktopSidebar;