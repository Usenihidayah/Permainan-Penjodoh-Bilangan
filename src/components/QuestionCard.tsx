import React, { useState, useEffect } from 'react';
import { Question, QuestionResult } from '../types';
import { Volume2, Lightbulb, CheckCircle2, AlertCircle, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface QuestionCardProps {
  question: Question;
  result?: QuestionResult;
  onAnswer: (questionId: number, answer: string, isCorrect: boolean) => void;
  onNext: () => void;
  isLastQuestion: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  result,
  onAnswer,
  onNext,
  isLastQuestion,
}) => {
  // Current placed answer in the slot
  const [placedAnswer, setPlacedAnswer] = useState<string | null>(
    result ? result.selectedAnswer : null
  );
  // Show hint state
  const [showHint, setShowHint] = useState<boolean>(false);
  // Evaluated status: null | 'correct' | 'wrong'
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>(
    result ? (result.isCorrect ? 'correct' : 'wrong') : 'idle'
  );
  // Dragging state
  const [isOverDropZone, setIsOverDropZone] = useState<boolean>(false);

  // When question changes, reset states
  useEffect(() => {
    setPlacedAnswer(result ? result.selectedAnswer : null);
    setStatus(result ? (result.isCorrect ? 'correct' : 'wrong') : 'idle');
    setShowHint(false);
  }, [question.id, result]);

  // Handle Drag Start
  const handleDragStart = (e: React.DragEvent, option: string) => {
    e.dataTransfer.setData('text/plain', option);
    soundManager.playPop();
  };

  // Handle Drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOverDropZone(false);
    const draggedOption = e.dataTransfer.getData('text/plain');
    if (draggedOption) {
      setPlacedAnswer(draggedOption);
      soundManager.playPop();
      checkAnswer(draggedOption);
    }
  };

  // Handle Tap/Click on an option tile
  const handleSelectOption = (option: string) => {
    soundManager.playPop();
    setPlacedAnswer(option);
    checkAnswer(option);
  };

  // Evaluate Answer
  const checkAnswer = (selected: string) => {
    const isCorrect = selected.trim().toLowerCase() === question.penjodohBilangan.trim().toLowerCase();
    if (isCorrect) {
      setStatus('correct');
      soundManager.playCorrect();
    } else {
      setStatus('wrong');
      soundManager.playWrong();
    }
    onAnswer(question.id, selected, isCorrect);
  };

  // Reset current selection to retry
  const handleResetSlot = () => {
    soundManager.playPop();
    setPlacedAnswer(null);
    setStatus('idle');
  };

  // Read sentence using TTS
  const handleListen = () => {
    soundManager.playPop();
    const readingText = placedAnswer
      ? `${question.ayatSebelum} ${placedAnswer} ${question.ayatSelepas}`
      : `${question.ayatSebelum} tempat kosong ${question.ayatSelepas}`;
    soundManager.speak(readingText);
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-amber-200/90 shadow-md p-4 sm:p-7 relative overflow-hidden transition-all">
      {/* Decorative background glow */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-100/50 rounded-full blur-2xl pointer-events-none" />

      {/* Category and Audio / Hint actions */}
      <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-amber-100">
        <div className="flex items-center gap-2">
          <span className="text-2xl sm:text-3xl" role="img" aria-label={question.benda}>
            {question.emoji}
          </span>
          <div>
            <span className="text-xs font-bold text-amber-700 tracking-wide block">
              KATEGORI: {question.kategori}
            </span>
            <h2 className="text-sm sm:text-base font-bold text-slate-800">
              Benda: <span className="text-amber-800">{question.benda}</span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* TTS Audio Readout */}
          <button
            onClick={handleListen}
            title="Dengar Bacaan Ayat"
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-all active:scale-95"
          >
            <Volume2 className="w-4 h-4 text-amber-700" />
            <span className="hidden sm:inline">Dengar Ayat</span>
          </button>

          {/* Hint Button */}
          <button
            onClick={() => {
              soundManager.playPop();
              setShowHint(!showHint);
            }}
            title="Petunjuk Sang Kancil"
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border active:scale-95 ${
              showHint
                ? 'bg-amber-500 text-white border-amber-600'
                : 'bg-yellow-50 hover:bg-yellow-100 text-yellow-800 border-yellow-200'
            }`}
          >
            <Lightbulb className={`w-4 h-4 ${showHint ? 'text-white' : 'text-yellow-600'}`} />
            <span className="hidden sm:inline">Petunjuk</span>
          </button>
        </div>
      </div>

      {/* Hint Alert Box if toggled */}
      {showHint && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-300 rounded-2xl flex items-start gap-2.5 text-xs sm:text-sm text-yellow-900 animate-fadeIn">
          <Sparkles className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
          <div>
            <strong className="block text-yellow-950 font-bold">Petunjuk Sang Kancil:</strong>
            <span>{question.petunjuk}</span>
          </div>
        </div>
      )}

      {/* Sentence & Interactive Drop Slot */}
      <div className="bg-amber-50/70 border-2 border-dashed border-amber-300 rounded-2xl p-4 sm:p-6 mb-6">
        <p className="text-base sm:text-xl lg:text-2xl text-slate-800 font-medium leading-relaxed sm:leading-loose text-center">
          <span>{question.ayatSebelum} </span>

          {/* Drop Slot Target */}
          <span
            onDragOver={(e) => {
              e.preventDefault();
              setIsOverDropZone(true);
            }}
            onDragLeave={() => setIsOverDropZone(false)}
            onDrop={handleDrop}
            className={`inline-flex items-center justify-center min-w-[130px] sm:min-w-[170px] min-h-[46px] sm:min-h-[52px] mx-1 px-3 py-1 rounded-2xl border-2 transition-all align-middle cursor-pointer shadow-xs ${
              placedAnswer
                ? status === 'correct'
                  ? 'bg-emerald-100 border-emerald-500 text-emerald-950 font-extrabold scale-105'
                  : 'bg-rose-100 border-rose-500 text-rose-950 font-extrabold'
                : isOverDropZone
                ? 'bg-amber-200 border-amber-500 border-solid scale-105'
                : 'bg-white border-dashed border-amber-400 hover:border-amber-600 hover:bg-amber-50/50'
            }`}
            onClick={() => {
              if (placedAnswer) handleResetSlot();
            }}
            title={placedAnswer ? "Tekan untuk tukar pilihan" : "Seret atau tekan jawapan di bawah"}
          >
            {placedAnswer ? (
              <span className="flex items-center gap-1.5 text-base sm:text-xl font-bold tracking-wide">
                <span>{placedAnswer}</span>
                <span className="text-xs text-slate-400 font-normal hover:text-rose-600" title="Keluarkan">
                  ✕
                </span>
              </span>
            ) : (
              <span className="text-xs sm:text-sm text-amber-700/80 font-bold animate-pulse">
                [ Seret / Tekan Di Sini ]
              </span>
            )}
          </span>

          <span> {question.ayatSelepas}</span>
        </p>

        <p className="text-center text-xs text-amber-800/70 mt-3 font-semibold">
          💡 Seret penjodoh bilangan yang betul ke kotak di atas, atau sentuh/tekan kad di bawah:
        </p>
      </div>

      {/* Answer Options Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mb-6">
        {question.pilihan.map((option) => {
          const isSelected = placedAnswer === option;
          let btnStyle = "bg-white hover:bg-amber-50 border-amber-200 text-slate-800 hover:border-amber-400";
          
          if (isSelected) {
            btnStyle = status === 'correct'
              ? "bg-emerald-500 text-white border-emerald-600 ring-2 ring-emerald-300 shadow-md scale-102"
              : "bg-rose-500 text-white border-rose-600 ring-2 ring-rose-300 shadow-md";
          }

          return (
            <button
              key={option}
              draggable
              onDragStart={(e) => handleDragStart(e, option)}
              onClick={() => handleSelectOption(option)}
              className={`p-3 sm:p-4 rounded-2xl border-2 font-display text-base sm:text-lg font-bold transition-all shadow-xs active:scale-95 flex flex-col items-center justify-center gap-1 cursor-grab active:cursor-grabbing ${btnStyle}`}
            >
              <span>{option}</span>
              <span className="text-[10px] font-sans font-normal opacity-70">
                (Seret / Tekan)
              </span>
            </button>
          );
        })}
      </div>

      {/* Feedback Banner (Correct / Wrong) */}
      {status !== 'idle' && (
        <div
          className={`p-4 rounded-2xl border-2 mb-6 transition-all animate-fadeIn ${
            status === 'correct'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-rose-50 border-rose-300 text-rose-950'
          }`}
        >
          <div className="flex items-start gap-3">
            {status === 'correct' ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            )}

            <div className="space-y-1">
              <h4 className="font-display font-extrabold text-base sm:text-lg">
                {status === 'correct' ? 'Tahniah, Bijak Sekali! 🎉' : 'Cuba Lagi, Anda Mesti Boleh! 💪'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {question.penerangan}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Footers: Retry or Next Question */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          onClick={handleResetSlot}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-all active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Padam Pilihan</span>
        </button>

        {status === 'correct' ? (
          <button
            onClick={() => {
              soundManager.playPop();
              onNext();
            }}
            className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-display text-sm sm:text-base font-extrabold shadow-md hover:shadow-lg transition-all active:scale-95 animate-bounce-gentle"
          >
            <span>{isLastQuestion ? 'Lihat Keputusan Penuh 🏆' : 'Soalan Seterusnya'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={() => {
              if (placedAnswer) {
                checkAnswer(placedAnswer);
              } else {
                alert("Sila seret atau sentuh salah satu penjodoh bilangan terlebih dahulu!");
              }
            }}
            className="flex items-center gap-1.5 px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-display text-sm sm:text-base font-extrabold shadow-md transition-all active:scale-95"
          >
            <span>Semak Jawapan</span>
          </button>
        )}
      </div>
    </div>
  );
};
