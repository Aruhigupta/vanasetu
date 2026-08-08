// Centralized API Client for HerbChain AI
// Deployed Railway FastAPI Backend Integration

const getApiBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, "");
  }
  return "https://precious-rejoicing-production-d65d.up.railway.app/api/v1";
};

export const API_BASE_URL = getApiBaseUrl();

// Auth token storage helpers
export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("access_token") || localStorage.getItem("token");
  }
  return null;
};

export const setToken = (token: string, user?: any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", token);
    localStorage.setItem("token", token);
    if (user) {
      localStorage.setItem("user_info", JSON.stringify(user));
      if (user.role) localStorage.setItem("user_role", user.role);
      if (user.email) localStorage.setItem("user_email", user.email);
    }
  }
};

export const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
    localStorage.removeItem("token");
    localStorage.removeItem("user_info");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_email");
  }
};

export const getStoredUser = () => {
  if (typeof window !== "undefined") {
    const info = localStorage.getItem("user_info");
    if (info) {
      try {
        return JSON.parse(info);
      } catch (e) {
        return null;
      }
    }
  }
  return null;
};

// Generic Fetch Wrapper
export async function fetchFromAPI<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (res.status === 401) {
      removeToken();
    }

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      let msg = `Request failed with status ${res.status}`;
      if (typeof errorData.detail === "string") {
        msg = errorData.detail;
      } else if (Array.isArray(errorData.detail)) {
        msg = errorData.detail.map((e: any) => `${e.loc?.join(".") || "field"}: ${e.msg}`).join(", ");
      }
      throw new Error(msg);
    }

    return await res.json();
  } catch (err: any) {
    console.error(`[HerbChain API Error] ${url}:`, err.message);
    throw err;
  }
}

// Interfaces matching Railway Swagger openapi.json
export interface UserRegisterData {
  email: string;
  password: string;
  full_name: string;
  role: string;
  wallet_address?: string | null;
}

export interface UserLoginData {
  email: string;
  password: string;
}

export interface HerbCreateData {
  common_name: string;
  botanical_name: string;
  ayush_category: string;
  active_compounds: string;
  description?: string | null;
  standard_moisture_max?: number;
  standard_purity_min?: number;
}

export interface CollectionCreateData {
  herb_id: number;
  quantity_kg: number;
  gps_coordinates: string;
  location_address: string;
  moisture_pct: number;
  image_ipfs_hash?: string | null;
}

export interface LabReportCreateData {
  batch_id: string;
  lab_name: string;
  tester_name: string;
  chemical_assay: string;
  heavy_metals_pass?: boolean;
  pesticides_pass?: boolean;
  microbial_pass?: boolean;
  potency_percentage: number;
  cert_ipfs_hash?: string | null;
}

export interface TransportCreateData {
  batch_id: string;
  carrier_agency: string;
  driver_name: string;
  vehicle_no: string;
  current_gps: string;
  temperature_celsius: number;
  humidity_percentage: number;
  status_notes?: string | null;
}

export interface ManufactureBatchData {
  batch_id: string;
  facility_name: string;
  medicine_name: string;
  ayush_lic_no: string;
  final_product_ipfs_hash?: string;
}

export interface AIHerbCheckData {
  image_url_or_hash: string;
  claimed_herb_name: string;
}

export interface AIQualityInputData {
  herb_name: string;
  region: string;
  season: string;
  moisture_pct: number;
  drying_method: string;
}

// Centralized API Service Methods
export const api = {
  fetchFromAPI,
  getToken,
  setToken,
  removeToken,
  getStoredUser,

  // Auth APIs
  register: (data: UserRegisterData) =>
    fetchFromAPI("/auth/register", { method: "POST", body: JSON.stringify(data) }),

  login: async (data: UserLoginData) => {
    const res = await fetchFromAPI("/auth/login", { method: "POST", body: JSON.stringify(data) });
    if (res && res.access_token) {
      setToken(res.access_token, res.user);
    }
    return res;
  },

  logout: () => {
    removeToken();
  },

  // Herbs APIs
  getHerbs: () => fetchFromAPI("/herbs"),
  getHerbById: (herbId: number) => fetchFromAPI(`/herbs/${herbId}`),
  createHerb: (data: HerbCreateData) =>
    fetchFromAPI("/herbs", { method: "POST", body: JSON.stringify(data) }),

  // Collections APIs
  getCollections: () => fetchFromAPI("/collections"),
  getCollectionByBatch: (batchId: string) => fetchFromAPI(`/collections/${batchId}`),
  createCollection: (data: CollectionCreateData, farmerId: number = 1) =>
    fetchFromAPI(`/collections?farmer_id=${farmerId}`, { method: "POST", body: JSON.stringify(data) }),

  // Lab Report APIs
  addLabReport: (data: LabReportCreateData) =>
    fetchFromAPI("/lab", { method: "POST", body: JSON.stringify(data) }),
  getLabReport: (batchId: string) => fetchFromAPI(`/lab/${batchId}`),

  // Transport Logistics APIs
  updateTransport: (data: TransportCreateData) =>
    fetchFromAPI("/transport", { method: "POST", body: JSON.stringify(data) }),
  getTransportLogs: (batchId: string) => fetchFromAPI(`/transport/${batchId}`),

  // Manufacturing APIs
  createManufactureBatch: (data: ManufactureBatchData) =>
    fetchFromAPI("/manufacturers/batch", { method: "POST", body: JSON.stringify(data) }),

  // Dashboard Metrics API
  getMetrics: () => fetchFromAPI("/dashboard/metrics"),

  // Blockchain Explorer APIs
  getTransactions: (limit: number = 20) => fetchFromAPI(`/blockchain/transactions?limit=${limit}`),
  getBlockchainStatus: () => fetchFromAPI("/blockchain/status"),

  // QR Code APIs
  generateQR: (batchId: string) => fetchFromAPI(`/qr/generate/${batchId}`),
  verifyBatch: (batchId: string) => fetchFromAPI(`/qr/verify/${batchId}`),

  // AI Service APIs
  detectFakeHerb: (data: AIHerbCheckData) =>
    fetchFromAPI("/ai/detect-fake-herb", { method: "POST", body: JSON.stringify(data) }),
  predictQuality: (data: AIQualityInputData) =>
    fetchFromAPI("/ai/predict-quality", { method: "POST", body: JSON.stringify(data) }),
  getStorageConditions: (herbName: string) => fetchFromAPI(`/ai/storage-conditions/${encodeURIComponent(herbName)}`),
  detectAnomalies: (batchId: string) => fetchFromAPI(`/ai/detect-anomalies/${batchId}`),
  generateQualityReport: (batchId: string, herbName: string = "Ashwagandha") =>
    fetchFromAPI(`/ai/generate-quality-report/${batchId}?herb_name=${encodeURIComponent(herbName)}`),
};
