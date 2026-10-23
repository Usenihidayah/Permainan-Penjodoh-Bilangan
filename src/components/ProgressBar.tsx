import React from 'react';
import { QuestionResult } from '../types';
import { Check, X } from 'lucide-react';

interface ProgressBarProps {
  currentIndex: number;
  total: number;
  results: Record<number, QuestionResult>;
  onSelectQuestion: (index: number) => void;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentIndex,
  total,
  results,
  onSelectQuestion,
}) => {
  const answeredCount = Object.keys(results).length;
  const progressPercent = Math.round((answeredCount / total) * 100);

  return (
    <div className="bg-white border border-amber-200/80 rounded-2xl p-3 sm:p-4 shadow-xs">
      {/* Top summary row */}
      <div className="flex items-center justify-between text-xs sm:text-sm font-semibold mb-2">
        <div className="flex items-center gap-2">
          <span className="text-amber-900">
            Kemajuan Soalan: <strong className="text-amber-700">{currentIndex + 1}</strong> daripada <strong>{total}</strong>
          </span>
          <span className="text-slate-400 font-normal">({progressPercent}%)</span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-emerald-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            Betul: {Object.values(results).filter(r => r.isCorrect).length}
          </span>
          <span className="flex items-center gap-1 text-rose-600">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" />
            Cuba Lagi: {Object.values(results).filter(r => !r.isCorrect).length}
          </span>
        </div>
      </div>

      {/* Progress Bar Track */}
      <div className="w-full h-2.5 bg-amber-100 rounded-full overflow-hidden p-0.5 mb-3">
        <div
          className="h-full bg-gradient-to-r from-amber-400 to-emerald-500 rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Grid of 20 Question Dots/Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-1 sm:gap-1.5 pt-1 border-t border-slate-100">
        {Array.from({ length: total }, (_, i) => {
          const res = results[i + 1];
          const isCurrent = currentIndex === i;

          let btnBg = "bg-slate-100 text-slate-600 hover:bg-slate-200";
          if (res) {
            btnBg = res.isCorrect
              ? "bg-emerald-500 text-white font-bold"
              : "bg-rose-400 text-white font-bold";
          }
          if (isCurrent) {
            btnBg = "bg-amber-600 text-white ring-2 ring-amber-300 ring-offset-1 font-extrabold scale-110 shadow-sm";
          }

          return (
            <button
              key={i}
              onClick={() => onSelectQuestion(i)}
              title={`Pergi ke Soalan ${i + 1}`}
              className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg text-[10px] sm:text-xs flex items-center justify-center transition-all ${btnBg}`}
            >
              {res && !isCurrent ? (
                res.isCorrect ? (
                  <Check className="w-3 h-3 stroke-[3]" />
                ) : (
                  <X className="w-3 h-3 stroke-[3]" />
                )
              ) : (
                i + 1
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
