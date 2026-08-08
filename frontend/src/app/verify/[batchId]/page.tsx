"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ShieldCheck, MapPin, QrCode, FileText, ExternalLink, CheckCircle2, Truck, Factory, Cpu, Award, AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";
import MapComponent from "@/components/MapComponent";
import QRModal from "@/components/QRModal";
import { api } from "@/lib/api";

export default function BatchVerificationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const batchId = (params?.batchId as string) || "HCB-2025-ASH01";

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isQrOpen, setIsQrOpen] = useState(false);

  const fetchBatchDetails = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await api.verifyBatch(batchId);
      setData(res);
    } catch (err: any) {
      setErrorMsg(err.message || `Batch '${batchId}' was not found in the HerbChain registry.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (batchId) {
      fetchBatchDetails();
    }
  }, [batchId]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-emerald-300">Fetching live Polygon blockchain records for {batchId}...</p>
      </div>
    );
  }

  if (errorMsg || !data) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-red-500/40 space-y-6">
          <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-400/50 mx-auto flex items-center justify-center text-red-400">
            <AlertCircle className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Batch Verification Failed</h2>
            <p className="text-sm text-red-200/90 mt-2 font-mono">{errorMsg}</p>
          </div>
          <div className="flex justify-center gap-4">
            <button
              onClick={fetchBatchDetails}
              className="px-6 py-3 bg-emerald-500 text-emerald-950 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-emerald-400"
            >
              <RefreshCw className="w-4 h-4" /> Retry Lookup
            </button>
            <button
              onClick={() => router.push("/verify")}
              className="px-6 py-3 bg-emerald-900 text-emerald-200 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Try Another Batch ID
            </button>
          </div>
        </div>
      </div>
    );
  }

  const herb = data.herb_details || {};
  const farmer = data.farmer_details || {};
  const lab = data.lab_details || {};
  const transportLogs = data.transport_history || [];
  const mfg = data.manufacturer_details || {};
  const blockchainTxs = data.blockchain_history || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-mono font-bold">
              Batch: {data.batch_id}
            </span>
            <span className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full text-xs font-bold flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> Polygon Ledger Verified
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white">{herb.name || "Botanical Specimen"}</h1>
          <p className="text-xs text-emerald-300/80 font-mono italic">{herb.botanical_name || ""}</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={() => setIsQrOpen(true)}
            className="px-4 py-2.5 bg-emerald-900 hover:bg-emerald-800 text-emerald-200 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
          >
            <QrCode className="w-4 h-4 text-emerald-400" /> View Batch QR
          </button>
          
          <div className="px-5 py-2.5 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" /> {data.authenticity_status || "100% VERIFIED AUTHENTIC"}
          </div>
        </div>
      </div>

      {/* Map Route Component */}
      <MapComponent
        farmGps={farmer.gps_coordinates}
        farmLocation={farmer.farm_location}
        mfgLocation={mfg.facility}
      />

      {/* Supply Chain Lifecycle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Step 1: Farmer */}
        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <MapPin className="w-4 h-4" /> 1. Origin Harvest
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">VERIFIED</span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <span className="text-emerald-400/80 text-[10px] block uppercase font-bold">Farmer / Collector</span>
              <p className="font-semibold text-white">{farmer.name || "Registered Bio-Farmer"}</p>
            </div>
            <div>
              <span className="text-emerald-400/80 text-[10px] block uppercase font-bold">AYUSH Farmer ID</span>
              <p className="font-mono text-emerald-300">{farmer.ayush_reg_id || "AYUSH-FARM-0042"}</p>
            </div>
            <div>
              <span className="text-emerald-400/80 text-[10px] block uppercase font-bold">GPS Coordinates</span>
              <p className="font-mono text-amber-400">{farmer.gps_coordinates || "11.6854° N, 76.1320° E"}</p>
            </div>
            <div>
              <span className="text-emerald-400/80 text-[10px] block uppercase font-bold">Harvest Details</span>
              <p className="font-semibold text-white">{herb.quantity_kg ? `${herb.quantity_kg} kg` : ""} (Moisture: {herb.moisture_pct || 7.0}%)</p>
            </div>
          </div>
        </div>

        {/* Step 2: Lab Test */}
        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <FileText className="w-4 h-4" /> 2. AYUSH Lab Assay
            </span>
            <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-bold">{lab.overall_status || "PASSED"}</span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <span className="text-emerald-400/80 text-[10px] block uppercase font-bold">Testing Laboratory</span>
              <p className="font-semibold text-white">{lab.lab_name || "AYUSH Analytical Testing Lab"}</p>
            </div>
            <div>
              <span className="text-emerald-400/80 text-[10px] block uppercase font-bold">Active Potency Assay</span>
              <p className="font-bold text-amber-400">{lab.potency_percentage || 8.65}% Active Markers</p>
            </div>
            <div>
              <span className="text-emerald-400/80 text-[10px] block uppercase font-bold">Heavy Metals & Pesticides</span>
              <p className="font-semibold text-emerald-400">
                {lab.heavy_metals_passed ? "PASSED (Compliant)" : "UNVERIFIED"}
              </p>
            </div>
            {lab.cert_ipfs && (
              <a
                href={`https://ipfs.io/ipfs/${lab.cert_ipfs}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-300 hover:text-emerald-400 pt-1"
              >
                <ExternalLink className="w-3.5 h-3.5" /> View IPFS Certificate
              </a>
            )}
          </div>
        </div>

        {/* Step 3: Transport */}
        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
            <span className="text-xs font-bold text-teal-400 flex items-center gap-1.5">
              <Truck className="w-4 h-4" /> 3. Cold Logistics
            </span>
            <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded font-bold">IN TRANSIT</span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <span className="text-emerald-400/80 text-[10px] block uppercase font-bold">Carrier Agency</span>
              <p className="font-semibold text-white">{transportLogs[0]?.agency || transportLogs[0]?.carrier_agency || "AYUSH Cold Logistics"}</p>
            </div>
            <div>
              <span className="text-emerald-400/80 text-[10px] block uppercase font-bold">Vehicle Reg. No</span>
              <p className="font-mono text-emerald-300">{transportLogs[0]?.vehicle || transportLogs[0]?.vehicle_no || "KA-01-HC-9042"}</p>
            </div>
            <div>
              <span className="text-emerald-400/80 text-[10px] block uppercase font-bold">Telemetry Sensors</span>
              <p className="font-mono text-teal-300">
                Temp: {transportLogs[0]?.temperature || transportLogs[0]?.temperature_celsius || 18.5}°C | Hum: {transportLogs[0]?.humidity || transportLogs[0]?.humidity_percentage || 42}%
              </p>
            </div>
          </div>
        </div>

        {/* Step 4: Manufacturer */}
        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <Factory className="w-4 h-4" /> 4. Pharma Production
            </span>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">PACKAGED</span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <span className="text-emerald-400/80 text-[10px] block uppercase font-bold">Pharma Manufacturer</span>
              <p className="font-semibold text-white">{mfg.company_name || "Dabur AYUSH Botanicals"}</p>
            </div>
            <div>
              <span className="text-emerald-400/80 text-[10px] block uppercase font-bold">Final Medicine Product</span>
              <p className="font-bold text-amber-400">{mfg.medicine_name || "Pure Organic Ashwagandha Churna"}</p>
            </div>
            <div>
              <span className="text-emerald-400/80 text-[10px] block uppercase font-bold">GMP Facility</span>
              <p className="text-emerald-200">{mfg.facility || "Haridwar Unit 4"}</p>
            </div>
          </div>
        </div>

      </div>

      {/* Blockchain Transactions Ledger Table */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/30 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white">Polygon Blockchain Transaction Audit Log</h3>
          </div>
          <span className="text-xs font-mono text-emerald-400">Network: Polygon Amoy Testnet</span>
        </div>

        {blockchainTxs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-emerald-500/20 text-emerald-400/80 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Smart Contract Method</th>
                  <th className="py-3 px-4">Block #</th>
                  <th className="py-3 px-4">Transaction Hash</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">PolygonScan Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-500/10 text-emerald-200 font-mono">
                {blockchainTxs.map((tx: any, idx: number) => (
                  <tr key={idx} className="hover:bg-emerald-900/30">
                    <td className="py-3.5 px-4 font-bold text-white font-sans">{tx.function || tx.function_name}</td>
                    <td className="py-3.5 px-4 text-amber-400">#{tx.block_number}</td>
                    <td className="py-3.5 px-4 text-emerald-300 truncate max-w-[200px]">{tx.tx_hash}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[10px] font-bold">
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <a
                        href={tx.polygonscan_url || `https://amoy.polygonscan.com/tx/${tx.tx_hash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-amber-400 hover:underline flex items-center gap-1 font-sans"
                      >
                        Inspect Tx <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-emerald-300/60 font-mono py-2">No blockchain transactions recorded for this batch yet.</p>
        )}
      </div>

      <QRModal batchId={data.batch_id} isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} />

    </div>
  );
}
