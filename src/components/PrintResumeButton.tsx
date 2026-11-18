"use client";

import { Printer } from "lucide-react";

export function PrintResumeButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="chrome-btn no-print"
      aria-label="Print or save resume as PDF"
    >
      <Printer className="w-3.5 h-3.5" aria-hidden="true" />
      <span>print / save pdf</span>
    </button>
  );
}
