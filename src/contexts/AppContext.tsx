import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { IconSize, Language, TextSize, Theme, ToastMessage } from '../types';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  iconSize: IconSize;
  setIconSize: (size: IconSize) => void;
  toast: ToastMessage | null;
  showToast: (message: string, options?: { type?: ToastMessage['type']; subtitle?: string; duration?: number }) => void;
  hideToast: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('my');
  const [theme, setThemeState] = useState<Theme>('light');
  const [textSize, setTextSizeState] = useState<TextSize>('medium');
  const [iconSize, setIconSizeState] = useState<IconSize>('medium');
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  const showToast = useCallback((message: string, options?: { type?: ToastMessage['type']; subtitle?: string; duration?: number }) => {
    const id = Math.random().toString(36).substring(2, 9);
    const type = options?.type || 'success';
    const subtitle = options?.subtitle;
    const duration = options?.duration ?? 3000;

    setToast({ id, message, type, subtitle });

    setTimeout(() => {
      setToast(current => (current?.id === id ? null : current));
    }, duration);
  }, []);

  useEffect(() => {
    const savedLang = localStorage.getItem('lang') as Language;
    if (savedLang && ['en', 'my'].includes(savedLang)) setLanguageState(savedLang);
    
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && ['light', 'dark'].includes(savedTheme)) setThemeState(savedTheme);
    
    const savedTextSize = localStorage.getItem('textSize') as TextSize;
    if (savedTextSize && ['small', 'medium', 'large'].includes(savedTextSize)) setTextSizeState(savedTextSize);
    
    const savedIconSize = localStorage.getItem('iconSize') as IconSize;
    if (savedIconSize && ['small', 'medium', 'large'].includes(savedIconSize)) setIconSizeState(savedIconSize);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const sizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px'
    };
    document.documentElement.style.fontSize = sizeMap[textSize];
  }, [textSize]);

  useEffect(() => {
    const iconScaleMap = {
      small: '0.85',
      medium: '1',
      large: '1.2'
    };
    document.documentElement.style.setProperty('--icon-scale', iconScaleMap[iconSize]);
  }, [iconSize]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('lang', lang);
  };

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem('theme', t);
  };

  const setTextSize = (s: TextSize) => {
    setTextSizeState(s);
    localStorage.setItem('textSize', s);
  };

  const setIconSize = (s: IconSize) => {
    setIconSizeState(s);
    localStorage.setItem('iconSize', s);
  };

  return (
    <AppContext.Provider value={{ 
      language, 
      setLanguage, 
      theme, 
      setTheme, 
      textSize, 
      setTextSize, 
      iconSize, 
      setIconSize,
      toast,
      showToast,
      hideToast
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
