## Engineering motivation & system constraints

Decelerating or backdriving a multi-DOF quasi-direct-drive robot arm converts kinetic and gravitational potential energy directly into reverse current on the DC supply bus. Bench switching power supplies ($36\ \mathrm{V} / 27\ \mathrm{A}$ or $48\ \mathrm{V}$) have unidirectional output stages: reverse current charges bus capacitance until either the PSU trips overvoltage protection (dropping holding torque across the entire arm) or motor drivers suffer avalanche breakdown.

On our 7-motor manipulator, **Unitree IM6014** arm actuators tolerate up to $75\ \mathrm{V}$, whereas the **mjbots moteus r4.11** gripper controller on the same $36.0\ \mathrm{V}$ bus has a hard **$44.0\ \mathrm{V}$ absolute maximum rating** — leaving an **$8.0\ \mathrm{V}$ clamping window** under multi-axis braking. Simultaneously, hot-plugging $1,880\ \mu\mathrm{F}$ of onboard bulk capacitance plus $600\text{--}2,000\ \mu\mathrm{F}$ of distributed motor capacitance draws $>250\ \mathrm{A}$ ideal inrush spikes.

Commercial off-the-shelf boards solve only half the problem: the ODrive Regen Clamp (\$89) has a $50\ \mathrm{W}$ onboard resistor with no precharge or multi-branch distribution, while the mjbots `mjpower-ss` provides soft-start switching with no regenerative chopper. **`regen-clamp-board` (Rev F)** integrates **ideal-diode reverse blocking + linear-SOA `dV/dt` soft start + supply-tracking hysteretic brake chopping + 5-branch XT30 distribution** on a single $125 \times 100\ \mathrm{mm}$ 2-layer PCB (~\$65.38 for 5 bare boards + 2 factory SMT assemblies).

> **Hardware status note:** Rev F is a fab-ready, unbuilt design. All electrical, SOA, copper-resistance, and thermal figures below are derived from post-layout `ngspice` 47 transient simulations, 128-corner tolerance stacks, and a 2D finite-difference copper-thermal solver prior to bench bring-up.

## Power stage architecture

### 1. Ideal diode & linear-SOA precharge (`VIN → MID → VOUT`)

An automotive **TI `LM74800QDRRRQ1`** (`U1`, $65\ \mathrm{V}$ operating / $70\ \mathrm{V}$ abs max) drives two back-to-back parallel pairs of **`CRSS042N10N`** ($100\ \mathrm{V}$, $120\ \mathrm{A}$, $4.2\ \mathrm{m}\Omega$ max `TO-263`) MOSFETs:

- **Reverse-blocking ideal diode (`Q1 ‖ Q7`):** Driven by `DGATE`, regulating a $10.5\ \mathrm{mV}$ forward drop at light load, fully enhancing above $\sim 5\ \mathrm{A}$, and snapping off in $<1\ \mu\mathrm{s}$ at $-4.5\ \mathrm{mV}$ reverse drop when arm deceleration pushes VOUT above VIN — isolating the bench PSU from reverse current ($<24\ \mu\mathrm{C}$ reverse recovery charge in conservative SPICE).
- **Controlled `dV/dt` soft-start (`Q2 ‖ Q8`):** `U1`'s `HGATE` constant-current source ($55\ \mu\mathrm{A}$ typ) charges a $400\ \mathrm{nF}$ $100\ \mathrm{V}$ `X7R` ramp bank (`C4, C5, C13, C14`) through $1\ \mathrm{k}\Omega$ (`R5`), slewing the output bus linearly at **$\sim 140\ \mathrm{V/s}$** ($0 \rightarrow 36\ \mathrm{V}$ in $0.26\ \mathrm{s}$; $0 \rightarrow 48\ \mathrm{V}$ in $0.35\ \mathrm{s}$):

$$
I_{\mathrm{inrush}} = C_{\mathrm{bus}}\,\frac{dV_{\mathrm{out}}}{dt} \approx 2.48\ \mathrm{mF} \times 140\ \mathrm{V/s} \approx 0.35\ \mathrm{A}
$$

