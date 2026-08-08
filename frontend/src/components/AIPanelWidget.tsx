"use client";

import React, { useState } from "react";
import { Cpu, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, RefreshCw } from "lucide-react";
import { api } from "@/lib/api";

export default function AIPanelWidget() {
  const [herbName, setHerbName] = useState("Ashwagandha");
  const [moisture, setMoisture] = useState(7.5);
  const [season, setSeason] = useState("Winter Harvest");
  const [drying, setDrying] = useState("Solar Shade Drying");
  const [prediction, setPrediction] = useState<any>(null);
  const [imageCheck, setImageCheck] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const runAIPrediction = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const [predRes, imgRes] = await Promise.all([
        api.predictQuality({
          herb_name: herbName,
          region: "Wayanad, Kerala",
          season: season,
          moisture_pct: moisture,
          drying_method: drying
        }),
        api.detectFakeHerb({
          image_url_or_hash: "QmSampleHerbHash2025",
          claimed_herb_name: herbName
        })
      ]);

      setPrediction(predRes);
      setImageCheck(imgRes);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to execute AI analysis API request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-6 border border-emerald-500/30 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5 text-emerald-950" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">HerbChain AI Neural Inspector</h3>
            <p className="text-xs text-emerald-300/80">Computer Vision & Phytochemical Quality Prediction Engine</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full text-xs font-mono">
          API: Deployed Railway FastAPI
        </span>
      </div>

      {errorMsg && (
        <div className="p-3.5 bg-red-950/80 border border-red-500/40 rounded-xl text-xs text-red-200 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left: Input Form */}
        <div className="space-y-4 bg-emerald-900/40 p-5 rounded-2xl border border-emerald-500/20">
          <h4 className="text-sm font-bold text-emerald-300">Predict Quality & Potency</h4>
          
          <div>
            <label className="text-xs text-emerald-200 block mb-1">Botanical Herb Name</label>
            <select
              value={herbName}
              onChange={(e) => setHerbName(e.target.value)}
              className="w-full bg-emerald-950 text-white text-xs p-2.5 rounded-xl border border-emerald-500/30"
            >
              <option value="Ashwagandha">Ashwagandha (Withania somnifera)</option>
              <option value="Tulsi">Tulsi (Ocimum sanctum)</option>
              <option value="Giloy">Giloy (Tinospora cordifolia)</option>
              <option value="Turmeric">Haridra / Wild Turmeric (Curcuma longa)</option>
              <option value="Shatavari">Shatavari (Asparagus racemosus)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-emerald-200 block mb-1">Moisture % ({moisture}%)</label>
              <input
                type="range"
                min="4"
                max="15"
                step="0.5"
                value={moisture}
                onChange={(e) => setMoisture(parseFloat(e.target.value))}
                className="w-full accent-emerald-400"
              />
            </div>
            <div>
              <label className="text-xs text-emerald-200 block mb-1">Harvest Season</label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full bg-emerald-950 text-white text-xs p-2.5 rounded-xl border border-emerald-500/30"
              >
                <option value="Winter Harvest">Winter (Peak Potency)</option>
                <option value="Post-Monsoon">Post-Monsoon</option>
                <option value="Summer Harvest">Summer</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-emerald-200 block mb-1">Drying Technique</label>
            <select
              value={drying}
              onChange={(e) => setDrying(e.target.value)}
              className="w-full bg-emerald-950 text-white text-xs p-2.5 rounded-xl border border-emerald-500/30"
            >
              <option value="Solar Shade Drying">Solar Shade Drying (Preserves Flavonoids)</option>
              <option value="Direct Sun Exposure">Direct Sun Exposure</option>
              <option value="Mechanical Hot Air">Mechanical Hot Air (35°C)</option>
            </select>
          </div>

          <button
            onClick={runAIPrediction}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-emerald-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            {loading ? "Calling Railway AI API..." : "Run AI Quality & Authenticity Scan"} <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: AI Output Cards */}
        <div className="space-y-4">
          {prediction ? (
            <div className="space-y-3">
              {/* Vision Authenticity Card */}
              {imageCheck && (
                <div className="bg-emerald-900/60 border border-emerald-400/40 p-4 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> AI Leaf Vision Authenticity
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {imageCheck.authenticity_score}% Match
                    </span>
                  </div>
                  <p className="text-xs font-bold text-white mb-2">{imageCheck.verdict}</p>
                  <div className="space-y-1">
                    {imageCheck.detected_features?.map((f: string, i: number) => (
                      <div key={i} className="text-[10px] text-emerald-200/80 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> {f}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Potency & Grade Card */}
              <div className="bg-amber-900/40 border border-amber-500/40 p-4 rounded-2xl">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-amber-300">Predicted Active Compound</span>
                  <span className="text-xs font-bold text-amber-400">{prediction.predicted_active_compound}</span>
                </div>
                <div className="text-2xl font-black text-white mb-1">
                  {prediction.estimated_potency_pct}% <span className="text-xs font-normal text-amber-300/80">concentration</span>
                </div>
                <span className="inline-block text-xs font-bold px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-lg">
                  {prediction.quality_grade}
                </span>

                {prediction.recommendations && (
                  <div className="mt-3 pt-3 border-t border-amber-500/20">
                    <span className="text-[11px] font-bold text-emerald-300 block mb-1">Recommendations:</span>
                    <ul className="text-[10px] text-emerald-200/90 space-y-1">
                      {prediction.recommendations.map((rec: string, i: number) => (
                        <li key={i}>• {rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full bg-emerald-950/60 border border-dashed border-emerald-500/30 rounded-2xl flex flex-col items-center justify-center p-8 text-center">
              <Cpu className="w-10 h-10 text-emerald-500/40 mb-3 animate-bounce" />
              <p className="text-xs text-emerald-300/80">
                Click "Run AI Quality & Authenticity Scan" to test computer vision fake herb identification and ML active potency forecasting via Railway API.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
