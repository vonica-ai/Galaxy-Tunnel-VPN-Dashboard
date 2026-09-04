import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

export function Toast() {
  const { toast, hideToast } = useAppContext();

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          id="toast-notification"
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.95 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="fixed top-5 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92vw] sm:w-auto"
        >
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-stone-200 dark:border-zinc-800 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
            <div className="shrink-0">
              {toast.type === 'success' && (
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              )}
              {toast.type === 'warning' && (
                <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              )}
              {toast.type === 'error' && (
                <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400">
                  <AlertCircle className="w-5 h-5" />
                </div>
              )}
              {toast.type === 'info' && (
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Info className="w-5 h-5" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-[160px] pr-1">
              <p className="text-sm font-semibold text-stone-900 dark:text-stone-100 leading-tight">
                {toast.message}
              </p>
              {toast.subtitle && (
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 leading-snug">
                  {toast.subtitle}
                </p>
              )}
            </div>

            <button
              onClick={hideToast}
              className="shrink-0 p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-md transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
