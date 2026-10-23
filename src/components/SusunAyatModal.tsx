import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import { X, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface SusunAyatModalProps {
  question: Question;
  onClose: () => void;
  onSuccess: () => void;
}

export const SusunAyatModal: React.FC<SusunAyatModalProps> = ({
  question,
  onClose,
  onSuccess,
}) => {
  // Scramble the phrases initially
  const targetTokens = question.susunAyatFrasa;
  const [bankTokens, setBankTokens] = useState<string[]>([]);
  const [assembledTokens, setAssembledTokens] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    // Shuffle the target tokens
    const shuffled = [...targetTokens].sort(() => Math.random() - 0.5);
    setBankTokens(shuffled);
    setAssembledTokens([]);
    setIsCorrect(null);
  }, [question]);

  const handlePickToken = (token: string, index: number) => {
    soundManager.playPop();
    const newBank = [...bankTokens];
    newBank.splice(index, 1);
    setBankTokens(newBank);

    const newAssembled = [...assembledTokens, token];
    setAssembledTokens(newAssembled);

    // Auto check if all are assembled
    if (newAssembled.length === targetTokens.length) {
      const match = newAssembled.every((t, i) => t === targetTokens[i]);
      if (match) {
        setIsCorrect(true);
        soundManager.playCorrect();
        onSuccess();
      } else {
        setIsCorrect(false);
        soundManager.playWrong();
      }
    }
  };

  const handleRemoveToken = (token: string, index: number) => {
    soundManager.playPop();
    const newAssembled = [...assembledTokens];
    newAssembled.splice(index, 1);
    setAssembledTokens(newAssembled);

    setBankTokens([...bankTokens, token]);
    setIsCorrect(null);
  };

  const handleReset = () => {
    soundManager.playPop();
    const shuffled = [...targetTokens].sort(() => Math.random() - 0.5);
    setBankTokens(shuffled);
    setAssembledTokens([]);
    setIsCorrect(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl border-2 border-amber-300 max-w-lg w-full p-5 sm:p-6 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">{question.emoji}</span>
          <h3 className="text-lg sm:text-xl font-display font-extrabold text-amber-950">
            Cabaran Susun Ayat Lengkap
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 mb-4">
          Susun frasa-frasa di bawah mengikut urutan yang betul supaya membentuk ayat yang gramatis:
        </p>

        {/* Slot Target Area */}
        <div className="min-h-[90px] p-3 rounded-2xl bg-amber-50/70 border-2 border-dashed border-amber-300 flex flex-wrap gap-2 items-center justify-center mb-4">
          {assembledTokens.length === 0 ? (
            <span className="text-xs text-amber-700/70 font-semibold italic">
              Tekan blok di bawah untuk menyusun ayat di sini...
            </span>
          ) : (
            assembledTokens.map((token, idx) => (
              <button
                key={idx}
                onClick={() => handleRemoveToken(token, idx)}
                className="px-3 py-1.5 rounded-xl bg-amber-600 text-white font-medium text-xs sm:text-sm shadow-xs flex items-center gap-1 active:scale-95 hover:bg-amber-700"
                title="Tekan untuk pulangkan"
              >
                <span>{token}</span>
                <span className="text-[10px] opacity-75">✕</span>
              </button>
            ))
          )}
        </div>

        {/* Bank of remaining tokens */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {bankTokens.map((token, idx) => (
            <button
              key={idx}
              onClick={() => handlePickToken(token, idx)}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-amber-100 text-slate-800 border-2 border-amber-200 text-xs sm:text-sm font-semibold shadow-xs transition-all active:scale-95"
            >
              {token}
            </button>
          ))}
        </div>

        {/* Status Message */}
        {isCorrect !== null && (
          <div
            className={`p-3 rounded-xl text-center text-xs sm:text-sm font-bold mb-4 ${
              isCorrect ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'
            }`}
          >
            {isCorrect ? (
              <span className="flex items-center justify-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Hebat! Ayat berjaya disusun dengan sempurna! (+10 Markah Bonus)
              </span>
            ) : (
              <span>Urutan belum tepat. Tekan 'Susun Semula' untuk mencuba lagi!</span>
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Susun Semula</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-extrabold"
          >
            Tutup & Teruskan
          </button>
        </div>
      </div>
    </div>
  );
};
