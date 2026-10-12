import { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  Sparkles,
  Coffee,
  Check,
  Edit3,
} from 'lucide-react';
import { CalendarEntry, AppSettings } from '../types';
import { sendCalendarReply } from '../services/chatApi';
import { soundManager } from '../utils/audio';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSaveCalendarEntry: (entry: CalendarEntry) => void;
  onTriggerCalendarPopup: (dateStr: string, alertMessage: string) => void;
  initialSelectedDate?: string;
}

const MOOD_EMOJIS = ['🍃', '🍵', '✨', '🌸', '😊', '💖', '😴', '🌧️', '🎉', '🍰', '🍓', '🌤️'];

const AI_CALENDAR_REMINDER_MESSAGES = [
  '🍃 tea 在你的日历日记里留下了一朵小花，快去看看吧～',
  '🍵 你的心事已被 tea 签收，日历里有一封专属回信在等你哦 ✨',
  '🌸 tea 悄悄在今天的日历下写下了暖心悄悄话，记得去看看呀 (*´꒳`*)',
  '✨ 今天的日记收到了 tea 的温暖抱抱，快去翻翻日历看看回信吧 🤍',
  '💌 今天的特调心情日记有新回信啦，tea 在日历里给你留了言～',
  '🧋 tea 读完了你今天想说的话，在日历里悄悄递过去一杯半糖温暖，快去查收吧！',
];

