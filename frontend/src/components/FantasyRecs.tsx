import React, { useState, useEffect } from 'react';
import { Award, ShieldCheck, User, Users, Flame, Info, Sparkles } from 'lucide-react';

interface FantasyRecsProps {
  backendUrl: string;
}

export const FantasyRecs: React.FC<FantasyRecsProps> = ({ backendUrl }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFantasyRecs = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/insights/fantasy`);
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error("Fantasy recommendations fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFantasyRecs();
  }, [backendUrl]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-10 text-slate-400">
        No recommendations available. Seeding database might be required.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent">
          Fantasy Optimizer
        </h1>
        <p className="text-slate-400 mt-1">AI-optimized squads, captain selections, and team performance recommendations.</p>
      </div>

      {/* Captain and Vice Captain blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Captain Card */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-900 shadow-xl relative overflow-hidden">
          {/* Captain ribbon decoration */}
          <div className="absolute top-4 right-4 p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <Award className="w-6 h-6" />
          </div>
          
          <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-900/40">
            Optimal Captain Choice
          </span>
          <h2 className="text-2xl font-black text-slate-100 mt-4 tracking-tight">{data.captain?.name}</h2>
          <p className="text-xs text-slate-400 mt-1">Consistency Score: <strong className="text-emerald-400">{data.captain?.consistency_score}%</strong></p>
          
          <div className="mt-4 p-3.5 bg-slate-900/40 border border-slate-800/40 rounded-xl flex items-start space-x-3 text-xs text-slate-300 leading-normal">
            <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <p>{data.captain?.reason}</p>
          </div>
        </div>

        {/* Vice Captain Card */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-900 shadow-xl relative overflow-hidden">
          <div className="absolute top-4 right-4 p-2 bg-blue-500/10 text-blue-400 rounded-lg">
            <ShieldCheck className="w-6 h-6" />
          </div>
          
          <span className="text-[10px] uppercase font-black tracking-widest text-blue-400 bg-blue-950/40 px-2.5 py-1 rounded border border-blue-900/40">
            Optimal Vice-Captain
          </span>
          <h2 className="text-2xl font-black text-slate-100 mt-4 tracking-tight">{data.vice_captain?.name}</h2>
          <p className="text-xs text-slate-400 mt-1">Consistency Score: <strong className="text-blue-400">{data.vice_captain?.consistency_score}%</strong></p>
          
          <div className="mt-4 p-3.5 bg-slate-900/40 border border-slate-800/40 rounded-xl flex items-start space-x-3 text-xs text-slate-300 leading-normal">
            <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <p>{data.vice_captain?.reason}</p>
          </div>
        </div>

      </div>

      {/* Best Playing XI Section */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-900 shadow-xl">
        <h2 className="text-xl font-bold text-slate-200 mb-6 flex items-center">
          <Users className="w-5 h-5 text-emerald-400 mr-2" />
          Optimal Playing XI (Ranked Lineup)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.best_eleven && data.best_eleven.map((player: any, idx: number) => {
            const isCap = player.id === data.captain?.id;
            const isVc = player.id === data.vice_captain?.id;
            return (
              <div 
                key={player.id}
                className={`p-4 rounded-xl border relative ${
                  isCap 
                    ? 'bg-emerald-950/10 border-emerald-500/30' 
                    : isVc 
                      ? 'bg-blue-950/10 border-blue-500/30' 
                      : 'bg-slate-900/30 border-slate-800/50'
                }`}
              >
                {/* Ranking Tag */}
                <span className="absolute top-3 right-3 text-[10px] font-black text-slate-500">#{idx + 1}</span>
                
                <p className="text-sm font-extrabold text-slate-200">{player.name}</p>
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-1">{player.role}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{player.team}</p>
                
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-850">
                  <span className="text-[10px] text-slate-500 font-medium">Consistency:</span>
                  <span className="text-xs font-black text-emerald-400">{player.consistency_score}%</span>
                </div>

                {/* Captain Badge */}
                {isCap && (
                  <span className="absolute top-3 left-3 px-1.5 py-0.5 bg-emerald-500 text-slate-950 text-[8px] font-black uppercase rounded">
                    C
                  </span>
                )}
                {isVc && (
                  <span className="absolute top-3 left-3 px-1.5 py-0.5 bg-blue-500 text-slate-950 text-[8px] font-black uppercase rounded">
                    VC
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
