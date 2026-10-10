import { useState, useRef, useEffect } from 'react';
import { Radio, Play, Pause, SkipForward, Volume2, X, Music, Sparkles } from 'lucide-react';

interface MoodRadioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TRACKS = [
  { id: '1', title: '薄荷茶田的微风', author: 'tea 特调原声', duration: '03:45' },
  { id: '2', title: '窗台边的初夏细雨', author: '治愈雨声', duration: '04:12' },
  { id: '3', title: '午后壁炉与半糖奶绿', author: '暖调吉他', duration: '02:58' },
];

export function MoodRadioModal({ isOpen, onClose }: MoodRadioModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [progress, setProgress] = useState(25);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => {
    if (!isPlaying) {
      try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass && !audioContextRef.current) {
          audioContextRef.current = new AudioContextClass();
        }
        if (audioContextRef.current?.state === 'suspended') {
          audioContextRef.current.resume();
        }
      } catch {
        // Ignore
      }
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  if (!isOpen) return null;

  const currentTrack = TRACKS[currentTrackIndex];

  return (
    <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white/95 backdrop-blur-2xl border border-white/70 w-full sm:max-w-[320px] rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between pb-3 border-b border-emerald-100/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">心晴FM</h3>
              <p className="text-[10px] text-slate-400">专属于你与 tea 的治愈白噪音</p>
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

        <div className="py-4 flex flex-col items-center">
          {/* 黑胶唱片旋转动画 */}
          <div className="relative my-2">
            <div
              className={`w-32 h-32 rounded-full bg-slate-900 border-4 border-slate-800 shadow-xl flex items-center justify-center relative overflow-hidden transition-all duration-700 ${
                isPlaying ? 'animate-spin [animation-duration:8s]' : ''
              }`}
            >
              {/* 唱片沟槽同心圆 */}
              <div className="w-24 h-24 rounded-full border border-slate-700 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border border-slate-700 flex items-center justify-center">
                  {/* 唱片中心贴纸 */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 border-2 border-white flex items-center justify-center">
                    <Music className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 曲目信息 */}
          <div className="text-center mt-3">
            <h4 className="text-sm font-bold text-slate-800">{currentTrack.title}</h4>
            <p className="text-xs text-emerald-700/80 mt-0.5">{currentTrack.author}</p>
          </div>

          {/* 进度条 */}
          <div className="w-full mt-4">
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>01:12</span>
              <span>{currentTrack.duration}</span>
            </div>
          </div>

          {/* 播放控制器 */}
          <div className="flex items-center justify-center gap-6 mt-4">
            <button
              type="button"
              onClick={togglePlay}
              className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md active:scale-92 transition-all cursor-pointer"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              title="下一首"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
