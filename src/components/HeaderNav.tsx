import React from 'react';
import { Home, ArrowLeft, RotateCcw, Volume2, VolumeX, BookOpen, Sparkles, Settings2 } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface HeaderNavProps {
  score: number;
  streak: number;
  currentQuestionIndex: number;
  totalQuestions: number;
  onHome: () => void;
  onBack: () => void;
  onRestart: () => void;
  onOpenDictionary: () => void;
  onOpenVoiceSettings: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  score,
  streak,
  onHome,
  onBack,
  onRestart,
  onOpenDictionary,
  onOpenVoiceSettings,
  isMuted,
  onToggleMute,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-amber-200 px-3 sm:px-6 py-2.5 sm:py-3 shadow-xs">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Navigation Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Home Button */}
          <button
            onClick={() => {
              soundManager.playPop();
              onHome();
            }}
            title="Laman Utama"
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs sm:text-sm font-semibold transition-all active:scale-95"
          >
            <Home className="w-4 h-4 text-amber-700" />
            <span className="hidden sm:inline">Utama</span>
          </button>

          {/* Back Button */}
          <button
            onClick={() => {
              soundManager.playPop();
              onBack();
            }}
            title="Kembali ke Soalan Lepas"
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Kembali</span>
          </button>

          {/* Restart Button */}
          <button
            onClick={() => {
              soundManager.playPop();
              if (window.confirm("Adakah anda ingin memulakan semula soalan dari awal?")) {
                onRestart();
              }
            }}
            title="Main Semula Soalan"
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs sm:text-sm font-semibold transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden md:inline">Main Semula</span>
          </button>
        </div>

        {/* Center: Title / Subject Badge */}
        <div className="hidden lg:flex items-center gap-2">
          <span className="text-sm font-extrabold text-amber-950 font-display tracking-tight">
            Susun & Menang: Penjodoh Bilangan
          </span>
          <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-md">
            Bahasa Melayu
          </span>
        </div>

        {/* Right: Score, Streak, Malaysian Voice, Dictionary, Sound */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Streak Indicator */}
          {streak > 1 && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-orange-100 border border-orange-300 text-orange-800 text-xs font-bold animate-bounce-gentle">
              <Sparkles className="w-3.5 h-3.5 text-orange-600 fill-orange-500" />
              <span>{streak}x Berturut!</span>
            </div>
          )}

          {/* Score Counter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800">
            <span className="text-xs font-medium text-emerald-600 hidden sm:inline">Markah:</span>
            <span className="font-mono font-bold text-sm sm:text-base tabular-nums">
              {score}
            </span>
          </div>

          {/* Dictionary / Kamus Button */}
          <button
            onClick={() => {
              soundManager.playPop();
              onOpenDictionary();
            }}
            title="Kamus Cilik Penjodoh Bilangan"
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs sm:text-sm font-semibold transition-all flex items-center gap-1 active:scale-95"
          >
            <BookOpen className="w-4 h-4 text-sky-600" />
            <span className="hidden sm:inline">Kamus</span>
          </button>

          {/* Malaysian Voice Settings Button */}
          <button
            onClick={() => {
              soundManager.playPop();
              onOpenVoiceSettings();
            }}
            title="Tetapan Suara Bahasa Melayu (Malaysia)"
            className="px-2 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition-all flex items-center gap-1 active:scale-95"
          >
            <span className="text-sm leading-none">🇲🇾</span>
            <span className="hidden md:inline">BM</span>
            <Settings2 className="w-3 h-3 text-amber-700 hidden sm:inline" />
          </button>

          {/* Audio Mute Toggle */}
          <button
            onClick={() => {
              onToggleMute();
            }}
            title={isMuted ? "Buka Bunyi" : "Senyapkan Bunyi"}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all active:scale-95"
            aria-label="Kawalan Bunyi"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-rose-500" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
