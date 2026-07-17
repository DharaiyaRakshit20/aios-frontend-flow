"use client";

export default function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
      <div className="relative w-14 h-14">
        {/* ghoomta ring */}
        <div className="absolute inset-0 rounded-full border-[3px] border-indigo-500/15" />
        <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-indigo-500 border-r-violet-500 animate-spin" />
        {/* beech ka Q */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold bg-gradient-to-br from-indigo-400 to-violet-400 bg-clip-text text-transparent animate-pulse">Q</span>
        </div>
      </div>
      <div className="flex gap-1.5 mt-5">
        {[0, 150, 300].map((d) => (
          <span key={d} className="w-1.5 h-1.5 rounded-full bg-indigo-500/60 animate-bounce" style={{ animationDelay: `${d}ms` }} />
        ))}
      </div>
    </div>
  );
}
