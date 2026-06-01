import { useEffect, useRef, useState } from "react";

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);
const PauseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
    <line x1="6" y1="4" x2="6" y2="20" />
    <line x1="18" y1="4" x2="18" y2="20" />
  </svg>
);
const MutedIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <line x1="23" y1="9" x2="17" y2="15" />
    <line x1="17" y1="9" x2="23" y2="15" />
  </svg>
);
const UnmutedIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
);
const FullIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
    <polyline points="15 3 21 3 21 9" />
    <polyline points="9 21 3 21 3 15" />
    <line x1="21" y1="3" x2="14" y2="10" />
    <line x1="3" y1="21" x2="10" y2="14" />
  </svg>
);

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec < 10 ? "0" : ""}${sec}`;
}

export default function HatsuHeroVideo({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [pct, setPct] = useState(0);
  const [time, setTime] = useState("0:00");

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => {
      if (v.duration) {
        setPct((v.currentTime / v.duration) * 100);
        setTime(fmt(v.currentTime));
      }
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
    };
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play();
    else v.pause();
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    const bar = progRef.current;
    if (!v || !bar || !v.duration) return;
    const rect = bar.getBoundingClientRect();
    v.currentTime = ((e.clientX - rect.left) / rect.width) * v.duration;
  };

  const goFull = () => {
    const v = videoRef.current as (HTMLVideoElement & { webkitEnterFullScreen?: () => void }) | null;
    if (!v) return;
    if (v.requestFullscreen) v.requestFullscreen();
    else if (v.webkitEnterFullScreen) v.webkitEnterFullScreen();
  };

  const btnBase =
    "grid h-8 w-8 flex-none cursor-pointer place-items-center rounded-full border-0 p-0 text-white transition-all hover:scale-110";
  const pinkBtn =
    "bg-[linear-gradient(135deg,#FF4D9A,#C084FC)] shadow-[0_2px_10px_rgba(255,77,154,0.35)] hover:shadow-[0_4px_18px_rgba(255,77,154,0.5)]";
  const blueBtn =
    "bg-[linear-gradient(135deg,#4BB8E8,#0AE4C3)] shadow-[0_2px_10px_rgba(75,184,232,0.35)] hover:shadow-[0_4px_18px_rgba(75,184,232,0.5)]";

  return (
    <div className="hatsu-video-card relative z-[3] mx-auto w-[90%] max-w-[620px] overflow-hidden rounded-[20px] bg-[#0A0A0A] shadow-[0_8px_40px_rgba(0,0,0,0.4),0_0_0_1.5px_rgba(255,255,255,0.08),0_0_60px_rgba(255,77,154,0.12),0_0_60px_rgba(75,184,232,0.08)] md:ml-auto md:mr-[5%] md:w-[44%]">
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onClick={togglePlay}
        className="block aspect-video w-full cursor-pointer object-cover"
      />
      <div className="flex items-center gap-2 bg-[rgba(10,10,10,0.75)] px-3 py-[0.55rem] backdrop-blur-[10px]">
        <button type="button" aria-label={playing ? "Pausar video" : "Reproducir video"} onClick={togglePlay} className={`${btnBase} ${pinkBtn}`}>
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>
        <div ref={progRef} onClick={seek} className="h-1 flex-1 cursor-pointer overflow-hidden rounded bg-white/15">
          <div className="h-full rounded bg-[linear-gradient(90deg,#FF4D9A,#FFE040,#4BB8E8)] transition-[width] duration-150" style={{ width: `${pct}%` }} />
        </div>
        <span className="min-w-[30px] text-center text-[0.65rem] font-semibold tabular-nums text-white/50">{time}</span>
        <button type="button" aria-label={muted ? "Activar sonido" : "Silenciar"} onClick={toggleMute} className={`${btnBase} ${blueBtn}`}>
          {muted ? <MutedIcon /> : <UnmutedIcon />}
        </button>
        <button type="button" aria-label="Pantalla completa" onClick={goFull} className={`${btnBase} ${blueBtn}`}>
          <FullIcon />
        </button>
      </div>
    </div>
  );
}
