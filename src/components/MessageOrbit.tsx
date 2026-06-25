"use client";

import { useState, useEffect, memo } from "react";
import { starMessages } from "@/data/starMessages";

const ORBIT_COUNT = 15;

const MessageOrbit = memo(function MessageOrbit() {
  const [stars, setStars] = useState<any[]>([]);
  const [activeStar, setActiveStar] = useState<number | null>(null);

  useEffect(() => {
    // Pick random ORBIT_COUNT messages
    const shuffled = [...starMessages].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, ORBIT_COUNT);

    const generatedStars = selected.map((msg, idx) => ({
      ...msg,
      id: idx,
      top: Math.random() * 80 + 10,
      left: Math.random() * 80 + 10,
      duration: Math.random() * 15 + 20, 
      delay: Math.random() * -30, 
    }));
    setStars(generatedStars);
  }, []);

  if (stars.length === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-[1]">
      {stars.map((star) => (
        <div
          key={star.id}
          className="pointer-events-auto absolute flex items-center justify-center cursor-pointer animate-float-star group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 rounded-full"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
          }}
          onClick={() => setActiveStar(activeStar === star.id ? null : star.id)}
          onMouseLeave={() => setActiveStar(null)}
          tabIndex={0}
          role="button"
          aria-label={`查看校友寄语: ${star.name}`}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setActiveStar(activeStar === star.id ? null : star.id);
            }
          }}
        >
          {/* Star Core — 科幻紫粉发光核心 */}
          <div className="w-1.5 h-1.5 rounded-full bg-violet-200 shadow-[0_0_8px_2px_rgba(167,139,250,0.6)] transition-all duration-300 group-hover:scale-150 group-hover:bg-white group-hover:shadow-[0_0_12px_4px_rgba(217,70,239,0.8)]" />

          {/* Context Bubble (Toast) — 科幻全息深紫玻璃气泡 */}
          <div
            className={`absolute top-4 left-1/2 -translate-x-1/2 w-48 p-3 rounded-lg bg-[#090514]/90 border border-brand/40 backdrop-blur-md shadow-[0_0_20px_rgba(124,58,237,0.25)] transition-all duration-300 origin-top ${
              activeStar === star.id ? "opacity-100 scale-100 z-50 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#090514]/90 border-l border-t border-brand/40 rotate-45" />
            <div className="relative z-10 text-center">
              <p className="text-xs font-bold tracking-wider text-purple-200 font-mono">{star.name}</p>
              <div className="mt-1.5 h-px w-full bg-gradient-to-r from-transparent via-brand/40 to-transparent" />
              <p className="mt-2 text-xs text-purple-100 leading-relaxed font-sans">{star.message}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

export default MessageOrbit;