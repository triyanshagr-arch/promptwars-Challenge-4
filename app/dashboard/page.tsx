'use client';
import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Clock, MapPin, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [incidents, setIncidents] = useState<any[]>([]);

  const fetchIncidents = async () => {
    try {
      const res = await fetch('/api/incidents');
      const data = await res.json();
      setIncidents(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchIncidents();
    const interval = setInterval(fetchIncidents, 5000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch('/api/incidents', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status })
    });
    fetchIncidents();
  };

  const chartData = [
    { name: 'Gate A', wait: 15 },
    { name: 'Gate B', wait: 45 },
    { name: 'Gate C', wait: 10 },
    { name: 'Gate D', wait: 5 },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col">
        <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">StadiumSync <span className="text-emerald-400">COMMAND</span></h1>
        <p className="text-slate-400 text-sm mb-8">World Cup 2026 Ops</p>
        
        <nav className="flex-1 space-y-2">
          <a href="#" className="flex items-center gap-3 bg-slate-800 text-emerald-400 px-4 py-3 rounded-lg font-medium">
            <Activity size={20} /> Live Operations
          </a>
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Live Operations Center</h2>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-400 font-medium text-sm">Live System Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-slate-300">Gate Wait Times (Mins)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="#475569" />
                  <YAxis stroke="#475569" />
                  <Tooltip cursor={{fill: '#1e293b'}} contentStyle={{backgroundColor: '#0f172a', border: 'none', borderRadius: '8px'}} />
                  <Bar dataKey="wait" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-center items-center text-center">
            <div className="text-slate-400 text-sm mb-2">Active Incidents</div>
            <div className="text-7xl font-bold text-red-400">{incidents.filter(i => i.status !== 'resolved').length}</div>
          </div>
        </div>

        <h3 className="text-xl font-bold mb-4">Incident Feed & AI Insights</h3>
        <div className="space-y-4">
          {incidents.length === 0 ? (
            <div className="text-slate-500 italic p-8 text-center bg-slate-900/50 rounded-xl border border-slate-800 border-dashed">No active incidents reported.</div>
          ) : (
            incidents.map((incident) => (
              <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} key={incident.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row gap-6 shadow-lg shadow-black/20">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${incident.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-400' : incident.status === 'investigating' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}>
                      {incident.status}
                    </span>
                    <span className="text-slate-500 text-sm flex items-center gap-1"><Clock size={14}/> {new Date(incident.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300 font-medium text-lg mb-1">
                    <MapPin size={18} className="text-emerald-400" /> {incident.location}
                  </div>
                  <p className="text-slate-400">{incident.description}</p>
                </div>
                
                <div className="flex-1 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div> AI Action Plan
                  </div>
                  <p className="text-sm text-slate-300">{incident.aiActionPlan}</p>
                </div>

                <div className="flex flex-col gap-2 justify-center">
                  {incident.status === 'new' && (
                    <button onClick={() => updateStatus(incident.id, 'investigating')} className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      Mark Investigating
                    </button>
                  )}
                  {incident.status !== 'resolved' && (
                    <button onClick={() => updateStatus(incident.id, 'resolved')} className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      Resolve Incident
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
