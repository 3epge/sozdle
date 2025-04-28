import { InformationCircleIcon } from "@heroicons/react/outline";
import { useState, useEffect } from "react";
import { Alert } from "./components/alerts/Alert";
import { Grid } from "./components/grid/Grid";
import { Keyboard } from "./components/keyboard/Keyboard";
import { InfoModal } from "./components/modals/InfoModal";
import { WinModal } from "./components/modals/WinModal";
import NotFoundModal from "./components/modals/NotFoundModal";
import { isWordInWordList, isWinningWord, getSolution } from "./lib/words";

type GameStateType = {
  guesses: string[];
  isGameWon: boolean;
  isGameLost: boolean;
  solution: string;
};

const GAME_STATE_KEY = "sozdleGameState";
const LAST_PLAYED_KEY = "lastPlayedDate";

const initialGameState: GameStateType = {
  guesses: [],
  isGameWon: false,
  isGameLost: false,
  solution: "",
};

function App() {
  const [gameState, setGameState] = useState<GameStateType>(() => {
    const saved = localStorage.getItem(GAME_STATE_KEY);
    return saved ? { ...initialGameState, ...JSON.parse(saved) } : initialGameState;
  });

  const [currentGuess, setCurrentGuess] = useState("");
  const [isWinModalOpen, setIsWinModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isNotFoundModalOpen, setIsNotFoundModalOpen] = useState(false);
  const [isWordSubmittedAlertOpen, setIsWordSubmittedAlertOpen] = useState(false);

  useEffect(() => {
    async function fetchSolution() {
      try {
        const sol = await getSolution();
        setGameState((prev) => ({ ...prev, solution: sol }));
      } catch (error) {
        console.error('Failed to fetch solution:', error);
      }
    }
    fetchSolution();
  }, []);

  useEffect(() => {
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  useEffect(() => {
    const today = new Date().toLocaleDateString();
    const lastPlayedDate = localStorage.getItem(LAST_PLAYED_KEY);

    if (lastPlayedDate !== today) {
      setGameState(initialGameState);
      setCurrentGuess("");
      localStorage.setItem(LAST_PLAYED_KEY, today);
      localStorage.removeItem(GAME_STATE_KEY);
    }
  }, []);

  useEffect(() => {
    if (gameState.isGameWon && gameState.guesses.length > 0) {
      setIsWinModalOpen(true);
    }
  }, [gameState.isGameWon, gameState.guesses]);

  const onChar = (value: string) => {
    if (
      gameState.isGameWon ||
      gameState.isGameLost ||
      gameState.guesses.length >= 6 ||
      currentGuess.length >= 5
    ) {
      return;
    }
    setCurrentGuess((prev) => prev + value);
  };

  const onDelete = () => {
    if (gameState.isGameWon || gameState.isGameLost || !currentGuess) {
      return;
    }
    setCurrentGuess((prev) => prev.slice(0, -1));
  };

  const onEnter = async () => {
    if (
      gameState.isGameWon ||
      gameState.isGameLost ||
      currentGuess.length !== 5 ||
      gameState.guesses.length >= 6
    ) {
      return;
    }

    const isValidWord = await isWordInWordList(currentGuess);
    if (!isValidWord) {
      setIsNotFoundModalOpen(true);
      return;
    }

    const newGuesses = [...gameState.guesses, currentGuess];
    const isWin = await isWinningWord(currentGuess);
    const isLoss = newGuesses.length === 6 && !isWin;

    setGameState((prev) => ({
      ...prev,
      guesses: newGuesses,
      isGameWon: isWin,
      isGameLost: isLoss,
    }));
    setCurrentGuess("");
  };

  const handleSubmit = () => {
    setIsNotFoundModalOpen(false);
    setCurrentGuess("");
    setIsWordSubmittedAlertOpen(true);
    const timeoutId = setTimeout(() => setIsWordSubmittedAlertOpen(false), 3000);
    return () => clearTimeout(timeoutId);
  };

  return (
    <div className="py-8 max-w-7xl mx-auto sm:px-6 lg:px-8">
      <Alert message="ۇلەس قوسقانىڭىزعا راحمەت! جاقىن ارادا سوزدەر تىزىمىنە قوسامىن." isOpen={isWordSubmittedAlertOpen} />
      <div className="flex w-80 mx-auto items-center mb-8">
        <h1 className="text-xl grow font-bold">ءسوزدىل</h1>
        <InformationCircleIcon
          className="h-6 w-6 cursor-pointer"
          onClick={() => setIsInfoModalOpen(true)}
        />
      </div>
      {gameState.isGameLost && (
        <div className="flex items-end justify-center mb-2">
          <div className="bg-gray-800 text-white py-2 px-4 rounded">{gameState.solution}</div>
        </div>
      )}
      <Grid guesses={gameState.guesses} currentGuess={currentGuess} />
      <Keyboard
        onChar={onChar}
        onDelete={onDelete}
        onEnter={onEnter}
        guesses={gameState.guesses}
      />
      <div className="flex items-end justify-center mt-4">
        <p dir="ltr" className="text-sm text-gray-500">
          {"Oiyndy töte jazuğa "}
          <a
            href="https://www.instagram.com/3epge/"
            className="underline font-bold"
            target="_blank"
            rel="noopener noreferrer"
          >
            {"Tūrdybek Zerde"}
          </a>
          {" beiımdegen."}
        </p>
      </div>
      <NotFoundModal
        isOpen={isNotFoundModalOpen}
        handleClose={() => setIsNotFoundModalOpen(false)}
        currentGuess={currentGuess}
        onSubmit={handleSubmit}
      />
      <WinModal
        isOpen={isWinModalOpen}
        handleClose={() => setIsWinModalOpen(false)}
        guesses={gameState.guesses}
      />
      <InfoModal
        isOpen={isInfoModalOpen}
        handleClose={() => setIsInfoModalOpen(false)}
      />
    </div>
  );
}

export default App;