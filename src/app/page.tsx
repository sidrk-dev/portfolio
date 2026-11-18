import Link from "next/link";
import { portfolio } from "@/data/portfolio";
import { devlogEntries } from "@/data/devlog";
import { assetPath } from "@/lib/paths";
import { SideNav } from "@/components/SideNav";
import { CopyEmailButton } from "@/components/CopyEmailButton";
import { DevlogPreviewClient, ProjectsGridClient } from "@/components/HomeClient";

const HOME_SECTIONS = [
  { id: "now", label: "now/" },
  { id: "projects", label: "projects/" },
  { id: "devlog", label: "devlog/" },
  { id: "experience", label: "experience/" },
  { id: "skills", label: "stack/" },
];

export default function Home() {
  const { personal, now, projects, experience, skills } = portfolio;

  return (
    <div className="shell">
      <SideNav
        mode="home"
        sections={HOME_SECTIONS}
        currentPath="/"
        crumb={<span>siddharth rajasekaran · portfolio</span>}
      />

      <header className="identity">
        <h1>{personal.name}</h1>
        <p className="role">{personal.headline}</p>
        <p className="seeking">
          <span className="status-dot" aria-hidden="true" />
          <span>{personal.seeking}</span>
        </p>

        <p className="lede">{personal.lede}</p>

        <nav className="identity-links" aria-label="Primary links">
          <a href={`mailto:${personal.email}`}>email</a>
          <CopyEmailButton email={personal.email} />
          <a href={personal.github} target="_blank" rel="noopener noreferrer">
            github {"\u2197\uFE0E"}
          </a>
          <a href={personal.linkedin} target="_blank" rel="noopener noreferrer">
            linkedin {"\u2197\uFE0E"}
          </a>
          <Link href="/devlog">devlog/ ({devlogEntries.length})</Link>
          <Link href="/resume">resume / cv</Link>
          <a href={assetPath("/resume.pdf")} target="_blank" rel="noopener noreferrer">
            resume.pdf {"\u2197\uFE0E"}
          </a>
        </nav>

        <ul className="quick-kv" role="list" aria-label="Engineering summary">
          {personal.quickFacts.map((fact) => (
            <li key={fact.key}>
              <span className="kv-key">{fact.key}</span>
              <span className="kv-val">{fact.value}</span>
            </li>
          ))}
        </ul>
      </header>

      <main id="content" tabIndex={-1}>
        {/* NOW: Active intertwined robotics systems */}
        <section className="section" id="now" tabIndex={-1} aria-labelledby="now-h">
          <div className="section-head">
            <h2 id="now-h">now/</h2>
            <span style={{ color: "var(--muted)" }}>current hardware &amp; controls</span>
          </div>

          <div className="now-stack">
            {now.map((item, idx) => (
              <article key={item.slug} className="feature-card">
                <p className="feature-kicker">{item.label}</p>
                <Link href={`/projects/${item.slug}`} className="feature-link">
                  <img
                    src={assetPath(item.image)}
                    width={item.imageWidth}
                    height={item.imageHeight}
                    alt={item.imageAlt}
                    fetchPriority={idx === 0 ? "high" : "auto"}
                    decoding="async"
                  />
                  <span className="feature-title">{item.title}</span>
                </Link>
                <p className="feature-text">{item.summary}</p>
              </article>
            ))}
          </div>
        </section>

        {/* PROJECTS: Ranked most impressive & useful first */}
        <section className="section" id="projects" tabIndex={-1} aria-labelledby="proj-h">
          <div className="section-head">
            <h2 id="proj-h">projects/</h2>
            <a href={personal.github} target="_blank" rel="noopener noreferrer">
              github.com/sidrk-dev {"\u2197\uFE0E"}
            </a>
          </div>
          <ProjectsGridClient projects={projects} />
        </section>

        {/* DEVLOG: Dated engineering progress updates */}
        <section className="section" id="devlog" tabIndex={-1} aria-labelledby="devlog-h">
          <div className="section-head">
            <h2 id="devlog-h">devlog/</h2>
            <Link href="/devlog">all {devlogEntries.length} lab entries →</Link>
          </div>
          <DevlogPreviewClient entries={devlogEntries} />
        </section>

        {/* EXPERIENCE */}
        <section className="section" id="experience" tabIndex={-1} aria-labelledby="exp-h">
          <div className="section-head">
            <h2 id="exp-h">experience/</h2>
            <Link href="/resume">full cv →</Link>
          </div>
          <ul className="exp-list" role="list">
            {experience.map((exp) => (
              <li key={`${exp.role}-${exp.org}`}>
                <span>
                  <span className="exp-role">{exp.role}</span>{" "}
                  <span className="exp-org">— {exp.org}</span>
                </span>
                <span className="exp-when">{exp.when}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* TECHNICAL STACK */}
        <section className="section" id="skills" tabIndex={-1} aria-labelledby="skills-h">
          <div className="section-head">
            <h2 id="skills-h">stack/</h2>
            <span style={{ color: "var(--muted)" }}>hardware · firmware · controls</span>
          </div>
          <table className="skills-table">
            <tbody>
              {skills.map((row) => (
                <tr key={row.group}>
                  <th scope="row">{row.group}</th>
                  <td>{row.items}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      <footer className="foot">
        <span>
          {personal.name} · <a href={`mailto:${personal.email}`}>{personal.email}</a>
        </span>
        <a href="#top">top ↑</a>
      </footer>
    </div>
  );
}
