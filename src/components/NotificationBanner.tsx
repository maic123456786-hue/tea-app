import { useEffect } from 'react';
import { MessageCircleHeart, X } from 'lucide-react';
import { NotificationBanner as NotificationBannerType } from '../types';

interface NotificationBannerProps {
  notification: NotificationBannerType | null;
  onDismiss: () => void;
  onClick: () => void;
}

export function NotificationBanner({
  notification,
  onDismiss,
  onClick,
}: NotificationBannerProps) {
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 4500);
    return () => clearTimeout(timer);
  }, [notification, onDismiss]);

  if (!notification) return null;

  return (
    <div className="absolute top-11 left-3 right-3 z-50 animate-in slide-in-from-top-6 duration-300">
      <div
        onClick={onClick}
        className="bg-white/75 hover:bg-white/85 backdrop-blur-2xl border border-white/90 rounded-[24px] p-3 shadow-[0_12px_36px_rgba(16,185,129,0.18)] transition-all cursor-pointer flex items-start gap-3 select-none active:scale-98 group"
      >
        {/* tea 头像 */}
        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-2xl overflow-hidden border-2 border-white bg-white shadow-xs">
            <img
              src={notification.avatar}
              alt={notification.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
        </div>

        {/* 通知内容 */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[11px] font-bold text-slate-800 tracking-tight flex items-center gap-1">
              <MessageCircleHeart className="w-3.5 h-3.5 text-emerald-600" />
              {notification.title}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">刚刚</span>
          </div>

          <p className="text-xs text-slate-600 leading-snug line-clamp-2 break-words">
            {notification.body}
          </p>
        </div>

        {/* 快捷关闭按钮 */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          className="w-6 h-6 rounded-full bg-slate-200/50 hover:bg-slate-200 text-slate-500 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
          title="忽略"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
