"use client";

import { useState } from "react";

interface ComponentInfo {
  ref: string;
  value: string;
  title: string;
  description: string;
  specs: string[];
}

const COMPONENT_INFO: Record<string, ComponentInfo> = {
  U1: {
    ref: "U1",
    value: "DRV8313PWP",
    title: "Three-Phase Integrated Half-Bridge Driver",
    description:
      "Switches three integrated N-channel half-bridges from external MCU PWM signals while generating an internal +3.3INTRN rail on pin 15 (V3P3, decoupled by 470 nF C4). During bring-up, V3P3 leakage back-fed floating EN to 3.6 V when cross-board 0 V return was open, holding all outputs in logic Hi-Z.",
    specs: [
      "Motor supply VCC: 8–60 V · 2.5 A peak per phase (J2 TB002V-500-02BE)",
      "Charge pump: 100 nF C3 (CPL–CPH) + 100 nF C2 (VCP–VCC) + OCP / UVLO / OTSD",
      "Package: 0.65 mm-pitch HTSSOP-28 with exposed thermal pad",
    ],
  },
  U2: {
    ref: "U2",
    value: "2×5 Control Header",
    title: "External MCU PWM, Enable & Fault Interface",
    description:
      "2.54 mm 2×5 header linking the external microcontroller to FOC_DV: supplies external +3.3V logic/analog power (pad 2), routes IN1–IN3 PWM commands (pads 9, 7, 5), nRST (pad 6), nSLP (pad 8), En (pad 3 via 10 kΩ series R7), open-drain nFLT (pad 10), and common GND return (pads 1, 4).",
    specs: [
      "Separates external +3.3V rail from DRV8313 internal +3.3INTRN",
      "10 kΩ R7 series protection on En; dual GND return pads (1, 4)",
    ],
  },
  C1: {
    ref: "C1 / C2–C6",
    value: "100 µF + 0603 MLCCs",
    title: "VCC Bulk, Charge-Pump & Split +3.3V Decoupling",
    description:
      "100 µF electrolytic C1 absorbs commutation current ripple on VCC, 100 nF ceramics C2 (VCP–VCC reservoir) and C3 (CPL–CPH flying cap) drive the high-side gate charge pump, 470 nF C4 stabilizes internal +3.3INTRN, and twin 1 µF ceramics C5/C6 decouple external +3.3V right at U3 and U4.",
    specs: [
      "C1 (100 µF) on VCC · C2 (100 nF VCP–VCC) & C3 (100 nF CPL–CPH)",
      "C4 (470 nF) on +3.3INTRN · C5, C6 (1 µF) on external +3.3V",
    ],
  },
  D1: {
    ref: "D1 + R3 / R1·R2·R6",
    value: "VCC LED & +3.3INTRN Pull-Ups",
    title: "Motor Bus Power Indicator & Open-Drain Fault Line",
    description:
      "Green 0603 LED D1 with 1 kΩ resistor R3 sits directly across VCC → GND to verify live motor-bus power at a glance. Open-drain nFAULT (U1 pin 18) has no LED and is pulled up to +3.3INTRN via 10 kΩ R6 alongside R1 (nRST) and R2 (nSLP), routing nFLT to U2 pad 10; scoping nFLT steady at 3.3 V proved U1 was not fault-latched.",
    specs: [
      "D1 + R3 (1 kΩ): VCC → GND live bus indicator",
      "R6 (10 kΩ): nFAULT pull-up to +3.3INTRN → U2 pad 10 (nFLT)",
    ],
  },
  R4: {
    ref: "R4 / R5",
    value: "10 mΩ (2010)",
    title: "Inline Phase Current Shunt Resistors (Phases A & C)",
    description:
      "Low-inductance 2010 metric (5025) 10 mΩ shunts placed directly in series with DRV8313 OUT1 and OUT3 to measure true bidirectional winding current continuously across the entire PWM cycle.",
    specs: [
      "Footprint: R_2010_5025Metric (0.5 W+ power SMD)",
      "Differential sense traces routed to U3 (Phase A) and U4 (Phase C)",
    ],
  },
  U3: {
    ref: "U3",
    value: "INA240A2D (Phase A)",
    title: "Zero-Drift Inline Phase A Current Sense Amplifier",
    description:
      "Amplifies differential drop across inline shunt R4 with 50 V/V fixed gain and enhanced PWM common-mode rejection. Powered from external +3.3V (decoupled by 1 µF C5) with REF1 = +3.3V and REF2 = GND for a 1.65 V mid-scale zero-current output.",
    specs: [
      "Gain: 50 V/V bidirectional · 1.65 V mid-supply bias",
      "Analog output CA_out routed to 2-pin ADC header J1 (pin 2)",
    ],
  },
  U4: {
    ref: "U4",
    value: "INA240A2D (Phase C)",
    title: "Zero-Drift Inline Phase C Current Sense Amplifier",
    description:
      "Matched second inline channel across shunt R5 on phase C, decoupled by 1 µF C6 on external +3.3V. Because star-connected stator currents sum to zero (Ia + Ib + Ic = 0), firmware reconstructs phase B current algebraically without a third shunt.",
    specs: [
      "Gain: 50 V/V bidirectional · 1.65 V mid-supply bias",
      "Analog output CC_out routed to 2-pin ADC header J1 (pin 1)",
    ],
  },
  J3: {
    ref: "J3 + J1 / J2",
    value: "TB001-500-03BE + J1/J2",
    title: "3-Phase Motor Output, VCC Input & Analog Sense Headers",
    description:
      "5.0 mm-pitch 3-pole terminal block J3 delivers phases A, B, and C to the BLDC stator; 2-pole terminal J2 (TB002V-500-02BE) receives 8–60 V VCC; 2-pin header J1 exports analog CC_out (pin 1) and CA_out (pin 2) to the MCU ADCs.",
    specs: [
      "J3: 3-pole 5 mm motor phases · J2: 2-pole 5 mm VCC input",
      "J1: 2-pin analog current-sense output (pin 1 CC_out, pin 2 CA_out)",
    ],
  },
};

