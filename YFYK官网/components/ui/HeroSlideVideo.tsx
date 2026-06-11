"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const REVEAL_FADE_MS = 750;

interface HeroSlideVideoProps {
  isPlaying: boolean;
  src: string;
}

export function HeroSlideVideo({ isPlaying, src }: HeroSlideVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMediaReady, setIsMediaReady] = useState(false);
  const [hasLoadError, setHasLoadError] = useState(false);
  const isPlayingRef = useRef(isPlaying);
  const hasLoadErrorRef = useRef(false);
  const wasPlayingRef = useRef(false);

  isPlayingRef.current = isPlaying;

  useEffect(() => {
    setIsMediaReady(false);
    setHasLoadError(false);
    hasLoadErrorRef.current = false;
  }, [src]);

  const attemptPlay = useCallback(async () => {
    const video = videoRef.current;
    if (!video || !isPlayingRef.current || hasLoadErrorRef.current) return false;

    try {
      if (video.paused) {
        await video.play();
      }
      return !video.paused;
    } catch {
      return false;
    }
  }, []);

  const revealMedia = useCallback(() => {
    const video = videoRef.current;
    if (!video || hasLoadErrorRef.current || !isPlayingRef.current) return;
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && !video.paused) {
      setIsMediaReady(true);
    }
  }, []);

  const pauseVideo = useCallback(() => {
    videoRef.current?.pause();
  }, []);

  const handleLoadError = useCallback(() => {
    hasLoadErrorRef.current = true;
    setHasLoadError(true);
    setIsMediaReady(false);
    pauseVideo();
  }, [pauseVideo]);

  const resetPlayback = useCallback(() => {
    if (hasLoadErrorRef.current) return;

    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    void attemptPlay().then((playing) => {
      if (playing) revealMedia();
    });
  }, [attemptPlay, revealMedia]);

  const handleVideoReady = useCallback(() => {
    if (!isPlayingRef.current || hasLoadErrorRef.current) return;

    void attemptPlay().then((playing) => {
      if (playing) revealMedia();
    });
  }, [attemptPlay, revealMedia]);

  useEffect(() => {
    if (!isPlaying || hasLoadError) return;

    const video = videoRef.current;
    if (video && video.readyState === HTMLMediaElement.HAVE_NOTHING) {
      video.load();
    }
  }, [hasLoadError, isPlaying, src]);

  useEffect(() => {
    if (isPlaying) {
      if (!wasPlayingRef.current) {
        resetPlayback();
      } else {
        void attemptPlay().then((playing) => {
          if (playing) revealMedia();
        });
      }
      wasPlayingRef.current = true;
      return;
    }

    wasPlayingRef.current = false;
    pauseVideo();
  }, [attemptPlay, isPlaying, pauseVideo, resetPlayback, revealMedia, src]);

  const stackClassName = [
    "hero-slide-video-stack",
    isMediaReady && !hasLoadError ? "is-ready" : "",
    hasLoadError ? "is-unavailable" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={stackClassName} style={{ transitionDuration: `${REVEAL_FADE_MS}ms` }}>
      <video
        ref={videoRef}
        autoPlay={isPlaying && !hasLoadError}
        className="hero-slide-video is-visible"
        loop
        muted
        playsInline
        preload={isPlaying ? "auto" : "none"}
        src={src}
        onCanPlay={handleVideoReady}
        onError={handleLoadError}
        onPlaying={revealMedia}
      />
    </div>
  );
}
