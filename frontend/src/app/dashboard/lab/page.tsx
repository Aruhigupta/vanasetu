"use client";

import React, { useState } from "react";
import { FileText, CheckCircle2, ArrowRight, ExternalLink, AlertCircle, Search, Upload, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function LabPanelPage() {
  const [batchId, setBatchId] = useState("HCB-2025-ASH01");
  const [batchDetails, setBatchDetails] = useState<any>(null);
  const [fetchingBatch, setFetchingBatch] = useState(false);

  const [labName, setLabName] = useState("AYUSH National Central Botanical Testing Lab");
  const [testerName, setTesterName] = useState("Dr. Priya Nambiar");
  const [potency, setPotency] = useState("8.65");
  const [assay, setAssay] = useState("HPLC Assay: High Withanolide Content (8.65% vs API standard min 5.0%). Meets Pharmacopoeial standard.");
  const [metalsPass, setMetalsPass] = useState(true);
  const [pesticidesPass, setPesticidesPass] = useState(true);
  const [microbialPass, setMicrobialPass] = useState(true);

  // Document CIDs
  const [hplcFileCid, setHplcFileCid] = useState<string | null>(null);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resData, setResData] = useState<any>(null);

  const handleLookupBatch = async () => {
    if (!batchId.trim()) return;
    setFetchingBatch(true);
    setErrorMsg(null);
    try {
      const b = await api.getCollectionByBatch(batchId.trim());
      setBatchDetails(b);
    } catch (err: any) {
      setErrorMsg(`Lookup Failed: Batch ID '${batchId}' was not found in database.`);
      setBatchDetails(null);
    } finally {
      setFetchingBatch(false);
    }
  };

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadingDoc(true);
      setErrorMsg(null);
      try {
        const res = await api.uploadFile(file);
        setHplcFileCid(res.cid || res.ipfs_hash);
      } catch (err: any) {
        setErrorMsg(`Lab Report IPFS Upload Failed: ${err.message}`);
      } finally {
        setUploadingDoc(false);
      }
    }
  };

  const handleLabSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await api.addLabReport({
        batch_id: batchId.trim(),
        lab_name: labName,
        tester_name: testerName,
        chemical_assay: assay,
        heavy_metals_pass: metalsPass,
        pesticides_pass: pesticidesPass,
        microbial_pass: microbialPass,
        potency_percentage: parseFloat(potency),
        cert_ipfs_hash: hplcFileCid,
        hplc_report_cid: hplcFileCid
      });
      setResData(res);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit lab report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["lab", "admin"]}>
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
              <p className="text-xs text-emerald-300 mt-1">Overall Status: <span className="font-bold">{resData.overall_status || resData.status}</span></p>
              {resData.tx_hash && (
                <p className="text-xs text-emerald-300 mt-2 font-mono">Polygon Tx: {resData.tx_hash}</p>
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

            {/* Step 1: Batch Search Lookup */}
            <div className="bg-emerald-900/40 p-4 rounded-2xl border border-emerald-500/30 space-y-3">
              <label className="text-xs font-bold text-emerald-300 block">Scan or Enter Target Harvest Batch ID</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={batchId}
                  onChange={(e) => setBatchId(e.target.value)}
                  placeholder="e.g. HCB-2026-A4F10B"
                  className="flex-1 p-3 bg-emerald-950 text-white text-xs rounded-xl border border-emerald-500/30 font-mono"
                />
                <button
                  type="button"
                  onClick={handleLookupBatch}
                  disabled={fetchingBatch}
                  className="px-4 py-3 bg-emerald-500 text-emerald-950 rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  {fetchingBatch ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />} Lookup
                </button>
              </div>

              {batchDetails && (
                <div className="p-3 bg-emerald-950/80 rounded-xl text-xs text-emerald-200 space-y-1 font-mono">
                  <p><span className="text-emerald-400">Status:</span> {batchDetails.status}</p>
                  <p><span className="text-emerald-400">Quantity:</span> {batchDetails.quantity_kg} kg | <span className="text-emerald-400">Moisture:</span> {batchDetails.moisture_pct}%</p>
                  <p><span className="text-emerald-400">Harvest Date:</span> {new Date(batchDetails.harvest_date).toLocaleDateString()}</p>
                </div>
              )}
            </div>

            <form onSubmit={handleLabSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
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
                    min="0"
                    max="100"
                    required
                    value={potency}
                    onChange={(e) => setPotency(e.target.value)}
                    className="w-full p-3 bg-emerald-950 text-white text-xs rounded-xl border border-emerald-500/30"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-emerald-300 block mb-2">Upload HPLC / Assay PDF (Pinata IPFS)</label>
                  <input
                    type="file"
                    accept="application/pdf,image/*"
                    onChange={handleDocumentUpload}
                    className="w-full text-xs text-emerald-300 border border-emerald-500/30 p-2.5 rounded-xl bg-emerald-950"
                  />
                  {hplcFileCid && <span className="text-[10px] font-mono text-emerald-400 block mt-1">Uploaded CID: {hplcFileCid}</span>}
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-emerald-900/40 p-4 rounded-2xl border border-emerald-500/30 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-emerald-200">
                  <input
                    type="checkbox"
                    checked={metalsPass}
                    onChange={(e) => setMetalsPass(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                  Heavy Metals Safety
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-emerald-200">
                  <input
                    type="checkbox"
                    checked={pesticidesPass}
                    onChange={(e) => setPesticidesPass(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                  Pesticides Residue Check
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-emerald-200">
                  <input
                    type="checkbox"
                    checked={microbialPass}
                    onChange={(e) => setMicrobialPass(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                  Microbial Safety Check
                </label>
              </div>

              <button
                type="submit"
                disabled={loading || uploadingDoc}
                className="w-full py-4 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-emerald-950 font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-xl"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Issue Certified AYUSH Lab Report & Sign Blockchain"} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
