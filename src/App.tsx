import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Toast } from './components/Toast';
import { AppProvider } from './contexts/AppContext';
import { Apps } from './pages/Apps';
import { Contact } from './pages/Contact';
import { Servers } from './pages/Servers';
import { Settings } from './pages/Settings';
import { SublinkGenerator } from './pages/SublinkGenerator';
import { Page } from './types';

function AppContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [page, setPage] = useState<Page>('servers');

  const renderPage = () => {
    switch (page) {
      case 'servers': return <Servers />;
      case 'sublink': return <SublinkGenerator />;
      case 'apps': return <Apps />;
      case 'settings': return <Settings />;
      case 'contact': return <Contact />;
      default: return <Servers />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-[#1a1a18] text-stone-900 dark:text-stone-100 font-sans selection:bg-blue-200 dark:selection:bg-blue-900 transition-colors duration-300">
      <Toast />
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        currentPage={page}
        onNavigate={setPage}
      />
      
      <main className="max-w-xl mx-auto px-4 py-6">
        {renderPage()}
      </main>

      <footer className="text-center py-6 text-xs text-stone-500 dark:text-stone-500 mt-8 border-t border-stone-200 dark:border-zinc-800">
        <p>© 2026 Galaxy Tunnel Team. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
