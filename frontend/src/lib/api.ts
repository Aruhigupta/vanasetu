const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export async function fetchFromAPI(endpoint: string, options: RequestInit = {}) {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || `API Request failed with status ${res.status}`);
    }

    return await res.json();
  } catch (err: any) {
    console.warn(`[HerbChain API] Warning requesting ${endpoint}:`, err.message);
    throw err;
  }
}

// Helper API methods
export const api = {
  fetchFromAPI,
  getHerbs: () => fetchFromAPI("/herbs"),
  getCollections: () => fetchFromAPI("/collections"),
  getMetrics: () => fetchFromAPI("/dashboard/metrics"),
  getTransactions: () => fetchFromAPI("/blockchain/transactions"),
  getBlockchainStatus: () => fetchFromAPI("/blockchain/status"),
  verifyBatch: (batchId: string) => fetchFromAPI(`/qr/verify/${batchId}`),
  generateQR: (batchId: string) => fetchFromAPI(`/qr/generate/${batchId}`),
  detectFakeHerb: (data: { image_url_or_hash: string; claimed_herb_name: string }) =>
    fetchFromAPI("/ai/detect-fake-herb", { method: "POST", body: JSON.stringify(data) }),
  predictQuality: (data: { herb_name: string; region: string; season: string; moisture_pct: number; drying_method: string }) =>
    fetchFromAPI("/ai/predict-quality", { method: "POST", body: JSON.stringify(data) }),
};

