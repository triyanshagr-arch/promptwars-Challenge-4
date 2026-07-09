'use client';
import { useState, useRef, useEffect } from 'react';
import { Home, MessageCircle, Map, Clock, ArrowRight, User, Search, MapPin, Coffee, Send, ChevronRight, Trophy } from 'lucide-react';

export default function FanApp() {
  const [activeTab, setActiveTab] = useState('home');
  const [itinerary, setItinerary] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [form, setForm] = useState({ arrivalTime: '18:00', seatNumber: 'Sec 112, Row F', team: 'Mexico' });
  
  // Chat State
  const [messages, setMessages] = useState([{ role: 'model', content: "Hi! I'm your Stadium AI Assistant. How can I help you have the perfect match day?" }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateItinerary = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      setItinerary(data.itinerary || []);
    } catch (e) {
      console.error(e);
    }
    setIsGenerating(false);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/fan-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });
      const data = await res.json();
      setMessages([...newMessages, { role: 'model', content: data.reply }]);
    } catch (e) {
      console.error(e);
    }
    setIsTyping(false);
  };

  return (
    <div className="bg-black min-h-screen font-sans text-slate-100 selection:bg-emerald-500/30 flex justify-center">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-md bg-slate-950 min-h-screen relative shadow-2xl flex flex-col border-x border-slate-900/50">
        
        {/* Header */}
        <header className="px-6 pt-12 pb-4 bg-gradient-to-b from-slate-900 to-transparent sticky top-0 z-10 backdrop-blur-md border-b border-slate-800/50">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                Stadium<span className="text-emerald-400">Sync</span>
              </h1>
              <p className="text-xs text-slate-400 font-medium">World Cup 2026 Fan Hub</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-500/20">
              <User size={18} className="text-slate-950" />
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto pb-24 scroll-smooth">
          
          {/* ---- HOME TAB ---- */}
          {activeTab === 'home' && (
            <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Match Card */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full"></div>
                <div className="flex justify-between items-center mb-6 relative z-10">
                  <div className="text-center flex-1">
                    <div className="text-3xl font-black mb-1">USA</div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">Home</div>
                  </div>
                  <div className="px-4 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-xs font-bold text-slate-300">
                    VS
                  </div>
                  <div className="text-center flex-1">
                    <div className="text-3xl font-black mb-1">MEX</div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">Away</div>
                  </div>
                </div>
                <div className="bg-slate-950/50 rounded-2xl p-4 flex justify-between items-center border border-slate-800/50 relative z-10">
                  <div>
                    <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider mb-1">Kickoff</div>
                    <div className="text-lg font-bold">20:00 Local</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Gate</div>
                    <div className="text-lg font-bold">C North</div>
                  </div>
                </div>
              </div>

              {/* AI Itinerary Builder */}
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Clock className="text-emerald-400" size={20} />
                  Your Smart Itinerary
                </h2>
                
                {itinerary.length === 0 ? (
                  <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-lg">
                    <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                      Let our AI plan your perfect match day. Enter your details below to avoid crowds and maximize the fun!
                    </p>
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Arrival Time</label>
                        <input 
                          type="time" 
                          value={form.arrivalTime}
                          onChange={e => setForm({...form, arrivalTime: e.target.value})}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Seat</label>
                          <input 
                            type="text" 
                            value={form.seatNumber}
                            onChange={e => setForm({...form, seatNumber: e.target.value})}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Supporting</label>
                          <select 
                            value={form.team}
                            onChange={e => setForm({...form, team: e.target.value})}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
                          >
                            <option>USA</option>
                            <option>Mexico</option>
                            <option>Neutral</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={generateItinerary}
                      disabled={isGenerating}
                      className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-4 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 flex justify-center items-center gap-2"
                    >
                      {isGenerating ? (
                         <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>Generate with AI <ArrowRight size={18} /></>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {itinerary.map((item, i) => (
                      <div key={i} className="flex gap-4 group">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-emerald-500/30 flex items-center justify-center group-hover:border-emerald-400 transition-colors z-10">
                            <div className="w-2 h-2 rounded-full bg-emerald-400" />
                          </div>
                          {i !== itinerary.length - 1 && (
                            <div className="w-0.5 h-full bg-slate-800 my-1" />
                          )}
                        </div>
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex-1 shadow-sm mb-4">
                          <div className="text-emerald-400 font-bold text-sm mb-1">{item.time}</div>
                          <div className="text-slate-200 text-sm leading-relaxed">{item.event}</div>
                        </div>
                      </div>
                    ))}
                    <button onClick={() => setItinerary([])} className="text-slate-500 text-sm font-bold w-full py-4 text-center hover:text-white transition-colors">
                      Plan a different time
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ---- ASSISTANT TAB ---- */}
          {activeTab === 'assistant' && (
            <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="px-6 py-4 border-b border-slate-800/50 bg-slate-900/30">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <MessageCircle className="text-emerald-400" size={20} />
                  Stadium AI
                </h2>
                <p className="text-xs text-slate-400 mt-1">Ask about food, rules, or live stats!</p>
              </div>
              
              <div className="flex-1 p-6 space-y-6 overflow-y-auto min-h-[400px]">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-md ${
                      m.role === 'user' 
                        ? 'bg-emerald-500 text-slate-950 rounded-tr-sm font-medium' 
                        : 'bg-slate-800 text-slate-200 rounded-tl-sm border border-slate-700'
                    }`}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                     <div className="bg-slate-800 text-slate-400 p-4 rounded-2xl rounded-tl-sm border border-slate-700 flex gap-2 items-center h-12">
                       <span className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                       <span className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                       <span className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                     </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="p-4 bg-slate-950 border-t border-slate-900">
                <div className="relative flex items-center">
                  <input 
                    type="text" 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    placeholder="Where is the nearest vegan food?"
                    className="w-full bg-slate-900 border border-slate-800 rounded-full pl-6 pr-14 py-4 text-sm focus:outline-none focus:border-emerald-500 transition-colors shadow-inner"
                  />
                  <button 
                    onClick={sendMessage}
                    disabled={!input.trim() || isTyping}
                    className="absolute right-2 p-3 bg-emerald-500 text-slate-950 rounded-full disabled:opacity-50 hover:bg-emerald-400 transition-colors"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ---- EXPLORE TAB ---- */}
          {activeTab === 'explore' && (
            <div className="p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Map className="text-emerald-400" size={20} />
                Live Explore
              </h2>
              
              <div className="relative h-48 bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-lg group cursor-pointer flex items-center justify-center">
                 {/* Fake Map Background */}
                 <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                 <div className="text-center z-10">
                   <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3 ring-4 ring-emerald-500/10">
                     <MapPin size={24} />
                   </div>
                   <div className="font-bold text-white">Interactive Stadium Map</div>
                   <div className="text-xs text-slate-400 mt-1 group-hover:text-emerald-400 transition-colors flex items-center justify-center gap-1">Tap to open AR view <ChevronRight size={14}/></div>
                 </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-4 mt-8">
                  <h3 className="font-bold text-lg">Live Wait Times</h3>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md">LIVE</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm">
                    <div className="text-slate-400 mb-2"><Coffee size={20} /></div>
                    <div className="font-bold text-sm mb-1 text-white">Concourse B Food</div>
                    <div className="text-2xl font-black text-emerald-400">4 min</div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm">
                    <div className="text-slate-400 mb-2"><Search size={20} /></div>
                    <div className="font-bold text-sm mb-1 text-white">Merch Store 3</div>
                    <div className="text-2xl font-black text-amber-400">12 min</div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm">
                    <div className="text-slate-400 mb-2"><MapPin size={20} /></div>
                    <div className="font-bold text-sm mb-1 text-white">Gate C Restrooms</div>
                    <div className="text-2xl font-black text-emerald-400">2 min</div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm">
                    <div className="text-slate-400 mb-2"><MapPin size={20} /></div>
                    <div className="font-bold text-sm mb-1 text-white">Main Entrance</div>
                    <div className="text-2xl font-black text-red-400">28 min</div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ---- STADIUMS TAB ---- */}
          {activeTab === 'stadiums' && (
            <div className="p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                <Trophy className="text-emerald-400" size={20} />
                Host Stadiums
              </h2>
              <p className="text-sm text-slate-400 mb-6">Explore the 16 iconic venues hosting the 2026 FIFA World Cup across North America.</p>
              
              <div className="space-y-4">
                {[
                  { city: 'New York/New Jersey', name: 'MetLife Stadium', capacity: '82,500', region: 'East' },
                  { city: 'Dallas', name: 'AT&T Stadium', capacity: '80,000', region: 'Central' },
                  { city: 'Mexico City', name: 'Estadio Azteca', capacity: '83,000', region: 'Mexico' },
                  { city: 'Kansas City', name: 'Arrowhead Stadium', capacity: '76,000', region: 'Central' },
                  { city: "New York/New Jersey", name: "MetLife Stadium", capacity: "82,500", region: "East" },
                  { city: "Dallas", name: "AT&T Stadium", capacity: "80,000", region: "Central" },
                  { city: "Mexico City", name: "Estadio Azteca", capacity: "83,000", region: "Mexico" },
                  { city: "Kansas City", name: "Arrowhead Stadium", capacity: "76,000", region: "Central" },
                  { city: "Houston", name: "NRG Stadium", capacity: "72,000", region: "Central" },
                  { city: "Atlanta", name: "Mercedes-Benz Stadium", capacity: "71,000", region: "East" },
                  { city: "Los Angeles", name: "SoFi Stadium", capacity: "70,000", region: "West" },
                  { city: "Philadelphia", name: "Lincoln Financial Field", capacity: "69,000", region: "East" },
                  { city: "Seattle", name: "Lumen Field", capacity: "69,000", region: "West" },
                  { city: "San Francisco", name: "Levi's Stadium", capacity: "68,500", region: "West" },
                  { city: "Miami", name: "Hard Rock Stadium", capacity: "65,000", region: "East" },
                  { city: "Boston", name: "Gillette Stadium", capacity: "65,000", region: "East" },
                  { city: "Vancouver", name: "BC Place", capacity: "54,500", region: "Canada" },
                  { city: "Monterrey", name: "Estadio BBVA", capacity: "53,500", region: "Mexico" },
                  { city: "Guadalajara", name: "Estadio Akron", capacity: "48,000", region: "Mexico" },
                  { city: "Toronto", name: "BMO Field", capacity: "45,000", region: "Canada" },
                ].map((stadium, i) => (
                  <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-sm group hover:border-emerald-500/50 transition-colors">
                    <div>
                      <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider mb-1">{stadium.city}</div>
                      <div className="font-bold text-white text-lg">{stadium.name}</div>
                      <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                        <span>Capacity: {stadium.capacity}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                        <span>{stadium.region}</span>
                      </div>
                    </div>
                    <div className="text-slate-600 group-hover:text-emerald-400 transition-colors">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
        </main>

        {/* Bottom Navigation */}
        <nav className="absolute bottom-0 w-full bg-slate-950/80 backdrop-blur-xl border-t border-slate-900/80 px-4 py-4 pb-8 flex justify-between items-center z-20">
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 w-14 transition-colors ${activeTab === 'home' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <div className={`p-2 rounded-xl transition-all ${activeTab === 'home' ? 'bg-emerald-500/10' : ''}`}>
              <Home size={22} className={activeTab === 'home' ? 'fill-emerald-400/20' : ''} />
            </div>
            <span className="text-[10px] font-bold tracking-wider">Home</span>
          </button>

          <button 
            onClick={() => setActiveTab('stadiums')}
            className={`flex flex-col items-center gap-1 w-14 transition-colors ${activeTab === 'stadiums' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <div className={`p-2 rounded-xl transition-all ${activeTab === 'stadiums' ? 'bg-emerald-500/10' : ''}`}>
              <Trophy size={22} className={activeTab === 'stadiums' ? 'fill-emerald-400/20' : ''} />
            </div>
            <span className="text-[10px] font-bold tracking-wider">Stadiums</span>
          </button>

          <button 
            onClick={() => setActiveTab('assistant')}
            className={`flex flex-col items-center gap-1 w-14 transition-colors ${activeTab === 'assistant' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <div className={`p-2 rounded-xl transition-all ${activeTab === 'assistant' ? 'bg-emerald-500/10' : ''}`}>
              <MessageCircle size={22} className={activeTab === 'assistant' ? 'fill-emerald-400/20' : ''} />
            </div>
            <span className="text-[10px] font-bold tracking-wider">Assistant</span>
          </button>

          <button 
            onClick={() => setActiveTab('explore')}
            className={`flex flex-col items-center gap-1 w-14 transition-colors ${activeTab === 'explore' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <div className={`p-2 rounded-xl transition-all ${activeTab === 'explore' ? 'bg-emerald-500/10' : ''}`}>
              <Map size={22} className={activeTab === 'explore' ? 'fill-emerald-400/20' : ''} />
            </div>
            <span className="text-[10px] font-bold tracking-wider">Explore</span>
          </button>
        </nav>

      </div>
    </div>
  );
}
