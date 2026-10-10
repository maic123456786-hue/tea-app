import { useState, useRef } from 'react';
import { Camera, Upload, X, Check, Sparkles } from 'lucide-react';
import { PRESET_AVATARS } from '../constants/assets';

interface AvatarPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  target: 'tea' | 'user';
  currentAvatarUrl: string;
  onSelectAvatar: (url: string) => void;
}

export function AvatarPickerModal({
  isOpen,
  onClose,
  target,
  currentAvatarUrl,
  onSelectAvatar,
}: AvatarPickerModalProps) {
  const [selectedUrl, setSelectedUrl] = useState(currentAvatarUrl);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const title = target === 'tea' ? '更换 tea 的头像' : '更换我的头像';
  const subtitle =
    target === 'tea'
      ? '为你的 AI 茶伴挑选一张心仪的萌萌新照片'
      : '设置你在 tea 的家里的专属形象';

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setSelectedUrl(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCustomUrl = () => {
    if (customUrlInput.trim()) {
      setSelectedUrl(customUrlInput.trim());
      setCustomUrlInput('');
    }
  };

  const handleSave = () => {
    onSelectAvatar(selectedUrl);
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white/95 backdrop-blur-xl border border-white/60 w-full sm:max-w-[340px] rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 flex flex-col max-h-[90%] overflow-hidden">
        {/* 标题栏 */}
        <div className="flex items-center justify-between pb-3 border-b border-emerald-100/70">
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-emerald-600" />
              {title}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {/* 当前预览 */}
          <div className="flex flex-col items-center justify-center p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-white shadow-md bg-white">
                <img
                  src={selectedUrl}
                  alt="Avatar preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute bottom-0 right-0 bg-emerald-500 text-white p-1 rounded-full shadow-xs">
                <Sparkles className="w-3 h-3" />
              </span>
            </div>
            <span className="text-[11px] font-medium text-emerald-800 mt-2">
              当前选中预览
            </span>
          </div>

          {/* 上传本地相册图片 */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-semibold rounded-2xl shadow-sm shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              从手机相册上传新照片
            </button>
          </div>

          {/* 预设精选头像相册 */}
          <div>
            <span className="text-xs font-bold text-slate-500 mb-2 block">
              精选相册推荐
            </span>
            <div className="grid grid-cols-4 gap-2">
              {PRESET_AVATARS.map((preset) => {
                const isSelected = selectedUrl === preset.url;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelectedUrl(preset.url)}
                    className={`relative rounded-2xl overflow-hidden aspect-square border-2 transition-all p-0.5 cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 ring-2 ring-emerald-200 scale-102 shadow-xs'
                        : 'border-transparent hover:border-emerald-200 opacity-85 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-xl"
                    />
                    {isSelected && (
                      <span className="absolute top-1 right-1 bg-emerald-500 text-white rounded-full p-0.5">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 或者输入在线网络图片链接 */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[11px] text-slate-400 block mb-1">
              或输入网络图片链接：
            </span>
            <div className="flex items-center gap-1.5">
              <input
                type="url"
                value={customUrlInput}
                onChange={(e) => setCustomUrlInput(e.target.value)}
                placeholder="https://..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:border-emerald-400"
              />
              <button
                type="button"
                onClick={handleApplyCustomUrl}
                disabled={!customUrlInput.trim()}
                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 disabled:opacity-40 text-slate-700 text-xs font-medium rounded-xl transition-colors cursor-pointer"
              >
                应用
              </button>
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
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
            确定更换
          </button>
        </div>
      </div>
    </div>
  );
}
