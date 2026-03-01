const FLOWS_KEY = "bugscribe_flows_v1";

/**
 * Saves approved flows to localStorage.
 * @param {Array<{feature: string, steps: string[], approved: boolean}>} flows
 */
export function saveFlows(flows) {
  if (typeof window === "undefined") return;
  localStorage.setItem(FLOWS_KEY, JSON.stringify(flows));
}

/**
 * Loads approved flows from localStorage.
 * @returns {Array<{feature: string, steps: string[], approved: boolean}>}
 */
export function loadFlows() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FLOWS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Clears flows from localStorage.
 */
export function clearFlows() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(FLOWS_KEY);
}
