"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Leaf, MapPin, Upload, CheckCircle2, ArrowRight, ShieldCheck, AlertCircle, RefreshCw, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function FarmerPanelPage() {
  const [herbs, setHerbs] = useState<any[]>([]);
  const [herbId, setHerbId] = useState<number>(1);
  const [quantity, setQuantity] = useState("250");
  const [moisture, setMoisture] = useState("6.8");
  
  // GPS State
  const [gps, setGps] = useState<string>("");
  const [fetchingGps, setFetchingGps] = useState<boolean>(false);
  const [gpsStatus, setGpsStatus] = useState<string>("Not Captured");
  
  const [address, setAddress] = useState("Wayanad Bio-Organic Farm #4, Kerala");
  
  // File & IPFS State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [imageCid, setImageCid] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [fetchingHerbs, setFetchingHerbs] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [createdBatch, setCreatedBatch] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    setFetchingHerbs(true);
    api.getHerbs()
      .then((res) => {
        if (Array.isArray(res) && res.length > 0) {
          setHerbs(res);
          setHerbId(res[0].id);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch herbs list:", err.message);
      })
      .finally(() => setFetchingHerbs(false));

    // Auto capture GPS on mount
    captureCurrentLocation();
  }, []);

  const captureCurrentLocation = () => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      setFetchingGps(true);
      setGpsStatus("Acquiring Satellite Lock...");
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude.toFixed(4);
          const lon = pos.coords.longitude.toFixed(4);
          const acc = Math.round(pos.coords.accuracy);
          setGps(`${lat}, ${lon}`);
          setGpsStatus(`Lat: ${lat}, Lon: ${lon} (Accuracy: ±${acc}m)`);
          setFetchingGps(false);
        },
        (err) => {
          console.warn("Geolocation warning:", err.message);
          setGps("11.6854, 76.1320");
          setGpsStatus("Fallback Location (GPS permission denied)");
          setFetchingGps(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setGps("11.6854, 76.1320");
      setGpsStatus("GPS Not Supported");
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setUploadingImage(true);
      setErrorMsg(null);
      try {
        const res = await api.uploadFile(file);
        setImageCid(res.cid || res.ipfs_hash);
      } catch (err: any) {
        setErrorMsg(`Image Upload to IPFS Failed: ${err.message}`);
        setImageCid(null);
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const handleCreateHarvest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gps) {
      setErrorMsg("Please capture live GPS location before submitting harvest batch.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await api.createCollection({
        herb_id: Number(herbId),
        quantity_kg: parseFloat(quantity),
        gps_coordinates: gps,
        location_address: address,
        moisture_pct: parseFloat(moisture),
        image_ipfs_hash: imageCid
      });
      setCreatedBatch(res);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create harvest collection batch.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["farmer", "admin"]}>
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center shadow-lg">
            <Leaf className="w-7 h-7 text-emerald-950" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">Farmer Harvest Logging Portal</h1>
            <p className="text-xs text-emerald-300/80">Register new botanical harvest batches with live GPS geo-tagging & IPFS leaf scan</p>
          </div>
        </div>

        {createdBatch ? (
          <div className="glass-panel p-8 rounded-3xl border border-emerald-400/40 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/50 mx-auto flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-1">Harvest Batch Successfully Broadcasted</span>
              <h2 className="text-3xl font-black text-white font-mono">{createdBatch.batch_id}</h2>
              <p className="text-xs text-emerald-300/80 mt-1">Logged on Database & Polygon Blockchain • AI Authenticity Score: {createdBatch.ai_authenticity_score}%</p>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => router.push(`/verify/${createdBatch.batch_id}`)}
                className="px-6 py-3 bg-emerald-500 text-emerald-950 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-emerald-400"
              >
                <ShieldCheck className="w-4 h-4" /> View Verified Batch Page
              </button>
              <button
                onClick={() => setCreatedBatch(null)}
                className="px-6 py-3 bg-emerald-900 text-emerald-200 border border-emerald-500/30 rounded-xl text-xs font-bold"
              >
                + Log Another Batch
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

            <form onSubmit={handleCreateHarvest} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                <div>
                  <label className="text-xs font-bold text-emerald-300 block mb-2">Select Botanical Herb Specimen</label>
                  {fetchingHerbs ? (
                    <div className="text-xs text-emerald-300 animate-pulse py-2">Loading herbs from API...</div>
                  ) : (
                    <select
                      value={herbId}
                      onChange={(e) => setHerbId(Number(e.target.value))}
                      className="w-full bg-emerald-950 text-white text-xs p-3 rounded-xl border border-emerald-500/30 focus:outline-none focus:border-emerald-400"
                    >
                      {herbs.length > 0 ? (
                        herbs.map((h: any) => (
                          <option key={h.id} value={h.id}>
                            {h.common_name} ({h.botanical_name})
                          </option>
                        ))
                      ) : (
                        <option value={1}>Ashwagandha (Withania somnifera)</option>
                      )}
                    </select>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-emerald-300 block mb-2">Harvest Weight (Kg)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full p-3 bg-emerald-950 text-white text-xs rounded-xl border border-emerald-500/30 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-emerald-300 block mb-2">Moisture Content (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    required
                    value={moisture}
                    onChange={(e) => setMoisture(e.target.value)}
                    className="w-full p-3 bg-emerald-950 text-white text-xs rounded-xl border border-emerald-500/30 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-emerald-300 block mb-2">Farm Location Address</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-3 bg-emerald-950 text-white text-xs rounded-xl border border-emerald-500/30 focus:outline-none focus:border-emerald-400"
                  />
                </div>

              </div>

              {/* Geo Tagging Satellite Box */}
              <div className="bg-emerald-900/40 p-4 rounded-2xl border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-amber-400 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-white block">Auto Geo-Tagging Satellite Lock</span>
                    <span className="text-[10px] font-mono text-emerald-300">{gpsStatus}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={captureCurrentLocation}
                  disabled={fetchingGps}
                  className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 border border-amber-500/40 rounded-lg text-[10px] font-bold flex items-center gap-1.5"
                >
                  {fetchingGps ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />} Capture Current GPS
                </button>
              </div>

              {/* Photo & IPFS Upload Box */}
              <div className="border-2 border-dashed border-emerald-500/30 bg-emerald-950/60 p-6 rounded-2xl text-center space-y-3">
                <Upload className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="text-xs text-emerald-200">Upload Herb Photo to Pinata / IPFS for AI Inspection</p>
                
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="herb-photo-input"
                />
                
                <label
                  htmlFor="herb-photo-input"
                  className="px-4 py-2 bg-emerald-900 hover:bg-emerald-800 text-emerald-200 border border-emerald-500/30 rounded-xl text-xs font-bold inline-flex items-center gap-2 cursor-pointer"
                >
                  {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin text-emerald-400" /> : <Upload className="w-4 h-4 text-emerald-400" />} Select Image File
                </label>

                {selectedFile && (
                  <p className="text-[11px] text-emerald-300 font-mono">Selected: {selectedFile.name}</p>
                )}

                {imageCid && (
                  <div className="p-2 bg-emerald-900/50 rounded-xl border border-emerald-500/40 text-[10px] font-mono text-emerald-300">
                    Pinata IPFS CID: {imageCid}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || uploadingImage}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-emerald-950 font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Register Harvest Batch & Mint Polygon Record"} <ArrowRight className="w-4 h-4" />
              </button>

            </form>
          </div>
        )}

      </div>
    </ProtectedRoute>
  );
}
