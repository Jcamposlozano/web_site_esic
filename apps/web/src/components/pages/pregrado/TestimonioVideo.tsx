import { useEffect, useRef, useState } from "react";

interface Props {
  src: string;
}

function fmt(s: number) {
  s = Math.floor(s || 0);
  const m = Math.floor(s / 60);
  const ss = s % 60;
  return `${m}:${ss < 10 ? "0" : ""}${ss}`;
}

/**
 * Reproductor de video de testimonios con controles personalizados.
 * Replica el comportamiento del player inline del WordPress (play/pausa,
 * barra de progreso, mute, fullscreen, overlay de play central, naranja).
 */
export default function TestimonioVideo({ src }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [progress, setProgress] = useState(0);
  const [time, setTime] = useState("0:00 / 0:00");

  const flashControls = () => {
    setShowControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowControls(false), 3000);
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play();
    else v.pause();
  };

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => {
      setTime(`${fmt(v.currentTime)} / ${fmt(v.duration)}`);
      setProgress(v.duration ? (v.currentTime / v.duration) * 100 : 0);
    };
    const onPlay = () => {
      setPlaying(true);
      flashControls();
    };
    const onPause = () => {
      setPlaying(false);
      setShowControls(true);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onTime);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("ended", onPause);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadedmetadata", onTime);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("ended", onPause);
    };
  }, []);

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    v.currentTime = ratio * v.duration;
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else wrapRef.current?.requestFullscreen?.();
  };

  return (
    <div
      ref={wrapRef}
      className="epm-video relative rounded-3xl overflow-hidden aspect-video bg-black cursor-pointer"
      onMouseMove={flashControls}
      onClick={(e) => {
        if (e.target === e.currentTarget) togglePlay();
      }}
    >
      <video
        ref={videoRef}
        src={src}
        preload="metadata"
        playsInline
        className="w-full h-full object-cover object-[center_30%]"
        onClick={togglePlay}
      />

      {/* Center play overlay */}
      <div
        className={`absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity z-[2] ${
          playing ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        onClick={togglePlay}
      >
        <button
          type="button"
          aria-label="Reproducir"
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          className="w-[72px] h-[72px] rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-transform hover:scale-105 backdrop-blur"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-[26px] h-[26px] text-brand-orange ml-1">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        </button>
      </div>

      {/* Control bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-[3] bg-gradient-to-t from-black/70 to-transparent px-4 pt-8 pb-3 transition-opacity ${
          showControls || !playing ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="w-full h-1 bg-white/30 rounded cursor-pointer mb-2 relative hover:h-1.5"
          onClick={seek}
          role="slider"
          aria-label="Progreso"
          aria-valuenow={Math.round(progress)}
          tabIndex={0}
        >
          <div className="h-full bg-brand-orange rounded pointer-events-none" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Reproducir / Pausar"
            onClick={togglePlay}
            className="w-[30px] h-[30px] flex items-center justify-center text-white opacity-85 hover:opacity-100 hover:scale-110 transition"
          >
            {playing ? (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-[17px] h-[17px]">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-[17px] h-[17px]">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            )}
          </button>
          <span className="text-[0.75rem] text-white/80 tracking-wide whitespace-nowrap">{time}</span>
          <div className="ml-auto flex gap-1">
            <button
              type="button"
              aria-label="Silenciar"
              onClick={toggleMute}
              className="w-[30px] h-[30px] flex items-center justify-center text-white opacity-85 hover:opacity-100 hover:scale-110 transition"
            >
              {muted ? (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-[17px] h-[17px]">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" strokeWidth="2" />
                  <line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" strokeWidth="2" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-[17px] h-[17px]">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              )}
            </button>
            <button
              type="button"
              aria-label="Pantalla completa"
              onClick={toggleFullscreen}
              className="w-[30px] h-[30px] flex items-center justify-center text-white opacity-85 hover:opacity-100 hover:scale-110 transition"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[17px] h-[17px]">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
