const API_BASE_URL =
  (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000").replace(/\/$/, "");

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  let data = null;

  try {
    data = await response.json();
  } catch {}

  if (!response.ok) {
    throw new Error(data?.message || data?.error || `API request failed: ${response.status}`);
  }

  return data;
}

export async function getCurrentEvent() {
  return apiRequest("/api/events/current", {
    method: "GET",
    cache: "no-store",
  });
}

export async function createRegistration(payload) {
  return apiRequest("/api/registrations", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function buildRegistrationPayload(form, event) {
  return {
    eventId: event?.eventId || `evt_${event?.year}`,
    ...form,
  };
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export function formatEventDate(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}