"use client";

import { useState } from "react";

interface BlockSpec {
  id: string;
  ref: string;
  name: string;
  shortName: string;
  part: string;
  shortPart: string;
  summary: string;
  details: string[];
  x: number;
  y: number;
  w: number;
  h: number;
}

const BLOCKS: BlockSpec[] = [
  {
    id: "input",
    ref: "J1 · D1 · C17",
    name: "24–48 V DC Input & Input TVS",
    shortName: "24–48 V Input & TVS",
    part: "XT60PW-M + SMCJ51A + 470 µF 100 V",
    shortPart: "XT60PW-M · SMCJ51A",
    summary:
      "Receives 24–48 V (up to 27 A continuous) from the bench supply via an external ≥60 V DC 30 A fuse. Plated XT60 slots were enlarged to 3.00 mm / 0.90 × 2.00 mm in Rev F to accommodate JLCPCB's -0.08 mm hole plating tolerance.",
    details: [
      "UVLO threshold (R1/R2): ~13.5 V rising",
      "Input OVP cut-off (R3/R4): ~57 V",
      "C17 (470 µF 100 V) decouples supply lead inductance ahead of Q1/Q7",
    ],
    x: 24,
    y: 38,
    w: 140,
    h: 76,
  },
  {
    id: "ideal-diode",
    ref: "U1 · Q1 ‖ Q7",
    name: "Reverse-Blocking Ideal Diode",
    shortName: "Reverse-Block Ideal Diode",
    part: "LM74800-Q1 + 2× CRSS042N10N (TO-263)",
    shortPart: "LM74800 + 2× CRSS042N",
    summary:
      "Regulates a 10.5 mV forward drop at light load, fully enhances Q1‖Q7 above ~5 A, and turns off in <1 µs at -4.5 mV reverse drop when arm deceleration pushes VOUT above VIN — isolating the bench PSU from reverse current.",
    details: [
      "MOSFETs: 100 V, 120 A, 4.2 mΩ max Rds(on)",
      "Reverse recovery charge into VIN: <24 µC in conservative SPICE",
      "DGATE node also feeds Q10/Q11 forward-conduction brake interlock",
    ],
    x: 188,
    y: 38,
    w: 162,
    h: 76,
  },
  {
    id: "precharge",
    ref: "Q2 ‖ Q8 · C4/5/13/14",
    name: "140 V/s Linear-SOA Precharge",
    shortName: "140 V/s Linear Precharge",
    part: "2× CRSS042N10N + 400 nF dV/dt Ramp",
    shortPart: "2× CRSS042N + 400 nF",
    summary:
      "LM74800-Q1's 55 µA HGATE source charges 4× 100 nF 100 V capacitors through 1 kΩ, slewing VOUT at ~140 V/s (0 → 36 V in 0.26 s). Cuts hot-plug inrush into 2,480 µF from >250 A down to 0.34 A.",
    details: [
      "Worst-case single-FET linear stress (ΔVth = 0.4 V): 12 W / 1.6 J @ 36 V (<10% DC SOA)",
      "Per-FET 10 Ω gate resistors (R32/R33) prevent parallel linear oscillation",
      "D11 (12 V Zener) clamps HGATE − VOUT on output short-circuit",
    ],
    x: 374,
    y: 38,
    w: 170,
    h: 76,
  },
  {
    id: "outputs",
    ref: "C7/8/15/16 · J2–J7",
    name: "1,880 µF Bus Bank & 5× XT30 Outputs",
    shortName: "1,880 µF Bank & 5× XT30",
    part: "4× 470 µF 100 V + 5× XT30PW-F + D2 SMCJ51A",
    shortPart: "4× 470 µF + D2 SMCJ51A",
    summary:
      "Distributes VOUT across three daisy-chained IM6014 arm branches, one moteus r4.11 gripper branch (10–44 V rated; 44 V abs max), and one spare port (15 A cont / 30 A burst per XT30).",
    details: [
      "End-to-end copper resistance (copper_check.py): 3.13 mΩ (2.28 W @ 27 A on 1 oz Cu)",
      "All 29 >50 V pads verified ≥0.50 mm to GND per IPC-2221B",
      "J12 MCU header outputs 0.053× BUS_ADC + open-drain BRK_FLAG",
    ],
    x: 568,
    y: 38,
    w: 168,
    h: 76,
  },
  {
    id: "vreg",
    ref: "U2 · Q4 · D10 · D12",
    name: "VOUT-Powered 11.6 V Control Rail",
    shortName: "VOUT 11.6 V Control Rail",
    part: "CJ431 + SOT-223 BCP56-16",
    shortPart: "CJ431 + BCP56-16",
    summary:
      "Draws power from VOUT rather than VIN so the regenerative brake chopper stays alive even if the PSU trips OVP, SW1 is switched off, or power is unplugged while the arm is backdriven.",
    details: [
      "Rev E fix: caught mirrored CJ431 SOT-23 pinout (1=REF, 2=K, 3=A) missed by ERC",
      "Upgraded Q4 from SOT-23 (Tj = 157 °C) to SOT-223 BCP56-16 (94 °C/W)",
      "D10 protects Q4 reverse Vbe; D12 (16 V Zener) guards rail overvoltage",
    ],
    x: 24,
    y: 162,
    w: 168,
    h: 82,
  },
  {
    id: "comparator",
    ref: "U3A · RV1 · 0.1% Div",
    name: "Supply-Tracking 0.1% Hysteretic Sense",
    shortName: "0.1% Hysteretic Sense",
    part: "LM393 + RT0603B 0.1% + 3362P Trim",
    shortPart: "LM393 + RT0603B + RV1",
    summary:
      "Compares scaled VOUT against scaled VIN + RV1 offset so one board tracks any 24–48 V supply automatically (+3.0 V to +7.5 V adjustable trip; ≤+5.0 V / TP9 ≤ 7.7 V on 36 V moteus & 48 V buses).",
    details: [
      "0.1% thin-film R10/R11/R14/R15 shrank 48 V 128-corner divider spread from 3.5 V → 0.6 V p-p",
      "J11 KSD9700 thermal switch opens pull-up & lights THERM OPEN LED (D9) on overheat",
      "U3B stretches short braking pulses to 0.34 s on red BRAKE LED (D6)",
    ],
    x: 212,
    y: 162,
    w: 180,
    h: 82,
  },
  {
    id: "interlock",
    ref: "Q10 · Q11",
    name: "DGATE PSU Latch-Off Interlock",
    shortName: "DGATE Latch Interlock",
    part: "MMBT5401 PNP + MMBT3904 NPN",
    shortPart: "MMBT5401 + MMBT3904",
    summary:
      "Hardware interlock sensing DGATE > VIN: clamps CMP_OUT low whenever the ideal diode conducts forward current so the chopper can never latch ON across the bench PSU (averting a 24 A / 1.15 kW fault).",
    details: [
      "Discovered via sim_brake_latch_48v.cir worst-case hysteresis corner analysis",
      "Releases automatically in <1 µs when reverse regen pulls DGATE low",
    ],
    x: 412,
    y: 162,
    w: 146,
    h: 82,
  },
  {
    id: "chopper",
    ref: "U4 · Q3 ‖ Q9 · J5 · Q136",
    name: "22 ns Chopper & 120 V DC Thermal Fuse",
    shortName: "22 ns Chopper & Fuse",
    part: "UCC27517 + 2× CRSS042N10N + 2 Ω 200 W",
    shortPart: "UCC27517 + 2 Ω 200 W",
    summary:
      "4 A gate driver U4 switches paralleled Q3‖Q9 in 22 ns into external 2 Ω 200 W chassis resistor(s). Dual SS210 Schottkys clamp lead inductance; inline TÜV 25 A / 120 V DC Q136 alloy fuse clears shorted-FET faults.",
    details: [
      "Clamps 36 V bus to 40.2 V peak up to 20 A (1× 2 Ω) or 35 A (2× 2 Ω parallel)",
      "Vds inductive turn-off peak: 46.1 V @ 36 V / 59.6 V @ 48 V vs 100 V FET rating",
    ],
    x: 578,
    y: 162,
    w: 158,
    h: 82,
  },
];

