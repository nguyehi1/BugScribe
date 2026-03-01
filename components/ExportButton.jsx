"use client";

import { useState } from "react";

/**
 * Formats a ticket object as a clean plain-text string
 * suitable for pasting into ADO, Jira, Linear, or Notion.
 * @param {object} ticket
 * @returns {string}
 */
function formatTicket(ticket) {
  const browser = ticket.environment?.browser || "—";
  const os = ticket.environment?.os || "—";
  const url = ticket.environment?.url || "—";
  const env = `Browser: ${browser} | OS: ${os} | URL: ${url}`;

  const steps = ticket.stepsToReproduce
    .map((s, i) => `  ${i + 1}. ${s}`)
    .join("\n");

  return [
    `[${ticket.severity?.toUpperCase()}] ${ticket.title}`,
    "",
    `Feature Affected: ${ticket.featureAffected}`,
    `Environment: ${env}`,
    "",
    "Steps to Reproduce:",
    steps,
    "",
    `Expected Result:\n  ${ticket.expectedResult}`,
    "",
    `Actual Result:\n  ${ticket.actualResult}`,
    ticket.notes ? `\nAdditional Notes:\n  ${ticket.notes}` : null,
  ]
    .filter((line) => line !== null)
    .join("\n");
}

/**
 * Copy-to-clipboard button for the formatted ticket.
 * @param {{ ticket: object }} props
 */
export default function ExportButton({ ticket }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(formatTicket(ticket));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Clipboard access denied. Please copy manually.");
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 active:scale-95 transition-all"
    >
      {copied ? (
        <>
          <span>✓</span> Copied!
        </>
      ) : (
        <>
          <span>📋</span> Copy Ticket
        </>
      )}
    </button>
  );
}
