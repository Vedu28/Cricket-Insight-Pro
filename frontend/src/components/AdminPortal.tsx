import React, { useState } from 'react';
import { Upload, FileSpreadsheet, Lock, AlertCircle, CheckCircle } from 'lucide-react';

interface AdminPortalProps {
  backendUrl: string;
  token: string | null;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ backendUrl, token }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError('');
      setSuccess('');
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || loading) return;

    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${backendUrl}/api/matches/upload-csv`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'File upload failed');

      setSuccess(`Dataset successfully uploaded! Inserted ${data.logs_inserted} match logs. Created ${data.players_created} new player profiles.`);
      setFile(null);
    } catch (err: any) {
      setError(err.message || 'Error uploading file. Check network logs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent">
          Administrative Operations
        </h1>
        <p className="text-slate-400 mt-1">Upload stats, seed match records, and manage database systems.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CSV Batch Upload panel */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-900 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full filter blur-3xl -z-10"></div>
          
          <h2 className="text-xl font-bold text-slate-200 mb-4 flex items-center">
            <Upload className="w-5 h-5 text-emerald-400 mr-2" />
            CSV Match Log Dataset Upload
          </h2>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            Upload match scorecard datasets containing player runs, wickets, dot ball frequencies, and JSON wagon wheel coordinate lists. This automatically trains predictions and rebuilds scout profiles.
          </p>

          {/* Notifications */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start space-x-3 text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start space-x-3 text-emerald-400 text-sm">
              <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleUpload} className="space-y-6">
            
            {/* File Dropzone */}
            <div className="border-2 border-dashed border-slate-800 rounded-2xl p-8 text-center bg-slate-900/10 hover:border-emerald-500/20 hover:bg-slate-900/20 transition cursor-pointer relative">
              <input 
                type="file" 
                accept=".csv"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center space-y-3">
                <FileSpreadsheet className="w-12 h-12 text-slate-500" />
                <div className="text-sm">
                  <p className="font-bold text-slate-300">
                    {file ? file.name : 'Click to select CSV spreadsheet'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {file ? `${(file.size / 1024).toFixed(1)} KB` : 'Spreadsheets up to 10MB accepted'}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={!file || loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-500/10 transition active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Uploading & Processing Dataset...' : 'Import Dataset'}
            </button>
          </form>
        </div>

        {/* Template Instructions */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-900 shadow-xl space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center">
            <Lock className="w-4 h-4 mr-2" />
            CSV Dataset Format Specifications:
          </h3>
          <p className="text-xs text-slate-400 leading-normal">
            For imports to process correctly, match log spreadsheets must match the following headers:
          </p>
          <ul className="text-[11px] text-slate-400 space-y-2.5 bg-slate-950 p-4 rounded-xl border border-slate-850">
            <li><code className="text-emerald-400">player_name</code>: Name string (e.g. Virat Kohli)</li>
            <li><code className="text-emerald-400">opponent</code>: Opponent country name (e.g. Australia)</li>
            <li><code className="text-emerald-400">runs_scored</code>, <code className="text-emerald-400">balls_faced</code>: Innings totals</li>
            <li><code className="text-emerald-400">is_out</code>: Boolean status (true/false)</li>
            <li><code className="text-emerald-400">wickets_taken</code>, <code className="text-emerald-400">overs_bowled</code>: Bowling metrics</li>
            <li><code className="text-emerald-400">wagon_wheel</code>: Angle JSON arrays</li>
            <li><code className="text-emerald-400">pitch_map</code>: Landing spot JSON coordinates</li>
          </ul>
        </div>

      </div>
    </div>
  );
};
