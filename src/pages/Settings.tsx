import { AArrowDown, AArrowUp, Moon, Palette, Scaling, Sun } from 'lucide-react';
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { i18n } from '../i18n';
import { IconSize, TextSize } from '../types';

export function Settings() {
  const { language, theme, setTheme, textSize, setTextSize, iconSize, setIconSize } = useAppContext();
  const t = i18n[language];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100 mb-2">{t.settingsTitle}</h1>
        <p className="text-sm font-medium text-stone-600 dark:text-stone-400 tracking-wide">{t.settingsSubtitle}</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-xl p-4 space-y-4">
        <div className="flex items-center justify-between py-2 border-b border-stone-100 dark:border-zinc-800 pb-4">
          <div className="flex items-center gap-2 text-sm font-bold text-stone-900 dark:text-stone-100">
            <Palette className="w-5 h-5 text-stone-500" />
            <span>{t.themeLabel}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setTheme('light')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors border ${
                theme === 'light'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-stone-50 dark:bg-zinc-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-zinc-700 hover:bg-stone-100 dark:hover:bg-zinc-700'
              }`}
            >
              <Sun className="w-4 h-4" />
              <span>{t.lightMode}</span>
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors border ${
                theme === 'dark'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-stone-50 dark:bg-zinc-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-zinc-700 hover:bg-stone-100 dark:hover:bg-zinc-700'
              }`}
            >
              <Moon className="w-4 h-4" />
              <span>{t.darkMode}</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-stone-100 dark:border-zinc-800 pb-4">
          <div className="flex items-center gap-2 text-sm font-bold text-stone-900 dark:text-stone-100">
            <AArrowDown className="w-5 h-5 text-stone-500" />
            <span>{t.textSizeLabel}</span>
          </div>
          <div className="flex gap-2">
            {(['small', 'medium', 'large'] as TextSize[]).map((size) => (
              <button
                key={size}
                onClick={() => setTextSize(size)}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors border ${
                  textSize === size
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-stone-50 dark:bg-zinc-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-zinc-700 hover:bg-stone-100 dark:hover:bg-zinc-700'
                }`}
              >
                {size === 'small' ? t.sizeSmall : size === 'medium' ? t.sizeMedium : t.sizeLarge}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2 text-sm font-bold text-stone-900 dark:text-stone-100">
            <Scaling className="w-5 h-5 text-stone-500" />
            <span>{t.iconSizeLabel}</span>
          </div>
          <div className="flex gap-2">
            {(['small', 'medium', 'large'] as IconSize[]).map((size) => (
              <button
                key={size}
                onClick={() => setIconSize(size)}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors border ${
                  iconSize === size
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-stone-50 dark:bg-zinc-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-zinc-700 hover:bg-stone-100 dark:hover:bg-zinc-700'
                }`}
              >
                {size === 'small' ? t.sizeSmall : size === 'medium' ? t.sizeMedium : t.sizeLarge}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
