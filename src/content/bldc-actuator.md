## Characterization architecture

Before scaling up to multi-DOF QDD arms, I built a closed-loop actuator characterization test stand around the **mjbots moteus r4.11** ($10\text{--}44\ \mathrm{V}$ input, $100\ \mathrm{A}$ peak, $32\ \mathrm{kHz}$ PWM, CAN-FD) and **AS5047P** 14-bit SPI magnetic encoder to characterize two distinct brushless actuator classes from first principles:

1. **Direct-drive $400\ \mathrm{W}$ 30-pole-pair hub motor:** Low-speed, zero-gearbox torque physics, multi-sensor NTC winding telemetry fusion, $100\ \mathrm{Hz}$ haptic detent control, and permanent NdFeB magnet demagnetization forensics.
2. **Geared $1:8$ planetary QDD actuator (`Steadywin GWK8108-8`, 21 pole pairs):** Overcoming planetary breakaway stiction during calibration, diagnosing high-speed encoder-PLL phase-lag Overvoltage Fault 34, backlash preloading, and $200\ \mathrm{Hz}$ cosine gravity compensation.

## Part 1: 30-pole-pair direct-drive characterization & NdFeB demagnetization

### First-principles electrical calibration

With no vendor datasheet, automated locked-rotor DC injection, AC inductance sweeps, and open-loop back-EMF runs extracted exact phase parameters and auto-tuned the $200\ \mathrm{Hz}$ $dq$-axis current controller:

| Parameter | Measured Value | Engineering Significance |
|---|---|---|
| Pole pairs | $30$ (64-entry LUT) | $30\times$ electrical commutation rate per mechanical rev |
| Phase resistance ($R_{\phi}$) | **$0.265\ \Omega$** | Sets $I^2R$ copper loss ceiling under sustained stall |
| Phase inductance ($L_{\phi}$) | **$387\ \mu\mathrm{H}$** | Auto-tunes current PI gains ($K_p = 0.487,\ K_i = 333.07$) |
| Velocity constant ($K_V$) | **$24.18\ \mathrm{RPM/V}$** | Sets torque constant $K_t = 60 / (2\pi K_V) \approx 0.395\ \mathrm{Nm/A}$ |
| Encoder observer PLL | $200\ \mathrm{Hz}$ ($K_p = 1013,\ K_i = 256\mathrm{k}$) | Suppresses quantization noise without commutation lag |

### Async 50 Hz CAN-FD test stand & non-blocking thermal fusion

Locked-rotor tests bypassed the position loop (`kp_scale=0, kd_scale=0`) to command pure feedforward torque ($I_q = \tau / K_t$) from $0 \rightarrow 15\ \mathrm{Nm}$ behind three independent hardware aborts: rotor slip ($|\omega| > 1.0\ \mathrm{rev/s}$), controller MOSFET temperature ($>60\ ^\circ\mathrm{C}$), and external motor casing temperature ($>60\ ^\circ\mathrm{C}$). Because `moteus` only reports onboard PCB temperature while stator windings fail first under stall, a daemon producer-consumer thread streamed Arduino NTC thermistor readings into the $50\ \mathrm{Hz}$ `asyncio` CAN-FD loop with zero serial-blocking jitter.

On the same rig, I implemented a **$100\ \mathrm{Hz}$ virtual haptic detent controller** combining Hookean spring restoring torque, viscous damping, and Coulomb friction ($\tau = k\Delta\theta - b\dot{\theta} - \tau_c\operatorname{sgn}(\dot{\theta})$) — the exact inner torque-control primitive used in compliant collaborative arms.

### Root-cause analysis of a permanent 20% torque step-drop

Run #1 measured **$8.59\ \mathrm{Nm}$** peak locked-rotor torque, whereas every subsequent run plateaued at **$6.84\ \mathrm{Nm}$** ($-20.4\%$) even after overnight cooling to ambient:

- **Bus voltage sag:** Ruled out — stiff regulated bus held $35.00\ \mathrm{V}$ throughout.
- **Fixture slip / back-EMF:** Ruled out — velocity read $0.00\ \mathrm{rev/s}$ across the hold window.
- **Reversible copper $R(T)$ rise:** Ruled out — thermal resistance drift recovers upon cooling; this was an irreversible step change.

Run #2 had pushed outer casing temperature to $64\ ^\circ\mathrm{C}$, corresponding to an estimated $85\text{--}100\ ^\circ\mathrm{C}$ internal winding/rotor temperature. At elevated temperature, standard N-grade **NdFeB coercivity ($H_{cj}$)** drops sharply; combined with high $q$-axis armature reaction under $15\ \mathrm{Nm}$ stall command, the operating point crossed the B-H curve knee, permanently demagnetizing the rotor by $20\%$.

## Part 2: 1:8 planetary QDD (`GWK8108-8`), Fault 34 & 200 Hz gravity compensation

Extending the test stand to a 42-pole (21 pole-pair), $1:8$ planetary QDD actuator ($R = 0.15\ \Omega$, $L = 35\ \mu\mathrm{H}$, $K_V = 16.25\ \mathrm{rpm/V}$, $24.78\ \mathrm{Nm}$ stall @ $24\ \mathrm{V}$) surfaced two geared-actuator subtleties:

1. **Planetary stiction during commutation calibration:** Default current-mode encoder sweeps stalled against gearbox breakaway friction, corrupting the 64-point offset table. Forcing a $30\ \mathrm{W}$ voltage-mode sweep (`--cal-never-encoder-current-mode --cal-motor-power 30.0 --cal-ll-encoder-speed 0.5`) overcame stiction cleanly.
2. **Encoder-PLL phase lag causing Overvoltage Fault 34:** Lowering the encoder observer filter bandwidth below $200\ \mathrm{Hz}$ to quiet gear-tooth noise unexpectedly tripped **Fault 34 (DC Bus Overvoltage)** during high-speed slews. At 21 pole pairs, observer phase lag rotated the estimated electrical angle behind the rotor back-EMF vector, injecting regenerating $d/q$ current onto the DC bus! Restoring a $200\ \mathrm{Hz}$ observer bandwidth eliminated Fault 34, and adding a **$0.04\ \mathrm{Nm}$ directional backlash preload** quieted zero-crossing gear rattle during interactive **$200\ \mathrm{Hz}$ cosine gravity compensation** ($\tau_{\mathrm{ff}} = mgl\cos\theta - b\dot{\theta}$).
