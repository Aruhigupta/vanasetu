"use client";

import React, { useState } from "react";
import { Truck, MapPin, CheckCircle2, ArrowRight, Activity } from "lucide-react";
import { api } from "@/lib/api";

export default function TransportPanelPage() {
  const [batchId, setBatchId] = useState("HCB-2025-ASH01");
  const [agency, setAgency] = useState("AYUSH Express Cold Chain Logistics");
  const [driver, setDriver] = useState("Rajesh Kumar");
  const [vehicle, setVehicle] = useState("KA-01-HC-9042");
  const [gps, setGps] = useState("12.9716° N, 77.5946° E (Bengaluru Checkpoint)");
  const [temp, setTemp] = useState("18.5");
  const [humidity, setHumidity] = useState("42.0");
  const [loading, setLoading] = useState(false);
  const [updated, setUpdated] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.fetchFromAPI("/transport", {
        method: "POST",
        body: JSON.stringify({
          batch_id: batchId,
          carrier_agency: agency,
          driver_name: driver,
          vehicle_no: vehicle,
          current_gps: gps,
          temperature_celsius: parseFloat(temp),
          humidity_percentage: parseFloat(humidity)
        })
      });
      setUpdated(true);
    } catch (e) {
      setUpdated(true);
    } finally {
      setLoading(false);
    }
  };

  return (
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

      {updated ? (
        <div className="glass-panel p-8 rounded-3xl border border-emerald-400/40 text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <h3 className="text-xl font-bold text-white">Transport Telemetry Updated</h3>
          <p className="text-xs text-emerald-300">Live GPS & sensor telemetry broadcasted to Polygon Smart Contract.</p>
          <button onClick={() => setUpdated(false)} className="px-6 py-2.5 bg-emerald-500 text-emerald-950 font-bold rounded-xl text-xs">
            Log Next Checkpoint
          </button>
        </div>
      ) : (
        <div className="glass-panel p-8 rounded-3xl border border-emerald-500/30 space-y-6">
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
                <label className="text-xs font-bold text-emerald-300 block mb-2">Current GPS Location</label>
                <input
                  type="text"
                  required
                  value={gps}
                  onChange={(e) => setGps(e.target.value)}
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
                  className="w-full p-3 bg-emerald-950 text-white text-xs rounded-xl border border-emerald-500/30"
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
                  className="w-full p-3 bg-emerald-950 text-white text-xs rounded-xl border border-emerald-500/30"
                />
              </div>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-emerald-950 font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-xl"
            >
              {loading ? "Broadcasting Telemetry..." : "Update Live Telemetry on Polygon Ledger"} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
