"use client";

import { useState } from "react";

/**
 * Displays a single feature flow in an editable card.
 * @param {{
 *   flow: { feature: string, steps: string[] },
 *   approved: boolean,
 *   onUpdate: (updated: { feature: string, steps: string[] }) => void,
 *   onToggleApprove: () => void,
 * }} props
 */
export default function FlowCard({ flow, approved, onUpdate, onToggleApprove }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftFeature, setDraftFeature] = useState(flow.feature);
  const [draftSteps, setDraftSteps] = useState(flow.steps.join("\n"));

  function handleSave() {
    const steps = draftSteps
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    onUpdate({ feature: draftFeature.trim(), steps });
    setIsEditing(false);
  }

  function handleCancel() {
    setDraftFeature(flow.feature);
    setDraftSteps(flow.steps.join("\n"));
    setIsEditing(false);
  }

  return (
    <div
      className={`rounded-xl border-2 p-5 shadow-sm transition-all ${
        approved
          ? "border-green-400 bg-green-50"
          : "border-gray-200 bg-white"
      }`}
    >
      {isEditing ? (
        <div className="space-y-3">
          <input
            value={draftFeature}
            onChange={(e) => setDraftFeature(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <textarea
            value={draftSteps}
            onChange={(e) => setDraftSteps(e.target.value)}
            rows={6}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="rounded-md border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className="font-semibold text-gray-900">{flow.feature}</h3>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs text-gray-500 hover:text-indigo-600 underline transition-colors"
              >
                Edit
              </button>
              <button
                onClick={onToggleApprove}
                className={`rounded-full px-3 py-0.5 text-xs font-semibold transition-colors ${
                  approved
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {approved ? "✓ Approved" : "Approve"}
              </button>
            </div>
          </div>

          <ol className="list-decimal list-inside space-y-1">
            {flow.steps.map((step, i) => (
              <li key={i} className="text-sm text-gray-700">
                {step}
              </li>
            ))}
          </ol>
        </>
      )}
    </div>
  );
}
