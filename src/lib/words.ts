import { WORDS } from "../constants/wordlist";

export const isWordInWordList = (word: string) => {
  return WORDS.includes(word.toLowerCase());
};

export const isWinningWord = (word: string) => {
  return solution === word;
};

export const getWordOfDay = () => {
  // Apr 11, 2025 Game Epoch (in milliseconds)
  const epochMs = 1744300800000;
  const now = Date.now();
  const msInDay = 86400000;
  const index = Math.floor((now - epochMs) / msInDay);

  const safeIndex = index % WORDS.length;
  return WORDS[Math.abs(safeIndex)];
};

export const solution = getWordOfDay();
