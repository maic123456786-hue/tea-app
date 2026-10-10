import { useState, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Sparkles,
  Download,
  Trash2,
  Server,
  Layers,
  RefreshCw,
  Heart,
  Check,
  Camera,
  Image as ImageIcon,
  CalendarHeart,
  Lock,
  Wallpaper,
  Upload,
  RotateCcw,
  Palette,
  Sliders,
  MessageSquare,
} from 'lucide-react';
import { AppSettings, Message, ThemePresetKey } from '../types';
import { soundManager } from '../utils/audio';
import { THEME_COLOR_PRESETS } from '../constants/assets';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdateSettings: (updater: (prev: AppSettings) => AppSettings) => void;
  messages: Message[];
  onClearMessages: () => void;
  onNewSession: () => void;
  onEditAvatar: (target: 'tea' | 'user') => void;
  onEditPhoto: (index: 0 | 1) => void;
  onEditAnniversary: () => void;
  onLockPhone: () => void;
}

export function SettingsView({
  settings,
  onUpdateSettings,
  messages,
  onClearMessages,
  onNewSession,
  onEditAvatar,
  onEditPhoto,
  onEditAnniversary,
  onLockPhone,
}: SettingsViewProps) {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [copiedSession, setCopiedSession] = useState(false);
  const [exportNotice, setExportNotice] = useState(false);
  const wallpaperInputRef = useRef<HTMLInputElement>(null);
  const chatWallpaperInputRef = useRef<HTMLInputElement>(null);

  const handleToggleSound = () => {
    const nextVal = !settings.soundEnabled;
    onUpdateSettings((prev) => ({ ...prev, soundEnabled: nextVal }));
    if (nextVal) {
      soundManager.playChime();
    }
  };

  // 更换桌面壁纸：关联到用户设备内部相册
  const handleWallpaperUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        onUpdateSettings((prev) => ({
          ...prev,
          wallpaper: event.target!.result as string,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetWallpaper = () => {
    onUpdateSettings((prev) => ({ ...prev, wallpaper: undefined }));
  };

  // 更换聊天背景：关联到用户设备内部相册
  const handleChatWallpaperUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        onUpdateSettings((prev) => ({
          ...prev,
          chatWallpaper: event.target!.result as string,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetChatWallpaper = () => {
    onUpdateSettings((prev) => ({ ...prev, chatWallpaper: undefined }));
  };

  // 切换预设色系
  const handleSelectThemePreset = (presetKey: ThemePresetKey, color: string) => {
    onUpdateSettings((prev) => ({
      ...prev,
      theme: {
        ...prev.theme,
        preset: presetKey,
        primaryColor: color,
      },
    }));
  };

  // 自定义主色调 Hex
  const handleCustomColorChange = (hex: string) => {
    onUpdateSettings((prev) => ({
      ...prev,
      theme: {
        ...prev.theme,
        preset: 'custom',
        primaryColor: hex,
      },
    }));
  };

  // 气泡透明度调整 (30% - 95%)
  const handleBubbleOpacityChange = (val: number) => {
    onUpdateSettings((prev) => ({
      ...prev,
      theme: {
        ...prev.theme,
        bubbleOpacity: val,
      },
    }));
  };

  // 桌面小组件透明度调整 (20% - 90%)
  const handleWidgetOpacityChange = (val: number) => {
    onUpdateSettings((prev) => ({
      ...prev,
      theme: {
        ...prev.theme,
        widgetOpacity: val,
      },
    }));
  };

  const handleExportChat = () => {
    if (messages.length === 0) return;
    const content = messages
      .map((m) => {
        const time = new Date(m.timestamp).toLocaleString();
        const role = m.sender === 'user' ? settings.userName : settings.teaRemarkName;
        return `[${time}] ${role}: ${m.text}`;
      })
      .join('\n\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${settings.teaRemarkName}-chat-session-${settings.sessionId}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 2000);
  };

  const currentTheme = settings.theme || {
    preset: 'mint',
    primaryColor: '#10b981',
    bubbleOpacity: 75,
    widgetOpacity: 50,
  };

  return (
    <div className="flex flex-col h-full bg-[#f6faf8] overflow-y-auto select-none overscroll-contain pb-6">
      {/* 顶部栏 */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-white/80 px-5 py-3 z-10 shadow-[0_1px_4px_rgba(16,185,129,0.03)] flex items-center justify-between">
        <h1 className="text-base font-bold text-slate-800 tracking-tight">手机设置中心</h1>
        <button
          type="button"
          onClick={onLockPhone}
          className="flex items-center gap-1 text-xs text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-full font-medium transition-colors cursor-pointer"
        >
          <Lock className="w-3.5 h-3.5 text-emerald-700" />
          <span>锁屏</span>
        </button>
      </header>

      <div className="p-4 space-y-4">
        {/* tea 的专属名片卡 */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-4 border border-emerald-100 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onEditAvatar('tea')}
                className="relative group cursor-pointer"
              >
                <div className="w-13 h-13 rounded-2xl overflow-hidden border-2 border-white bg-white shadow-sm shrink-0 group-hover:ring-2 group-hover:ring-emerald-400 transition-all">
                  <img
                    src={settings.teaAvatar}
                    alt={settings.teaRemarkName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full shadow-xs">
                  <Camera className="w-2.5 h-2.5" />
                </span>
              </button>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-base font-bold text-slate-800">{settings.teaRemarkName}</h2>
                  <span
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${currentTheme.primaryColor}22`,
                      color: currentTheme.primaryColor,
                    }}
                  >
                    AI 茶伴
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  当前心情：{settings.teaCurrentMood || '🌿 晴朗 (´▽｀)'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-emerald-100/60 flex items-center justify-between text-[11px] text-emerald-800/80">
            <span className="flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-emerald-600" />
              tea-backend-one.vercel.app
            </span>
            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              接口正常
            </span>
          </div>
        </div>

        {/* 色盘与色系选择 */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-4 border border-emerald-100 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-xl flex items-center justify-center text-white"
                style={{ backgroundColor: currentTheme.primaryColor }}
              >
                <Palette className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-semibold text-slate-800">主题色系与色盘</span>
                <p className="text-[10px] text-slate-400">选择心仪的界面色调与高定色彩</p>
              </div>
            </div>
            <div
              className="w-5 h-5 rounded-full border-2 border-white shadow-xs"
              style={{ backgroundColor: currentTheme.primaryColor }}
            />
          </div>

          <div className="grid grid-cols-5 gap-2 pt-1">
            {THEME_COLOR_PRESETS.map((preset) => {
              const isSelected = currentTheme.preset === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectThemePreset(preset.id as ThemePresetKey, preset.color)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-emerald-500 bg-white ring-2 ring-emerald-200/60 shadow-xs scale-102 font-bold'
                      : 'border-slate-100 hover:border-slate-200 bg-slate-50/60 text-slate-600'
                  }`}
                >
                  <span
                    className="w-6 h-6 rounded-full shadow-2xs border border-white"
                    style={{ backgroundColor: preset.color }}
                  />
                  <span className="text-[10px] truncate max-w-full">{preset.name}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-600 font-medium">自由调色盘（Hex）</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={currentTheme.primaryColor}
                onChange={(e) => handleCustomColorChange(e.target.value)}
                className="w-7 h-7 rounded-lg border border-slate-200 cursor-pointer p-0 bg-transparent"
                title="选择颜色"
              />
              <span className="text-xs font-mono font-medium text-slate-600 uppercase bg-slate-100 px-2 py-0.5 rounded-md">
                {currentTheme.primaryColor}
              </span>
            </div>
          </div>
        </div>

        {/* 自定义各个组件透明度 */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-4 border border-emerald-100 shadow-xs space-y-3.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-semibold text-slate-800">组件透明度调节</span>
              <p className="text-[10px] text-slate-400">自定义磨砂毛玻璃透光质感</p>
            </div>
          </div>

          <div className="space-y-1.5 bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700">聊天气泡透光度</span>
              <span className="font-mono font-bold text-emerald-700">
                {currentTheme.bubbleOpacity}%
              </span>
            </div>
            <input
              type="range"
              min={30}
              max={95}
              step={1}
              value={currentTheme.bubbleOpacity}
              onChange={(e) => handleBubbleOpacityChange(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-slate-400">
              <span>轻盈透光 (30%)</span>
              <span>温润半透 (75%)</span>
              <span>清晰厚实 (95%)</span>
            </div>
          </div>

          <div className="space-y-1.5 bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700">桌面小组件透光度</span>
              <span className="font-mono font-bold text-emerald-700">
                {currentTheme.widgetOpacity}%
              </span>
            </div>
            <input
              type="range"
              min={20}
              max={90}
              step={1}
              value={currentTheme.widgetOpacity}
              onChange={(e) => handleWidgetOpacityChange(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-slate-400">
              <span>梦幻半隐 (20%)</span>
              <span>标准毛玻璃 (50%)</span>
              <span>纯白实体 (90%)</span>
            </div>
          </div>
        </div>

        {/* 壁纸与背景定制模块（桌面壁纸 + 聊天背景） */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-4 border border-emerald-100 shadow-xs space-y-3.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Wallpaper className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-semibold text-slate-800">壁纸与背景自定义</span>
              <p className="text-[10px] text-slate-400">从用户设备相册中选取图片更换</p>
            </div>
          </div>

          {/* 隐藏的本地相册上传控件 */}
          <input
            ref={wallpaperInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleWallpaperUpload}
          />
          <input
            ref={chatWallpaperInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleChatWallpaperUpload}
          />

          {/* 1. 更换桌面壁纸 */}
          <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Wallpaper className="w-3.5 h-3.5 text-emerald-600" />
                手机桌面壁纸
              </span>
              <span className="text-[10px] text-slate-400">
                {settings.wallpaper ? '已应用相册壁纸' : '默认薄荷渐变'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => wallpaperInputRef.current?.click()}
                className="flex-1 py-2 px-3 text-white text-xs font-medium rounded-xl shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                style={{ backgroundColor: currentTheme.primaryColor }}
              >
                <Upload className="w-3.5 h-3.5" />
                从相册选择桌面壁纸
              </button>
              {settings.wallpaper && (
                <button
                  type="button"
                  onClick={handleResetWallpaper}
                  className="py-2 px-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs rounded-xl transition-all cursor-pointer"
                  title="恢复默认"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* 2. 更换聊天背景（新功能） */}
          <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                聊天界面背景
              </span>
              <span className="text-[10px] text-slate-400">
                {settings.chatWallpaper ? '已应用相册背景' : '默认薄荷渐变'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => chatWallpaperInputRef.current?.click()}
                className="flex-1 py-2 px-3 text-white text-xs font-medium rounded-xl shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                style={{ backgroundColor: currentTheme.primaryColor }}
              >
                <Upload className="w-3.5 h-3.5" />
                从相册选择聊天背景
              </button>
              {settings.chatWallpaper && (
                <button
                  type="button"
                  onClick={handleResetChatWallpaper}
                  className="py-2 px-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs rounded-xl transition-all cursor-pointer"
                  title="恢复默认"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 桌面组件管理 */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-4 border border-emerald-100 shadow-xs space-y-2.5">
          <h3 className="text-xs font-bold text-slate-400 tracking-wide">
            桌面组件管理
          </h3>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onEditAnniversary}
              className="p-3 bg-rose-50/70 hover:bg-rose-100/80 rounded-2xl text-left border border-rose-100/60 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-1.5 text-rose-600 font-bold text-xs mb-1">
                <CalendarHeart className="w-4 h-4" />
                <span>纪念日设置</span>
              </div>
              <p className="text-[11px] text-slate-500 truncate">
                {settings.anniversary.title}
              </p>
            </button>

            <button
              type="button"
              onClick={() => onEditPhoto(0)}
              className="p-3 bg-amber-50/70 hover:bg-amber-100/80 rounded-2xl text-left border border-amber-100/60 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-1.5 text-amber-600 font-bold text-xs mb-1">
                <ImageIcon className="w-4 h-4" />
                <span>更换相册照片</span>
              </div>
              <p className="text-[11px] text-slate-500 truncate">
                两块桌面相框
              </p>
            </button>
          </div>
        </div>

        {/* 会话配置 */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-4 border border-emerald-100 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold text-slate-800">当前会话编号 (Session ID)</span>
            </div>
            <span
              className="text-xs font-mono font-bold px-2 py-0.8 rounded-lg"
              style={{
                backgroundColor: `${currentTheme.primaryColor}20`,
                color: currentTheme.primaryColor,
              }}
            >
              #{settings.sessionId}
            </span>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={onNewSession}
              className="flex-1 py-2 px-3 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 text-xs font-semibold rounded-2xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              换个新会话 ID
            </button>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(String(settings.sessionId));
                setCopiedSession(true);
                setTimeout(() => setCopiedSession(false), 1500);
              }}
              className="py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-medium rounded-2xl transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              {copiedSession ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : '复制'}
            </button>
          </div>
        </div>

        {/* 交互音效体验 */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-4 border border-emerald-100 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-400 tracking-wide">
            偏好体验
          </h3>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                {settings.soundEnabled ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-400" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">清新气泡提示音</p>
                <p className="text-[11px] text-slate-400">发消息与收到回信时的清脆音效</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggleSound}
              className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer ${
                settings.soundEnabled ? 'bg-emerald-500' : 'bg-slate-200'
              }`}
              aria-label="切换音效"
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform absolute top-0.75 ${
                  settings.soundEnabled ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* 聊天记录管理 */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-4 border border-emerald-100 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 tracking-wide">
              聊天记录 ({messages.length} 条)
            </h3>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={handleExportChat}
              disabled={messages.length === 0}
              className={`w-full py-2.5 px-3.5 rounded-2xl text-xs font-semibold flex items-center justify-between transition-colors ${
                messages.length > 0
                  ? 'bg-emerald-50/70 hover:bg-emerald-100/80 text-emerald-800 cursor-pointer'
                  : 'bg-slate-50 text-slate-300 cursor-not-allowed'
              }`}
            >
              <span className="flex items-center gap-2">
                <Download className="w-4 h-4 text-emerald-600" />
                导出对话为文本 (.txt)
              </span>
              <span className="text-[11px] font-normal text-emerald-700/60">
                {exportNotice ? '已导出！' : '保存本地'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="w-full py-2.5 px-3.5 rounded-2xl text-xs font-semibold flex items-center justify-between bg-red-50/70 hover:bg-red-100/80 text-red-600 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                清空当前全部消息
              </span>
              <span className="text-[11px] font-normal text-red-400">不可恢复</span>
            </button>
          </div>
        </div>
      </div>

      {/* 清空确认弹窗 */}
      {showClearConfirm && (
        <div className="absolute inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-5 max-w-[280px] w-full shadow-xl border border-red-100 text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 mb-1">确定清空所有消息？</h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              清空后当前会话的所有聊天气泡将被移除，无法恢复哦。
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2 rounded-xl text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => {
                  onClearMessages();
                  setShowClearConfirm(false);
                }}
                className="flex-1 py-2 rounded-xl text-xs font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors cursor-pointer"
              >
                清空
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