Even under worst-case parallel threshold mismatch ($\Delta V_{\mathrm{th}} = 0.4\ \mathrm{V}$, where the lower-$V_{\mathrm{th}}$ MOSFET carries $100\%$ of linear-ramp current), simulated peak linear dissipation is **$12\ \mathrm{W}$ / $1.6\ \mathrm{J}$ at $36\ \mathrm{V}$** ($22\ \mathrm{W}$ / $3.9\ \mathrm{J}$ at $48\ \mathrm{V}$ with load), sitting roughly **$10\times$ inside the `CRSS042N10N` DC Safe Operating Area** ($4.8\ \mathrm{A}$ @ $48\ \mathrm{V}$). Individual $10\ \Omega$ gate stoppers (`R30–R33`) suppress parallel linear-mode oscillation, while `D11` (`BZT52C12`) clamps `HGATE − VOUT` during output short faults.

### 2. Self-powered `VOUT`-derived `11.6 V` control rail

Rather than powering the brake comparator from `VIN`, the $11.6\ \mathrm{V}$ `VREG` rail (`U2` `CJ431` + SOT-223 `Q4` `BCP56-16` emitter follower + `D10` reverse-$V_{\mathrm{BE}}$ diode + `D12` $16\ \mathrm{V}$ Zener backup) draws power from **`VOUT`**. **If the bench supply trips off, is switched off via `SW1`, or is unplugged while a heavy arm is backdriven by gravity, the regenerated voltage on `VOUT` self-powers the brake chopper automatically.**

### 3. Supply-tracking 0.1% hysteretic chopper & `DGATE` latch-off interlock

Comparator `U3A` (`LM393`) compares scaled motor-bus voltage `SENSE_P` against scaled input supply voltage `SENSE_N` plus an adjustable offset from `RV1` (`3362P` trimmer), so the board tracks any $24\text{--}48\ \mathrm{V}$ supply without re-strapping resistors:

$$
\Delta V_{\mathrm{trip}} = V_{\mathrm{OUT,trip}} - V_{\mathrm{IN}} \approx 0.667\,V(\mathrm{TP9}) - 0.14\ \mathrm{V}, \qquad V_{\mathrm{release}} \approx V_{\mathrm{trip}} - 2.3\ \mathrm{V}
$$

- **0.1% thin-film tolerance stack:** Replacing $1\%$ thick-film dividers with **$0.1\%$ $75\ \mathrm{V}$ Yageo `RT0603B`** thin-film resistors (`R10, R11, R14, R15`) collapsed the 128-corner worst-case trip spread at $48\ \mathrm{V}$ from **$3.5\ \mathrm{V}$ down to $0.6\ \mathrm{V}$**, ensuring `VOUT` stays safely below both the `moteus` $44\ \mathrm{V}$ limit (at $36\ \mathrm{V}$ bus) and the `SMCJ51A` TVS $56.7\ \mathrm{V}$ minimum breakdown (at $48\ \mathrm{V}$ bus).
- **22 ns gate drive & freewheel clamping:** Dedicated $4\ \mathrm{A}$ driver `U4` (`TI UCC27517`) switches paralleled `Q3 ‖ Q9` (`CRSS042N10N`) in $22\ \mathrm{ns}$ into an external $2\ \Omega\ / \ 200\ \mathrm{W}$ chassis resistor on `J5` (`XT60PW-F`). Dual $100\ \mathrm{V}$ `SS210` Schottky diodes (`D4, D7`) clamp $1\text{--}10\ \mu\mathrm{H}$ resistor lead inductance to $+6\ \mathrm{V}$ overshoot ($46.1\ \mathrm{V}$ drain peak @ $36\ \mathrm{V}$).
- **Hardware `DGATE` PSU latch-on interlock (`Q10` + `Q11`):** Early corner simulations (`sim_brake_latch_48v.cir`) uncovered a catastrophic failure mode: at minimum trim ($+3.0\ \mathrm{V}$) with $1\%$ tolerances, $V_{\mathrm{release}}$ could dip below $V_{\mathrm{IN}}$, causing the chopper to latch ON across the bench PSU and dump **$24\ \mathrm{A}$ ($1.15\ \mathrm{kW}$) continuously**! Adding PNP/NPN sense stage `Q10/Q11` on `DGATE` pulls `CMP_OUT` low whenever the ideal diode conducts forward current (`DGATE > VIN`), making forward PSU latch-on physically impossible.
- **Dual-tier resistor fault protection:** `J11` wires a resettable $70\text{--}90\ ^\circ\mathrm{C}$ `KSD9700` thermal switch into the comparator pull-up (lighting `THERM OPEN` LED `D9`), while an off-board **TÜV-certified $25\ \mathrm{A} / 120\ \mathrm{V\ DC}$ `SETfuse Q136` ($136\ ^\circ\mathrm{C}$) alloy thermal cutoff** wired inline with the brake resistor clears a drain-source shorted brake MOSFET ($648\ \mathrm{W}$ @ $36\ \mathrm{V}$ / $922\ \mathrm{W}$ @ $48\ \mathrm{V}$).

