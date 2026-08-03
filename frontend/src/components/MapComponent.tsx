"use client";

import React from "react";
import { MapPin, Navigation, Truck, Factory } from "lucide-react";

interface MapComponentProps {
  farmGps?: string;
  farmLocation?: string;
  mfgLocation?: string;
}

export default function MapComponent({
  farmGps = "11.6854° N, 76.1320° E",
  farmLocation = "Wayanad Bio-Organic Farm, Kerala",
  mfgLocation = "Dabur AYUSH Plant, Haridwar"
}: MapComponentProps) {
  return (
    <div className="glass-panel rounded-3xl p-6 border border-emerald-500/30 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Navigation className="w-5 h-5 text-emerald-400 animate-pulse" />
          <h4 className="text-base font-bold text-white">Live Geo-Tagged Supply Chain Route</h4>
        </div>
        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs rounded-full border border-emerald-500/30">
          GPS Verified
        </span>
      </div>

      {/* Styled Route Map Simulation Container */}
      <div className="relative w-full h-64 bg-emerald-950/80 rounded-2xl border border-emerald-500/20 overflow-hidden p-4 flex flex-col justify-between">
        {/* Background Map Grid Graphic */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>

        {/* Route Line Graphic */}
        <div className="absolute left-1/4 right-1/4 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-emerald-500 via-amber-400 to-teal-400 z-0"></div>

        {/* Point 1: Origin Farm */}
        <div className="flex items-center justify-between relative z-10 my-auto">
          <div className="bg-emerald-900/90 border border-emerald-400/50 p-3 rounded-xl flex items-center gap-3 max-w-[200px] shadow-lg">
            <div className="p-2 bg-emerald-500 rounded-lg text-emerald-950">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-300 block">Origin Harvest</span>
              <p className="text-xs font-semibold text-white truncate">{farmLocation}</p>
              <span className="text-[9px] font-mono text-emerald-400">{farmGps}</span>
            </div>
          </div>

          {/* Point 2: Cold Chain Vehicle */}
          <div className="bg-amber-900/90 border border-amber-400/50 p-3 rounded-xl flex items-center gap-3 max-w-[180px] shadow-lg">
            <div className="p-2 bg-amber-500 rounded-lg text-amber-950">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-300 block">In Transit</span>
              <p className="text-xs font-semibold text-white">Cold Chain Checkpoint</p>
              <span className="text-[9px] font-mono text-amber-300">18.5°C • 42% Hum</span>
            </div>
          </div>

          {/* Point 3: Manufacturer Plant */}
          <div className="bg-teal-900/90 border border-teal-400/50 p-3 rounded-xl flex items-center gap-3 max-w-[200px] shadow-lg">
            <div className="p-2 bg-teal-400 rounded-lg text-teal-950">
              <Factory className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-teal-300 block">Final Pharma Unit</span>
              <p className="text-xs font-semibold text-white truncate">{mfgLocation}</p>
              <span className="text-[9px] font-mono text-teal-300">GMP Licensed</span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-[10px] text-emerald-300/80 pt-2 border-t border-emerald-500/20">
          <span>Lat: 11.6854 N, Long: 76.1320 E</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping"></span> Live GPS Satellite Synchronization Active
          </span>
        </div>
      </div>
    </div>
  );
}
