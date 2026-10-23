import { useState } from 'react';
import { GameView, QuestionResult } from './types';
import { SOALAN_PENJODOH_BILANGAN } from './data/questions';
import { HeaderNav } from './components/HeaderNav';
import { ProgressBar } from './components/ProgressBar';
import { QuestionCard } from './components/QuestionCard';
import { HomeScreen } from './components/HomeScreen';
import { VictoryScreen } from './components/VictoryScreen';
import { DictionaryModal } from './components/DictionaryModal';
import { SusunAyatModal } from './components/SusunAyatModal';
import { VoiceSettingsModal } from './components/VoiceSettingsModal';
import { soundManager } from './utils/sound';
import { Sparkles } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<GameView>('HOME');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [results, setResults] = useState<Record<number, QuestionResult>>({});
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showDictionary, setShowDictionary] = useState<boolean>(false);
  const [showSusunModal, setShowSusunModal] = useState<boolean>(false);
  const [showVoiceSettings, setShowVoiceSettings] = useState<boolean>(false);

  const totalQuestions = SOALAN_PENJODOH_BILANGAN.length;
  const currentQuestion = SOALAN_PENJODOH_BILANGAN[currentIndex];

  // Start all 20 questions
  const handleStartAll = () => {
    setCurrentIndex(0);
    setView('PLAYING');
  };

  // Start specific stage
  const handleStartStage = (startIndex: number) => {
    setCurrentIndex(startIndex);
    setView('PLAYING');
  };

  // Answer handler
  const handleAnswer = (questionId: number, answer: string, isCorrect: boolean) => {
    const existing = results[questionId];
    const prevCorrect = existing ? existing.isCorrect : false;

    // Calculate score delta
    if (isCorrect && !prevCorrect) {
      const streakBonus = streak >= 2 ? 5 : 0;
      setScore((prev) => prev + 10 + streakBonus);
      setStreak((prev) => prev + 1);
    } else if (!isCorrect && prevCorrect) {
      setScore((prev) => Math.max(0, prev - 10));
      setStreak(0);
    } else if (!isCorrect) {
      setStreak(0);
    }

    setResults((prev) => ({
      ...prev,
      [questionId]: {
        questionId,
        selectedAnswer: answer,
        isCorrect,
        attempts: (existing?.attempts || 0) + 1,
      },
    }));
  };

  // Navigation handlers
  const handleHome = () => {
    setView('HOME');
  };

  const handleBack = () => {
    if (view === 'PLAYING') {
      if (currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      } else {
        setView('HOME');
      }
    } else if (view === 'SUMMARY') {
      setView('PLAYING');
    }
  };

  const handleRestart = () => {
    setScore(0);
    setStreak(0);
    setResults({});
    setCurrentIndex(0);
    setView('PLAYING');
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Reached the end: Show Victory Screen!
      setView('SUMMARY');
    }
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundManager.isMuted = nextMuted;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50/30 to-amber-100/40 text-slate-900 flex flex-col font-sans selection:bg-amber-200">
      {/* Top Navigation */}
      <HeaderNav
        score={score}
        streak={streak}
        currentQuestionIndex={currentIndex}
        totalQuestions={totalQuestions}
        onHome={handleHome}
        onBack={handleBack}
        onRestart={handleRestart}
        onOpenDictionary={() => setShowDictionary(true)}
        onOpenVoiceSettings={() => setShowVoiceSettings(true)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
        {view === 'HOME' && (
          <HomeScreen
            onStartAll={handleStartAll}
            onStartStage={handleStartStage}
            onOpenDictionary={() => setShowDictionary(true)}
          />
        )}

        {view === 'PLAYING' && (
          <div className="space-y-4 sm:space-y-6 animate-fadeIn">
            {/* Progress Bar & Question Matrix */}
            <ProgressBar
              currentIndex={currentIndex}
              total={totalQuestions}
              results={results}
              onSelectQuestion={(idx) => {
                soundManager.playPop();
                setCurrentIndex(idx);
              }}
            />

            {/* Sub-bar with Bonus & Malaysian Voice indication */}
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  soundManager.playPop();
                  setShowVoiceSettings(true);
                }}
                className="flex items-center gap-1.5 text-xs text-amber-900/80 hover:text-amber-900 font-semibold transition-colors"
                title="Tukar atau uji suara Bahasa Melayu Malaysia"
              >
                <span>🇲🇾 Sebutan: Bahasa Melayu (ms-MY)</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playPop();
                  setShowSusunModal(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-bold transition-all active:scale-95 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>Cabaran Susun Ayat (Bonus +10)</span>
              </button>
            </div>

            {/* Active Question Card */}
            <QuestionCard
              question={currentQuestion}
              result={results[currentQuestion.id]}
              onAnswer={handleAnswer}
              onNext={handleNext}
              isLastQuestion={currentIndex === totalQuestions - 1}
            />
          </div>
        )}

        {view === 'SUMMARY' && (
          <VictoryScreen
            score={score}
            results={results}
            onRestart={handleRestart}
            onHome={handleHome}
          />
        )}
      </main>

      {/* Dictionary Modal */}
      {showDictionary && (
        <DictionaryModal onClose={() => setShowDictionary(false)} />
      )}

      {/* Malaysian Voice Settings Modal */}
      {showVoiceSettings && (
        <VoiceSettingsModal onClose={() => setShowVoiceSettings(false)} />
      )}

      {/* Susun Ayat Bonus Modal */}
      {showSusunModal && (
        <SusunAyatModal
          question={currentQuestion}
          onClose={() => setShowSusunModal(false)}
          onSuccess={() => {
            setScore((prev) => prev + 10);
          }}
        />
      )}

      {/* Bottom Footer info */}
      <footer className="py-3 px-4 border-t border-amber-200/60 bg-white/60 text-center text-xs text-slate-500">
        <p>
          Susun & Menang: 20 Soalan Penjodoh Bilangan · Bahasa Melayu (KSSR Semakan)
        </p>
      </footer>
    </div>
  );
}
