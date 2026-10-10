import { useState, useEffect, useRef } from 'react';
import {
  Heart,
  Camera,
  MessageCircleHeart,
  Settings,
  CloudSun,
  Image as ImageIcon,
  CalendarHeart,
  Quote,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  RefreshCw,
  Bookmark,
  Calendar as CalendarIcon,
  Radio,
  Droplet,
} from 'lucide-react';
import { AppSettings, TodoItem } from '../types';

interface HomeScreenProps {
  settings: AppSettings;
  onOpenChat: () => void;
  onOpenSettings: () => void;
  onEditAvatar: (target: 'tea' | 'user') => void;
  onEditPhoto: (index: 0 | 1) => void;
  onEditAnniversary: () => void;
  onOpenAlbum: () => void;
  onOpenCalendar: () => void; // 把茶话集改为日历
  onOpenMoodRadio: () => void;
  onOpenWaterTracker: () => void;
  onOpenRemarkModal: () => void;
  onUpdateTodos: (todos: TodoItem[]) => void;
  onRefreshAiThought: () => void;
}

export function HomeScreen({
  settings,
  onOpenChat,
  onOpenSettings,
  onEditAvatar,
  onEditPhoto,
  onEditAnniversary,
  onOpenAlbum,
  onOpenCalendar,
  onOpenMoodRadio,
  onOpenWaterTracker,
  onOpenRemarkModal,
  onUpdateTodos,
  onRefreshAiThought,
}: HomeScreenProps) {
  const [currentPage, setCurrentPage] = useState<0 | 1>(0);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDateStr, setCurrentDateStr] = useState('');
  const [newTodoText, setNewTodoText] = useState('');

  // Drag and swipe tracking
  const [dragOffset, setDragOffset] = useState(0);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isDragging = useRef(false);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const mins = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${mins}`);

      const month = now.getMonth() + 1;
      const day = now.getDate();
      const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      const weekday = weekdays[now.getDay()];
      setCurrentDateStr(`${month}月${day}日 ${weekday}`);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 5000);
    return () => clearInterval(interval);
  }, []);

  // Compute anniversary days
  const calcDays = () => {
    try {
      const start = new Date(settings.anniversary.startDate).getTime();
      const now = new Date().setHours(0, 0, 0, 0);
      const diffTime = now - start;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      return Math.max(diffDays, 1);
    } catch {
      return 1;
    }
  };

  const daysPassed = calcDays();

  // Swiping gesture handlers
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    touchStartX.current = clientX;
    touchStartY.current = clientY;
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging.current) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diffX = clientX - touchStartX.current;
    if ((currentPage === 0 && diffX > 0) || (currentPage === 1 && diffX < 0)) {
      setDragOffset(diffX * 0.2);
    } else {
      setDragOffset(diffX);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (dragOffset < -50 && currentPage === 0) {
      setCurrentPage(1);
    } else if (dragOffset > 50 && currentPage === 1) {
      setCurrentPage(0);
    }
    setDragOffset(0);
  };

  // Todo handlers
  const handleToggleTodo = (id: string) => {
    const updated = (settings.todos || []).map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    onUpdateTodos(updated);
  };

  const handleAddTodo = () => {
    if (!newTodoText.trim()) return;
    const newTodo: TodoItem = {
      id: 'todo-' + Date.now(),
      text: newTodoText.trim(),
      completed: false,
    };
    onUpdateTodos([...(settings.todos || []), newTodo]);
    setNewTodoText('');
  };

  const handleDeleteTodo = (id: string) => {
    const updated = (settings.todos || []).filter((t) => t.id !== id);
    onUpdateTodos(updated);
  };

  // Widget opacity from theme config
  const widgetAlpha = (settings.theme?.widgetOpacity ?? 50) / 100;
  const widgetBgStyle = {
    backgroundColor: `rgba(255, 255, 255, ${widgetAlpha})`,
  };

  return (
    <div
      className="flex-1 flex flex-col justify-between p-3.5 relative select-none overflow-hidden bg-cover bg-center transition-all duration-300"
      style={{
        backgroundImage: settings.wallpaper
          ? `url(${settings.wallpaper})`
          : `linear-gradient(to bottom, #e3f4eb, #eef8f2, #daeee3)`,
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseMove={handleTouchMove}
      onMouseUp={handleTouchEnd}
    >
      {/* 左右滑动多页视口容器 */}
      <div className="flex-1 overflow-hidden relative min-h-0 flex flex-col">
        <div
          className="flex-1 flex transition-transform duration-300 ease-out"
          style={{
            transform: `translateX(calc(-${currentPage * 100}% + ${dragOffset}px))`,
          }}
        >
          {/* ================= 第一页桌面 ================= */}
          <div className="w-full shrink-0 flex flex-col justify-between overflow-y-auto no-scrollbar py-1 space-y-3">
            {/* 时间组件 */}
            <div className="text-center pt-1">
              <div
                className="inline-block backdrop-blur-md border border-white/60 px-5 py-2.5 rounded-3xl shadow-sm shadow-emerald-900/5"
                style={widgetBgStyle}
              >
                <div className="text-4xl font-extrabold tracking-tight text-slate-800 font-mono">
                  {currentTime || '14:02'}
                </div>
                <div className="flex items-center justify-center gap-2 text-xs font-medium text-emerald-900/80 mt-0.5">
                  <span>{currentDateStr || '10月9日 星期五'}</span>
                  <span className="w-1 h-1 rounded-full bg-emerald-500" />
                  <span className="flex items-center gap-1 text-emerald-700">
                    <CloudSun className="w-3.5 h-3.5" />
                    22°C 微风
                  </span>
                </div>
              </div>
            </div>

            {/* 纪念日软件大卡片 */}
            <div
              onClick={onEditAnniversary}
              className="backdrop-blur-md border border-white/70 rounded-3xl p-3 shadow-sm shadow-emerald-900/5 transition-all cursor-pointer group active:scale-98"
              style={widgetBgStyle}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-2xl bg-[#8fc7ae]/30 text-emerald-800 border border-white/60 flex items-center justify-center shadow-2xs">
                    <Heart className="w-4 h-4 fill-emerald-700 text-emerald-700" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800">
                      {settings.anniversary.title}
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate max-w-[170px]">
                      {settings.anniversary.note || '每一天都有薄荷香气'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-baseline gap-0.5 text-emerald-800 font-mono">
                    <span className="text-xs font-semibold">第</span>
                    <span className="text-2xl font-black">{daysPassed}</span>
                    <span className="text-xs font-semibold">天</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 双方头像相册互动小组件：无提示词，AI方名字随设置改变，User方名字为tea，点击名字即可修改 */}
            <div
              className="backdrop-blur-md border border-white/60 rounded-3xl p-3 shadow-2xs"
              style={widgetBgStyle}
            >
              <div className="flex items-center justify-around gap-2 py-0.5">
                {/* AI方头像与名字 */}
                <div className="flex flex-col items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onEditAvatar('tea')}
                    className="relative group cursor-pointer"
                  >
                    <div className="w-13 h-13 rounded-2xl overflow-hidden border-2 border-white group-hover:border-emerald-300 shadow-md transition-all group-active:scale-95 bg-white">
                      <img
                        src={settings.teaAvatar}
                        alt={settings.teaRemarkName}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-1 rounded-full shadow-xs">
                      <Camera className="w-2.5 h-2.5" />
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={onOpenRemarkModal}
                    className="text-[11px] font-semibold text-slate-700 hover:text-emerald-700 cursor-pointer truncate max-w-[70px]"
                  >
                    {settings.teaRemarkName}
                  </button>
                </div>

                <div className="flex flex-col items-center justify-center text-emerald-600">
                  <Heart className="w-4 h-4 fill-emerald-600 animate-pulse" />
                  <span className="text-[9px] font-mono text-emerald-800/60 mt-0.5">MINT</span>
                </div>

                {/* User方头像与名字（名字为tea，点击即可修改） */}
                <div className="flex flex-col items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onEditAvatar('user')}
                    className="relative group cursor-pointer"
                  >
                    <div className="w-13 h-13 rounded-2xl overflow-hidden border-2 border-white group-hover:border-emerald-300 shadow-md transition-all group-active:scale-95 bg-white">
                      <img
                        src={settings.userAvatar}
                        alt="tea"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-1 rounded-full shadow-xs">
                      <Camera className="w-2.5 h-2.5" />
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={onOpenRemarkModal}
                    className="text-[11px] font-semibold text-slate-700 hover:text-emerald-700 cursor-pointer truncate max-w-[70px]"
                  >
                    {settings.userName || 'tea'}
                  </button>
                </div>
              </div>
            </div>

            {/* 两块可以更换的相册照片 */}
            <div className="grid grid-cols-2 gap-2">
              <div
                onClick={() => onEditPhoto(0)}
                className="backdrop-blur-md border border-white/70 rounded-2xl p-2 pb-2 shadow-2xs transition-all cursor-pointer group active:scale-97 flex flex-col"
                style={widgetBgStyle}
              >
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-100 shadow-2xs">
                  <img
                    src={settings.photos[0].url}
                    alt={settings.photos[0].title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform group-hover:scale-103 duration-300"
                  />
                </div>
                <div className="mt-1 px-0.5 text-center">
                  <p className="text-[10px] font-bold text-slate-700 truncate">
                    {settings.photos[0].title}
                  </p>
                  <p className="text-[9px] text-slate-400 font-mono">
                    {settings.photos[0].date}
                  </p>
                </div>
              </div>

              <div
                onClick={() => onEditPhoto(1)}
                className="backdrop-blur-md border border-white/70 rounded-2xl p-2 pb-2 shadow-2xs transition-all cursor-pointer group active:scale-97 flex flex-col"
                style={widgetBgStyle}
              >
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-100 shadow-2xs">
                  <img
                    src={settings.photos[1].url}
                    alt={settings.photos[1].title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform group-hover:scale-103 duration-300"
                  />
                </div>
                <div className="mt-1 px-0.5 text-center">
                  <p className="text-[10px] font-bold text-slate-700 truncate">
                    {settings.photos[1].title}
                  </p>
                  <p className="text-[9px] text-slate-400 font-mono">
                    {settings.photos[1].date}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ================= 第二页桌面 ================= */}
          <div className="w-full shrink-0 flex flex-col justify-between overflow-y-auto no-scrollbar py-1 space-y-3.5">
            {/* AI 想说的话小组件 */}
            <div
              className="backdrop-blur-md border border-white/70 rounded-3xl p-3.5 shadow-sm shadow-emerald-900/5 relative overflow-hidden"
              style={widgetBgStyle}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-white shadow-2xs shrink-0">
                    <img
                      src={settings.teaAvatar}
                      alt={settings.teaRemarkName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <span>{settings.teaRemarkName} 想说的话</span>
                      <Quote className="w-3 h-3 text-emerald-600" />
                    </h3>
                    <span className="text-[10px] text-emerald-700/70">常温半糖</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onRefreshAiThought}
                  className="w-7 h-7 rounded-full bg-white/60 hover:bg-white text-emerald-800 flex items-center justify-center transition-transform active:rotate-180 duration-300 cursor-pointer"
                  title="刷新"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="bg-white/60 backdrop-blur-sm border border-emerald-100/60 rounded-2xl p-3 text-xs text-slate-700 leading-relaxed relative">
                <p className="italic">“{settings.aiDailyThought}”</p>
                <div className="mt-2 flex items-center justify-end text-[10px] text-emerald-800/80 font-medium">
                  <button
                    type="button"
                    onClick={onOpenChat}
                    className="hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    去找它聊天 ➜
                  </button>
                </div>
              </div>
            </div>

            {/* 待办事项：便签样式 */}
            <div
              className="backdrop-blur-md border border-[#e8e4c7]/70 rounded-3xl p-3.5 shadow-sm relative overflow-hidden"
              style={{
                backgroundColor: `rgba(252, 251, 238, ${Math.max(widgetAlpha, 0.4)})`,
              }}
            >
              <div className="w-16 h-3 bg-emerald-200/50 backdrop-blur-xs rounded-sm mx-auto -mt-2 mb-2 rotate-1 border border-white/60" />

              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Bookmark className="w-4 h-4 text-emerald-700 fill-emerald-600/40" />
                  <span className="text-xs font-bold text-slate-800">
                    🍃 待办便签
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {settings.todos.filter((t) => t.completed).length}/{settings.todos.length}
                </span>
              </div>

              <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                {settings.todos.map((todo) => (
                  <div
                    key={todo.id}
                    className="flex items-center justify-between gap-2 p-1.5 bg-white/70 hover:bg-white/90 rounded-xl border border-[#ede9d0]/60 transition-all group"
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleTodo(todo.id)}
                      className="flex items-center gap-2 flex-1 text-left cursor-pointer"
                    >
                      {todo.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-300 hover:text-emerald-500 shrink-0" />
                      )}
                      <span
                        className={`text-xs ${
                          todo.completed
                            ? 'line-through text-slate-400'
                            : 'text-slate-700 font-medium'
                        }`}
                      >
                        {todo.text}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 p-1 transition-opacity cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-2 pt-2 border-t border-[#ede9d0]/60 flex items-center gap-1.5">
                <input
                  type="text"
                  value={newTodoText}
                  onChange={(e) => setNewTodoText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddTodo();
                  }}
                  placeholder="记下待办..."
                  className="flex-1 bg-white/80 border border-[#e2dec0] rounded-xl px-2.5 py-1 text-xs text-slate-700 outline-none focus:border-emerald-400"
                />
                <button
                  type="button"
                  onClick={handleAddTodo}
                  disabled={!newTodoText.trim()}
                  className="w-7 h-7 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white flex items-center justify-center transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 第二页应用：把“茶话集”改为“日历” */}
            <div className="grid grid-cols-4 gap-2 pt-1 text-center">
              {/* 日历应用（原茶话集） */}
              <div
                onClick={onOpenCalendar}
                className="flex flex-col items-center gap-1 group cursor-pointer"
              >
                <div className="w-11 h-11 rounded-2xl bg-[#8ecdab]/25 hover:bg-[#8ecdab]/40 backdrop-blur-md border border-white/60 text-emerald-800 flex items-center justify-center shadow-2xs group-active:scale-95 transition-all">
                  <CalendarIcon className="w-5 h-5 stroke-[2]" />
                </div>
                <span className="text-[10px] font-semibold text-slate-700">日历</span>
              </div>

              <div
                onClick={onOpenMoodRadio}
                className="flex flex-col items-center gap-1 group cursor-pointer"
              >
                <div className="w-11 h-11 rounded-2xl bg-[#8ecdab]/25 hover:bg-[#8ecdab]/40 backdrop-blur-md border border-white/60 text-emerald-800 flex items-center justify-center shadow-2xs group-active:scale-95 transition-all">
                  <Radio className="w-5 h-5 stroke-[2]" />
                </div>
                <span className="text-[10px] font-semibold text-slate-700">心晴FM</span>
              </div>

              <div
                onClick={onOpenWaterTracker}
                className="flex flex-col items-center gap-1 group cursor-pointer"
              >
                <div className="w-11 h-11 rounded-2xl bg-[#8ecdab]/25 hover:bg-[#8ecdab]/40 backdrop-blur-md border border-white/60 text-emerald-800 flex items-center justify-center shadow-2xs group-active:scale-95 transition-all">
                  <Droplet className="w-5 h-5 stroke-[2]" />
                </div>
                <span className="text-[10px] font-semibold text-slate-700">喝水记录</span>
              </div>

              <div
                onClick={onOpenSettings}
                className="flex flex-col items-center gap-1 group cursor-pointer"
              >
                <div className="w-11 h-11 rounded-2xl bg-[#8ecdab]/25 hover:bg-[#8ecdab]/40 backdrop-blur-md border border-white/60 text-emerald-800 flex items-center justify-center shadow-2xs group-active:scale-95 transition-all">
                  <Settings className="w-5 h-5 stroke-[2]" />
                </div>
                <span className="text-[10px] font-semibold text-slate-700">系统</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 桌面页码滑动圆点指示器 */}
      <div className="flex items-center justify-center gap-1.5 py-1">
        <span
          className={`h-1.5 rounded-full transition-all duration-200 ${
            currentPage === 0 ? 'w-4 bg-emerald-700/80' : 'w-1.5 bg-slate-400/50'
          }`}
        />
        <span
          className={`h-1.5 rounded-full transition-all duration-200 ${
            currentPage === 1 ? 'w-4 bg-emerald-700/80' : 'w-1.5 bg-slate-400/50'
          }`}
        />
      </div>

      {/* 底部常用应用快捷栏 (App Dock) */}
      <div
        className="backdrop-blur-xl border border-white/60 rounded-3xl p-2 flex items-center justify-around shadow-xs"
        style={widgetBgStyle}
      >
        <button
          type="button"
          onClick={onOpenChat}
          className="flex flex-col items-center gap-1 group cursor-pointer"
        >
          <div className="relative w-11 h-11 rounded-2xl bg-[#8ecdb0]/35 hover:bg-[#8ecdb0]/50 backdrop-blur-md border border-white/70 text-emerald-800 flex items-center justify-center shadow-2xs group-active:scale-92 transition-all">
            <MessageCircleHeart className="w-5 h-5 stroke-[2.2] text-emerald-800" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-600 rounded-full border border-white" />
          </div>
          <span className="text-[10px] font-bold text-slate-700">
            {settings.teaRemarkName} 的家
          </span>
        </button>

        <button
          type="button"
          onClick={onEditAnniversary}
          className="flex flex-col items-center gap-1 group cursor-pointer"
        >
          <div className="w-11 h-11 rounded-2xl bg-[#98d6ba]/30 hover:bg-[#98d6ba]/45 backdrop-blur-md border border-white/70 text-emerald-800 flex items-center justify-center shadow-2xs group-active:scale-92 transition-all">
            <CalendarHeart className="w-5 h-5 stroke-[2.2] text-emerald-800" />
          </div>
          <span className="text-[10px] font-bold text-slate-700">纪念日</span>
        </button>

        <button
          type="button"
          onClick={onOpenAlbum}
          className="flex flex-col items-center gap-1 group cursor-pointer"
        >
          <div className="w-11 h-11 rounded-2xl bg-[#83c6a7]/30 hover:bg-[#83c6a7]/45 backdrop-blur-md border border-white/70 text-emerald-800 flex items-center justify-center shadow-2xs group-active:scale-92 transition-all">
            <ImageIcon className="w-5 h-5 stroke-[2.2] text-emerald-800" />
          </div>
          <span className="text-[10px] font-bold text-slate-700">相册</span>
        </button>

        <button
          type="button"
          onClick={onOpenSettings}
          className="flex flex-col items-center gap-1 group cursor-pointer"
        >
          <div className="w-11 h-11 rounded-2xl bg-[#7abfa0]/30 hover:bg-[#7abfa0]/45 backdrop-blur-md border border-white/70 text-emerald-800 flex items-center justify-center shadow-2xs group-active:scale-92 transition-all">
            <Settings className="w-5 h-5 stroke-[2.2] text-emerald-800" />
          </div>
          <span className="text-[10px] font-bold text-slate-700">设置</span>
        </button>
      </div>
    </div>
  );
}
