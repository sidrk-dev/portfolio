"use client";

import { useMemo, useState } from "react";

// Exact first-order fit parameters from torque_thermal_ramp_20261117-190555.analysis.json
const A_MOS = 0.0021432559;
const B_MOS = 0.0019593179; // tau = 510.38 s, rise = 1.0939 C/Nm^2
const A_WIND = 0.0034112189;
const B_WIND = 0.0039661091; // tau = 252.14 s, rise = 0.8601 C/Nm^2

const RATIO_PRESETS = [
  { ratio: 5.0, label: "5.00:1 (Ø113.3 mm)", safetyAt90: "3.1×" },
  { ratio: 5.3, label: "5.30:1 (Ø120.0 mm)", safetyAt90: "3.3×" },
  { ratio: 6.0, label: "6.00:1 (Ø136.0 mm · Selected)", safetyAt90: "3.7×" },
];

function simulateBenchRamp() {
  // Exact Nov 17 stepped schedule: 8 Nm (120s), 9 Nm (120s), 10 Nm (120s), 11 Nm (16.8s), 0 Nm cooldown (304.8s)
  const dt = 2;
  const totalS = 680;
  let tMos = 30.0;
  let tWind = 28.0;
  const pts: { t: number; mos: number; wind: number; cmd: number }[] = [];

  for (let t = 0; t <= totalS; t += dt) {
    let cmd = 0;
    if (t < 120) cmd = 8.0;
    else if (t < 240) cmd = 9.0;
    else if (t < 360) cmd = 10.0;
    else if (t < 377) cmd = 11.0;
    else cmd = 0.0;

    pts.push({ t, mos: tMos, wind: tWind, cmd });

    tMos += (A_MOS * cmd * cmd - B_MOS * (tMos - 30.0)) * dt;
    tWind += (A_WIND * cmd * cmd - B_WIND * (tWind - 28.0)) * dt;
  }
  return pts;
}

function simulateContinuousHold(motorTorqueNm: number, ambientC = 25) {
  const dt = 10;
  const totalS = 1800; // 30-minute plotted horizon
  let tMos = ambientC;
  let tWind = ambientC;
  const pts: { t: number; mos: number; wind: number }[] = [];

  for (let t = 0; t <= totalS; t += dt) {
    pts.push({ t, mos: tMos, wind: tWind });
    tMos += (A_MOS * motorTorqueNm * motorTorqueNm - B_MOS * (tMos - ambientC)) * dt;
    tWind += (A_WIND * motorTorqueNm * motorTorqueNm - B_WIND * (tWind - ambientC)) * dt;
  }

  const mosSteady = ambientC + (A_MOS / B_MOS) * motorTorqueNm * motorTorqueNm;
  const windSteady = ambientC + (A_WIND / B_WIND) * motorTorqueNm * motorTorqueNm;

  // Exact analytical first-order crossing times (valid even when > 30 min plot window)
  const tripTimeS =
    mosSteady > 90.05
      ? -Math.log(1 - (90.0 - ambientC) / (mosSteady - ambientC)) / B_MOS
      : null;
  const budget80TimeS =
    mosSteady > 80.05
      ? -Math.log(1 - (80.0 - ambientC) / (mosSteady - ambientC)) / B_MOS
      : null;

  return { pts, mosSteady, windSteady, tripTimeS, budget80TimeS };
}

