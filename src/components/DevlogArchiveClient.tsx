"use client";

import { useState } from "react";
import Link from "next/link";
import type { DevlogEntry } from "@/data/devlog";
import { assetPath } from "@/lib/paths";

const SYSTEM_FILTERS = [
  { id: "all", label: "All entries" },
  { id: "im6014-qdd-arm", label: "IM6014 QDD Arm" },
  { id: "regen-clamp-pcb", label: "Regen Clamp PCB" },
  { id: "bldc-actuator", label: "Actuators & Test Stand" },
  { id: "foc-driver", label: "FOC Driver PCB" },
  { id: "rp2350-robomaster-arm", label: "RP2350 6-DOF CAN" },
  { id: "food-scooping-vla", label: "Granular VLA" },
  { id: "arm2027-workstation", label: "ARM2027 ROS 2" },
];

export function DevlogArchiveClient({ entries }: { entries: DevlogEntry[] }) {
  const [selectedSystem, setSelectedSystem] = useState<string>("all");
  const [query, setQuery] = useState<string>("");

  const q = query.trim().toLowerCase();
  const visible = entries.filter((entry) => {
    const sysOk = selectedSystem === "all" || entry.projectSlug === selectedSystem;
    if (!sysOk) return false;
    if (!q) return true;
    const haystack = [
      entry.title,
      entry.summary,
      entry.projectLabel,
      ...entry.metrics,
      ...entry.body,
      entry.codeSnippet?.code ?? "",
      entry.codeSnippet?.caption ?? "",
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });

  return (
    <div>
      <div style={{ marginBottom: "1rem" }}>
        <label
          htmlFor="devlog-search"
          style={{
            display: "block",
            marginBottom: "0.35rem",
            fontFamily: "var(--font-mono-stack)",
            fontSize: "0.75rem",
            color: "var(--muted)",
          }}
        >
          Search bring-up notes, part numbers, fault modes, or equations
        </label>
        <input
          id="devlog-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. LM74800, 7.09 Nm, RS-485, capstan, IPC-2221B…"
          className="devlog-search-input"
        />
      </div>

      <div
        className="filter-scroller"
        role="group"
        aria-label="Filter lab notebook entries by project"
      >
        {SYSTEM_FILTERS.map((f) => {
          const count =
            f.id === "all"
              ? entries.length
              : entries.filter((e) => e.projectSlug === f.id).length;
          return (
            <button
              key={f.id}
              type="button"
              className="filter-tab"
              aria-pressed={selectedSystem === f.id}
              onClick={(e) => {
                setSelectedSystem(f.id);
                e.currentTarget.scrollIntoView({
                  block: "nearest",
                  inline: "nearest",
                });
              }}
            >
              {f.label} ({count})
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <p style={{ color: "var(--muted)", fontFamily: "var(--font-mono-stack)", fontSize: "0.8125rem" }}>
          No lab entries match &ldquo;{query}&rdquo;.{" "}
          <button
            type="button"
            className="inline-action-btn"
            onClick={() => {
              setQuery("");
              setSelectedSystem("all");
            }}
          >
            Reset filters
          </button>
        </p>
      ) : (
        <ul className="devlog-list" role="list">
          {visible.map((entry) => (
            <li
              key={entry.id}
              id={entry.id}
              tabIndex={-1}
              className="devlog-item devlog-archive-entry"
            >
              <div className="devlog-header">
                <span>
                  <Link href={`/projects/${entry.projectSlug}`}>{entry.projectLabel}</Link>
                </span>
                <span>{entry.displayDate}</span>
              </div>

              <h2
                style={{
                  margin: "0.35rem 0 0.5rem",
                  fontFamily: "var(--font-mono-stack)",
                  fontSize: "0.96875rem",
                  fontWeight: 500,
                  lineHeight: 1.42,
                  color: "var(--ink)",
                }}
              >
                {entry.title}
              </h2>

              <div className="tile-badges" style={{ marginBottom: "0.75rem" }}>
                {entry.metrics.map((m) => (
                  <span key={m} className="mono-badge">
                    {m}
                  </span>
                ))}
              </div>

              {entry.body.map((para, idx) => (
                <p
                  key={idx}
                  style={{
                    margin: "0 0 0.8rem",
                    maxWidth: "65ch",
                    color: "var(--ink-dim)",
                    fontSize: "0.92rem",
                    lineHeight: 1.65,
                  }}
                >
                  {para}
                </p>
              ))}

              {entry.codeSnippet && (
                <figure style={{ margin: "0.85rem 0" }}>
                  <pre
                    tabIndex={0}
                    role="region"
                    aria-label={`${entry.projectLabel} code snippet`}
                    style={{
                      margin: 0,
                      padding: "0.75rem 0.95rem",
                      overflowX: "auto",
                      background: "var(--surface-code)",
                      border: "1px solid var(--line)",
                      borderRadius: "3px",
                      fontFamily: "var(--font-mono-stack)",
                      fontSize: "0.75rem",
                      lineHeight: 1.55,
                      color: "var(--ink)",
                    }}
                  >
                    <code>{entry.codeSnippet.code}</code>
                  </pre>
                  <figcaption
                    style={{
                      marginTop: "0.35rem",
                      fontFamily: "var(--font-mono-stack)",
                      fontSize: "0.72rem",
                      color: "var(--muted)",
                    }}
                  >
                    {entry.codeSnippet.caption}
                  </figcaption>
                </figure>
              )}

              {entry.image && (
                <figure className="plate" style={{ margin: "1rem 0 0.4rem" }}>
                  <img
                    src={assetPath(entry.image.src)}
                    width={entry.image.width}
                    height={entry.image.height}
                    alt={entry.image.alt}
                    loading="lazy"
                    decoding="async"
                  />
                  <figcaption>{entry.image.caption}</figcaption>
                </figure>
              )}

              <p
                style={{
                  margin: "0.45rem 0 0",
                  fontFamily: "var(--font-mono-stack)",
                  fontSize: "0.75rem",
                }}
              >
                <Link href={`/projects/${entry.projectSlug}`} className="standalone-link">
                  View {entry.projectLabel} project specification →
                </Link>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
