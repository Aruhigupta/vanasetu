"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Leaf, ShieldCheck, QrCode, Cpu, UserCheck, Wallet, ChevronDown, Menu, X, Activity, LogOut, LogIn, UserPlus } from "lucide-react";
import { connectMetaMask, formatAddress } from "@/lib/web3";
import { api } from "@/lib/api";

export default function Navbar() {
  const [wallet, setWallet] = useState<string | null>(null);
  const [role, setRole] = useState<string>("farmer");
  const [user, setUser] = useState<any>(null);
  const [searchBatch, setSearchBatch] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = api.getStoredUser();
    if (storedUser) {
      setUser(storedUser);
      if (storedUser.role) setRole(storedUser.role);
    } else {
      const savedRole = localStorage.getItem("user_role");
      if (savedRole) setRole(savedRole);
    }
  }, [pathname]);

  const handleWalletConnect = async () => {
    try {
      const res = await connectMetaMask();
      setWallet(res.address);
    } catch (err) {
      setWallet("0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7");
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchBatch.trim()) {
      router.push(`/verify/${searchBatch.trim()}`);
    } else {
      router.push(`/verify/HCB-2025-ASH01`);
    }
  };

  const handleRoleChange = (newRole: string) => {
    setRole(newRole);
    localStorage.setItem("user_role", newRole);
    if (newRole === "consumer") {
      router.push("/verify");
    } else if (newRole === "admin") {
      router.push("/dashboard/admin");
    } else {
      router.push(`/dashboard/${newRole}`);
    }
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-emerald-500/20 bg-emerald-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Leaf className="w-7 h-7 text-emerald-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-white font-sans">HerbChain</span>
                <span className="px-2 py-0.5 text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-full">AI</span>
              </div>
              <span className="text-[10px] tracking-widest text-emerald-400/80 uppercase font-semibold block">Ministry of AYUSH • SIH 2025</span>
            </div>
          </Link>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative max-w-xs w-full">
            <input
              type="text"
              placeholder="Enter Batch ID (e.g. HCB-2025-ASH01)..."
              value={searchBatch}
              onChange={(e) => setSearchBatch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-full bg-emerald-900/40 text-emerald-100 placeholder-emerald-400/60 border border-emerald-500/30 focus:outline-none focus:border-emerald-400"
            />
            <QrCode className="w-4 h-4 text-emerald-400 absolute left-3" />
          </form>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="text-emerald-100 hover:text-emerald-400 transition-colors">Home</Link>
            <Link href="/verify" className="text-emerald-100 hover:text-emerald-400 flex items-center gap-1.5 transition-colors">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Public Verify
            </Link>
            <Link href="/dashboard" className="text-emerald-100 hover:text-emerald-400 flex items-center gap-1.5 transition-colors">
              <Activity className="w-4 h-4 text-emerald-400" /> Dashboard
            </Link>
            <Link href="/explorer" className="text-emerald-100 hover:text-emerald-400 flex items-center gap-1.5 transition-colors">
              <Cpu className="w-4 h-4 text-emerald-400" /> Blockchain
            </Link>
            <Link href="/analytics" className="text-emerald-100 hover:text-emerald-400 transition-colors">AI Insights</Link>
          </nav>

          {/* Actions: Wallet, Role & Auth */}
          <div className="hidden sm:flex items-center gap-3">
            
            {/* Role Switcher */}
            <div className="relative group">
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-900/50 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-800/50">
                <UserCheck className="w-3.5 h-3.5" />
                <span className="capitalize">Role: {role}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              <div className="absolute right-0 mt-2 w-44 bg-emerald-900 border border-emerald-500/30 rounded-xl shadow-2xl p-1 hidden group-hover:block z-50">
                <button onClick={() => handleRoleChange("admin")} className="w-full text-left px-3 py-1.5 text-xs text-emerald-200 hover:bg-emerald-800 rounded-lg">Admin Panel</button>
                <button onClick={() => handleRoleChange("farmer")} className="w-full text-left px-3 py-1.5 text-xs text-emerald-200 hover:bg-emerald-800 rounded-lg">Farmer Panel</button>
                <button onClick={() => handleRoleChange("collector")} className="w-full text-left px-3 py-1.5 text-xs text-emerald-200 hover:bg-emerald-800 rounded-lg">Collector Panel</button>
                <button onClick={() => handleRoleChange("lab")} className="w-full text-left px-3 py-1.5 text-xs text-emerald-200 hover:bg-emerald-800 rounded-lg">Lab Tester</button>
                <button onClick={() => handleRoleChange("transport")} className="w-full text-left px-3 py-1.5 text-xs text-emerald-200 hover:bg-emerald-800 rounded-lg">Transport Logistics</button>
                <button onClick={() => handleRoleChange("manufacturer")} className="w-full text-left px-3 py-1.5 text-xs text-emerald-200 hover:bg-emerald-800 rounded-lg">Manufacturer</button>
                <button onClick={() => handleRoleChange("consumer")} className="w-full text-left px-3 py-1.5 text-xs text-emerald-200 hover:bg-emerald-800 rounded-lg">Public Consumer</button>
              </div>
            </div>

            {/* User Session Login / Logout */}
            {api.getToken() ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-950/60 text-red-300 border border-red-500/30 hover:bg-red-900/60"
                title="Logout from session"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  href="/login"
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-900/50 text-emerald-200 border border-emerald-500/30 hover:bg-emerald-800/50"
                >
                  <LogIn className="w-3.5 h-3.5" /> Login
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30"
                >
                  <UserPlus className="w-3.5 h-3.5" /> Register
                </Link>
              </div>
            )}

            {/* MetaMask Button */}
            <button
              onClick={handleWalletConnect}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-emerald-950 hover:from-emerald-400 hover:to-teal-500 shadow-md shadow-emerald-500/20 transition-all"
            >
              <Wallet className="w-4 h-4" />
              {formatAddress(wallet)}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-emerald-300 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden glass-panel border-t border-emerald-500/20 px-4 pt-2 pb-6 space-y-3">
          <Link href="/" className="block py-2 text-emerald-100 hover:text-emerald-400">Home</Link>
          <Link href="/verify" className="block py-2 text-emerald-100 hover:text-emerald-400">Public Verify</Link>
          <Link href="/dashboard" className="block py-2 text-emerald-100 hover:text-emerald-400">Dashboard</Link>
          <Link href="/explorer" className="block py-2 text-emerald-100 hover:text-emerald-400">Blockchain Explorer</Link>
          <Link href="/analytics" className="block py-2 text-emerald-100 hover:text-emerald-400">AI Insights</Link>
          <div className="pt-2 border-t border-emerald-500/20 flex flex-col gap-2">
            {api.getToken() ? (
              <button onClick={handleLogout} className="w-full py-2 bg-red-900/60 text-red-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link href="/login" className="py-2 bg-emerald-900 text-center text-emerald-100 font-bold rounded-xl text-xs">Login</Link>
                <Link href="/register" className="py-2 bg-amber-500/20 text-center text-amber-300 font-bold rounded-xl text-xs">Register</Link>
              </div>
            )}
            <button onClick={handleWalletConnect} className="w-full py-2 bg-emerald-500 text-emerald-950 font-bold rounded-xl text-xs">
              {formatAddress(wallet)}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