export function CalendarModal({
  isOpen,
  onClose,
  settings,
  onSaveCalendarEntry,
  onTriggerCalendarPopup,
  initialSelectedDate,
}: CalendarModalProps) {
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth()); // 0 - 11
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(initialSelectedDate || null);

  // Day detail edit states
  const [editingEmoji, setEditingEmoji] = useState('🍃');
  const [editingNote, setEditingNote] = useState('');
  const [isAiReplying, setIsAiReplying] = useState(false);

  // Sync when initialSelectedDate is provided (e.g. from popup click)
  useEffect(() => {
    if (initialSelectedDate && isOpen) {
      setSelectedDateStr(initialSelectedDate);
      const parts = initialSelectedDate.split('-');
      if (parts.length === 3) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        if (!isNaN(y) && !isNaN(m)) {
          setCurrentYear(y);
          setCurrentMonth(m);
        }
      }
      const existing = settings.calendarEntries?.[initialSelectedDate];
      setEditingEmoji(existing?.emoji || '🍃');
      setEditingNote(existing?.userNote || '');
    }
  }, [initialSelectedDate, isOpen]);

  if (!isOpen) return null;

  // Calendar calculations
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayWeekday = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sunday
  // Adjust Monday as start (0: Mon, ..., 6: Sun)
  const startOffset = (firstDayWeekday + 6) % 7;

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Click on a day
  const handleSelectDay = (day: number) => {
    const monthStr = (currentMonth + 1).toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');
    const fullDate = `${currentYear}-${monthStr}-${dayStr}`;

    setSelectedDateStr(fullDate);
    const existing = settings.calendarEntries?.[fullDate];
    setEditingEmoji(existing?.emoji || '🍃');
    setEditingNote(existing?.userNote || '');
  };

  // Submit and get AI reply
  const handleSaveDay = async () => {
    if (!selectedDateStr) return;

    soundManager.playPop();

    const existing = settings.calendarEntries?.[selectedDateStr];
    const userNoteText = editingNote.trim();

    // Save user's entry first
    const initialEntry: CalendarEntry = {
      date: selectedDateStr,
      emoji: editingEmoji,
      userNote: userNoteText,
      aiReply: existing?.aiReply,
      updatedAt: Date.now(),
      isReplying: !!userNoteText,
    };
    onSaveCalendarEntry(initialEntry);

    // If user provided a note, trigger AI reply
    if (userNoteText) {
      setIsAiReplying(true);
      try {
        // Send to backend asking for a warm diary reply
        const reply = await sendCalendarReply(
  selectedDateStr,
  editingEmoji,
  userNoteText,
  settings.sessionId
);

        const updatedEntry: CalendarEntry = {
          ...initialEntry,
          aiReply: reply,
          isReplying: false,
          updatedAt: Date.now(),
        };
        onSaveCalendarEntry(updatedEntry);

        // Pick a non-fixed reminder message
        const randomReminder =
          AI_CALENDAR_REMINDER_MESSAGES[
            Math.floor(Math.random() * AI_CALENDAR_REMINDER_MESSAGES.length)
          ];

        // Trigger separate calendar popup alert!
        setTimeout(() => {
          onTriggerCalendarPopup(selectedDateStr, randomReminder);
        }, 400);

        if (settings.soundEnabled) {
          soundManager.playChime();
        }
      } catch {
        // Fallback friendly reply if network issue
        
const updatedEntry: CalendarEntry = {
  ...initialEntry,
  aiReply: existing?.aiReply,
  isReplying: false,
  updatedAt: Date.now(),
};
onSaveCalendarEntry(updatedEntry);

      } finally {
        setIsAiReplying(false);
      }
    }
  };

  const selectedEntry = selectedDateStr ? settings.calendarEntries?.[selectedDateStr] : null;

  return (
    <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white/95 backdrop-blur-2xl border border-white/70 w-full sm:max-w-[340px] rounded-t-3xl sm:rounded-3xl shadow-2xl p-4.5 flex flex-col max-h-[90%] overflow-hidden">
        {/* 标题栏 */}
        <div className="flex items-center justify-between pb-3 border-b border-emerald-100/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">日历</h3>
              <p className="text-[10px] text-slate-400">记录每日心情 emoji 与心语回信</p>
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

        {/* 视图内容区：分为日历月视图与单日详情视图 */}
        {!selectedDateStr ? (
          /* ================== 日历月网格视图 ================== */
          <div className="py-3 flex-1 flex flex-col overflow-y-auto no-scrollbar">
            {/* 月份切换器 */}
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-xs font-bold text-slate-800 font-mono">
                {currentYear}年 {currentMonth + 1}月
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 星期行 */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-1">
              <span>一</span>
              <span>二</span>
              <span>三</span>
              <span>四</span>
              <span>五</span>
              <span className="text-emerald-700">六</span>
              <span className="text-emerald-700">日</span>
            </div>

            {/* 日历格子：仅显示日期和心情emoji，不显示想说的话（点开才能看） */}
            <div className="grid grid-cols-7 gap-1.5 pt-1">
              {Array.from({ length: startOffset }).map((_, idx) => (
                <div key={`empty-${idx}`} className="aspect-square" />
              ))}

              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const mStr = (currentMonth + 1).toString().padStart(2, '0');
                const dStr = dayNum.toString().padStart(2, '0');
                const dateKey = `${currentYear}-${mStr}-${dStr}`;
                const entry = settings.calendarEntries?.[dateKey];

                const isToday =
                  new Date().getFullYear() === currentYear &&
                  new Date().getMonth() === currentMonth &&
                  new Date().getDate() === dayNum;

                return (
                  <button
                    key={dayNum}
                    type="button"
                    onClick={() => handleSelectDay(dayNum)}
                    className={`relative aspect-square rounded-xl p-1 flex flex-col items-center justify-between border transition-all cursor-pointer group hover:scale-105 active:scale-95 ${
                      isToday
                        ? 'border-emerald-500 bg-emerald-50/60 font-bold'
                        : entry?.emoji
                        ? 'border-emerald-100 bg-white shadow-2xs'
                        : 'border-transparent hover:border-slate-200 bg-slate-50/50'
                    }`}
                  >
                    <span
                      className={`text-[10px] leading-none ${
                        isToday ? 'text-emerald-700 font-bold' : 'text-slate-600'
                      }`}
                    >
                      {dayNum}
                    </span>

                    {/* 若有设置心情 emoji，只显示 emoji */}
                    {entry?.emoji ? (
                      <span className="text-xs leading-none animate-in zoom-in-75 duration-150">
                        {entry.emoji}
                      </span>
                    ) : (
                      <span className="w-1 h-1 rounded-full bg-slate-200 group-hover:bg-emerald-300" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-center">
              <span className="text-[11px] text-slate-400">
                点击任意“日”，即可记录当天心情与心事
              </span>
            </div>
          </div>
        ) : (
          /* ================== 单日心情编辑与点开查看视图 ================== */
          <div className="py-2 flex-1 flex flex-col overflow-y-auto no-scrollbar space-y-3">
            {/* 返回月历按钮与当前日期 */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedDateStr(null)}
                className="text-xs text-emerald-700 hover:underline flex items-center gap-0.5 cursor-pointer font-medium"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                返回月历
              </button>
              <span className="text-xs font-mono font-bold text-slate-700">
                {selectedDateStr}
              </span>
            </div>

            {/* 心情 emoji 选取 */}
            <div className="bg-slate-50/70 p-2.5 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-bold text-slate-600 block mb-1.5">
                选择当日心情 Emoji
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {MOOD_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setEditingEmoji(emoji)}
                    className={`text-base p-1.5 rounded-xl transition-all cursor-pointer ${
                      editingEmoji === emoji
                        ? 'bg-emerald-500 text-white scale-110 shadow-xs'
                        : 'hover:bg-white'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* 编辑想说的话 (日历主界面不展示，点开才能看) */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                <Edit3 className="w-3 h-3 text-emerald-600" />
                今天想说的话
              </label>
              <textarea
                value={editingNote}
                onChange={(e) => setEditingNote(e.target.value)}
                rows={3}
                placeholder="记录今天的心情、秘密或想对 tea 说的心里话..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-2.5 text-xs text-slate-800 outline-none focus:border-emerald-400 focus:bg-white transition-all resize-none"
              />
            </div>

            {/* 保存按钮 */}
            <button
              type="button"
              onClick={handleSaveDay}
              disabled={isAiReplying}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              {isAiReplying ? (
                <>
                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>tea 正在认真回信中...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>保存今日心语</span>
                </>
              )}
            </button>

            {/* AI 方相应的回信 (保存后且AI回复后在下方展示) */}
            {selectedEntry?.aiReply && (
              <div className="bg-gradient-to-br from-emerald-50/70 to-teal-50/50 p-3 rounded-2xl border border-emerald-100/80 space-y-1.5 animate-in fade-in duration-200">
                <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-xs">
                  <div className="w-5 h-5 rounded-full overflow-hidden border border-white">
                    <img src={settings.teaAvatar} alt="tea" className="w-full h-full object-cover" />
                  </div>
                  <span>{settings.teaRemarkName} 的日历回信</span>
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic pl-1">
                  “{selectedEntry.aiReply}”
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
