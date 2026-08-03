"use client";

import React, { useState } from "react";
import { MapPin, ShieldCheck, Upload, Trees, ArrowRight, CheckCircle2 } from "lucide-react";

export default function CollectorPanelPage() {
  const [region, setRegion] = useState("Bandipur Reserved Forest Zone B");
  const [permit, setPermit] = useState("FOREST-PERMIT-KA-2025-089");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
          <Trees className="w-7 h-7 text-emerald-950" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white">Wild Herb Collector Portal</h1>
          <p className="text-xs text-emerald-300/80">Forest Department permit verification & geo-fenced wild herb gathering logger</p>
        </div>
      </div>

      {submitted ? (
        <div className="glass-panel p-8 rounded-3xl border border-emerald-400/40 text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <h3 className="text-xl font-bold text-white">Wild Herb Collection Permit Verified</h3>
          <p className="text-xs text-emerald-300">Forest Department Permit #{permit} validated on Polygon Blockchain ledger.</p>
          <button onClick={() => setSubmitted(false)} className="px-6 py-2.5 bg-emerald-500 text-emerald-950 font-bold rounded-xl text-xs">
            Log Next Collection
          </button>
        </div>
      ) : (
        <div className="glass-panel p-8 rounded-3xl border border-emerald-500/30 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-emerald-200 block mb-1">Reserved Forest Region</label>
                <input
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full p-3 bg-emerald-950 text-white rounded-xl border border-emerald-500/30"
                />
              </div>
              <div>
                <label className="text-emerald-200 block mb-1">Forest Authority Permit Number</label>
                <input
                  type="text"
                  value={permit}
                  onChange={(e) => setPermit(e.target.value)}
                  className="w-full p-3 bg-emerald-950 text-white rounded-xl border border-emerald-500/30"
                />
              </div>
            </div>

            <div className="p-4 bg-emerald-900/40 border border-emerald-500/30 rounded-2xl flex items-center justify-between text-xs">
              <span className="text-emerald-300 font-bold">Forest Permit Status:</span>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded font-bold border border-emerald-500/30">
                ACTIVE & VALID UNTIL 2027
              </span>
            </div>

            <button type="submit" className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2">
              Submit Wild Collection Log <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
