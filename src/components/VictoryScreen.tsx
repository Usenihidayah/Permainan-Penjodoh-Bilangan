import React, { useState, useEffect } from 'react';
import { QuestionResult } from '../types';
import { SOALAN_PENJODOH_BILANGAN } from '../data/questions';
import { Star, Award, RotateCcw, Home, Printer, CheckCircle, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/sound';
import { MascotSangKancil } from './MascotSangKancil';

interface VictoryScreenProps {
  score: number;
  results: Record<number, QuestionResult>;
  onRestart: () => void;
  onHome: () => void;
}

export const VictoryScreen: React.FC<VictoryScreenProps> = ({
  score,
  results,
  onRestart,
  onHome,
}) => {
  const [studentName, setStudentName] = useState('Murid Hebat');
  const [showCertificate, setShowCertificate] = useState(false);
  const [showReviewList, setShowReviewList] = useState(false);

  const total = SOALAN_PENJODOH_BILANGAN.length;
  const correctCount = Object.values(results).filter((r) => r.isCorrect).length;

  // Calculate stars: 3 stars (>= 160 marks or >= 16 correct), 2 stars (>= 100 marks or >= 10 correct), 1 star
  let stars = 1;
  let medalTitle = "Pingat Gangsa: Teruskan Usaha!";
  let medalColor = "from-amber-700 to-amber-900 border-amber-600 text-amber-100";
  let feedbackMessage = "Bagus kerana berusaha! Ulang kaji sedikit lagi bersama Kamus Cilik untuk meraih 3 bintang!";

  if (correctCount >= 16) {
    stars = 3;
    medalTitle = "Pingat Emas: Jaguh Penjodoh Bilangan!";
    medalColor = "from-amber-400 to-yellow-500 border-yellow-400 text-yellow-950";
    feedbackMessage = "Luar biasa! Adik menguasai semua 20 penjodoh bilangan dengan cemerlang seperti Sang Kancil yang bijak!";
  } else if (correctCount >= 10) {
    stars = 2;
    medalTitle = "Pingat Perak: Murid Cemerlang!";
    medalColor = "from-slate-300 to-slate-400 border-slate-300 text-slate-900";
    feedbackMessage = "Hebat! Prestasi yang sangat memuaskan. Sikit lagi untuk dapat markah penuh!";
  }

  // Trigger celebration on load
  useEffect(() => {
    soundManager.playVictory();
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // Fallback
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Main Victory Card */}
      <div className="bg-white rounded-3xl border-2 border-amber-300 p-6 sm:p-10 text-center shadow-lg relative overflow-hidden">
        {/* Glow rings */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-amber-100/60 rounded-full blur-3xl pointer-events-none" />

        {/* Mascot Centerpiece */}
        <div className="flex justify-center mb-4">
          <MascotSangKancil
            mood="celebrate"
            message={feedbackMessage}
            className="flex-col sm:flex-row items-center text-center sm:text-left"
          />
        </div>

        {/* Title */}
        <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-amber-950 mb-2">
          Tahniah! Anda Telah Menamatkan Cabaran!
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mb-6">
          Aktiviti Pengukuhan: 20 Soalan Penjodoh Bilangan
        </p>

        {/* Stars Display */}
        <div className="flex items-center justify-center gap-3 mb-6">
          {[1, 2, 3].map((starIdx) => (
            <div
              key={starIdx}
              className={`p-3 sm:p-4 rounded-2xl border-2 transition-all transform ${
                starIdx <= stars
                  ? 'bg-amber-100 border-amber-400 scale-110 shadow-md animate-bounce-gentle'
                  : 'bg-slate-100 border-slate-200 opacity-40'
              }`}
            >
              <Star
                className={`w-8 h-8 sm:w-12 sm:h-12 ${
                  starIdx <= stars
                    ? 'text-yellow-500 fill-yellow-400'
                    : 'text-slate-300 fill-slate-200'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Medal Badge & Score Grid */}
        <div className="max-w-md mx-auto grid grid-cols-2 gap-3 sm:gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col items-center justify-center">
            <span className="text-xs text-amber-800 font-semibold mb-1">Markah Terkumpul</span>
            <span className="font-mono font-extrabold text-2xl sm:text-3xl text-amber-900 tabular-nums">
              {score}
            </span>
            <span className="text-[11px] text-slate-500">Maksimum 200</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col items-center justify-center">
            <span className="text-xs text-emerald-800 font-semibold mb-1">Ketepatan Jawapan</span>
            <span className="font-mono font-extrabold text-2xl sm:text-3xl text-emerald-900 tabular-nums">
              {correctCount} / {total}
            </span>
            <span className="text-[11px] text-slate-500">{Math.round((correctCount / total) * 100)}% Betul</span>
          </div>
        </div>

        {/* Medal Banner */}
        <div className={`p-4 rounded-2xl bg-gradient-to-r ${medalColor} border-2 max-w-md mx-auto mb-8 shadow-sm flex items-center justify-center gap-3`}>
          <Award className="w-8 h-8 shrink-0" />
          <div className="text-left">
            <span className="text-[11px] uppercase tracking-wider font-extrabold opacity-80 block">
              Anugerah Pencapaian
            </span>
            <span className="font-display font-extrabold text-base sm:text-lg">
              {medalTitle}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              soundManager.playPop();
              onRestart();
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-display font-extrabold text-sm sm:text-base shadow-md transition-all active:scale-95"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Main Semula</span>
          </button>

          <button
            onClick={() => {
              soundManager.playPop();
              setShowCertificate(true);
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-display font-extrabold text-sm sm:text-base shadow-md transition-all active:scale-95"
          >
            <Award className="w-5 h-5" />
            <span>Lihat Sijil Maya</span>
          </button>

          <button
            onClick={() => {
              soundManager.playPop();
              setShowReviewList(!showReviewList);
            }}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm transition-all active:scale-95"
          >
            <span>{showReviewList ? 'Tutup Semakan' : 'Semak 20 Jawapan'}</span>
          </button>

          <button
            onClick={() => {
              soundManager.playPop();
              onHome();
            }}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-semibold text-sm transition-all active:scale-95"
          >
            <Home className="w-4 h-4 text-amber-700" />
            <span>Laman Utama</span>
          </button>
        </div>
      </div>

      {/* Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-amber-50 border-4 border-amber-400 rounded-3xl max-w-2xl w-full p-6 sm:p-10 shadow-2xl relative text-center">
            <button
              onClick={() => setShowCertificate(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 bg-white shadow-xs"
            >
              ✕
            </button>

            {/* Certificate Header */}
            <div className="border-b-2 border-amber-200 pb-4 mb-6">
              <span className="text-xs uppercase font-extrabold text-amber-800 tracking-widest block mb-1">
                Kementerian Pendidikan Maya · Bahasa Melayu
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-amber-950">
                SIJIL PENGHARGAAN
              </h2>
              <p className="text-xs text-amber-800 font-medium">
                Dianugerahkan atas Kejayaan Menguasai 20 Penjodoh Bilangan
              </p>
            </div>

            {/* Student Name Input */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Nama Murid:
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="text-center font-display font-extrabold text-xl sm:text-2xl text-amber-900 bg-white border-2 border-amber-300 rounded-2xl px-4 py-2 w-full max-w-md mx-auto shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <p className="text-xs sm:text-sm text-slate-700 max-w-md mx-auto leading-relaxed mb-6 font-medium">
              Telah menunjukkan dedikasi dan kecemerlangan tinggi dalam menyelesaikan aktiviti
              <strong> "Susun & Menang: 20 Soalan Penjodoh Bilangan" </strong>
              dengan markah <strong>{score} / 200</strong> ({correctCount} jawapan tepat).
            </p>

            {/* Stars & Seal */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {Array.from({ length: stars }).map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-500 fill-yellow-400" />
              ))}
              <span className="text-xs font-bold text-amber-900 ml-1">
                {medalTitle}
              </span>
            </div>

            {/* Print & Close */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Sijil</span>
              </button>
              <button
                onClick={() => setShowCertificate(false)}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs sm:text-sm border border-slate-200"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review List of all 20 questions */}
      {showReviewList && (
        <div className="bg-white rounded-3xl border-2 border-amber-200 p-4 sm:p-6 shadow-sm space-y-4">
          <h3 className="font-display font-bold text-lg text-slate-900 pb-2 border-b border-slate-100">
            Senarai Semakan Semua 20 Soalan Penjodoh Bilangan
          </h3>

          <div className="space-y-3">
            {SOALAN_PENJODOH_BILANGAN.map((q) => {
              const res = results[q.id];
              const isCorrect = res ? res.isCorrect : false;

              return (
                <div
                  key={q.id}
                  className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all ${
                    isCorrect
                      ? 'bg-emerald-50/60 border-emerald-200'
                      : 'bg-rose-50/60 border-rose-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-xs font-bold text-slate-500">
                      Soalan {q.id}: {q.benda}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-bold">
                      {isCorrect ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span className="text-emerald-700">Betul</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-rose-600" />
                          <span className="text-rose-700">Perlu Diperbaiki</span>
                        </>
                      )}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-900 font-medium mb-1">
                    "{q.ayatSebelum} <strong className="text-amber-800 underline">{q.penjodohBilangan}</strong> {q.ayatSelepas}"
                  </p>

                  <p className="text-[11px] sm:text-xs text-slate-600 italic">
                    💡 <strong>Nota:</strong> {q.penerangan}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
