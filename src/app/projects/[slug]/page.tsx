import type { Metadata } from "next";
import { isValidElement, type ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { promises as fs } from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { portfolio } from "@/data/portfolio";
import { devlogEntries } from "@/data/devlog";
import { assetPath } from "@/lib/paths";
import { SideNav, type NavSectionItem } from "@/components/SideNav";
import { Im6014ThermalExplorer } from "@/components/Im6014ThermalExplorer";
import { RegenBoardInspector } from "@/components/RegenBoardInspector";
import SchematicViewer from "@/components/SchematicViewer";

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function extractNodeText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") {
    return "";
  }
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(extractNodeText).join("");
  }
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return extractNodeText(node.props.children);
  }
  return "";
}

function extractH2Headings(markdown: string): { id: string; label: string }[] {
  const lines = markdown.split("\n");
  const out: { id: string; label: string }[] = [];
  for (const line of lines) {
    const m = /^##\s+(.+)$/.exec(line.trim());
    if (m) {
      const raw = m[1].replace(/[`*_]/g, "").trim();
      out.push({ id: slugifyHeading(raw), label: raw });
    }
  }
  return out;
}

export async function generateStaticParams() {
  return portfolio.projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = portfolio.projects.find((p) => p.slug === slug);
  if (!project) {
    return { title: "Project — Siddharth Rajasekaran" };
  }
  const pageTitle = `${project.shortTitle} — Siddharth Rajasekaran`;
  const canonicalUrl = `https://sidrk-dev.github.io/portfolio/projects/${project.slug}/`;
  const ogImageUrl = `https://sidrk-dev.github.io/portfolio${project.image}`;
  return {
    title: pageTitle,
    description: project.summary,
    openGraph: {
      title: pageTitle,
      description: project.summary,
      type: "article",
      url: canonicalUrl,
      images: [
        {
          url: ogImageUrl,
          width: project.imageWidth,
          height: project.imageHeight,
          alt: project.imageAlt,
        },
      ],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const idx = portfolio.projects.findIndex((p) => p.slug === slug);
  if (idx === -1) {
    notFound();
  }

  const project = portfolio.projects[idx];
  const prevProject =
    portfolio.projects[(idx - 1 + portfolio.projects.length) % portfolio.projects.length];
  const nextProject =
    portfolio.projects[(idx + 1) % portfolio.projects.length];

  let markdownContent = project.summary;
  try {
    const contentPath = path.join(process.cwd(), "src", "content", `${slug}.md`);
    markdownContent = await fs.readFile(contentPath, "utf-8");
  } catch {
    // Fallback to summary
  }

  const cleanedContent = markdownContent.replace(/::kicanvas\[.*?\]\n?/g, "");
  const h2Headings = extractH2Headings(cleanedContent);
  const projectLogs = devlogEntries.filter((e) => e.projectSlug === slug);
  const relatedProjects = project.relatedSlugs
    .map((rSlug) => portfolio.projects.find((p) => p.slug === rSlug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .map((p) => ({ slug: p.slug, title: p.shortTitle, summary: p.tileSub }));

  const navSections: NavSectionItem[] = [{ id: "overview", label: "Overview" }];
  if (project.specs && project.specs.length > 0) {
    navSections.push({ id: "specifications", label: "Specifications" });
  }
  if (project.interactiveWidget) {
    navSections.push({ id: "workbench", label: "Interactive workbench" });
  }
  if (project.plates && project.plates.length > 0) {
    navSections.push({ id: "project-images", label: "Hardware & plots" });
  }
  for (const h of h2Headings) {
    navSections.push(h);
  }
  if (projectLogs.length > 0) {
    navSections.push({
      id: "build-log",
      label: `Progress log (${projectLogs.length})`,
    });
  }
  if (relatedProjects.length > 0) {
    navSections.push({ id: "related-work", label: "Related hardware" });
  }

  return (
    <div className="shell">
      <SideNav
        mode="project"
        sections={navSections}
        relatedProjects={relatedProjects}
        crumb={<Link href="/#projects">← Siddharth Rajasekaran / projects</Link>}
      />

      <main id="content" tabIndex={-1} className="project-article">
        <header id="overview" tabIndex={-1}>
          <h1>{project.title}</h1>
          <p className="project-meta">
            {project.categoryLabel} · {project.period} ·{" "}
            <span style={{ color: "var(--accent)" }}>{project.status}</span>
          </p>
          <p className="lede" style={{ marginTop: "0.95rem" }}>
            {project.summary}
          </p>

          {project.links.length > 0 && (
            <div className="project-links-row">
              {project.links.map((l) => {
                const resolvedHref = l.href.startsWith("/")
                  ? assetPath(l.href)
                  : l.href;
                return (
                  <a
                    key={l.label}
                    href={resolvedHref}
                    target={l.external ? "_blank" : undefined}
                    rel={l.external ? "noopener noreferrer" : undefined}
                  >
                    {l.label}
                  </a>
                );
              })}
            </div>
          )}

          <div className="metrics-grid" aria-label="Key quantitative specifications">
            {project.metrics.map((m) => (
              <div key={m.label} className="metric-cell">
                <span className="metric-label">{m.label}</span>
                <span className="metric-val">{m.value}</span>
              </div>
            ))}
          </div>

          <div className="tile-badges" style={{ marginBottom: "1rem" }}>
            {project.tags.map((tag) => (
              <span key={tag} className="mono-badge">
                {tag}
              </span>
            ))}
          </div>
        </header>

        <details className="page-contents">
          <summary>On this page ({navSections.length} sections)</summary>
          <nav aria-label="On this page">
            <ol>
              {navSections.map((sec) => (
                <li key={sec.id}>
                  <a href={`#${sec.id}`}>{sec.label}</a>
                </li>
              ))}
            </ol>
          </nav>
        </details>

        {/* Specifications Table */}
        {project.specs && project.specs.length > 0 && (
          <section
            id="specifications"
            tabIndex={-1}
            style={{ marginTop: "1.75rem" }}
            aria-labelledby="specs-heading"
          >
            <h2
              id="specs-heading"
              style={{
                margin: "0 0 0.65rem",
                fontFamily: "var(--font-mono-stack)",
                fontSize: "1rem",
                fontWeight: 500,
              }}
            >
              Specifications &amp; verified operating envelope
            </h2>
            <div
              className="table-scroll"
              tabIndex={0}
              role="region"
              aria-label="Scrollable specification table"
            >
              <table className="spec-table">
                <thead>
                  <tr>
                    <th scope="col">Subsystem / Parameter</th>
                    <th scope="col">Measured / Designed Value</th>
                    <th scope="col">Engineering Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {project.specs.map((s) => (
                    <tr key={s.parameter}>
                      <td
                        style={{
                          fontFamily: "var(--font-mono-stack)",
                          fontSize: "0.78rem",
                          color: "var(--ink)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {s.parameter}
                      </td>
                      <td style={{ color: "var(--ink)", fontWeight: 500 }}>{s.value}</td>
                      <td style={{ color: "var(--ink-dim)" }}>{s.notes ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Interactive Hardware Workbench */}
        {project.interactiveWidget && (
          <section
            id="workbench"
            tabIndex={-1}
            style={{ marginTop: "1.75rem" }}
            aria-labelledby="workbench-heading"
          >
            <h2
              id="workbench-heading"
              style={{
                margin: "0 0 0.65rem",
                fontFamily: "var(--font-mono-stack)",
                fontSize: "1rem",
                fontWeight: 500,
              }}
            >
              Interactive hardware workbench
            </h2>
            {project.interactiveWidget === "im6014-thermal" && <Im6014ThermalExplorer />}
            {project.interactiveWidget === "regen-inspector" && <RegenBoardInspector />}
            {project.interactiveWidget === "foc-schematic" && <SchematicViewer />}
          </section>
        )}

        {/* Hardware & Simulation Plates */}
        {project.plates && project.plates.length > 0 ? (
          <section
            className="plates"
            id="project-images"
            tabIndex={-1}
            aria-label="Hardware renders, bench photos, and simulation plots"
          >
            {project.plates.map((plate, pIdx) => (
              <figure key={plate.src} className="plate">
                <img
                  src={assetPath(plate.src)}
                  width={plate.width}
                  height={plate.height}
                  style={
                    plate.maxRem
                      ? { width: `min(100%, ${plate.maxRem}rem)` }
                      : undefined
                  }
                  alt={plate.alt}
                  loading={pIdx === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
                <figcaption>{plate.caption}</figcaption>
              </figure>
            ))}
          </section>
        ) : (
          <div className="plates" id="project-images">
            <figure className="plate">
              <img
                src={assetPath(project.image)}
                width={project.imageWidth}
                height={project.imageHeight}
                alt={project.imageAlt}
                decoding="async"
              />
              <figcaption>{project.tileSub}</figcaption>
            </figure>
          </div>
        )}

        {/* Technical Writeup (Markdown + KaTeX + GFM tables) */}
        <div className="eng-prose">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              h2: ({ children }) => {
                const text = extractNodeText(children);
                const id = slugifyHeading(text);
                return (
                  <h2 id={id} tabIndex={-1}>
                    {children}
                  </h2>
                );
              },
              table: ({ children }) => (
                <div
                  className="table-scroll"
                  tabIndex={0}
                  role="region"
                  aria-label="Scrollable engineering data table"
                >
                  <table>{children}</table>
                </div>
              ),
              th: ({ children }) => <th scope="col">{children}</th>,
              pre: ({ children }) => (
                <pre tabIndex={0} role="region" aria-label="Code listing">
                  {children}
                </pre>
              ),
            }}
          >
            {cleanedContent}
          </ReactMarkdown>
        </div>

        {/* Chronological Build & Debugging Log for this Project */}
        {projectLogs.length > 0 && (
          <section
            id="build-log"
            tabIndex={-1}
            style={{
              marginTop: "2.75rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid var(--line)",
            }}
            aria-labelledby="build-log-heading"
          >
            <div className="section-head" style={{ marginBottom: "0.75rem" }}>
              <h2
                id="build-log-heading"
                style={{ fontSize: "1rem", color: "var(--ink)" }}
              >
                Chronological engineering log ({projectLogs.length})
              </h2>
              <Link href="/devlog">full lab notebook →</Link>
            </div>
            <ul className="devlog-list" role="list">
              {projectLogs.map((entry) => (
                <li key={entry.id} className="devlog-item">
                  <div className="devlog-header">
                    <span style={{ color: "var(--accent)" }}>{entry.displayDate}</span>
                    <span>{entry.metrics.join(" · ")}</span>
                  </div>
                  <h3 className="devlog-title">{entry.title}</h3>
                  {entry.body.map((para, i) => (
                    <p key={i} className="devlog-summary" style={{ marginTop: "0.45rem" }}>
                      {para}
                    </p>
                  ))}
                  {entry.codeSnippet && (
                    <pre
                      tabIndex={0}
                      role="region"
                      aria-label={`${entry.projectLabel} code snippet`}
                      style={{
                        margin: "0.65rem 0 0.2rem",
                        padding: "0.7rem 0.9rem",
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
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Related Hardware */}
        {relatedProjects.length > 0 && (
          <section
            id="related-work"
            tabIndex={-1}
            style={{
              marginTop: "2.5rem",
              paddingTop: "1.25rem",
              borderTop: "1px solid var(--line)",
            }}
            aria-labelledby="related-heading"
          >
            <h2
              id="related-heading"
              style={{
                margin: "0 0 0.85rem",
                fontFamily: "var(--font-mono-stack)",
                fontSize: "0.9375rem",
                fontWeight: 500,
              }}
            >
              Related hardware &amp; control stacks
            </h2>
            <ul role="list" style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {relatedProjects.map((rp) => (
                <li key={rp.slug} style={{ marginBottom: "0.85rem" }}>
                  <Link
                    href={`/projects/${rp.slug}`}
                    className="standalone-link"
                    style={{
                      fontFamily: "var(--font-mono-stack)",
                      fontSize: "0.84375rem",
                      fontWeight: 500,
                    }}
                  >
                    {rp.title} →
                  </Link>
                  <p
                    style={{
                      margin: "0.15rem 0 0",
                      fontSize: "0.84375rem",
                      color: "var(--muted)",
                    }}
                  >
                    {rp.summary}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <nav className="pager" aria-label="More projects">
          <Link href={`/projects/${prevProject.slug}`}>← {prevProject.shortTitle}</Link>
          <Link href={`/projects/${nextProject.slug}`}>{nextProject.shortTitle} →</Link>
        </nav>
      </main>

      <footer className="foot">
        <span>Siddharth Rajasekaran · 2026</span>
        <a href="#top">top ↑</a>
      </footer>
    </div>
  );
}
