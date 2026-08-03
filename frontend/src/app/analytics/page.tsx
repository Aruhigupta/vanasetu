"use client";

import React from "react";
import { Sparkles, Activity, ShieldCheck, AlertTriangle, TrendingUp, BarChart2 } from "lucide-react";
import AIPanelWidget from "@/components/AIPanelWidget";

export default function AnalyticsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-amber-400" /> AI Supply Chain & Adulteration Analytics
          </h1>
          <p className="text-xs text-emerald-300/80">Predictive active compound distributions, adulteration hotspot map, & anomaly detectors</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-2">
          <span className="text-xs text-emerald-400 font-bold uppercase">AI Vision Accuracy</span>
          <div className="text-3xl font-black text-white">98.8%</div>
          <p className="text-[11px] text-emerald-300/80">Tested against 12,000 AYUSH leaf & root specimens</p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-2">
          <span className="text-xs text-amber-400 font-bold uppercase">Adulteration Flag Rate</span>
          <div className="text-3xl font-black text-amber-400">1.6%</div>
          <p className="text-[11px] text-emerald-300/80">Filtered prior to pharma manufacturing</p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-2">
          <span className="text-xs text-teal-400 font-bold uppercase">Average Active Potency</span>
          <div className="text-3xl font-black text-white">8.4% <span className="text-xs font-normal text-teal-300">Withanolides</span></div>
          <p className="text-[11px] text-emerald-300/80">Exceeds minimum pharmacopoeial standard (5.0%)</p>
        </div>

      </div>

      <AIPanelWidget />

    </div>
  );
}
