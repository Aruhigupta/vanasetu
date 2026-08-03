"use client";

import React, { useState, useEffect } from "react";
import { User, ShieldCheck, Wallet, MapPin, Award } from "lucide-react";

export default function ProfilePage() {
  const [role, setRole] = useState("farmer");
  const [email, setEmail] = useState("farmer@herbchain.ai");

  useEffect(() => {
    const r = localStorage.getItem("user_role");
    const e = localStorage.getItem("user_email");
    if (r) setRole(r);
    if (e) setEmail(e);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      
      <div className="glass-panel p-8 rounded-3xl border border-emerald-500/30 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-emerald-950 font-black text-2xl">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Sri Ramesh Gowda</h1>
            <p className="text-xs text-emerald-300 font-mono">{email}</p>
            <span className="inline-block mt-1 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-xs font-bold capitalize">
              Role: {role}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-emerald-900/40 border border-emerald-500/20 rounded-2xl">
            <span className="text-emerald-400 block uppercase font-bold mb-1">AYUSH Registration ID</span>
            <span className="text-white font-mono font-bold">AYUSH-FARM-KL-9042</span>
          </div>

          <div className="p-4 bg-emerald-900/40 border border-emerald-500/20 rounded-2xl">
            <span className="text-emerald-400 block uppercase font-bold mb-1">Polygon Wallet Address</span>
            <span className="text-amber-400 font-mono">0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7</span>
          </div>
        </div>
      </div>

    </div>
  );
}
