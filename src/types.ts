export interface Question {
  id: number;
  penjodohBilangan: string;
  benda: string;
  ayatSebelum: string;
  ayatSelepas: string;
  ayatLengkap: string;
  penerangan: string;
  kategori: string;
  emoji: string;
  pilihan: string[];
  petunjuk: string;
  susunAyatFrasa: string[]; // For sentence arranging bonus challenge
}

export interface QuestionResult {
  questionId: number;
  selectedAnswer: string;
  isCorrect: boolean;
  attempts: number;
}

export type GameView = 'HOME' | 'PLAYING' | 'DICTIONARY' | 'SUMMARY';
