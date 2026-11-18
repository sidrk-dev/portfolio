import type { Metadata } from "next";
import Link from "next/link";
import { SideNav } from "@/components/SideNav";

export const metadata: Metadata = {
  title: "404 — Route Not Found — Siddharth Rajasekaran",
  description: "Requested portfolio route could not be found.",
};

export default function NotFound() {
  return (
    <div className="shell">
      <SideNav
        mode="subpage"
        crumb={<Link href="/">← Siddharth Rajasekaran</Link>}
      />

      <main id="content" tabIndex={-1} style={{ marginTop: "2.5rem" }}>
        <h1
          style={{
            margin: 0,
            fontFamily: "var(--font-mono-stack)",
            fontSize: "1.125rem",
            fontWeight: 500,
          }}
        >
          404 — route not found
        </h1>
        <p className="lede" style={{ marginTop: "0.75rem" }}>
          That page does not exist or moved during the portfolio update.
        </p>
        <div className="identity-links" style={{ marginTop: "1.25rem" }}>
          <Link href="/">index/</Link>
          <Link href="/#projects">projects/</Link>
          <Link href="/devlog">devlog/</Link>
          <Link href="/resume">resume / cv</Link>
        </div>
      </main>

      <footer className="foot">
        <span>Siddharth Rajasekaran · 2026</span>
        <a href="#top">top ↑</a>
      </footer>
    </div>
  );
}
