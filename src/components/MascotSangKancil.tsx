import React from 'react';

interface MascotProps {
  mood?: 'happy' | 'thinking' | 'celebrate' | 'cheer';
  message?: string;
  className?: string;
}

export const MascotSangKancil: React.FC<MascotProps> = ({
  mood = 'happy',
  message,
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Custom Vector Cartoon Sang Kancil */}
      <div className="relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-amber-100 border-2 border-amber-300 rounded-2xl flex items-center justify-center shadow-sm overflow-hidden group">
        <svg
          viewBox="0 0 100 100"
          className="w-14 h-14 sm:w-16 sm:h-16 transition-transform duration-300 group-hover:scale-110"
        >
          {/* Antlers / Ears */}
          <path d="M 28 32 C 18 18 24 8 32 18 Z" fill="#92400E" />
          <path d="M 32 30 C 26 22 28 14 34 22 Z" fill="#FCD34D" />
          <path d="M 72 32 C 82 18 76 8 68 18 Z" fill="#92400E" />
          <path d="M 68 30 C 74 22 72 14 66 22 Z" fill="#FCD34D" />

          {/* Head */}
          <ellipse cx="50" cy="52" rx="28" ry="24" fill="#B45309" />
          {/* Cheeks & Snout */}
          <ellipse cx="50" cy="60" rx="18" ry="14" fill="#FDE68A" />
          {/* Cute Nose */}
          <polygon points="46,55 54,55 50,60" fill="#451A03" />

          {/* Eyes */}
          {mood === 'celebrate' ? (
            <>
              {/* Happy squint eyes ^ ^ */}
              <path d="M 36 46 Q 41 40 46 46" fill="none" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
              <path d="M 54 46 Q 59 40 64 46" fill="none" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
            </>
          ) : mood === 'thinking' ? (
            <>
              <circle cx="41" cy="44" r="4.5" fill="#1E293B" />
              <circle cx="43" cy="42" r="1.5" fill="#FFFFFF" />
              <circle cx="61" cy="40" r="4.5" fill="#1E293B" />
              <circle cx="63" cy="38" r="1.5" fill="#FFFFFF" />
            </>
          ) : (
            <>
              <circle cx="39" cy="45" r="5" fill="#1E293B" />
              <circle cx="41" cy="43" r="2" fill="#FFFFFF" />
              <circle cx="61" cy="45" r="5" fill="#1E293B" />
              <circle cx="63" cy="43" r="2" fill="#FFFFFF" />
            </>
          )}

          {/* Rosy Cheeks */}
          <circle cx="32" cy="56" r="4" fill="#FCA5A5" opacity="0.8" />
          <circle cx="68" cy="56" r="4" fill="#FCA5A5" opacity="0.8" />

          {/* Smile / Mouth */}
          <path d="M 44 65 Q 50 71 56 65" fill="none" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" />

          {/* Student Collar & Tie */}
          <path d="M 38 76 L 50 84 L 62 76 L 58 92 L 42 92 Z" fill="#2563EB" />
          <polygon points="48,84 52,84 51,92 49,92" fill="#EF4444" />
        </svg>


      </div>

      {/* Speech Bubble */}
      {message && (
        <div className="relative bg-white border border-amber-200 rounded-2xl px-3.5 py-2.5 shadow-sm text-sm text-slate-700 max-w-xs sm:max-w-md">
          {/* Bubble tail */}
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-r-[8px] border-r-white border-b-[6px] border-b-transparent z-10" />
          <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[7px] border-t-transparent border-r-[9px] border-r-amber-200 border-b-[7px] border-b-transparent" />
          <p className="font-medium leading-relaxed">{message}</p>
        </div>
      )}
    </div>
  );
};
