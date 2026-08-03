"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Activity, Leaf, ShieldCheck, Cpu, Users, FileText, QrCode, TrendingUp, BarChart3, MapPin, Sparkles, ArrowUpRight } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { api } from "@/lib/api";

const STATE_DATA = [
  { name: "Kerala", collections: 420 },
  { name: "Karnataka", collections: 310 },
  { name: "Uttarakhand", collections: 210 },
  { name: "Himachal", collections: 150 },
  { name: "Madhya Pradesh", collections: 110 },
];

const STATUS_PIE_DATA = [
  { name: "Collected", value: 42, color: "#10b981" },
  { name: "Lab Passed", value: 85, color: "#f59e0b" },
  { name: "In Transit", value: 34, color: "#14b8a6" },
  { name: "Manufactured", value: 120, color: "#065f46" },
];

const TX_LINE_DATA = [
  { time: "09:00", txs: 45 },
  { time: "11:00", txs: 82 },
  { time: "13:00", txs: 140 },
  { time: "15:00", txs: 210 },
  { time: "17:00", txs: 310 },
  { time: "19:00", txs: 428 },
];

export default function DashboardOverviewPage() {
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    api.getMetrics()
      .then((res) => setMetrics(res))
      .catch(() => {
        setMetrics({
          summary: {
            total_herbs_collected_kg: 18450.5,
            total_farmers: 342,
            total_blockchain_txs: 1428,
            total_lab_reports: 118,
            total_consumer_scans: 8920,
            quality_pass_rate_pct: 98.4
          }
        });
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Activity className="w-8 h-8 text-emerald-400" /> Executive Analytics Dashboard
          </h1>
          <p className="text-xs text-emerald-300/80">Real-time supply chain monitoring & Polygon transaction stream</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/farmer" className="px-4 py-2 bg-emerald-500 text-emerald-950 rounded-xl text-xs font-bold hover:bg-emerald-400 shadow-md">
            + New Collection
          </Link>
          <Link href="/dashboard/lab" className="px-4 py-2 bg-amber-500 text-amber-950 rounded-xl text-xs font-bold hover:bg-amber-400 shadow-md">
            + Upload Lab Assay
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Herbs Harvested</span>
            <Leaf className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-white">
            {metrics?.summary?.total_herbs_collected_kg || 18450.5} <span className="text-xs font-normal text-emerald-300">kg</span>
          </div>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +14.2% from last month
          </span>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs font-bold uppercase tracking-wider">Enrolled Farmers</span>
            <Users className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-white">
            {metrics?.summary?.total_farmers || 342} <span className="text-xs font-normal text-amber-300">Verified</span>
          </div>
          <span className="text-[10px] text-amber-300 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> Across 8 AYUSH botanical zones
          </span>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between text-teal-400">
            <span className="text-xs font-bold uppercase tracking-wider">Polygon Transactions</span>
            <Cpu className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-white">
            {metrics?.summary?.total_blockchain_txs || 1428} <span className="text-xs font-normal text-teal-300">Blocks</span>
          </div>
          <span className="text-[10px] text-teal-300 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> 100% On-chain audit rate
          </span>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-amber-500/40 space-y-2 bg-amber-500/10">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs font-bold uppercase tracking-wider">Consumer QR Scans</span>
            <QrCode className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-white">
            {metrics?.summary?.total_consumer_scans || 8920} <span className="text-xs font-normal text-amber-300">Scans</span>
          </div>
          <span className="text-[10px] text-amber-300 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> 98.4% Quality approval rate
          </span>
        </div>

      </div>

      {/* Recharts Graphical Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* State-wise Collections Bar Chart */}
        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" /> State-wise Herb Collections (Kg)
            </h3>
            <span className="text-xs text-emerald-400 font-mono">Live Sync</span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={STATE_DATA}>
                <XAxis dataKey="name" stroke="#10b981" fontSize={11} />
                <YAxis stroke="#10b981" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#064e3b", borderColor: "#34d399", borderRadius: "12px", color: "#fff" }}
                />
                <Bar dataKey="collections" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Blockchain Transaction Velocity Line Chart */}
        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-400" /> Polygon Smart Contract Tx Velocity
            </h3>
            <span className="text-xs text-amber-400 font-mono">Blocks/Hr</span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={TX_LINE_DATA}>
                <XAxis dataKey="time" stroke="#f59e0b" fontSize={11} />
                <YAxis stroke="#f59e0b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#064e3b", borderColor: "#f59e0b", borderRadius: "12px", color: "#fff" }}
                />
                <Line type="monotone" dataKey="txs" stroke="#f59e0b" strokeWidth={3} dot={{ fill: "#f59e0b", r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Role Navigation Quick Links */}
      <div className="glass-panel p-8 rounded-3xl border border-emerald-500/30 space-y-4">
        <h3 className="text-xl font-bold text-white">Role Access Control Portals</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <Link href="/dashboard/farmer" className="p-4 bg-emerald-900/50 hover:bg-emerald-800 rounded-2xl border border-emerald-500/30 text-center space-y-2 group">
            <Leaf className="w-6 h-6 text-emerald-400 mx-auto group-hover:scale-110 transition" />
            <span className="text-xs font-bold text-white block">Farmer Panel</span>
          </Link>

          <Link href="/dashboard/collector" className="p-4 bg-emerald-900/50 hover:bg-emerald-800 rounded-2xl border border-emerald-500/30 text-center space-y-2 group">
            <MapPin className="w-6 h-6 text-amber-400 mx-auto group-hover:scale-110 transition" />
            <span className="text-xs font-bold text-white block">Collector Panel</span>
          </Link>

          <Link href="/dashboard/lab" className="p-4 bg-emerald-900/50 hover:bg-emerald-800 rounded-2xl border border-emerald-500/30 text-center space-y-2 group">
            <FileText className="w-6 h-6 text-teal-400 mx-auto group-hover:scale-110 transition" />
            <span className="text-xs font-bold text-white block">Lab Panel</span>
          </Link>

          <Link href="/dashboard/transport" className="p-4 bg-emerald-900/50 hover:bg-emerald-800 rounded-2xl border border-emerald-500/30 text-center space-y-2 group">
            <TrendingUp className="w-6 h-6 text-emerald-400 mx-auto group-hover:scale-110 transition" />
            <span className="text-xs font-bold text-white block">Transport Agency</span>
          </Link>

          <Link href="/dashboard/manufacturer" className="p-4 bg-emerald-900/50 hover:bg-emerald-800 rounded-2xl border border-emerald-500/30 text-center space-y-2 group">
            <QrCode className="w-6 h-6 text-amber-400 mx-auto group-hover:scale-110 transition" />
            <span className="text-xs font-bold text-white block">Manufacturer</span>
          </Link>

          <Link href="/dashboard/admin" className="p-4 bg-emerald-900/50 hover:bg-emerald-800 rounded-2xl border border-emerald-500/30 text-center space-y-2 group">
            <ShieldCheck className="w-6 h-6 text-teal-400 mx-auto group-hover:scale-110 transition" />
            <span className="text-xs font-bold text-white block">Admin Panel</span>
          </Link>
        </div>
      </div>

    </div>
  );
}
