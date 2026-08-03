"use client";

import React, { useState } from "react";
import { ShieldCheck, Users, Leaf, Database, Cpu, Plus, Search } from "lucide-react";

const MOCK_USERS = [
  { id: 1, name: "Dr. Rajesh V. Sharma", email: "admin@herbchain.ai", role: "Admin", status: "Active" },
  { id: 2, name: "Ramesh Gowda", email: "farmer@herbchain.ai", role: "Farmer", status: "Verified" },
  { id: 3, name: "Sunil Kulkarni", email: "collector@herbchain.ai", role: "Collector", status: "Verified" },
  { id: 4, name: "Dr. Priya Nambiar", email: "lab@herbchain.ai", role: "Lab Tester", status: "Verified" },
  { id: 5, name: "Dabur Central Lead", email: "manufacturer@herbchain.ai", role: "Manufacturer", status: "Verified" },
];

export default function AdminPanelPage() {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-700 flex items-center justify-center shadow-lg">
            <ShieldCheck className="w-7 h-7 text-emerald-950" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">System Administrator Portal</h1>
            <p className="text-xs text-emerald-300/80">Manage users, AYUSH botanical catalog, quality reports, and Polygon audit logs</p>
          </div>
        </div>

        <div className="flex bg-emerald-900/60 p-1 rounded-xl border border-emerald-500/30 text-xs">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 rounded-lg font-bold transition ${activeTab === "users" ? "bg-emerald-500 text-emerald-950" : "text-emerald-300 hover:text-white"}`}
          >
            Manage Users
          </button>
          <button
            onClick={() => setActiveTab("herbs")}
            className={`px-4 py-2 rounded-lg font-bold transition ${activeTab === "herbs" ? "bg-emerald-500 text-emerald-950" : "text-emerald-300 hover:text-white"}`}
          >
            Herb Catalog
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`px-4 py-2 rounded-lg font-bold transition ${activeTab === "audit" ? "bg-emerald-500 text-emerald-950" : "text-emerald-300 hover:text-white"}`}
          >
            Blockchain Logs
          </button>
        </div>
      </div>

      {activeTab === "users" && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" /> Registered Supply Chain Users
            </h3>
            <button className="px-3.5 py-1.5 bg-emerald-500 text-emerald-950 rounded-lg text-xs font-bold flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> Add User
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-emerald-500/20 text-emerald-400/80 uppercase text-[10px]">
                  <th className="py-3 px-4">User Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">AYUSH Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-500/10 text-emerald-200">
                {MOCK_USERS.map((u) => (
                  <tr key={u.id} className="hover:bg-emerald-900/30">
                    <td className="py-3 px-4 font-bold text-white">{u.name}</td>
                    <td className="py-3 px-4 text-emerald-300">{u.email}</td>
                    <td className="py-3 px-4 font-semibold text-amber-400">{u.role}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded">
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "herbs" && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Leaf className="w-5 h-5 text-emerald-400" /> AYUSH Pharmacopoeia Herb Catalog
            </h3>
            <button className="px-3.5 py-1.5 bg-emerald-500 text-emerald-950 rounded-lg text-xs font-bold">
              + Register New Herb
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-emerald-900/40 p-4 rounded-2xl border border-emerald-500/30 space-y-2">
              <span className="font-bold text-white text-sm block">Ashwagandha</span>
              <span className="text-emerald-400 italic block">Withania somnifera</span>
              <p className="text-[11px] text-emerald-300/80">Rasayana (Rejuvenative) • Active: Withanolides</p>
            </div>

            <div className="bg-emerald-900/40 p-4 rounded-2xl border border-emerald-500/30 space-y-2">
              <span className="font-bold text-white text-sm block">Tulsi (Holy Basil)</span>
              <span className="text-emerald-400 italic block">Ocimum sanctum</span>
              <p className="text-[11px] text-emerald-300/80">Pranada • Active: Eugenol, Ursolic Acid</p>
            </div>

            <div className="bg-emerald-900/40 p-4 rounded-2xl border border-emerald-500/30 space-y-2">
              <span className="font-bold text-white text-sm block">Wild Turmeric (Haridra)</span>
              <span className="text-emerald-400 italic block">Curcuma longa</span>
              <p className="text-[11px] text-emerald-300/80">Anti-inflammatory • Active: Curcumin</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "audit" && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/30 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-amber-400" /> Polygon Smart Contract Audit Logs
          </h3>
          <p className="text-xs text-emerald-300/80">100% of state modifications generate cryptographic proof on Polygon Amoy Testnet (Chain ID 80002).</p>
        </div>
      )}

    </div>
  );
}
