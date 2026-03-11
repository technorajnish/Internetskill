"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, KeyRound, ArrowRight, ShieldAlert } from "lucide-react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        // 🔐 ताला खुल गया! ब्राउज़र को याद दिला दो कि असली एडमिन आ गया है
        localStorage.setItem("isISAdmin", "true");
        router.push("/admin/dashboard"); // डैशबोर्ड के अंदर भेज दो
      } else {
        setError(data.message || "❌ गलत ID या Password!");
      }
    } catch (err) {
      setError("❌ Server Error! Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 font-sans selection:bg-purple-500 selection:text-white relative overflow-hidden">
      
      {/* Background Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#0f172a]/80 backdrop-blur-xl border border-slate-800 p-8 sm:p-10 rounded-[2.5rem] shadow-2xl relative z-10">
        
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-[#020617] border border-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
             <Lock className="text-purple-500" size={36} />
          </div>
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2">IS Panel <span className="text-purple-500">V2</span></h1>
          <p className="text-slate-400 font-medium text-sm">Secure Admin Authentication</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm font-bold p-4 rounded-xl mb-6 flex items-center gap-3 animate-pulse">
            <ShieldAlert size={20} /> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Admin ID</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500" size={20} />
              <input 
                type="text" 
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username..." 
                className="w-full bg-[#020617] border border-slate-800 py-4 pl-12 pr-4 rounded-xl text-white outline-none focus:border-purple-500 transition-all font-medium placeholder:text-slate-700"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Secret Password</label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500" size={20} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full bg-[#020617] border border-slate-800 py-4 pl-12 pr-4 rounded-xl text-white outline-none focus:border-purple-500 transition-all font-medium placeholder:text-slate-700"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-black text-white uppercase tracking-widest transition-all shadow-lg mt-8 ${isLoading ? 'bg-slate-700' : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 active:scale-95 shadow-purple-900/30'}`}
          >
            {isLoading ? "VERIFYING..." : "UNLOCK PANEL"} <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}