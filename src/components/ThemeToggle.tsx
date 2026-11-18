"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type ResolvedScheme = "light" | "dark";

function resolveCurrentScheme(): { resolved: ResolvedScheme; isOverride: boolean } {
  if (typeof window === "undefined") {
    return { resolved: "light", isOverride: false };
  }
  let stored: string | null = null;
  try {
    stored = localStorage.getItem("color-scheme");
  } catch {
    stored = null;
  }
  if (stored === "light" || stored === "dark") {
    return { resolved: stored, isOverride: true };
  }
  const sysDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return { resolved: sysDark ? "dark" : "light", isOverride: false };
}

function applyScheme(stored: "light" | "dark" | null) {
  const meta = document.querySelector('meta[name="color-scheme"]');
  if (stored === "light" || stored === "dark") {
    if (meta) meta.setAttribute("content", stored);
    document.documentElement.setAttribute("data-theme", stored);
  } else {
    if (meta) meta.setAttribute("content", "light dark");
    document.documentElement.removeAttribute("data-theme");
  }
}

export function ThemeToggle() {
  const [state, setState] = useState<{ resolved: ResolvedScheme; isOverride: boolean } | null>(null);

  useEffect(() => {
    const sync = () => setState(resolveCurrentScheme());
    sync();

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onMqChange = () => sync();
    const onStorage = (e: StorageEvent) => {
      if (e.key === "color-scheme" || e.key === null) {
        const current = localStorage.getItem("color-scheme");
        applyScheme(current === "light" || current === "dark" ? current : null);
        sync();
      }
    };

    mq.addEventListener("change", onMqChange);
    window.addEventListener("storage", onStorage);
    return () => {
      mq.removeEventListener("change", onMqChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const handleToggle = () => {
    const { resolved } = resolveCurrentScheme();
    const target: ResolvedScheme = resolved === "dark" ? "light" : "dark";
    const sysScheme: ResolvedScheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

    try {
      if (target === sysScheme) {
        // Revert to system default instead of pinning redundantly (modern-web-guidance)
        localStorage.removeItem("color-scheme");
        applyScheme(null);
      } else {
        localStorage.setItem("color-scheme", target);
        applyScheme(target);
      }
    } catch {
      applyScheme(target);
    }
    setState(resolveCurrentScheme());
  };

  const isDark = state?.resolved === "dark";
  const nextLabel = isDark ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="chrome-btn"
      aria-label={state ? `Switch to ${nextLabel} color theme` : "Toggle color theme"}
      title={
        state
          ? `Theme: ${state.resolved}${state.isOverride ? " (pinned)" : " (system)"} — click for ${nextLabel}`
          : "Toggle light/dark theme"
      }
    >
      {state ? (
        isDark ? (
          <>
            <Sun className="w-3.5 h-3.5" aria-hidden="true" />
            <span>light</span>
          </>
        ) : (
          <>
            <Moon className="w-3.5 h-3.5" aria-hidden="true" />
            <span>dark</span>
          </>
        )
      ) : (
        <span>theme</span>
      )}
    </button>
  );
}
