import { Send } from 'lucide-react';
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { i18n } from '../i18n';

export function Contact() {
  const { language } = useAppContext();
  const t = i18n[language];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100 mb-2">{t.contactTitle}</h1>
        <p className="text-sm font-medium text-stone-600 dark:text-stone-400 tracking-wide">{t.contactSubtitle}</p>
      </div>

      <div className="space-y-4">
        <a
          href="https://t.me/Swnt7771"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-xl p-5 transition-all hover:border-blue-500 dark:hover:border-blue-500 hover:-translate-y-0.5 hover:shadow-lg dark:hover:shadow-zinc-900/50"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <Send className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wide">Telegram</div>
            <div className="text-base font-bold text-stone-900 dark:text-stone-100 mt-0.5">@Swnt7771</div>
          </div>
        </a>
      </div>
    </div>
  );
}
