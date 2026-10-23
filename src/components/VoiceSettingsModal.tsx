import React, { useState } from 'react';
import { X, Volume2, CheckCircle2, Play, Square } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface VoiceSettingsModalProps {
  onClose: () => void;
}

export const VoiceSettingsModal: React.FC<VoiceSettingsModalProps> = ({ onClose }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [testSample, setTestSample] = useState(
    'Adik menggunakan sebatang pensel warna untuk melukis gambar pelangi.'
  );

  const samplePhrases = [
    'Adik menggunakan sebatang pensel warna.',
    'Amir menendang sebiji bola sepak ke dalam gol.',
    'Ibu menjahit sehelai baju kurung baharu.',
    'Pak Samad memikul setandan pisang emas dari kebun.',
  ];

  const handleTestSpeech = (textToPlay: string) => {
    setIsPlaying(true);
    soundManager.speak(textToPlay, () => {
      setIsPlaying(false);
    });
  };

  const handleStop = () => {
    soundManager.stopSpeech();
    setIsPlaying(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl border-2 border-amber-300 max-w-lg w-full p-5 sm:p-7 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={() => {
            handleStop();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2.5 mb-2">
          <span className="text-3xl">🇲🇾</span>
          <div>
            <h3 className="font-display font-extrabold text-lg sm:text-xl text-amber-950">
              Suara Sebutan Bahasa Melayu Malaysia
            </h3>
            <p className="text-xs text-amber-800 font-medium">
              Sebutan Baku Bahasa Melayu Asli (Bukan English / Indonesia)
            </p>
          </div>
        </div>

        {/* Active Engine Card */}
        <div className="my-4 p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl">
          <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm mb-1">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Enjin Suara Bahasa Melayu Asli (Aktif)</span>
          </div>
          <p className="text-xs text-emerald-800 leading-relaxed">
            Aplikasi menggunakan audio penstriman rasmi sebutan Bahasa Melayu standard (*sebutan baku Melayu Malaysia*). Semua fonem seperti <em>"sebatang"</em>, <em>"pensel"</em>, <em>"kereta"</em>, dan <em>"seekor"</em> dibaca dengan intonasi Melayu tulen.
          </p>
        </div>

        {/* Test Player Card */}
        <div className="mb-4 bg-amber-50/70 border border-amber-200 rounded-2xl p-3.5 sm:p-4">
          <label className="block text-xs font-bold text-amber-950 mb-1.5">
            Uji Sebutan Ayat Penjodoh Bilangan:
          </label>
          <div className="flex items-center gap-2 mb-3">
            <input
              type="text"
              value={testSample}
              onChange={(e) => setTestSample(e.target.value)}
              className="flex-1 px-3 py-2 text-xs sm:text-sm bg-white border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-slate-800"
            />
            {isPlaying ? (
              <button
                onClick={handleStop}
                className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1 active:scale-95 shrink-0"
              >
                <Square className="w-3.5 h-3.5 fill-white" />
                <span>Berhenti</span>
              </button>
            ) : (
              <button
                onClick={() => handleTestSpeech(testSample)}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 active:scale-95 shrink-0 shadow-xs"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Dengar</span>
              </button>
            )}
          </div>

          {/* Quick Samples */}
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Tekan Contoh Ayat di Bawah:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {samplePhrases.map((phrase, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTestSample(phrase);
                  handleTestSpeech(phrase);
                }}
                className="p-2 rounded-xl bg-white hover:bg-amber-100 text-left text-xs font-medium text-slate-700 border border-amber-200 flex items-center justify-between transition-all active:scale-95"
              >
                <span className="truncate mr-1">{phrase}</span>
                <Play className="w-3 h-3 text-amber-700 shrink-0 fill-amber-600" />
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => {
              handleStop();
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm active:scale-95 shadow-xs"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