export function RegenBoardInspector() {
  const [tab, setTab] = useState<"diagram" | "calc">("diagram");
  const [selectedId, setSelectedId] = useState<string>("ideal-diode");

  // Calculator state
  const [vin, setVin] = useState<24 | 36 | 48>(36);
  const [tp9, setTp9] = useState<number>(6.2); // 6.2 V -> +4.0 V trip
  const [parallelRes, setParallelRes] = useState<1 | 2>(1);

  const selected = BLOCKS.find((b) => b.id === selectedId) ?? BLOCKS[1];

  const rBrake = (vin === 48 ? 2.5 : 2.0) / parallelRes;
  const deltaTrip = Math.max(2.6, 0.667 * tp9 - 0.14);
  const vTrip = vin + deltaTrip;
  const vRelease = vTrip - 2.3;
  const iKnee = vTrip / (rBrake + 0.015);
  const peakPowerW = (vTrip * vTrip) / rBrake;

  // Full worst-case peak includes 0.1% divider corner (±0.3 V @ 48 V), VREG/RV1/LM393 offset, and dynamic dV/dt overshoot.
  // Per Rev F spec: TP9 <= 7.7 V (+5.0 V trip) required on 36 V w/ moteus r4.11 (44.0 V max) and on 48 V (<56.7 V SMCJ51A min breakdown).
  const fullStackMargin = vin === 48 ? 3.65 : vin === 36 ? 2.95 : 2.1;
  const worstPeakV = vTrip + fullStackMargin;
  const moteusSafe = vin === 24 || (vin === 36 && worstPeakV <= 44.0);
  const tvsSafe = worstPeakV < 56.7;
  const busSafe = tvsSafe && (vin === 48 || moteusSafe);

  return (
    <div className="inspector-card" aria-label="Interactive Regen Clamp Rev F architecture and calculator">
      <div className="inspector-toolbar">
        <span style={{ fontWeight: 500, color: "var(--ink)" }}>
          Regen Clamp Rev F — Architecture &amp; Threshold Calculator
        </span>
        <div role="group" aria-label="Inspector view" style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
          <button
            type="button"
            className="chrome-btn"
            aria-pressed={tab === "diagram"}
            style={{
              borderColor: tab === "diagram" ? "var(--accent)" : undefined,
              background: tab === "diagram" ? "var(--accent-bg)" : undefined,
              color: tab === "diagram" ? "var(--ink)" : undefined,
            }}
            onClick={() => setTab("diagram")}
          >
            Interactive block map
          </button>
          <button
            type="button"
            className="chrome-btn"
            aria-pressed={tab === "calc"}
            style={{
              borderColor: tab === "calc" ? "var(--accent)" : undefined,
              background: tab === "calc" ? "var(--accent-bg)" : undefined,
              color: tab === "calc" ? "var(--ink)" : undefined,
            }}
            onClick={() => setTab("calc")}
          >
            Threshold &amp; knee calculator
          </button>
        </div>
      </div>

      {tab === "diagram" ? (
        <div style={{ padding: "0.95rem" }}>
          <p className="scroll-hint">Scroll diagram horizontally →</p>
          <div className="diagram-scroll">
            <svg
              viewBox="0 0 760 272"
              style={{
                width: "100%",
                minWidth: "36rem",
                height: "auto",
                display: "block",
                background: "var(--paper)",
                border: "1px solid var(--line)",
                borderRadius: "3px",
              }}
              role="group"
              aria-label="Clickable functional block diagram of Regen Clamp Rev F"
            >
              <defs>
                {BLOCKS.map((b) => (
                  <clipPath key={`clip-${b.id}`} id={`regen-clip-${b.id}`}>
                    <rect x={b.x + 6} y={b.y + 4} width={b.w - 12} height={b.h - 8} />
                  </clipPath>
                ))}
              </defs>

              {/* Main High-Current Bus */}
              <line x1="164" y1="76" x2="188" y2="76" stroke="var(--chart-mos)" strokeWidth="3" />
              <line x1="350" y1="76" x2="374" y2="76" stroke="var(--chart-mos)" strokeWidth="3" />
              <line x1="544" y1="76" x2="568" y2="76" stroke="var(--chart-mos)" strokeWidth="3" />
              <text x="26" y="25" fontSize="9.8" fontFamily="monospace" fill="currentColor" opacity={0.78}>
                HIGH-CURRENT DC PATH (24–48 V · 27 A · 3.13 mΩ IN 1 OZ CU) — SELECT ANY STAGE
              </text>

              {/* VOUT to VREG & Chopper tap */}
              <path d="M 652 114 L 652 162" stroke="var(--chart-mos)" strokeWidth="2" strokeDasharray="4,3" />
              <path
                d="M 556 76 L 556 140 L 108 140 L 108 162"
                stroke="var(--chart-wind)"
                strokeWidth="1.6"
                strokeDasharray="4,3"
                fill="none"
              />
              <path
                d="M 269 114 L 269 148 L 485 148 L 485 162"
                stroke="var(--accent)"
                strokeWidth="1.6"
                strokeDasharray="3,3"
                fill="none"
              />
              <line x1="192" y1="203" x2="212" y2="203" stroke="currentColor" strokeOpacity={0.45} strokeWidth="1.6" />
              <line x1="392" y1="203" x2="412" y2="203" stroke="currentColor" strokeOpacity={0.45} strokeWidth="1.6" />
              <line x1="558" y1="203" x2="578" y2="203" stroke="currentColor" strokeOpacity={0.45} strokeWidth="1.6" />

              {BLOCKS.map((b) => {
                const active = b.id === selectedId;
                return (
                  <g
                    key={b.id}
                    role="button"
                    tabIndex={0}
                    aria-pressed={active}
                    aria-label={`${b.ref}: ${b.name}`}
                    onClick={() => setSelectedId(b.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedId(b.id);
                      }
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <rect
                      x={b.x}
                      y={b.y}
                      width={b.w}
                      height={b.h}
                      rx={3}
                      fill={active ? "var(--accent-bg)" : "var(--surface)"}
                      stroke={active ? "var(--accent)" : "var(--border-control)"}
                      strokeWidth={active ? 2 : 1.2}
                    />
                    <g clipPath={`url(#regen-clip-${b.id})`}>
                      <text
                        x={b.x + 9}
                        y={b.y + 20}
                        fontSize="9.8"
                        fontWeight="600"
                        fontFamily="monospace"
                        fill="var(--accent)"
                      >
                        {b.ref}
                      </text>
                      <text
                        x={b.x + 9}
                        y={b.y + 39}
                        fontSize="10"
                        fontWeight="500"
                        fontFamily="sans-serif"
                        fill="currentColor"
                      >
                        {b.shortName}
                      </text>
                      <text
                        x={b.x + 9}
                        y={b.y + 57}
                        fontSize="9"
                        fontFamily="monospace"
                        fill="currentColor"
                        opacity={0.78}
                      >
                        {b.shortPart}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          <div
            style={{
              marginTop: "0.85rem",
              padding: "0.8rem 0.9rem",
              background: "var(--paper)",
              border: "1px solid var(--line)",
              borderRadius: "3px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                gap: "0.35rem 1rem",
                fontFamily: "var(--font-mono-stack)",
                fontSize: "0.75rem",
              }}
            >
              <strong style={{ color: "var(--accent)" }}>{selected.ref}</strong>
              <span style={{ color: "var(--muted)" }}>{selected.part}</span>
            </div>
            <h3
              style={{
                margin: "0.25rem 0 0.4rem",
                fontFamily: "var(--font-mono-stack)",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "var(--ink)",
              }}
            >
              {selected.name}
            </h3>
            <p style={{ margin: "0 0 0.55rem", fontSize: "0.85rem", color: "var(--ink-dim)", lineHeight: 1.58 }}>
              {selected.summary}
            </p>
            <ul style={{ margin: 0, paddingLeft: "1.15rem", fontSize: "0.8rem", color: "var(--muted)" }}>
              {selected.details.map((d) => (
                <li key={d} style={{ margin: "0.2rem 0" }}>
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div style={{ padding: "0.95rem", display: "grid", gap: "0.85rem" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
            <span style={{ fontFamily: "var(--font-mono-stack)", fontSize: "0.75rem", color: "var(--muted)" }}>
              Nominal supply VIN:
            </span>
            {([24, 36, 48] as const).map((v) => (
              <button
                key={v}
                type="button"
                className="chrome-btn"
                aria-pressed={vin === v}
                style={{
                  borderColor: vin === v ? "var(--accent)" : undefined,
                  background: vin === v ? "var(--accent-bg)" : undefined,
                  color: vin === v ? "var(--ink)" : undefined,
                }}
                onClick={() => setVin(v)}
              >
                {v} V {v === 36 ? "(IM6014 + moteus r4)" : v === 48 ? "(IM6014 only)" : ""}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
            <span style={{ fontFamily: "var(--font-mono-stack)", fontSize: "0.75rem", color: "var(--muted)" }}>
              External chassis brake load:
            </span>
            {([1, 2] as const).map((n) => (
              <button
                key={n}
                type="button"
                className="chrome-btn"
                aria-pressed={parallelRes === n}
                style={{
                  borderColor: parallelRes === n ? "var(--accent)" : undefined,
                  background: parallelRes === n ? "var(--accent-bg)" : undefined,
                  color: parallelRes === n ? "var(--ink)" : undefined,
                }}
                onClick={() => setParallelRes(n)}
              >
                {n === 1
                  ? `1× ${vin === 48 ? "2.5" : "2.0"} Ω 200 W`
                  : `2× ${vin === 48 ? "2.5" : "2.0"} Ω parallel (${((vin === 48 ? 2.5 : 2.0) / 2).toFixed(2)} Ω)`}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.75rem" }}>
            <label
              htmlFor="tp9-slider"
              style={{ fontFamily: "var(--font-mono-stack)", fontSize: "0.75rem", color: "var(--muted)" }}
            >
              RV1 trimmer setpoint V(TP9): <strong style={{ color: "var(--ink)" }}>{tp9.toFixed(2)} V</strong> (+
              {deltaTrip.toFixed(2)} V nominal trip; ≤7.70 V recommended on 36 V / 48 V)
            </label>
            <input
              id="tp9-slider"
              type="range"
              min={4.7}
              max={11.4}
              step={0.1}
              value={tp9}
              onChange={(e) => setTp9(Number(e.target.value))}
              style={{ flex: "1 1 10rem", maxWidth: "16rem" }}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(10rem, 1fr))",
              gap: "0.6rem",
              padding: "0.75rem",
              background: "var(--paper)",
              border: "1px solid var(--line)",
              borderRadius: "3px",
              fontFamily: "var(--font-mono-stack)",
              fontSize: "0.75rem",
            }}
          >
            <div>
              <span style={{ color: "var(--muted)", display: "block" }}>Nominal trip / release</span>
              <strong style={{ color: "var(--ink)" }}>
                {vTrip.toFixed(1)} V / {vRelease.toFixed(1)} V
              </strong>
            </div>
            <div>
              <span style={{ color: "var(--muted)", display: "block" }}>Worst-case dynamic peak</span>
              <strong style={{ color: busSafe ? "var(--ink)" : "var(--warn)" }}>
                {worstPeakV.toFixed(1)} V (0.6 V p-p div + dV/dt)
              </strong>
            </div>
            <div>
              <span style={{ color: "var(--muted)", display: "block" }}>Max clamped regen current</span>
              <strong style={{ color: "var(--accent)" }}>
                {iKnee.toFixed(1)} A ({peakPowerW.toFixed(0)} W pulse)
              </strong>
            </div>
            <div>
              <span style={{ color: "var(--muted)", display: "block" }}>Bus safety check</span>
              <strong style={{ color: busSafe ? "var(--accent)" : "var(--warn)" }}>
                {!tvsSafe
                  ? "TP9 > 7.7 V: exceeds 56.7 V TVS min!"
                  : vin === 36 && !moteusSafe
                    ? "TP9 > 7.7 V: exceeds 44 V moteus max!"
                    : vin === 48
                      ? "Safe (<56.7 V TVS; IM6014 only)"
                      : "Safe (<44 V moteus r4.11 & TVS)"}
              </strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
