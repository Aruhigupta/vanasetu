"use client";

import React, { useState } from "react";
import { Factory, QrCode, CheckCircle2, ArrowRight, AlertCircle, Search, Loader2 } from "lucide-react";
import QRModal from "@/components/QRModal";
import { api } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ManufacturerPanelPage() {
  const [rawBatchId, setRawBatchId] = useState("HCB-2025-ASH01");
  const [rawBatchDetails, setRawBatchDetails] = useState<any>(null);
  const [fetchingBatch, setFetchingBatch] = useState(false);

  const [facility, setFacility] = useState("Dabur Haridwar GMP Certified Unit 4");
  const [medicine, setMedicine] = useState("Pure Premium Ashwagandha Churna 100g");
  const [ayushLic, setAyushLic] = useState("AYUSH-MFG-LIC-2026-4401");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [mfgResult, setMfgResult] = useState<any>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const handleLookupRawBatch = async () => {
    if (!rawBatchId.trim()) return;
    setFetchingBatch(true);
    setErrorMsg(null);
    try {
      const b = await api.getCollectionByBatch(rawBatchId.trim());
      setRawBatchDetails(b);
    } catch (err: any) {
      setErrorMsg(`Lookup Failed: Raw Batch ID '${rawBatchId}' was not found in database.`);
      setRawBatchDetails(null);
    } finally {
      setFetchingBatch(false);
    }
  };

  const handleManufacture = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await api.createManufactureBatch({
        batch_id: rawBatchId.trim(),
        facility_name: facility,
        medicine_name: medicine,
        ayush_lic_no: ayushLic
      });
      setMfgResult(res);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to process medicine batch.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["manufacturer", "admin"]}>
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
            <Factory className="w-7 h-7 text-emerald-950" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">Ayurvedic Pharma Manufacturing Portal</h1>
            <p className="text-xs text-emerald-300/80">Process raw botanical batches, mint final medicine packaging QR codes, & log GMP compliance</p>
          </div>
        </div>

        {mfgResult ? (
          <div className="glass-panel p-8 rounded-3xl border border-amber-500/40 text-center space-y-6">
            <CheckCircle2 className="w-14 h-14 text-amber-400 mx-auto" />
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase block mb-1">Final Medicine Product Batch Created</span>
              <h2 className="text-3xl font-black text-white font-mono">{mfgResult.final_batch_id}</h2>
              <p className="text-xs text-emerald-300 mt-1 font-mono">Raw Origin Batch: {mfgResult.raw_batch_id}</p>
              {mfgResult.tx_hash && (
                <p className="text-xs text-emerald-300 mt-1 font-mono">Polygon Tx: {mfgResult.tx_hash}</p>
              )}
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setIsQrModalOpen(true)}
                className="px-6 py-3 bg-amber-500 text-amber-950 font-bold rounded-xl text-xs flex items-center gap-2"
              >
                <QrCode className="w-4 h-4" /> Print Packaging Batch QR Label
              </button>
              <button onClick={() => setMfgResult(null)} className="px-6 py-3 bg-emerald-900 text-emerald-200 border border-emerald-500/30 rounded-xl text-xs font-bold">
                Process Next Batch
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

            {/* Lookup Raw Batch */}
            <div className="bg-emerald-900/40 p-4 rounded-2xl border border-emerald-500/30 space-y-3">
              <label className="text-xs font-bold text-emerald-300 block">Enter Raw Herb Collection Batch ID</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={rawBatchId}
                  onChange={(e) => setRawBatchId(e.target.value)}
                  placeholder="e.g. HCB-2026-A4F10B"
                  className="flex-1 p-3 bg-emerald-950 text-white text-xs rounded-xl border border-emerald-500/30 font-mono"
                />
                <button
                  type="button"
                  onClick={handleLookupRawBatch}
                  disabled={fetchingBatch}
                  className="px-4 py-3 bg-emerald-500 text-emerald-950 rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  {fetchingBatch ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />} Lookup Raw Batch
                </button>
              </div>

              {rawBatchDetails && (
                <div className="p-3 bg-emerald-950/80 rounded-xl text-xs text-emerald-200 space-y-1 font-mono">
                  <p><span className="text-emerald-400">Current Status:</span> {rawBatchDetails.status}</p>
                  <p><span className="text-emerald-400">Harvest Location:</span> {rawBatchDetails.location_address}</p>
                </div>
              )}
            </div>

            <form onSubmit={handleManufacture} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                <div>
                  <label className="text-xs font-bold text-emerald-300 block mb-2">AYUSH License Number</label>
                  <input
                    type="text"
                    required
                    value={ayushLic}
                    onChange={(e) => setAyushLic(e.target.value)}
                    className="w-full p-3 bg-emerald-950 text-white text-xs rounded-xl border border-emerald-500/30"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-emerald-300 block mb-2">GMP Facility Name</label>
                  <input
                    type="text"
                    required
                    value={facility}
                    onChange={(e) => setFacility(e.target.value)}
                    className="w-full p-3 bg-emerald-950 text-white text-xs rounded-xl border border-emerald-500/30"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-emerald-300 block mb-2">Final Medicine Product Name</label>
                  <input
                    type="text"
                    required
                    value={medicine}
                    onChange={(e) => setMedicine(e.target.value)}
                    className="w-full p-3 bg-emerald-950 text-white text-xs rounded-xl border border-emerald-500/30"
                  />
                </div>

              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-emerald-950 font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-xl"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Manufacture Medicine Batch & Mint Final Package QR"} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        <QRModal batchId={mfgResult?.final_batch_id || rawBatchId} isOpen={isQrModalOpen} onClose={() => setIsQrModalOpen(false)} />

      </div>
    </ProtectedRoute>
  );
}
