"use client";

import { useState, useEffect } from "react";
import ExportButton from "./ExportButton";

const SEVERITY_OPTIONS = ["Critical", "High", "Medium", "Low"];

const SEVERITY_COLORS = {
  Critical: "bg-red-100 text-red-700 border-red-300",
  High:     "bg-orange-100 text-orange-700 border-orange-300",
  Medium:   "bg-yellow-100 text-yellow-700 border-yellow-300",
  Low:      "bg-blue-100 text-blue-700 border-blue-300",
};

/**
 * Renders a fully-editable preview of a generated bug ticket.
 * @param {{ ticket: object, onCopy?: () => void }} props
 */
export default function TicketPreview({ ticket, onCopy }) {
  const [title, setTitle] = useState(ticket.title);
  const [featureAffected, setFeatureAffected] = useState(ticket.featureAffected);
  const [steps, setSteps] = useState(ticket.stepsToReproduce.join("\n"));
  const [expectedResult, setExpectedResult] = useState(ticket.expectedResult);
  const [actualResult, setActualResult] = useState(ticket.actualResult);
  const [severity, setSeverity] = useState(ticket.severity);
  const [notes, setNotes] = useState(ticket.notes || "");

  // Environment — always starts blank
  const [browser, setBrowser] = useState("");
  const [os, setOs] = useState("");
  const [url, setUrl] = useState("");

  // Keep in sync when a new ticket is generated
  useEffect(() => {
    setTitle(ticket.title);
    setFeatureAffected(ticket.featureAffected);
    setSteps(ticket.stepsToReproduce.join("\n"));
    setExpectedResult(ticket.expectedResult);
    setActualResult(ticket.actualResult);
    setSeverity(ticket.severity);
    setNotes(ticket.notes || "");
    setBrowser("");
    setOs("");
    setUrl("");
  }, [ticket]);

  const editedTicket = {
    title,
    featureAffected,
    environment: { browser, os, url },
    stepsToReproduce: steps.split("\n").map((s) => s.trim()).filter(Boolean),
    expectedResult,
    actualResult,
    severity,
    notes,
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm divide-y divide-gray-100">
      {/* Header */}
      <div className="p-5 space-y-3">
        <Field label="Title">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="field-input font-semibold"
          />
        </Field>

        <div className="flex gap-4 flex-wrap">
          <Field label="Feature Affected" className="flex-1 min-w-48">
            <input
              value={featureAffected}
              onChange={(e) => setFeatureAffected(e.target.value)}
              className="field-input"
            />
          </Field>

          <Field label="Severity" className="w-36">
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className={`field-input border font-medium ${SEVERITY_COLORS[severity] ?? ""}`}
            >
              {SEVERITY_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </div>

      {/* Environment */}
      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
          Environment
        </p>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Browser">
            <input
              value={browser}
              onChange={(e) => setBrowser(e.target.value)}
              placeholder="e.g. Chrome 121"
              className="field-input"
            />
          </Field>
          <Field label="OS">
            <input
              value={os}
              onChange={(e) => setOs(e.target.value)}
              placeholder="e.g. macOS 14"
              className="field-input"
            />
          </Field>
          <Field label="URL">
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g. /dashboard/upload"
              className="field-input"
            />
          </Field>
        </div>
      </div>

      {/* Steps to Reproduce */}
      <div className="p-5">
        <Field label="Steps to Reproduce">
          <textarea
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
            rows={10}
            className="field-input font-mono text-xs resize-y"
          />
        </Field>
      </div>

      {/* Results */}
      <div className="p-5 space-y-3">
        <Field label="Expected Result">
          <textarea
            value={expectedResult}
            onChange={(e) => setExpectedResult(e.target.value)}
            rows={2}
            className="field-input resize-y"
          />
        </Field>
        <Field label="Actual Result">
          <textarea
            value={actualResult}
            onChange={(e) => setActualResult(e.target.value)}
            rows={2}
            className="field-input resize-y"
          />
        </Field>
      </div>

      {/* Notes */}
      <div className="p-5">
        <Field label="Additional Notes">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={5}
            className="field-input resize-y"
          />
        </Field>
      </div>

      {/* Export */}
      <div className="p-5">
        <ExportButton ticket={editedTicket} onCopy={onCopy} />
      </div>
    </div>
  );
}

/** Small helper for consistent field layout */
function Field({ label, children, className = "" }) {
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  );
}
