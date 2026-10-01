"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { api, getStoredUser, getToken } from "@/lib/api";
import { ShieldAlert, RefreshCw } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    const stored = getStoredUser();
    if (stored) {
      setUser(stored);
      checkRoleAccess(stored);
      setLoading(false);
    } else {
      api.getMe()
        .then((u) => {
          setUser(u);
          checkRoleAccess(u);
        })
        .catch(() => {
          api.removeToken();
          router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
        })
        .finally(() => setLoading(false));
    }
  }, [pathname]);

  const checkRoleAccess = (u: any) => {
    if (!allowedRoles || allowedRoles.length === 0) return;
    const userRole = (u.role || "").toLowerCase();
    const isAllowed = allowedRoles.some((r) => r.toLowerCase() === userRole) || userRole === "admin";
    if (!isAllowed) {
      setUnauthorized(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-emerald-300">Verifying session permissions...</p>
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-red-500/40 space-y-6">
          <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-400/50 mx-auto flex items-center justify-center text-red-400">
            <ShieldAlert className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Access Denied (403 Forbidden)</h2>
            <p className="text-xs text-red-200/90 mt-2 font-mono">
              Your user role &apos;{user?.role}&apos; is not authorized to access path &apos;{pathname}&apos;.
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="px-6 py-2.5 bg-emerald-500 text-emerald-950 font-bold text-xs rounded-xl hover:bg-emerald-400"
            >
              Return to Dashboard Overview
            </button>
            <button
              onClick={() => {
                api.logout();
                router.push("/login");
              }}
              className="px-6 py-2.5 bg-red-950 text-red-200 border border-red-500/30 font-bold text-xs rounded-xl"
            >
              Switch Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
