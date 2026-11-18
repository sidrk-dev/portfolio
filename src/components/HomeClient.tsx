"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CATEGORY_LABELS,
  type ProjectCategory,
  type ProjectItem,
} from "@/data/portfolio";
import type { DevlogEntry } from "@/data/devlog";
import { assetPath } from "@/lib/paths";

const FILTER_ORDER: ("all" | ProjectCategory)[] = [
  "all",
  "actuators",
  "power",
  "embedded",
  "vla",
];

export function ProjectsGridClient({ projects }: { projects: ProjectItem[] }) {
  const [filter, setFilter] = useState<"all" | ProjectCategory>("all");

  const visible =
    filter === "all"
      ? projects
      : projects.filter((p) => p.category === filter);

  return (
    <div>
      <div
        className="filter-scroller"
        role="group"
        aria-label="Filter engineering projects by domain"
      >
        {FILTER_ORDER.map((cat) => {
          const count =
            cat === "all"
              ? projects.length
              : projects.filter((p) => p.category === cat).length;
          return (
            <button
              key={cat}
              type="button"
              className="filter-tab"
              aria-pressed={filter === cat}
              onClick={(e) => {
                setFilter(cat);
                e.currentTarget.scrollIntoView({
                  block: "nearest",
                  inline: "nearest",
                });
              }}
            >
              {CATEGORY_LABELS[cat]} ({count})
            </button>
          );
        })}
      </div>

      <div className="tiles">
        {visible.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="tile"
          >
            <div className="tile-img-wrap">
              <img
                src={assetPath(project.image)}
                width={project.imageWidth}
                height={project.imageHeight}
                alt={project.imageAlt}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="tile-meta-top">
              <span>{project.categoryLabel}</span>
              <span>{project.period}</span>
            </div>
            <span className="tile-title">{project.shortTitle}</span>
            <span className="tile-sub">{project.tileSub}</span>
            <span className="tile-badges">
              {project.metrics.slice(0, 2).map((m) => (
                <span key={m.label} className="mono-badge">
                  {m.value}
                </span>
              ))}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function DevlogPreviewClient({ entries }: { entries: DevlogEntry[] }) {
  const [projectFilter, setProjectFilter] = useState<string>("all");

  const filterOptions = [
    { id: "all", label: "All logs" },
    { id: "im6014-qdd-arm", label: "IM6014 QDD Arm" },
    { id: "regen-clamp-pcb", label: "Regen Clamp PCB" },
    { id: "bldc-actuator", label: "Actuators & FOC" },
    { id: "food-scooping-vla", label: "Physical AI / VLA" },
  ];

  const filtered =
    projectFilter === "all"
      ? entries.slice(0, 6)
      : entries
          .filter((e) =>
            projectFilter === "bldc-actuator"
              ? e.projectSlug === "bldc-actuator" ||
                e.projectSlug === "foc-driver" ||
                e.projectSlug === "rp2350-robomaster-arm"
              : e.projectSlug === projectFilter
          )
          .slice(0, 6);

  return (
    <div>
      <div
        className="filter-scroller"
        role="group"
        aria-label="Filter progress logs by system"
      >
        {filterOptions.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className="filter-tab"
            aria-pressed={projectFilter === opt.id}
            onClick={(e) => {
              setProjectFilter(opt.id);
              e.currentTarget.scrollIntoView({
                block: "nearest",
                inline: "nearest",
              });
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <ul className="devlog-list" role="list">
        {filtered.map((entry) => (
          <li key={entry.id} className="devlog-item">
            <div className="devlog-header">
              <span>
                <Link href={`/projects/${entry.projectSlug}`}>
                  {entry.projectLabel}
                </Link>
              </span>
              <span>{entry.displayDate}</span>
            </div>
            <h3 className="devlog-title">
              <Link
                href={`/devlog#${entry.id}`}
                style={{ textDecoration: "none" }}
              >
                {entry.title}
              </Link>
            </h3>
            <p className="devlog-summary">{entry.summary}</p>
            <div className="tile-badges">
              {entry.metrics.map((m) => (
                <span key={m} className="mono-badge">
                  {m}
                </span>
              ))}
            </div>
            <details className="devlog-details">
              <summary>Read technical notes</summary>
              <div className="devlog-body">
                {entry.body.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
                {entry.codeSnippet && (
                  <pre
                    tabIndex={0}
                    role="region"
                    aria-label={`${entry.projectLabel} code snippet`}
                    style={{
                      margin: "0.6rem 0 0.4rem",
                      padding: "0.65rem 0.85rem",
                      overflowX: "auto",
                      background: "var(--surface-code)",
                      border: "1px solid var(--line)",
                      borderRadius: "3px",
                      fontFamily: "var(--font-mono-stack)",
                      fontSize: "0.75rem",
                      lineHeight: 1.5,
                      color: "var(--ink)",
                    }}
                  >
                    <code>{entry.codeSnippet.code}</code>
                  </pre>
                )}
                <p style={{ marginBottom: 0 }}>
                  <Link href={`/projects/${entry.projectSlug}`} className="standalone-link">
                    Open full {entry.projectLabel} writeup →
                  </Link>
                </p>
              </div>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}
