export const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : "/api";

// Access token is stored in memory only (not localStorage) for XSS protection.
// The httpOnly refresh token cookie handles session persistence across page loads.
let accessToken = "";

function setAccessToken(token) {
  accessToken = token || "";
}

function getAccessToken() {
  return accessToken;
}

async function refreshToken() {
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Refresh failed");
    const data = await res.json();
    setAccessToken(data.accessToken);
    return data.accessToken;
  } catch {
    setAccessToken("");
    return null;
  }
}

async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = { ...options.headers };

  // Don't set Content-Type for FormData (browser handles multipart boundary)
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  let res;
  try {
    res = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });
  } catch {
    // Network error — return a synthetic response
    return new Response(JSON.stringify({ message: "Network error" }), { status: 0 });
  }

  // If 401 or 403, try refreshing the token once
  if ((res.status === 401 || res.status === 403) && accessToken) {
    const newToken = await refreshToken();
    if (newToken) {
      headers["Authorization"] = `Bearer ${newToken}`;
      try {
        res = await fetch(url, {
          ...options,
          headers,
          credentials: "include",
        });
      } catch {
        return new Response(JSON.stringify({ message: "Network error" }), { status: 0 });
      }
    }
  }

  return res;
}

// ==================== AUTH ====================
export async function apiSignup(email, username, password, confirmPassword) {
  const res = await apiFetch("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, username, password, confirmPassword }),
  });
  const data = await res.json();
  if (res.ok && data.accessToken) setAccessToken(data.accessToken);
  return { ok: res.ok, data };
}

export async function apiLogin(usernameOrEmail, password) {
  const isEmail = usernameOrEmail.includes("@");
  const body = isEmail
    ? { email: usernameOrEmail, password }
    : { username: usernameOrEmail, password };

  const res = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (res.ok && data.accessToken) setAccessToken(data.accessToken);
  return { ok: res.ok, data };
}

export async function apiGoogleAuth(credential) {
  const res = await apiFetch("/auth/google", {
    method: "POST",
    body: JSON.stringify({ credential }),
  });
  const data = await res.json();
  if (res.ok && data.accessToken) setAccessToken(data.accessToken);
  return { ok: res.ok, data };
}

export async function apiLogout() {
  await apiFetch("/auth/logout", { method: "POST" });
  setAccessToken("");
}

export async function apiRefresh() {
  const token = await refreshToken();
  return !!token;
}

// ==================== MODELS (public) ====================
export async function apiGetModels() {
  const res = await apiFetch("/models");
  return res.json();
}

export async function apiSearchModels(params) {
  const qs = new URLSearchParams(params).toString();
  const res = await apiFetch(`/models/search?${qs}`);
  return res.json(); // returns { models, page, totalPages, totalCount }
}

export async function apiGetModelById(id) {
  const res = await apiFetch(`/models/${id}`);
  return res.json();
}

// ==================== MODELS (authenticated) ====================
export async function apiCreateModel(formData) {
  const res = await apiFetch("/models", {
    method: "POST",
    body: formData, // FormData with modelFile, thumbnail, + fields
  });
  return { ok: res.ok, data: await res.json() };
}

export async function apiUpdateModel(id, formData) {
  const res = await apiFetch(`/models/${id}`, {
    method: "PUT",
    body: formData,
  });
  return { ok: res.ok, data: await res.json() };
}

export async function apiDeleteModel(id) {
  const res = await apiFetch(`/models/${id}`, { method: "DELETE" });
  return { ok: res.ok, data: await res.json() };
}

export async function apiDownloadModel(id) {
  const res = await apiFetch(`/models/${id}/download`);
  return { ok: res.ok, data: await res.json() };
}

// ==================== CART ====================
export async function apiGetCart() {
  const res = await apiFetch("/cart");
  if (!res.ok) return { items: [], total_cost: 0 };
  return res.json();
}

export async function apiAddToCart(modelId) {
  const res = await apiFetch(`/cart/${modelId}`, { method: "POST" });
  return { ok: res.ok, data: await res.json() };
}

export async function apiRemoveFromCart(modelId) {
  const res = await apiFetch(`/cart/${modelId}`, { method: "DELETE" });
  return { ok: res.ok, data: await res.json() };
}

// ==================== USER ====================
export async function apiGetProfile() {
  const res = await apiFetch("/user/profile");
  if (!res.ok) return null;
  return res.json();
}

export async function apiGetMyModels() {
  const res = await apiFetch("/user/models");
  if (!res.ok) return [];
  return res.json();
}

