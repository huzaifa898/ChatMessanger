import { NextResponse } from "next/server";
import cloudinary from "@/libs/cloudinary";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const timestamp = searchParams.get('timestamp');
  const folder = searchParams.get('folder');

  try {
    const params = {
      timestamp: parseInt(timestamp || '0'),
      folder: folder || 'chat_attachments'
    };

    const signature = cloudinary.utils.api_sign_request(
      params,
      process.env.CLOUDINARY_API_SECRET!
    );

    return NextResponse.json({
      signature,
      timestamp: params.timestamp,
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY
    });
  } catch (error) {
    console.error('Signature error:', error);
    return new NextResponse('Error', { status: 500 });
  }
} 