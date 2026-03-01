"use client";

import { useState, useEffect } from "react";
import FeatureInput from "@/components/FeatureInput";
import FlowCard from "@/components/FlowCard";
import BugInput from "@/components/BugInput";
import TicketPreview from "@/components/TicketPreview";
import { saveFlows, loadFlows } from "@/lib/storage";

const STEPS = [
  { id: 1, label: "Feature Library" },
  { id: 2, label: "Bug Ticket" },
];

export default function Home() {
  const [activeStep, setActiveStep] = useState(1);

  // Step 1 state
  const [flows, setFlows] = useState([]); // { feature, steps, approved }

  // Step 2 state
  const [tickets, setTickets] = useState([]);
  const [activeTicketIdx, setActiveTicketIdx] = useState(0);

  // Rehydrate flows from localStorage on mount
  useEffect(() => {
    const saved = loadFlows();
    if (saved.length > 0) setFlows(saved);
  }, []);

  // Persist flows to localStorage whenever they change
  useEffect(() => {
    if (flows.length > 0) saveFlows(flows);
  }, [flows]);

  // --- Step 1 handlers ---

  function handleFlowsGenerated(generatedFlows) {
    const enriched = generatedFlows.map((f) => ({
      ...f,
      id: crypto.randomUUID(),
      approved: false,
    }));
    setFlows(enriched);
  }

  function handleFlowUpdate(id, updated) {
    setFlows((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updated } : f))
    );
  }

  function handleToggleApprove(id) {
    setFlows((prev) =>
      prev.map((f) => (f.id === id ? { ...f, approved: !f.approved } : f))
    );
  }

  function handleApproveAll() {
    setFlows((prev) => prev.map((f) => ({ ...f, approved: true })));
  }

  function handleTicketGenerated(newTicket) {
    setTickets((prev) => [newTicket, ...prev]);
    setActiveTicketIdx(0);
  }

  const approvedFlows = flows.filter((f) => f.approved);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">BugScribe</h1>
        <p className="mt-1 text-gray-500 text-sm">
          AI-powered bug ticket writer for PMs
        </p>
      </div>

      {/* Step nav */}
      <nav className="flex gap-1 border-b border-gray-200">
        {STEPS.map((step) => (
          <button
            key={step.id}
            onClick={() => setActiveStep(step.id)}
            className={`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
              activeStep === step.id
                ? "border-b-2 border-indigo-600 text-indigo-600 bg-white -mb-px"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {step.id}. {step.label}
          </button>
        ))}
      </nav>

      {/* Step 1 — Feature Library */}
      {activeStep === 1 && (
        <section className="space-y-6">
          <FeatureInput
            onFlowsGenerated={handleFlowsGenerated}
            hasApprovedFlows={approvedFlows.length > 0}
          />

          {flows.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-700">
                  Generated Flows{" "}
                  <span className="text-gray-400 font-normal text-sm">
                    ({approvedFlows.length}/{flows.length} approved)
                  </span>
                </h2>
                <button
                  onClick={handleApproveAll}
                  className="text-sm text-indigo-600 hover:underline"
                >
                  Approve all
                </button>
              </div>

              <div className="space-y-4">
                {flows.map((flow) => (
                  <FlowCard
                    key={flow.id}
                    flow={flow}
                    approved={flow.approved}
                    onUpdate={(updated) => handleFlowUpdate(flow.id, updated)}
                    onToggleApprove={() => handleToggleApprove(flow.id)}
                  />
                ))}
              </div>

              {approvedFlows.length > 0 && (
                <button
                  onClick={() => setActiveStep(2)}
                  className="inline-flex items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100 transition-colors"
                >
                  Continue to Bug Ticket →
                </button>
              )}
            </>
          )}
        </section>
      )}

      {/* Step 2 — Bug Ticket */}
      {activeStep === 2 && (
        <section className="space-y-6">
          <BugInput
            approvedFlows={approvedFlows}
            onTicketGenerated={handleTicketGenerated}
          />

          {tickets.length > 0 && (
            <div className="space-y-4">
              {tickets.length > 1 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Previous Tickets
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {tickets.slice(1).map((t, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveTicketIdx(i + 1)}
                        className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                          activeTicketIdx === i + 1
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-white text-gray-600 border-gray-300 hover:border-indigo-400"
                        }`}
                      >
                        [{t.severity}] {t.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h2 className="text-base font-semibold text-gray-700 mb-4">
                  {activeTicketIdx === 0 ? "Generated Ticket" : "Previous Ticket"}{" "}
                  <span className="text-gray-400 font-normal text-sm">
                    (all fields are editable)
                  </span>
                </h2>
                <TicketPreview ticket={tickets[activeTicketIdx]} />
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
