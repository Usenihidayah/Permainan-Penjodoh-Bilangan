import React, { useState } from 'react';
import { KAMUS_PENJODOH_BILANGAN } from '../data/questions';
import { X, Search, Volume2, BookOpen } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface DictionaryModalProps {
  onClose: () => void;
}

export const DictionaryModal: React.FC<DictionaryModalProps> = ({ onClose }) => {
  const [search, setSearch] = useState('');

  const filtered = KAMUS_PENJODOH_BILANGAN.filter(
    (item) =>
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.contoh.toLowerCase().includes(search.toLowerCase()) ||
      item.takrif.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl border-2 border-amber-300 max-w-2xl w-full max-h-[88vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500 to-amber-600 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-base sm:text-lg">
                Kamus Cilik Penjodoh Bilangan
              </h3>
              <p className="text-xs text-amber-100 font-medium">
                20 Penjodoh Bilangan Utama Bahasa Melayu
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-all active:scale-95"
            title="Tutup Kamus"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search bar */}
        <div className="p-3 sm:p-4 bg-amber-50/70 border-b border-amber-200 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari penjodoh bilangan (contoh: sekeping, baju, pokok)..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-amber-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
        </div>

        {/* Classifier Cards List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3">
          {filtered.length === 0 ? (
            <p className="text-center text-sm text-slate-500 py-8">
              Tiada penjodoh bilangan ditemui untuk carian "{search}".
            </p>
          ) : (
            filtered.map((item, idx) => (
              <div
                key={idx}
                className="p-3 sm:p-4 rounded-2xl bg-amber-50/40 border border-amber-200/80 hover:border-amber-300 transition-all flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl sm:text-3xl p-1 bg-white rounded-xl border border-amber-100 shadow-xs">
                    {item.emoji}
                  </span>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-extrabold text-base sm:text-lg text-amber-900">
                        {item.nama}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 font-medium">
                      <strong>Fungsi:</strong> {item.takrif}
                    </p>
                    <p className="text-xs text-amber-800 bg-amber-100/60 px-2.5 py-1 rounded-lg inline-block">
                      <strong>Contoh:</strong> {item.contoh}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    soundManager.playPop();
                    soundManager.speak(`${item.nama}. Contohnya: ${item.contoh}`);
                  }}
                  title="Dengar Sebutan"
                  className="p-2 rounded-xl bg-white hover:bg-amber-100 text-amber-700 border border-amber-200 shrink-0 transition-all active:scale-95"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm active:scale-95"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
