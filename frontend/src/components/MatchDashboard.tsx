import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { Calendar, Info, Award, User, Layers, TrendingUp } from 'lucide-react';

interface MatchDashboardProps {
  backendUrl: string;
}

export const MatchDashboard: React.FC<MatchDashboardProps> = ({ backendUrl }) => {
  const [matches, setMatches] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [matchDetails, setMatchDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/matches`);
        const data = await response.json();
        setMatches(data);
        if (data.length > 0) {
          setSelectedId(data[0].match_id);
        }
      } catch (err) {
        console.error("Match list fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [backendUrl]);

  useEffect(() => {
    if (!selectedId) return;
    const fetchMatchDetails = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/matches/${selectedId}`);
        const data = await response.json();
        setMatchDetails(data);
      } catch (err) {
        console.error("Match detail fetch error", err);
      }
    };
    fetchMatchDetails();
  }, [selectedId, backendUrl]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!matchDetails) {
    return (
      <div className="text-center py-10 text-slate-400">
        No matches summaries available.
      </div>
    );
  }

  const { opponent_a, opponent_b, venue, match_type, summary, scorecard, partnerships, manhattan_data, insights } = matchDetails;

  // Prepare Manhattan over-by-over chart data
  const manhattanChartData = manhattan_data?.overs?.map((over: number, idx: number) => ({
    over: over,
    [opponent_a]: manhattan_data.team_a_runs?.[idx] || 0,
    [opponent_b]: manhattan_data.team_b_runs?.[idx] || 0
  })) || [];

  // Prepare Worm cumulative run rate chart data
  let teamACum = 0;
  let teamBCum = 0;
  const wormChartData = manhattan_data?.overs?.map((over: number, idx: number) => {
    teamACum += manhattan_data.team_a_runs?.[idx] || 0;
    teamBCum += manhattan_data.team_b_runs?.[idx] || 0;
    return {
      over: over,
      [opponent_a]: teamACum,
      [opponent_b]: teamBCum
    };
  }) || [];

  return (
    <div className="space-y-8">
      {/* Title block with selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent">
            Match Center
          </h1>
          <p className="text-slate-400 mt-1">Over-by-over charts, scorecard summaries, partnerships, and AI highlights.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 shrink-0">Match Log:</label>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl text-sm py-2.5 px-4 text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            {matches.map(m => (
              <option key={m.match_id} value={m.match_id}>{m.opponent_a} vs {m.opponent_b} ({m.match_type})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Scorecard Widget */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-900 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full filter blur-3xl -z-10"></div>
        <div className="flex flex-col sm:flex-row items-center justify-between text-center sm:text-left">
          
          {/* Team A */}
          <div className="space-y-1 mb-4 sm:mb-0">
            <h2 className="text-2xl font-black text-slate-100 tracking-tight">{opponent_a}</h2>
            <p className="text-3xl font-black text-emerald-400">
              {scorecard?.team_a?.runs}/{scorecard?.team_a?.wickets}
              <span className="text-xs text-slate-400 font-medium ml-1.5">({scorecard?.team_a?.overs} ov)</span>
            </p>
          </div>

          {/* VS Divider */}
          <div className="px-6 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-400 tracking-widest uppercase my-2 sm:my-0">
            VS
          </div>

          {/* Team B */}
          <div className="space-y-1 text-center sm:text-right">
            <h2 className="text-2xl font-black text-slate-100 tracking-tight">{opponent_b}</h2>
            <p className="text-3xl font-black text-blue-400">
              {scorecard?.team_b?.runs}/{scorecard?.team_b?.wickets}
              <span className="text-xs text-slate-400 font-medium ml-1.5">({scorecard?.team_b?.overs} ov)</span>
            </p>
          </div>
        </div>

        {/* Venue and Summary */}
        <div className="mt-6 pt-5 border-t border-slate-850 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <div className="flex items-center">
            <Calendar className="w-4.5 h-4.5 text-slate-500 mr-2" />
            <span>Venue: <strong className="text-slate-300">{venue}</strong></span>
          </div>
          <div className="flex items-center">
            <Info className="w-4.5 h-4.5 text-emerald-400 mr-2" />
            <span>Result: <strong className="text-emerald-400">{summary}</strong></span>
          </div>
        </div>
      </div>

      {/* Manhattan & Worm Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Manhattan Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-900 shadow-xl">
          <h3 className="text-lg font-bold text-slate-200 mb-6 flex items-center">
            <Layers className="w-5 h-5 text-emerald-400 mr-2" />
            Manhattan Chart (Runs Per Over)
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={manhattanChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                <XAxis dataKey="over" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }}
                  labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey={opponent_a} fill="#10b981" radius={[3, 3, 0, 0]} />
                <Bar dataKey={opponent_b} fill="#3b82f6" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Worm Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-900 shadow-xl">
          <h3 className="text-lg font-bold text-slate-200 mb-6 flex items-center">
            <TrendingUp className="w-5 h-5 text-blue-400 mr-2" />
            Worm Graph (Cumulative Run Rate)
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={wormChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                <XAxis dataKey="over" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }}
                  labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey={opponent_a} stroke="#10b981" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey={opponent_b} stroke="#3b82f6" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Partnerships & AI Highlights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Partnerships */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-900 shadow-xl">
          <h3 className="text-lg font-bold text-slate-200 mb-6 flex items-center">
            <User className="w-5 h-5 text-purple-400 mr-2" />
            Key Partnerships
          </h3>
          <div className="space-y-4">
            {partnerships && partnerships.map((partner: any, idx: number) => (
              <div key={idx} className="space-y-2 p-4 bg-slate-900/40 border border-slate-800/40 rounded-xl">
                <div className="flex justify-between text-xs text-slate-400">
                  <span className="font-semibold">{partner.batter_1} & {partner.batter_2}</span>
                  <span className="font-bold text-emerald-400">{partner.runs} runs ({partner.balls} balls)</span>
                </div>
                {/* Horizontal Progress Bar */}
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full" 
                    style={{ width: `${Math.min(100, (partner.runs / 150) * 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Dynamic Highlights */}
        {insights && (
          <div className="glass-panel p-6 rounded-2xl border border-slate-900 shadow-xl">
            <h3 className="text-lg font-bold text-slate-200 mb-6 flex items-center">
              <Award className="w-5 h-5 text-accent-gold mr-2" />
              AI Match Insights & Highlights
            </h3>
            <div className="grid grid-cols-1 gap-4 text-sm">
              <div className="p-4 bg-slate-900/40 border border-slate-800/40 rounded-xl flex items-start space-x-3.5">
                <span className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg"><User className="w-5 h-5" /></span>
                <div>
                  <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Top Performing Batter</p>
                  <p className="text-slate-200 font-bold mt-0.5">{insights.best_batter}</p>
                </div>
              </div>

              <div className="p-4 bg-slate-900/40 border border-slate-800/40 rounded-xl flex items-start space-x-3.5">
                <span className="p-2 bg-blue-500/10 text-blue-400 rounded-lg"><User className="w-5 h-5" /></span>
                <div>
                  <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Top Performing Bowler</p>
                  <p className="text-slate-200 font-bold mt-0.5">{insights.best_bowler}</p>
                </div>
              </div>

              <div className="p-4 bg-slate-900/40 border border-slate-800/40 rounded-xl flex items-start space-x-3.5">
                <span className="p-2 bg-purple-500/10 text-purple-400 rounded-lg"><Award className="w-5 h-5" /></span>
                <div>
                  <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Match Impact Player</p>
                  <p className="text-slate-200 font-bold mt-0.5">{insights.impact_player}</p>
                </div>
              </div>

              <div className="p-4 bg-slate-900/40 border border-slate-800/40 rounded-xl flex items-start space-x-3.5">
                <span className="p-2 bg-amber-500/10 text-amber-400 rounded-lg"><Info className="w-5 h-5" /></span>
                <div>
                  <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Tactical Turning Point</p>
                  <p className="text-slate-300 mt-0.5 leading-relaxed">{insights.turning_point}</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
