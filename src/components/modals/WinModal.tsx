import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { EmojiHappyIcon } from "@heroicons/react/outline";
import { MiniGrid } from "../mini-grid/MiniGrid";
import { getGuessStatuses } from "../../lib/statuses";

const emojiMap = {
  correct: '🟩',
  present: '🟨',
  absent: '⬜',
};


type Props = {
  isOpen: boolean;
  handleClose: () => void;
  guesses: string[];
};

export const WinModal = ({ isOpen, handleClose, guesses }: Props) => {
  const [isCopied, setIsCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (!isOpen) return;

    const updateTimer = () => {
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const msLeft = tomorrow.getTime() - now.getTime();
      
      if (msLeft <= 0) {
        setTimeLeft('00:00:00');
        return;
      }

      const hours = Math.floor(msLeft / (1000 * 60 * 60)).toString().padStart(2, '0');
      const minutes = Math.floor((msLeft % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
      const seconds = Math.floor((msLeft % (1000 * 60)) / 1000).toString().padStart(2, '0');
      setTimeLeft(`${hours}:${minutes}:${seconds}`);
    };

    updateTimer();
    const intervalId = setInterval(updateTimer, 1000);

    return () => clearInterval(intervalId);
  }, [isOpen]);

  const handleShare = async () => {
    const emojiResults = await Promise.all(
      guesses.map(async (guess) => {
        const statuses = await getGuessStatuses(guess);
        return statuses.reverse().map(status => emojiMap[status]).join('');
      })
    ).then(results => results.join('\n'));

    const shareText = `ءسوزدىل ${guesses.length}/6\n\n${emojiResults}\n\nsozdle.3epge.com`;

    navigator.clipboard.writeText(shareText).then(() => {
      setIsCopied(true);
    }).catch(() => {
      const textArea = document.createElement('textarea');
      textArea.value = shareText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setIsCopied(true);
    });
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={handleClose}
      >
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg px-12 pt-6 pb-6 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <EmojiHappyIcon
                    className="h-6 w-6 text-green-600"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title
                    as="h3"
                    className="text-lg leading-6 font-medium text-gray-900"
                  >
                    {"ءاپ-بارەكەلدى!"}
                  </Dialog.Title>
                  <div className="mt-2">
                    <MiniGrid guesses={guesses} />
                    <p className="text-sm text-gray-500">{"كەلەسى ويىنعا دەيىنگى ۋاقىت:"}</p>
                    <p className="text-lg font-medium text-gray-900">{timeLeft || '00:00:00'}</p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm"
                  onClick={handleShare}
                >
                  {isCopied ? "كوشىرىلدى!" : "ناتيجەمەن ءبولىسۋ"}
                </button>
              </div>
              <div className="mt-2 sm:mt-2">
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-200 text-base font-medium text-black hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-100 sm:text-sm"
                  onClick={handleClose}
                >
                  {"شىعۋ"}
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
