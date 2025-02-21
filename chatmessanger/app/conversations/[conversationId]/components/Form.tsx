"use client";

import useConversation from "@/hooks/useConversation";
import axios from "axios";
import { 
  FieldValues, 
  SubmitHandler, 
  useForm
} from "react-hook-form";
import { HiPaperAirplane, HiPhoto } from "react-icons/hi2";
import { MdMic, MdStop, MdVideoCall, MdAttachFile } from "react-icons/md";
import { CldUploadButton } from "next-cloudinary";
import MessageInput from "./MessageInput";
import { useState, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";

const Form = () => {
  const { conversationId } = useConversation();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [showAttachments, setShowAttachments] = useState(false);
  const audioRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { isDarkMode } = useTheme();

  const {
    register,
    handleSubmit,
    setValue,
    formState: {
      errors,
    }
  } = useForm<FieldValues>({
    defaultValues: {
      message: ''
    }
  });

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleUpload = (result: any) => {
    axios.post('/api/messages', {
      image: result?.info?.secure_url,
      conversationId
    });
  };

  const uploadToCloudinary = async (file: File | Blob, resourceType: string = 'auto') => {
    const formData = new FormData();
    formData.append('file', file);
    const timestamp = Math.round((new Date).getTime()/1000);

    try {
      const signResponse = await axios.get('/api/cloudinary/signature', {
        params: {
          timestamp,
          folder: 'chat_attachments'
        }
      });

      const { signature, apiKey, cloudName } = signResponse.data;

      formData.append('timestamp', timestamp.toString());
      formData.append('signature', signature);
      formData.append('api_key', apiKey);
      formData.append('folder', 'chat_attachments');

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Upload failed: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      audioRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        try {
          const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
          const formData = new FormData();
          formData.append('file', audioBlob);
          
          const timestamp = Math.round((new Date).getTime()/1000);
          const signResponse = await axios.get('/api/cloudinary/signature', {
            params: {
              timestamp,
              folder: 'chat_attachments'
            }
          });

          const { signature, apiKey, cloudName } = signResponse.data;
          formData.append('timestamp', timestamp.toString());
          formData.append('signature', signature);
          formData.append('api_key', apiKey);
          formData.append('folder', 'chat_attachments');

          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
            {
              method: 'POST',
              body: formData
            }
          );

          if (!response.ok) {
            throw new Error('Failed to upload audio');
          }

          const data = await response.json();
          
          await axios.post('/api/messages', {
            audio: data.secure_url,
            conversationId
          });
        } catch (error) {
          console.error('Error uploading audio:', error);
        } finally {
          stream.getTracks().forEach(track => track.stop());
          setRecordingDuration(0);
          setIsRecording(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (audioRef.current && isRecording) {
      audioRef.current.stop();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const videoUrl = await uploadToCloudinary(file, 'video');
      await axios.post('/api/messages', {
        video: videoUrl,
        conversationId
      });
    } catch (error) {
      console.error('Error uploading video:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const fileUrl = await uploadToCloudinary(file, 'raw');
      await axios.post('/api/messages', {
        file: fileUrl,
        fileName: file.name,
        fileType: file.type,
        conversationId
      });
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue('message', '', { shouldValidate: true });
    axios.post('/api/messages', {
      message: data.message,
      conversationId
    });
  };

  return ( 
    <div className="py-4 px-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700 flex items-center gap-2 lg:gap-4 w-full relative">
      <div className="relative">
        <button
          onClick={() => setShowAttachments(!showAttachments)}
          type="button"
          className="text-sky-500 hover:text-sky-600 dark:text-sky-400 dark:hover:text-sky-500 transition"
        >
          <MdAttachFile size={30} className="transform rotate-45" />
        </button>
        
        {showAttachments && (
          <div className="absolute bottom-12 left-0 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-2 flex flex-col gap-2 z-50">
            <CldUploadButton
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
              onUpload={handleUpload}
            >
              <div className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
                <HiPhoto size={20} className="text-sky-500 dark:text-sky-400" />
                <span className="dark:text-white">Photo</span>
              </div>
            </CldUploadButton>

            <label className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
              <MdVideoCall size={20} className="text-sky-500 dark:text-sky-400" />
              <span className="dark:text-white">Video</span>
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleVideoUpload}
              />
            </label>

            <label className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
              <MdAttachFile size={20} className="text-sky-500 dark:text-sky-400" />
              <span className="dark:text-white">Document</span>
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>
        )}
      </div>

      {isRecording ? (
        <div className="flex items-center gap-4 flex-1 bg-red-50 dark:bg-red-900/20 rounded-full px-4 py-2">
          <div className="animate-pulse text-red-500">●</div>
          <span className="text-red-500">{formatDuration(recordingDuration)}</span>
          <button
            type="button"
            onClick={stopRecording}
            className="text-red-500 hover:text-red-600 ml-auto"
          >
            <MdStop size={24} />
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex items-center gap-2 lg:gap-4 w-full"
        >
          <MessageInput
            id="message"
            register={register}
            errors={errors}
            required
            placeholder="Write a message"
          />
          <button
            type="button"
            onClick={startRecording}
            className="text-sky-500 hover:text-sky-600 dark:text-sky-400 dark:hover:text-sky-500 transition"
          >
            <MdMic size={30} />
          </button>
          <button
            type="submit"
            className="rounded-full p-2 bg-sky-500 hover:bg-sky-600 transition"
          >
            <HiPaperAirplane
              size={18}
              className="text-white"
            />
          </button>
        </form>
      )}
    </div>
   );
}
 
export default Form;