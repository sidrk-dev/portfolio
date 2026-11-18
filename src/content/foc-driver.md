## Board architecture & design goals

`FOC_DV` is a custom 3-phase brushless motor driver PCB designed in KiCad around the **Texas Instruments DRV8313PWP** ($8\text{--}60\ \mathrm{V}$, $2.5\ \mathrm{A}$ peak per phase, 28-pin `HTSSOP` thermally enhanced package) paired with two **TI INA240A2D** bidirectional zero-drift current-sense amplifiers ($50\ \mathrm{V/V}$ gain, enhanced PWM common-mode rejection) for closed-loop torque Field-Oriented Control (FOC).

Key hardware design choices on the schematic and 2-layer layout:

- **Two-phase inline shunt sensing (`R4, R5` in `2010` power packages):** Placed directly in series with `DRV8313` phases A (`OUT1`) and C (`OUT3`), feeding `U3` and `U4` (`INA240A2D`). Because star-connected stator currents satisfy $i_A + i_B + i_C = 0$, firmware reconstructs $i_B$ algebraically without a third amplifier, routing `CC_out` (pin 1) and `CA_out` (pin 2) to 2-pin ADC header `J1`.
- **Internal vs. external $3.3\ \mathrm{V}$ rail separation (`+3.3INTRN` vs. `+3.3V`):** `DRV8313`'s internal $3.3\ \mathrm{V}$ regulator output (`V3P3`, pin 15) is decoupled locally on net `+3.3INTRN` via `C4` ($470\ \mathrm{nF}$) and dedicated to `DRV8313`'s local $10\ \mathrm{k}\Omega$ logic pull-ups (`R1` on `nRST`, `R2` on `nSLP`, and `R6` on `nFLT`), keeping gate-driver internal logic off the external MCU `+3.3V` rail that powers `U3`/`U4` (`C5, C6` = $1\ \mu\mathrm{F}$) so ADC mid-supply reference noise stays minimal.
- **Power, charge-pump & interface headers:** `J2` (`TB002V-500-02BE`) brings in `VCC` with $100\ \mu\mathrm{F}$ bulk electrolytic `C1` and `VCC` rail indicator `D1` + `R3` ($1\ \mathrm{k}\Omega$), while $100\ \mathrm{nF}$ `0603` ceramics `C2` (`VCP–VCC` reservoir) and `C3` (`CPL–CPH` flying capacitor) support `U1`'s high-side gate charge pump; `J3` (`TB001-500-03BE`) outputs phases A/B/C; and `2×5` header `U2` carries `+3.3V, IN1–3, nRST, nSLP, En` (via $10\ \mathrm{k}\Omega$ `R7`), `nFLT`, and `GND` to the external STM32 controller.

## Bring-up debugging: isolating a silent zero-current power stage

Initial six-step commutation from an external STM32 produced **zero rotor movement and $0.00\ \mathrm{A}$ supply draw** despite motor-bus power LED `D1` illuminating normally. Rather than guessing, I isolated each domain layer-by-layer on an oscilloscope:

### 1. Firmware & STM32 timer verification

STM32 advanced timers require explicit channel/pin muxing inside `SimpleFOC`. To rule out a timer abstraction bug, I flashed a minimal bare-metal C++ test driving a $490\ \mathrm{Hz}$, $50\%$ duty-cycle square wave directly on the three PWM pins. **Oscilloscope result:** three clean $5.0\ \mathrm{V}$ logic square waves leaving the STM32, clearing firmware.

### 2. Power stage & open-drain fault check

With PWM active on `U2`, I probed `DRV8313` phase outputs (`OUT1/2/3`) and open-drain `nFAULT` (`U1` pin 18, pulled up to `+3.3INTRN` via `R6`). **Oscilloscope result:** `nFAULT` sat cleanly at logic HIGH (confirming no undervoltage lockout, overcurrent latch, or thermal shutdown), yet all three motor phases sat flat at $0\ \mathrm{V}$ in High-Impedance (`Hi-Z`).

### 3. Control-input probing & datasheet root cause

Moving the probe to `DRV8313`'s `EN` pins (`EN1–3`) revealed an anomalous **$3.6\ \mathrm{V}$ floating DC level** instead of $0\ \mathrm{V}$ or $5.0\ \mathrm{V}$. Cross-referencing TI's `DRV8313` internal block diagram and Table 1 truth table pinpointed the mechanism:

- **Missing cross-domain ground return:** Without a unified $0\ \mathrm{V}$ ground bond between the external $5\ \mathrm{V}$/STM32 bench setup and `FOC_DV`'s `GND` plane, logic signals on `U2` had no return path. `EN` floated toward the chip's internal $3.3\ \mathrm{V}$ LDO rail (`V3P3` / `+3.3INTRN`) plus a parasitic ESD/input offset ($\approx 3.6\ \mathrm{V}$), failing to register valid logic transitions and locking all half-bridges in `Hi-Z`.
- **Resolution & inline current validation:** Establishing a solid common $0\ \mathrm{V}$ reference and matching `EN` logic thresholds exited `Hi-Z` immediately. Subsequent scope captures on `J1` (`CA_out`, `CC_out`) verified clean sinusoidal/trapezoidal phase-current envelopes through `INA240A2D` (`50 V/V`) with zero mid-PWM common-mode saturation.
