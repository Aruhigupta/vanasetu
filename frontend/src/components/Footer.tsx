"use client";

import React from "react";
import Link from "next/link";
import { Leaf, ShieldCheck, ExternalLink, Globe, Heart, Award } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-emerald-950 border-t border-emerald-500/20 pt-16 pb-12 text-emerald-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Col 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center">
                <Leaf className="w-6 h-6 text-emerald-950" />
              </div>
              <span className="text-xl font-bold text-white">HerbChain AI</span>
            </div>
            <p className="text-xs text-emerald-400/80 leading-relaxed">
              Smart India Hackathon 2025 Flagship Solution for the Ministry of AYUSH. Providing complete immutable supply chain traceability for Ayurvedic botanicals from farmer to final consumer.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-lg w-fit">
              <Award className="w-4 h-4" /> Polygon Amoy Testnet Live
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/" className="hover:text-emerald-400">Home Landing</Link></li>
              <li><Link href="/verify" className="hover:text-emerald-400">Public QR Verification</Link></li>
              <li><Link href="/dashboard" className="hover:text-emerald-400">Executive Dashboard</Link></li>
              <li><Link href="/explorer" className="hover:text-emerald-400">Polygon Blockchain Explorer</Link></li>
              <li><Link href="/analytics" className="hover:text-emerald-400">AI Quality Analytics</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Role Portals</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/dashboard/farmer" className="hover:text-emerald-400">Farmer Geo-Logging</Link></li>
              <li><Link href="/dashboard/collector" className="hover:text-emerald-400">Wild Herb Collector Portal</Link></li>
              <li><Link href="/dashboard/lab" className="hover:text-emerald-400">AYUSH Certified Lab</Link></li>
              <li><Link href="/dashboard/transport" className="hover:text-emerald-400">Cold Chain Logistics</Link></li>
              <li><Link href="/dashboard/manufacturer" className="hover:text-emerald-400">Pharma Manufacturer</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">UN SDG Alignment</h4>
            <div className="space-y-2 text-xs text-emerald-400/90">
              <div className="p-2 rounded bg-emerald-900/40 border border-emerald-500/20">
                <span className="font-bold text-white">SDG 3:</span> Good Health & Well-being
              </div>
              <div className="p-2 rounded bg-emerald-900/40 border border-emerald-500/20">
                <span className="font-bold text-white">SDG 12:</span> Responsible Consumption & Production
              </div>
              <div className="p-2 rounded bg-emerald-900/40 border border-emerald-500/20">
                <span className="font-bold text-white">SDG 15:</span> Life on Land & Forest Conservation
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-emerald-500/20 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-400/60">
          <p>© 2025 HerbChain AI. Smart India Hackathon Project. Developed for Ministry of AYUSH.</p>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <span>Polygon Mainnet Bridge</span>
            <span>IPFS Gateway</span>
            <span>REST API v1.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
