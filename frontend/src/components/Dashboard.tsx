import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, AreaChart, Area } from 'recharts';
import { Users, Calendar, Target, Flame, Activity, Star, ChevronRight, TrendingUp } from 'lucide-react';

interface DashboardProps {
  backendUrl: string;
  onSelectPlayer: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ backendUrl, onSelectPlayer }) => {
  const [players, setPlayers] = useState<any[]>([]);
  const [rankings, setRankings] = useState<any>({ batting: [], bowling: [] });
  const [loading, setLoading] = useState(true);
  const [rankTab, setRankTab] = useState<'batting' | 'bowling'>('batting');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pRes = await fetch(`${backendUrl}/api/players`);
        const pData = await pRes.json();
        setPlayers(pData);

        const rRes = await fetch(`${backendUrl}/api/scouting/rankings`);
        const rData = await rRes.json();
        setRankings(rData);
      } catch (err) {
        console.error("Dashboard data fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [backendUrl]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-emerald-500"></div>
      </div>
    );
  }

  // Calculate aggregates
  const totalPlayers = players.length;
  const totalMatches = 10; // Mocked historical base
  const totalRuns = players.reduce((sum, p) => sum + (p.total_runs || 0), 0);
  const totalWickets = players.reduce((sum, p) => sum + (p.total_wickets || 0), 0);
  const avgStrikeRate = (players.reduce((sum, p) => sum + (p.scout_stats?.powerplay_eff || 80.0), 0) / totalPlayers).toFixed(1);
  const avgEconomyRate = 7.4; // Base aggregate

  // Chart data preparing
  const distributionData = players.map(p => ({
    name: p.name.split(" ")[-1] || p.name,
    runs: p.total_runs || 0,
    wickets: p.total_wickets || 0,
    consistency: p.scout_stats?.consistency_score || 70.0
  }));

  const formTrendData = [
    { match: 'Match 1', Kohli: 82, Rohit: 28, Smith: 35 },
    { match: 'Match 2', Kohli: 54, Rohit: 86, Smith: 9 },
    { match: 'Match 3', Kohli: 12, Rohit: 0, Smith: 80 },
    { match: 'Match 4', Kohli: 101, Rohit: 15, Smith: 46 },
    { match: 'Match 5', Kohli: 77, Rohit: 121, Smith: 110 },
  ];

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent">
          Sports Analytics Hub
        </h1>
        <p className="text-slate-400 mt-1">Real-time performance metrics, team dashboards, and machine learning predictions.</p>
      </div>

      {/* Live Alerts / Notifications */}
      <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 p-4 rounded-2xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <p className="text-sm text-slate-300">
            <span className="font-semibold text-emerald-400">Form Alert:</span> Virat Kohli enters <span className="font-bold text-accent-neon uppercase">Hot Form</span> after hitting 117 & 49 in recent innings.
          </p>
        </div>
        <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider hidden sm:block">Update 2m ago</span>
      </div>

      {/* Aggregate Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Players', value: totalPlayers, icon: Users, color: 'text-blue-400' },
          { label: 'Matches Logged', value: totalMatches * 3, icon: Calendar, color: 'text-purple-400' },
          { label: 'Cumulative Runs', value: totalRuns, icon: Target, color: 'text-emerald-400' },
          { label: 'Total Wickets', value: totalWickets, icon: Activity, color: 'text-pink-400' },
          { label: 'Avg Strike Rate', value: `${avgStrikeRate}`, icon: Flame, color: 'text-amber-400' },
          { label: 'Avg Economy', value: `${avgEconomyRate}`, icon: TrendingUp, color: 'text-teal-400' }
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="glass-card p-5 rounded-2xl border border-slate-900 shadow-lg relative overflow-hidden">
              <div className="flex justify-between items-start">
                <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider leading-none">
                  {card.label}
                </span>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <p className="text-2xl font-black mt-3 text-slate-100 tracking-tight">{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Runs and Wickets Distributions */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-900 shadow-xl">
          <h2 className="text-xl font-bold text-slate-200 mb-6 flex items-center">
            <TrendingUp className="w-5 h-5 text-emerald-400 mr-2" />
            Runs & Wickets Distribution
          </h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis yAxisId="left" stroke="#10b981" fontSize={11} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }}
                  labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
                />
                <Bar yAxisId="left" dataKey="runs" fill="#10b981" radius={[6, 6, 0, 0]} barSize={24} name="Runs" />
                <Bar yAxisId="right" dataKey="wickets" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={24} name="Wickets" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leaderboards and Rankings */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-900 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-200 flex items-center">
                <Star className="w-5 h-5 text-accent-gold mr-2" />
                Leaderboards
              </h2>
              
              {/* Tab Selector */}
              <div className="flex space-x-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                <button
                  onClick={() => setRankTab('batting')}
                  className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-md transition ${
                    rankTab === 'batting' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  Batting
                </button>
                <button
                  onClick={() => setRankTab('bowling')}
                  className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-md transition ${
                    rankTab === 'bowling' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  Bowling
                </button>
              </div>
            </div>

            <div className="space-y-3.5">
              {rankTab === 'batting' && rankings.batting && rankings.batting.slice(0, 4).map((p: any, idx: number) => (
                <div 
                  key={p.player_id}
                  onClick={() => onSelectPlayer(p.player_id)}
                  className="flex items-center justify-between p-3.5 bg-slate-900/40 border border-slate-800/40 rounded-xl hover:border-emerald-500/30 cursor-pointer transition"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-slate-500 font-black text-sm w-4">{idx + 1}</span>
                    <div>
                      <p className="text-sm font-semibold text-slate-200">{p.name}</p>
                      <p className="text-[10px] text-slate-500 font-medium">{p.team}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-emerald-400">{p.runs} runs</p>
                    <p className="text-[10px] text-slate-400">Avg: {p.average}</p>
                  </div>
                </div>
              ))}

              {rankTab === 'bowling' && rankings.bowling && rankings.bowling.slice(0, 4).map((p: any, idx: number) => (
                <div 
                  key={p.player_id}
                  onClick={() => onSelectPlayer(p.player_id)}
                  className="flex items-center justify-between p-3.5 bg-slate-900/40 border border-slate-800/40 rounded-xl hover:border-emerald-500/30 cursor-pointer transition"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-slate-500 font-black text-sm w-4">{idx + 1}</span>
                    <div>
                      <p className="text-sm font-semibold text-slate-200">{p.name}</p>
                      <p className="text-[10px] text-slate-500 font-medium">{p.team}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-blue-400">{p.wickets} wkts</p>
                    <p className="text-[10px] text-slate-400">Econ: {p.economy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button 
            onClick={() => setRankTab(rankTab === 'batting' ? 'bowling' : 'batting')}
            className="mt-6 text-xs text-slate-500 hover:text-emerald-400 font-semibold uppercase tracking-wider flex items-center justify-center py-2 border border-dashed border-slate-800 rounded-xl hover:border-emerald-500/20 transition"
          >
            Toggle categories <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>

      {/* Advanced Performance Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top-3 Player Form Trend */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-900 shadow-xl">
          <h2 className="text-xl font-bold text-slate-200 mb-6 flex items-center">
            <Activity className="w-5 h-5 text-blue-400 mr-2" />
            Top Player Match Performance Trend (Last 5 Games)
          </h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                <XAxis dataKey="match" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }}
                  labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="Kohli" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} name="Virat Kohli" />
                <Line type="monotone" dataKey="Rohit" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} name="Rohit Sharma" />
                <Line type="monotone" dataKey="Smith" stroke="#fbbf24" strokeWidth={3} dot={{ r: 4 }} name="Steve Smith" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Consistency Area Card */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-900 shadow-xl">
          <h2 className="text-xl font-bold text-slate-200 mb-6 flex items-center">
            <Star className="w-5 h-5 text-purple-400 mr-2" />
            Overall Consistency Profile
          </h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={distributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCons" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.2} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }}
                  labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="consistency" stroke="#8b5cf6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCons)" name="Consistency Score (%)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
