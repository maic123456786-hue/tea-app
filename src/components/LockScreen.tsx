import { useState, useEffect, useRef } from 'react';
import { Lock, Unlock, ChevronUp, Flashlight, Camera, Delete } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface LockScreenProps {
  onUnlock: () => void;
  teaAvatar: string;
  teaRemarkName: string;
}

const CORRECT_PIN = '0308';

export function LockScreen({ onUnlock, teaAvatar, teaRemarkName }: LockScreenProps) {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDateStr, setCurrentDateStr] = useState('');
  const [showKeypad, setShowKeypad] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);

  const touchStartY = useRef(0);
  const isDragging = useRef(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = now.getHours().toString().padStart(2, '0');
      const m = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${h}:${m}`);

      const month = now.getMonth() + 1;
      const day = now.getDate();
      const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      const weekday = weekdays[now.getDay()];
      setCurrentDateStr(`${month}月${day}日 ${weekday}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handle number click
  const handleDigit = (digit: string) => {
    if (isSuccess || enteredPin.length >= 4) return;

    soundManager.playPop();
    const nextPin = enteredPin + digit;
    setEnteredPin(nextPin);

    if (nextPin.length === 4) {
      if (nextPin === CORRECT_PIN) {
        setIsSuccess(true);
        soundManager.playChime();
        setTimeout(() => {
          onUnlock();
        }, 350);
      } else {
        setIsError(true);
        setTimeout(() => {
          setEnteredPin('');
          setIsError(false);
        }, 600);
      }
    }
  };

  const handleDelete = () => {
    if (enteredPin.length > 0) {
      setEnteredPin((prev) => prev.slice(0, -1));
    }
  };

  // Touch handlers for swipe up
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    touchStartY.current = clientY;
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging.current) return;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const diff = touchStartY.current - clientY;
    if (diff > 0) {
      setSwipeOffset(Math.min(diff, 180));
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (swipeOffset > 60) {
      setShowKeypad(true);
    }
    setSwipeOffset(0);
  };

  return (
    <div
      className="absolute inset-0 z-50 flex flex-col justify-between overflow-hidden select-none bg-cover bg-center"
      style={{
        backgroundImage: `radial-gradient(circle at 50% 20%, #d4eedf 0%, #cae8d7 45%, #b6ddc8 100%)`,
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseMove={handleTouchMove}
      onMouseUp={handleTouchEnd}
    >
      {/* 顶部锁头与时间 */}
      <div className="pt-4 px-6 flex flex-col items-center z-10">
        <div className="mb-2 text-emerald-800/80">
          {isSuccess ? (
            <Unlock className="w-5 h-5 text-emerald-700 animate-bounce" />
          ) : (
            <Lock className="w-5 h-5 opacity-70" />
          )}
        </div>

        {/* 锁屏时间 */}
        <div className="text-center">
          <p className="text-xs font-medium text-emerald-900/70 tracking-wide">
            {currentDateStr || '10月9日 星期五'}
          </p>
          <h1 className="text-6xl font-light tracking-tight text-slate-800 font-sans my-1">
            {currentTime || '09:41'}
          </h1>
        </div>

        {/* 锁屏状态 */}
        <div className="mt-3 bg-white/40 backdrop-blur-md border border-white/60 px-4 py-1.5 rounded-full shadow-2xs flex items-center gap-2">
          <div className="w-4 h-4 rounded-full overflow-hidden border border-white shrink-0">
            <img src={teaAvatar} alt={teaRemarkName} className="w-full h-full object-cover" />
          </div>
          <span className="text-[11px] font-medium text-emerald-900/80">
            {teaRemarkName} 在家里等你说说话 🌿
          </span>
        </div>
      </div>

      {/* 密码输入面板 */}
      {showKeypad ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 animate-in fade-in slide-in-from-bottom-8 duration-300 z-20">
          <div className="bg-white/40 backdrop-blur-2xl border border-white/70 rounded-3xl p-6 w-full max-w-[320px] shadow-lg flex flex-col items-center">
            {/* 4 位密码圆点 */}
            <div
              className={`flex items-center gap-4 my-6 transition-transform ${
                isError ? 'animate-shake text-rose-500' : ''
              }`}
            >
              {[0, 1, 2, 3].map((idx) => {
                const filled = enteredPin.length > idx;
                return (
                  <div
                    key={idx}
                    className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-150 ${
                      isSuccess
                        ? 'bg-emerald-600 border-emerald-600 scale-110'
                        : isError
                        ? 'bg-rose-500 border-rose-500'
                        : filled
                        ? 'bg-slate-700 border-slate-700 scale-105'
                        : 'border-slate-400/60 bg-transparent'
                    }`}
                  />
                );
              })}
            </div>

            {/* 密码键盘 (1 - 9, 0) */}
            <div className="grid grid-cols-3 gap-3.5 w-full max-w-[240px]">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleDigit(num)}
                  className="w-14 h-14 mx-auto rounded-full bg-white/50 hover:bg-white/75 active:bg-emerald-100/70 backdrop-blur-md border border-white/80 shadow-2xs flex flex-col items-center justify-center text-xl font-semibold text-slate-800 transition-all cursor-pointer active:scale-95"
                >
                  <span>{num}</span>
                </button>
              ))}

              {/* 取消 */}
              <button
                type="button"
                onClick={() => {
                  setShowKeypad(false);
                  setEnteredPin('');
                }}
                className="w-14 h-14 mx-auto rounded-full flex items-center justify-center text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                取消
              </button>

              {/* 0 */}
              <button
                type="button"
                onClick={() => handleDigit('0')}
                className="w-14 h-14 mx-auto rounded-full bg-white/50 hover:bg-white/75 active:bg-emerald-100/70 backdrop-blur-md border border-white/80 shadow-2xs flex flex-col items-center justify-center text-xl font-semibold text-slate-800 transition-all cursor-pointer active:scale-95"
              >
                <span>0</span>
              </button>

              {/* 回退键 */}
              <button
                type="button"
                onClick={handleDelete}
                className="w-14 h-14 mx-auto rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 cursor-pointer active:scale-95"
                title="删除"
              >
                <Delete className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* 未展开键盘时的上滑提示与底部工具 */
        <div
          className="pb-6 px-8 flex flex-col items-center z-10 transition-transform duration-100"
          style={{ transform: `translateY(-${swipeOffset}px)` }}
        >
          {/* 上滑解锁按钮 */}
          <button
            type="button"
            onClick={() => setShowKeypad(true)}
            className="flex flex-col items-center gap-1 text-slate-600 hover:text-slate-900 group cursor-pointer mb-6"
          >
            <ChevronUp className="w-5 h-5 animate-bounce text-emerald-800/70" />
            <span className="text-xs font-medium tracking-wider text-emerald-900/80 group-hover:scale-105 transition-transform">
              上滑解锁
            </span>
          </button>

          {/* 底部手电筒和相机快捷圆圈 */}
          <div className="w-full flex items-center justify-between">
            <button
              type="button"
              className="w-11 h-11 rounded-full bg-white/35 backdrop-blur-md border border-white/60 flex items-center justify-center text-slate-700 shadow-2xs hover:bg-white/50 transition-colors"
            >
              <Flashlight className="w-5 h-5 stroke-[1.8]" />
            </button>
            <button
              type="button"
              className="w-11 h-11 rounded-full bg-white/35 backdrop-blur-md border border-white/60 flex items-center justify-center text-slate-700 shadow-2xs hover:bg-white/50 transition-colors"
            >
              <Camera className="w-5 h-5 stroke-[1.8]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