const NODE_LAYOUT = [
  { id: "U2", x: 24, y: 46, w: 144, h: 72, ref: "U2 · 2×5 Header", sub: "PWM · EN · nFLT · GND" },
  { id: "U1", x: 204, y: 36, w: 188, h: 92, ref: "U1 · DRV8313PWP", sub: "3-Ph Bridge (8–60 V)" },
  { id: "C1", x: 428, y: 46, w: 148, h: 72, ref: "C1–C6 · Bypass", sub: "100 µF VCC + +3.3V" },
  { id: "D1", x: 604, y: 46, w: 132, h: 72, ref: "D1 · R3 / R6", sub: "VCC LED & nFLT" },
  { id: "J3", x: 24, y: 166, w: 144, h: 72, ref: "J3 · Motor Out", sub: "Phases A·B·C + J2" },
  { id: "R4", x: 204, y: 166, w: 156, h: 72, ref: "R4 / R5 · 2010", sub: "10 mΩ Inline Shunts" },
  { id: "U3", x: 396, y: 166, w: 160, h: 72, ref: "U3 · INA240A2D", sub: "Phase A → J1 CA_out" },
  { id: "U4", x: 580, y: 166, w: 156, h: 72, ref: "U4 · INA240A2D", sub: "Phase C → J1 CC_out" },
];

