import { useState, useRef } from 'react';
import { Image as ImageIcon, Upload, X, Check, Calendar, Type } from 'lucide-react';
import { PhotoWidgetItem, PRESET_AVATARS, ALBUM_PHOTO_TEA, ALBUM_PHOTO_SKY } from '../constants/assets';

interface PhotoPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  photoIndex: 0 | 1;
  currentPhoto: PhotoWidgetItem;
  onSavePhoto: (index: 0 | 1, updated: PhotoWidgetItem) => void;
}

const DESKTOP_PHOTO_PRESETS = [
  { title: '两杯热茶 · 慢时光', url: ALBUM_PHOTO_TEA },
  { title: '暮色晚霞 · 治愈天际', url: ALBUM_PHOTO_SKY },
  ...PRESET_AVATARS.map((p) => ({ title: p.name, url: p.url })),
];

export function PhotoPickerModal({
  isOpen,
  onClose,
  photoIndex,
  currentPhoto,
  onSavePhoto,
}: PhotoPickerModalProps) {
  const [photoUrl, setPhotoUrl] = useState(currentPhoto.url);
  const [title, setTitle] = useState(currentPhoto.title);
  const [date, setDate] = useState(currentPhoto.date);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setPhotoUrl(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    onSavePhoto(photoIndex, {
      ...currentPhoto,
      url: photoUrl,
      title: title.trim() || `照片 #${photoIndex + 1}`,
      date: date.trim() || '近期记忆',
    });
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white/95 backdrop-blur-xl border border-white/60 w-full sm:max-w-[340px] rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 flex flex-col max-h-[92%] overflow-hidden">
        {/* 标题 */}
        <div className="flex items-center justify-between pb-3 border-b border-emerald-100/70">
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-emerald-600" />
              更换桌面照片 #{photoIndex + 1}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              定制属于你们手机桌面的浪漫拍立得相框
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1">
          {/* 照片即时拍立得预览 */}
          <div className="bg-white p-2.5 pb-4 rounded-2xl border border-emerald-100 shadow-md flex flex-col items-center">
            <div className="w-full aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-100">
              <img
                src={photoUrl}
                alt="Desktop preview"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-full mt-2 text-center">
              <p className="text-xs font-semibold text-slate-700 truncate">
                {title || '未填写标题'}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                {date || '2026.10.09'}
              </p>
            </div>
          </div>

          {/* 上传新照片按钮 */}
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
              上传手机相册新照片
            </button>
          </div>

          {/* 照片标题与日期编辑 */}
          <div className="space-y-2 bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
            <div>
              <label className="text-[11px] font-medium text-slate-500 flex items-center gap-1 mb-1">
                <Type className="w-3 h-3 text-emerald-600" />
                照片题记 / 纪念文案
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例如：甜蜜日常、海边日落..."
                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-500 flex items-center gap-1 mb-1">
                <Calendar className="w-3 h-3 text-emerald-600" />
                标记日期
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="例如：2025.05.20 或 纪念日"
                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          {/* 预设桌面精选图库 */}
          <div>
            <span className="text-xs font-bold text-slate-500 mb-1.5 block">
              备选图库精选
            </span>
            <div className="grid grid-cols-4 gap-2">
              {DESKTOP_PHOTO_PRESETS.map((preset, idx) => {
                const isSelected = photoUrl === preset.url;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setPhotoUrl(preset.url);
                      setTitle(preset.title);
                    }}
                    className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all p-0.5 cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 ring-2 ring-emerald-200 scale-102 shadow-xs'
                        : 'border-transparent hover:border-emerald-200 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-lg"
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
            保存并应用到桌面
          </button>
        </div>
      </div>
    </div>
  );
}
