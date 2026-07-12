'use client';

import { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import Vimeo from '@u-wave/react-vimeo';
import { parseVideoUrl } from '@/lib/videoParser';

interface SmartPlayerProps {
  url: string;
}

export interface SmartPlayerRef {
  getCurrentTime: () => Promise<number>;
  seekTo: (seconds: number) => Promise<void>;
}

const SmartPlayer = forwardRef<SmartPlayerRef, SmartPlayerProps>(({ url }, ref) => {
  const [isMounted, setIsMounted] = useState(false);
  const parsed = parseVideoUrl(url);

  // Refs to hold the actual underlying SDK player instances
  const ytPlayerRef = useRef<any>(null);
  const vimeoPlayerRef = useRef<any>(null); // To store the Vimeo SDK player
  const html5Ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useImperativeHandle(ref, () => ({
    getCurrentTime: async () => {
      if (parsed.provider === 'youtube' && ytPlayerRef.current) {
        return ytPlayerRef.current.getCurrentTime(); // synchronous, but we can return it as a promise implicitly
      }
      if (parsed.provider === 'vimeo' && vimeoPlayerRef.current) {
        return vimeoPlayerRef.current.getCurrentTime(); // returns Promise<number>
      }
      if ((parsed.provider === 'mp4' || parsed.provider === 'unknown') && html5Ref.current) {
        return html5Ref.current.currentTime;
      }
      return 0;
    },
    seekTo: async (seconds: number) => {
      if (parsed.provider === 'youtube' && ytPlayerRef.current) {
        ytPlayerRef.current.seekTo(seconds, true);
      } else if (parsed.provider === 'vimeo' && vimeoPlayerRef.current) {
        await vimeoPlayerRef.current.setCurrentTime(seconds);
      } else if ((parsed.provider === 'mp4' || parsed.provider === 'unknown') && html5Ref.current) {
        html5Ref.current.currentTime = seconds;
      }
    }
  }));

  if (!isMounted) return null;

  if (parsed.provider === 'youtube') {
    return (
      <YouTube
        videoId={parsed.id}
        opts={{ width: '100%', height: '100%' }}
        onReady={(event) => { ytPlayerRef.current = event.target; }}
        className="w-full h-full"
        iframeClassName="w-full h-full"
      />
    );
  }

  if (parsed.provider === 'vimeo') {
    return (
      <Vimeo
        video={parsed.id}
        responsive
        className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full"
        onReady={(player: any) => { vimeoPlayerRef.current = player; }}
      />
    );
  }

  // Fallback to HTML5 for mp4 or unknown URLs
  return (
    <video
      ref={html5Ref}
      src={parsed.provider === 'unknown' ? url : parsed.embedUrl}
      controls
      className="w-full h-full outline-none"
    />
  );
});

SmartPlayer.displayName = 'SmartPlayer';

export default SmartPlayer;
