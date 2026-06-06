import React, { useState, useEffect } from 'react';
import { Target, ShieldAlert, Award, Star, Info, TrendingUp, Sparkles, Heart } from 'lucide-react';

interface ScoutingAuctionProps {
  backendUrl: string;
}

export const ScoutingAuction: React.FC<ScoutingAuctionProps> = ({ backendUrl }) => {
  const [talents, setTalents] = useState<any[]>([]);
  const [auctionValues, setAuctionValues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Injury Simulation states
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>('');
  const [injuryReport, setInjuryReport] = useState<any>(null);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    const fetchScoutingData = async () => {
      try {
        const tRes = await fetch(`${backendUrl}/api/scouting/talents`);
        const tData = await tRes.json();
        setTalents(tData);

        const aRes = await fetch(`${backendUrl}/api/insights/auction`);
        const aData = await aRes.json();
        setAuctionValues(aData);
        if (aData.length > 0) {
          setSelectedPlayerId(aData[0].player_id);
        }
      } catch (err) {
        console.error("Scouting data fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchScoutingData();
  }, [backendUrl]);

  const runInjurySimulation = async () => {
    if (!selectedPlayerId) return;
    setSimulating(true);
    try {
      const response = await fetch(`${backendUrl}/api/insights/injury`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player_id: selectedPlayerId }),
      });
      const data = await response.json();
      setInjuryReport(data);
    } catch (err) {
      console.error("Injury simulation error", err);
    } finally {
      setSimulating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-15 border-t-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent">
          Talent Scouting & Market Valuation
        </h1>
        <p className="text-slate-400 mt-1">Emerging talent tracking, estimated IPL auction pricing, and injury impact simulations.</p>
      </div>

      {/* Grid: Talent Scouting and Market Valuation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Talent Scouting List */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-900 shadow-xl">
          <h2 className="text-xl font-bold text-slate-200 mb-6 flex items-center">
            <Sparkles className="w-5 h-5 text-accent-neon mr-2" />
            Emerging Talent Scouting Board
          </h2>
          <div className="space-y-3.5 max-h-[400px] overflow-y-auto pr-1">
            {talents.map((p, idx) => (
              <div 
                key={p.player_id}
                className="flex items-center justify-between p-4 bg-slate-900/40 border border-slate-800/40 rounded-xl"
              >
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-slate-200">{p.name}</p>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">{p.role} &bull; {p.country} ({p.age}y)</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-slate-400">Consistency</p>
                  <p className="text-sm font-black text-emerald-400">{p.consistency}%</p>
                </div>
              </div>
            ))}
            {talents.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-6">No emerging talents under 32 meeting the threshold found.</p>
            )}
          </div>
        </div>

        {/* IPL Auction Valuation Predictor */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-900 shadow-xl">
          <h2 className="text-xl font-bold text-slate-200 mb-6 flex items-center">
            <TrendingUp className="w-5 h-5 text-emerald-400 mr-2" />
            Estimated IPL Auction Valuation Model
          </h2>
          <div className="space-y-3.5 max-h-[400px] overflow-y-auto pr-1">
            {auctionValues.map((p, idx) => (
              <div 
                key={p.player_id}
                className="flex items-center justify-between p-4 bg-slate-900/40 border border-slate-800/40 rounded-xl"
              >
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-slate-200">{p.name}</p>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">{p.role} &bull; {p.age} years old</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Estimated Value</p>
                  <p className="text-base font-black text-emerald-400">{p.formatted_predicted_value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Injury Simulator */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-900 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full filter blur-3xl -z-10"></div>
        
        <h2 className="text-xl font-bold text-slate-200 mb-6 flex items-center">
          <Heart className="w-5 h-5 text-red-500 mr-2 animate-pulse" />
          Injury Impact Simulator
        </h2>
        
        <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">Sidelined Player</label>
            <select
              value={selectedPlayerId}
              onChange={(e) => setSelectedPlayerId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-slate-200 focus:outline-none focus:border-emerald-500 transition"
            >
              {auctionValues.map(p => (
                <option key={p.player_id} value={p.player_id}>{p.name} ({p.role})</option>
              ))}
            </select>
          </div>
          <button
            onClick={runInjurySimulation}
            disabled={simulating}
            className="bg-red-500 hover:bg-red-400 text-slate-950 font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-red-500/10 transition active:scale-[0.98] shrink-0"
          >
            {simulating ? 'Simulating...' : 'Run Simulation Report'}
          </button>
        </div>

        {/* Simulator Output */}
        {injuryReport && (
          <div className="mt-6 p-5 bg-red-950/10 border border-red-500/20 rounded-xl space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-base font-extrabold text-red-400">{injuryReport.player_name} Sidelined</h4>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-0.5">{injuryReport.role} &bull; Simulated Outage</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">Team Strength drop</span>
                <span className="text-xl font-black text-red-400">-{injuryReport.impact_score_reduction_percent}%</span>
              </div>
            </div>
            
            <p className="text-sm text-slate-300 leading-relaxed">
              {injuryReport.simulation_report}
            </p>
            
            <div className="pt-3 border-t border-red-900/30 text-xs text-slate-400">
              Estimated Recovery Duration: <strong className="text-red-400">{injuryReport.recovery_estimate_days} days</strong>.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
