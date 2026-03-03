"use client";

import { useState, useEffect } from "react";

/**
 * Displays a single feature flow in an editable card.
 * @param {{
 *   flow: { feature: string, steps: string[] },
 *   approved: boolean,
 *   onUpdate: (updated: { feature: string, steps: string[] }) => void,
 *   onToggleApprove: () => void,
 *   onDelete: () => void,
 * }} props
 */
export default function FlowCard({ flow, approved, onUpdate, onToggleApprove, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftFeature, setDraftFeature] = useState(flow.feature);
  const [draftSteps, setDraftSteps] = useState(flow.steps.join("\n"));

  // Sync draft when the parent flow updates (e.g. after re-generate),
  // but not while the user is actively editing.
  useEffect(() => {
    if (!isEditing) {
      setDraftFeature(flow.feature);
      setDraftSteps(flow.steps.join("\n"));
    }
  }, [flow, isEditing]);

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
            <div className="flex gap-2 shrink-0 items-center">
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
              <button
                onClick={onDelete}
                aria-label="Delete flow"
                className="ml-1 text-gray-300 hover:text-red-500 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 6.932A1.5 1.5 0 0 0 5.357 13.5h5.285a1.5 1.5 0 0 0 1.493-1.068L12.95 5.5h.3a.75.75 0 0 0 0-1.5H11v-.75A1.75 1.75 0 0 0 9.25 1.5h-2.5A1.75 1.75 0 0 0 5 3.25Zm1.5-.75a.25.25 0 0 1 .25-.25h2.5a.25.25 0 0 1 .25.25V4h-3v-.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5A.75.75 0 0 1 9.95 6Z" clipRule="evenodd" />
                </svg>
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
