import { Cog, Grid, Info, Link as LinkIcon, Server } from 'lucide-react';
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { i18n } from '../i18n';
import { Page } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function Sidebar({ isOpen, onClose, currentPage, onNavigate }: SidebarProps) {
  const { language } = useAppContext();
  const t = i18n[language];

  const menuItems = [
    { id: 'servers', icon: Server, label: t.navServers },
    { id: 'sublink', icon: LinkIcon, label: t.navSublink },
    { id: 'apps', icon: Grid, label: t.navApps },
    { id: 'settings', icon: Cog, label: t.navSettings },
    { id: 'contact', icon: Info, label: t.navContact },
  ] as const;

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/50 transition-opacity z-30 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      <div className={`fixed left-0 top-0 w-[280px] h-full bg-white dark:bg-zinc-900 border-r border-stone-200 dark:border-zinc-800 transition-transform duration-300 z-40 shadow-xl ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-5 border-b border-stone-200 dark:border-zinc-800 flex items-center gap-1.5 font-orbitron tracking-[0.15em] text-base font-black select-none uppercase">
          <span className="text-stone-900 dark:text-white">GALAXY</span>
          <span className="bg-gradient-to-r from-sky-600 to-cyan-600 dark:from-[#d5f5fa] dark:via-[#38bdf8] dark:to-[#0284c7] bg-clip-text text-transparent">TUNNEL</span>
        </div>
        <div className="py-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id as Page);
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-l-4 ${
                currentPage === item.id 
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400' 
                  : 'text-stone-600 dark:text-stone-400 border-transparent hover:bg-stone-50 dark:hover:bg-zinc-800 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
