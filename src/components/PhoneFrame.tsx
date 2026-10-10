import { useState, ReactNode } from 'react';
import { PhoneStatusBar } from './PhoneStatusBar';
import { Smartphone, Monitor, Palette, Sparkles, Lock } from 'lucide-react';

interface PhoneFrameProps {
  children: ReactNode;
  onHomeClick?: () => void;
  onLockPhone?: () => void;
}

export function PhoneFrame({ children, onHomeClick, onLockPhone }: PhoneFrameProps) {
  const [frameColor, setFrameColor] = useState<'mint' | 'silver' | 'dark'>('mint');
  const [viewMode, setViewMode] = useState<'phone' | 'fullscreen'>('phone');

  // Chassis color schemes
  const frameStyles = {
    mint: {
      border: 'border-emerald-700/60 ring-8 ring-emerald-950/15 ring-offset-2 ring-offset-emerald-100/50',
      shadow: 'shadow-[0_25px_60px_-15px_rgba(16,185,129,0.25)]',
      chassisBg: 'bg-emerald-950',
      accent: 'bg-emerald-600',
    },
    silver: {
      border: 'border-slate-300 ring-8 ring-slate-200 ring-offset-2 ring-offset-slate-100',
      shadow: 'shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)]',
      chassisBg: 'bg-slate-800',
      accent: 'bg-slate-400',
    },
    dark: {
      border: 'border-slate-900 ring-8 ring-slate-950/40 ring-offset-2 ring-offset-slate-200',
      shadow: 'shadow-[0_25px_60px_-15px_rgba(15,23,42,0.35)]',
      chassisBg: 'bg-slate-950',
      accent: 'bg-slate-800',
    },
  }[frameColor];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#e6f4ee] via-[#f0f8f4] to-[#dfefe7] flex flex-col items-center justify-center p-0 sm:p-4 md:p-6 overflow-x-hidden font-sans">
      {/* 桌面端外围轻盈提示与控制工具条 */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-[420px] mb-3 px-2 text-xs text-emerald-900/70 select-none">
        <div className="flex items-center gap-1.5 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>tea 的家 · 治愈手机桌宠</span>
        </div>

        {/* 快捷切换 */}
        <div className="flex items-center gap-2">
          {/* 一键锁屏快捷按钮 */}
          {onLockPhone && (
            <button
              type="button"
              onClick={onLockPhone}
              className="flex items-center gap-1 bg-white/70 hover:bg-white text-emerald-900 px-2 py-1 rounded-full border border-emerald-200/60 shadow-2xs transition-all cursor-pointer font-medium"
              title="锁定屏幕 (密码0308)"
            >
              <Lock className="w-3 h-3 text-emerald-700" />
              <span>锁屏</span>
            </button>
          )}

          {/* 机壳外观色调 */}
          <div className="flex items-center gap-1 bg-white/70 backdrop-blur-xs px-2 py-1 rounded-full border border-emerald-200/60 shadow-2xs">
            <Palette className="w-3 h-3 text-emerald-700" />
            <button
              type="button"
              onClick={() => setFrameColor('mint')}
              className={`w-3.5 h-3.5 rounded-full bg-emerald-700 transition-transform cursor-pointer ${
                frameColor === 'mint' ? 'scale-125 ring-1 ring-emerald-900' : 'opacity-60'
              }`}
              title="薄荷深绿机身"
            />
            <button
              type="button"
              onClick={() => setFrameColor('silver')}
              className={`w-3.5 h-3.5 rounded-full bg-slate-300 transition-transform cursor-pointer ${
                frameColor === 'silver' ? 'scale-125 ring-1 ring-slate-400' : 'opacity-60'
              }`}
              title="银色机身"
            />
            <button
              type="button"
              onClick={() => setFrameColor('dark')}
              className={`w-3.5 h-3.5 rounded-full bg-slate-900 transition-transform cursor-pointer ${
                frameColor === 'dark' ? 'scale-125 ring-1 ring-slate-600' : 'opacity-60'
              }`}
              title="暗夜机身"
            />
          </div>

          {/* 全屏/手机壳切换 */}
          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'phone' ? 'fullscreen' : 'phone')}
            className="flex items-center gap-1 bg-white/70 hover:bg-white text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200/60 shadow-2xs transition-all cursor-pointer font-medium"
            title="切换显示模式"
          >
            {viewMode === 'phone' ? (
              <>
                <Monitor className="w-3 h-3" />
                <span>铺满</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3 h-3" />
                <span>机壳</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 手机机身容器 */}
      <div
        className={`relative transition-all duration-300 ${
          viewMode === 'fullscreen'
            ? 'w-full h-screen max-w-none rounded-none border-none shadow-none ring-0'
            : `w-full sm:w-[390px] md:w-[400px] h-screen sm:h-[844px] md:h-[852px] sm:rounded-[52px] ${frameStyles.border} ${frameStyles.shadow} bg-slate-950 p-[8px] sm:p-[10px]`
        }`}
      >
        {/* 机身物理按键装饰 */}
        {viewMode === 'phone' && (
          <>
            {/* 左侧音量按键 */}
            <div className="hidden sm:block absolute -left-[11px] top-[140px] w-[3px] h-[34px] bg-emerald-900/80 rounded-l-md" />
            <div className="hidden sm:block absolute -left-[11px] top-[188px] w-[3px] h-[34px] bg-emerald-900/80 rounded-l-md" />
            {/* 右侧电源键：点击可锁屏 */}
            <button
              type="button"
              onClick={onLockPhone}
              className="hidden sm:block absolute -right-[11px] top-[160px] w-[3px] h-[50px] bg-emerald-900/80 hover:bg-emerald-500 rounded-r-md cursor-pointer transition-colors"
              title="电源键：点击锁屏"
            />
          </>
        )}

        {/* 手机屏幕主屏区域 */}
        <div
          className={`w-full h-full bg-[#f6faf8] flex flex-col relative overflow-hidden ${
            viewMode === 'fullscreen' ? 'rounded-none' : 'sm:rounded-[42px]'
          }`}
        >
          {/* 状态栏 */}
          <PhoneStatusBar onLockPhone={onLockPhone} />

          {/* 屏幕内容区 */}
          <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden">
            {children}
          </div>

          {/* 底部小黑条 Home Indicator Bar：点击可快速返回桌面 */}
          <div
            onClick={onHomeClick}
            className="w-full pb-1 pt-1 bg-white/70 backdrop-blur-md flex items-center justify-center select-none cursor-pointer group"
            title="点击返回桌面"
          >
            <div className="w-32 h-1 bg-slate-300 group-hover:bg-emerald-500 rounded-full transition-colors" />
          </div>
        </div>
      </div>
    </div>
  );
}
