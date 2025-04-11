import { InformationCircleIcon } from "@heroicons/react/outline";
import { useState, useEffect } from "react";
import { Alert } from "./components/alerts/Alert";
import { Grid } from "./components/grid/Grid";
import { Keyboard } from "./components/keyboard/Keyboard";
import { InfoModal } from "./components/modals/InfoModal";
import { WinModal } from "./components/modals/WinModal";
import { isWordInWordList, isWinningWord, solution } from "./lib/words";

function App() {
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [isGameWon, setIsGameWon] = useState(false);
  const [isWinModalOpen, setIsWinModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isWordNotFoundAlertOpen, setIsWordNotFoundAlertOpen] = useState(false);
  const [isGameLost, setIsGameLost] = useState(false);

  useEffect(() => {
    if (isGameWon) {
      setIsWinModalOpen(true);
    }
  }, [isGameWon]);

  const onChar = (value: string) => {
    if (currentGuess.length < 5 && guesses.length < 6) {
      setCurrentGuess(`${currentGuess}${value}`);
    }
  };

  const onDelete = () => {
    setCurrentGuess(currentGuess.slice(0, -1));
  };

  const onEnter = () => {
    if (!isWordInWordList(currentGuess)) {
      setIsWordNotFoundAlertOpen(true);
      return setTimeout(() => {
        setIsWordNotFoundAlertOpen(false);
      }, 2000);
    }

    const winningWord = isWinningWord(currentGuess);

    if (currentGuess.length === 5 && guesses.length < 6 && !isGameWon) {
      setGuesses([...guesses, currentGuess]);
      setCurrentGuess("");

      if (winningWord) {
        return setIsGameWon(true);
      }

      if (guesses.length === 5) {
        setIsGameLost(true);
        return setTimeout(() => {
          setIsGameLost(false);
        }, 5000);
      }
    }
  };

  return (
    <div className="py-8 max-w-7xl mx-auto sm:px-6 lg:px-8">
      <Alert message="ءسوز تابىلمادى" isOpen={isWordNotFoundAlertOpen} />
      <Alert
        message={`جەڭىلىپ قالدىڭىز. جاۋابى ${solution} بولعان.`}
        isOpen={isGameLost}
      />
      <div className="flex w-80 mx-auto items-center mb-8">
        <h1 className="text-xl grow font-bold">ءسوزدىل</h1>
        <InformationCircleIcon
          className="h-6 w-6 cursor-pointer"
          onClick={() => setIsInfoModalOpen(true)}
        />
      </div>
      <Grid guesses={guesses} currentGuess={currentGuess} />
      <Keyboard
        onChar={onChar}
        onDelete={onDelete}
        onEnter={onEnter}
        guesses={guesses}
      />
      <WinModal
        isOpen={isWinModalOpen}
        handleClose={() => setIsWinModalOpen(false)}
        guesses={guesses}
      />
      <InfoModal
        isOpen={isInfoModalOpen}
        handleClose={() => setIsInfoModalOpen(false)}
      />
    </div>
  );
}

export default App;
