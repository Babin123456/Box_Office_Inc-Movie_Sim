const SkeletonCard = () => (
  <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 animate-pulse flex flex-col h-full">
    <div className="flex justify-between items-start mb-6">
      <div className="h-6 w-1/2 bg-slate-700 rounded-lg"></div>
      <div className="h-5 w-16 bg-slate-700 rounded-full"></div>
    </div>
    
    <div className="space-y-4 mb-8 flex-grow">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="flex justify-between">
          <div className="h-4 w-1/3 bg-slate-700 rounded"></div>
          <div className="h-4 w-1/4 bg-slate-700 rounded"></div>
        </div>
      ))}
    </div>
    
    <div className="flex items-center justify-between mt-auto">
      <div className="h-6 w-1/4 bg-slate-700 rounded-lg"></div>
      <div className="h-10 w-28 bg-slate-700 rounded-lg"></div>
    </div>
  </div>
);

export const SkeletonGrid = ({ count = 6 }) => {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

export default SkeletonGrid;
