"use client";

import Avatar from "@/components/Avatar";
import { FullMessageType } from "@/types";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import Image from "next/image";
import { useState } from "react";
import ImageModal from "./ImageModal";
import MediaMessage from './MediaMessage';

interface MessageBoxProps {
  data: FullMessageType;
  isLast?: boolean;
}

const MessageBox: React.FC<MessageBoxProps> = ({
  data,
  isLast
}) => {
  const session = useSession();
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const isOwn = session?.data?.user?.email === data?.sender?.email;
  const seenList = (data.seen || [])
    .filter((user) => user.email !== data?.sender?.email)
    .map((user) => user.name)
    .join(', ');

  const container = clsx(
    "flex gap-3 p-4",
    isOwn && "justify-end"
  );

  const avatar = clsx(isOwn && "order-2");

  const body = clsx(
    "flex flex-col gap-2",
    isOwn && "items-end"
  );

  const messageClasses = clsx(
    "text-sm w-fit overflow-hidden",
    isOwn 
      ? 'bg-sky-500 text-white' 
      : 'bg-gray-100 dark:bg-gray-700 dark:text-white',
    data.body ? 'rounded-full py-2 px-3' : 'rounded-md p-0'
  );

  return ( 
    <div className={container}>
      <div className={avatar}>
        <Avatar user={data.sender} />
      </div>
      <div className={body}>
        <div className="flex items-center gap-1">
          <div className={`text-sm text-gray-500 dark:text-gray-400`}>
            {data.sender.name}
          </div>
          <div className="text-xs text-gray-400">
            {format(new Date(data.createdAt), 'p')}
          </div>
        </div>
        <div className={messageClasses}>
          {data.body && (
            <div className="px-3 py-2">{data.body}</div>
          )}
          {data.image && (
            <div className="relative">
              <ImageModal
                src={data.image}
                isOpen={imageModalOpen}
                onClose={() => setImageModalOpen(false)}
              />
              <div className="relative w-[288px] h-[288px]">
                <Image
                  onClick={() => setImageModalOpen(true)}
                  alt="Image"
                  fill
                  src={data.image}
                  className="object-cover cursor-pointer hover:scale-105 transition"
                />
              </div>
              <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                Photo
              </div>
            </div>
          )}
          {data.video && (
            <div className="relative">
              <div className="max-w-[288px] rounded-lg overflow-hidden">
                <video 
                  controls 
                  className="w-full max-h-[400px]"
                  preload="metadata"
                >
                  <source src={data.video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                Video
              </div>
            </div>
          )}
          {data.audio && (
            <div className={`flex items-center gap-2 p-3 ${isOwn ? 'bg-sky-600' : 'bg-gray-200'} rounded-lg min-w-[240px]`}>
              <MediaMessage 
                type="audio"
                url={data.audio}
                isOwn={isOwn}
              />
              <div className={`text-xs ${isOwn ? 'text-sky-100' : 'text-gray-500'}`}>
                Voice message
              </div>
            </div>
          )}
          {data.file && (
            <div className={`flex items-center gap-3 p-3 ${isOwn ? 'bg-sky-600' : 'bg-gray-200'} rounded-lg min-w-[240px]`}>
              <MediaMessage
                type="file"
                url={data.file}
                isOwn={isOwn}
                fileName={data.fileName}
                fileType={data.fileType}
              />
            </div>
          )}
        </div>
        {isLast && isOwn && seenList.length > 0 && (
          <div className="text-xs font-light text-gray-500">
            {`Seen by ${seenList}`}
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageBox;