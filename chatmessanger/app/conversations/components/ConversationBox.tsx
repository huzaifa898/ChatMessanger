'use client'
import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Conversation, Message, User } from "@prisma/client";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import { FullConversationType } from "@/types";
import useOtherUser from "@/hooks/useOtherUser";
import Avatar from "@/components/Avatar";
import AvatarGroup from "@/components/AvatarGroup";

interface ConversationBoxProps {
    data: FullConversationType,
    selected?: boolean,
}
const ConversationBox : React.FC <ConversationBoxProps> = ({ 
     data,
     selected
 }) => {
    const otherUser = useOtherUser(data);
    const session = useSession();
    const router = useRouter();

    const handleClick = useCallback(() => {
        router.push(`/conversations/${data.id}`)
 }, [data.id , router]);

   const lastMessage = useMemo(() => {
      const messages = data.messages || [];

      return messages[messages.length - 1]
   },[data.messages]);

   const userEmail = useMemo(() => {
           return session.data?.user?.email;
   } , [session.data?.user?.email]);

   const hasSeen = useMemo(() => {
      if(!lastMessage){
        return false;
      }
      const seenArray = lastMessage.seen || [];
      if(!userEmail){
        return false;
      }

      return seenArray.filter((user) => user.email === userEmail).length !== 0;
   } , [userEmail , lastMessage]);

   const lastMessageText = useMemo(() => {
      if(lastMessage?.image){
          return 'sent and image';
      }

      if(lastMessage?.body){
        return lastMessage.body;
      }
       
      return "started a conversation"
   },[lastMessage]);
    return (
           
        <div
        onClick={handleClick}
        className={clsx(`
          w-full 
          relative 
          flex 
          items-center 
          space-x-3 
          p-3 
          hover:bg-neutral-100
          dark:hover:bg-gray-800
          rounded-lg
          transition
          cursor-pointer
        `,
          selected ? 'bg-neutral-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'
        )}
      >


           {data.isGroup ?(
            <AvatarGroup users={data.users}/>
           ) :(
            <Avatar user={otherUser} />
           )}
           
          
        <div className="min-w-0 flex-1">
          <div className="focus:outline-none">
            <div
              className="
                flex
                justify-between
                items-center
                mb-1
              "
            >
              <div className="flex flex-col">
                <div className="text-md font-medium text-gray-900 dark:text-gray-100">
                  {data.name || otherUser.name}
                </div>
                {lastMessage?.createdAt && (
                  <p
                    className="
                      text-xs
                      text-gray-400
                      font-light
                    "
                  >
                    {format(new Date(lastMessage.createdAt), 'p')}
                  </p>
                )}
              </div>
            </div>
            <p
              className={clsx(`
                truncate
                text-sm
              `,
                hasSeen ? 'text-gray-500 dark:text-gray-400' : 'text-black font-medium dark:text-gray-100'
              )}
            >
              {lastMessageText}
            </p>
          </div>
        </div>
      </div>

        );
}
export default ConversationBox;