import { Menu } from 'lucide-react';
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { i18n } from '../i18n';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { language, setLanguage } = useAppContext();
  const t = i18n[language];

  return (
    <header className="sticky top-0 z-20 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-stone-200 dark:border-zinc-800 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-1.5 font-orbitron tracking-[0.15em] text-base sm:text-lg font-black select-none uppercase">
          <span className="text-stone-900 dark:text-white">
            GALAXY
          </span>
          <span className="bg-gradient-to-r from-sky-600 to-cyan-600 dark:from-[#d5f5fa] dark:via-[#38bdf8] dark:to-[#0284c7] bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(56,189,248,0.25)]">
            TUNNEL
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setLanguage('my')}
          className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors border ${
            language === 'my' 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-zinc-700 hover:bg-stone-200 dark:hover:bg-zinc-700'
          }`}
        >
          MY
        </button>
        <button
          onClick={() => setLanguage('en')}
          className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors border ${
            language === 'en' 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-zinc-700 hover:bg-stone-200 dark:hover:bg-zinc-700'
          }`}
        >
          EN
        </button>
      </div>
    </header>
  );
}
