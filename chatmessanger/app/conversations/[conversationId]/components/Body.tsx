"use client";

import { useEffect, useRef, useState } from "react";

import useConversation from "@/hooks/useConversation";
import { FullMessageType } from "@/types";

import MessageBox from "./MessageBox";
import axios from "axios";
import { pusherClient } from "@/libs/pusher";
import { find } from "lodash";

interface BodyProps {
  initialMessages: FullMessageType[]
}

const getMessagePreview = (message: FullMessageType) => {
  if (message.body) {
    return message.body;
  }
  if (message.image) {
    return '📷 Photo';
  }
  if (message.video) {
    return '🎥 Video';
  }
  if (message.audio) {
    return '🎵 Voice message';
  }
  if (message.file) {
    return `📎 ${message.fileName || 'Document'}`;
  }
  return '';
};

const Body: React.FC<BodyProps> = ({
  initialMessages
}) => {
  const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { conversationId } = useConversation();

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`)
  }, [conversationId]);

  useEffect(() => {
    pusherClient.subscribe(conversationId);
    bottomRef?.current?.scrollIntoView({ behavior: 'smooth' });

    const messageHandler = (message: FullMessageType) => {
      axios.post(`/api/conversations/${conversationId}/seen`)

      setMessages((current) => {
        if (find(current, { id: message.id })) {
          return current;
        }

        return [...current, message];
      });

      bottomRef?.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages((current) => current.map((currentMessage) => {
        if (currentMessage.id === newMessage.id) {
          return newMessage;
        }

        return currentMessage;
      }));
    };

    pusherClient.bind('messages:new', messageHandler);
    pusherClient.bind('message:update', updateMessageHandler)

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind('messages:new', messageHandler);
      pusherClient.unbind('message:update', updateMessageHandler);
    }
  }, [conversationId]);
  
  return ( 
    <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-900">
      {messages.map((message, i) => (
        <div key={message.id}>
          <MessageBox
            isLast={i === messages.length - 1}
            data={message}
          />
          {message.image && (
            <div className="text-xs text-gray-400 text-center mt-1">
              Photo
            </div>
          )}
          {message.video && (
            <div className="text-xs text-gray-400 text-center mt-1">
              Video
            </div>
          )}
          {message.audio && (
            <div className="text-xs text-gray-400 text-center mt-1">
              Voice message
            </div>
          )}
          {message.file && (
            <div className="text-xs text-gray-400 text-center mt-1">
              {message.fileName || 'Document'}
            </div>
          )}
        </div>
      ))}
      <div ref={bottomRef} className="pt-24" />
    </div>
   );
}
 
export default Body;