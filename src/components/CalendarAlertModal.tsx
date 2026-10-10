import { Calendar as CalendarIcon, X, Sparkles, ArrowRight } from 'lucide-react';
import { CalendarAlertPopup } from '../types';

interface CalendarAlertModalProps {
  popup: CalendarAlertPopup | null;
  onClose: () => void;
  onViewEntry: (dateStr: string) => void;
  teaAvatar: string;
  teaRemarkName: string;
}

export function CalendarAlertModal({
  popup,
  onClose,
  onViewEntry,
  teaAvatar,
  teaRemarkName,
}: CalendarAlertModalProps) {
  if (!popup) return null;

  return (
    <div className="absolute inset-0 z-50 bg-black/35 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white/95 backdrop-blur-2xl border border-white/80 rounded-3xl p-5 max-w-[290px] w-full shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-200 relative">
        {/* 关闭按钮 */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* 顶部日历与 tea 头像标志 */}
        <div className="relative mb-3">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center shadow-xs">
            <CalendarIcon className="w-7 h-7 text-emerald-600" />
          </div>
          <div className="w-6 h-6 rounded-full overflow-hidden border-2 border-white absolute -bottom-1 -right-1 shadow-xs">
            <img src={teaAvatar} alt={teaRemarkName} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* 标签 */}
        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full mb-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          来自日历的专属提醒
        </span>

        <h3 className="text-sm font-bold text-slate-800 mb-2">
          {teaRemarkName} 给你的日记回信啦
        </h3>

        {/* 弹窗显示的非固定提醒文案 */}
        <p className="text-xs text-slate-600 leading-relaxed bg-emerald-50/50 border border-emerald-100/60 p-3 rounded-2xl mb-4 text-left">
          {popup.message}
        </p>

        {/* 按钮 */}
        <div className="w-full flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium rounded-xl transition-colors cursor-pointer"
          >
            知道了
          </button>
          <button
            type="button"
            onClick={() => {
              onViewEntry(popup.date);
              onClose();
            }}
            className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>去日历查看</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
