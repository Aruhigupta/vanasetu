"use client";

import React, { useState, useEffect } from "react";
import { Truck, CheckCircle2, ArrowRight, AlertCircle, MapPin, Loader2, RefreshCw } from "lucide-react";
import { api } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function TransportPanelPage() {
  const [batchId, setBatchId] = useState("HCB-2025-ASH01");
  const [agency, setAgency] = useState("AYUSH Express Cold Chain Logistics");
  const [driver, setDriver] = useState("Rajesh Kumar");
  const [vehicle, setVehicle] = useState("KA-01-HC-9042");
  
  // GPS State
  const [gps, setGps] = useState("12.9716, 77.5946");
  const [fetchingGps, setFetchingGps] = useState(false);
  const [gpsStatus, setGpsStatus] = useState("12.9716, 77.5946 (Bengaluru Checkpoint)");

  const [temp, setTemp] = useState("18.5");
  const [humidity, setHumidity] = useState("42.0");
  const [notes, setNotes] = useState("Cold chain maintained within normal threshold");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [updatedRes, setUpdatedRes] = useState<any>(null);

  useEffect(() => {
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
          setGpsStatus(`${lat}, ${lon} (Satellite Verified Checkpoint)`);
          setFetchingGps(false);
        },
        () => {
          setGps("12.9716, 77.5946");
          setGpsStatus("12.9716, 77.5946 (Bengaluru Logistics Depot)");
          setFetchingGps(false);
        }
      );
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await api.updateTransport({
        batch_id: batchId.trim(),
        carrier_agency: agency,
        driver_name: driver,
        vehicle_no: vehicle,
        current_gps: gps,
        temperature_celsius: parseFloat(temp),
        humidity_percentage: parseFloat(humidity),
        status_notes: notes
      });
      setUpdatedRes(res);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update transport telemetry.");
    } finally {
      setLoading(false);
    }
  };

  const tempVal = parseFloat(temp);
  const isTempBreach = tempVal < 15.0 || tempVal > 25.0;
  const humidityVal = parseFloat(humidity);
  const isHumidityBreach = humidityVal < 30.0 || humidityVal > 60.0;

  return (
    <ProtectedRoute allowedRoles={["transport", "admin"]}>
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg">
            <Truck className="w-7 h-7 text-emerald-950" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">Cold Chain Logistics Portal</h1>
            <p className="text-xs text-emerald-300/80">Log temperature, humidity telemetry, and GPS checkpoints for active herb shipments</p>
          </div>
        </div>

        {updatedRes ? (
          <div className="glass-panel p-8 rounded-3xl border border-emerald-400/40 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-xl font-bold text-white">Transport Telemetry Checkpoint Logged</h3>
            <p className="text-xs font-mono text-emerald-300">Batch ID: {updatedRes.batch_id} • Status: {updatedRes.status}</p>
            {updatedRes.alerts && updatedRes.alerts.length > 0 && (
              <div className="p-3 bg-red-950/80 border border-red-500/40 rounded-xl text-xs text-red-200">
                ⚠️ Telemetry Breach Logged: {updatedRes.alerts.join(", ")}
              </div>
            )}
            <button onClick={() => setUpdatedRes(null)} className="px-6 py-2.5 bg-emerald-500 text-emerald-950 font-bold rounded-xl text-xs">
              Log Next Checkpoint
            </button>
          </div>
        ) : (
          <div className="glass-panel p-8 rounded-3xl border border-emerald-500/30 shadow-2xl space-y-6">
            {errorMsg && (
              <div className="p-3.5 bg-red-950/80 border border-red-500/40 rounded-xl text-xs text-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {(isTempBreach || isHumidityBreach) && (
              <div className="p-4 bg-amber-950/80 border border-amber-500/40 rounded-2xl text-xs text-amber-200 space-y-1">
                <span className="font-bold block">⚠️ Cold-Chain Telemetry Threshold Warning:</span>
                {isTempBreach && <p>• Temperature ({temp}°C) is outside safe range (15°C - 25°C).</p>}
                {isHumidityBreach && <p>• Humidity ({humidity}%) is outside safe range (30% - 60%).</p>}
                <p className="text-[10px] text-amber-300/80 pt-1">Submitting this reading will log an immutable Transport Alert in the database.</p>
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                <div>
                  <label className="text-xs font-bold text-emerald-300 block mb-2">Shipment Batch ID</label>
                  <input
                    type="text"
                    required
                    value={batchId}
                    onChange={(e) => setBatchId(e.target.value)}
                    className="w-full p-3 bg-emerald-950 text-white text-xs rounded-xl border border-emerald-500/30 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-emerald-300 block mb-2">Carrier Logistics Agency</label>
                  <input
                    type="text"
                    required
                    value={agency}
                    onChange={(e) => setAgency(e.target.value)}
                    className="w-full p-3 bg-emerald-950 text-white text-xs rounded-xl border border-emerald-500/30"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-emerald-300 block mb-2">Driver Name</label>
                  <input
                    type="text"
                    required
                    value={driver}
                    onChange={(e) => setDriver(e.target.value)}
                    className="w-full p-3 bg-emerald-950 text-white text-xs rounded-xl border border-emerald-500/30"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-emerald-300 block mb-2">Vehicle Reg. No</label>
                  <input
                    type="text"
                    required
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value)}
                    className="w-full p-3 bg-emerald-950 text-white text-xs rounded-xl border border-emerald-500/30"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-emerald-300 block mb-2">Cargo Temp (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={temp}
                    onChange={(e) => setTemp(e.target.value)}
                    className={`w-full p-3 bg-emerald-950 text-white text-xs rounded-xl border ${isTempBreach ? "border-amber-500 text-amber-300 font-bold" : "border-emerald-500/30"}`}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-emerald-300 block mb-2">Cargo Humidity (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={humidity}
                    onChange={(e) => setHumidity(e.target.value)}
                    className={`w-full p-3 bg-emerald-950 text-white text-xs rounded-xl border ${isHumidityBreach ? "border-amber-500 text-amber-300 font-bold" : "border-emerald-500/30"}`}
                  />
                </div>

              </div>

              {/* GPS Checkpoint Box */}
              <div className="p-4 bg-emerald-900/40 border border-emerald-500/30 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-amber-400" />
                  <div>
                    <span className="font-bold text-white block">Checkpoint GPS Telemetry</span>
                    <span className="font-mono text-[10px] text-emerald-300">{gpsStatus}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={captureCurrentLocation}
                  disabled={fetchingGps}
                  className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded text-[10px] font-bold"
                >
                  {fetchingGps ? <Loader2 className="w-3 h-3 animate-spin" /> : "Re-Lock GPS"}
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-emerald-300 block mb-2">Status & Telemetry Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 bg-emerald-950 text-white text-xs rounded-xl border border-emerald-500/30"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-emerald-950 font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-xl"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Checkpoint Telemetry & Polygon Ledger"} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
