import type { Metadata } from "next";
import Link from "next/link";
import { portfolio } from "@/data/portfolio";
import { assetPath } from "@/lib/paths";
import { SideNav } from "@/components/SideNav";
import { PrintResumeButton } from "@/components/PrintResumeButton";

export const metadata: Metadata = {
  title: "Resume / CV — Siddharth Rajasekaran",
  description:
    "Curriculum Vitae of Siddharth Rajasekaran — Robotics, Power Electronics, Actuators, and Embedded Controls at Texas A&M University.",
  openGraph: {
    title: "Resume / CV — Siddharth Rajasekaran",
    description:
      "Curriculum Vitae of Siddharth Rajasekaran — Robotics, 24–48 V Power Electronics, QDD Actuators, and Embedded Controls at Texas A&M University.",
    type: "profile",
    url: "https://sidrk-dev.github.io/portfolio/resume/",
    images: [
      {
        url: "https://sidrk-dev.github.io/portfolio/images/regen/revf-3d.png",
        width: 1600,
        height: 900,
        alt: "24–48 V Regenerative Braking & Precharge PCB (Rev F)",
      },
    ],
  },
};

const CV_SECTIONS = [
  { id: "cv-education", label: "Education & publication" },
  { id: "cv-projects", label: "Selected hardware" },
  { id: "cv-experience", label: "Experience" },
  { id: "cv-skills", label: "Technical stack" },
];

const CV_PROJECT_SLUGS = [
  "im6014-qdd-arm",
  "regen-clamp-pcb",
  "bldc-actuator",
  "foc-driver",
  "rp2350-robomaster-arm",
  "food-scooping-vla",
  "crazyflie-swarm",
  "medical-device-prototypes",
];

