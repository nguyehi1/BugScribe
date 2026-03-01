"use client";

import { useState, useRef } from "react";

/**
 * Project switcher — pill tabs for existing projects + inline "New Project" form.
 * Double-click any project pill to rename it.
 * @param {{
 *   projects: Array<{ id: string, name: string }>,
 *   activeProjectId: string,
 *   onSelect: (id: string) => void,
 *   onCreate: (name: string) => void,
 *   onRename: (id: string, newName: string) => void,
 * }} props
 */
export default function ProjectSwitcher({
  projects,
  activeProjectId,
  onSelect,
  onCreate,
  onRename,
}) {
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const renameInputRef = useRef(null);

  function handleCreate(e) {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    onCreate(name);
    setNewName("");
    setCreating(false);
  }

  function startRename(p) {
    setRenamingId(p.id);
    setRenameValue(p.name);
    // Focus happens via autoFocus on the input
  }

  function commitRename(id) {
    const name = renameValue.trim();
    if (name) onRename(id, name);
    setRenamingId(null);
  }

  function handleRenameKeyDown(e, id) {
    if (e.key === "Enter") commitRename(id);
    if (e.key === "Escape") setRenamingId(null);
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs font-semibold uppercase tracking-wide text-gray-400 mr-1">
        Project
      </span>

      {projects.map((p) =>
        renamingId === p.id ? (
          <input
            key={p.id}
            autoFocus
            ref={renameInputRef}
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onBlur={() => commitRename(p.id)}
            onKeyDown={(e) => handleRenameKeyDown(e, p.id)}
            className="text-sm border border-indigo-400 rounded-full px-3 py-1 w-36 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        ) : (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            onDoubleClick={() => startRename(p)}
            title="Double-click to rename"
            className={`px-3 py-1.5 text-sm font-medium rounded-full border transition-colors ${
              p.id === activeProjectId
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-600 border-gray-300 hover:border-indigo-400 hover:text-indigo-600"
            }`}
          >
            {p.name}
          </button>
        )
      )}

      {creating ? (
        <form onSubmit={handleCreate} className="flex items-center gap-1">
          <input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && setCreating(false)}
            placeholder="Project name"
            className="text-sm border border-gray-300 rounded-md px-2 py-1 w-36 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="submit"
            className="text-sm text-indigo-600 font-medium hover:underline"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => { setCreating(false); setNewName(""); }}
            className="text-sm text-gray-400 hover:text-gray-600"
          >
            Cancel
          </button>
        </form>
      ) : (
        <button
          onClick={() => setCreating(true)}
          className="text-sm text-indigo-500 hover:text-indigo-700 font-medium px-1"
        >
          + New Project
        </button>
      )}
    </div>
  );
}
