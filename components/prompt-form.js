import { useEffect, useState } from "react";
import Message from "./message";
import Dropzone from "components/dropzone";
import {
  Download as DownloadIcon,
  Info as InfoIcon,
  XCircle as StartOverIcon,
} from "lucide-react";
import Link from "next/link";

export default function PromptForm({
  initialPrompt,
  isFirstPrompt,
  onSubmit,
  disabled = false,
  events = [],
  startOver,
  handleImageDropped,
  currentLanguage = 'en',
  t = (key) => key,
}) {
  const [prompt, setPrompt] = useState(initialPrompt);

  useEffect(() => {
    setPrompt(initialPrompt);
  }, [initialPrompt]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setPrompt("");
    onSubmit(e);
  };

  const handleInputChange = (e) => {
    setPrompt(e.target.value);
  };

  if (disabled) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-full text-sm font-medium shadow-sm">
          🎨 {t('processingMessage')}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="animate-in fade-in duration-700">
      <Message sender="replicate" isSameSender>
        <label htmlFor="prompt-input" className="text-lg font-medium text-slate-800">
          {isFirstPrompt
            ? "✨ " + t('describeVision')
            : "🎨 " + t('continueDescribing')}
        </label>
      </Message>

      <div className="flex gap-3 mt-6">
        <input
          id="prompt-input"
          type="text"
          name="prompt"
          value={prompt}
          onChange={handleInputChange}
          placeholder={t('placeholder')}
          className="flex-1 px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-lg bg-white/90 backdrop-blur-sm"
          disabled={disabled}
          required
        />

        <button
          className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          type="submit"
          disabled={!prompt.trim()}
        >
          ✨ {t('createButton')}
        </button>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-slate-600 mb-4 font-medium">
          💡 {t('proTip')}
        </p>
        
        {/* Action Buttons Area */}
        <div className="flex flex-wrap justify-center items-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm">
          <Link href={`/${currentLanguage}/about`} className="modern-button">
            <InfoIcon className="icon" />{t('about')}
          </Link>

          {events.length > 1 && (
            <button className="modern-button" onClick={startOver}>
              <StartOverIcon className="icon" />
              {t('startOver')}
            </button>
          )}

          <Dropzone onImageDropped={handleImageDropped} currentLanguage={currentLanguage} t={t} />

          {events.length > 2 && (
            <Link
              href={events.findLast((ev) => ev.image)?.image || "#"}
              className="modern-button primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              <DownloadIcon className="icon" />{t('download')}
            </Link>
          )}
        </div>
      </div>
    </form>
  );
}
