let wordList: string[] = [];
let solution: string | null = null;

async function fetchWordList(): Promise<string[]> {
  if (wordList.length > 0) {
    return wordList;
  }
  try {
    const response = await fetch(
      process.env.NODE_ENV === 'production'
        ? 'https://sozdle.3epge.com/api/approved-words'
        : 'http://localhost:4200/api/approved-words'
    );
    if (!response.ok) {
      throw new Error('Failed to fetch word list');
    }
    wordList = await response.json();
    return wordList;
  } catch (error) {
    console.error('Error fetching word list:', error);
    return [];
  }
}

export const isWordInWordList = async (word: string): Promise<boolean> => {
  const words = await fetchWordList();
  return words.includes(word.toLowerCase());
};

export const isWinningWord = async (word: string): Promise<boolean> => {
  const sol = await getSolution();
  return sol === word;
};

export const getWordOfDay = async (): Promise<string> => {
  const words = await fetchWordList();
  if (words.length === 0) {
    throw new Error('Word list is empty');
  }
  const epochDate = new Date('2025-04-14T00:00:00Z');
  const epochMs = epochDate.getTime();
  const now = new Date();
  const localMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const msInDay = 86400000;
  const index = Math.floor((localMidnight.getTime() - epochMs) / msInDay);
  const safeIndex = index % words.length;
  return words[Math.abs(safeIndex)];
};

export const getSolution = async (): Promise<string> => {
  if (solution) {
    return solution;
  }
  solution = await getWordOfDay();
  return solution;
};

fetchWordList().then(() => getSolution()).catch(error => {
  console.error('Failed to initialize word list:', error);
});