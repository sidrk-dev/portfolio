"use client";

import { useEffect, useRef, useState } from "react";

export function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2400);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <span style={{ display: "inline-flex", alignItems: "center" }}>
      <button
        type="button"
        onClick={handleCopy}
        className="inline-action-btn"
      >
        {copied ? "copied email ✓" : "copy email"}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? `Copied ${email} to clipboard` : ""}
      </span>
    </span>
  );
}
