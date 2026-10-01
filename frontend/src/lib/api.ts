// Centralized API Client for HerbChain AI / Vanasetu

const getApiBaseUrl = () => {
  if (typeof window !== "undefined" && (window as any)._env_?.NEXT_PUBLIC_API_URL) {
    return (window as any)._env_.NEXT_PUBLIC_API_URL.replace(/\/+$/, "");
  }
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, "");
  }
  return "http://localhost:8000/api/v1";
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
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        // Redirect to login if unauthenticated on protected routes
        // window.location.href = "/login";
      }
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

// File Upload Wrapper (Multipart Form Data)
export async function uploadFileToAPI(file: File): Promise<any> {
  const token = getToken();
  const formData = new FormData();
  formData.append("file", file);

  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}/files/upload`;
  const res = await fetch(url, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `File upload failed with status ${res.status}`);
  }

  return await res.json();
}

// Interfaces
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

export interface WildCollectionCreateData {
  herb_id: number;
  forest_region: string;
  permit_number: string;
  collection_quantity_kg: number;
  gps_coordinates: string;
  photo_cid?: string | null;
}

export interface LabReportCreateData {
  batch_id: string;
  lab_name: string;
  tester_name: string;
  chemical_assay: string;
  heavy_metals_pass: boolean;
  pesticides_pass: boolean;
  microbial_pass: boolean;
  potency_percentage: number;
  cert_ipfs_hash?: string | null;
  hplc_report_cid?: string | null;
  heavy_metal_report_cid?: string | null;
  pesticide_report_cid?: string | null;
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
  final_product_ipfs_hash?: string | null;
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

// Centralized API Methods
export const api = {
  fetchFromAPI,
  uploadFileToAPI,
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

  getMe: () => fetchFromAPI("/auth/me"),

  logout: () => {
    removeToken();
  },

  // File Upload API
  uploadFile: (file: File) => uploadFileToAPI(file),

  // Herbs Catalog APIs
  getHerbs: () => fetchFromAPI("/herbs"),
  getHerbById: (herbId: number) => fetchFromAPI(`/herbs/${herbId}`),
  createHerb: (data: HerbCreateData) =>
    fetchFromAPI("/herbs", { method: "POST", body: JSON.stringify(data) }),

  // Collections (Farmer) APIs
  getCollections: () => fetchFromAPI("/collections"),
  getCollectionByBatch: (batchId: string) => fetchFromAPI(`/collections/${batchId}`),
  createCollection: (data: CollectionCreateData) =>
    fetchFromAPI("/collections", { method: "POST", body: JSON.stringify(data) }),

  // Wild Collections (Collector) APIs
  getWildCollections: () => fetchFromAPI("/collections/wild"),
  createWildCollection: (data: WildCollectionCreateData) =>
    fetchFromAPI("/collections/wild", { method: "POST", body: JSON.stringify(data) }),

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
  getManufacturedProduct: (finalBatchId: string) => fetchFromAPI(`/manufacturers/batch/${finalBatchId}`),

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
