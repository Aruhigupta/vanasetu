"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ShieldCheck, MapPin, QrCode, FileText, ExternalLink, CheckCircle2, Truck, Factory, Cpu, Award, AlertCircle, RefreshCw, ArrowLeft, ShieldAlert } from "lucide-react";
import MapComponent from "@/components/MapComponent";
import QRModal from "@/components/QRModal";
import { api } from "@/lib/api";

export default function BatchVerificationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const batchId = params?.batchId as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isQrOpen, setIsQrOpen] = useState(false);

  const fetchBatchDetails = async () => {
    if (!batchId) return;
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
    fetchBatchDetails();
  }, [batchId]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-emerald-300">Fetching live Polygon blockchain ledger records for {batchId}...</p>
      </div>
    );
  }

  if (errorMsg || !data || data.authenticity_status === "INVALID_PRODUCT") {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-red-500/40 space-y-6">
          <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-400/50 mx-auto flex items-center justify-center text-red-400">
            <ShieldAlert className="w-10 h-10" />
          </div>
          <div>
            <span className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full text-xs font-bold font-mono">
              STATUS: INVALID / UNVERIFIED PRODUCT
            </span>
            <h2 className="text-2xl font-black text-white mt-3">{data?.verdict_title || "Counterfeit / Invalid Batch Code"}</h2>
            <p className="text-xs text-red-200/90 mt-2 font-mono">
              {data?.verdict_message || errorMsg || `Batch code '${batchId}' is not registered on the AYUSH Polygon blockchain ledger.`}
            </p>
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
              <ArrowLeft className="w-4 h-4" /> Verify Another Batch ID
            </button>
          </div>
        </div>
      </div>
    );
  }

  const herb = data.herb_details || {};
  const farmer = data.farmer_details || {};
  const lab = data.lab_details || null;
  const transportLogs = data.transport_history || [];
  const transportAlerts = data.transport_alerts || [];
  const mfg = data.manufacturer_details || null;
  const blockchainTxs = data.blockchain_history || [];
  const isAuthentic = data.is_authentic;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className={`glass-panel p-6 sm:p-8 rounded-3xl border ${isAuthentic ? "border-emerald-500/30" : "border-amber-500/40"} flex flex-col md:flex-row items-start md:items-center justify-between gap-6`}>
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
          {herb.botanical_name && <p className="text-xs text-emerald-300/80 font-mono italic">{herb.botanical_name}</p>}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={() => setIsQrOpen(true)}
            className="px-4 py-2.5 bg-emerald-900 hover:bg-emerald-800 text-emerald-200 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
          >
            <QrCode className="w-4 h-4 text-emerald-400" /> View Batch QR
          </button>
          
          <div className={`px-5 py-2.5 ${isAuthentic ? "bg-emerald-500/20 border-emerald-400/40 text-emerald-300" : "bg-amber-500/20 border-amber-400/40 text-amber-300"} border rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg`}>
            <CheckCircle2 className="w-5 h-5" /> {data.verdict_title || data.authenticity_status}
          </div>
        </div>
      </div>

      {/* Map Component */}
      <MapComponent
        farmGps={farmer.gps_coordinates}
        farmLocation={farmer.farm_location}
        mfgLocation={mfg?.facility}
      />

      {/* Supply Chain Lifecycle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Step 1: Farmer Origin */}
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
              <p className="font-semibold text-white">{farmer.name}</p>
            </div>
            <div>
              <span className="text-emerald-400/80 text-[10px] block uppercase font-bold">AYUSH Farmer ID</span>
              <p className="font-mono text-emerald-300">{farmer.ayush_reg_id}</p>
            </div>
            <div>
              <span className="text-emerald-400/80 text-[10px] block uppercase font-bold">Region Location</span>
              <p className="font-semibold text-amber-400">{farmer.farm_location}</p>
            </div>
            <div>
              <span className="text-emerald-400/80 text-[10px] block uppercase font-bold">Harvest Details</span>
              <p className="font-semibold text-white">{herb.quantity_kg ? `${herb.quantity_kg} kg` : ""} (Moisture: {herb.moisture_pct}%)</p>
            </div>
          </div>
        </div>

        {/* Step 2: Lab Testing */}
        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <FileText className="w-4 h-4" /> 2. AYUSH Lab Assay
            </span>
            <span className={`text-[10px] ${lab?.overall_status === "PASSED" ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-400"} px-2 py-0.5 rounded font-bold`}>
              {lab ? lab.overall_status : "PENDING"}
            </span>
          </div>

          {lab ? (
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-emerald-400/80 text-[10px] block uppercase font-bold">Testing Laboratory</span>
                <p className="font-semibold text-white">{lab.lab_name}</p>
              </div>
              <div>
                <span className="text-emerald-400/80 text-[10px] block uppercase font-bold">Active Potency Concentration</span>
                <p className="font-bold text-amber-400">{lab.potency_percentage}% Active Compounds</p>
              </div>
              <div>
                <span className="text-emerald-400/80 text-[10px] block uppercase font-bold">Heavy Metals & Pesticides</span>
                <p className={`font-semibold ${lab.heavy_metals_passed ? "text-emerald-400" : "text-red-400"}`}>
                  {lab.heavy_metals_passed ? "PASSED (API Compliant)" : "FAILED"}
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
          ) : (
            <p className="text-xs text-emerald-300/60 py-4 italic">Laboratory test report pending.</p>
          )}
        </div>

        {/* Step 3: Cold Logistics */}
        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
            <span className="text-xs font-bold text-teal-400 flex items-center gap-1.5">
              <Truck className="w-4 h-4" /> 3. Cold Logistics
            </span>
            <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded font-bold">
              {transportLogs.length > 0 ? "IN TRANSIT" : "PENDING"}
            </span>
          </div>

          {transportLogs.length > 0 ? (
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-emerald-400/80 text-[10px] block uppercase font-bold">Carrier Agency</span>
                <p className="font-semibold text-white">{transportLogs[0].agency}</p>
              </div>
              <div>
                <span className="text-emerald-400/80 text-[10px] block uppercase font-bold">Vehicle Reg. No</span>
                <p className="font-mono text-emerald-300">{transportLogs[0].vehicle}</p>
              </div>
              <div>
                <span className="text-emerald-400/80 text-[10px] block uppercase font-bold">Latest Sensor Telemetry</span>
                <p className="font-mono text-teal-300">
                  Temp: {transportLogs[0].temperature}°C | Humidity: {transportLogs[0].humidity}%
                </p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-emerald-300/60 py-4 italic">Transport telemetry log pending.</p>
          )}
        </div>

        {/* Step 4: Manufacturing */}
        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <Factory className="w-4 h-4" /> 4. Pharma Production
            </span>
            <span className={`text-[10px] ${mfg ? "bg-amber-500/20 text-amber-300" : "bg-emerald-900/40 text-emerald-300/60"} px-2 py-0.5 rounded font-bold`}>
              {mfg ? "PACKAGED" : "PENDING"}
            </span>
          </div>

          {mfg ? (
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-emerald-400/80 text-[10px] block uppercase font-bold">Manufacturer</span>
                <p className="font-semibold text-white">{mfg.company_name}</p>
              </div>
              <div>
                <span className="text-emerald-400/80 text-[10px] block uppercase font-bold">Final Medicine Product</span>
                <p className="font-bold text-amber-400">{mfg.medicine_name}</p>
              </div>
              <div>
                <span className="text-emerald-400/80 text-[10px] block uppercase font-bold">Final Medicine Batch ID</span>
                <p className="font-mono text-emerald-300">{mfg.final_batch_code}</p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-emerald-300/60 py-4 italic">Pharma manufacturing pending.</p>
          )}
        </div>

      </div>

      {/* Blockchain Ledger Table */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/30 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white">Polygon Blockchain Transaction Audit Log</h3>
          </div>
          <span className="text-xs font-mono text-emerald-400">Network: Polygon Amoy Testnet (80002)</span>
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
                    <td className="py-3.5 px-4 font-bold text-white font-sans">{tx.function}</td>
                    <td className="py-3.5 px-4 text-amber-400">#{tx.block_number}</td>
                    <td className="py-3.5 px-4 text-emerald-300 truncate max-w-[200px]">{tx.tx_hash}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[10px] font-bold">
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <a
                        href={tx.polygonscan_url}
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
          <p className="text-xs text-emerald-300/60 font-mono py-2">No Polygon blockchain transactions recorded for this batch yet.</p>
        )}
      </div>

      <QRModal batchId={data.batch_id} isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} />

    </div>
  );
}
