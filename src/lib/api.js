const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// --- token storage (browser ke localStorage mein) ---
export function setToken(token) {
  localStorage.setItem("aios_token", token);
}
export function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("aios_token") : null;
}
export function logout() {
  localStorage.removeItem("aios_token");
}

// --- auth calls ---
export async function register(email, password, fullName) {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, full_name: fullName }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || JSON.stringify(data));
  setToken(data.access);
  return data;
}

export async function login(email, password) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Login failed");
  setToken(data.access);
  return data;
}

// --- generic authed request (har protected call isse jaayegi) ---
export async function apiFetch(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || JSON.stringify(data));
  return data;
}

// --- organizations ---
export async function getOrganizations() {
  return apiFetch("/api/organizations/");
}
export async function createOrganization(name, industry) {
  return apiFetch("/api/organizations/", {
    method: "POST",
    body: JSON.stringify({ name, industry }),
  });
}

// --- scanner ---
export async function runScan(organization, intake) {
  return apiFetch("/api/scanner/scan", {
    method: "POST",
    body: JSON.stringify({ organization, intake }),
  });
}
export async function getReports() {
  return apiFetch("/api/scanner/reports");
}
export async function getReport(id) {
  return apiFetch(`/api/scanner/reports/${id}`);
}

// --- audit logs ---
export async function getAuditLogs() {
  return apiFetch("/api/audit/");
}