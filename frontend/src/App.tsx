import React, { useState, useEffect } from 'react';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { PlayerProfile } from './components/PlayerProfile';
import { PlayerComparison } from './components/PlayerComparison';
import { MatchDashboard } from './components/MatchDashboard';
import { MLPredictions } from './components/MLPredictions';
import { AIChatAssistant } from './components/AIChatAssistant';
import { FantasyRecs } from './components/FantasyRecs';
import { ScoutingAuction } from './components/ScoutingAuction';
import { AdminPortal } from './components/AdminPortal';
import { mockFetch } from './utils/mockApi';
import { 
  Trophy, LayoutDashboard, User, GitCompare, Calendar, 
  BrainCircuit, MessageSquare, Users, ShieldAlert, 
  LogOut, ShieldCheck, Menu, X, Landmark
} from 'lucide-react';

const BACKEND_URL = "http://localhost:5000";

interface UserType {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<UserType | null>(null);
  const [tab, setTab] = useState<string>('dashboard');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>('');
  
  // Mobile Navigation Drawer Toggle
  const [menuOpen, setMenuOpen] = useState(false);

  // Check backend status, fallback to mockFetch on failure
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/status`)
      .then(res => {
        if (!res.ok) throw new Error();
        console.log("[App] Backend online. Real API calls active.");
      })
      .catch(() => {
        console.warn("[App] Backend offline. Overriding window.fetch with mockApi client seeder.");
        const originalFetch = window.fetch;
        window.fetch = async (input, init) => {
          try {
            const urlStr = typeof input === 'string' ? input : (input as Request).url;
            if (!urlStr.includes('/api/')) {
              return await originalFetch(input, init);
            }
            return await mockFetch(urlStr, init);
          } catch {
            return await mockFetch(typeof input === 'string' ? input : (input as Request).url, init);
          }
        };
        // Trigger a force re-login check or trigger auth
        if (localStorage.getItem('token')) {
          setToken(localStorage.getItem('token'));
        } else {
          // If no token, set mock details to allow guest analyst entry
          localStorage.setItem('token', 'sandbox-jwt-token-123456');
          setToken('sandbox-jwt-token-123456');
        }
      });
  }, []);

  useEffect(() => {
    if (token) {
      // Fetch current user details to check validity
      fetch(`${BACKEND_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(r => {
        if (!r.ok) {
          handleLogout();
          throw new Error("Invalid token");
        }
        return r.json();
      })
      .then(data => {
        setUser(data.user);
      })
      .catch(err => {
        console.error("Auth validation failed", err);
      });
    }
  }, [token]);

  // Set up default player selection if profile tab is clicked
  useEffect(() => {
    if (tab === 'profile' && !selectedPlayerId) {
      fetch(`${BACKEND_URL}/api/players`)
      .then(r => r.json())
      .then(data => {
        if (data.length > 0) {
          setSelectedPlayerId(data[0].id);
        }
      });
    }
  }, [tab, selectedPlayerId]);

  const handleAuthSuccess = (newToken: string, loggedUser: UserType) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(loggedUser);
    setTab('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setTab('dashboard');
  };

  if (!token || !user) {
    return <Auth onAuthSuccess={handleAuthSuccess} backendUrl={BACKEND_URL} />;
  }

  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, roles: ['USER', 'ANALYST', 'ADMIN'] },
    { id: 'profile', name: 'Player Profiles', icon: User, roles: ['USER', 'ANALYST', 'ADMIN'] },
    { id: 'comparison', name: 'Comparison Hub', icon: GitCompare, roles: ['USER', 'ANALYST', 'ADMIN'] },
    { id: 'match', name: 'Match Center', icon: Calendar, roles: ['USER', 'ANALYST', 'ADMIN'] },
    { id: 'predictions', name: 'ML Predictions', icon: BrainCircuit, roles: ['ANALYST', 'ADMIN'] },
    { id: 'chat', name: 'AI Chat Assistant', icon: MessageSquare, roles: ['USER', 'ANALYST', 'ADMIN'] },
    { id: 'fantasy', name: 'Fantasy Optimizer', icon: Users, roles: ['ANALYST', 'ADMIN'] },
    { id: 'scouting', name: 'Scouting & Auction', icon: Landmark, roles: ['ANALYST', 'ADMIN'] },
    { id: 'admin', name: 'Admin Portal', icon: ShieldCheck, roles: ['ADMIN'] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(user.role));

  return (
    <div className="min-h-screen flex text-slate-200">
      
      {/* Sidebar - Desktop Layout */}
      <aside className="w-64 bg-slate-950/90 border-r border-slate-900 shrink-0 hidden lg:flex flex-col py-6 px-4 fixed top-0 bottom-0 z-20">
        <div className="space-y-8 overflow-y-auto flex-1">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-3.5 px-2">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl ring-1 ring-emerald-500/20 shadow-md shadow-emerald-500/5">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-sm font-black text-slate-100 uppercase tracking-wider">Insight Pro</h1>
              <p className="text-[10px] text-slate-500 font-semibold tracking-widest uppercase">Sports Analytics</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={`w-full flex items-center space-x-3.5 px-4.5 py-3.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    active 
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/10 scale-[1.02]' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Card & Log Out */}
        <div className="mt-auto pt-6 border-t border-slate-900 space-y-2 shrink-0">
          <div className="flex items-center space-x-2 px-2">
            <div className="p-1.5 bg-slate-900 border border-slate-800 text-slate-400 rounded-lg shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div className="overflow-hidden min-w-0">
              <p className="text-xs font-bold text-slate-200 truncate">{user.name}</p>
              <p className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">{user.role}</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-[11px] font-bold text-red-400 hover:text-red-300 hover:bg-red-950/10 border border-dashed border-red-500/10 hover:border-red-500/30 transition-all shrink-0 whitespace-nowrap"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="h-16 w-full bg-slate-950/90 border-b border-slate-900 flex items-center justify-between px-4 lg:hidden fixed top-0 left-0 right-0 z-30">
        <div className="flex items-center space-x-2">
          <Trophy className="w-6 h-6 text-emerald-400" />
          <span className="text-sm font-black text-slate-100 uppercase tracking-wider">Insight Pro</span>
        </div>
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 text-slate-400 hover:text-slate-200 focus:outline-none"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Drawer menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-slate-950/95 z-20 flex flex-col justify-between py-24 px-6 lg:hidden">
          <nav className="space-y-2">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setTab(item.id); setMenuOpen(false); }}
                  className={`w-full flex items-center space-x-4 px-5 py-4 rounded-xl text-sm font-bold tracking-wide transition-all ${
                    active 
                      ? 'bg-emerald-500 text-slate-950 shadow-lg' 
                      : 'text-slate-400 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          <button 
            onClick={() => { handleLogout(); setMenuOpen(false); }}
            className="w-full flex items-center justify-center space-x-3 py-4 rounded-xl text-sm font-bold text-red-400 bg-red-950/10 border border-red-500/25 transition"
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </div>
      )}

      {/* Main Workspace Frame */}
      <main className="flex-1 lg:pl-64 pt-20 lg:pt-0 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          {tab === 'dashboard' && (
            <Dashboard 
              backendUrl={BACKEND_URL} 
              onSelectPlayer={(id) => { setSelectedPlayerId(id); setTab('profile'); }} 
            />
          )}
          {tab === 'profile' && (
            <PlayerProfile 
              playerId={selectedPlayerId} 
              backendUrl={BACKEND_URL} 
              token={token} 
            />
          )}
          {tab === 'comparison' && <PlayerComparison backendUrl={BACKEND_URL} />}
          {tab === 'match' && <MatchDashboard backendUrl={BACKEND_URL} />}
          {tab === 'predictions' && <MLPredictions backendUrl={BACKEND_URL} />}
          {tab === 'chat' && <AIChatAssistant backendUrl={BACKEND_URL} />}
          {tab === 'fantasy' && <FantasyRecs backendUrl={BACKEND_URL} />}
          {tab === 'scouting' && <ScoutingAuction backendUrl={BACKEND_URL} />}
          {tab === 'admin' && <AdminPortal backendUrl={BACKEND_URL} token={token} />}
        </div>
      </main>

    </div>
  );
}
