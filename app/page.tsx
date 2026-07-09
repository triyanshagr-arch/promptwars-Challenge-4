'use client';
import { useState, useRef, useEffect, useMemo } from 'react';
import { Home, MessageCircle, Map, Clock, ArrowRight, User, Search, MapPin, Coffee, Send, ChevronRight, Trophy, Calendar, CalendarDays, Ticket, AlertTriangle, PackageSearch, ShieldAlert, Languages, Mic, ArrowRightLeft, Volume2 } from 'lucide-react';

export default function FanApp() {
  const [activeTab, setActiveTab] = useState('home');
  const [itinerary, setItinerary] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [form, setForm] = useState({ arrivalTime: '18:00', seatNumber: 'Sec 112, Row F', team: 'Mexico' });
  
  // Chat State
  const [messages, setMessages] = useState([{ role: 'model', content: "Hi! I'm your Stadium AI Assistant. How can I help you have the perfect match day?" }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showARMap, setShowARMap] = useState(false);
  const [selectedStadium, setSelectedStadium] = useState('MetLife Stadium');
  const [actionModal, setActionModal] = useState<string | null>(null);
  const [actionStatus, setActionStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [incidentLocation, setIncidentLocation] = useState('Seat (Sec 112)');
  const [lostLocation, setLostLocation] = useState('Seat (Sec 112)');
  const [isListening, setIsListening] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translateInput, setTranslateInput] = useState('');
  const [sourceLang, setSourceLang] = useState('English');
  const [targetLang, setTargetLang] = useState('Español');
  const [translationLog, setTranslationLog] = useState([
    { source: "Where is the nearest entrance to sector 112?", target: "¿Dónde está la entrada más cercana al sector 112?", srcLang: "English", tgtLang: "Español" }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Dynamic wait times based on selected stadium
  const liveWaitTimes = useMemo(() => {
    const seed = selectedStadium.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return {
      food: (seed * 3) % 15 + 2,
      merch: (seed * 7) % 25 + 5,
      restroom: (seed * 5) % 8 + 1,
      entrance: (seed * 11) % 35 + 10,
    };
  }, [selectedStadium]);

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
    <div className="bg-black h-[100dvh] overflow-hidden font-sans text-slate-100 selection:bg-emerald-500/30 flex justify-center">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-md bg-slate-950 h-full relative shadow-2xl flex flex-col border-x border-slate-900/50">
        
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
              {messages.length === 1 ? (
                <div className="flex-1 p-6 overflow-y-auto">
                  <h2 className="text-3xl font-black mb-2 mt-4 text-white">Ask the fan concierge</h2>
                  <p className="text-sm text-slate-400 mb-8 leading-relaxed">
                    Tickets, gates, food, accessibility, transport, sustainability and more — in your language.
                  </p>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-bold text-slate-200 block mb-2">Venue (optional)</label>
                      <select className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors appearance-none text-slate-200">
                        <option>Levi's Stadium — Santa Clara, CA</option>
                        <option>MetLife Stadium — East Rutherford, NJ</option>
                        <option>Estadio Azteca — Mexico City</option>
                        <option>AT&T Stadium — Arlington, TX</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-bold text-slate-200 block mb-2">Your question</label>
                      <div className="relative">
                        <textarea 
                          value={input}
                          onChange={e => setInput(e.target.value)}
                          placeholder="How do I get here by public transit?"
                          className="w-full h-32 bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm focus:outline-none focus:border-emerald-500 transition-colors text-slate-200 resize-none shadow-inner"
                        />
                        <div className="absolute bottom-3 right-3 flex items-center justify-center gap-1 bg-white p-1 rounded-full px-2">
                          <MessageCircle size={16} className="text-emerald-500 fill-emerald-500" />
                          <span className="text-emerald-600 font-black text-xs italic tracking-tighter">G</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {[
                        "Where is the nearest step-free route?",
                        "What food options are halal or vegan?",
                        "How do I get here by public transit?",
                        "Where can I recycle?"
                      ].map((chip, i) => (
                        <button 
                          key={i}
                          onClick={() => setInput(chip)}
                          className="bg-slate-900/50 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium py-2 px-4 rounded-full transition-colors text-left"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>

                    <button 
                      onClick={sendMessage}
                      disabled={!input.trim() || isTyping}
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 px-8 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 mt-4 shadow-lg shadow-emerald-500/20"
                    >
                      Ask
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="px-6 py-4 border-b border-slate-800/50 bg-slate-900/30">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <MessageCircle className="text-emerald-400" size={20} />
                      Fan Concierge
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">Live AI Assistant for your Match Day</p>
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
                        placeholder="Ask the concierge..."
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
                </>
              )}
            </div>
          )}

          {/* ---- TRANSLATE TAB ---- */}
          {activeTab === 'translate' && (
            <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="p-6 pb-2">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Languages className="text-emerald-400" size={20} />
                  Live AI Translator
                </h2>
                
                {/* Language Selector */}
                <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-2 rounded-2xl mb-6 shadow-sm">
                  <select 
                    value={sourceLang}
                    onChange={(e) => setSourceLang(e.target.value)}
                    className="bg-transparent text-white font-bold px-3 py-2 outline-none appearance-none cursor-pointer flex-1 text-center"
                  >
                    <option value="English">English</option>
                    <option value="Español">Español</option>
                    <option value="Français">Français</option>
                    <option value="Português">Português</option>
                    <option value="Deutsch">Deutsch</option>
                    <option value="العربية">العربية</option>
                    <option value="日本語">日本語</option>
                    <option value="한국어">한국어</option>
                    <option value="中文">中文</option>
                    <option value="हिन्दी">हिन्दी</option>
                  </select>
                  
                  <button 
                    aria-label="Swap Languages"
                    onClick={() => {
                      const temp = sourceLang;
                      setSourceLang(targetLang);
                      setTargetLang(temp);
                    }}
                    className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:text-emerald-400 transition-colors shrink-0"
                  >
                    <ArrowRightLeft size={16} />
                  </button>
                  
                  <select 
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    className="bg-transparent text-emerald-400 font-bold px-3 py-2 outline-none appearance-none cursor-pointer flex-1 text-center"
                  >
                    <option value="English">English</option>
                    <option value="Español">Español</option>
                    <option value="Français">Français</option>
                    <option value="Português">Português</option>
                    <option value="Deutsch">Deutsch</option>
                    <option value="العربية">العربية</option>
                    <option value="日本語">日本語</option>
                    <option value="한국어">한국어</option>
                    <option value="中文">中文</option>
                    <option value="हिन्दी">हिन्दी</option>
                  </select>
                </div>
              </div>

                {/* Translation Log area */}
              <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-4">
                
                {translationLog.map((log, index) => (
                  <div key={index} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex flex-col gap-1 mt-4">
                      <div className="bg-slate-800/50 p-4 rounded-2xl rounded-tl-sm border border-slate-700/50">
                        <div className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">{log.srcLang}</div>
                        <p className="text-slate-200">{log.source}</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 items-end">
                      <div className="bg-emerald-900/20 p-4 rounded-2xl rounded-tr-sm border border-emerald-500/20">
                        <div className="flex justify-between items-center mb-1 gap-4">
                           <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">{log.tgtLang}</div>
                           <button 
                             aria-label="Speak Translation"
                             onClick={() => {
                               if ('speechSynthesis' in window) {
                                 window.speechSynthesis.cancel();
                                 const textToSpeak = log.target.replace(/\[.*?\]\s*/g, '');
                                 const utterance = new SpeechSynthesisUtterance(textToSpeak);
                                 const langMap: Record<string, string> = {
                                   'English': 'en-US', 'Español': 'es-ES', 'Français': 'fr-FR',
                                   'Português': 'pt-PT', 'Deutsch': 'de-DE', 'العربية': 'ar-SA',
                                   '日本語': 'ja-JP', '한국어': 'ko-KR', '中文': 'zh-CN', 'हिन्दी': 'hi-IN'
                                 };
                                 utterance.lang = langMap[log.tgtLang] || 'en-US';
                                 window.speechSynthesis.speak(utterance);
                               }
                             }}
                             className="text-emerald-500 hover:text-emerald-300 transition-colors bg-transparent border-none p-1 -m-1 outline-none"
                           >
                             <Volume2 size={16} />
                           </button>
                        </div>
                        <p className="text-emerald-50 text-right">{log.target}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {isListening && (
                  <div className="flex flex-col gap-1 items-center justify-center py-8">
                     <div className="flex gap-1 mb-2">
                       <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                       <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                       <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                     </div>
                     <p className="text-xs font-mono text-emerald-400 animate-pulse">Listening...</p>
                  </div>
                )}

                {isTranslating && (
                  <div className="flex flex-col gap-1 items-center justify-center py-8">
                     <div className="w-6 h-6 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-2"></div>
                     <p className="text-xs font-mono text-emerald-400 animate-pulse">Translating...</p>
                  </div>
                )}
                
              </div>

              {/* Translate Input Bar */}
              <div className="p-4 border-t border-slate-800/50 bg-slate-900/50 backdrop-blur-md pb-24 shrink-0">
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!translateInput.trim()) return;
                    setIsTranslating(true);
                    const inputText = translateInput;
                    setTranslateInput('');
                    
                    try {
                      const langMap: Record<string, string> = {
                        'English': 'en', 'Español': 'es', 'Français': 'fr',
                        'Português': 'pt', 'Deutsch': 'de', 'العربية': 'ar',
                        '日本語': 'ja', '한국어': 'ko', '中文': 'zh-CN', 'हिन्दी': 'hi'
                      };
                      const src = langMap[sourceLang] || 'en';
                      const tgt = langMap[targetLang] || 'es';
                      
                      const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${src}&tl=${tgt}&dt=t&q=${encodeURIComponent(inputText)}`);
                      const data = await res.json();
                      let translatedText = `[${targetLang}] ${inputText}`;
                      
                      if (data && data[0]) {
                        translatedText = data[0].map((item: unknown) => (item as string[])[0]).join('');
                      }

                      setTranslationLog(prev => [...prev, { 
                        source: inputText, 
                        target: translatedText, 
                        srcLang: sourceLang, 
                        tgtLang: targetLang 
                      }]);
                    } catch (err) {
                      setTranslationLog(prev => [...prev, { 
                        source: inputText, 
                        target: `[${targetLang}] ${inputText}`, 
                        srcLang: sourceLang, 
                        tgtLang: targetLang 
                      }]);
                    } finally {
                      setIsTranslating(false);
                    }
                  }}
                  className="flex gap-2 relative items-center"
                >
                  <input 
                    type="text"
                    value={translateInput}
                    onChange={(e) => setTranslateInput(e.target.value)}
                    placeholder="Type to translate..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-full px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors text-slate-200 text-sm"
                  />
                  
                  <button 
                    type="button"
                    aria-label="Voice Translate Mock"
                    onPointerDown={() => setIsListening(true)}
                    onPointerUp={async () => {
                      setIsListening(false);
                      setIsTranslating(true);
                      
                      const mocks = [
                        "Can I get two hot dogs and a large beer please?",
                        "Where is the merchandise stand?",
                        "What a spectacular goal that was!"
                      ];
                      const inputText = mocks[translationLog.length % mocks.length];

                      try {
                        const langMap: Record<string, string> = {
                          'English': 'en', 'Español': 'es', 'Français': 'fr',
                          'Português': 'pt', 'Deutsch': 'de', 'العربية': 'ar',
                          '日本語': 'ja', '한국어': 'ko', '中文': 'zh-CN', 'हिन्दी': 'hi'
                        };
                        const src = 'en'; // mocks are in english
                        const tgt = langMap[targetLang] || 'es';
                        
                        const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${src}&tl=${tgt}&dt=t&q=${encodeURIComponent(inputText)}`);
                        const data = await res.json();
                        let translatedText = `[${targetLang}] ${inputText}`;
                        
                        if (data && data[0]) {
                          translatedText = data[0].map((item: unknown) => (item as string[])[0]).join('');
                        }

                        setTranslationLog(prev => [...prev, { 
                          source: inputText, 
                          target: translatedText, 
                          srcLang: 'English', 
                          tgtLang: targetLang 
                        }]);
                      } catch (err) {
                        setTranslationLog(prev => [...prev, { 
                          source: inputText, 
                          target: `[${targetLang}] ${inputText}`, 
                          srcLang: 'English', 
                          tgtLang: targetLang 
                        }]);
                      } finally {
                        setIsTranslating(false);
                      }
                    }}
                    onPointerLeave={() => setIsListening(false)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${isListening ? 'bg-emerald-500 text-slate-950 animate-pulse' : 'bg-slate-800 text-emerald-400 hover:bg-slate-700'}`}
                  >
                    <Mic size={20} />
                  </button>

                  <button 
                    type="submit" 
                    disabled={!translateInput.trim() || isTranslating}
                    className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-slate-950 hover:bg-emerald-400 transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={20} />
                  </button>
                </form>
              </div>

            </div>
          )}

          {/* ---- EXPLORE TAB ---- */}
          {activeTab === 'explore' && (
            <div className="p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Map className="text-emerald-400" size={20} />
                Explore {selectedStadium}
              </h2>
              
              <div 
                onClick={() => setShowARMap(true)}
                className="relative h-48 bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-lg group cursor-pointer flex items-center justify-center"
              >
                 {/* Fake Map Background */}
                 <div className="absolute inset-0 opacity-20 group-hover:scale-105 transition-transform duration-700" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(16,185,129,0.15) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                 <div className="text-center z-10">
                   <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3 ring-4 ring-emerald-500/10 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors duration-300">
                     <MapPin size={24} />
                   </div>
                   <div className="font-bold text-white group-hover:text-emerald-400 transition-colors">Interactive Stadium Map</div>
                   <div className="text-xs text-slate-400 mt-1 group-hover:text-emerald-500 transition-colors flex items-center justify-center gap-1">Tap to open AR view <ChevronRight size={14}/></div>
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
                    <div className={`text-2xl font-black ${liveWaitTimes.food > 10 ? 'text-amber-400' : 'text-emerald-400'}`}>{liveWaitTimes.food} min</div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm">
                    <div className="text-slate-400 mb-2"><Search size={20} /></div>
                    <div className="font-bold text-sm mb-1 text-white">Merch Store 3</div>
                    <div className={`text-2xl font-black ${liveWaitTimes.merch > 15 ? 'text-red-400' : (liveWaitTimes.merch > 8 ? 'text-amber-400' : 'text-emerald-400')}`}>{liveWaitTimes.merch} min</div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm">
                    <div className="text-slate-400 mb-2"><MapPin size={20} /></div>
                    <div className="font-bold text-sm mb-1 text-white">Gate C Restrooms</div>
                    <div className={`text-2xl font-black ${liveWaitTimes.restroom > 5 ? 'text-amber-400' : 'text-emerald-400'}`}>{liveWaitTimes.restroom} min</div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm">
                    <div className="text-slate-400 mb-2"><MapPin size={20} /></div>
                    <div className="font-bold text-sm mb-1 text-white">Main Entrance</div>
                    <div className={`text-2xl font-black ${liveWaitTimes.entrance > 20 ? 'text-red-400' : (liveWaitTimes.entrance > 10 ? 'text-amber-400' : 'text-emerald-400')}`}>{liveWaitTimes.entrance} min</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4 mt-8">Stadium Services</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    onClick={() => { setActionModal('incident'); setActionStatus('idle'); }}
                    className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm cursor-pointer hover:border-red-500/50 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <AlertTriangle size={20} />
                    </div>
                    <div className="font-bold text-white text-sm mb-1">Log Incident</div>
                    <div className="text-xs text-slate-400">Report safety concerns instantly.</div>
                  </div>
                  
                  <div 
                    onClick={() => { setActionModal('lost'); setActionStatus('idle'); }}
                    className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm cursor-pointer hover:border-amber-500/50 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <PackageSearch size={20} />
                    </div>
                    <div className="font-bold text-white text-sm mb-1">Lost & Found</div>
                    <div className="text-xs text-slate-400">Report missing items here.</div>
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
                Host Stadiums & Maps
              </h2>
              <p className="text-sm text-slate-400 mb-6">Explore the 16 iconic venues, match allocations, and seating plans.</p>
              
              <div className="space-y-4">
                {[
                  { city: "New York/NJ", name: "MetLife Stadium", capacity: "82,500", matches: "8 Matches (Final)", region: "East" },
                  { city: "Dallas", name: "AT&T Stadium", capacity: "80,000", matches: "9 Matches", region: "Central" },
                  { city: "Mexico City", name: "Estadio Azteca", capacity: "83,000", matches: "5 Matches (Opening)", region: "Mexico" },
                  { city: "Atlanta", name: "Mercedes-Benz Stadium", capacity: "71,000", matches: "8 Matches", region: "East" },
                  { city: "Los Angeles", name: "SoFi Stadium", capacity: "70,000", matches: "8 Matches", region: "West" },
                  { city: "Miami", name: "Hard Rock Stadium", capacity: "65,000", matches: "7 Matches", region: "East" },
                  { city: "Houston", name: "NRG Stadium", capacity: "72,000", matches: "7 Matches", region: "Central" },
                  { city: "Vancouver", name: "BC Place", capacity: "54,500", matches: "7 Matches", region: "Canada" },
                  { city: "Boston", name: "Gillette Stadium", capacity: "65,000", matches: "7 Matches", region: "East" },
                  { city: "Kansas City", name: "Arrowhead Stadium", capacity: "76,000", matches: "6 Matches", region: "Central" },
                  { city: "Philadelphia", name: "Lincoln Financial Field", capacity: "69,000", matches: "6 Matches", region: "East" },
                  { city: "Seattle", name: "Lumen Field", capacity: "69,000", matches: "6 Matches", region: "West" },
                  { city: "San Francisco", name: "Levi's Stadium", capacity: "68,500", matches: "6 Matches", region: "West" },
                  { city: "Toronto", name: "BMO Field", capacity: "45,000", matches: "6 Matches", region: "Canada" },
                  { city: "Monterrey", name: "Estadio BBVA", capacity: "53,500", matches: "4 Matches", region: "Mexico" },
                  { city: "Guadalajara", name: "Estadio Akron", capacity: "48,000", matches: "4 Matches", region: "Mexico" },
                ].map((stadium, i) => (
                  <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm group">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider mb-1">{stadium.city}</div>
                        <div className="font-bold text-white text-lg">{stadium.name}</div>
                      </div>
                      <div className="bg-slate-800 px-3 py-1 rounded-full text-xs font-bold text-emerald-400 whitespace-nowrap">
                        {stadium.matches}
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="text-xs text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span><User size={12} className="inline mr-1"/>{stadium.capacity}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                        <span>{stadium.region}</span>
                      </div>
                      <button 
                        onClick={() => {
                          setSelectedStadium(stadium.name);
                          setActiveTab('explore');
                        }}
                        className="flex items-center gap-1 text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <MapPin size={12} /> Seating Plan
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ---- MATCHES TAB ---- */}
          {activeTab === 'matches' && (
            <div className="p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                <CalendarDays className="text-emerald-400" size={20} />
                Tournament Match Plan
              </h2>
              <p className="text-sm text-slate-400 mb-6">Key dates and fixtures for the biggest World Cup in history (104 matches).</p>

              <div className="space-y-6">
                {/* Milestone 1 */}
                <div className="relative pl-6 border-l-2 border-slate-800">
                  <div className="absolute w-3 h-3 bg-emerald-500 rounded-full -left-[7px] top-1 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                  <div className="text-emerald-400 font-bold text-sm mb-1">June 11, 2026</div>
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mt-2 shadow-lg">
                    <h4 className="font-bold text-white">Opening Match</h4>
                    <p className="text-xs text-slate-400 mt-1">Mexico plays the inaugural match of the tournament.</p>
                    <div className="flex items-center gap-2 mt-3 text-xs text-slate-300 font-medium bg-slate-950 px-3 py-2 rounded-lg w-fit border border-slate-800">
                      <MapPin size={14} className="text-emerald-400" /> Estadio Azteca, Mexico City
                    </div>
                  </div>
                </div>

                {/* Milestone 2 */}
                <div className="relative pl-6 border-l-2 border-slate-800">
                  <div className="absolute w-3 h-3 bg-emerald-500 rounded-full -left-[7px] top-1"></div>
                  <div className="text-emerald-400 font-bold text-sm mb-1">June 12, 2026</div>
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mt-2">
                    <h4 className="font-bold text-white">USA & Canada Openers</h4>
                    <p className="text-xs text-slate-400 mt-1">USMNT opens in LA. Canada opens in Toronto.</p>
                    <div className="flex flex-col gap-2 mt-3 text-xs text-slate-300 font-medium">
                      <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-lg border border-slate-800"><MapPin size={14} className="text-emerald-400" /> SoFi Stadium, LA</div>
                      <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-lg border border-slate-800"><MapPin size={14} className="text-emerald-400" /> BMO Field, Toronto</div>
                    </div>
                  </div>
                </div>

                {/* Milestone 3 */}
                <div className="relative pl-6 border-l-2 border-slate-800">
                  <div className="absolute w-3 h-3 bg-emerald-500 rounded-full -left-[7px] top-1"></div>
                  <div className="text-emerald-400 font-bold text-sm mb-1">June 11 - 27, 2026</div>
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mt-2">
                    <h4 className="font-bold text-white">Group Stage (72 Matches)</h4>
                    <p className="text-xs text-slate-400 mt-1">12 groups of 4 teams. Top 2 and 8 best 3rd-place advance.</p>
                  </div>
                </div>

                {/* Milestone 4 */}
                <div className="relative pl-6 border-l-2 border-slate-800">
                  <div className="absolute w-3 h-3 bg-emerald-500 rounded-full -left-[7px] top-1"></div>
                  <div className="text-emerald-400 font-bold text-sm mb-1">June 28 - July 18, 2026</div>
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mt-2">
                    <h4 className="font-bold text-white">Knockout Rounds</h4>
                    <p className="text-xs text-slate-400 mt-1">Round of 32, Round of 16, Quarter-finals, and Semi-finals.</p>
                  </div>
                </div>

                {/* Milestone 5 */}
                <div className="relative pl-6 border-l-2 border-transparent">
                  <div className="absolute w-4 h-4 bg-amber-500 rounded-full -left-[8px] top-1 shadow-[0_0_15px_rgba(245,158,11,0.6)]"></div>
                  <div className="text-amber-400 font-bold text-sm mb-1">July 19, 2026</div>
                  <div className="bg-gradient-to-br from-slate-900 to-amber-950/20 border border-amber-900/50 rounded-xl p-4 mt-2 shadow-lg">
                    <h4 className="font-bold text-white">The Final</h4>
                    <p className="text-xs text-slate-400 mt-1">The culmination of the 2026 World Cup.</p>
                    <div className="flex items-center gap-2 mt-3 text-xs text-slate-300 font-medium bg-slate-950/50 px-3 py-2 rounded-lg w-fit border border-amber-900/30">
                      <Trophy size={14} className="text-amber-400" /> MetLife Stadium, New York/NJ
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
        </main>

        {/* AR MAP MODAL */}
        {showARMap && (
          <div className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl flex flex-col animate-in fade-in zoom-in-95 duration-300">
            <div className="p-6 flex justify-between items-center border-b border-slate-800/50 bg-slate-900/20">
              <div>
                <h3 className="font-black text-white flex items-center gap-2">
                  <MapPin className="text-emerald-400" size={18} />
                  Live AR Map
                </h3>
                <p className="text-[10px] text-emerald-500 font-mono tracking-widest uppercase mt-1">Connecting to Stadium Network...</p>
              </div>
              <button 
                onClick={() => setShowARMap(false)}
                className="w-10 h-10 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center hover:bg-slate-700 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="flex-1 relative flex items-center justify-center overflow-hidden">
              {/* Radar Grid */}
              <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(16,185,129,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
              
              {/* Radar Sweep Animation (using CSS via style block) */}
              <style dangerouslySetInnerHTML={{__html: `
                @keyframes radar-spin {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
                @keyframes pulse-ring {
                  0% { transform: scale(0.8); opacity: 0.5; }
                  100% { transform: scale(1.5); opacity: 0; }
                }
                @keyframes blink-dot {
                  0%, 100% { opacity: 1; transform: scale(1); }
                  50% { opacity: 0.4; transform: scale(0.8); }
                }
              `}} />

              {/* Central Map Visual */}
              <div className="relative w-80 h-80 rounded-full border border-emerald-500/30 flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                {/* Radar Sweep */}
                <div 
                  className="absolute inset-0 rounded-full" 
                  style={{ 
                    background: 'conic-gradient(from 0deg, transparent 70%, rgba(16,185,129,0.4) 100%)',
                    animation: 'radar-spin 4s linear infinite'
                  }}
                />
                {/* Rings */}
                <div className="absolute w-60 h-60 rounded-full border border-emerald-500/20" />
                <div className="absolute w-40 h-40 rounded-full border border-emerald-500/20" />
                
                {/* Pulse */}
                <div className="absolute inset-0 rounded-full border-2 border-emerald-400" style={{ animation: 'pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite' }} />
                
                {/* Stadium Pitch */}
                <div className="relative w-24 h-36 border-2 border-emerald-400 rounded-lg flex flex-col items-center justify-between p-2 z-10 bg-slate-950/50 backdrop-blur-sm shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  <div className="w-10 h-4 border border-emerald-400 rounded-b-sm border-t-0" />
                  <div className="w-full h-px bg-emerald-400 absolute top-1/2 left-0" />
                  <div className="w-8 h-8 rounded-full border border-emerald-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  <div className="w-10 h-4 border border-emerald-400 rounded-t-sm border-b-0" />
                </div>

                {/* POI Dots */}
                <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-blue-400 rounded-full shadow-[0_0_10px_rgba(96,165,250,0.8)]" style={{ animation: 'blink-dot 1.5s ease-in-out infinite' }} />
                <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-amber-400 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.8)]" style={{ animation: 'blink-dot 2s ease-in-out infinite 0.5s' }} />
                <div className="absolute top-1/2 right-6 w-4 h-4 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.8)] flex items-center justify-center" style={{ animation: 'blink-dot 1s ease-in-out infinite' }}>
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                </div>
              </div>

              {/* Data Overlay */}
              <div className="absolute bottom-8 left-6 right-6">
                 <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 p-4 rounded-2xl shadow-2xl">
                    <div className="flex items-center gap-3 mb-2">
                       <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                       <span className="text-sm font-bold text-slate-200">Your Seat (Sec 112)</span>
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                       <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                       <span className="text-sm font-bold text-slate-200">Nearest Restroom (4 min)</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                       <span className="text-sm font-bold text-slate-200">Gate C Entrance (High Traffic)</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* ACTION MODALS */}
        {actionModal && (
          <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-200">
             <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl w-full max-w-sm">
                
                {actionStatus === 'processing' && (
                  <div className="py-12 flex flex-col items-center justify-center animate-in fade-in">
                     <div className="w-12 h-12 border-4 border-slate-800 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
                     <p className="text-slate-400 font-mono text-sm animate-pulse">Transmitting to Command Center...</p>
                  </div>
                )}

                {actionStatus === 'success' && actionModal === 'incident' && (
                  <div className="animate-in zoom-in-95 duration-300">
                     <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 mb-6">
                        <div className="flex items-center gap-3 mb-3 border-b border-slate-800 pb-3">
                           <div className="w-8 h-8 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center">
                              <ShieldAlert size={16} />
                           </div>
                           <div>
                              <div className="font-bold text-white text-sm">Security Operations</div>
                              <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> LIVE AGENT CONNECTED
                              </div>
                           </div>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed italic">
                          "Report received. A security unit from the nearest sector has been dispatched to <strong>{incidentLocation}</strong> and will arrive in approximately 90 seconds. Please stand by."
                        </p>
                     </div>
                     <button 
                        onClick={() => setActionModal(null)}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-colors"
                      >
                        Close Channel
                      </button>
                  </div>
                )}

                {actionStatus === 'success' && actionModal === 'lost' && (
                  <div className="animate-in zoom-in-95 duration-300">
                     <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 mb-6">
                        <div className="flex items-center gap-3 mb-3 border-b border-slate-800 pb-3">
                           <div className="w-8 h-8 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center">
                              <User size={16} />
                           </div>
                           <div>
                              <div className="font-bold text-white text-sm">Guest Services AI</div>
                              <div className="text-[10px] text-blue-400 font-mono flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></span> AUTOMATED SYSTEM
                              </div>
                           </div>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed italic">
                          "Your item has been logged. Our Guest Services team stationed near <strong>{lostLocation}</strong> has been alerted and is currently scanning the area. We will notify you if a match is found."
                        </p>
                     </div>
                     <button 
                        onClick={() => setActionModal(null)}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-colors"
                      >
                        Close System
                      </button>
                  </div>
                )}

                {actionStatus === 'idle' && actionModal === 'incident' && (
                  <div className="animate-in fade-in duration-200">
                    <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <AlertTriangle size={24} />
                    </div>
                    <h3 className="font-black text-white text-center text-xl mb-2">Log an Incident</h3>
                    <p className="text-xs text-slate-400 text-center mb-6">Security will be dispatched to your selected location at {selectedStadium}. This report is anonymous.</p>
                    
                    <select 
                      value={incidentLocation}
                      onChange={(e) => setIncidentLocation(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 transition-colors text-slate-200 mb-4 appearance-none"
                    >
                      <option value="Seat (Sec 112)">Your Seat (Sec 112)</option>
                      <option value="Gate C Entrance">Gate C Entrance</option>
                      <option value="Concourse B Food">Concourse B Food</option>
                      <option value="Merch Store 3">Merch Store 3</option>
                      <option value="Nearest Restrooms">Nearest Restrooms</option>
                    </select>

                    <textarea 
                      placeholder="Describe the incident (e.g., Spill in Sec 112, rowdy fan)..."
                      className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-red-500 transition-colors text-slate-200 resize-none mb-4"
                    ></textarea>
                    
                    <button 
                      onClick={() => {
                        setActionStatus('processing');
                        setTimeout(() => setActionStatus('success'), 1500);
                      }}
                      className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-colors mb-3"
                    >
                      Submit Report
                    </button>
                    <button 
                      onClick={() => setActionModal(null)}
                      className="w-full text-slate-400 hover:text-white font-bold py-2 text-sm transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {actionStatus === 'idle' && actionModal === 'lost' && (
                  <div className="animate-in fade-in duration-200">
                    <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <PackageSearch size={24} />
                    </div>
                    <h3 className="font-black text-white text-center text-xl mb-2">Lost & Found</h3>
                    <p className="text-xs text-slate-400 text-center mb-6">Connect with the {selectedStadium} lost & found department.</p>
                    
                    <select 
                      value={lostLocation}
                      onChange={(e) => setLostLocation(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors text-slate-200 mb-4 appearance-none"
                    >
                      <option value="Seat (Sec 112)">Lost/Found at Seat (Sec 112)</option>
                      <option value="Gate C Entrance">Lost/Found at Gate C</option>
                      <option value="Concourse B Food">Lost/Found at Concourse B</option>
                      <option value="Merch Store 3">Lost/Found at Merch Store 3</option>
                      <option value="Nearest Restrooms">Lost/Found in Restrooms</option>
                    </select>

                    <input 
                      type="text"
                      placeholder="What did you lose? (e.g., Blue cap)"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors text-slate-200 mb-4"
                    />
                    
                    <button 
                      onClick={() => {
                        setActionStatus('processing');
                        setTimeout(() => setActionStatus('success'), 1500);
                      }}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 rounded-xl transition-colors mb-3"
                    >
                      Report Lost Item
                    </button>
                    <button 
                      onClick={() => {
                        setActionStatus('processing');
                        setTimeout(() => setActionStatus('success'), 1500);
                      }}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-colors mb-3"
                    >
                      I Found an Item
                    </button>
                    <button 
                      onClick={() => setActionModal(null)}
                      className="w-full text-slate-400 hover:text-white font-bold py-2 text-sm transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
             </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <nav className="absolute bottom-0 w-full bg-slate-950/80 backdrop-blur-xl border-t border-slate-900/80 px-2 py-4 pb-8 flex justify-around items-center z-20">
          <button 
            aria-label="Navigate to Home"
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center p-2 rounded-xl flex-1 transition-all ${activeTab === 'home' ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Home size={20} className="mb-1" />
            <span className="text-[10px] font-bold">Home</span>
          </button>
          
          <button 
            aria-label="Navigate to Matches"
            onClick={() => setActiveTab('matches')}
            className={`flex flex-col items-center justify-center p-2 rounded-xl flex-1 transition-all ${activeTab === 'matches' ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <CalendarDays size={20} className="mb-1" />
            <span className="text-[10px] font-bold">Matches</span>
          </button>

          <button 
            aria-label="Navigate to Stadiums"
            onClick={() => setActiveTab('stadiums')}
            className={`flex flex-col items-center justify-center p-2 rounded-xl flex-1 transition-all ${activeTab === 'stadiums' ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <MapPin size={20} className="mb-1" />
            <span className="text-[10px] font-bold">Stadiums</span>
          </button>

          <button 
            aria-label="Navigate to Translate"
            onClick={() => setActiveTab('translate')}
            className={`flex flex-col items-center justify-center p-2 rounded-xl flex-1 transition-all ${activeTab === 'translate' ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Languages size={20} className="mb-1" />
            <span className="text-[10px] font-bold">Translate</span>
          </button>

          <button 
            aria-label="Navigate to Concierge"
            onClick={() => setActiveTab('assistant')}
            className={`flex flex-col items-center justify-center p-2 rounded-xl flex-1 transition-all ${activeTab === 'assistant' ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <MessageCircle size={20} className="mb-1" />
            <span className="text-[10px] font-bold">Concierge</span>
          </button>

          <button 
            aria-label="Navigate to Explore"
            onClick={() => setActiveTab('explore')}
            className={`flex flex-col items-center justify-center p-2 rounded-xl flex-1 transition-all ${activeTab === 'explore' ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Map size={20} className="mb-1" />
            <span className="text-[10px] font-bold">Explore</span>
          </button>
        </nav>

      </div>
    </div>
  );
}
