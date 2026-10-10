import { useState, useRef } from 'react';
import { Image as ImageIcon, Upload, X, Check, Camera } from 'lucide-react';
import { PhotoWidgetItem, PRESET_AVATARS, ALBUM_PHOTO_TEA, ALBUM_PHOTO_SKY } from '../constants/assets';

interface AlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  photos: [PhotoWidgetItem, PhotoWidgetItem];
  onSavePhoto: (index: 0 | 1, updated: PhotoWidgetItem) => void;
}

const GALLERY_PRESETS = [
  { title: '两杯热茶 · 慢时光', url: ALBUM_PHOTO_TEA },
  { title: '暮色晚霞 · 治愈天际', url: ALBUM_PHOTO_SKY },
  ...PRESET_AVATARS.map((p) => ({ title: p.name, url: p.url })),
];

export function AlbumModal({ isOpen, onClose, photos, onSavePhoto }: AlbumModalProps) {
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setSelectedPhotoUrl(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyToDesktop = (targetIndex: 0 | 1) => {
    if (!selectedPhotoUrl) return;
    onSavePhoto(targetIndex, {
      ...photos[targetIndex],
      url: selectedPhotoUrl,
      date: '相册精选',
    });
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white/95 backdrop-blur-2xl border border-white/70 w-full sm:max-w-[320px] rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 flex flex-col max-h-[88%] overflow-hidden">
        {/* 头部 */}
        <div className="flex items-center justify-between pb-3 border-b border-emerald-100/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <ImageIcon className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">手机相册</h3>
              <p className="text-[10px] text-slate-400">管理与浏览珍藏的照片记忆</p>
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

        <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1">
          {/* 上传新照片 */}
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
              className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-semibold rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              打开设备本地相册上传
            </button>
          </div>

          {/* 相册瀑布流/网格 */}
          <div className="grid grid-cols-2 gap-2">
            {GALLERY_PRESETS.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedPhotoUrl(item.url)}
                className={`group relative aspect-square rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${
                  selectedPhotoUrl === item.url
                    ? 'border-emerald-500 ring-2 ring-emerald-200 shadow-md scale-102'
                    : 'border-white/80 hover:border-emerald-200 shadow-2xs'
                }`}
              >
                <img
                  src={item.url}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-1.5 text-[9px] text-white truncate">
                  {item.title}
                </div>
              </div>
            ))}
          </div>

          {/* 设为桌面相框操作条 */}
          {selectedPhotoUrl && (
            <div className="bg-emerald-50/80 p-3 rounded-2xl border border-emerald-100 space-y-2 animate-in fade-in duration-150">
              <span className="text-xs font-bold text-emerald-900 block">
                将选中的照片应用到桌面：
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleApplyToDesktop(0)}
                  className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-medium cursor-pointer shadow-2xs"
                >
                  设为桌面照片 #1
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyToDesktop(1)}
                  className="flex-1 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-medium cursor-pointer shadow-2xs"
                >
                  设为桌面照片 #2
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
