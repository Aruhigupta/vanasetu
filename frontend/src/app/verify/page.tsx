"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, QrCode, Search, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

export default function VerifySearchPage() {
  const [batchId, setBatchId] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const target = batchId.trim() || "HCB-2025-ASH01";
    router.push(`/verify/${target}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
      
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-400 to-emerald-700 mx-auto flex items-center justify-center shadow-xl shadow-emerald-500/20">
          <ShieldCheck className="w-10 h-10 text-emerald-950 stroke-[2.5]" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">Public Batch Verification</h1>
        <p className="text-sm sm:text-base text-emerald-200/90 max-w-xl mx-auto">
          Scan or enter your Ayurvedic medicine package batch code to instantly inspect the immutable Polygon blockchain trail.
        </p>
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-emerald-500/30 shadow-2xl">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-emerald-300 block mb-2">Enter Batch Code or Hash</label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. HCB-2025-ASH01"
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-emerald-950 text-white text-base rounded-2xl border border-emerald-500/40 focus:outline-none focus:border-emerald-400 shadow-inner"
              />
              <Search className="w-6 h-6 text-emerald-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-emerald-950 font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20"
            >
              Verify Supply Chain History <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-emerald-500/20">
          <span className="text-xs font-bold text-emerald-400 block mb-3 uppercase tracking-wider">Try Sample Verified Batches:</span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => router.push("/verify/HCB-2025-ASH01")}
              className="px-3.5 py-2 bg-emerald-900/60 hover:bg-emerald-800 border border-emerald-500/30 text-emerald-200 text-xs font-mono rounded-xl flex items-center gap-2"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> HCB-2025-ASH01 (Ashwagandha)
            </button>
            <button
              onClick={() => router.push("/verify/HCB-2025-TUL02")}
              className="px-3.5 py-2 bg-emerald-900/60 hover:bg-emerald-800 border border-emerald-500/30 text-emerald-200 text-xs font-mono rounded-xl flex items-center gap-2"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> HCB-2025-TUL02 (Holy Basil)
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
