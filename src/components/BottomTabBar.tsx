import { Home, MessageCircleHeart, Settings } from 'lucide-react';

interface BottomTabBarProps {
  activeTab: 'home' | 'chat' | 'settings';
  onChangeTab: (tab: 'home' | 'chat' | 'settings') => void;
  unreadCount?: number;
}

export function BottomTabBar({ activeTab, onChangeTab, unreadCount = 0 }: BottomTabBarProps) {
  return (
    <nav
      aria-label="主导航"
      className="w-full bg-white/75 backdrop-blur-xl border-t border-white/60 px-4 py-1.5 flex items-center justify-around z-20 shadow-[0_-4px_16px_rgba(16,185,129,0.04)]"
    >
      {/* Tab: 桌面 */}
      <button
        type="button"
        onClick={() => onChangeTab('home')}
        className={`relative flex flex-col items-center justify-center min-w-[64px] min-h-[44px] rounded-2xl py-1 px-3 transition-all duration-200 cursor-pointer ${
          activeTab === 'home'
            ? 'text-emerald-700 font-semibold'
            : 'text-slate-400 hover:text-slate-600 font-normal'
        }`}
      >
        {activeTab === 'home' && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-md rounded-2xl -z-10 shadow-2xs border border-white/70" />
        )}
        <div className="relative">
          <Home
            className={`w-5 h-5 transition-transform duration-200 ${
              activeTab === 'home'
                ? 'stroke-[2.4] scale-105 text-emerald-600'
                : 'stroke-[1.8]'
            }`}
          />
        </div>
        <span className="text-[11px] mt-0.5 tracking-tight">桌面</span>
      </button>

      {/* Tab: 聊天 */}
      <button
        type="button"
        onClick={() => onChangeTab('chat')}
        className={`relative flex flex-col items-center justify-center min-w-[64px] min-h-[44px] rounded-2xl py-1 px-3 transition-all duration-200 cursor-pointer ${
          activeTab === 'chat'
            ? 'text-emerald-700 font-semibold'
            : 'text-slate-400 hover:text-slate-600 font-normal'
        }`}
      >
        {activeTab === 'chat' && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-md rounded-2xl -z-10 shadow-2xs border border-white/70" />
        )}
        <div className="relative">
          <MessageCircleHeart
            className={`w-5 h-5 transition-transform duration-200 ${
              activeTab === 'chat'
                ? 'stroke-[2.4] scale-105 text-emerald-600'
                : 'stroke-[1.8]'
            }`}
          />
          {unreadCount > 0 && activeTab !== 'chat' && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white" />
          )}
        </div>
        <span className="text-[11px] mt-0.5 tracking-tight">聊天</span>
      </button>

      {/* Tab: 设置 */}
      <button
        type="button"
        onClick={() => onChangeTab('settings')}
        className={`relative flex flex-col items-center justify-center min-w-[64px] min-h-[44px] rounded-2xl py-1 px-3 transition-all duration-200 cursor-pointer ${
          activeTab === 'settings'
            ? 'text-emerald-700 font-semibold'
            : 'text-slate-400 hover:text-slate-600 font-normal'
        }`}
      >
        {activeTab === 'settings' && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-md rounded-2xl -z-10 shadow-2xs border border-white/70" />
        )}
        <div className="relative">
          <Settings
            className={`w-5 h-5 transition-transform duration-200 ${
              activeTab === 'settings'
                ? 'stroke-[2.4] scale-105 text-emerald-600 rotate-45'
                : 'stroke-[1.8]'
            }`}
          />
        </div>
        <span className="text-[11px] mt-0.5 tracking-tight">设置</span>
      </button>
    </nav>
  );
}
