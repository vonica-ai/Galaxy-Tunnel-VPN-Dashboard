import { Download, ShieldCheck, FileCheck2, CheckCircle2 } from 'lucide-react';
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { i18n } from '../i18n';

export function Apps() {
  const { language } = useAppContext();
  const t = i18n[language];

  const apps = [
    { 
      name: 'Hiddify Next', 
      tag: 'ALL PLATFORMS', 
      desc: t.app1Desc,
      url: 'https://play.google.com/store/apps/details?id=app.hiddify.com',
      size: 'Play Store',
      isGooglePlay: true
    },
    { 
      name: 'v2rayNG (Universal Update)', 
      tag: 'ANDROID', 
      desc: t.app2Desc,
      url: 'https://www.mediafire.com/file/rjxo488bipw1b8p/v2ayNG_Android_All_New_version2.2.apk/file?dkey=2v5e5w857p5&r=34',
      size: 'File Size: ~38 MB',
      isGooglePlay: false
    },
    { 
      name: 'v2RayTun (All Versions)', 
      tag: 'iOS & ANDROID', 
      desc: t.app3Desc,
      url: 'https://www.mediafire.com/file/wk0kiiyv3tg4ai8/v2RayTun_Android_All_Versions.apk/file?dkey=0vfrpal11gv&r=1183',
      size: 'File Size: ~32 MB',
      isGooglePlay: false
    },
    {
      name: 'Cloudflare One Agent', 
      tag: 'ALL PLATFORMS', 
      desc: t.app5Desc,
      url: 'https://play.google.com/store/apps/details?id=com.cloudflare.onedotonedotonedotone',
      size: 'Play Store',
      isGooglePlay: true
    }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100 mb-2">{t.appsTitle}</h1>
        <p className="text-sm font-medium text-stone-600 dark:text-stone-400 tracking-wide">{t.appsSubtitle}</p>
      </div>

      <div className="space-y-5">
        {apps.map((app) => (
          <div key={app.name} className="bg-white dark:bg-[#121212] border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">{app.name}</h3>
              <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest">{app.tag}</div>
            </div>
            
            <p className="text-sm text-stone-600 dark:text-stone-400 mb-4 font-medium">{app.desc}</p>
            
            <div className="flex flex-wrap items-center gap-3 mb-5 px-3 py-2 bg-stone-50 dark:bg-[#1a1a1a] rounded-lg">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 dark:text-stone-300">
                <FileCheck2 className="w-3.5 h-3.5 text-blue-500" />
                {app.size}
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 dark:text-stone-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                No Errors
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 dark:text-stone-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                100% Virus Free
              </div>
            </div>

            <a 
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full relative overflow-hidden group flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white bg-stone-900 hover:bg-stone-800 dark:bg-blue-600 dark:hover:bg-blue-500 transition-all shadow-[0_4px_14px_0_rgb(0,0,0,10%)] dark:shadow-[0_4px_14px_0_rgb(37,99,235,39%)] hover:shadow-[0_6px_20px_rgba(0,0,0,23%)] dark:hover:shadow-[0_6px_20px_rgba(37,99,235,23%)]"
            >
              <Download className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:scale-110" />
              <span>{app.isGooglePlay ? 'Get it on Google Play' : t.downloadBtn}</span>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
