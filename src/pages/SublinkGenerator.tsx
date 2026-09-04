import { CheckCircle2, Copy, Plus, Clock, ShieldCheck, AlertTriangle, Download } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { i18n } from '../i18n';

const MAX_PER_MINUTE = 5;
const COOLDOWN_SECONDS = 5;

export function SublinkGenerator() {
  const { language, showToast } = useAppContext();
  const t = i18n[language];
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Rate Limiting & Cooldown states
  const [generationTimestamps, setGenerationTimestamps] = useState<number[]>(() => {
    try {
      const saved = sessionStorage.getItem('sub_gen_timestamps');
      if (saved) {
        const parsed = JSON.parse(saved) as number[];
        const now = Date.now();
        return parsed.filter(ts => now - ts < 60000);
      }
    } catch {
      // ignore
    }
    return [];
  });
  const [cooldown, setCooldown] = useState(0);

  // Periodic cleanup and countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setGenerationTimestamps(prev => {
        const filtered = prev.filter(ts => now - ts < 60000);
        if (filtered.length !== prev.length) {
          sessionStorage.setItem('sub_gen_timestamps', JSON.stringify(filtered));
        }
        return filtered;
      });

      setCooldown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Compute remaining allowed generations in rolling 60 seconds
  const recentCount = generationTimestamps.filter(ts => Date.now() - ts < 60000).length;
  const remainingGenerations = Math.max(0, MAX_PER_MINUTE - recentCount);

  const generate = () => {
    setError(null);

    // 1. Cooldown Check
    if (cooldown > 0) {
      setError(language === 'my' 
        ? `ခေတ္တစောင့်ဆိုင်းပါ (${cooldown} စက္ကန့် ကျန်ပါသေးသည်)`
        : `Please wait (${cooldown}s cooldown remaining)`);
      return;
    }

    // 2. Rolling 1-minute Rate Limit Check (Max 5/min)
    const now = Date.now();
    const activeTimestamps = generationTimestamps.filter(ts => now - ts < 60000);
    if (activeTimestamps.length >= MAX_PER_MINUTE) {
      const oldest = activeTimestamps[0];
      const waitSeconds = Math.ceil((60000 - (now - oldest)) / 1000);
      const limitMsg = language === 'my'
        ? `၁ မိနစ်အတွင်း အများဆုံး ${MAX_PER_MINUTE} ကြိမ်သာ ကန့်သတ်ထားပါသည်။ ${waitSeconds} စက္ကန့် စောင့်ဆိုင်းပေးပါ။`
        : `Rate limit reached (max ${MAX_PER_MINUTE}/min). Please wait ${waitSeconds}s before trying again.`;
      setError(limitMsg);
      showToast(limitMsg, { type: 'warning', duration: 4000 });
      return;
    }

    let val = input.trim();
    const sanitized = val
      .replace(/allowinsecure=true/gi, 'allowInsecure=false')
      .replace(/allowinsecure=1/gi, 'allowInsecure=0')
      .replace(/allow_insecure=true/gi, 'allow_insecure=false')
      .replace(/allow_insecure=1/gi, 'allow_insecure=0');

    if (sanitized !== val) {
      val = sanitized;
      setInput(sanitized);
    }

    const isVless = val.toLowerCase().includes('vless://');
    const isTrojan = val.toLowerCase().includes('trojan://');
    
    if (!isVless && !isTrojan) {
      setError(language === 'my' ? 'VLESS သို့မဟုတ် Trojan Format မှားယွင်းနေပါသည်' : 'Invalid VLESS or Trojan format');
      return;
    }
    try {
      const encodedConfig = encodeURIComponent(val);
      const paramName = val.toLowerCase().startsWith('vless://') ? 'vless' : (val.toLowerCase().startsWith('trojan://') ? 'trojan' : 'vless');
      const sub = `https://notes.galaxy-tunnel.top/?${paramName}=${encodedConfig}`;
      
      setResult(sub);
      setCopied(false);

      // Record this generation timestamp
      const updatedTimestamps = [...activeTimestamps, now];
      setGenerationTimestamps(updatedTimestamps);
      sessionStorage.setItem('sub_gen_timestamps', JSON.stringify(updatedTimestamps));

      // Start 5-second cooldown
      setCooldown(COOLDOWN_SECONDS);

      showToast(
        language === 'my' ? 'Sublink ထုတ်ယူခြင်း အောင်မြင်ပါသည်!' : 'Sublink generated successfully!',
        { type: 'info', subtitle: language === 'my' ? 'Copy ကူးယူ၍ VPN app တွင် အသုံးပြုနိုင်ပါပြီ' : 'Copy and paste into your VPN client' }
      );
    } catch {
      setError('Error generating sub link');
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      showToast(t.sublinkCopyToastTitle, {
        subtitle: t.sublinkCopyToastSubtitle,
        type: 'success',
        duration: 3500
      });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = result;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setCopied(true);
        showToast(t.sublinkCopyToastTitle, {
          subtitle: t.sublinkCopyToastSubtitle,
          type: 'success',
          duration: 3500
        });
        setTimeout(() => setCopied(false), 2500);
      } catch {
        console.error('Failed to copy');
      }
    }
  };

  const handleDownloadQR = () => {
    if (!result) return;
    try {
      const qrDomCanvas = document.getElementById('sublink-qr-canvas') as HTMLCanvasElement;
      if (!qrDomCanvas) return;

      const scale = 2; // High resolution retina scale
      const canvas = document.createElement('canvas');
      canvas.width = 440 * scale;
      canvas.height = 240 * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.scale(scale, scale);

      // Card Background (Dark Navy Cyber Gradient)
      const grad = ctx.createLinearGradient(0, 0, 440, 240);
      grad.addColorStop(0, '#0a1128');
      grad.addColorStop(1, '#050c1e');
      ctx.fillStyle = grad;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(0, 0, 440, 240, 20);
      } else {
        ctx.rect(0, 0, 440, 240);
      }
      ctx.fill();

      // Border stroke
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Glow accent
      const glow = ctx.createRadialGradient(380, 40, 0, 380, 40, 160);
      glow.addColorStop(0, 'rgba(6, 182, 212, 0.25)');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, 440, 240);

      // QR Code container Box
      const qrBoxX = 22;
      const qrBoxY = 24;
      const qrBoxSize = 192;
      const qrPadding = 12;

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 14);
      } else {
        ctx.fillRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize);
      }
      ctx.fill();

      // Draw QR on canvas
      ctx.drawImage(
        qrDomCanvas, 
        qrBoxX + qrPadding, 
        qrBoxY + qrPadding, 
        qrBoxSize - (qrPadding * 2), 
        qrBoxSize - (qrPadding * 2)
      );

      // Right Text Column
      const textX = 236;

      // Brand Title
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 20px "Orbitron", system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('GALAXY TUNNEL', textX, 50);

      // Config Subtitle
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 11px system-ui, sans-serif';
      const configType = input.toLowerCase().startsWith('vless://') ? 'VLESS CONFIG' : 'TROJAN CONFIG';
      ctx.fillText(configType, textX, 72);

      // Tagline
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px system-ui, sans-serif';
      ctx.fillText('Cloudflare Anycast • 100% Zero-Log', textX, 90);

      // Access Badge
      ctx.fillStyle = 'rgba(6, 182, 212, 0.15)';
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(textX, 110, 175, 26, 6);
      } else {
        ctx.fillRect(textX, 110, 175, 26);
      }
      ctx.fill();
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
      ctx.stroke();

      ctx.fillStyle = '#22d3ee';
      ctx.font = 'bold 10px system-ui, sans-serif';
      ctx.fillText('FREE COMMUNITY ACCESS', textX + 10, 127);

      // Divider line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.beginPath();
      ctx.moveTo(textX, 158);
      ctx.lineTo(418, 158);
      ctx.stroke();

      // Footer Instructions
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '11px system-ui, sans-serif';
      ctx.fillText('⚡ Scan with v2rayNG / Hiddify', textX, 180);

      ctx.fillStyle = '#64748b';
      ctx.font = '9px monospace, sans-serif';
      ctx.fillText(`DATE: ${new Date().toLocaleDateString()} • UNLIMITED`, textX, 202);

      // Export as PNG and trigger direct download
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `galaxy-tunnel-sublink-qr-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      showToast(t.downloadQrToast, {
        subtitle: language === 'my' ? 'ဖုန်းဓာတ်ပုံများထဲတွင် သိမ်းဆည်းပြီးပါပြီ' : 'Saved to your device gallery/downloads',
        type: 'success',
        duration: 3500
      });
    } catch (err) {
      console.error('Download QR failed', err);
      showToast(language === 'my' ? 'QR ပုံ ဒေါင်းလုဒ်မအောင်မြင်ပါ' : 'Failed to download QR image', {
        type: 'warning'
      });
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100 mb-2">{t.sublinkTitle}</h1>
        <p className="text-sm font-medium text-stone-600 dark:text-stone-400 tracking-wide">{t.sublinkSubtitle}</p>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-stone-600 dark:text-stone-400">
              {t.vlessLabel}
            </label>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-zinc-700">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
              <span>
                {t.rateLimitRemaining} <strong className="text-blue-600 dark:text-blue-400">{remainingGenerations}/{MAX_PER_MINUTE}</strong>
              </span>
            </div>
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="vless://uuid@host:port?..."
            className="w-full min-h-[100px] p-3 text-sm font-mono border border-stone-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-y"
          />
        </div>

        {error && (
          <div className="flex items-start gap-2.5 p-3.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-lg text-rose-700 dark:text-rose-400 text-xs font-medium animate-in fade-in">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
            <div className="flex-1 leading-relaxed">{error}</div>
          </div>
        )}

        <button
          onClick={generate}
          disabled={cooldown > 0 || remainingGenerations === 0}
          className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-lg text-sm font-semibold transition-all ${
            cooldown > 0 || remainingGenerations === 0
              ? 'bg-stone-300 dark:bg-zinc-800/60 text-stone-500 dark:text-stone-400 cursor-not-allowed border border-stone-300 dark:border-zinc-700/50'
              : 'bg-stone-900 text-white hover:bg-stone-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 shadow-sm active:scale-[0.99]'
          }`}
        >
          {cooldown > 0 ? (
            <>
              <Clock className="w-4 h-4 animate-spin" />
              <span>
                {language === 'my' ? 'ခေတ္တစောင့်ပါ' : 'Please wait'} ({cooldown}s)
              </span>
            </>
          ) : remainingGenerations === 0 ? (
            <>
              <Clock className="w-4 h-4 text-amber-500" />
              <span>
                {language === 'my' ? 'ကန့်သတ်ချက် ပြည့်ပါပြီ (ခဏစောင့်ပါ)' : 'Limit reached (Wait 1 min)'}
              </span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>{t.generateBtn}</span>
            </>
          )}
        </button>

        {result && (
          <div className="bg-stone-50 dark:bg-zinc-800/50 border border-stone-200 dark:border-zinc-800 rounded-lg p-4 mt-6 animate-in fade-in slide-in-from-top-2">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-3">
              {t.resultLabel}
            </div>
            
            <div className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-md p-3 text-xs font-mono text-stone-900 dark:text-stone-100 break-all max-h-[120px] overflow-y-auto mb-4">
              {result}
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-[#0a1128] text-white p-5 shadow-xl mb-4 border border-blue-900/30 font-sans group">
              {/* Background glow effects */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-60" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-60" />
              
              <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-center sm:items-stretch">
                {/* QR Code Container */}
                <div className="shrink-0 bg-white p-3 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.05)] flex items-center justify-center">
                  <QRCodeCanvas 
                    id="sublink-qr-canvas"
                    value={result} 
                    size={160}
                    level="H"
                    fgColor="#0a1128"
                    bgColor="#ffffff"
                    className="block rounded-sm"
                  />
                </div>

                {/* Card Details */}
                <div className="flex flex-col justify-between w-full h-full min-h-[160px] py-1">
                  {/* Top Section */}
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <div className="font-orbitron font-black text-xl sm:text-2xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-sky-300 leading-none mb-1">
                        GALAXY<span className="text-cyan-400"> </span>TUNNEL
                      </div>
                      <div className="text-cyan-400 text-[10px] tracking-widest font-semibold uppercase mt-2 sm:mt-1">
                        {input.toLowerCase().startsWith('vless://') ? 'VLESS CONFIG' : 'TROJAN CONFIG'}
                      </div>
                    </div>
                    
                    <button
                      onClick={handleDownloadQR}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 text-xs font-medium transition-colors cursor-pointer shadow-xs shrink-0"
                      title={language === 'my' ? 'QR Code ပုံ ဒေါင်းလုဒ်ရယူရန်' : 'Download QR Image'}
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="text-[11px]">{language === 'my' ? 'ဒေါင်းလုဒ်' : 'Save QR'}</span>
                    </button>
                  </div>

                  {/* Spacer */}
                  <div className="hidden sm:block flex-1" />

                  {/* Bottom Section */}
                  <div className="flex justify-between items-end border-t border-white/10 pt-3 mt-6 sm:mt-auto">
                    <div className="flex items-center gap-1.5 text-gray-300 text-xs font-medium">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-cyan-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                      </svg>
                      <span>Scan with v2rayNG / Hiddify</span>
                    </div>
                    <div className="text-right text-[10px] font-mono text-gray-400 leading-relaxed">
                      <div className="text-gray-300">EXP: UNLIMITED</div>
                      <div>DATE: {new Date().getFullYear()}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <button
                onClick={handleCopy}
                className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-semibold transition-all shadow-sm ${
                  copied 
                    ? 'bg-emerald-500 text-white scale-[1.01]' 
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-[0.99]'
                }`}
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t.copied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>{t.copyBtn}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownloadQR}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-sm transition-all active:scale-[0.99]"
              >
                <Download className="w-4 h-4" />
                <span>{t.downloadQrBtn}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

