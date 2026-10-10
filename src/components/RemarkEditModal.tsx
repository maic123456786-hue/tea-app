import { useState } from 'react';
import { Edit3, X, User, Heart, Sparkles } from 'lucide-react';

interface RemarkEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTeaRemark: string;
  currentUserName: string;
  onSave: (teaRemark: string, userName: string) => void;
}

export function RemarkEditModal({
  isOpen,
  onClose,
  currentTeaRemark,
  currentUserName,
  onSave,
}: RemarkEditModalProps) {
  const [teaRemark, setTeaRemark] = useState(currentTeaRemark);
  const [userName, setUserName] = useState(currentUserName);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(
      teaRemark.trim() || 'tea',
      userName.trim() || '猫猫茶友'
    );
    onClose();
  };

  const quickTeaNicknames = ['tea', '小茶宠', '薄荷小甜心', '小茶伴', '我的AI茶宝'];

  return (
    <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white/95 backdrop-blur-2xl border border-white/70 w-full sm:max-w-[320px] rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between pb-3 border-b border-emerald-100/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">修改双方备注</h3>
              <p className="text-[10px] text-slate-400">定制独一无二的亲昵称呼</p>
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
          {/* tea 的专属备注 */}
          <div>
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1 mb-1">
              <Heart className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
              tea 的专属备注名
            </label>
            <input
              type="text"
              value={teaRemark}
              onChange={(e) => setTeaRemark(e.target.value)}
              placeholder="例如：小茶宠、小薄荷..."
              maxLength={12}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-400 focus:bg-white transition-all font-medium"
            />
            {/* 快速推荐昵称 */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {quickTeaNicknames.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setTeaRemark(name)}
                  className="text-[10px] px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200/50 cursor-pointer"
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* 我的昵称 */}
          <div>
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1 mb-1">
              <User className="w-3.5 h-3.5 text-emerald-600" />
              我的称呼 / 昵称
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="例如：猫猫、主人..."
              maxLength={12}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-400 focus:bg-white transition-all font-medium"
            />
          </div>
        </div>

        {/* 底部保存按钮 */}
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
            保存备注
          </button>
        </div>
      </div>
    </div>
  );
}
