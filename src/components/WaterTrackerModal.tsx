import { useState } from 'react';
import { Droplet, Plus, RotateCcw, X, Sparkles, Heart } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface WaterTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  glasses: number;
  onUpdateGlasses: (count: number) => void;
}

export function WaterTrackerModal({
  isOpen,
  onClose,
  glasses = 3,
  onUpdateGlasses,
}: WaterTrackerModalProps) {
  if (!isOpen) return null;

  const totalGoal = 8;
  const current = Math.min(glasses, totalGoal);
  const percent = Math.round((current / totalGoal) * 100);

  const handleAdd = () => {
    soundManager.playPop();
    onUpdateGlasses(glasses + 1);
  };

  const handleReset = () => {
    onUpdateGlasses(0);
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white/95 backdrop-blur-2xl border border-white/70 w-full sm:max-w-[320px] rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between pb-3 border-b border-emerald-100/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
              <Droplet className="w-4 h-4 fill-cyan-500 text-cyan-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">喝水记录</h3>
              <p className="text-[10px] text-slate-400">每天 8 杯水，和 tea 一起元气满满</p>
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

        <div className="py-4 space-y-4">
          {/* 水量进度大卡片 */}
          <div className="bg-gradient-to-br from-cyan-50/70 via-emerald-50/50 to-teal-50/70 p-4 rounded-2xl border border-cyan-100/70 text-center relative overflow-hidden">
            <div className="flex items-baseline justify-center gap-1 my-1">
              <span className="text-4xl font-extrabold text-cyan-800 font-mono">
                {glasses}
              </span>
              <span className="text-xs font-semibold text-cyan-600">/ {totalGoal} 杯</span>
            </div>
            <p className="text-[11px] text-slate-500">
              今日饮水达成率 {percent}% · 约 {glasses * 250} ml
            </p>

            {/* 进度条 */}
            <div className="w-full bg-white/70 h-2.5 rounded-full mt-3 overflow-hidden p-0.5 border border-cyan-100">
              <div
                className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          {/* 8 个小水杯图标展示 */}
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: totalGoal }).map((_, idx) => {
              const filled = idx < glasses;
              return (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all ${
                    filled
                      ? 'bg-cyan-50/90 border-cyan-200 text-cyan-700 shadow-2xs'
                      : 'bg-slate-50 border-slate-100 text-slate-300'
                  }`}
                >
                  <Droplet className={`w-5 h-5 ${filled ? 'fill-cyan-500' : ''}`} />
                  <span className="text-[9px] font-mono mt-1 font-medium">第{idx + 1}杯</span>
                </div>
              );
            })}
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAdd}
              className="flex-1 py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:opacity-95 active:scale-98 text-white text-xs font-semibold rounded-2xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              喝了一杯水 (+250ml)
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-2xl transition-colors cursor-pointer"
              title="重置计数"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
