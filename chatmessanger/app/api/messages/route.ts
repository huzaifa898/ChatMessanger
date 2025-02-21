import getCurrentUser from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";
import { pusherServer } from "@/libs/pusher";

export async function POST(
  request: Request
) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const {
      message,
      image,
      audio,
      video,
      file,
      fileName,
      fileType,
      conversationId
    } = body;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const messageData: any = {
      conversation: {
        connect: { id: conversationId }
      },
      sender: {
        connect: { id: currentUser.id }
      },
      seen: {
        connect: {
          id: currentUser.id
        }
      }
    };

    // Only add fields that are present
    if (message) messageData.body = message;
    if (image) messageData.image = image;
    if (audio) messageData.audio = audio;
    if (video) messageData.video = video;
    if (file) messageData.file = file;
    if (fileName) messageData.fileName = fileName;
    if (fileType) messageData.fileType = fileType;

    const newMessage = await prisma.message.create({
      data: messageData,
      include: {
        seen: true,
        sender: true,
      }
    });

    const updatedConversation = await prisma.conversation.update({
      where: {
        id: conversationId
      },
      data: {
        lastMessageAt: new Date(),
        messages: {
          connect: {
            id: newMessage.id
          }
        }
      },
      include: {
        users: true,
        messages: {
          include: {
            seen: true
          }
        }
      }
    });

    await pusherServer.trigger(conversationId, 'messages:new', newMessage);

    const lastMessage = updatedConversation.messages[updatedConversation.messages.length - 1];

    updatedConversation.users.map((user) => {
      pusherServer.trigger(user.email!, 'conversation:update', {
        id: conversationId,
        messages: [lastMessage]
      })
    });

    return NextResponse.json(newMessage);
  } catch (error: any) {
    console.log(error, 'ERROR_MESSAGES');
    return new NextResponse('InternalError', { status: 500 });
  }
}