## 2D copper-thermal verification & pre-fab bug postmortem

To evaluate whether $2\ \mathrm{oz}$ copper (+\$37.30 fab surcharge) was actually needed over $1\ \mathrm{oz}$ copper, I wrote `copper_check.py` to rasterize `F.Cu`, `B.Cu`, plated slots, and via arrays onto a $0.2\ \mathrm{mm}$ finite-difference grid:

- **End-to-end DC bus resistance (1 oz / $35\ \mu\mathrm{m}$ Cu):** $3.13\ \mathrm{m}\Omega$ total (`VIN` $0.64\ \mathrm{m}\Omega$ + `MID` $0.16\ \mathrm{m}\Omega$ + `VOUT` $1.15\ \mathrm{m}\Omega$ + `GND` $1.18\ \mathrm{m}\Omega$), dissipating **$2.28\ \mathrm{W}$ in copper** + **$4.90\ \mathrm{W}$ across the four series MOSFETs** at $27\ \mathrm{A}$ continuous.
- **Thermal equilibrium ($10\ \mathrm{W/m^2K}$ natural convection per face):** $+66\ \mathrm{K}$ peak hotspot (`Q1` tab) and $+29\ \mathrm{K}$ board mean in $1\ \mathrm{oz}$ Cu — cutting bare-PCB cost by **$78\%$** (\$47.40 → \$10.10).

Across Revisions B through F, I also built a **fail-closed verification suite** (`gate.py` with $50\ \mathrm{mm}$ track-width canary DRC injection, `check_netlist.py` across all 261 IPC-2581 pins, `check_parts.py` blind datasheet pin ledger across 121 terminals, `check_cpl.py` pick-and-place rotation verifier, and `bus_clearance_check.py`) that caught **six real hardware killers that had passed standard KiCad ERC/DRC**:

| Revision | Silent Defect Missed by Default ERC/DRC | Verification Tool & Hardware Fix |
|---|---|---|
| **Rev B → C** | $48\ \mathrm{V}$ min-trim hysteresis release below `VIN` latches $1.15\ \mathrm{kW}$ from PSU | `sim_brake_latch_48v.cir` → Added `Q10/Q11` `DGATE` forward-conduction interlock |
| **Rev C → D** | Malformed `.kicad_dru` silently returned `0 violations`; 51 traces $<0.16\ \mathrm{mm}$ | `gate.py` canary rule injection → Enforced $0.16\ \mathrm{mm}$ rules across all signal nets |
| **Rev D → E** | `U2` (`CJ431`) wired as standard `TL431` instead of mirrored SOT-23 `1=REF,2=K,3=A` | `check_parts.py` blind datasheet ledger → Corrected SOT-23 pin mapping |
| **Rev D → E** | `U4` (`UCC27517`) & `Q4` (`BCP56-16`) rotated $180^\circ$ in JLCPCB CPL export | `check_cpl.py` LCSC footprint check → Fixed CPL rotation offsets |
| **Rev D → E** | SOT-23 `Q4` hit $T_j = 157\ ^\circ\mathrm{C}$ at $48\ \mathrm{V}$; `C13` tucked under `Q9` tab; XT60 drills $-0.2\ \mathrm{mm}$ | Thermal/courtyard audit → SOT-223 `BCP56-16`, relocated `C13`, $3.0\ \mathrm{mm}$ plated XT60 slots |
| **Rev E → F** | 29 uncoated $>50\ \mathrm{V}$ pads had $0.40\ \mathrm{mm}$ clearance (IPC-2221B requires $0.50\ \mathrm{mm}$) | `bus_clearance_check.py` → Per-pad clearances + 4 local keepouts preserving `U4` GND web |