export function Im6014ThermalExplorer() {
  const [mode, setMode] = useState<"capstan" | "bench">("capstan");
  const [ratio, setRatio] = useState<number>(6.0);
  const [shoulderLoadNm, setShoulderLoadNm] = useState<number>(43);

  const benchPts = useMemo(() => simulateBenchRamp(), []);
  const motorHoldNm = shoulderLoadNm / ratio;
  const phaseCurrentA = motorHoldNm * 1.265; // ~1.265 A_phase / Nm from bench telemetry
  const holdSim = useMemo(() => simulateContinuousHold(motorHoldNm, 25), [motorHoldNm]);

  // SVG plot geometry
  const W = 720;
  const H = 264;
  const PAD = { l: 46, r: 20, t: 18, b: 34 };
  const plotW = W - PAD.l - PAD.r;
  const plotH = H - PAD.t - PAD.b;

  const maxTime = mode === "bench" ? 680 : 1800;
  const minTemp = 20;
  const maxTemp = 135;

  const xOf = (t: number) => PAD.l + (t / maxTime) * plotW;
  const yOf = (temp: number) =>
    PAD.t + plotH - ((Math.min(maxTemp, Math.max(minTemp, temp)) - minTemp) / (maxTemp - minTemp)) * plotH;

  const activePts = mode === "bench" ? benchPts : holdSim.pts;
  const mosPath = activePts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${xOf(p.t).toFixed(1)} ${yOf(p.mos).toFixed(1)}`)
    .join(" ");
  const windPath = activePts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${xOf(p.t).toFixed(1)} ${yOf(p.wind).toFixed(1)}`)
    .join(" ");

  const isOverBudget = holdSim.mosSteady > 82.0;

  return (
    <div className="inspector-card" aria-label="Interactive IM6014 thermal and capstan sizing explorer">
      <div className="inspector-toolbar">
        <span style={{ fontWeight: 500, color: "var(--ink)" }}>
          IM6014 Thermal Model &amp; Capstan Ratio Explorer
        </span>
        <div role="group" aria-label="Thermal explorer mode" style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
          <button
            type="button"
            className="chrome-btn"
            aria-pressed={mode === "capstan"}
            style={{
              borderColor: mode === "capstan" ? "var(--accent)" : undefined,
              background: mode === "capstan" ? "var(--accent-bg)" : undefined,
              color: mode === "capstan" ? "var(--ink)" : undefined,
            }}
            onClick={() => setMode("capstan")}
          >
            Capstan hold simulator
          </button>
          <button
            type="button"
            className="chrome-btn"
            aria-pressed={mode === "bench"}
            style={{
              borderColor: mode === "bench" ? "var(--accent)" : undefined,
              background: mode === "bench" ? "var(--accent-bg)" : undefined,
              color: mode === "bench" ? "var(--ink)" : undefined,
            }}
            onClick={() => setMode("bench")}
          >
            Nov 17 bench ramp (2,679 samples)
          </button>
        </div>
      </div>

      <div style={{ padding: "0.95rem" }}>
        {mode === "capstan" ? (
          <div style={{ display: "grid", gap: "0.85rem", marginBottom: "0.85rem" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", alignItems: "center" }}>
              <span style={{ fontFamily: "var(--font-mono-stack)", fontSize: "0.75rem", color: "var(--muted)" }}>
                Shoulder ratio:
              </span>
              {RATIO_PRESETS.map((preset) => (
                <button
                  key={preset.ratio}
                  type="button"
                  className="chrome-btn"
                  aria-pressed={ratio === preset.ratio}
                  style={{
                    borderColor: ratio === preset.ratio ? "var(--accent)" : undefined,
                    background: ratio === preset.ratio ? "var(--accent-bg)" : undefined,
                    color: ratio === preset.ratio ? "var(--ink)" : undefined,
                  }}
                  onClick={() => setRatio(preset.ratio)}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.75rem" }}>
              <label
                htmlFor="shoulder-load-slider"
                style={{ fontFamily: "var(--font-mono-stack)", fontSize: "0.75rem", color: "var(--muted)" }}
              >
                Horizontal shoulder gravity torque: <strong style={{ color: "var(--ink)" }}>{shoulderLoadNm} Nm</strong>{" "}
                (43 Nm = 3.0 kg @ 800 mm)
              </label>
              <input
                id="shoulder-load-slider"
                type="range"
                min={25}
                max={60}
                step={1}
                value={shoulderLoadNm}
                onChange={(e) => setShoulderLoadNm(Number(e.target.value))}
                style={{ flex: "1 1 10rem", maxWidth: "16rem" }}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(9.5rem, 1fr))",
                gap: "0.6rem",
                padding: "0.65rem 0.75rem",
                background: "var(--paper)",
                border: "1px solid var(--line)",
                borderRadius: "3px",
                fontFamily: "var(--font-mono-stack)",
                fontSize: "0.75rem",
              }}
            >
              <div>
                <span style={{ color: "var(--muted)", display: "block" }}>IM6014 motor torque</span>
                <strong style={{ color: "var(--ink)" }}>
                  {motorHoldNm.toFixed(2)} Nm ({phaseCurrentA.toFixed(1)} A ph)
                </strong>
              </div>
              <div>
                <span style={{ color: "var(--muted)", display: "block" }}>MOSFET steady T∞</span>
                <strong style={{ color: isOverBudget ? "var(--warn)" : "var(--accent)" }}>
                  {holdSim.mosSteady.toFixed(1)} °C (90 °C trip)
                </strong>
              </div>
              <div>
                <span style={{ color: "var(--muted)", display: "block" }}>Winding steady T∞</span>
                <strong style={{ color: "var(--ink)" }}>{holdSim.windSteady.toFixed(1)} °C (130 °C trip)</strong>
              </div>
              <div>
                <span style={{ color: "var(--muted)", display: "block" }}>Thermal verdict (@ 25 °C amb)</span>
                <strong style={{ color: isOverBudget ? "var(--warn)" : "var(--accent)" }}>
                  {holdSim.tripTimeS !== null
                    ? `Trips 90 °C @ ${(holdSim.tripTimeS / 60).toFixed(1)} min`
                    : isOverBudget
                      ? `Exceeds 80 °C @ ${((holdSim.budget80TimeS ?? 0) / 60).toFixed(1)} min`
                      : holdSim.mosSteady <= 80.05
                        ? "Continuous (<80 °C ceiling)"
                        : `Steady ${holdSim.mosSteady.toFixed(1)} °C (${(90 - holdSim.mosSteady).toFixed(1)} °C margin)`}
                </strong>
              </div>
            </div>
          </div>
        ) : (
          <p
            style={{
              margin: "0 0 0.75rem",
              fontSize: "0.8125rem",
              color: "var(--ink-dim)",
              lineHeight: 1.55,
            }}
          >
            Measured Nov 17, 2026 stepped stall ramp on Motor ID 1 (36.0 V bus, 6 Mbps U2D2): 120 s each at 8.0, 9.0,
            and 10.0 Nm, followed by 16.8 s at 11.0 Nm where driver MOSFETs reached the 80 °C test ceiling while stator
            windings sat 41 °C below their 130 °C trip.
          </p>
        )}

        <p className="scroll-hint">Scroll plot horizontally →</p>
        <div className="diagram-scroll">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            style={{
              width: "100%",
              minWidth: "36rem",
              height: "auto",
              display: "block",
              background: "var(--paper)",
              border: "1px solid var(--line)",
              borderRadius: "3px",
            }}
            role="img"
            aria-label={
              mode === "capstan"
                ? `Simulated 30-minute MOSFET and stator temperature curves for ${ratio}:1 capstan at ${shoulderLoadNm} Nm`
                : "Stepped 8 to 11 Nm locked-rotor thermal ramp curves"
            }
          >
            {/* Horizontal reference lines */}
            {[40, 60, 80, 90, 110, 130].map((temp) => {
              const y = yOf(temp);
              const isLimit = temp === 80 || temp === 90 || temp === 130;
              return (
                <g key={temp}>
                  <line
                    x1={PAD.l}
                    y1={y}
                    x2={W - PAD.r}
                    y2={y}
                    stroke={
                      temp === 90
                        ? "var(--chart-limit-90)"
                        : temp === 80
                          ? "var(--chart-limit-80)"
                          : "currentColor"
                    }
                    strokeOpacity={isLimit ? 0.65 : 0.14}
                    strokeDasharray={isLimit ? "4,3" : undefined}
                  />
                  <text
                    x={PAD.l - 6}
                    y={y + 3.5}
                    textAnchor="end"
                    fontSize="10"
                    fontFamily="monospace"
                    fill="currentColor"
                    opacity={0.78}
                  >
                    {temp}°
                  </text>
                </g>
              );
            })}

            {/* Bench step dividers */}
            {mode === "bench" && (
              <>
                {[
                  { t: 0, label: "8 Nm", yOff: H - PAD.b - 6, align: "start" as const, dx: 4 },
                  { t: 120, label: "9 Nm", yOff: H - PAD.b - 6, align: "start" as const, dx: 4 },
                  { t: 240, label: "10 Nm", yOff: H - PAD.b - 6, align: "start" as const, dx: 4 },
                  { t: 360, label: "11 Nm (16.8s)", yOff: PAD.t + 26, align: "end" as const, dx: -4 },
                  { t: 377, label: "0 Nm cooldown", yOff: H - PAD.b - 6, align: "start" as const, dx: 6 },
                ].map((s) => (
                  <g key={s.t}>
                    <line
                      x1={xOf(s.t)}
                      y1={PAD.t}
                      x2={xOf(s.t)}
                      y2={H - PAD.b}
                      stroke="currentColor"
                      strokeOpacity={0.22}
                    />
                    <text
                      x={xOf(s.t) + s.dx}
                      y={s.yOff}
                      textAnchor={s.align}
                      fontSize="9.5"
                      fontFamily="monospace"
                      fill="currentColor"
                      opacity={0.78}
                      paintOrder="stroke"
                      stroke="var(--paper)"
                      strokeWidth="3.5"
                      strokeLinejoin="round"
                    >
                      {s.label}
                    </text>
                  </g>
                ))}
              </>
            )}

            {/* Curves (differentiated by both hue and stroke dash pattern per WCAG 1.4.1) */}
            <path
              d={windPath}
              fill="none"
              stroke="var(--chart-wind)"
              strokeWidth="2.2"
              strokeDasharray="7,4"
            />
            <path d={mosPath} fill="none" stroke="var(--chart-mos)" strokeWidth="2.5" />

            {/* Threshold labels rendered on top with clean paper halo */}
            <text
              x={W - PAD.r - 4}
              y={yOf(90) - 5}
              textAnchor="end"
              fontSize="9.5"
              fontWeight="600"
              fontFamily="monospace"
              fill="var(--chart-limit-90)"
              paintOrder="stroke"
              stroke="var(--paper)"
              strokeWidth="3.5"
              strokeLinejoin="round"
            >
              90 °C MOSFET firmware trip
            </text>
            <text
              x={PAD.l + 6}
              y={yOf(80) - 5}
              textAnchor="start"
              fontSize="9.5"
              fontWeight="600"
              fontFamily="monospace"
              fill="var(--chart-limit-80)"
              paintOrder="stroke"
              stroke="var(--paper)"
              strokeWidth="3.5"
              strokeLinejoin="round"
            >
              80 °C continuous ceiling (7.09 Nm)
            </text>
            <text
              x={W - PAD.r - 4}
              y={yOf(130) + 12}
              textAnchor="end"
              fontSize="9.5"
              fontFamily="monospace"
              fill="currentColor"
              opacity={0.78}
              paintOrder="stroke"
              stroke="var(--paper)"
              strokeWidth="3.5"
              strokeLinejoin="round"
            >
              130 °C winding trip
            </text>

            {/* X-axis ticks */}
            {(mode === "bench" ? [0, 120, 240, 360, 480, 600, 680] : [0, 300, 600, 900, 1200, 1500, 1800]).map(
              (tVal) => (
                <text
                  key={tVal}
                  x={xOf(tVal)}
                  y={H - 10}
                  textAnchor="middle"
                  fontSize="10"
                  fontFamily="monospace"
                  fill="currentColor"
                  opacity={0.78}
                >
                  {mode === "bench" ? `${tVal}s` : `${tVal / 60}m`}
                </text>
              )
            )}
          </svg>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            marginTop: "0.55rem",
            fontFamily: "var(--font-mono-stack)",
            fontSize: "0.72rem",
            color: "var(--ink-dim)",
          }}
        >
          <span>
            <span style={{ color: "var(--chart-mos)", fontWeight: 700 }} aria-hidden="true">
              ━━
            </span>{" "}
            Driver MOSFETs (solid · 1.094 °C/Nm², τ = 510.4 s)
          </span>
          <span>
            <span style={{ color: "var(--chart-wind)", fontWeight: 700 }} aria-hidden="true">
              ╌╌
            </span>{" "}
            Stator Winding (dashed · 0.860 °C/Nm², τ = 252.1 s)
          </span>
        </div>
      </div>
    </div>
  );
}
