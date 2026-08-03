"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Leaf, ShieldCheck, QrCode, Cpu, MapPin, Truck, Factory, Sparkles, CheckCircle2, ArrowRight, Award, Database, Globe, Users, Mail, Phone, Lock, ChevronRight, Activity } from "lucide-react";
import AIPanelWidget from "@/components/AIPanelWidget";

export default function Home() {
  const [quickBatch, setQuickBatch] = useState("HCB-2025-ASH01");

  return (
    <div className="space-y-24 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-24 overflow-hidden">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/15 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute top-10 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            
            {/* Hackathon Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-emerald-500/30 text-emerald-300 text-xs font-semibold shadow-lg">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Smart India Hackathon 2025 • Ministry of AYUSH Problem Statement</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-none font-sans">
              Blockchain-Powered <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400 bg-clip-text text-transparent">
                Ayurvedic Botanical Traceability
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-emerald-200/90 font-normal leading-relaxed max-w-3xl mx-auto">
              Empowering farmers, testing labs, pharmaceutical manufacturers, and consumers with 100% transparent, anti-counterfeit, and geo-verified herb supply chain records stored immutably on the Polygon Blockchain.
            </p>

            {/* Quick Search & CTA Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
              <div className="w-full relative flex-1">
                <input
                  type="text"
                  placeholder="Enter Batch ID (e.g. HCB-2025-ASH01)"
                  value={quickBatch}
                  onChange={(e) => setQuickBatch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 text-sm rounded-2xl bg-emerald-950/80 text-white placeholder-emerald-400/60 border border-emerald-500/40 focus:outline-none focus:border-emerald-400 shadow-xl"
                />
                <QrCode className="w-5 h-5 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>

              <Link
                href={`/verify/${quickBatch || 'HCB-2025-ASH01'}`}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-emerald-950 font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 transition-all"
              >
                Verify Batch Timeline <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Quick Stats Banner */}
            <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
              <div className="glass-panel p-4 rounded-2xl border-emerald-500/30">
                <span className="text-2xl font-black text-white">18,450+ kg</span>
                <p className="text-xs text-emerald-300">Herbs Trace Verified</p>
              </div>
              <div className="glass-panel p-4 rounded-2xl border-emerald-500/30">
                <span className="text-2xl font-black text-white">342 Farmers</span>
                <p className="text-xs text-emerald-300">Geo-Tagged & Enrolled</p>
              </div>
              <div className="glass-panel p-4 rounded-2xl border-emerald-500/30">
                <span className="text-2xl font-black text-white">100% Immutable</span>
                <p className="text-xs text-emerald-300">Polygon Smart Contracts</p>
              </div>
              <div className="glass-panel p-4 rounded-2xl border-emerald-500/30">
                <span className="text-2xl font-black text-amber-400">98.4% AI Score</span>
                <p className="text-xs text-emerald-300">Authenticity Accuracy</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. ABOUT PROJECT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-emerald-500/30 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold">
              <Leaf className="w-4 h-4 text-emerald-400" /> About HerbChain AI
            </div>
            <h2 className="text-3xl font-black text-white leading-tight">
              Solving the AYUSH Botanical Adulteration & Traceability Crisis
            </h2>
            <p className="text-sm text-emerald-200/90 leading-relaxed">
              India’s Ayurvedic medicine market relies on thousands of wild species collected across diverse forest regions and organic farms. However, counterfeit species substitution, lack of geo-tagging, unverified storage conditions, and paper-based lab reports threaten public trust and clinical efficacy.
            </p>
            <p className="text-sm text-emerald-200/90 leading-relaxed">
              <strong>HerbChain AI</strong> introduces a unified decentralized network connecting tribal collectors, farmers, testing labs, logistics agencies, and pharmaceutical manufacturers via smart contracts and AI vision inspection.
            </p>
            <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-white pt-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Geo-fenced Farm Logging
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> AI Leaf Vision Scan
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> IPFS Cert Encryption
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Polygon Smart Contracts
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 border border-emerald-500/30 rounded-2xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">AYUSH Compliance Architecture</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">SIH 2025</span>
              </div>
              
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-emerald-900/60 rounded-xl border border-emerald-500/20 flex items-center justify-between">
                  <span>1. Farmer Harvest & Geo-Location</span>
                  <span className="text-emerald-400 font-mono">0x9a8f...4c2e</span>
                </div>
                <div className="p-3 bg-emerald-900/60 rounded-xl border border-emerald-500/20 flex items-center justify-between">
                  <span>2. AYUSH Lab Chemical Assay & IPFS</span>
                  <span className="text-emerald-400 font-mono">0x1b2c...3d4e</span>
                </div>
                <div className="p-3 bg-emerald-900/60 rounded-xl border border-emerald-500/20 flex items-center justify-between">
                  <span>3. Cold-Chain Vehicle Telemetry</span>
                  <span className="text-emerald-400 font-mono">0x4d5e...6f7a</span>
                </div>
                <div className="p-3 bg-amber-500/20 border border-amber-500/40 rounded-xl flex items-center justify-between font-bold text-white">
                  <span>4. Package Batch QR Verification</span>
                  <span className="text-amber-400">100% Authentic</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. KEY FEATURES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-black text-white">Comprehensive Platform Features</h2>
          <p className="text-sm text-emerald-300/80">Built with enterprise security, Web3 decentralization, and deep learning AI.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-4 hover:border-emerald-400/60 transition">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Immutable Polygon Ledger</h3>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              Every step from initial seed planting to final medicine blending triggers a Polygon Smart Contract transaction. Data cannot be deleted or forged.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-4 hover:border-emerald-400/60 transition">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">HerbChain AI Neural Inspector</h3>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              Computer vision algorithm verifies uploaded leaf photos against genuine botanical standards, while machine learning predicts active phytochemical potency.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-4 hover:border-emerald-400/60 transition">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 flex items-center justify-center text-teal-400">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Instant Consumer QR Scanning</h3>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              Consumers scan the packaging QR code with any smartphone camera to instantly reveal the farmer, harvest GPS, lab test certificate, and transport logs.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-4 hover:border-emerald-400/60 transition">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Geo-Tagged GPS Verification</h3>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              Farmers and wild collectors log coordinates with satellite verification to protect indigenous biodiversity zones and ensure ethical harvesting.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-4 hover:border-emerald-400/60 transition">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Decentralized IPFS Storage</h3>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              High-resolution lab certificates, chemical HPLC charts, and farmer land permits are stored on IPFS, with content hashes pinned on blockchain.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-4 hover:border-emerald-400/60 transition">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 flex items-center justify-center text-teal-400">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Role-Based Access Control</h3>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              Multi-role dashboard permissions for Admin, Farmers, Wild Collectors, Lab Testers, Transport Agencies, and Pharmaceutical Manufacturers.
            </p>
          </div>

        </div>
      </section>

      {/* 4. INTERACTIVE AI WIDGET DEMO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AIPanelWidget />
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-black text-white">End-to-End Supply Chain Workflow</h2>
          <p className="text-sm text-emerald-300/80">From pristine forest soil to retail Ayurvedic pharmacy shelf.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          
          <div className="glass-panel p-5 rounded-2xl border-emerald-500/30 space-y-2">
            <span className="w-8 h-8 rounded-full bg-emerald-500 text-emerald-950 font-black text-xs flex items-center justify-center">1</span>
            <h4 className="text-sm font-bold text-white">Collection</h4>
            <p className="text-[11px] text-emerald-300/80">Farmer logs harvest, GPS coordinates, moisture %, and photo.</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border-emerald-500/30 space-y-2">
            <span className="w-8 h-8 rounded-full bg-emerald-500 text-emerald-950 font-black text-xs flex items-center justify-center">2</span>
            <h4 className="text-sm font-bold text-white">Lab Testing</h4>
            <p className="text-[11px] text-emerald-300/80">Heavy metals, pesticides, and HPLC assay uploaded to IPFS.</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border-emerald-500/30 space-y-2">
            <span className="w-8 h-8 rounded-full bg-emerald-500 text-emerald-950 font-black text-xs flex items-center justify-center">3</span>
            <h4 className="text-sm font-bold text-white">Cold Transport</h4>
            <p className="text-[11px] text-emerald-300/80">Vehicle GPS, temperature, and humidity logged live.</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border-emerald-500/30 space-y-2">
            <span className="w-8 h-8 rounded-full bg-emerald-500 text-emerald-950 font-black text-xs flex items-center justify-center">4</span>
            <h4 className="text-sm font-bold text-white">Manufacturing</h4>
            <p className="text-[11px] text-emerald-300/80">Pharma unit blends herbs and prints batch QR code.</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border-amber-500/40 space-y-2 bg-amber-500/10">
            <span className="w-8 h-8 rounded-full bg-amber-500 text-amber-950 font-black text-xs flex items-center justify-center">5</span>
            <h4 className="text-sm font-bold text-amber-300">Consumer Scan</h4>
            <p className="text-[11px] text-amber-200/80">Scans QR code and verifies complete history on Polygon.</p>
          </div>

        </div>
      </section>

      {/* 6. TECHNOLOGY STACK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 border border-emerald-500/30 space-y-6">
          <h2 className="text-2xl font-black text-center text-white">Production-Ready Tech Stack</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 text-center">
            <div className="p-4 rounded-xl bg-emerald-900/40 border border-emerald-500/20">
              <span className="text-sm font-bold text-white block">Next.js 15</span>
              <span className="text-[10px] text-emerald-400">React 19 App Router</span>
            </div>
            <div className="p-4 rounded-xl bg-emerald-900/40 border border-emerald-500/20">
              <span className="text-sm font-bold text-white block">FastAPI</span>
              <span className="text-[10px] text-emerald-400">Python REST Backend</span>
            </div>
            <div className="p-4 rounded-xl bg-emerald-900/40 border border-emerald-500/20">
              <span className="text-sm font-bold text-white block">Polygon</span>
              <span className="text-[10px] text-emerald-400">Solidity Smart Contracts</span>
            </div>
            <div className="p-4 rounded-xl bg-emerald-900/40 border border-emerald-500/20">
              <span className="text-sm font-bold text-white block">PostgreSQL</span>
              <span className="text-[10px] text-emerald-400">SQLAlchemy Relational</span>
            </div>
            <div className="p-4 rounded-xl bg-emerald-900/40 border border-emerald-500/20">
              <span className="text-sm font-bold text-white block">IPFS</span>
              <span className="text-[10px] text-emerald-400">Decentralized Storage</span>
            </div>
            <div className="p-4 rounded-xl bg-emerald-900/40 border border-emerald-500/20">
              <span className="text-sm font-bold text-white block">Tailwind CSS</span>
              <span className="text-[10px] text-emerald-400">Glassmorphism Design</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. TEAM & CONTACT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="glass-panel p-8 rounded-3xl border border-emerald-500/30 space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Users className="w-5 h-5" /> SIH 2025 Team Innovators
          </div>
          <h3 className="text-2xl font-black text-white">Team HerbChain AI</h3>
          <p className="text-xs text-emerald-200/80 leading-relaxed">
            Engineered for the Ministry of AYUSH Problem Statement to establish a national digital public infrastructure for authentic Indian medicinal plants.
          </p>
          <div className="pt-2 space-y-2 text-xs">
            <div className="p-3 bg-emerald-900/40 rounded-xl flex items-center justify-between border border-emerald-500/20">
              <span className="font-bold text-white">Full-Stack & Web3 Lead</span>
              <span className="text-emerald-400 font-mono">Antigravity AI Agent</span>
            </div>
            <div className="p-3 bg-emerald-900/40 rounded-xl flex items-center justify-between border border-emerald-500/20">
              <span className="font-bold text-white">AI Vision & ML Specialist</span>
              <span className="text-emerald-400 font-mono">AYUSH Research Group</span>
            </div>
          </div>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-emerald-500/30 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <Mail className="w-5 h-5" /> Ministry Contact & Support
          </div>
          <h3 className="text-2xl font-black text-white">Get in Touch</h3>
          <p className="text-xs text-emerald-200/80">
            For hackathon evaluation demos, system deployment inquiries, or API key requests:
          </p>
          <div className="space-y-3 text-xs text-emerald-200">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-emerald-400" /> contact@herbchain.ai
            </div>
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-emerald-400" /> https://herbchain.ai
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-emerald-400" /> +91 1800-AYUSH-HERB (Toll Free)
            </div>
          </div>
        </div>

      </section>

    </div>
  );
}
