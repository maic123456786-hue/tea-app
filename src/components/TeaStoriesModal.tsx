import { useState } from 'react';
import { Coffee, X, Sparkles, BookOpen, Heart, Flame } from 'lucide-react';

interface TeaStoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TEA_STORIES = [
  {
    id: '1',
    name: '今日特调 · 薄荷仙草冻',
    temp: '常温 · 半糖',
    tag: '治愈系',
    desc: '新鲜薄荷叶轻揉释放香气，配上手作仙草与醇香牛乳，入口清冽，回甘微甜。特别适合心绪浮躁的午后～',
    mood: '🍃 清新安定',
  },
  {
    id: '2',
    name: '春日初醒 · 白桃煎茶',
    temp: '微凉 · 三分糖',
    tag: '元气满满',
    desc: '日本蒸青绿茶与多汁水蜜桃的温柔邂逅，茶汤透亮泛金，每一口都带着春日阳光的温度。',
    mood: '🌸 欢快愉悦',
  },
  {
    id: '3',
    name: '晚安温存 · 洋甘菊鲜奶茶',
    temp: '温热 · 无糖',
    tag: '伴眠安神',
    desc: '德国洋甘菊与纯牛奶小火慢煨，不含茶多酚与咖啡因，伴着淡淡苹果香气，拥你进入甜美梦乡。',
    mood: '🌙 温暖宁静',
  },
];

export function TeaStoriesModal({ isOpen, onClose }: TeaStoriesModalProps) {
  const [selectedId, setSelectedId] = useState('1');

  if (!isOpen) return null;

  const current = TEA_STORIES.find((s) => s.id === selectedId) || TEA_STORIES[0];

  return (
    <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white/95 backdrop-blur-2xl border border-white/70 w-full sm:max-w-[320px] rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 flex flex-col max-h-[88%] overflow-hidden">
        {/* 头部 */}
        <div className="flex items-center justify-between pb-3 border-b border-emerald-100/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Coffee className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">茶话集</h3>
              <p className="text-[10px] text-slate-400">tea 的独家茶饮手作与心事日记</p>
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
          {/* 特调切换胶囊 */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {TEA_STORIES.map((story) => (
              <button
                key={story.id}
                type="button"
                onClick={() => setSelectedId(story.id)}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedId === story.id
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-emerald-50'
                }`}
              >
                {story.name.split(' · ')[1] || story.name}
              </button>
            ))}
          </div>

          {/* 特调卡片 */}
          <div className="bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/50 p-4 rounded-2xl border border-emerald-100/70 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">{current.name}</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-medium px-2 py-0.5 rounded-full">
                {current.temp}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{current.desc}</p>
            <div className="pt-2 border-t border-emerald-100/60 flex items-center justify-between text-[11px] text-emerald-800/80">
              <span>状态：{current.mood}</span>
              <span className="flex items-center gap-0.5 text-rose-500 font-medium">
                <Heart className="w-3 h-3 fill-rose-500" /> 推荐特调
              </span>
            </div>
          </div>

          {/* tea 的手写寄语 */}
          <div className="bg-[#fcfbee] p-3 rounded-2xl border border-[#ece8cd] text-xs text-slate-600 space-y-1">
            <span className="text-[10px] font-bold text-amber-800 flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              tea 的随笔札记
            </span>
            <p className="text-[11px] leading-relaxed italic text-slate-500">
              “不管生活节奏多快，都要记得为自己留出一杯茶的安静时光。温度适中，甜度刚好，就是最幸福的小事。”
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