export default function ResumePage() {
  const { personal, projects, experience, skills } = portfolio;
  const cvProjects = CV_PROJECT_SLUGS.map((slug) =>
    projects.find((p) => p.slug === slug)
  ).filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div className="shell">
      <SideNav
        mode="subpage"
        sections={CV_SECTIONS}
        currentPath="/resume"
        crumb={<Link href="/">← Siddharth Rajasekaran</Link>}
      />

      <main id="content" tabIndex={-1} className="project-article resume-page">
        <header style={{ paddingBottom: "1rem", borderBottom: "1px solid var(--line)" }}>
          <h1 style={{ marginTop: "0.25rem" }}>{personal.name}</h1>
          <p className="project-meta" style={{ fontSize: "0.8125rem", color: "var(--ink-dim)" }}>
            {personal.location} · <a href={`mailto:${personal.email}`}>{personal.email}</a> ·{" "}
            <a href={personal.github} target="_blank" rel="noopener noreferrer">
              github.com/sidrk-dev
            </a>{" "}
            ·{" "}
            <a href={personal.linkedin} target="_blank" rel="noopener noreferrer">
              linkedin.com/in/siddharthrajasekaran
            </a>
          </p>
          <p className="project-meta" style={{ marginTop: "0.3rem", color: "var(--accent)" }}>
            {personal.seeking}
          </p>
          <div className="no-print" style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.75rem" }}>
            <a
              href={assetPath("/docs/Siddharth_Rajasekaran_Resume.pdf")}
              download="Siddharth_Rajasekaran_Resume.pdf"
              className="chrome-btn"
            >
              download pdf
            </a>
            <PrintResumeButton />
          </div>
        </header>

        {/* Education & Peer-Reviewed Publication */}
        <section id="cv-education" tabIndex={-1} style={{ marginTop: "1.6rem" }}>
          <h2
            style={{
              margin: "0 0 0.6rem",
              fontFamily: "var(--font-mono-stack)",
              fontSize: "0.84375rem",
              fontWeight: 500,
              color: "var(--muted)",
            }}
          >
            education &amp; publication/
          </h2>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              gap: "0.5rem",
              fontSize: "0.9rem",
            }}
          >
            <div>
              <strong style={{ color: "var(--ink)" }}>{personal.school}</strong> —{" "}
              <span style={{ color: "var(--ink-dim)" }}>{personal.degree}</span>
            </div>
            <span style={{ fontFamily: "var(--font-mono-stack)", fontSize: "0.75rem", color: "var(--muted)" }}>
              College Station, TX
            </span>
          </div>
          <p style={{ margin: "0.4rem 0 0", fontSize: "0.85rem", color: "var(--ink-dim)", lineHeight: 1.55 }}>
            <strong>Peer-Reviewed Publication:</strong> M. Shahsavar,{" "}
            <strong style={{ color: "var(--ink)" }}>S. Rajasekaran</strong>, R. Kabin, M. Yannuzzi, and A. T. Becker,
            &ldquo;Tracking Multiple Moving Assets with a Smaller Group of Drones,&rdquo;{" "}
            <em>IEEE International Conference on Automation Science and Engineering (CASE)</em>, 2025, pp. 171–178 (
            <a
              href="https://doi.org/10.1109/CASE58245.2025.11164124"
              target="_blank"
              rel="noopener noreferrer"
            >
              DOI: 10.1109/CASE58245.2025.11164124 {"\u2197\uFE0E"}
            </a>
            ).
          </p>
        </section>

        {/* Selected Robotics & Power Systems */}
        <section id="cv-projects" tabIndex={-1} style={{ marginTop: "1.85rem" }}>
          <h2
            style={{
              margin: "0 0 0.6rem",
              fontFamily: "var(--font-mono-stack)",
              fontSize: "0.84375rem",
              fontWeight: 500,
              color: "var(--muted)",
            }}
          >
            selected engineering systems/
          </h2>
          <ul className="devlog-list" role="list">
            {cvProjects.map((p) => (
              <li key={p.slug} className="devlog-item" style={{ padding: "0.8rem 0" }}>
                <div className="devlog-header">
                  <Link
                    href={`/projects/${p.slug}`}
                    style={{ fontWeight: 500, color: "var(--ink)", fontSize: "0.84375rem" }}
                  >
                    {p.shortTitle}
                  </Link>
                  <span>{p.period}</span>
                </div>
                <p style={{ margin: "0.26rem 0 0", fontSize: "0.85rem", color: "var(--ink-dim)", lineHeight: 1.54 }}>
                  {p.summary} Key results: {p.metrics.map((m) => `${m.label}: ${m.value}`).join(" · ")}.
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* Experience */}
        <section id="cv-experience" tabIndex={-1} style={{ marginTop: "1.85rem" }}>
          <h2
            style={{
              margin: "0 0 0.6rem",
              fontFamily: "var(--font-mono-stack)",
              fontSize: "0.84375rem",
              fontWeight: 500,
              color: "var(--muted)",
            }}
          >
            experience/
          </h2>
          <ul className="devlog-list" role="list">
            {experience.map((exp) => (
              <li key={`${exp.role}-${exp.org}`} className="devlog-item" style={{ padding: "0.8rem 0" }}>
                <div className="devlog-header">
                  <span style={{ color: "var(--ink)", fontWeight: 500, fontSize: "0.84375rem" }}>
                    {exp.role} — {exp.org} ({exp.location})
                  </span>
                  <span>{exp.when}</span>
                </div>
                <ul className="cv-bullets" style={{ margin: "0.35rem 0 0", paddingLeft: "1.2rem", fontSize: "0.85rem", color: "var(--ink-dim)" }}>
                  {exp.bullets.map((b, i) => (
                    <li key={i} style={{ margin: "0.2rem 0", lineHeight: 1.54 }}>
                      {b}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>

        {/* Technical Stack */}
        <section id="cv-skills" tabIndex={-1} style={{ marginTop: "1.85rem" }}>
          <h2
            style={{
              margin: "0 0 0.6rem",
              fontFamily: "var(--font-mono-stack)",
              fontSize: "0.84375rem",
              fontWeight: 500,
              color: "var(--muted)",
            }}
          >
            technical stack/
          </h2>
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
        <span>{personal.name} · Printable Engineering CV</span>
        <a href="#top" className="no-print">
          top ↑
        </a>
      </footer>
    </div>
  );
}
