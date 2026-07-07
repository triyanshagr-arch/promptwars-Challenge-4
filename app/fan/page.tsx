'use client';
import { useState, useRef, useEffect } from 'react';
import { Send, MapPin, AlertTriangle, MessageSquare, Clock, Search, Image as ImageIcon, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FanCompanion() {
  const [activeTab, setActiveTab] = useState('chat'); // chat, itinerary, lostfound
  
  // Chat State
  const [messages, setMessages] = useState<{role: 'user'|'ai', text: string, image?: string}[]>([
    { role: 'ai', text: 'Welcome to StadiumSync! How can I help you today? You can ask for directions, food recommendations, transit info, or report an issue. You can also upload a photo of a sign or food stall!' }
  ]);
  const [input, setInput] = useState('');
  const [imageUpload, setImageUpload] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Report State
  const [isReporting, setIsReporting] = useState(false);
  const [reportLocation, setReportLocation] = useState('');
  const [reportDesc, setReportDesc] = useState('');

  // Itinerary State
  const [seat, setSeat] = useState('');
  const [diet, setDiet] = useState('');
  const [itinerary, setItinerary] = useState<any[] | null>(null);
  const [isLoadingItinerary, setIsLoadingItinerary] = useState(false);

  // Lost & Found State
  const [lostItem, setLostItem] = useState('');
  const [lostLocation, setLostLocation] = useState('');
  const [isLostReported, setIsLostReported] = useState(false);

  useEffect(() => {
    if (activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeTab]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !imageUpload) return;
    
    const newMessages = [...messages, { role: 'user' as const, text: input, image: imageUpload || undefined }];
    setMessages(newMessages);
    setInput('');
    const currentImage = imageUpload;
    setImageUpload(null);
    
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, history: newMessages, image: currentImage })
      });
      const data = await res.json();
      if (data.reply) {
        setMessages([...newMessages, { role: 'ai', text: data.reply }]);
      } else {
        setMessages([...newMessages, { role: 'ai', text: `API Error: ${data.error || 'Unknown error'}` }]);
      }
    } catch (e) {
      setMessages([...newMessages, { role: 'ai', text: 'Sorry, I am having trouble connecting right now.' }]);
    }
  };

  const submitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportLocation || !reportDesc) return;
    
    try {
      await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location: reportLocation, description: reportDesc, source: 'fan_app' })
      });
      setIsReporting(false);
      setReportLocation('');
      setReportDesc('');
      setMessages([...messages, { role: 'ai', text: 'Thank you for reporting this issue. Stadium staff have been notified and are on it!' }]);
    } catch (e) {
      alert("Failed to submit report");
    }
  };

  const generateItinerary = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingItinerary(true);
    try {
      const res = await fetch('/api/itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seat, preferences: diet })
      });
      const data = await res.json();
      setItinerary(data.itinerary);
    } catch (e) {
      alert("Failed to generate itinerary");
    }
    setIsLoadingItinerary(false);
  };

  const reportLostItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/lostandfound', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'lost', item: { description: lostItem, location: lostLocation } })
      });
      setIsLostReported(true);
      setLostItem('');
      setLostLocation('');
    } catch (e) {
      alert("Failed to report lost item");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 max-w-md mx-auto relative overflow-hidden shadow-2xl border-x border-slate-800">
      <header className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center z-10">
        <h1 className="font-bold text-xl text-emerald-400 tracking-tight">StadiumSync <span className="text-slate-400 text-sm">FAN</span></h1>
        <button onClick={() => setIsReporting(!isReporting)} className="bg-red-500/20 text-red-400 p-2 rounded-full hover:bg-red-500/30 transition-colors">
          <AlertTriangle size={20} />
        </button>
      </header>

      {isReporting ? (
        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} className="flex-1 p-6 flex flex-col bg-slate-900 z-20 absolute inset-0 top-[73px]">
          <h2 className="text-2xl font-bold mb-4 text-red-400">Report an Issue</h2>
          <form onSubmit={submitReport} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Where are you?</label>
              <div className="flex bg-slate-800 rounded-lg p-3 border border-slate-700">
                <MapPin className="text-slate-500 mr-2" size={20} />
                <input required value={reportLocation} onChange={e => setReportLocation(e.target.value)} type="text" placeholder="e.g. Section 104, Gate C" className="bg-transparent outline-none w-full" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">What's happening?</label>
              <textarea required value={reportDesc} onChange={e => setReportDesc(e.target.value)} placeholder="e.g. Spilled soda, need medical help..." className="w-full bg-slate-800 rounded-lg p-3 border border-slate-700 outline-none min-h-[120px] resize-none"></textarea>
            </div>
            <div className="flex gap-3 mt-4">
              <button type="button" onClick={() => setIsReporting(false)} className="flex-1 py-3 rounded-lg font-medium bg-slate-800 text-slate-300">Cancel</button>
              <button type="submit" className="flex-1 py-3 rounded-lg font-medium bg-red-500 text-white shadow-lg shadow-red-500/20">Send Report</button>
            </div>
          </form>
        </motion.div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden relative pb-[70px]">
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col h-full">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl p-4 flex flex-col gap-2 ${m.role === 'user' ? 'bg-emerald-500 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 rounded-bl-none shadow-md'}`}>
                      {m.image && <img src={m.image} alt="Upload" className="rounded-lg max-w-full" />}
                      {m.text && <span>{m.text}</span>}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-col gap-2">
                {imageUpload && (
                  <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-lg border border-emerald-500/30">
                    <img src={imageUpload} alt="Preview" className="w-10 h-10 object-cover rounded" />
                    <span className="text-xs text-emerald-400">Image attached</span>
                    <button onClick={() => setImageUpload(null)} className="ml-auto text-red-400 text-xs px-2">Remove</button>
                  </div>
                )}
                <form onSubmit={sendMessage} className="flex items-center gap-2">
                  <div className="flex-1 bg-slate-800 rounded-full flex items-center px-2 border border-slate-700 focus-within:border-emerald-500/50 transition-colors">
                    <label className="p-2 text-slate-400 hover:text-emerald-400 cursor-pointer">
                      <ImageIcon size={20} />
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                    <input value={input} onChange={e => setInput(e.target.value)} type="text" placeholder="Ask anything..." className="flex-1 bg-transparent py-3 outline-none" />
                  </div>
                  <button type="submit" className="bg-emerald-500 hover:bg-emerald-400 p-3 rounded-full text-white transition-colors shadow-lg shadow-emerald-500/20">
                    <Send size={20} />
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'itinerary' && (
            <div className="flex-1 overflow-y-auto p-6 animate-in fade-in">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Clock className="text-emerald-400"/> Smart Itinerary</h2>
              <form onSubmit={generateItinerary} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 mb-6">
                <div className="mb-4">
                  <label className="block text-sm text-slate-400 mb-1">Seat Number</label>
                  <input required value={seat} onChange={e => setSeat(e.target.value)} type="text" placeholder="e.g. Section 104, Row G" className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 outline-none focus:border-emerald-500/50" />
                </div>
                <div className="mb-6">
                  <label className="block text-sm text-slate-400 mb-1">Preferences / Diet</label>
                  <input value={diet} onChange={e => setDiet(e.target.value)} type="text" placeholder="e.g. Vegan, No stairs" className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 outline-none focus:border-emerald-500/50" />
                </div>
                <button disabled={isLoadingItinerary} type="submit" className="w-full bg-emerald-500 text-slate-950 font-bold py-3 rounded-lg disabled:opacity-50 transition-opacity">
                  {isLoadingItinerary ? 'Generating AI Itinerary...' : 'Create My Day'}
                </button>
              </form>

              {itinerary && (
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
                  {itinerary.map((step, i) => (
                    <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-900 group-[.is-active]:bg-emerald-500 text-slate-500 group-[.is-active]:text-emerald-50 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow flex-col text-xs z-10">
                        {step.time.split(' ')[0]}
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-900 border border-slate-800 p-4 rounded-xl shadow">
                        <h4 className="font-bold text-lg mb-1">{step.event}</h4>
                        <p className="text-sm text-slate-400">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'lostfound' && (
            <div className="flex-1 overflow-y-auto p-6 animate-in fade-in">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Search className="text-emerald-400"/> Lost & Found</h2>
              
              {isLostReported ? (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="text-emerald-500" size={32} />
                  </div>
                  <h3 className="font-bold text-xl text-emerald-400 mb-2">Report Submitted</h3>
                  <p className="text-slate-300">Our AI is scanning found items and will notify you if a match is detected.</p>
                  <button onClick={() => setIsLostReported(false)} className="mt-6 text-sm text-slate-400 underline">Report another item</button>
                </div>
              ) : (
                <form onSubmit={reportLostItem} className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                  <p className="text-slate-400 text-sm mb-6">Describe what you lost. Our AI Matcher continuously scans items turned in to security.</p>
                  <div className="mb-4">
                    <label className="block text-sm text-slate-400 mb-1">Item Description</label>
                    <textarea required value={lostItem} onChange={e => setLostItem(e.target.value)} placeholder="e.g. Red Nike baseball cap with a white swoosh" className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 outline-none focus:border-emerald-500/50 resize-none min-h-[100px]" />
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm text-slate-400 mb-1">Last Seen Location (Optional)</label>
                    <input value={lostLocation} onChange={e => setLostLocation(e.target.value)} type="text" placeholder="e.g. Restroom near Gate B" className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 outline-none focus:border-emerald-500/50" />
                  </div>
                  <button type="submit" className="w-full bg-emerald-500 text-slate-950 font-bold py-3 rounded-lg transition-opacity">
                    Report Lost Item
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Bottom Navigation */}
          <div className="absolute bottom-0 w-full bg-slate-900 border-t border-slate-800 flex justify-around p-3 z-10">
            <button onClick={() => setActiveTab('chat')} className={`flex flex-col items-center gap-1 ${activeTab === 'chat' ? 'text-emerald-400' : 'text-slate-500'}`}>
              <MessageSquare size={20} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Chat</span>
            </button>
            <button onClick={() => setActiveTab('itinerary')} className={`flex flex-col items-center gap-1 ${activeTab === 'itinerary' ? 'text-emerald-400' : 'text-slate-500'}`}>
              <Clock size={20} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Itinerary</span>
            </button>
            <button onClick={() => setActiveTab('lostfound')} className={`flex flex-col items-center gap-1 ${activeTab === 'lostfound' ? 'text-emerald-400' : 'text-slate-500'}`}>
              <Search size={20} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Lost & Found</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
