import React from 'react';
import { Play, BookOpen, Sparkles, HelpCircle } from 'lucide-react';
import { soundManager } from '../utils/sound';
import { MascotSangKancil } from './MascotSangKancil';

interface HomeScreenProps {
  onStartAll: () => void;
  onStartStage: (startIndex: number) => void;
  onOpenDictionary: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartAll,
  onStartStage,
  onOpenDictionary,
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Hero Welcome Card */}
      <div className="bg-white rounded-3xl border-2 border-amber-300 p-6 sm:p-10 shadow-lg text-center relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-36 bg-amber-100/60 rounded-full blur-3xl pointer-events-none" />

        {/* Mascot Header */}
        <div className="flex justify-center mb-4">
          <MascotSangKancil
            mood="happy"
            message="Hai kawan-kawan! Jom uji kepintaran menyusun penjodoh bilangan bersama Sang Kancil!"
            className="flex-col sm:flex-row items-center text-center sm:text-left"
          />
        </div>

        {/* Badges & Meta */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-xs font-extrabold uppercase tracking-wider bg-amber-100 text-amber-800 px-3 py-1 rounded-full border border-amber-200">
            Bahasa Melayu
          </span>
          <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200">
            KSSR Semakan
          </span>
        </div>

        {/* Main Title */}
        <h1 className="font-display font-black text-3xl sm:text-5xl text-amber-950 tracking-tight mb-3">
          Susun & Menang:
          <span className="block text-amber-600 text-2xl sm:text-4xl mt-1">
            20 Soalan Penjodoh Bilangan
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed mb-8">
          Aktiviti interaktif seret dan susun penjodoh bilangan yang tepat. Kumpul markah, menangi bintang, dan raih Pingat Emas!
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
          <button
            onClick={() => {
              soundManager.playPop();
              onStartAll();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-display text-base sm:text-lg font-black shadow-lg hover:shadow-xl transition-all active:scale-95 animate-bounce-gentle"
          >
            <Play className="w-6 h-6 fill-white" />
            <span>Mula Main Sekarang (20 Soalan)</span>
          </button>

          <button
            onClick={() => {
              soundManager.playPop();
              onOpenDictionary();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-800 border-2 border-sky-200 font-display text-sm sm:text-base font-extrabold transition-all active:scale-95"
          >
            <BookOpen className="w-5 h-5 text-sky-600" />
            <span>Kamus Cilik Penjodoh Bilangan</span>
          </button>
        </div>

        {/* How to play card */}
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 sm:p-5 text-left max-w-2xl mx-auto">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-900 mb-2">
            <HelpCircle className="w-4 h-4 text-amber-700" />
            <span>Cara Bermain:</span>
          </div>
          <ol className="text-xs sm:text-sm text-slate-700 space-y-1.5 list-decimal list-inside font-medium leading-relaxed">
            <li><strong>Baca ayat</strong> dan perhatikan gambar objek yang diberikan.</li>
            <li><strong>Seret atau sentuh</strong> kad penjodoh bilangan yang betul ke dalam kotak kosong.</li>
            <li>Dengar bacaan ayat jika perlukan bantuan suara.</li>
            <li>Tekan <strong>"Semak Jawapan"</strong> untuk melihat maklum balas dan penerangan!</li>
          </ol>
        </div>
      </div>

      {/* Stage / Chapter Selection */}
      <div className="bg-white rounded-3xl border-2 border-amber-200 p-5 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="font-display font-extrabold text-lg sm:text-xl text-slate-900">
              Pilih Peringkat Cabaran
            </h2>
            <p className="text-xs text-slate-500">
              Murid boleh memilih kumpulan soalan kegemaran:
            </p>
          </div>
          <Sparkles className="w-5 h-5 text-amber-500" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Stage 1 */}
          <button
            onClick={() => {
              soundManager.playPop();
              onStartStage(0);
            }}
            className="p-4 rounded-2xl bg-amber-50/60 hover:bg-amber-100/80 border border-amber-200 hover:border-amber-300 text-left transition-all active:scale-95 group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                Peringkat 1
              </span>
              <span className="text-xl">✏️ 🐱</span>
            </div>
            <h3 className="font-display font-bold text-sm text-slate-900 group-hover:text-amber-800">
              Soalan 1 - 5
            </h3>
            <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
              sebatang, sebiji, seekor, sehelai, sebuah
            </p>
          </button>

          {/* Stage 2 */}
          <button
            onClick={() => {
              soundManager.playPop();
              onStartStage(5);
            }}
            className="p-4 rounded-2xl bg-amber-50/60 hover:bg-amber-100/80 border border-amber-200 hover:border-amber-300 text-left transition-all active:scale-95 group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                Peringkat 2
              </span>
              <span className="text-xl">🍞 🌹</span>
            </div>
            <h3 className="font-display font-bold text-sm text-slate-900 group-hover:text-amber-800">
              Soalan 6 - 10
            </h3>
            <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
              sekeping, seulas, seikat, sepasang, sekuntum
            </p>
          </button>

          {/* Stage 3 */}
          <button
            onClick={() => {
              soundManager.playPop();
              onStartStage(10);
            }}
            className="p-4 rounded-2xl bg-amber-50/60 hover:bg-amber-100/80 border border-amber-200 hover:border-amber-300 text-left transition-all active:scale-95 group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                Peringkat 3
              </span>
              <span className="text-xl">🥚 🧼</span>
            </div>
            <h3 className="font-display font-bold text-sm text-slate-900 group-hover:text-amber-800">
              Soalan 11 - 15
            </h3>
            <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
              sebutir, setandan, sepucuk, sepotong, sebuku
            </p>
          </button>

          {/* Stage 4 */}
          <button
            onClick={() => {
              soundManager.playPop();
              onStartStage(15);
            }}
            className="p-4 rounded-2xl bg-amber-50/60 hover:bg-amber-100/80 border border-amber-200 hover:border-amber-300 text-left transition-all active:scale-95 group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                Peringkat 4
              </span>
              <span className="text-xl">🌾 🔪</span>
            </div>
            <h3 className="font-display font-bold text-sm text-slate-900 group-hover:text-amber-800">
              Soalan 16 - 20
            </h3>
            <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
              serumpun, seutas, sekawan, sebaris, sebilah
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
