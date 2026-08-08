"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, Users, Leaf, Cpu, Plus, AlertCircle, RefreshCw, X, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";

export default function AdminPanelPage() {
  const [activeTab, setActiveTab] = useState("herbs");
  const [herbs, setHerbs] = useState<any[]>([]);
  const [loadingHerbs, setLoadingHerbs] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Add Herb Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [commonName, setCommonName] = useState("");
  const [botanicalName, setBotanicalName] = useState("");
  const [category, setCategory] = useState("Rasayana (Rejuvenative)");
  const [compounds, setCompounds] = useState("");
  const [description, setDescription] = useState("");
  const [submittingHerb, setSubmittingHerb] = useState(false);

  const fetchHerbs = async () => {
    setLoadingHerbs(true);
    setErrorMsg(null);
    try {
      const res = await api.getHerbs();
      setHerbs(Array.isArray(res) ? res : []);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to fetch herbs from Railway API.");
    } finally {
      setLoadingHerbs(false);
    }
  };

  useEffect(() => {
    fetchHerbs();
  }, []);

  const handleCreateHerb = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingHerb(true);
    setErrorMsg(null);
    try {
      await api.createHerb({
        common_name: commonName.trim(),
        botanical_name: botanicalName.trim(),
        ayush_category: category,
        active_compounds: compounds.trim(),
        description: description.trim() || null
      });

      setIsAddModalOpen(false);
      setCommonName("");
      setBotanicalName("");
      setCompounds("");
      setDescription("");
      fetchHerbs();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create new herb species.");
    } finally {
      setSubmittingHerb(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-700 flex items-center justify-center shadow-lg">
            <ShieldCheck className="w-7 h-7 text-emerald-950" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">System Administrator Portal</h1>
            <p className="text-xs text-emerald-300/80">Manage botanical species catalog, AYUSH standards, & system logs via Railway API</p>
          </div>
        </div>

        <div className="flex bg-emerald-900/60 p-1 rounded-xl border border-emerald-500/30 text-xs">
          <button
            onClick={() => setActiveTab("herbs")}
            className={`px-4 py-2 rounded-lg font-bold transition ${activeTab === "herbs" ? "bg-emerald-500 text-emerald-950" : "text-emerald-300 hover:text-white"}`}
          >
            Herb Catalog
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`px-4 py-2 rounded-lg font-bold transition ${activeTab === "audit" ? "bg-emerald-500 text-emerald-950" : "text-emerald-300 hover:text-white"}`}
          >
            Blockchain Audit
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 bg-red-950/80 border border-red-500/40 rounded-xl text-xs text-red-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {activeTab === "herbs" && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/30 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">AYUSH Pharmacopoeia Herb Catalog</h3>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={fetchHerbs}
                className="p-2 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 rounded-lg text-xs"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" /> Register New Herb
              </button>
            </div>
          </div>

          {loadingHerbs ? (
            <div className="py-12 text-center text-xs text-emerald-300">Fetching live herbs from Railway API...</div>
          ) : herbs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {herbs.map((h: any) => (
                <div key={h.id} className="bg-emerald-900/40 p-4 rounded-2xl border border-emerald-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm block">{h.common_name}</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">ID #{h.id}</span>
                  </div>
                  <span className="text-emerald-400 italic block font-mono">{h.botanical_name}</span>
                  <p className="text-[11px] text-emerald-300/80">{h.ayush_category} • Active: {h.active_compounds}</p>
                  {h.description && (
                    <p className="text-[10px] text-emerald-200/70 line-clamp-2 pt-1 border-t border-emerald-500/20">{h.description}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-emerald-300/60 italic py-6 text-center">No herbs found in database.</p>
          )}
        </div>
      )}

      {activeTab === "audit" && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/30 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-amber-400" /> Polygon Smart Contract Audit Logs
          </h3>
          <p className="text-xs text-emerald-300/80">100% of state modifications generate cryptographic proof on Polygon Amoy Testnet (Chain ID 80002).</p>
        </div>
      )}

      {/* Modal for Registering New Herb */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-emerald-950 border border-emerald-500/40 rounded-3xl max-w-md w-full p-6 relative shadow-2xl space-y-4">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-emerald-400 hover:bg-emerald-900/60"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white">Register New Botanical Herb</h3>

            <form onSubmit={handleCreateHerb} className="space-y-4 text-xs">
              <div>
                <label className="text-emerald-200 block mb-1">Common Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shatavari"
                  value={commonName}
                  onChange={(e) => setCommonName(e.target.value)}
                  className="w-full p-2.5 bg-emerald-900/60 text-white rounded-xl border border-emerald-500/30"
                />
              </div>

              <div>
                <label className="text-emerald-200 block mb-1">Botanical Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asparagus racemosus"
                  value={botanicalName}
                  onChange={(e) => setBotanicalName(e.target.value)}
                  className="w-full p-2.5 bg-emerald-900/60 text-white rounded-xl border border-emerald-500/30 font-mono"
                />
              </div>

              <div>
                <label className="text-emerald-200 block mb-1">AYUSH Category</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Balya (Strength-promoting)"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 bg-emerald-900/60 text-white rounded-xl border border-emerald-500/30"
                />
              </div>

              <div>
                <label className="text-emerald-200 block mb-1">Active Compounds</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shatavarins (I-IV)"
                  value={compounds}
                  onChange={(e) => setCompounds(e.target.value)}
                  className="w-full p-2.5 bg-emerald-900/60 text-white rounded-xl border border-emerald-500/30"
                />
              </div>

              <div>
                <label className="text-emerald-200 block mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Herb medicinal description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 bg-emerald-900/60 text-white rounded-xl border border-emerald-500/30"
                />
              </div>

              <button
                type="submit"
                disabled={submittingHerb}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold rounded-xl flex items-center justify-center gap-2"
              >
                {submittingHerb ? "Posting to Railway API..." : "Submit Herb to AYUSH Database"} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
