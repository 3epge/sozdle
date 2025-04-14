import { WORDS } from "../constants/wordlist";

export const isWordInWordList = (word: string) => {
  return WORDS.includes(word.toLowerCase());
};

export const isWinningWord = (word: string) => {
  return solution === word;
};

export const getWordOfDay = () => {
  const epochDate = new Date("2025-04-14T00:00:00Z");
  const epochMs = epochDate.getTime();
  const now = new Date();
  const localMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const msInDay = 86400000;
  const index = Math.floor((localMidnight.getTime() - epochMs) / msInDay);
  const safeIndex = index % WORDS.length;
  return WORDS[Math.abs(safeIndex)];
};

export const solution = getWordOfDay();
