// app/AiRadar.tsx
import radarData from '../public/radar.json';

export default function AiRadar() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8 px-4">
      {/* Pozitif Radar */}
      <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-5 shadow-lg shadow-emerald-500/5">
        <h3 className="text-emerald-400 font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          AI Radarı: Pozitif İvme
        </h3>
        <div className="grid gap-3">
          {radarData.positives.map((fund) => (
            <div key={fund.code} className="flex justify-between items-center bg-slate-800/50 p-3 rounded-xl border border-slate-700">
              <span className="font-bold text-slate-200">{fund.code}</span>
              <span className="text-emerald-400 font-mono font-bold">%{fund.change} 🚀</span>
            </div>
          ))}
        </div>
      </div>

      {/* Negatif Radar */}
      <div className="bg-slate-900 border border-rose-500/30 rounded-2xl p-5 shadow-lg shadow-rose-500/5">
        <h3 className="text-rose-400 font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
          </span>
          AI Radarı: Trend Zayıflığı
        </h3>
        <div className="grid gap-3">
          {radarData.warnings.map((fund) => (
            <div key={fund.code} className="flex justify-between items-center bg-slate-800/50 p-3 rounded-xl border border-slate-700">
              <span className="font-bold text-slate-200">{fund.code}</span>
              <span className="text-rose-400 font-mono font-bold">%{fund.change} ⚠️</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}