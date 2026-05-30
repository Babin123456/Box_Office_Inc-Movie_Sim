const StatCard = ({ title, value, icon }) => {
  return (
    <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 hover:border-violet-500 transition">
      <div className="flex items-center justify-between mb-3">
        <span className="text-slate-400 text-sm">{title}</span>
        <span className="text-xl">{icon}</span>
      </div>

      <h3 className="text-3xl font-bold text-white">
        {value}
      </h3>
    </div>
  );
};

export default StatCard;