"use client";

import { useState, useRef, useEffect } from "react";

/**
 * Step 1 — Feature input area and generate button.
 * @param {{
 *   onFlowsGenerated: (flows: object[]) => void,
 *   hasApprovedFlows: boolean,
 *   featureInput: string,
 *   onFeatureInputChange: (value: string) => void,
 * }} props
 */
export default function FeatureInput({ onFlowsGenerated, hasApprovedFlows, featureInput, onFeatureInputChange }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  // Abort any in-flight request when the component unmounts
  useEffect(() => () => abortControllerRef.current?.abort(), []);

  async function handleGenerate() {
    const features = featureInput
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (features.length === 0) {
      setError("Please enter at least one feature.");
      return;
    }

    if (
      hasApprovedFlows &&
      !window.confirm("This will replace your existing flows and approvals. Continue?")
    ) {
      return;
    }

    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/generate-flows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features }),
        signal: abortControllerRef.current.signal,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Unknown error");

      onFlowsGenerated(data.flows);
    } catch (err) {
      if (err.name !== "AbortError") setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Feature List{" "}
          <span className="text-gray-400 font-normal">(one per line)</span>
        </label>
        <textarea
          value={featureInput}
          onChange={(e) => onFeatureInputChange(e.target.value)}
          rows={8}
          placeholder={"User login\nDocument upload\nPassword reset\nDashboard overview"}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm font-mono shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <>
            <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Generating flows…
          </>
        ) : (
          "Generate User Flows"
        )}
      </button>
    </div>
  );
}
