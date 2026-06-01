import { useEffect } from "react";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

const REELS = [
  "DXUxdkcie4s",
  "DXU4KiLkqrC",
  "DXVDUNWD1Ta",
  "DXU-DrgDyqQ",
  "DXU9Plfifnk",
  "DXU-feICjtx",
  "DXU5gOQk53j",
  "DXU86bPueHQ",
  "DXVFMpQjgjR",
  "DXU-NELCOvo",
  "DXUjJzlgEkC",
  "DXUrzh1kxwv",
];

export default function HatsuShowcase() {
  useEffect(() => {
    function loadIgEmbed() {
      if (window.instgrm && window.instgrm.Embeds) {
        window.instgrm.Embeds.process();
        return;
      }
      if (document.getElementById("instagram-embed-js")) {
        // script present but not ready yet; retry shortly
        setTimeout(loadIgEmbed, 400);
        return;
      }
      const s = document.createElement("script");
      s.id = "instagram-embed-js";
      s.async = true;
      s.src = "https://www.instagram.com/embed.js";
      s.onload = () => window.instgrm?.Embeds.process();
      document.body.appendChild(s);
    }
    loadIgEmbed();
  }, []);

  return (
    <div className="relative z-[1] grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {REELS.map((id) => (
        <div
          key={id}
          className="hatsu-showcase-item overflow-hidden rounded-[16px] border border-white/[0.08] bg-white/[0.03] transition-all hover:-translate-y-1 hover:border-white/[0.18]"
        >
          <blockquote
            className="instagram-media"
            data-instgrm-captioned
            data-instgrm-permalink={`https://www.instagram.com/reel/${id}/?utm_source=ig_embed&utm_campaign=loading`}
            data-instgrm-version="14"
            style={{ background: "#FFF", border: 0, margin: 0, padding: 0, width: "100%" }}
          >
            <a href={`https://www.instagram.com/reel/${id}/`} target="_blank" rel="noopener">
              Ver en Instagram
            </a>
          </blockquote>
        </div>
      ))}
    </div>
  );
}
