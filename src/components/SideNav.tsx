"use client";

import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { devlogEntries } from "@/data/devlog";
import { ThemeToggle } from "@/components/ThemeToggle";

export interface NavSectionItem {
  id: string;
  label: string;
  children?: { id: string; label: string }[];
}

interface SideNavProps {
  mode: "home" | "project" | "subpage";
  sections?: NavSectionItem[];
  relatedProjects?: { slug: string; title: string }[];
  currentPath?: string;
  crumb?: ReactNode;
  actions?: ReactNode;
}

export function SideNav({
  mode,
  sections = [],
  relatedProjects = [],
  currentPath,
  crumb,
  actions,
}: SideNavProps) {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "");
  const navRef = useRef<HTMLElement>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const releaseModalLock = useCallback(() => {
    document.body.style.overflow = "";
    const skipLink = document.querySelector(".skip-link");
    if (skipLink instanceof HTMLElement) {
      skipLink.inert = false;
    }
    const parent = navRef.current?.parentElement;
    if (parent) {
      Array.from(parent.children).forEach((child) => {
        if (child instanceof HTMLElement) {
          child.inert = false;
        }
      });
    }
  }, []);

  const closeMenu = useCallback(
    (restoreFocus = false) => {
      releaseModalLock();
      setOpen(false);
      if (restoreFocus) {
        requestAnimationFrame(() => {
          toggleBtnRef.current?.focus();
        });
      }
    },
    [releaseModalLock]
  );

  // Lock background scroll, set inert on background siblings + skip-link, and manage Escape / viewport resize
  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";
    const navEl = navRef.current;
    const parent = navEl?.parentElement;
    const inerted: HTMLElement[] = [];

    const skipLink = document.querySelector(".skip-link");
    if (skipLink instanceof HTMLElement) {
      skipLink.inert = true;
      inerted.push(skipLink);
    }

    if (parent) {
      Array.from(parent.children).forEach((child) => {
        if (
          child instanceof HTMLElement &&
          child !== navEl &&
          !child.classList.contains("nav-scrim")
        ) {
          child.inert = true;
          inerted.push(child);
        }
      });
    }

    requestAnimationFrame(() => {
      closeBtnRef.current?.focus();
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeMenu(true);
      }
    };

    const mq = window.matchMedia("(min-width: 1240px)");
    const onDesktop = (e: MediaQueryListEvent) => {
      if (e.matches) closeMenu(false);
    };

    window.addEventListener("keydown", onKeyDown);
    mq.addEventListener("change", onDesktop);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      mq.removeEventListener("change", onDesktop);
      document.body.style.overflow = "";
      inerted.forEach((el) => {
        el.inert = false;
      });
    };
  }, [open, closeMenu]);

  // Deterministic scrollspy across tall containers (/devlog), top-of-page, and bottom-of-page
  useEffect(() => {
    if (sections.length === 0) return;
    const allIds: string[] = [];
    for (const s of sections) {
      allIds.push(s.id);
      if (s.children) {
        for (const c of s.children) allIds.push(c.id);
      }
    }

    const updateActive = () => {
      const elements = allIds
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => el !== null);
      if (elements.length === 0) return;

      if (window.scrollY < 60) {
        setActiveId(elements[0].id);
        return;
      }

      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 24;
      if (atBottom) {
        setActiveId(elements[elements.length - 1].id);
        return;
      }

      const triggerY = window.innerHeight * 0.28;
      let current = elements[0].id;
      for (const el of elements) {
        if (el.getBoundingClientRect().top <= triggerY) {
          current = el.id;
        } else {
          break;
        }
      }
      setActiveId(current);
    };

    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, [sections]);

  return (
    <>
      <div id="top" tabIndex={-1} className="top-anchor" />

      <div className="top-chrome" role="region" aria-label="Site controls">
        <div className="top-chrome-left">
          <button
            ref={toggleBtnRef}
            type="button"
            className="nav-toggle"
            aria-controls="side-nav"
            aria-expanded={open}
            aria-label="Open section navigation"
            onClick={() => setOpen(true)}
          >
            <Menu className="w-4 h-4" aria-hidden="true" />
            <span className="nav-toggle-label">menu</span>
          </button>
          {crumb && <span className="crumb">{crumb}</span>}
        </div>

        <div className="top-chrome-actions">
          {actions}
          <ThemeToggle />
        </div>
      </div>

      {open && (
        <div
          className="nav-scrim"
          aria-hidden="true"
          onClick={() => closeMenu(true)}
        />
      )}

      <nav
        ref={navRef}
        id="side-nav"
        className={`side-nav${open ? " is-open" : ""}`}
        aria-label={mode === "home" ? "Portfolio sections" : "Page navigation"}
      >
        <div className="drawer-header">
          <span className="drawer-title">navigation</span>
          <button
            ref={closeBtnRef}
            type="button"
            className="chrome-btn drawer-close"
            aria-label="Close section navigation"
            onClick={() => closeMenu(true)}
          >
            <X className="w-3.5 h-3.5" aria-hidden="true" />
            <span>close</span>
          </button>
        </div>

        {mode !== "home" && (
          <div style={{ marginBottom: "1rem" }}>
            <Link href="/" onClick={() => closeMenu(false)}>
              ← Siddharth Rajasekaran
            </Link>
          </div>
        )}

        {sections.length > 0 && (
          <>
            {mode !== "home" && <p className="side-nav-label">On this page</p>}
            <ul role="list">
              {sections.map((sec) => {
                const isActive = activeId === sec.id;
                return (
                  <li key={sec.id}>
                    <a
                      href={`#${sec.id}`}
                      className={isActive ? "target-current" : undefined}
                      aria-current={isActive ? "true" : undefined}
                      onClick={() => {
                        setActiveId(sec.id);
                        closeMenu(false);
                      }}
                    >
                      {sec.label}
                    </a>
                    {sec.children && sec.children.length > 0 && (
                      <ul role="list">
                        {sec.children.map((child) => {
                          const isChildActive = activeId === child.id;
                          return (
                            <li key={child.id}>
                              <a
                                href={`#${child.id}`}
                                className={isChildActive ? "target-current" : undefined}
                                aria-current={isChildActive ? "true" : undefined}
                                onClick={() => {
                                  setActiveId(child.id);
                                  closeMenu(false);
                                }}
                              >
                                {child.label}
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </>
        )}

        <p className="side-nav-label">Pages</p>
        <ul role="list">
          <li>
            <Link
              href="/"
              aria-current={currentPath === "/" ? "page" : undefined}
              onClick={() => closeMenu(false)}
            >
              index/
            </Link>
          </li>
          <li>
            <Link
              href="/devlog"
              aria-current={currentPath === "/devlog" ? "page" : undefined}
              onClick={() => closeMenu(false)}
            >
              devlog/ ({devlogEntries.length})
            </Link>
          </li>
          <li>
            <Link
              href="/resume"
              aria-current={currentPath === "/resume" ? "page" : undefined}
              onClick={() => closeMenu(false)}
            >
              resume / cv
            </Link>
          </li>
        </ul>

        {relatedProjects.length > 0 && (
          <>
            <p className="side-nav-label">Related hardware</p>
            <ul role="list">
              {relatedProjects.map((rp) => (
                <li key={rp.slug}>
                  <Link href={`/projects/${rp.slug}`} onClick={() => closeMenu(false)}>
                    {rp.title}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </nav>
    </>
  );
}
