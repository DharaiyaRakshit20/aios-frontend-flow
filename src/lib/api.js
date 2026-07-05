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
  localStorage.removeItem("aios_is_admin");
}

// --- auth calls ---
export async function register(payload) {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
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
  // admin flag localStorage mein save karo
  if (typeof window !== "undefined") {
    localStorage.setItem("aios_is_admin", data.is_platform_admin ? "1" : "0");
  }
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

export async function getDashboardStats() {
  return apiFetch("/api/scanner/stats");
}

export async function updateOrganization(id, name, industry) {
  return apiFetch(`/api/organizations/${id}/`, {
    method: "PATCH",
    body: JSON.stringify({ name, industry }),
  });
}

export async function deleteOrganization(id) {
  return apiFetch(`/api/organizations/${id}/`, {
    method: "DELETE",
  });
}

export async function getProfile() {
  return apiFetch("/api/auth/me");
}

export async function updateProfile(fullName, ownAiKey) {
  const body = {};
  if (fullName !== undefined) body.full_name = fullName;
  if (ownAiKey !== undefined) body.own_ai_key = ownAiKey;
  return apiFetch("/api/auth/me", {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export async function getOrganization(id) {
  return apiFetch(`/api/organizations/${id}/`);
}

// --- blueprint ---
export async function generateBlueprint(reportId, opportunity) {
  return apiFetch("/api/blueprint/generate", {
    method: "POST",
    body: JSON.stringify({ report: reportId, opportunity }),
  });
}
export async function getBlueprint(id) {
  return apiFetch(`/api/blueprint/${id}`);
}

export async function getReportBlueprints(reportId) {
  return apiFetch(`/api/blueprint/list?report=${reportId}`);
}

// --- agents ---
export async function getAgents(orgId) {
  const q = orgId ? `?organization=${orgId}` : "";
  return apiFetch(`/api/agents/${q}`);
}
export async function getAgent(id) {
  return apiFetch(`/api/agents/${id}`);
}
export async function createAgent(payload) {
  return apiFetch("/api/agents/", { method: "POST", body: JSON.stringify(payload) });
}
export async function deleteAgent(id) {
  return apiFetch(`/api/agents/${id}`, { method: "DELETE" });
}
export async function getAgentMessages(id) {
  return apiFetch(`/api/agents/${id}/messages`);
}
export async function sendAgentMessage(id, message) {
  return apiFetch(`/api/agents/${id}/chat`, { method: "POST", body: JSON.stringify({ message }) });
}

export async function getMyRole(orgId) {
  return apiFetch(`/api/organizations/${orgId}/my-role`);
}

// --- platform admin ---
export async function getPlatformStats() {
  return apiFetch("/api/platform/stats");
}
export async function getPlatformUsers(search) {
  const q = search ? `?search=${encodeURIComponent(search)}` : "";
  return apiFetch(`/api/platform/users${q}`);
}
export async function getPlatformUser(id) {
  return apiFetch(`/api/platform/users/${id}`);
}
export async function setUserActive(id, isActive) {
  return apiFetch(`/api/platform/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ is_active: isActive }),
  });
}

export function isPlatformAdmin() {
  return typeof window !== "undefined" && localStorage.getItem("aios_is_admin") === "1";
}

// --- billing ---
export async function getPlans() {
  return apiFetch("/api/billing/plans");
}
export async function getMySubscription() {
  return apiFetch("/api/billing/me");
}
export async function subscribe(plan) {
  return apiFetch("/api/billing/subscribe", { method: "POST", body: JSON.stringify({ plan }) });
}
export async function getAdminRevenue() {
  return apiFetch("/api/billing/admin-revenue");
}

export async function getUsage() {
  return apiFetch("/api/billing/usage");
}

// --- team members ---
export async function getOrgMembers(orgId) {
  return apiFetch(`/api/organizations/${orgId}/members`);
}
export async function addOrgMember(orgId, email, role) {
  return apiFetch(`/api/organizations/${orgId}/members/add`, {
    method: "POST",
    body: JSON.stringify({ email, role }),
  });
}
export async function removeOrgMember(orgId, membershipId) {
  return apiFetch(`/api/organizations/${orgId}/members/${membershipId}`, {
    method: "DELETE",
  });
}

// --- notifications ---
export async function getNotifications() {
  return apiFetch("/api/notifications/");
}
export async function getUnreadCount() {
  return apiFetch("/api/notifications/unread");
}
export async function markNotificationsRead(id) {
  return apiFetch("/api/notifications/mark-read", {
    method: "POST",
    body: JSON.stringify(id ? { id } : {}),
  });
}

export async function clearNotifications(id) {
  return apiFetch("/api/notifications/clear", {
    method: "POST",
    body: JSON.stringify(id ? { id } : {}),
  });
}

// --- api keys ---
export async function getApiKeys() {
  return apiFetch("/api/keys/");
}
export async function createApiKey(name) {
  return apiFetch("/api/keys/create", { method: "POST", body: JSON.stringify({ name }) });
}
export async function revokeApiKey(id) {
  return apiFetch(`/api/keys/${id}`, { method: "DELETE" });
}

// --- privacy & data ---
export async function exportMyData() {
  return apiFetch("/api/auth/export-data");
}
export async function deleteMyAccount(confirmEmail) {
  return apiFetch("/api/auth/delete-account", {
    method: "DELETE",
    body: JSON.stringify({ confirm_email: confirmEmail }),
  });
}