export async function apiUpdateSettings(body) {
  const res = await apiFetch("/user/settings", {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  return { ok: res.ok, data: await res.json() };
}

export async function apiUpdateNotifications(body) {
  const res = await apiFetch("/user/notifications", {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  return { ok: res.ok, data: await res.json() };
}

export async function apiUploadProfilePicture(file) {
  const formData = new FormData();
  formData.append("profilePicture", file);
  const res = await apiFetch("/user/profile-picture", {
    method: "PUT",
    body: formData,
  });
  return { ok: res.ok, data: await res.json() };
}

export async function apiDeleteAccount() {
  const res = await apiFetch("/user/account", { method: "DELETE" });
  if (res.ok) setAccessToken("");
  return { ok: res.ok, data: await res.json() };
}

// ==================== TRANSACTIONS ====================
export async function apiCheckout() {
  const res = await apiFetch("/transactions/checkout", {
    method: "POST",
  });
  return { ok: res.ok, data: await res.json() };
}

export async function apiConfirmCheckout(sessionId) {
  const res = await apiFetch("/transactions/confirm", {
    method: "POST",
    body: JSON.stringify({ sessionId }),
  });
  return { ok: res.ok, data: await res.json() };
}

export async function apiGetTransactions() {
  const res = await apiFetch("/transactions");
  if (!res.ok) return [];
  return res.json();
}

// ==================== PUBLIC USERS ====================
export async function apiGetUserById(id) {
  const res = await apiFetch(`/users/${id}`);
  return res.json();
}

export async function apiDiscoverUsers(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await apiFetch(`/users/discover?${qs}`);
  return res.json(); // { users, page, totalPages, totalCount }
}

// ==================== MODEL PREVIEW ====================
export async function apiPreviewModel(id) {
  const res = await apiFetch(`/models/${id}/preview`);
  return { ok: res.ok, data: await res.json() };
}

// ==================== SUPPORT ====================
export async function apiSubmitSupport(name, email, message, subject = 'general') {
  const res = await apiFetch("/support", {
    method: "POST",
    body: JSON.stringify({ name, email, subject, message }),
  });
  return { ok: res.ok, data: await res.json() };
}

// ==================== REVIEWS ====================
export async function apiGetReviews(modelId) {
  const res = await apiFetch(`/models/${modelId}/reviews`);
  if (!res.ok) return [];
  return res.json();
}

export async function apiCreateReview(modelId, rating, text) {
  const res = await apiFetch(`/models/${modelId}/reviews`, {
    method: "POST",
    body: JSON.stringify({ rating, text }),
  });
  return { ok: res.ok, data: await res.json() };
}

// ==================== Q&A ====================
export async function apiGetQuestions(modelId) {
  const res = await apiFetch(`/models/${modelId}/questions`);
  if (!res.ok) return [];
  return res.json();
}

export async function apiCreateQuestion(modelId, text) {
  const res = await apiFetch(`/models/${modelId}/questions`, {
    method: "POST",
    body: JSON.stringify({ text }),
  });
  return { ok: res.ok, data: await res.json() };
}

export async function apiCreateAnswer(questionId, text) {
  const res = await apiFetch(`/questions/${questionId}/answers`, {
    method: "POST",
    body: JSON.stringify({ text }),
  });
  return { ok: res.ok, data: await res.json() };
}

// ==================== LIKES ====================
export async function apiToggleLike(modelId) {
  const res = await apiFetch(`/models/${modelId}/like`, { method: "POST" });
  return { ok: res.ok, data: await res.json() };
}

export async function apiGetLikedModels() {
  const res = await apiFetch("/user/likes");
  if (!res.ok) return [];
  return res.json();
}

// ==================== FOLLOW ====================
export async function apiToggleFollow(userId) {
  const res = await apiFetch(`/users/${userId}/follow`, { method: "POST" });
  return { ok: res.ok, data: await res.json() };
}

// ==================== MESSAGES ====================
export async function apiSendMessage(recipientId, modelId, text) {
  const body = { recipientId, text };
  if (modelId) body.modelId = modelId;
  const res = await apiFetch("/messages", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return { ok: res.ok, data: await res.json() };
}

export async function apiGetConversations() {
  const res = await apiFetch("/messages/conversations");
  if (!res.ok) return [];
  return res.json();
}

export async function apiGetThread(modelId, userId) {
  const res = await apiFetch(`/messages/${modelId}/${userId}`);
  if (!res.ok) return [];
  return res.json();
}

export { getAccessToken, setAccessToken };
