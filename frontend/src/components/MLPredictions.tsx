import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceArea } from 'recharts';
import { BrainCircuit, Cpu, ShieldAlert, Award, Star, Info, TrendingUp, Compass } from 'lucide-react';

interface MLPredictionsProps {
  backendUrl: string;
}

export const MLPredictions: React.FC<MLPredictionsProps> = ({ backendUrl }) => {
  const [players, setPlayers] = useState<any[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>('');
  const [selectedAlgo, setSelectedAlgo] = useState<string>('lstm');
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loadingPlayers, setLoadingPlayers] = useState(true);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/players`);
        const data = await response.json();
        setPlayers(data);
        if (data.length > 0) {
          setSelectedPlayerId(data[0].id);
        }
      } catch (err) {
        console.error("Player list fetch error", err);
      } finally {
        setLoadingPlayers(false);
      }
    };
    fetchPlayers();
  }, [backendUrl]);

  useEffect(() => {
    if (!selectedPlayerId) return;
    const fetchPrediction = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${backendUrl}/api/predictions?player_id=${selectedPlayerId}&algorithm=${selectedAlgo}`);
        const data = await response.json();
        setPrediction(data.predictions);
      } catch (err) {
        console.error("Prediction fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrediction();
  }, [selectedPlayerId, selectedAlgo, backendUrl]);

  if (loadingPlayers) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-emerald-500"></div>
      </div>
    );
  }

  // Generate Recharts forecast data
  const forecastData = prediction?.forecast_trend?.map((runs: number, idx: number) => ({
    match: `Match +${idx + 1}`,
    runs: runs,
    // Add upper/lower bounds based on interval
    upperBound: runs + (prediction?.confidence_interval?.max_runs - prediction?.expected_runs) * 0.5,
    lowerBound: Math.max(0, runs - (prediction?.expected_runs - prediction?.confidence_interval?.min_runs) * 0.5)
  })) || [];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent">
          AI Performance Predictor
        </h1>
        <p className="text-slate-400 mt-1">Machine Learning predictions for player scores, strike rates, wickets, and form trends.</p>
      </div>

      {/* Control Panel (Selectors) */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-900 shadow-lg grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">Select Player</label>
          <select
            value={selectedPlayerId}
            onChange={(e) => setSelectedPlayerId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-slate-200 focus:outline-none focus:border-emerald-500 transition"
          >
            {players.map(p => (
              <option key={p.id} value={p.id}>{p.name} ({p.role})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">Select Forecasting Algorithm</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: 'linear_regression', name: 'Linear Reg', desc: 'Slope OLS' },
              { id: 'random_forest', name: 'Rnd Forest', desc: 'Ensemble' },
              { id: 'xgboost', name: 'XGBoost', desc: 'Gradient' },
              { id: 'lstm', name: 'LSTM RNN', desc: 'Sequence' }
            ].map(algo => (
              <button
                key={algo.id}
                onClick={() => setSelectedAlgo(algo.id)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition ${
                  selectedAlgo === algo.id
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-md shadow-emerald-500/5'
                    : 'bg-slate-900/30 border-slate-800 text-slate-500 hover:text-slate-300'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wide">{algo.name}</span>
                <span className="text-[8px] text-slate-500 mt-0.5">{algo.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-emerald-500"></div>
        </div>
      ) : prediction ? (
        <div className="space-y-6">
          
          {/* Main Results Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Predictions Summary Card */}
            <div className="lg:col-span-3 glass-panel p-6 rounded-2xl border border-slate-900 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full filter blur-3xl -z-10"></div>
              <h2 className="text-xl font-bold text-slate-200 mb-6 flex items-center">
                <BrainCircuit className="w-5 h-5 text-emerald-400 mr-2" />
                Model Inference Results
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/40">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Expected Runs</p>
                  <p className="text-3xl font-black text-emerald-400 mt-2">{prediction.expected_runs}</p>
                  <p className="text-[10px] text-slate-400 mt-1">Range: {prediction.confidence_interval?.min_runs} - {prediction.confidence_interval?.max_runs}</p>
                </div>

                <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/40">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Expected Wickets</p>
                  <p className="text-3xl font-black text-blue-400 mt-2">{prediction.expected_wickets}</p>
                  <p className="text-[10px] text-slate-400 mt-1">Target Match Estimate</p>
                </div>

                <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/40">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Expected Strike Rate</p>
                  <p className="text-3xl font-black text-amber-400 mt-2">{prediction.expected_strike_rate}</p>
                  <p className="text-[10px] text-slate-400 mt-1">Runs/100 Balls</p>
                </div>

                <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/40">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Form Forecast</p>
                  <p className={`text-2xl font-black mt-2 uppercase tracking-wide ${
                    prediction.form_prediction === 'Hot' ? 'text-accent-neon' : prediction.form_prediction === 'Poor' ? 'text-red-400' : 'text-slate-300'
                  }`}>
                    {prediction.form_prediction} Form
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">Recent Game Trajectory</p>
                </div>
              </div>

              {/* Algorithm Description */}
              <div className="mt-6 p-4 bg-slate-900/30 rounded-xl border border-slate-850 flex items-start space-x-3 text-xs text-slate-400 leading-relaxed">
                <Cpu className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-300 capitalize">{selectedAlgo.replace("_", " ")}: </span>
                  {selectedAlgo === 'lstm' && "Sequence LSTM models capture recurring match cycles and momentum gates, assigning higher weights to recent games to map out form fluctuations."}
                  {selectedAlgo === 'xgboost' && "Gradient Boosting models fit error residuals in steps, resulting in high learning accuracies for erratic scoring trends."}
                  {selectedAlgo === 'random_forest' && "Random Forest aggregates bootstrap samples of match statistics to minimize variance, creating a stable baseline."}
                  {selectedAlgo === 'linear_regression' && "Linear Regression calculates least squares slope fitting, mapping out long-term upward or downward career directions."}
                </div>
              </div>
            </div>

            {/* Confidence circular gauge */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-900 shadow-xl flex flex-col items-center justify-center text-center">
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-4">Prediction Confidence</p>
              
              <div className="relative w-32 h-32 flex items-center justify-center">
                {/* SVG Circle */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="52"
                    stroke="#1e293b"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="52"
                    stroke="#10b981"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={326.7}
                    strokeDashoffset={326.7 - (326.7 * prediction.confidence_score) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-black text-slate-100">{prediction.confidence_score}%</span>
                  <span className="text-[8px] uppercase tracking-widest text-slate-400 mt-0.5">Reliability</span>
                </div>
              </div>
              
              <p className="text-[10px] text-slate-500 mt-4 leading-normal">
                Confidence is calculated based on historical statistical standard deviation and data density.
              </p>
            </div>
            
          </div>

          {/* Forecast Trends Line chart */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-900 shadow-xl">
            <h3 className="text-lg font-bold text-slate-200 mb-6 flex items-center">
              <TrendingUp className="w-5 h-5 text-emerald-400 mr-2" />
              5-Match Forecast Trend & Confidence Intervals
            </h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                  <XAxis dataKey="match" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }}
                    labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
                  />
                  <Line type="monotone" dataKey="runs" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} name="Expected Runs" />
                  <Line type="monotone" dataKey="upperBound" stroke="#10b981" strokeWidth={1} strokeDasharray="4" dot={false} name="Upper Boundary" />
                  <Line type="monotone" dataKey="lowerBound" stroke="#10b981" strokeWidth={1} strokeDasharray="4" dot={false} name="Lower Boundary" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      ) : null}
    </div>
  );
};
