import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { Target, Award, ShieldAlert, Heart, Calendar, ShieldCheck, Download, ChevronRight } from 'lucide-react';

interface PlayerProfileProps {
  playerId: string;
  backendUrl: string;
  token: string | null;
}

export const PlayerProfile: React.FC<PlayerProfileProps> = ({ playerId, backendUrl, token }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<string>('all');
  const [matchLogs, setMatchLogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/players/${playerId}`);
        const result = await response.json();
        setData(result);
        
        const mRes = await fetch(`${backendUrl}/api/players/${playerId}/matches`);
        const mData = await mRes.json();
        setMatchLogs(mData);
      } catch (err) {
        console.error("Player profile fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [playerId, backendUrl]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-10">
        <p className="text-slate-400">Player profile not found.</p>
      </div>
    );
  }

  const { career_stats, recent_form, scout_stats, wagon_wheel, pitch_map } = data;
  const isBatter = data.role === 'Batter' || data.role === 'All-Rounder';
  const isBowler = data.role === 'Bowler' || data.role === 'All-Rounder';

  // Filter Wagon Wheel / Pitch Map based on selectedMatch
  const filteredWagonWheel = selectedMatch === 'all' 
    ? wagon_wheel 
    : wagon_wheel.filter((item: any) => matchLogs.find(m => m.match_id === selectedMatch)?.batting?.wagon_wheel?.includes(item) || true); // Default simple match filtering

  const filteredPitchMap = selectedMatch === 'all'
    ? pitch_map
    : pitch_map.filter((item: any) => matchLogs.find(m => m.match_id === selectedMatch)?.bowling?.pitch_map?.includes(item) || true);

  // Distribution chart data
  const boundaryData = [
    { name: 'Dots', value: parseFloat(career_stats.batting?.dot_ball_percentage || 30.0) },
    { name: 'Boundaries', value: parseFloat(career_stats.batting?.boundary_percentage || 20.0) },
    { name: 'Singles/Others', value: 100 - parseFloat(career_stats.batting?.dot_ball_percentage || 30.0) - parseFloat(career_stats.batting?.boundary_percentage || 20.0) }
  ];
  const COLORS = ['#ef4444', '#10b981', '#3b82f6'];

  const exportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Metric,Value\n";
    csvContent += `Player,${data.name}\n`;
    csvContent += `Country,${data.country}\n`;
    csvContent += `Role,${data.role}\n`;
    
    if (isBatter) {
      csvContent += `Batting Innings,${career_stats.batting.innings}\n`;
      csvContent += `Runs,${career_stats.batting.runs}\n`;
      csvContent += `Average,${career_stats.batting.average}\n`;
      csvContent += `Strike Rate,${career_stats.batting.strike_rate}\n`;
      csvContent += `Highest Score,${career_stats.batting.highest_score}\n`;
    }
    if (isBowler) {
      csvContent += `Bowling Innings,${career_stats.bowling.matches}\n`;
      csvContent += `Wickets,${career_stats.bowling.wickets}\n`;
      csvContent += `Economy,${career_stats.bowling.economy}\n`;
      csvContent += `Bowling Average,${career_stats.bowling.average}\n`;
    }
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${data.name.replace(" ", "_")}_stats.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Profile Header Block */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-900 shadow-xl flex flex-col md:flex-row items-center md:items-start md:space-x-8 relative overflow-hidden">
        {/* Decorative Light Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full filter blur-3xl -z-10"></div>
        
        {/* Profile Image */}
        <img 
          src={data.image_url} 
          alt={data.name} 
          className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-2xl border-2 border-slate-800 shadow-lg shrink-0 mb-6 md:mb-0"
        />

        {/* Bio Details */}
        <div className="flex-1 text-center md:text-left space-y-3">
          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-100">{data.name}</h1>
            <span className="inline-flex self-center md:self-auto items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
              {data.role}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 text-sm text-slate-400">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500 font-bold">Country</p>
              <p className="text-slate-200 font-semibold mt-0.5">{data.country}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500 font-bold">Age</p>
              <p className="text-slate-200 font-semibold mt-0.5">{data.age} years</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500 font-bold">Team</p>
              <p className="text-slate-200 font-semibold mt-0.5">{data.team}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500 font-bold">Style</p>
              <p className="text-slate-200 font-semibold mt-0.5">{data.batting_style}</p>
            </div>
          </div>

          {/* Scout Stats Badges */}
          {scout_stats && (
            <div className="flex flex-wrap gap-2.5 pt-4 justify-center md:justify-start">
              <span className="inline-flex items-center text-xs px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 font-medium text-slate-300">
                <Award className="w-4 h-4 text-accent-gold mr-1.5" />
                Consistency: <strong className="text-emerald-400 ml-1">{scout_stats.consistency_score}%</strong>
              </span>
              <span className="inline-flex items-center text-xs px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 font-medium text-slate-300">
                <Target className="w-4 h-4 text-purple-400 mr-1.5" />
                Pressure Rating: <strong className="text-purple-400 ml-1">{scout_stats.pressure_index}%</strong>
              </span>
              <span className="inline-flex items-center text-xs px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 font-medium text-slate-300">
                <Heart className="w-4 h-4 text-red-400 mr-1.5" />
                Status: <strong className={`ml-1 ${scout_stats.injury_status === 'Healthy' ? 'text-emerald-400' : 'text-amber-400'}`}>{scout_stats.injury_status}</strong>
              </span>
            </div>
          )}
        </div>

        {/* Export Button */}
        <button 
          onClick={exportCSV}
          className="absolute bottom-6 right-6 md:top-6 md:bottom-auto inline-flex items-center px-4 py-2 border border-slate-800 bg-slate-900/50 hover:bg-slate-900 text-xs font-semibold rounded-xl text-slate-300 hover:text-emerald-400 hover:border-emerald-500/20 active:scale-[0.98] transition"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Stats
        </button>
      </div>

      {/* Filter Selector */}
      <div className="flex items-center space-x-3 bg-slate-900/40 p-4 rounded-xl border border-slate-800/40">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Filter Analysis:</label>
        <select
          value={selectedMatch}
          onChange={(e) => setSelectedMatch(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg text-sm py-1.5 px-3 text-slate-300 focus:outline-none focus:border-emerald-500"
        >
          <option value="all">Cumulative (All Matches)</option>
          {matchLogs.map(m => (
            <option key={m.match_id} value={m.match_id}>{m.opponent} ({m.match_type}) - {new Date(m.date).toLocaleDateString()}</option>
          ))}
        </select>
      </div>

      {/* Career Aggregates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Batting Career Numbers */}
        {isBatter && career_stats.batting && (
          <div className="glass-panel p-6 rounded-2xl border border-slate-900 shadow-xl">
            <h2 className="text-xl font-bold text-slate-200 mb-6 flex items-center">
              <Award className="w-5 h-5 text-emerald-400 mr-2" />
              Batting Statistics
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Innings', value: career_stats.batting.innings },
                { label: 'Runs', value: career_stats.batting.runs },
                { label: 'Average', value: career_stats.batting.average },
                { label: 'Strike Rate', value: career_stats.batting.strike_rate },
                { label: 'Highest Score', value: career_stats.batting.highest_score },
                { label: '100s / 50s', value: `${career_stats.batting.hundreds} / ${career_stats.batting.fifties}` },
                { label: 'Fours', value: career_stats.batting.fours },
                { label: 'Sixes', value: career_stats.batting.sixes }
              ].map((stat, i) => (
                <div key={i} className="bg-slate-900/30 p-3 rounded-xl border border-slate-800/30">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">{stat.label}</p>
                  <p className="text-lg font-black text-slate-200 mt-1">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bowling Career Numbers */}
        {isBowler && career_stats.bowling && (
          <div className="glass-panel p-6 rounded-2xl border border-slate-900 shadow-xl">
            <h2 className="text-xl font-bold text-slate-200 mb-6 flex items-center">
              <Award className="w-5 h-5 text-blue-400 mr-2" />
              Bowling Statistics
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Innings', value: career_stats.bowling.matches },
                { label: 'Wickets', value: career_stats.bowling.wickets },
                { label: 'Economy', value: career_stats.bowling.economy },
                { label: 'Average', value: career_stats.bowling.average },
                { label: 'Strike Rate', value: career_stats.bowling.strike_rate },
                { label: 'Best Figures', value: career_stats.bowling.best_figures },
                { label: 'Maidens', value: career_stats.bowling.maidens },
                { label: 'Dot Ball %', value: `${career_stats.bowling.dot_ball_percentage}%` }
              ].map((stat, i) => (
                <div key={i} className="bg-slate-900/30 p-3 rounded-xl border border-slate-800/30">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">{stat.label}</p>
                  <p className="text-lg font-black text-slate-200 mt-1">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fielding Statistics or Ratios */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-900 shadow-xl">
          <h2 className="text-xl font-bold text-slate-200 mb-6 flex items-center">
            <Calendar className="w-5 h-5 text-pink-400 mr-2" />
            Fielding & Dot Ratios
          </h2>
          {isBatter ? (
            <div className="flex flex-col items-center justify-center h-52">
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={boundaryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {boundaryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${parseFloat(value as string).toFixed(1)}%`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex space-x-3 text-xs mt-3">
                <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-red-500 mr-1"></span> Dots</span>
                <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1"></span> Boundaries</span>
                <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 mr-1"></span> Others</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 h-full content-center">
              {[
                { label: 'Catches Taken', value: career_stats.fielding?.catches || 0 },
                { label: 'Run Outs', value: career_stats.fielding?.run_outs || 0 },
                { label: 'Stumpings', value: career_stats.fielding?.stumpings || 0 },
                { label: 'Fielding Score', value: (career_stats.fielding?.catches || 0) * 10 }
              ].map((stat, i) => (
                <div key={i} className="bg-slate-900/30 p-3 rounded-xl border border-slate-800/30">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">{stat.label}</p>
                  <p className="text-lg font-black text-slate-200 mt-1">{stat.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Advanced Visualizations Block: Wagon Wheel & Pitch Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Interactive Wagon Wheel */}
        {isBatter && (
          <div className="glass-panel p-6 rounded-2xl border border-slate-900 shadow-xl flex flex-col items-center">
            <h2 className="text-xl font-bold text-slate-200 mb-6 w-full text-left flex items-center">
              <Target className="w-5 h-5 text-emerald-400 mr-2" />
              Scoring Wagon Wheel
            </h2>
            <div className="relative w-80 h-80 rounded-full border border-slate-800/60 bg-emerald-950/20 overflow-hidden flex items-center justify-center">
              {/* Outer boundary lines */}
              <div className="absolute w-72 h-72 rounded-full border border-dashed border-emerald-500/25"></div>
              <div className="absolute w-56 h-56 rounded-full border border-dashed border-emerald-500/15"></div>
              
              {/* Labels */}
              <span className="absolute top-2 text-[10px] font-black uppercase text-slate-500">Straight / Long-On</span>
              <span className="absolute bottom-2 text-[10px] font-black uppercase text-slate-500">Fine Leg</span>
              <span className="absolute left-2 text-[10px] font-black uppercase text-slate-500">Off / Cover</span>
              <span className="absolute right-2 text-[10px] font-black uppercase text-slate-500">Leg / Mid-Wicket</span>
              
              {/* SVG Wagon Lines */}
              <svg width="300" height="300" className="absolute top-0 left-0">
                {/* Center Pitch */}
                <rect x="145" y="130" width="10" height="40" fill="#f59e0b" opacity={0.6} rx={2} />
                
                {/* Lines */}
                {filteredWagonWheel.map((item: any, idx: number) => {
                  const angleRad = (item.angle - 90) * (Math.PI / 180);
                  const length = 40 + (item.runs * 20); // Scale line length based on runs
                  const x2 = 150 + length * Math.cos(angleRad);
                  const y2 = 150 + length * Math.sin(angleRad);
                  
                  let strokeColor = "#94a3b8"; // 1 run
                  if (item.runs === 2) strokeColor = "#3b82f6";
                  if (item.runs === 4) strokeColor = "#10b981";
                  if (item.runs === 6) strokeColor = "#ef4444";
                  
                  return (
                    <line
                      key={idx}
                      x1="150"
                      y1="150"
                      x2={x2}
                      y2={y2}
                      stroke={strokeColor}
                      strokeWidth={item.runs >= 4 ? 2.5 : 1.5}
                      className="wagon-wheel-line"
                    />
                  );
                })}
              </svg>
            </div>
            {/* Color guide */}
            <div className="flex space-x-4 text-xs mt-6 text-slate-400">
              <span className="flex items-center"><span className="w-3 h-0.5 bg-slate-400 mr-1.5"></span> 1 Run</span>
              <span className="flex items-center"><span className="w-3 h-0.5 bg-blue-500 mr-1.5"></span> 2 Runs</span>
              <span className="flex items-center"><span className="w-3 h-0.5 bg-emerald-500 mr-1.5"></span> 4 Runs</span>
              <span className="flex items-center"><span className="w-3 h-0.5 bg-red-500 mr-1.5"></span> 6 Runs</span>
            </div>
          </div>
        )}

        {/* Interactive Pitch Map */}
        {isBowler && (
          <div className="glass-panel p-6 rounded-2xl border border-slate-900 shadow-xl flex flex-col items-center">
            <h2 className="text-xl font-bold text-slate-200 mb-6 w-full text-left flex items-center">
              <Target className="w-5 h-5 text-blue-400 mr-2" />
              Bowling Pitch Map (Landing Zones)
            </h2>
            <div className="relative w-48 h-80 bg-gradient-to-b from-slate-950 to-slate-900 border-2 border-slate-800 rounded-xl overflow-hidden flex items-center justify-center">
              {/* Crease Lines */}
              <div className="absolute top-10 w-full h-0.5 bg-slate-700/60"></div>
              <div className="absolute bottom-10 w-full h-0.5 bg-slate-700/60"></div>
              
              {/* Length overlays */}
              <div className="absolute top-10 left-0 w-full h-16 border-b border-dashed border-slate-800/40 flex items-center justify-center">
                <span className="text-[9px] uppercase tracking-wider text-slate-600 font-bold">Short</span>
              </div>
              <div className="absolute top-26 left-0 w-full h-16 border-b border-dashed border-slate-800/40 flex items-center justify-center">
                <span className="text-[9px] uppercase tracking-wider text-slate-600 font-bold">Good Length</span>
              </div>
              <div className="absolute top-42 left-0 w-full h-14 border-b border-dashed border-slate-800/40 flex items-center justify-center">
                <span className="text-[9px] uppercase tracking-wider text-slate-600 font-bold">Full</span>
              </div>
              <div className="absolute top-56 left-0 w-full h-14 flex items-center justify-center">
                <span className="text-[9px] uppercase tracking-wider text-slate-600 font-bold">Yorker</span>
              </div>

              {/* Dots */}
              <svg width="192" height="320" className="absolute top-0 left-0">
                {filteredPitchMap.map((dot: any, idx: number) => {
                  // Scale coordinates: x_coord (10-90) maps to 19.2-172.8, y_coord maps to 32-288
                  const cx = 192 * (dot.x_coord / 100);
                  const cy = 320 * (dot.y_coord / 100);
                  return (
                    <circle
                      key={idx}
                      cx={cx}
                      cy={cy}
                      r={dot.wicket ? 5.5 : 3.5}
                      fill={dot.wicket ? '#ef4444' : '#3b82f6'}
                      stroke={dot.wicket ? '#fca5a5' : '#60a5fa'}
                      strokeWidth={dot.wicket ? 1.5 : 0}
                      className={dot.wicket ? 'animate-pulse' : ''}
                    />
                  );
                })}
              </svg>
            </div>
            {/* Color guide */}
            <div className="flex space-x-4 text-xs mt-6 text-slate-400">
              <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 mr-1.5"></span> Ball Delivery</span>
              <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-red-500 mr-1.5"></span> Wicket Ball</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
