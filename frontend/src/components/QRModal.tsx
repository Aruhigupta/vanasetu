"use client";

import React, { useState, useEffect } from "react";
import { QrCode, Download, Printer, X, Check, ExternalLink } from "lucide-react";
import { api } from "@/lib/api";

interface QRModalProps {
  batchId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function QRModal({ batchId, isOpen, onClose }: QRModalProps) {
  const [qrData, setQrData] = useState<{ qr_code_image: string; verification_url: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && batchId) {
      setLoading(true);
      api.generateQR(batchId)
        .then((res) => setQrData(res))
        .catch(() => {
          // Fallback static URL generator
          const verification_url = `http://localhost:3000/verify/${batchId}`;
          setQrData({
            verification_url,
            qr_code_image: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(verification_url)}`
          });
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, batchId]);

  if (!isOpen) return null;

  const copyUrl = () => {
    if (qrData?.verification_url) {
      navigator.clipboard.writeText(qrData.verification_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-emerald-950 border border-emerald-500/40 rounded-3xl max-w-md w-full p-6 text-center relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-emerald-400 hover:bg-emerald-900/60"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/40 mx-auto flex items-center justify-center mb-3">
          <QrCode className="w-6 h-6 text-emerald-400" />
        </div>

        <h3 className="text-xl font-bold text-white mb-1">Batch QR Code</h3>
        <p className="text-xs text-emerald-300/80 mb-4 font-mono">ID: {batchId}</p>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-emerald-400 mt-2">Generating Vector QR...</span>
          </div>
        ) : (
          <div className="bg-white p-4 rounded-2xl inline-block shadow-inner mb-4">
            {qrData?.qr_code_image && (
              <img
                src={qrData.qr_code_image}
                alt={`QR for ${batchId}`}
                className="w-56 h-56 mx-auto object-contain"
              />
            )}
          </div>
        )}

        <div className="bg-emerald-900/50 p-3 rounded-xl border border-emerald-500/30 text-xs text-emerald-200 mb-6 flex items-center justify-between">
          <span className="truncate max-w-[240px] font-mono">{qrData?.verification_url}</span>
          <button
            onClick={copyUrl}
            className="px-2.5 py-1 bg-emerald-500/30 hover:bg-emerald-500/50 text-emerald-300 rounded font-semibold transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : "Copy"}
          </button>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => window.print()}
            className="flex-1 py-2.5 bg-emerald-900 hover:bg-emerald-800 text-emerald-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-emerald-500/30"
          >
            <Printer className="w-4 h-4" /> Print Label
          </button>
          <a
            href={qrData?.verification_url}
            target="_blank"
            rel="noreferrer"
            className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-4 h-4" /> Verify Page
          </a>
        </div>
      </div>
    </div>
  );
}
