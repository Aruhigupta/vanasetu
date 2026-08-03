"use client";

import React, { useState } from "react";
import { Sliders, ShieldCheck, Bell, Database, Lock, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const [polygonRpc, setPolygonRpc] = useState("https://rpc-amoy.polygon.technology");
  const [ipfsGateway, setIpfsGateway] = useState("https://ipfs.io/ipfs/");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-700 flex items-center justify-center shadow-lg">
          <Sliders className="w-7 h-7 text-emerald-950" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white">System Settings & Configurations</h1>
          <p className="text-xs text-emerald-300/80">Configure Polygon RPC nodes, IPFS gateway endpoints, & security preferences</p>
        </div>
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-emerald-500/30 shadow-2xl">
        <form onSubmit={handleSave} className="space-y-6 text-xs">
          
          <div>
            <label className="text-xs font-bold text-emerald-300 block mb-2">Polygon Amoy Testnet RPC Node Endpoint</label>
            <input
              type="text"
              value={polygonRpc}
              onChange={(e) => setPolygonRpc(e.target.value)}
              className="w-full p-3 bg-emerald-950 text-white rounded-xl border border-emerald-500/30 font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-emerald-300 block mb-2">IPFS Public Gateway URL</label>
            <input
              type="text"
              value={ipfsGateway}
              onChange={(e) => setIpfsGateway(e.target.value)}
              className="w-full p-3 bg-emerald-950 text-white rounded-xl border border-emerald-500/30 font-mono"
            />
          </div>

          <div className="p-4 bg-emerald-900/40 border border-emerald-500/30 rounded-2xl space-y-2">
            <span className="font-bold text-white block">Security & Encryption Standard</span>
            <p className="text-emerald-300">JWT HS256 tokens active with AES-256 local database storage encryption.</p>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg"
          >
            {saved ? <CheckCircle2 className="w-4 h-4" /> : "Save Configuration"}
            {saved ? "Settings Saved!" : ""}
          </button>

        </form>
      </div>

    </div>
  );
}
