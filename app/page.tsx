import Link from 'next/link';
import { ArrowRight, MessageSquare, Activity } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-950 to-slate-950 -z-10"></div>
      
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
        StadiumSync AI
      </h1>
      <p className="text-xl text-slate-400 max-w-2xl mb-12">
        The complete GenAI-enabled operations platform for the FIFA World Cup 2026. 
        Enhance fan experience and streamline venue management in real-time.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <Link href="/fan" className="group bg-slate-900/50 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 p-8 rounded-3xl transition-all flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <MessageSquare className="text-emerald-400" size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-3">Fan Companion App</h2>
          <p className="text-slate-400 mb-6 flex-1">A mobile-first GenAI assistant for navigation, language translation, and reporting issues instantly.</p>
          <div className="text-emerald-400 font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
            Open Fan App <ArrowRight size={18} />
          </div>
        </Link>

        <Link href="/dashboard" className="group bg-slate-900/50 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 p-8 rounded-3xl transition-all flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Activity className="text-cyan-400" size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-3">Command Center</h2>
          <p className="text-slate-400 mb-6 flex-1">An enterprise dashboard for organizers featuring AI-generated action plans and live operational intelligence.</p>
          <div className="text-cyan-400 font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
            Open Dashboard <ArrowRight size={18} />
          </div>
        </Link>
      </div>
    </div>
  );
}
