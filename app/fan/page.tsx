'use client';
import { useState, useRef, useEffect } from 'react';
import { Send, MapPin, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FanCompanion() {
  const [messages, setMessages] = useState<{role: 'user'|'ai', text: string}[]>([
    { role: 'ai', text: 'Welcome to StadiumSync! How can I help you today? You can ask for directions, food recommendations, or report an issue.' }
  ]);
  const [input, setInput] = useState('');
  const [isReporting, setIsReporting] = useState(false);
  const [reportLocation, setReportLocation] = useState('');
  const [reportDesc, setReportDesc] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const newMessages = [...messages, { role: 'user' as const, text: input }];
    setMessages(newMessages);
    setInput('');
    
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, history: newMessages })
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
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-4 ${m.role === 'user' ? 'bg-emerald-500 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 rounded-bl-none shadow-md'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-4 bg-slate-900 border-t border-slate-800">
            <form onSubmit={sendMessage} className="flex items-center gap-2">
              <div className="flex-1 bg-slate-800 rounded-full flex items-center px-4 border border-slate-700 focus-within:border-emerald-500/50 transition-colors">
                <input value={input} onChange={e => setInput(e.target.value)} type="text" placeholder="Ask anything..." className="flex-1 bg-transparent py-3 outline-none" />
              </div>
              <button type="submit" className="bg-emerald-500 hover:bg-emerald-400 p-3 rounded-full text-white transition-colors shadow-lg shadow-emerald-500/20">
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
