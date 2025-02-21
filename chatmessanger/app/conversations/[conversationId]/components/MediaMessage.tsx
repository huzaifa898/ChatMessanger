import { useState, useRef, useEffect } from 'react';
import { IoPlay, IoPause, IoDownload } from 'react-icons/io5';
import { BsFileEarmark, BsFileEarmarkText, BsFileEarmarkPdf } from 'react-icons/bs';
import Image from 'next/image';

interface MediaMessageProps {
  type: 'audio' | 'video' | 'file';
  url: string;
  isOwn: boolean;
  fileName?: string;
  fileType?: string;
}

const MediaMessage: React.FC<MediaMessageProps> = ({ 
  type, 
  url, 
  isOwn,
  fileName,
  fileType 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (type === 'audio' && audioRef.current) {
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current?.duration || 0);
      });
      
      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      });

      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });
    }
  }, [type]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFileIcon = () => {
    if (fileType?.includes('pdf')) return <BsFileEarmarkPdf size={24} />;
    if (fileType?.includes('text')) return <BsFileEarmarkText size={24} />;
    return <BsFileEarmark size={24} />;
  };

  if (type === 'audio') {
    return (
      <div className={`flex items-center gap-2 p-3 rounded-lg ${isOwn ? 'bg-sky-500' : 'bg-gray-100'}`}>
        <button
          onClick={() => {
            if (audioRef.current) {
              if (isPlaying) {
                audioRef.current.pause();
              } else {
                audioRef.current.play();
              }
              setIsPlaying(!isPlaying);
            }
          }}
          className={`rounded-full p-2 ${isOwn ? 'text-white' : 'text-sky-500'}`}
        >
          {isPlaying ? <IoPause size={20} /> : <IoPlay size={20} />}
        </button>
        
        <div className="flex flex-col flex-grow gap-1">
          <div 
            ref={progressRef}
            className={`h-1 rounded-full cursor-pointer ${isOwn ? 'bg-sky-400' : 'bg-gray-300'}`}
            onClick={(e) => {
              if (progressRef.current && audioRef.current) {
                const rect = progressRef.current.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const percentage = x / rect.width;
                audioRef.current.currentTime = percentage * duration;
              }
            }}
          >
            <div
              className={`h-full rounded-full ${isOwn ? 'bg-white' : 'bg-sky-500'}`}
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
          <span className={`text-xs ${isOwn ? 'text-white' : 'text-gray-500'}`}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
        
        <audio ref={audioRef} src={url} preload="metadata" className="hidden" />
      </div>
    );
  }

  if (type === 'video') {
    return (
      <div className="rounded-lg overflow-hidden max-w-sm">
        <video 
          controls 
          className="w-full"
          style={{ maxHeight: '400px' }}
          preload="metadata"
        >
          <source src={url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  if (type === 'file') {
    return (
      <div className={`flex items-center gap-3 p-3 rounded-lg ${isOwn ? 'bg-sky-500' : 'bg-gray-100'}`}>
        <div className={`${isOwn ? 'text-white' : 'text-sky-500'}`}>
          {getFileIcon()}
        </div>
        <div className={`flex-1 ${isOwn ? 'text-white' : 'text-gray-900'}`}>
          <p className="font-medium truncate max-w-[200px]">{fileName}</p>
          <p className="text-xs opacity-75">{fileType}</p>
        </div>
        <button
          onClick={handleDownload}
          className={`p-2 rounded-full ${isOwn ? 'text-white hover:bg-sky-600' : 'text-sky-500 hover:bg-gray-200'}`}
        >
          <IoDownload size={20} />
        </button>
      </div>
    );
  }

  return null;
};

export default MediaMessage; 