export default function SchematicViewer() {
  const [selected, setSelected] = useState<string>("U1");
  const info = COMPONENT_INFO[selected] ?? COMPONENT_INFO.U1;

  return (
    <div className="inspector-card" aria-label="Interactive FOC_DV component explorer">
      <div className="inspector-toolbar">
        <span style={{ fontWeight: 500, color: "var(--ink)" }}>
          FOC_DV — Signal-Chain &amp; Bring-Up Component Explorer
        </span>
        <span style={{ color: "var(--muted)" }}>Select any stage for KiCad specs</span>
      </div>

      <div style={{ padding: "0.95rem" }}>
        <p className="scroll-hint">Scroll diagram horizontally →</p>
        <div className="diagram-scroll">
          <svg
            viewBox="0 0 760 264"
            style={{
              width: "100%",
              minWidth: "35rem",
              height: "auto",
              display: "block",
              background: "var(--paper)",
              border: "1px solid var(--line)",
              borderRadius: "3px",
            }}
            role="group"
            aria-label="FOC_DV functional block map"
          >
            <defs>
              {NODE_LAYOUT.map((n) => (
                <clipPath key={`clip-${n.id}`} id={`foc-clip-${n.id}`}>
                  <rect x={n.x + 6} y={n.y + 4} width={n.w - 12} height={n.h - 8} />
                </clipPath>
              ))}
            </defs>

            {/* Orthogonal signal & power interconnects */}
            <line x1="168" y1="82" x2="204" y2="82" stroke="currentColor" strokeOpacity={0.5} strokeWidth="2" />
            <line x1="392" y1="82" x2="428" y2="82" stroke="var(--chart-mos)" strokeWidth="2.2" />
            <line x1="576" y1="82" x2="604" y2="82" stroke="var(--chart-mos)" strokeWidth="2.2" />
            <path
              d="M 352 36 L 352 20 L 670 20 L 670 46"
              fill="none"
              stroke="var(--chart-limit-90)"
              strokeOpacity={0.75}
              strokeWidth="1.6"
              strokeDasharray="4,3"
            />
            <line x1="282" y1="128" x2="282" y2="166" stroke="var(--chart-wind)" strokeWidth="2.5" />
            <line x1="204" y1="202" x2="168" y2="202" stroke="var(--chart-wind)" strokeWidth="2.5" />
            <line x1="360" y1="202" x2="396" y2="202" stroke="var(--accent)" strokeWidth="2" />
            <path
              d="M 322 238 L 322 252 L 658 252 L 658 238"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="1.8"
              strokeDasharray="5,3"
            />

            {NODE_LAYOUT.map((n) => {
              const active = selected === n.id;
              return (
                <g
                  key={n.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={active}
                  aria-label={`${n.ref}: ${n.sub}`}
                  onClick={() => setSelected(n.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelected(n.id);
                    }
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <rect
                    x={n.x}
                    y={n.y}
                    width={n.w}
                    height={n.h}
                    rx={3}
                    fill={active ? "var(--accent-bg)" : "var(--surface)"}
                    stroke={active ? "var(--accent)" : "var(--border-control)"}
                    strokeWidth={active ? 2 : 1.2}
                  />
                  <g clipPath={`url(#foc-clip-${n.id})`}>
                    <text
                      x={n.x + 10}
                      y={n.y + 26}
                      fontSize="10.2"
                      fontWeight="600"
                      fontFamily="monospace"
                      fill="var(--accent)"
                    >
                      {n.ref}
                    </text>
                    <text
                      x={n.x + 10}
                      y={n.y + 47}
                      fontSize="9.6"
                      fontFamily="sans-serif"
                      fill="currentColor"
                      opacity={0.88}
                    >
                      {n.sub}
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
              gap: "0.35rem 0.75rem",
              fontFamily: "var(--font-mono-stack)",
              fontSize: "0.75rem",
            }}
          >
            <strong style={{ color: "var(--accent)" }}>{info.ref}</strong>
            <span style={{ color: "var(--muted)" }}>{info.value}</span>
          </div>
          <h3
            style={{
              margin: "0.25rem 0 0.35rem",
              fontFamily: "var(--font-mono-stack)",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "var(--ink)",
            }}
          >
            {info.title}
          </h3>
          <p style={{ margin: "0 0 0.5rem", fontSize: "0.85rem", color: "var(--ink-dim)", lineHeight: 1.56 }}>
            {info.description}
          </p>
          <ul style={{ margin: 0, paddingLeft: "1.15rem", fontSize: "0.8rem", color: "var(--muted)" }}>
            {info.specs.map((s) => (
              <li key={s} style={{ margin: "0.18rem 0" }}>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
