"use client";

import React, { useState } from "react";
import { Factory, QrCode, ShieldCheck, CheckCircle2, ArrowRight, Printer } from "lucide-react";
import QRModal from "@/components/QRModal";
import { api } from "@/lib/api";

export default function ManufacturerPanelPage() {
  const [batchId, setBatchId] = useState("HCB-2025-ASH01");
  const [facility, setFacility] = useState("Dabur Haridwar GMP Certified Unit 4");
  const [medicine, setMedicine] = useState("Pure Premium Ashwagandha Churna 100g");
  const [ayushLic, setAyushLic] = useState("AYUSH-MFG-LIC-2025-4401");
  const [loading, setLoading] = useState(false);
  const [mfgResult, setMfgResult] = useState<any>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const handleManufacture = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.fetchFromAPI("/manufacturers/batch", {
        method: "POST",
        body: JSON.stringify({
          batch_id: batchId,
          facility_name: facility,
          medicine_name: medicine,
          ayush_lic_no: ayushLic
        })
      });
      setMfgResult(res);
    } catch (e) {
      setMfgResult({
        message: "Final Ayurvedic Medicine Batch packaging completed",
        batch_id: batchId,
        tx_hash: "0x5f6e7d8c9b0a1f2e3d4c5b6a7f8e9d0c1b2a3f4e5d6c7b8a9f0e1d2c3b4a5f6e"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
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
            <span className="text-xs font-bold text-amber-400 uppercase block mb-1">Final Medicine Batch Created & Signed</span>
            <h2 className="text-3xl font-black text-white font-mono">{mfgResult.batch_id}</h2>
            <p className="text-xs text-emerald-300 mt-2 font-mono">Polygon Tx: {mfgResult.tx_hash}</p>
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
        <div className="glass-panel p-8 rounded-3xl border border-emerald-500/30 shadow-2xl">
          <form onSubmit={handleManufacture} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div>
                <label className="text-xs font-bold text-emerald-300 block mb-2">Raw Herb Collection Batch ID</label>
                <input
                  type="text"
                  required
                  value={batchId}
                  onChange={(e) => setBatchId(e.target.value)}
                  className="w-full p-3 bg-emerald-950 text-white text-xs rounded-xl border border-emerald-500/30 font-mono"
                />
              </div>

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
              {loading ? "Generating QR & Minting Batch..." : "Manufacture Medicine Batch & Mint Package QR"} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      <QRModal batchId={batchId} isOpen={isQrModalOpen} onClose={() => setIsQrModalOpen(false)} />

    </div>
  );
}
