"use client";

import { useState, useEffect } from "react";
import FeatureInput from "@/components/FeatureInput";
import FlowCard from "@/components/FlowCard";
import BugInput from "@/components/BugInput";
import TicketPreview from "@/components/TicketPreview";
import ProjectSwitcher from "@/components/ProjectSwitcher";
import StatsBar from "@/components/StatsBar";

const STORAGE_KEYS = {
  projects:      "bugscribe_projects_v1",
  activeProject: "bugscribe_active_project_v1",
  visits:        "bugscribe_visits_v1",
};
const DEFAULT_PROJECTS = [{ id: "p0", name: "My Project", flows: [], tickets: [], featureInput: "" }];

const STEPS = [
  { id: 1, label: "Feature Library" },
  { id: 2, label: "Bug Ticket" },
];

export default function Home() {
  // Always start with defaults so server and client first render match (avoids hydration mismatch)
  const [projects, setProjects] = useState(DEFAULT_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState("p0");
  const [activeStep, setActiveStep] = useState(1);
  const [activeTicketIdx, setActiveTicketIdx] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [visits, setVisits] = useState(0);

  // After mount, load persisted data from localStorage
  useEffect(() => {
    try {
      const savedProjects = localStorage.getItem(STORAGE_KEYS.projects);
      const savedActiveId = localStorage.getItem(STORAGE_KEYS.activeProject);
      if (savedProjects) setProjects(JSON.parse(savedProjects));
      if (savedActiveId) setActiveProjectId(savedActiveId);

      // Increment visit counter
      const prevVisits = parseInt(localStorage.getItem(STORAGE_KEYS.visits) ?? "0", 10);
      const newVisits = prevVisits + 1;
      localStorage.setItem(STORAGE_KEYS.visits, String(newVisits));
      setVisits(newVisits);
    } catch {
      // ignore corrupted storage
    }
    setHydrated(true);
  }, []);

  // Persist on changes, but only after hydration to avoid overwriting with defaults
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(projects));
  }, [projects, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEYS.activeProject, activeProjectId);
  }, [activeProjectId, hydrated]);

  // Derive current project data
  const activeProject = projects.find((p) => p.id === activeProjectId) ?? projects[0];
  const { flows, tickets } = activeProject;
  const approvedFlows = flows.filter((f) => f.approved);

  // Global stats across all projects
  const stats = {
    visits,
    projects: projects.length,
    tickets: projects.reduce((sum, p) => sum + (p.tickets?.length ?? 0), 0),
    approvedFlows: projects.reduce(
      (sum, p) => sum + (p.flows?.filter((f) => f.approved).length ?? 0),
      0
    ),
  };

  /** Apply an update function to the active project only. */
  function updateActiveProject(updater) {
    setProjects((prev) =>
      prev.map((p) => (p.id === activeProjectId ? { ...p, ...updater(p) } : p))
    );
  }

  // --- Project handlers ---

  function handleCreateProject(name) {
    const newProject = { id: crypto.randomUUID(), name, flows: [], tickets: [] };
    setProjects((prev) => [...prev, newProject]);
    setActiveProjectId(newProject.id);
    setActiveStep(1);
    setActiveTicketIdx(0);
  }

  function handleSelectProject(id) {
    setActiveProjectId(id);
    setActiveStep(1);
    setActiveTicketIdx(0);
  }

  function handleRenameProject(id, newName) {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, name: newName } : p))
    );
  }

  function handleFeatureInputChange(value) {
    updateActiveProject(() => ({ featureInput: value }));
  }

  // --- Step 1 handlers ---

  function handleFlowsGenerated(generatedFlows) {
    const enriched = generatedFlows.map((f) => ({
      ...f,
      id: crypto.randomUUID(),
      approved: false,
    }));
    updateActiveProject(() => ({ flows: enriched }));
  }

  function handleFlowUpdate(id, updated) {
    updateActiveProject((p) => ({
      flows: p.flows.map((f) => (f.id === id ? { ...f, ...updated } : f)),
    }));
  }

  function handleToggleApprove(id) {
    updateActiveProject((p) => ({
      flows: p.flows.map((f) => (f.id === id ? { ...f, approved: !f.approved } : f)),
    }));
  }

  function handleApproveAll() {
    updateActiveProject((p) => ({
      flows: p.flows.map((f) => ({ ...f, approved: true })),
    }));
  }

  function handleTicketGenerated(newTicket) {
    updateActiveProject((p) => ({ tickets: [newTicket, ...p.tickets] }));
    setActiveTicketIdx(0);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">BugScribe</h1>
        <p className="mt-1 text-gray-500 text-sm">
          AI-powered bug ticket writer for PMs
        </p>
      </div>

      {/* Stats */}
      {hydrated && <StatsBar stats={stats} />}

      {/* Project switcher */}
      <ProjectSwitcher
        projects={projects}
        activeProjectId={activeProjectId}
        onSelect={handleSelectProject}
        onCreate={handleCreateProject}
        onRename={handleRenameProject}
      />

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
            featureInput={activeProject.featureInput ?? ""}
            onFeatureInputChange={handleFeatureInputChange}
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
