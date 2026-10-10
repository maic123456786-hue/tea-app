import { useState } from 'react';
import { Heart, Calendar, FileText, X, Sparkles, Clock } from 'lucide-react';
import { AnniversaryData } from '../constants/assets';

interface AnniversaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  anniversary: AnniversaryData;
  onSave: (updated: AnniversaryData) => void;
}

export function AnniversaryModal({
  isOpen,
  onClose,
  anniversary,
  onSave,
}: AnniversaryModalProps) {
  const [title, setTitle] = useState(anniversary.title);
  const [startDate, setStartDate] = useState(anniversary.startDate);
  const [note, setNote] = useState(anniversary.note);

  if (!isOpen) return null;

  // Calculate days passed
  const calcDays = () => {
    try {
      const start = new Date(startDate).getTime();
      const now = new Date().setHours(0, 0, 0, 0);
      const diffTime = now - start;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      return Math.max(diffDays, 1);
    } catch {
      return 1;
    }
  };

  const daysPassed = calcDays();
  const nextMilestone = Math.ceil(daysPassed / 100) * 100;
  const daysToNext = nextMilestone - daysPassed;

  const handleSave = () => {
    onSave({
      title: title.trim() || '相恋纪念日',
      startDate: startDate || '2025-05-20',
      note: note.trim() || '愿每一天都有薄荷香气与温柔陪伴。',
    });
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white/95 backdrop-blur-xl border border-white/60 w-full sm:max-w-[340px] rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 flex flex-col max-h-[92%] overflow-hidden">
        {/* 头部 */}
        <div className="flex items-center justify-between pb-3 border-b border-emerald-100/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
              <Heart className="w-4 h-4 fill-rose-500" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">纪念日软件</h3>
              <p className="text-[11px] text-slate-400">记录心动的每一个瞬间</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-3 space-y-3.5 pr-1">
          {/* 天数大徽章卡片 */}
          <div className="bg-gradient-to-br from-rose-50/70 via-emerald-50/50 to-teal-50/70 p-4 rounded-2xl border border-rose-100/70 text-center relative overflow-hidden shadow-xs">
            <span className="text-xs font-semibold text-rose-600 tracking-wider">
              {title}
            </span>
            <div className="my-1.5 flex items-baseline justify-center gap-1">
              <span className="text-3xl font-extrabold text-slate-800 font-mono">
                {daysPassed}
              </span>
              <span className="text-sm font-semibold text-rose-500">DAYS</span>
            </div>
            <p className="text-[11px] text-slate-500">
              起始于 {startDate} · 距离 {nextMilestone} 天还有 {daysToNext} 天
            </p>
          </div>

          {/* 编辑表单 */}
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-medium text-slate-600 mb-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                纪念日名称
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例如：相恋纪念日 / 遇见 tea 的第一天"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-600 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-emerald-600" />
                起始日期
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-600 mb-1 flex items-center gap-1">
                <FileText className="w-3 h-3 text-emerald-600" />
                寄语留言
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder="写下一段暖心的话语..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 outline-none focus:border-emerald-400 resize-none"
              />
            </div>
          </div>
        </div>

        {/* 底部保存按钮 */}
        <div className="flex items-center gap-2 pt-3 border-t border-emerald-100/70">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 rounded-xl text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm cursor-pointer"
          >
            保存纪念日
          </button>
        </div>
      </div>
    </div>
  );
}
