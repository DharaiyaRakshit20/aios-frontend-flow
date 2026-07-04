export default function Loading() {
  return (
    <div className="min-h-screen w-full bg-[#0a0a0f] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center font-bold animate-pulse">Q</div>
          <span className="text-xl font-semibold text-white tracking-tight">Qevora</span>
        </div>
        <div className="w-8 h-8 border-4 border-white/10 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    </div>
  );
}