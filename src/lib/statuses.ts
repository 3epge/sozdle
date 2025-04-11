import { solution } from "./words";

export type CharStatus = "absent" | "present" | "correct";

export type CharValue =
  | "پ"
  | "و"
  | "ي"
  | "ۇ"
  | "ى"
  | "ت"
  | "ر"
  | "ە"
  | "ۋ"
  | "ق"
  | "ل"
  | "ك"
  | "ج"
  | "ح"
  | "گ"
  | "ف"
  | "د"
  | "س"
  | "ا"
  | "م"
  | "ن"
  | "ب"
  | "ۆ"
  | "ع"
  | "ش"
  | "ز";

// Helper function to properly split Arabic script words
function splitWord(word: string): string[] {
  const normalized = word.normalize('NFC');
  // Split into array accounting for ligatures
  return [...normalized];
}

export const getStatuses = (
  guesses: string[]
): { [key: string]: CharStatus } => {
  const charObj: { [key: string]: CharStatus } = {};
  console.log(solution)
  const normalizedSolution = solution.normalize('NFC');
  console.log()

  guesses.forEach((word) => {
    const normalizedGuess = word.normalize('NFC');
    splitWord(normalizedGuess).forEach((letter, i) => {
      if (!normalizedSolution.includes(letter)) {
        // make status absent
        return (charObj[letter] = "absent");
      }

      if (letter === normalizedSolution[i]) {
        // make status correct
        return (charObj[letter] = "correct");
      }

      if (charObj[letter] !== "correct") {
        // make status present
        return (charObj[letter] = "present");
      }
    });
  });

  return charObj;
};

export const getGuessStatuses = (guess: string): CharStatus[] => {
  const normalizedSolution = solution.normalize('NFC');
  const normalizedGuess = guess.normalize('NFC');
  
  const splitSolution = splitWord(normalizedSolution);
  const splitGuess = splitWord(normalizedGuess);

  const solutionCharsTaken = splitSolution.map((_) => false);
  const statuses: CharStatus[] = Array.from(Array(guess.length));

  // handle all correct cases first
  splitGuess.forEach((letter, i) => {
    if (letter === splitSolution[i]) {
      statuses[i] = "correct";
      solutionCharsTaken[i] = true;
      return;
    }
  });

  splitGuess.forEach((letter, i) => {
    if (statuses[i]) return;

    if (!splitSolution.includes(letter)) {
      // handles the absent case
      statuses[i] = "absent";
      return;
    }

    // now we are left with "present"s
    const indexOfPresentChar = splitSolution.findIndex(
      (x, index) => x === letter && !solutionCharsTaken[index]
    );

    if (indexOfPresentChar > -1) {
      statuses[i] = "present";
      solutionCharsTaken[indexOfPresentChar] = true;
      return;
    } else {
      statuses[i] = "absent";
      return;
    }
  });

  return statuses;
};