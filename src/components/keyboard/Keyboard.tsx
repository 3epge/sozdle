import { KeyValue } from "../../lib/keyboard";
import { getStatuses } from "../../lib/statuses";
import { Key } from "./Key";

type Props = {
  onChar: (value: string) => void;
  onDelete: () => void;
  onEnter: () => void;
  guesses: string[];
};

export const Keyboard = ({ onChar, onDelete, onEnter, guesses }: Props) => {
  const charStatuses = getStatuses(guesses);
  console.log(charStatuses);

  const onClick = (value: KeyValue) => {
    if (value === "ENTER") {
      return onEnter();
    }
    if (value === "DELETE") {
      return onDelete();
    }
    return onChar(value);
  };

  return (
    <div>
      <div className="flex justify-center mb-1">
        <Key value="پ" onClick={onClick} status={charStatuses["پ"]} />
        <Key value="و" onClick={onClick} status={charStatuses["و"]} />
        <Key value="ي" onClick={onClick} status={charStatuses["ي"]} />
        <Key value="ۇ" onClick={onClick} status={charStatuses["ۇ"]} />
        <Key value="ى" onClick={onClick} status={charStatuses["ى"]} />
        <Key value="ت" onClick={onClick} status={charStatuses["ت"]} />
        <Key value="ر" onClick={onClick} status={charStatuses["ر"]} />
        <Key value="ە" onClick={onClick} status={charStatuses["ە"]} />
        <Key value="ۋ" onClick={onClick} status={charStatuses["ۋ"]} />
        <Key value="ق" onClick={onClick} status={charStatuses["ق"]} />
      </div>
      <div className="flex justify-center mb-1">
        <Key value="ل" onClick={onClick} status={charStatuses["ل"]} />
        <Key value="ك" onClick={onClick} status={charStatuses["ك"]} />
        <Key value="ج" onClick={onClick} status={charStatuses["ج"]} />
        <Key value="ح" onClick={onClick} status={charStatuses["ح"]} />
        <Key value="گ" onClick={onClick} status={charStatuses["گ"]} />
        <Key value="ف" onClick={onClick} status={charStatuses["ف"]} />
        <Key value="د" onClick={onClick} status={charStatuses["د"]} />
        <Key value="س" onClick={onClick} status={charStatuses["س"]} />
        <Key value="ا" onClick={onClick} status={charStatuses["ا"]} />
      </div>
      <div className="flex justify-center">
        <Key width={65.4} value="ENTER" onClick={onClick}>
          {"ەنگىزۋ"}
        </Key>
        <Key value="م" onClick={onClick} status={charStatuses["م"]} />
        <Key value="ن" onClick={onClick} status={charStatuses["ن"]} />
        <Key value="ب" onClick={onClick} status={charStatuses["ب"]} />
        <Key value="ۆ" onClick={onClick} status={charStatuses["ۆ"]} />
        <Key value="ع" onClick={onClick} status={charStatuses["ع"]} />
        <Key value="ش" onClick={onClick} status={charStatuses["ش"]} />
        <Key value="ز" onClick={onClick} status={charStatuses["ز"]} />
        <Key width={65.4} value="DELETE" onClick={onClick}>
          {"جويۋ"}
        </Key>
      </div>
    </div>
  );
};
