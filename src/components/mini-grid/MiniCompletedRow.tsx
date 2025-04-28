import { useEffect, useState } from "react";
import { CharStatus, getGuessStatuses } from "../../lib/statuses";
import { MiniCell } from "./MiniCell";

type Props = {
  guess: string;
};

export const MiniCompletedRow = ({ guess }: Props) => {
  const [statuses, setStatuses] = useState<CharStatus[] | null>(null);
  
    useEffect(() => {
      async function fetchStatuses() {
        try {
          const result = await getGuessStatuses(guess);
          setStatuses(result);
        } catch (error) {
          console.error('Failed to fetch statuses:', error);
          setStatuses([]);
        }
      }
      fetchStatuses();
    }, [guess]);
  
    if (!statuses) {
      return <div className="flex justify-center mb-1">Loading...</div>;
    }

  return (
    <div className="flex justify-center mb-1">
      {guess.split("").map((letter, i) => (
        <MiniCell key={i} status={statuses[i]} />
      ))}
    </div>
  );
};
