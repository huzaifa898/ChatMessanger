"use client";

import { useMemo } from "react";
import { HiChevronLeft } from "react-icons/hi";
import { HiEllipsisHorizontal } from "react-icons/hi2";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MdLightMode, MdDarkMode } from "react-icons/md";

import { useTheme } from "@/context/ThemeContext";
import useOtherUser from "@/hooks/useOtherUser";
import useActiveList from "@/hooks/useActiveList";

import Avatar from "./Avatar";
import AvatarGroup from "./AvatarGroup";
import ProfileDrawer from "./ProfileDrawer";
import { Conversation, User } from "@prisma/client";
import { useState } from "react";

interface HeaderProps {
  conversation: Conversation & {
    users: User[]
  }
}

const Header: React.FC<HeaderProps> = ({ conversation }) => {
  const otherUser = useOtherUser(conversation);
  const router = useRouter();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { members } = useActiveList();
  const isActive = members.indexOf(otherUser?.email!) !== -1;

  const statusText = useMemo(() => {
    if (conversation.isGroup) {
      return `${conversation.users.length} members`;
    }

    return isActive ? 'Active' : 'Offline';
  }, [conversation, isActive]);

  return (
    <div className="bg-white dark:bg-gray-800 w-full flex border-b-[1px] sm:px-4 py-3 px-4 lg:px-6 justify-between items-center shadow-sm">
      <div className="flex gap-3 items-center">
        <Link
          href="/conversations" 
          className="lg:hidden block text-sky-500 hover:text-sky-600 transition cursor-pointer"
        >
          <HiChevronLeft size={32} />
        </Link>
        {conversation.isGroup ? (
          <AvatarGroup users={conversation.users} />
        ) : (
          <Avatar user={otherUser} />
        )}
        <div className="flex flex-col">
          <div className="text-gray-900 dark:text-gray-100">{conversation.name || otherUser.name}</div>
          <div className="text-sm font-light text-neutral-500 dark:text-neutral-400">
            {statusText}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          {isDarkMode ? (
            <MdLightMode className="h-6 w-6 text-yellow-500" />
          ) : (
            <MdDarkMode className="h-6 w-6 text-gray-500" />
          )}
        </button>
        <HiEllipsisHorizontal
          size={32}
          onClick={() => setDrawerOpen(true)}
          className="text-sky-500 dark:text-sky-400 cursor-pointer hover:text-sky-600 dark:hover:text-sky-500 transition"
        />
      </div>
      <ProfileDrawer 
        data={conversation} 
        isOpen={drawerOpen} 
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}

export default Header; 