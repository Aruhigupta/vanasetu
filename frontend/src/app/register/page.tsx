"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Leaf, Lock, Mail, User, Wallet, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("farmer");
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await api.register({
        email: email.trim(),
        password: password,
        full_name: fullName.trim(),
        role: role.toLowerCase(),
        wallet_address: walletAddress.trim() || null
      });

      setSuccessMsg("Registration successful! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || "Registration failed. Email may already be registered.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="glass-panel max-w-md w-full p-8 rounded-3xl border border-emerald-500/30 space-y-6 shadow-2xl">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-700 mx-auto flex items-center justify-center shadow-lg">
            <Leaf className="w-7 h-7 text-emerald-950" />
          </div>
          <h2 className="text-2xl font-black text-white">Create HerbChain Account</h2>
          <p className="text-xs text-emerald-300/80">Register as a certified AYUSH supply chain actor</p>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-red-950/80 border border-red-500/40 rounded-xl text-xs text-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-xs text-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          
          <div>
            <label className="text-xs text-emerald-200 block mb-1">Full Name / Organization</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Dr. Ramesh Gowda / Dabur Organics"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-emerald-950 text-white text-xs rounded-xl border border-emerald-500/30 focus:outline-none focus:border-emerald-400"
              />
              <User className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="text-xs text-emerald-200 block mb-1">System Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-emerald-950 text-white text-xs p-3 rounded-xl border border-emerald-500/30 capitalize focus:outline-none focus:border-emerald-400"
            >
              <option value="farmer">Farmer / Wild Herb Collector</option>
              <option value="collector">Forest Department Collector</option>
              <option value="lab">AYUSH Testing Laboratory</option>
              <option value="transport">Cold-Chain Logistics Partner</option>
              <option value="manufacturer">Ayurvedic Pharma Manufacturer</option>
              <option value="admin">System Administrator</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-emerald-200 block mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-emerald-950 text-white text-xs rounded-xl border border-emerald-500/30 focus:outline-none focus:border-emerald-400"
              />
              <Mail className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="text-xs text-emerald-200 block mb-1">Create Password</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-emerald-950 text-white text-xs rounded-xl border border-emerald-500/30 focus:outline-none focus:border-emerald-400"
              />
              <Lock className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="text-xs text-emerald-200 block mb-1">Polygon Wallet Address (Optional)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="0x8920...43e7"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-emerald-950 text-white text-xs rounded-xl border border-emerald-500/30 focus:outline-none focus:border-emerald-400 font-mono"
              />
              <Wallet className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-emerald-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            {loading ? "Creating Account..." : "Create Verified Account"} <ArrowRight className="w-4 h-4" />
          </button>

        </form>

        <div className="text-center text-xs text-emerald-300/80">
          Already have an account?{" "}
          <Link href="/login" className="text-emerald-400 font-bold hover:underline">
            Login Here
          </Link>
        </div>

      </div>
    </div>
  );
}
