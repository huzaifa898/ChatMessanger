import { Conversation, Message, User } from "@prisma/client";

export type FullMessageType = Message & {
  sender: User,
  seen: User[],
  audio?: string,
  video?: string,
  file?: string,
  fileName?: string,
  fileType?: string
};

export type FullConversationType = Conversation & {
  users: User[],
  messages: FullMessageType[],
};