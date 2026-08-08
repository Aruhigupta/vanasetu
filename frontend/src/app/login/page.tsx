"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Leaf, Lock, Mail, Wallet, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { connectMetaMask } from "@/lib/web3";
import { api } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await api.login({
        email: email.trim(),
        password: password
      });

      setSuccessMsg("Login successful! Redirecting...");
      const role = res.user?.role || "admin";

      setTimeout(() => {
        if (role === "admin") router.push("/dashboard/admin");
        else if (role === "consumer") router.push("/verify");
        else router.push(`/dashboard/${role}`);
      }, 500);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to log in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleMetaMaskLogin = async () => {
    try {
      const res = await connectMetaMask();
      if (res.address) {
        localStorage.setItem("wallet_addr", res.address);
        setSuccessMsg(`MetaMask Connected: ${res.address.slice(0, 6)}...${res.address.slice(-4)}`);
        setTimeout(() => router.push("/dashboard"), 800);
      }
    } catch (e: any) {
      setErrorMsg("MetaMask connection cancelled or failed.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="glass-panel max-w-md w-full p-8 rounded-3xl border border-emerald-500/30 space-y-6 shadow-2xl">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-700 mx-auto flex items-center justify-center shadow-lg">
            <Leaf className="w-7 h-7 text-emerald-950" />
          </div>
          <h2 className="text-2xl font-black text-white">Login to HerbChain AI</h2>
          <p className="text-xs text-emerald-300/80">Access your verified AYUSH supply chain account</p>
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

        <form onSubmit={handleLogin} className="space-y-4">
          
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
            <label className="text-xs text-emerald-200 block mb-1">Password</label>
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-emerald-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            {loading ? "Authenticating with Railway API..." : "Login to Portal"} <ArrowRight className="w-4 h-4" />
          </button>

        </form>

        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-emerald-500/20 w-full"></div>
          <span className="bg-emerald-950 px-3 text-[10px] text-emerald-400 uppercase font-bold relative z-10">Or Connect Web3</span>
        </div>

        <button
          onClick={handleMetaMaskLogin}
          type="button"
          className="w-full py-3 bg-emerald-900 hover:bg-emerald-800 text-emerald-200 font-bold text-xs rounded-xl flex items-center justify-center gap-2 border border-emerald-500/30"
        >
          <Wallet className="w-4 h-4 text-emerald-400" /> Connect MetaMask Wallet
        </button>

        <div className="text-center text-xs text-emerald-300/80">
          Don't have an account?{" "}
          <Link href="/register" className="text-emerald-400 font-bold hover:underline">
            Register New Account
          </Link>
        </div>

      </div>
    </div>
  );
}
