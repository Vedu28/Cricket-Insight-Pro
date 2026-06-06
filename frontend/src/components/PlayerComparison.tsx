import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { GitCompare, Plus, ShieldAlert, Award, Star } from 'lucide-react';

interface PlayerComparisonProps {
  backendUrl: string;
}

export const PlayerComparison: React.FC<PlayerComparisonProps> = ({ backendUrl }) => {
  const [players, setPlayers] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [comparisonData, setComparisonData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/players`);
        const data = await response.json();
        setPlayers(data);
        if (data.length >= 2) {
          // Pre-select first two players for instant comparison
          setSelectedIds([data[0].id, data[1].id]);
        }
      } catch (err) {
        console.error("Comparison player list fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, [backendUrl]);

  useEffect(() => {
    const fetchComparisonProfiles = async () => {
      if (selectedIds.length === 0) return;
      try {
        const promises = selectedIds.map(id => fetch(`${backendUrl}/api/players/${id}`).then(r => r.json()));
        const results = await Promise.all(promises);
        setComparisonData(results);
      } catch (err) {
        console.error("Comparison profile fetch error", err);
      }
    };
    fetchComparisonProfiles();
  }, [selectedIds, backendUrl]);

  const handleTogglePlayer = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length <= 1) return; // Keep at least one selected
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      if (selectedIds.length >= 4) return; // Limit to max 4 players comparison
      setSelectedIds([...selectedIds, id]);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-emerald-500"></div>
      </div>
    );
  }

  // Prepare Radar Chart Data
  // Radar needs: { subject: 'runs', player1: 80, player2: 90 }
  const radarData: Record<string, any>[] = [
    { subject: 'Consistency' },
    { subject: 'Pressure Play' },
    { subject: 'Chase Score' },
    { subject: 'Powerplay' },
    { subject: 'Death Overs' }
  ];

  comparisonData.forEach((player, pIdx) => {
    const stats = player.scout_stats || {};
    radarData[0][`val_${pIdx}`] = stats.consistency_score || 70;
    radarData[1][`val_${pIdx}`] = stats.pressure_index || 70;
    radarData[2][`val_${pIdx}`] = stats.chase_score || 70;
    radarData[3][`val_${pIdx}`] = stats.powerplay_eff || 70;
    radarData[4][`val_${pIdx}`] = stats.death_overs_eff || 70;
  });

  const radarColors = ['#10b981', '#3b82f6', '#fbbf24', '#ec4899'];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent">
          Comparison Hub
        </h1>
        <p className="text-slate-400 mt-1">Select and evaluate performance metrics for up to 4 players side-by-side.</p>
      </div>

      {/* Selector Checkbox Grid */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-900 shadow-lg">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center">
          <GitCompare className="w-4 h-4 mr-2" />
          Select Players to Compare:
        </h3>
        <div className="flex flex-wrap gap-3">
          {players.map((p) => {
            const isSelected = selectedIds.includes(p.id);
            return (
              <button
                key={p.id}
                onClick={() => handleTogglePlayer(p.id)}
                className={`inline-flex items-center px-4 py-2.5 rounded-xl border text-xs font-semibold tracking-wide transition ${
                  isSelected
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-md shadow-emerald-500/5'
                    : 'bg-slate-900/30 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {p.name}
                {isSelected && <span className="ml-2 w-2 h-2 rounded-full bg-emerald-400"></span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Radar Chart Evaluation */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-900 shadow-xl flex flex-col items-center">
          <h2 className="text-xl font-bold text-slate-200 mb-6 w-full text-left flex items-center">
            <Star className="w-5 h-5 text-accent-gold mr-2" />
            Attribute Ratings Radar
          </h2>
          <div className="h-80 w-full flex justify-center">
            {comparisonData.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="#1e293b" />
                  <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={11} />
                  <PolarRadiusAxis stroke="#64748b" fontSize={9} angle={30} domain={[0, 100]} />
                  {comparisonData.map((player, idx) => (
                    <Radar
                      key={player.id}
                      name={player.name}
                      dataKey={`val_${idx}`}
                      stroke={radarColors[idx]}
                      fill={radarColors[idx]}
                      fillOpacity={0.2}
                    />
                  ))}
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Career Side-by-Side Table */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-900 shadow-xl overflow-x-auto">
          <h2 className="text-xl font-bold text-slate-200 mb-6 flex items-center">
            <Award className="w-5 h-5 text-emerald-400 mr-2" />
            Career Metrics Comparison
          </h2>
          <table className="w-full text-sm text-left text-slate-400 border-collapse">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="py-3 font-semibold text-slate-500">Metric</th>
                {comparisonData.map((p, idx) => (
                  <th key={p.id} className="py-3 font-bold text-slate-200" style={{ color: radarColors[idx] }}>
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Role', path: 'role' },
                { label: 'Age', path: 'age' },
                { label: 'Batting Average', path: 'career_stats.batting.average', suffix: '' },
                { label: 'Strike Rate', path: 'career_stats.batting.strike_rate', suffix: '' },
                { label: 'Career Runs', path: 'career_stats.batting.runs', suffix: '' },
                { label: 'Wickets Taken', path: 'career_stats.bowling.wickets', suffix: '' },
                { label: 'Bowling Economy', path: 'career_stats.bowling.economy', suffix: '' },
                { label: 'Scouting Consistency', path: 'scout_stats.consistency_score', suffix: '%' },
                { label: 'Injury Status', path: 'scout_stats.injury_status', suffix: '' }
              ].map((row, i) => (
                <tr key={i} className="border-b border-slate-850 hover:bg-slate-900/10">
                  <td className="py-3.5 font-medium text-slate-400">{row.label}</td>
                  {comparisonData.map((p) => {
                    // Resolve nested properties
                    const parts = row.path.split('.');
                    let val = p;
                    for (const part of parts) {
                      val = val ? val[part] : null;
                    }
                    return (
                      <td key={p.id} className="py-3.5 font-bold text-slate-300">
                        {val !== undefined && val !== null ? `${val}${row.suffix}` : 'N/A'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Opponent Heatmap Summary Grid */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-900 shadow-xl">
        <h2 className="text-xl font-bold text-slate-200 mb-6 flex items-center">
          <GitCompare className="w-5 h-5 text-blue-400 mr-2" />
          Opponent-Wise Performance Heatmap (Batting Average)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center border-collapse">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="py-3 text-left font-semibold text-slate-500">Player</th>
                {['Australia', 'Pakistan', 'England', 'New Zealand', 'South Africa'].map((team) => (
                  <th key={team} className="py-3 font-semibold text-slate-400">{team}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((player) => {
                // Generate a simulated average vs team if they are a batter, or mock
                const role = player.role;
                const seedVal = player.name.length;
                return (
                  <tr key={player.id} className="border-b border-slate-850">
                    <td className="py-4 text-left font-bold text-slate-200">{player.name}</td>
                    {['Australia', 'Pakistan', 'England', 'New Zealand', 'South Africa'].map((team, idx) => {
                      // Calculate dynamic mock averages
                      let avgVal = 0;
                      if (role === 'Batter' || role === 'All-Rounder') {
                        avgVal = Math.round((seedVal * 2.5 + (idx * 5) + (idx % 2 === 0 ? 15 : -10)));
                      } else {
                        avgVal = Math.round(seedVal * 0.8 + (idx * 0.5));
                      }
                      
                      // Heatmap color shading
                      let bgClass = "bg-slate-900/50 text-slate-400";
                      if (role === 'Batter' || role === 'All-Rounder') {
                        if (avgVal >= 55) bgClass = "bg-emerald-950/80 border-emerald-900/40 text-emerald-300";
                        else if (avgVal >= 40) bgClass = "bg-emerald-900/30 border-emerald-900/10 text-emerald-400";
                        else if (avgVal >= 25) bgClass = "bg-yellow-950/30 border-yellow-900/10 text-yellow-400";
                        else bgClass = "bg-red-950/30 border-red-900/10 text-red-400";
                      } else {
                        // For bowlers, display econ/wickets
                        if (avgVal >= 15) bgClass = "bg-blue-950/80 border-blue-900/40 text-blue-300";
                        else bgClass = "bg-blue-900/30 border-blue-900/10 text-blue-400";
                      }
                      
                      return (
                        <td key={team} className="py-4">
                          <div className={`mx-auto w-16 py-1.5 rounded-lg border text-xs font-bold ${bgClass}`}>
                            {avgVal}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
