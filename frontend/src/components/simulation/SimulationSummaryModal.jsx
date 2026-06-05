import { X, TrendingUp, Star, Bell, Calendar } from "lucide-react";

const SimulationSummaryModal = ({ summary, onClose }) => {
  if (!summary) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl bg-[#111827] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="bg-linear-to-r from-violet-600 to-indigo-600 p-8 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/50 hover:text-white transition"
          >
            <X size={24} />
          </button>
          <Calendar className="mx-auto text-white mb-4" size={48} />
          <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Simulation Complete</h2>
          <p className="text-violet-100 font-bold mt-1">Week {summary.startWeek} → Week {summary.endWeek}</p>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl text-center">
              <div className="flex justify-center text-green-500 mb-2"><TrendingUp size={20} /></div>
              <div className="text-2xl font-black text-white">+{summary.fansGained.toLocaleString()}</div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Fans Gained</div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl text-center">
              <div className="flex justify-center text-yellow-500 mb-2"><Star size={20} /></div>
              <div className="text-2xl font-black text-white">+{summary.prestigeGained.toLocaleString()}</div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Prestige Gained</div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-slate-400 font-bold uppercase text-xs tracking-widest mb-4">
              <Bell size={14} /> Recent Notifications ({summary.notificationCount})
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {summary.newNotifications.map((notif, idx) => (
                <div key={idx} className="bg-slate-900/80 border border-slate-800/50 p-3 rounded-xl text-sm text-slate-300">
                  {notif.message}
                </div>
              ))}
              {summary.newNotifications.length === 0 && (
                <div className="text-slate-600 text-center py-4 italic">No major events occurred.</div>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white py-4 rounded-2xl font-black text-lg transition shadow-lg shadow-violet-900/20"
          >
            CONTINUE
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimulationSummaryModal;
