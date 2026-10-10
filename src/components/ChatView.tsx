import { useState, useRef, useEffect, useMemo } from 'react';
import {
  Send,
  RotateCcw,
  Copy,
  Check,
  AlertCircle,
  Coffee,
  Heart,
  Smile,
  Camera,
  Home,
  Image as ImageIcon,
  Undo2,
  Search,
  X,
} from 'lucide-react';
import { Message, AppSettings } from '../types';
import { soundManager } from '../utils/audio';

interface ChatViewProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (text: string) => Promise<void>;
  onRetryMessage: (messageId: string) => Promise<void>;
  onClearMessages: () => void;
  settings: AppSettings;
  onEditAvatar: (target: 'tea' | 'user') => void;
  onBackToHome: () => void;
  onOpenRemarkModal: () => void;
  onToggleMood?: () => void;
  onUpdateChatWallpaper?: (dataUrl: string | undefined) => void;
}

export function ChatView({
  messages,
  isLoading,
  onSendMessage,
  onRetryMessage,
  onClearMessages,
  settings,
  onEditAvatar,
  onBackToHome,
  onOpenRemarkModal,
  onToggleMood,
  onUpdateChatWallpaper,
}: ChatViewProps) {
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showEmojiBar, setShowEmojiBar] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // 搜索相关状态
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const chatWallpaperInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = (smooth = true) => {
    if (isSearching) return; // 搜索时不自动滚到底部
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto',
      block: 'end',
    });
  };

  useEffect(() => {
    if (settings.autoScroll && !isSearching) {
      scrollToBottom();
    }
  }, [messages, isLoading, settings.autoScroll, isSearching]);

  // 打开搜索时聚焦
  useEffect(() => {
    if (isSearching) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      setSearchQuery('');
    }
  }, [isSearching]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    setInputText('');
    setShowEmojiBar(false);

    if (settings.soundEnabled) {
      soundManager.playPop();
    }

    await onSendMessage(text);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const insertEmoji = (emoji: string) => {
    setInputText((prev) => prev + emoji);
    inputRef.current?.focus();
  };

  // 搜索匹配条数统计
  const matchingCount = useMemo(() => {
    if (!searchQuery.trim()) return 0;
    const query = searchQuery.trim().toLowerCase();
    return messages.filter((m) => m.text.toLowerCase().includes(query)).length;
  }, [messages, searchQuery]);

  // 高亮匹配文字渲染辅助函数
  const renderHighlightedText = (text: string, query: string) => {
    if (!query.trim()) return text;

    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === query.trim().toLowerCase() ? (
        <mark
          key={index}
          className="bg-amber-300 text-slate-900 rounded-xs px-0.5 font-bold shadow-2xs"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const handleChatWallpaperUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        onUpdateChatWallpaper?.(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const quickEmojis = ['🍵', '🍃', '🌸', '✨', '🍰', '🧋', '🤍', '😊'];

  const formatTime = (ts: number) => {
    const date = new Date(ts);
    return `${date.getHours().toString().padStart(2, '0')}:${date
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
  };

  const bubbleAlpha = (settings.theme?.bubbleOpacity ?? 75) / 100;
  const primaryColor = settings.theme?.primaryColor ?? '#10b981';

  const displayMood = isLoading
    ? '🍵 泡茶中 ( ˘▽˘)っ♨'
    : settings.teaCurrentMood || '🌿 晴朗 (´▽｀)';

  return (
    <div
      className={`flex flex-col h-full relative select-text overflow-hidden bg-cover bg-center transition-all duration-300 ${
        !settings.chatWallpaper
          ? 'bg-gradient-to-br from-[#ebf7f1] via-[#f3faf6] to-[#e4f5ed]'
          : ''
      }`}
      style={
        settings.chatWallpaper
          ? {
              backgroundImage: `url(${settings.chatWallpaper})`,
            }
          : undefined
      }
    >
      <input
        ref={chatWallpaperInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChatWallpaperUpload}
      />

      {settings.chatWallpaper && (
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] pointer-events-none" />
      )}

      {!settings.chatWallpaper && (
        <>
          <div className="absolute top-10 -left-12 w-48 h-48 bg-emerald-300/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-20 -right-12 w-52 h-52 bg-teal-300/20 rounded-full blur-3xl pointer-events-none" />
        </>
      )}

      {/* 顶部标题栏 */}
      <header className="shrink-0 bg-white/70 backdrop-blur-xl border-b border-white/60 px-3.5 py-2.5 flex items-center justify-between z-10 shadow-[0_2px_12px_rgba(16,185,129,0.04)]">
        <div className="flex items-center gap-2">
          {/* 返回桌面按钮 */}
          <button
            type="button"
            onClick={onBackToHome}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 flex items-center justify-center transition-colors cursor-pointer border border-emerald-100/60"
          >
            <Home className="w-4 h-4" />
          </button>

          {/* tea 头像 */}
          <button
            type="button"
            onClick={() => onEditAvatar('tea')}
            className="relative group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/90 bg-emerald-50 flex items-center justify-center shadow-xs group-hover:ring-2 group-hover:ring-emerald-400 transition-all">
              <img
                src={settings.teaAvatar}
                alt={settings.teaRemarkName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <Coffee className="w-4 h-4 text-emerald-600" />
            </div>
            <span
              className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"
            />
            <span className="absolute inset-0 bg-black/25 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
              <Camera className="w-3.5 h-3.5" />
            </span>
          </button>

          {/* 名字与实时心情 */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1
                onClick={onOpenRemarkModal}
                className="text-sm font-bold text-slate-800 tracking-tight group hover:text-emerald-800 transition-colors cursor-pointer"
              >
                {settings.teaRemarkName} 的家
              </h1>

              <button
                type="button"
                onClick={onToggleMood}
                className="text-[10px] font-medium px-2 py-0.5 rounded-full transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 border border-white/60"
                style={{
                  backgroundColor: `${primaryColor}22`,
                  color: primaryColor,
                }}
                title="AI 实时心情 (点击切换)"
              >
                {displayMood}
              </button>
            </div>
            <p className="text-[10px] text-emerald-700/80 leading-none mt-0.5">
              {isLoading ? `${settings.teaRemarkName} 正在沏茶回复...` : '在线陪伴'}
            </p>
          </div>
        </div>

        {/* 右侧操作按钮：搜索图标、更换相册背景、清空 */}
        <div className="flex items-center gap-1">
          {/* 搜索图标：点击后展开输入框 */}
          <button
            type="button"
            onClick={() => setIsSearching((prev) => !prev)}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer border border-white/80 ${
              isSearching
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white/70 hover:bg-emerald-50 text-slate-500 hover:text-emerald-700'
            }`}
            title="搜索历史聊天记录"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* 从手机相册更换聊天背景 */}
          <button
            type="button"
            onClick={() => chatWallpaperInputRef.current?.click()}
            className="w-8 h-8 rounded-full bg-white/70 hover:bg-emerald-50 text-slate-500 hover:text-emerald-700 flex items-center justify-center transition-colors cursor-pointer border border-white/80"
            title="从设备相册更换聊天背景"
          >
            <ImageIcon className="w-4 h-4" />
          </button>

          {settings.chatWallpaper && (
            <button
              type="button"
              onClick={() => onUpdateChatWallpaper?.(undefined)}
              className="w-8 h-8 rounded-full bg-white/70 hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer border border-white/80"
              title="恢复默认聊天背景"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
          )}

          {/* 清空对话按钮 */}
          <button
            type="button"
            onClick={() => setShowClearConfirm(true)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
            aria-label="清空对话"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 展开的搜索输入栏 */}
      {isSearching && (
        <div className="shrink-0 bg-white/90 backdrop-blur-xl border-b border-emerald-100/80 px-3.5 py-2 flex items-center gap-2 z-10 animate-in slide-in-from-top-2 duration-150 shadow-xs">
          <div className="flex-1 flex items-center gap-2 bg-[#f0f8f4] border border-emerald-200/70 rounded-full px-3 py-1.5 focus-within:bg-white focus-within:border-emerald-400">
            <Search className="w-3.5 h-3.5 text-emerald-600" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索历史聊天记录关键词..."
              className="flex-1 bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {searchQuery && (
            <span className="text-[10px] text-emerald-800 font-medium whitespace-nowrap">
              {matchingCount > 0 ? `匹配 ${matchingCount} 条` : '无结果'}
            </span>
          )}

          <button
            type="button"
            onClick={() => setIsSearching(false)}
            className="text-xs text-slate-500 hover:text-slate-800 px-1.5 py-1 cursor-pointer whitespace-nowrap"
          >
            取消
          </button>
        </div>
      )}

      {/* 清空对话确认模态框 */}
      {showClearConfirm && (
        <div className="absolute inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-5 max-w-[280px] w-full shadow-xl border border-white text-center animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-sm font-bold text-slate-800 mb-1">重置茶话会？</h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              将清空当前与 {settings.teaRemarkName} 的聊天记录，开启全新的治愈对话哦～
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2 rounded-xl text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                再想想
              </button>
              <button
                type="button"
                onClick={() => {
                  onClearMessages();
                  setShowClearConfirm(false);
                }}
                className="flex-1 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
              >
                确认重置
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 中间消息列表：支持关键词高亮 */}
      <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-4 overscroll-contain relative z-0">
        <div className="text-center my-1">
          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-800/80 bg-white/60 backdrop-blur-md border border-white/60 px-3 py-1 rounded-full shadow-2xs">
            <Heart className="w-3 h-3 text-emerald-500 fill-emerald-500" />
            已接入 {settings.teaRemarkName} 智能茶伴 · 会话 #{settings.sessionId}
          </span>
        </div>

        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isCompact = settings.bubbleStyle === 'compact';
          const isMatched =
            searchQuery.trim() &&
            msg.text.toLowerCase().includes(searchQuery.trim().toLowerCase());

          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 group transition-all ${
                isUser ? 'flex-row-reverse' : 'flex-row'
              } ${isSearching && !isMatched ? 'opacity-40' : 'opacity-100'}`}
            >
              {/* 头像 */}
              <button
                type="button"
                onClick={() => onEditAvatar(isUser ? 'user' : 'tea')}
                className="shrink-0 mb-1 relative group/avatar cursor-pointer focus:outline-none"
              >
                <div
                  className={`w-8 h-8 rounded-full overflow-hidden border-2 shadow-xs transition-transform group-hover/avatar:scale-108 ${
                    isUser
                      ? 'border-white bg-emerald-100'
                      : 'border-white bg-white'
                  }`}
                >
                  <img
                    src={isUser ? settings.userAvatar : settings.teaAvatar}
                    alt={isUser ? settings.userName : settings.teaRemarkName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  {isUser ? (
                    <span className="text-xs">🐱</span>
                  ) : (
                    <Coffee className="w-4 h-4 text-emerald-600" />
                  )}
                </div>
                <span className="absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity text-white text-[9px]">
                  <Camera className="w-3.5 h-3.5" />
                </span>
              </button>

              {/* 消息气泡主体 */}
              <div
                className={`max-w-[78%] flex flex-col ${
                  isUser ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`relative ${
                    isCompact ? 'px-3.5 py-2.5 text-[13px]' : 'px-4 py-3 text-[14px]'
                  } rounded-3xl transition-all duration-150 leading-relaxed break-words backdrop-blur-md border ${
                    isUser
                      ? 'border-white/40 text-white rounded-br-xs shadow-md'
                      : 'border-white/80 text-slate-800 rounded-bl-xs shadow-xs'
                  } ${isMatched ? 'ring-2 ring-amber-400' : ''}`}
                  style={
                    isUser
                      ? {
                          backgroundColor: `${primaryColor}${Math.round(bubbleAlpha * 255)
                            .toString(16)
                            .padStart(2, '0')}`,
                        }
                      : {
                          backgroundColor: `rgba(255, 255, 255, ${bubbleAlpha})`,
                        }
                  }
                >
                  {/* 高亮渲染消息正文 */}
                  <p className="whitespace-pre-wrap">
                    {renderHighlightedText(msg.text, searchQuery)}
                  </p>

                  {/* 错误状态与重试 */}
                  {msg.status === 'error' && (
                    <div className="mt-2 pt-2 border-t border-white/20 flex items-center justify-between gap-2 text-red-100 text-xs">
                      <span className="flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        发送失败
                      </span>
                      <button
                        type="button"
                        onClick={() => onRetryMessage(msg.id)}
                        className="underline hover:text-white font-semibold cursor-pointer"
                      >
                        重试
                      </button>
                    </div>
                  )}

                  {/* 复制小按钮 */}
                  <button
                    type="button"
                    onClick={() => handleCopy(msg.id, msg.text)}
                    className={`absolute -top-2 ${
                      isUser ? '-left-2' : '-right-2'
                    } w-6 h-6 rounded-full bg-white/90 backdrop-blur-sm shadow-md border border-emerald-100 text-slate-500 hover:text-emerald-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity`}
                    title="复制内容"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>

                <div
                  className={`flex items-center gap-1 px-1.5 mt-1 text-[10px] text-slate-400 ${
                    isUser ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <span>{formatTime(msg.timestamp)}</span>
                  {msg.status === 'sending' && (
                    <span className="text-emerald-600">发送中...</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* tea 回复等待中的半透明磨砂动画气泡 */}
        {isLoading && (
          <div className="flex items-end gap-2">
            <button
              type="button"
              onClick={() => onEditAvatar('tea')}
              className="shrink-0 mb-1 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white bg-white shadow-2xs flex items-center justify-center">
                <img
                  src={settings.teaAvatar}
                  alt={settings.teaRemarkName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </button>

            <div
              className="backdrop-blur-md border border-white/80 rounded-3xl rounded-bl-xs px-4 py-3 shadow-xs flex items-center gap-2"
              style={{
                backgroundColor: `rgba(255, 255, 255, ${bubbleAlpha})`,
              }}
            >
              <div className="flex items-center gap-1.5 py-0.5">
                <span
                  className="w-2 h-2 rounded-full animate-bounce [animation-delay:-0.3s]"
                  style={{ backgroundColor: primaryColor }}
                />
                <span
                  className="w-2 h-2 rounded-full animate-bounce [animation-delay:-0.15s]"
                  style={{ backgroundColor: primaryColor }}
                />
                <span
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{ backgroundColor: primaryColor }}
                />
              </div>
              <span className="text-xs text-slate-700 font-medium ml-1">
                {settings.teaRemarkName} 正在斟酌回信...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} className="h-1" />
      </div>

      {/* 表情快捷栏 */}
      {showEmojiBar && (
        <div className="px-4 py-2 bg-white/70 backdrop-blur-md border-t border-emerald-100 flex items-center gap-2 justify-between animate-in slide-in-from-bottom-2 duration-150 z-10">
          <div className="flex items-center gap-2 overflow-x-auto">
            {quickEmojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => insertEmoji(emoji)}
                className="text-lg p-1.5 hover:bg-white rounded-xl transition-transform active:scale-90 cursor-pointer"
              >
                {emoji}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setShowEmojiBar(false)}
            className="text-xs text-emerald-700/70 hover:text-emerald-900 px-2 py-1 cursor-pointer"
          >
            收起
          </button>
        </div>
      )}

      {/* 底部输入框和发送按钮 */}
      <footer className="shrink-0 p-3 bg-white/70 backdrop-blur-xl border-t border-white/60 z-10">
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md rounded-full p-1.5 pl-3.5 border border-emerald-200/60 focus-within:border-emerald-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-200/50 transition-all shadow-xs">
          <button
            type="button"
            onClick={() => setShowEmojiBar((prev) => !prev)}
            className="text-emerald-600/80 hover:text-emerald-700 p-1 rounded-full transition-colors cursor-pointer"
            title="选择表情"
            aria-label="选择表情"
          >
            <Smile className="w-5 h-5" />
          </button>

          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder={isLoading ? `${settings.teaRemarkName} 正在回复中...` : `对 ${settings.teaRemarkName} 说点什么吧...`}
            className="flex-1 bg-transparent text-slate-800 placeholder-emerald-800/40 text-sm outline-none px-1 py-1"
          />

          <button
            type="button"
            onClick={() => handleSend()}
            disabled={!inputText.trim() || isLoading}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-150 cursor-pointer shadow-sm ${
              inputText.trim() && !isLoading
                ? 'text-white hover:opacity-95 active:scale-92'
                : 'bg-emerald-100 text-emerald-300 cursor-not-allowed'
            }`}
            style={
              inputText.trim() && !isLoading
                ? { backgroundColor: primaryColor }
                : undefined
            }
            aria-label="发送消息"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </div>
      </footer>
    </div>
  );
}
