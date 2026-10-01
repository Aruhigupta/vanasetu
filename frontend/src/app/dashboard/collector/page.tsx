"use client";

import React, { useState, useEffect } from "react";
import { Trees, MapPin, Upload, CheckCircle2, ArrowRight, AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { api } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function CollectorPanelPage() {
  const [herbs, setHerbs] = useState<any[]>([]);
  const [herbId, setHerbId] = useState<number>(1);
  const [region, setRegion] = useState("Bandipur Reserved Forest Zone B");
  const [permit, setPermit] = useState("FOREST-PERMIT-2026-089");
  const [quantity, setQuantity] = useState("45.0");
  
  // GPS & Image
  const [gps, setGps] = useState<string>("11.6854, 76.1320");
  const [fetchingGps, setFetchingGps] = useState<boolean>(false);
  const [gpsStatus, setGpsStatus] = useState<string>("11.6854, 76.1320");
  const [photoCid, setPhotoCid] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    api.getHerbs()
      .then((res) => {
        if (Array.isArray(res) && res.length > 0) {
          setHerbs(res);
          setHerbId(res[0].id);
        }
      })
      .catch((err) => console.warn("Herbs fetch error:", err));

    captureCurrentLocation();
  }, []);

  const captureCurrentLocation = () => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      setFetchingGps(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude.toFixed(4);
          const lon = pos.coords.longitude.toFixed(4);
          setGps(`${lat}, ${lon}`);
          setGpsStatus(`${lat}, ${lon} (Verified GPS Lock)`);
          setFetchingGps(false);
        },
        () => {
          setGps("11.6854, 76.1320");
          setGpsStatus("11.6854, 76.1320 (Bandipur Zone B Default)");
          setFetchingGps(false);
        }
      );
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadingImage(true);
      setErrorMsg(null);
      try {
        const res = await api.uploadFile(file);
        setPhotoCid(res.cid || res.ipfs_hash);
      } catch (err: any) {
        setErrorMsg(`Photo upload failed: ${err.message}`);
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await api.createWildCollection({
        herb_id: Number(herbId),
        forest_region: region,
        permit_number: permit,
        collection_quantity_kg: parseFloat(quantity),
        gps_coordinates: gps,
        photo_cid: photoCid
      });
      setResult(res);
    } catch (err: any) {
      setErrorMsg(err.message || "Wild collection submission failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["collector", "admin"]}>
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
            <Trees className="w-7 h-7 text-emerald-950" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">Wild Herb Collector Portal</h1>
            <p className="text-xs text-emerald-300/80">Forest Department permit verification & geo-fenced wild herb gathering logger</p>
          </div>
        </div>

        {result ? (
          <div className="glass-panel p-8 rounded-3xl border border-emerald-400/40 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-xl font-bold text-white">Wild Herb Collection Verified & Logged</h3>
            <p className="text-xs font-mono text-emerald-300">Batch ID: {result.batch_id} • Permit #{result.permit_number || permit} validated.</p>
            <p className="text-[11px] text-amber-300">Geo-Fence Check: {result.geofence_verified ? "PASSED (Inside Permitted Forest Zone)" : "WARNING"}</p>
            <button onClick={() => setResult(null)} className="px-6 py-2.5 bg-emerald-500 text-emerald-950 font-bold rounded-xl text-xs">
              Log Next Collection
            </button>
          </div>
        ) : (
          <div className="glass-panel p-8 rounded-3xl border border-emerald-500/30 space-y-6">
            {errorMsg && (
              <div className="p-3.5 bg-red-950/80 border border-red-500/40 rounded-xl text-xs text-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div>
                  <label className="text-emerald-200 block mb-1">Botanical Specimen</label>
                  <select
                    value={herbId}
                    onChange={(e) => setHerbId(Number(e.target.value))}
                    className="w-full p-3 bg-emerald-950 text-white rounded-xl border border-emerald-500/30"
                  >
                    {herbs.map((h: any) => (
                      <option key={h.id} value={h.id}>
                        {h.common_name} ({h.botanical_name})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-emerald-200 block mb-1">Collection Quantity (Kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full p-3 bg-emerald-950 text-white rounded-xl border border-emerald-500/30"
                  />
                </div>

                <div>
                  <label className="text-emerald-200 block mb-1">Reserved Forest Region</label>
                  <input
                    type="text"
                    required
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full p-3 bg-emerald-950 text-white rounded-xl border border-emerald-500/30"
                  />
                </div>

                <div>
                  <label className="text-emerald-200 block mb-1">Forest Authority Permit Number</label>
                  <input
                    type="text"
                    required
                    value={permit}
                    onChange={(e) => setPermit(e.target.value)}
                    className="w-full p-3 bg-emerald-950 text-white rounded-xl border border-emerald-500/30 font-mono"
                  />
                </div>

              </div>

              {/* GPS Geofence Box */}
              <div className="p-4 bg-emerald-900/40 border border-emerald-500/30 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-amber-400" />
                  <div>
                    <span className="font-bold text-white block">Collector Geo-Fence Location</span>
                    <span className="font-mono text-[10px] text-emerald-300">{gpsStatus}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={captureCurrentLocation}
                  className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded font-bold border border-amber-500/30 text-[10px]"
                >
                  Re-Lock GPS
                </button>
              </div>

              {/* Upload Photo */}
              <div className="border border-dashed border-emerald-500/30 p-4 rounded-xl text-center space-y-2">
                <Upload className="w-6 h-6 text-emerald-400 mx-auto" />
                <span className="block text-emerald-200">Upload Wild Herb Photo (Pinata IPFS)</span>
                <input type="file" accept="image/*" onChange={handleFileSelect} className="text-[11px] text-emerald-300" />
                {photoCid && <span className="block font-mono text-emerald-400 text-[10px]">CID: {photoCid}</span>}
              </div>

              <button
                type="submit"
                disabled={loading || uploadingImage}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Wild Collection Log"} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
