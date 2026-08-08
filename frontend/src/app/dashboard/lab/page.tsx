"use client";

import React, { useState } from "react";
import { FileText, CheckCircle2, ArrowRight, ExternalLink, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";

export default function LabPanelPage() {
  const [batchId, setBatchId] = useState("HCB-2025-ASH01");
  const [labName, setLabName] = useState("AYUSH National Central Botanical Laboratory");
  const [testerName, setTesterName] = useState("Dr. Priya Nambiar");
  const [potency, setPotency] = useState("8.65");
  const [assay, setAssay] = useState("HPLC Assay: High Withanolide Content (8.65% vs API standard min 5.0%). Meets Pharmacopoeial standard.");
  const [metalsPass, setMetalsPass] = useState(true);
  const [pesticidesPass, setPesticidesPass] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resData, setResData] = useState<any>(null);

  const handleLabSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await api.addLabReport({
        batch_id: batchId,
        lab_name: labName,
        tester_name: testerName,
        chemical_assay: assay,
        heavy_metals_pass: metalsPass,
        pesticides_pass: pesticidesPass,
        microbial_pass: true,
        potency_percentage: parseFloat(potency),
        cert_ipfs_hash: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG"
      });
      setResData(res);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit lab report to Railway API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-700 flex items-center justify-center shadow-lg">
          <FileText className="w-7 h-7 text-emerald-950" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white">AYUSH Certified Testing Laboratory Portal</h1>
          <p className="text-xs text-emerald-300/80">Upload HPLC chemical assay, heavy metal test certificates, & sign smart contract records</p>
        </div>
      </div>

      {resData ? (
        <div className="glass-panel p-8 rounded-3xl border border-emerald-400/40 text-center space-y-6">
          <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto" />
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase block mb-1">Laboratory Assay Certificate Minted</span>
            <h2 className="text-2xl font-black text-white font-mono">{batchId}</h2>
            {resData.tx_hash && (
              <p className="text-xs text-emerald-300 mt-2 font-mono">Tx Hash: {resData.tx_hash}</p>
            )}
          </div>

          <div className="flex justify-center gap-4">
            {resData.tx_hash && (
              <a
                href={`https://amoy.polygonscan.com/tx/${resData.tx_hash}`}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 bg-amber-500 text-amber-950 font-bold rounded-xl text-xs flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" /> View Polygon Explorer
              </a>
            )}
            <button onClick={() => setResData(null)} className="px-6 py-3 bg-emerald-900 text-emerald-200 border border-emerald-500/30 rounded-xl text-xs font-bold">
              Test Another Batch
            </button>
          </div>
        </div>
      ) : (
        <div className="glass-panel p-8 rounded-3xl border border-emerald-500/30 shadow-2xl space-y-6">
          {errorMsg && (
            <div className="p-3.5 bg-red-950/80 border border-red-500/40 rounded-xl text-xs text-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLabSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div>
                <label className="text-xs font-bold text-emerald-300 block mb-2">Target Harvest Batch ID</label>
                <input
                  type="text"
                  required
                  value={batchId}
                  onChange={(e) => setBatchId(e.target.value)}
                  className="w-full p-3 bg-emerald-950 text-white text-xs rounded-xl border border-emerald-500/30 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-emerald-300 block mb-2">Certified Lab Name</label>
                <input
                  type="text"
                  required
                  value={labName}
                  onChange={(e) => setLabName(e.target.value)}
                  className="w-full p-3 bg-emerald-950 text-white text-xs rounded-xl border border-emerald-500/30"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-emerald-300 block mb-2">Chemist / Tester Name</label>
                <input
                  type="text"
                  required
                  value={testerName}
                  onChange={(e) => setTesterName(e.target.value)}
                  className="w-full p-3 bg-emerald-950 text-white text-xs rounded-xl border border-emerald-500/30"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-emerald-300 block mb-2">Active Potency Concentration (%)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={potency}
                  onChange={(e) => setPotency(e.target.value)}
                  className="w-full p-3 bg-emerald-950 text-white text-xs rounded-xl border border-emerald-500/30"
                />
              </div>

            </div>

            <div>
              <label className="text-xs font-bold text-emerald-300 block mb-2">HPLC Chemical Assay Summary</label>
              <textarea
                rows={3}
                required
                value={assay}
                onChange={(e) => setAssay(e.target.value)}
                className="w-full p-3 bg-emerald-950 text-white text-xs rounded-xl border border-emerald-500/30"
              />
            </div>

            {/* Pass/Fail Checkboxes */}
            <div className="grid grid-cols-2 gap-4 bg-emerald-900/40 p-4 rounded-2xl border border-emerald-500/30 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-emerald-200">
                <input
                  type="checkbox"
                  checked={metalsPass}
                  onChange={(e) => setMetalsPass(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 rounded"
                />
                Heavy Metals Safety Test (Lead/Arsenic)
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-emerald-200">
                <input
                  type="checkbox"
                  checked={pesticidesPass}
                  onChange={(e) => setPesticidesPass(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 rounded"
                />
                Pesticide & Chemical Residue Check
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-emerald-950 font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-xl"
            >
              {loading ? "Uploading to Railway API & Blockchain..." : "Issue Certified AYUSH Lab Report & Sign Blockchain"} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
