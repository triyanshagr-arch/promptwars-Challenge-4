'use client';
import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Clock, MapPin, Activity, Radio, TrendingUp, Zap, Send, Globe, Search, PlusCircle, ShieldAlert, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('operations'); // operations, predictive, broadcast, sentiment, lostfound
  const [incidents, setIncidents] = useState<any[]>([]);
  
  // Broadcast State
  const [announcement, setAnnouncement] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [translations, setTranslations] = useState<{language: string, text: string}[] | null>(null);

  // Sentiment State
  const [sentiment, setSentiment] = useState<{score: number, trend: string, analysis: string} | null>(null);

  // Predictive State
  const [bottlenecks, setBottlenecks] = useState<{location: string, severity: string, prediction: string}[]>([]);

  // Lost & Found State
  const [lostItems, setLostItems] = useState<any[]>([]);
  const [foundItems, setFoundItems] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [isMatching, setIsMatching] = useState(false);
  
  // Staffing State
  const [staffSuggestions, setStaffSuggestions] = useState<{action: string, detail: string}[]>([]);
  const [isGeneratingStaff, setIsGeneratingStaff] = useState(false);
  
  const generateStaffing = async () => {
    setIsGeneratingStaff(true);
    try {
      const res = await fetch('/api/staffing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incidents, bottlenecks })
      });
      const data = await res.json();
      setStaffSuggestions(data.suggestions || []);
    } catch (e) {
      console.error(e);
    }
    setIsGeneratingStaff(false);
  };
  
  // Manual Log Found Item
  const [manualFoundItem, setManualFoundItem] = useState('');
  const [manualFoundLocation, setManualFoundLocation] = useState('');
  
  const fetchIncidents = async () => {
    try {
      const res = await fetch('/api/incidents');
      const data = await res.json();
      setIncidents(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchSentiment = async () => {
    try {
      const res = await fetch('/api/sentiment');
      const data = await res.json();
      setSentiment(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchPredictive = async () => {
    try {
      const res = await fetch('/api/predictive');
      const data = await res.json();
      setBottlenecks(data.bottlenecks || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchLostAndFound = async () => {
    try {
      const res = await fetch('/api/lostandfound');
      const data = await res.json();
      setLostItems(data.lostItems || []);
      setFoundItems(data.foundItems || []);
    } catch(e) {
      console.error(e);
    }
  }

  useEffect(() => {
    fetchIncidents();
    fetchSentiment();
    fetchPredictive();
    fetchLostAndFound();
    const interval = setInterval(() => {
      fetchIncidents();
      fetchLostAndFound();
    }, 5000);
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

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcement) return;
    setIsBroadcasting(true);
    try {
      const res = await fetch('/api/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ announcement })
      });
      const data = await res.json();
      if(data.translations) {
        setTranslations(data.translations);
      } else {
        alert("Error generating translations: " + data.error);
      }
    } catch (e) {
      console.error(e);
    }
    setIsBroadcasting(false);
  };

  const logFoundItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/lostandfound', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'found', item: { description: manualFoundItem, location: manualFoundLocation } })
      });
      setManualFoundItem('');
      setManualFoundLocation('');
      fetchLostAndFound();
    } catch (e) {
      alert("Failed to log found item");
    }
  };

  const runAIMatcher = async () => {
    setIsMatching(true);
    try {
      const res = await fetch('/api/matcher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lostItems, foundItems })
      });
      const data = await res.json();
      setMatches(data.matches || []);
    } catch (e) {
      alert("AI Matcher Failed");
    }
    setIsMatching(false);
  }

  const chartData = [
    { name: 'Gate A', wait: 15 },
    { name: 'Gate B', wait: 45 },
    { name: 'Gate C', wait: 10 },
    { name: 'Gate D', wait: 5 },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col z-10">
        <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">StadiumSync <span className="text-emerald-400">COMMAND</span></h1>
        <p className="text-slate-400 text-sm mb-8">World Cup 2026 Ops</p>
        
        <nav className="flex-1 space-y-2">
          <button onClick={() => setActiveTab('operations')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'operations' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}>
            <Activity size={20} /> Live Operations
          </button>
          <button onClick={() => setActiveTab('predictive')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'predictive' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}>
            <Zap size={20} /> Predictive Analytics
          </button>
          <button onClick={() => setActiveTab('broadcast')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'broadcast' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}>
            <Radio size={20} /> AI Broadcast
          </button>
          <button onClick={() => setActiveTab('sentiment')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'sentiment' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}>
            <TrendingUp size={20} /> Fan Sentiment
          </button>
          <button onClick={() => setActiveTab('lostfound')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'lostfound' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}>
            <Search size={20} /> AI Lost & Found
          </button>
          <button onClick={() => setActiveTab('staffing')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'staffing' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}>
            <Users size={20} /> AI Staffing
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto relative">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">
            {activeTab === 'operations' && 'Live Operations Center'}
            {activeTab === 'predictive' && 'AI Predictive Heatmaps'}
            {activeTab === 'broadcast' && 'Multilingual Broadcasts'}
            {activeTab === 'sentiment' && 'Live Fan Sentiment'}
            {activeTab === 'lostfound' && 'AI Matcher: Lost & Found'}
            {activeTab === 'staffing' && 'AI Staffing Management'}
          </h2>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-400 font-medium text-sm">Live System Active</span>
          </div>
        </div>

        {activeTab === 'operations' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Added Manual Found Item Logger to Operations */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl mb-8 flex items-center justify-between shadow">
               <div>
                 <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2"><PlusCircle size={18}/> Manual Log: Found Item</h3>
                 <p className="text-sm text-slate-400">Security desk: log an item handed in.</p>
               </div>
               <form onSubmit={logFoundItem} className="flex gap-3 flex-1 max-w-xl ml-8">
                 <input required value={manualFoundItem} onChange={e => setManualFoundItem(e.target.value)} type="text" placeholder="Description (e.g. Red Cap)" className="bg-slate-950 border border-slate-700 px-4 py-2 rounded-lg flex-1 outline-none focus:border-emerald-500" />
                 <input value={manualFoundLocation} onChange={e => setManualFoundLocation(e.target.value)} type="text" placeholder="Where found" className="bg-slate-950 border border-slate-700 px-4 py-2 rounded-lg w-1/3 outline-none focus:border-emerald-500" />
                 <button type="submit" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 rounded-lg font-bold transition-colors shadow">Log Item</button>
               </form>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-center items-center text-center shadow-sm">
                <div className="text-slate-400 text-sm mb-2 uppercase tracking-wider font-bold">Active Gates</div>
                <div className="text-5xl font-black text-emerald-400">4<span className="text-2xl text-emerald-400/50">/4</span></div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-center items-center text-center shadow-sm">
                <div className="text-slate-400 text-sm mb-2 uppercase tracking-wider font-bold">Avg Wait Time</div>
                <div className="text-5xl font-black text-amber-400">18<span className="text-2xl text-amber-400/50">m</span></div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-center items-center text-center shadow-sm">
                <div className="text-slate-400 text-sm mb-2 uppercase tracking-wider font-bold">High Density Zone</div>
                <div className="text-3xl font-black text-red-400 mt-2">Gate B</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-center items-center text-center shadow-sm">
                <div className="text-slate-400 text-sm mb-2 uppercase tracking-wider font-bold">Active Incidents</div>
                <div className="text-5xl font-black text-red-400">{incidents.filter(i => i.status !== 'resolved').length}</div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl mb-8 shadow-sm">
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

            <h3 className="text-xl font-bold text-white mb-4">Incident Feed & AI Insights</h3>
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
          </div>
        )}

        {activeTab === 'broadcast' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-8 max-w-3xl">
               <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><Globe className="text-emerald-400"/> New Multilingual Announcement</h3>
               <p className="text-slate-400 mb-6">Type a message in English. GenAI will instantly translate it to the top 4 international languages and push it to the fan app.</p>
               
               <form onSubmit={handleBroadcast}>
                 <textarea 
                   required
                   value={announcement}
                   onChange={e => setAnnouncement(e.target.value)}
                   placeholder="e.g. Attention fans, Gate C is currently experiencing high wait times. Please use Gate A or B for faster entry." 
                   className="w-full bg-slate-950 rounded-xl p-4 border border-slate-800 outline-none focus:border-emerald-500/50 transition-colors min-h-[120px] mb-4 text-slate-200 resize-none"
                 />
                 <button disabled={isBroadcasting} type="submit" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50">
                   {isBroadcasting ? 'Generating Translations...' : 'Translate & Broadcast'} <Send size={18} />
                 </button>
               </form>
             </div>

             {translations && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
                 <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                   <div className="text-sm text-emerald-400 font-bold uppercase tracking-wider mb-2">Original (English)</div>
                   <p className="text-slate-200 text-lg">{announcement}</p>
                 </div>
                 {translations.map((t, i) => (
                   <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                     <div className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-2">{t.language}</div>
                     <p className="text-slate-300 text-lg">{t.text}</p>
                   </div>
                 ))}
               </div>
             )}
          </div>
        )}

        {activeTab === 'predictive' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
             <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 flex gap-4 max-w-4xl">
               <Zap className="text-amber-500 shrink-0" size={32} />
               <div>
                 <h3 className="text-xl font-bold text-amber-500 mb-1">AI Bottleneck Predictions</h3>
                 <p className="text-amber-400/80">GenAI has analyzed current live operations, wait times, and incident reports to predict near-future stadium friction points.</p>
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
               {bottlenecks.map((b, i) => (
                 <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
                   <div className={`absolute top-0 left-0 w-full h-1 ${b.severity === 'High' ? 'bg-red-500' : b.severity === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                   <div className="flex justify-between items-start mb-4">
                     <h4 className="font-bold text-white text-xl">{b.location}</h4>
                     <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${b.severity === 'High' ? 'bg-red-500/20 text-red-400' : b.severity === 'Medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                       {b.severity} Risk
                     </span>
                   </div>
                   <p className="text-slate-300">{b.prediction}</p>
                 </div>
               ))}
               {bottlenecks.length === 0 && (
                 <div className="col-span-3 text-slate-500 text-center p-12 bg-slate-900 rounded-2xl border border-slate-800 border-dashed">
                   Loading predictive models...
                 </div>
               )}
             </div>
          </div>
        )}

        {activeTab === 'sentiment' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl">
             <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-6 flex items-center justify-between">
               <div>
                 <h3 className="text-2xl font-bold text-white mb-2">Live Stadium Sentiment</h3>
                 <p className="text-slate-400">Aggregated AI analysis of Fan App activity and wait times.</p>
               </div>
               {sentiment ? (
                 <div className="text-right">
                   <div className={`text-6xl font-black ${sentiment.score > 70 ? 'text-emerald-400' : sentiment.score > 40 ? 'text-amber-400' : 'text-red-400'}`}>
                     {sentiment.score}
                   </div>
                   <div className="text-slate-400 uppercase tracking-widest text-sm mt-1 font-bold">
                     Out of 100
                   </div>
                 </div>
               ) : (
                 <div className="text-slate-500">Calculating...</div>
               )}
             </div>

             {sentiment && (
               <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                 <div className="text-sm text-emerald-400 font-bold uppercase tracking-wider mb-3">AI Executive Summary</div>
                 <p className="text-slate-300 text-lg leading-relaxed">{sentiment.analysis}</p>
               </div>
             )}
          </div>
        )}

        {activeTab === 'lostfound' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl">
            <div className="flex justify-between items-center mb-6">
              <p className="text-slate-400">GenAI continuously cross-references fan-reported Lost Items against staff-reported Found Items.</p>
              <button onClick={runAIMatcher} disabled={isMatching} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50">
                {isMatching ? 'Running AI Matcher...' : 'Run Manual AI Match'} <Search size={18} />
              </button>
            </div>

            {matches.length > 0 && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 mb-8">
                <h3 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2"><CheckCircle size={24}/> AI Found Potential Matches!</h3>
                <div className="space-y-4">
                  {matches.map((m, i) => (
                    <div key={i} className="bg-slate-900 border border-emerald-500/20 p-4 rounded-xl flex gap-4 items-center">
                      <div className="w-16 h-16 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center flex-col shadow-inner">
                        <span className="text-xs text-slate-500 uppercase font-bold tracking-widest">Match</span>
                        <span className="text-emerald-400 font-black text-xl">{m.confidence}%</span>
                      </div>
                      <div className="flex-1">
                         <div className="flex gap-8 mb-2">
                           <div>
                             <span className="text-xs text-slate-500 uppercase font-bold tracking-widest block mb-1">Lost Item</span>
                             <span className="text-slate-200">{lostItems.find(l => l.id === m.lostId)?.description || m.lostId}</span>
                           </div>
                           <div>
                             <span className="text-xs text-slate-500 uppercase font-bold tracking-widest block mb-1">Found Item</span>
                             <span className="text-slate-200">{foundItems.find(f => f.id === m.foundId)?.description || m.foundId}</span>
                           </div>
                         </div>
                         <p className="text-emerald-400/80 text-sm italic">" {m.reason} "</p>
                      </div>
                      <button className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 px-4 py-2 rounded-lg font-bold transition-colors">
                        Verify & Contact Fan
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2"><ShieldAlert className="text-red-400" size={20}/> Reported Lost by Fans</h3>
                {lostItems.length === 0 ? <p className="text-slate-500 italic">No lost items reported.</p> : (
                  <ul className="space-y-3">
                    {lostItems.map(item => (
                      <li key={item.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                        <div className="font-bold text-slate-300">{item.description}</div>
                        <div className="text-sm text-slate-500 mt-1 flex items-center gap-1"><MapPin size={12}/> {item.location || 'Unknown location'}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2"><CheckCircle className="text-emerald-400" size={20}/> Logged as Found by Staff</h3>
                {foundItems.length === 0 ? <p className="text-slate-500 italic">No found items logged.</p> : (
                  <ul className="space-y-3">
                    {foundItems.map(item => (
                      <li key={item.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                        <div className="font-bold text-slate-300">{item.description}</div>
                        <div className="text-sm text-slate-500 mt-1 flex items-center gap-1"><MapPin size={12}/> {item.location || 'Unknown location'}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

          </div>
        )}

        {activeTab === 'staffing' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl space-y-8">
            <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-8 rounded-2xl">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Dynamic Staff Deployment</h3>
                <p className="text-slate-400">Generate intelligent reallocation strategies based on live incidents and predictive bottlenecks.</p>
              </div>
              <button onClick={generateStaffing} disabled={isGeneratingStaff} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50">
                {isGeneratingStaff ? 'Analyzing Live Data...' : 'Generate AI Suggestions'} <Users size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
               <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center">
                 <div className="text-4xl font-bold text-slate-200">120</div>
                 <div className="text-slate-500 text-sm font-bold uppercase tracking-wider mt-1">Total Stewards</div>
               </div>
               <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center">
                 <div className="text-4xl font-bold text-slate-200">45</div>
                 <div className="text-slate-500 text-sm font-bold uppercase tracking-wider mt-1">Security</div>
               </div>
               <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center">
                 <div className="text-4xl font-bold text-slate-200">18</div>
                 <div className="text-slate-500 text-sm font-bold uppercase tracking-wider mt-1">Medical</div>
               </div>
               <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center">
                 <div className="text-4xl font-bold text-emerald-400">96%</div>
                 <div className="text-emerald-400/80 text-sm font-bold uppercase tracking-wider mt-1">Active Duty</div>
               </div>
            </div>

            {staffSuggestions.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white mb-4">AI Reallocation Plan</h3>
                {staffSuggestions.map((s, i) => (
                  <div key={i} className="bg-slate-900 border border-emerald-500/30 p-6 rounded-2xl flex gap-6 items-center">
                    <div className="bg-emerald-500/10 p-4 rounded-xl text-emerald-400">
                      <Users size={28} />
                    </div>
                    <div className="flex-1">
                      <div className="text-lg font-bold text-emerald-400 mb-1">{s.action}</div>
                      <p className="text-slate-300">{s.detail}</p>
                    </div>
                    <button className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 px-6 py-3 rounded-lg font-bold transition-colors">
                      Dispatch Order
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
