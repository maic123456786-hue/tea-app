import { useEffect, useState } from 'react';
import { Wifi, Battery, Lock } from 'lucide-react';

interface PhoneStatusBarProps {
  onLockPhone?: () => void;
}

export function PhoneStatusBar({ onLockPhone }: PhoneStatusBarProps) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full pt-2.5 px-6 pb-1 flex items-center justify-between text-slate-800 select-none text-[12px] font-semibold tracking-tight z-30">
      {/* Time & Lock shortcut */}
      <div className="w-14 pl-1 flex items-center gap-1 font-mono tabular-nums text-left text-slate-700">
        <span>{time || '09:41'}</span>
        {onLockPhone && (
          <button
            type="button"
            onClick={onLockPhone}
            className="text-slate-400 hover:text-emerald-700 transition-colors p-0.5 cursor-pointer"
            title="点击锁屏 (密码0308)"
          >
            <Lock className="w-2.5 h-2.5" />
          </button>
        )}
      </div>

      {/* Dynamic Island / Speaker Pill */}
      <div className="flex items-center justify-center">
        <div className="h-4.5 w-24 bg-slate-900 rounded-full flex items-center justify-center gap-2 shadow-inner px-2">
          {/* Camera lens */}
          <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-emerald-900/60" />
          </div>
          {/* Speaker slit */}
          <div className="w-6 h-1 rounded-full bg-slate-800" />
        </div>
      </div>

      {/* Status Icons: Signal, Wifi, Battery */}
      <div className="w-14 flex items-center justify-end gap-1.5 text-slate-700">
        <span className="text-[10px] font-bold text-slate-600">5G</span>
        <Wifi className="w-3.5 h-3.5 stroke-[2.2]" />
        <div className="flex items-center gap-0.5">
          <Battery className="w-4 h-4 stroke-[2]" />
        </div>
      </div>
    </div>
  );
}
