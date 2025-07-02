import { RotateCcw as UndoIcon } from "lucide-react";
import Image from "next/image";
import { Fragment, useEffect, useRef } from "react";
import Message from "./message";

export default function Messages({ events, isProcessing, onUndo, currentLanguage = 'en', t = (key) => key }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (events.length > 2) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [events.length]);

  return (
    <section className="w-full">
      {events.map((ev, index) => {
        if (ev.image) {
          return (
            <Fragment key={"image-" + index}>
              <Message sender="replicate" shouldFillWidth>
                <div className="relative overflow-hidden rounded-2xl shadow-lg bg-white p-2">
                <Image
                  alt={
                    ev.prompt
                        ? `${t('processedImageAlt')} "${ev.prompt}"`
                        : t('originalImageAlt')
                  }
                  width="512"
                  height="512"
                  priority={true}
                    className="w-full h-auto rounded-xl"
                  src={ev.image}
                />
                </div>

                {onUndo && index > 0 && index === events.length - 1 && (
                  <div className="mt-4 text-center">
                    <button
                      className="modern-button secondary"
                      onClick={() => {
                        onUndo(index);
                      }}
                    >
                      <UndoIcon className="icon" /> {t('undoAndTryOther')}
                    </button>
                  </div>
                )}
              </Message>

              {(isProcessing || index < events.length - 1) && (
                <Message sender="replicate" isSameSender>
                  {index === 0
                    ? t('whatToModify')
                    : t('nextModification')}
                </Message>
              )}
            </Fragment>
          );
        }

        if (ev.prompt) {
          return (
            <Message key={"prompt-" + index} sender="user">
              {ev.prompt}
            </Message>
          );
        }
      })}

      {isProcessing && (
        <Message sender="replicate">
          <div className="flex items-center gap-3">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            </div>
            <span className="text-sm opacity-70">{t('aiProcessing')}</span>
          </div>
        </Message>
      )}

      <div ref={messagesEndRef} />
    </section>
  );
}
