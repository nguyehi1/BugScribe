"use client";

import { useState, useRef } from "react";

/**
 * Step 2 — Bug description input and ticket generation trigger.
 * @param {{
 *   approvedFlows: object[],
 *   onTicketGenerated: (ticket: object) => void,
 * }} props
 */
export default function BugInput({ approvedFlows, onTicketGenerated }) {
  const [bugDescription, setBugDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const hasFlows = approvedFlows.length > 0;
  const abortControllerRef = useRef(null);

  async function handleGenerate() {
    if (!bugDescription.trim()) {
      setError("Please describe the bug.");
      return;
    }

    if (!hasFlows) {
      setError("No approved flows found. Go to Step 1 and approve at least one flow.");
      return;
    }

    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/generate-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bugDescription: bugDescription.trim(), flows: approvedFlows }),
        signal: abortControllerRef.current.signal,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Unknown error");

      onTicketGenerated(data);
      setBugDescription("");
    } catch (err) {
      if (err.name !== "AbortError") setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {!hasFlows && (
        <div className="rounded-md bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          No approved flows yet. Complete Step 1 first.
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Describe the bug
        </label>
        <input
          type="text"
          value={bugDescription}
          onChange={(e) => setBugDescription(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          placeholder='e.g. "Unable to upload documents"'
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={!hasFlows}
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      <button
        onClick={handleGenerate}
        disabled={loading || !hasFlows}
        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <>
            <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Generating ticket…
          </>
        ) : (
          "Generate Bug Ticket"
        )}
      </button>
    </div>
  );
}
