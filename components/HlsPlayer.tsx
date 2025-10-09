// components/HlsPlayer.tsx
"use client";

import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface HlsPlayerProps {
  src: string;
}

const HlsPlayer: React.FC<HlsPlayerProps> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play();
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // For Safari, which has native HLS support
        video.src = src;
        video.addEventListener('loadedmetadata', () => {
          video.play();
        });
      }
    }
  }, [src]);

  return (
    <video
      ref={videoRef}
      controls
      autoPlay
      className="w-full max-w-4xl max-h-[80vh]"
    />
  );
};

export default HlsPlayer;