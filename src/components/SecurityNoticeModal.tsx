import React from 'react';
import { ShieldCheck, Lock, AlertTriangle, FileText, X, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { i18n } from '../i18n';

interface SecurityNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityNoticeModal: React.FC<SecurityNoticeModalProps> = ({ isOpen, onClose }) => {
  const { language } = useAppContext();
  const t = i18n[language];

  if (!isOpen) return null;

  const handleAccept = () => {
    try {
      localStorage.setItem('galaxy_tunnel_notice_seen', 'true');
    } catch {
      // ignore
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl max-h-[90vh] bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Glowing Accent */}
        <div className="relative p-5 sm:p-6 border-b border-stone-200 dark:border-zinc-800 bg-gradient-to-br from-sky-500/5 via-transparent to-emerald-500/5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 shadow-inner">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <span>{t.securityModalTitle}</span>
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  {t.securityModalSubtitle}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
          {/* Pillar 1: Clean Code & Zero-Logs */}
          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
            <div className="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-400 mb-2">
              <Lock className="w-4 h-4 shrink-0" />
              <span>{t.secPillar1Title}</span>
            </div>
            <div className="space-y-1.5 text-stone-600 dark:text-stone-400">
              <p>{t.secPillar1Desc1}</p>
              <p className="font-medium text-emerald-800 dark:text-emerald-300">
                {t.secPillar1Desc2}
              </p>
            </div>
          </div>

          {/* Pillar 2: Fair Usage Policy */}
          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <div className="flex items-center gap-2 font-bold text-amber-700 dark:text-amber-400 mb-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{t.secPillar2Title}</span>
            </div>
            <div className="space-y-1.5 text-stone-600 dark:text-stone-400">
              <p>{t.secPillar2Desc1}</p>
              <p>{t.secPillar2Desc2}</p>
            </div>
          </div>

          {/* Pillar 3: Disclaimer & Limitation of Liability */}
          <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/20">
            <div className="flex items-center gap-2 font-bold text-sky-700 dark:text-sky-400 mb-2">
              <FileText className="w-4 h-4 shrink-0" />
              <span>{t.secPillar3Title}</span>
            </div>
            <div className="space-y-1.5 text-stone-600 dark:text-stone-400">
              <p>{t.secPillar3Desc1}</p>
              <p className="italic text-stone-500 dark:text-stone-400">
                {t.secPillar3Desc2}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-stone-200 dark:border-zinc-800 bg-stone-50 dark:bg-zinc-900/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[11px] text-stone-500 dark:text-stone-400 text-center sm:text-left">
            {language === 'my' 
              ? 'ဤအချက်အလက်များကို ဆာဗာစာမျက်နှာမှ အချိန်မရွေး ပြန်လည်ဖတ်ရှုနိုင်ပါသည်။'
              : 'You can review this statement anytime from the Servers dashboard.'}
          </span>
          <button
            onClick={handleAccept}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 shrink-0"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{t.secAcceptBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
