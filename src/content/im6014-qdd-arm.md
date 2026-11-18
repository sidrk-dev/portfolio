## System overview

Most student robot arms rely on high-ratio harmonic or cycloidal gearboxes ($50:1$ to $100:1$) that mask control errors behind high reflected inertia and non-backdrivable friction. Modern physical-AI and humanoid manipulators move in the opposite direction: **quasi-direct-drive (QDD) actuators** paired with low-loss cable or rolling-contact transmissions so contact forces reflect cleanly back to motor current without joint-torque sensors.

This project develops both a **bench-running 3-DOF Unitree IM6014 physical prototype** and the **mechanical + thermal architecture for a 7-DOF (6-DOF + moteus gripper) low-inertia manipulator** targeting an $800\ \mathrm{mm}$ reach ($400\ \mathrm{mm}$ upper arm + $400\ \mathrm{mm}$ forearm) and a $\ge 3.0\ \mathrm{kg}$ payload at full horizontal extension.

At $800\ \mathrm{mm}$ horizontal extension — accounting for $3.0\ \mathrm{kg}$ payload, $3 \times 0.5\ \mathrm{kg}$ wrist actuators at $\sim 700\ \mathrm{mm}$, a $0.4\ \mathrm{kg}$ gripper actuator at $\sim 760\ \mathrm{mm}$, a proximal $0.5\ \mathrm{kg}$ elbow actuator mounted $50\ \mathrm{mm}$ from the shoulder axis, and $\sim 1.5\ \mathrm{kg}$ of link structure — worst-case static gravity hold requires **$\sim 43\ \mathrm{Nm}$ at the shoulder** ($65\ \mathrm{Nm}$ with $1.5\times$ dynamic margin; $90\ \mathrm{Nm}$ peak cap) and **$\sim 19\ \mathrm{Nm}$ at the elbow** ($29\ \mathrm{Nm}$ dynamic).

## Reverse-engineering the IM6014 flash ID protocol on Linux

All **Unitree IM6014 (`N6014B-12.6`)** actuators ($38/3 \approx 12.667:1$ internal planetary stage, $31.7\ \mathrm{Nm}$ peak) ship from the factory hardcoded to **Motor ID 0** over half-duplex RS-485. Unitree publishes no protocol documentation for changing IDs, and their Windows utility (`Unitree Motor Assistant V1.3.2`) is packed with Enigma Virtual Box and crashes immediately under Wine on Linux due to a null-pointer dereference on missing `TIOCGICOUNT` serial `ioctl` handling.

To run a 3-motor daisy chain natively from Linux over a single **ROBOTIS U2D2** (`FT232H`) USB-to-RS-485 adapter without a Windows machine:

1. Launched the Enigma-packed executable suspended under Wine and dumped the unpacked `UnitreeMotorSDK.dll` image directly out of process memory (`0x2319c0000`).
2. Disassembled the configuration state machine with Capstone to recover the exact CRC32-framed `FE EE` request and `FC EE` response layouts.
3. Uncovered the critical hardware timing gate: **configuration packets are ignored unless unicast to the motor's active ID inside an $\sim 80\ \mathrm{ms}$ window immediately following a Mode-7 `Reset` frame**, and require reading and echoing a 16-byte internal parameter block (`param 8`) prior to writing the new ID (`param 0`) and issuing non-volatile flash commit (`op = 2`, which returns `"SaveOK "` within $3\ \mathrm{s}$).

```text
Config TX: FE EE | (id | 0xF0) | 0x00 | LE32((id|0xF0) | op<<8 | param<<12 | A<<16 | B<<30) | payload | CRC32
Config RX: FC EE | (id | ok<<7) | (param<<4 | op) | LE16(A | B<<14) | payload | 8B pad | CRC32

Verified Linux ID-write sequence:
Broadcast Stop (mode 0) -> Unicast Reset (mode 7, old_id) -> sleep(80 ms)
-> Read param 8 (op=0, A=0x20, 16B) -> Write param 8 (op=1, A=0x10)
-> Write param 0 (op=1, A=0x04, new_id) -> Flash Save (op=2, 0x19 + unix_ts) -> "SaveOK "
```

With IDs `0`, `1`, and `2` persisted in flash, all three daisy-chained actuators run error-free at **$6\ \mathrm{Mbps}$** ($0.12\text{--}0.14\ \mathrm{ms}$ per-motor round-trip latency, verified across unloaded speed ladders from $5.00\ \mathrm{rpm}$ to $100.0\ \mathrm{rpm}$ with zero CRC rejections).

## Empirical torque & thermal characterization

Unitree specifies $31.7\ \mathrm{Nm}$ ($40\ \mathrm{A}$) peak output for the IM6014, with **no continuous torque or thermal time-constant specification**. Sizing a shoulder reduction without knowing continuous heat rejection risks building an arm that faults minutes into holding pose.

I built `torque_thermal.py` to execute stepped locked-rotor holds ($8.0 \rightarrow 9.0 \rightarrow 10.0 \rightarrow 11.0\ \mathrm{Nm}$, $120\ \mathrm{s}$ per step on a $36.0\ \mathrm{V} / 27\ \mathrm{A}$ bus) while logging phase current, bus droop, stator winding temperature ($130\ ^\circ\mathrm{C}$ firmware trip), and MOSFET driver temperature ($90\ ^\circ\mathrm{C}$ firmware trip) at $4\ \mathrm{Hz}$. During initial runs, a rigid $4.0^\circ$ rotor-slip guard aborted at $3.7\ \mathrm{Nm}$ because the 3D-printed hardstop deflected elastically at $\sim 0.95^\circ/\mathrm{Nm}$ ($9.6^\circ$ total deflection at $11\ \mathrm{Nm}$ plus $4.2^\circ$ permanent creep). Replacing the naive threshold with a torque-proportional compliance envelope ($1.5^\circ/\mathrm{Nm} + 2^\circ$) paired with a $1.5^\circ$ constant-torque creep detector allowed a clean $681.6\ \mathrm{s}$ ($2,679$-sample) characterization.

Fitting first-order lumped thermal dynamics to both internal sensors:

$$
\frac{dT}{dt} = a\,\tau^2 - b\,(T - T_{\mathrm{amb}}), \qquad \Delta T_{\infty}(\tau) = \frac{a}{b}\,\tau^2
$$

| Subsystem | Protection Trip | Steady-State Rise ($a/b$) | Thermal $\tau_{\mathrm{th}}$ | Continuous @ $70\ ^\circ\mathrm{C}$ | Continuous @ $80\ ^\circ\mathrm{C}$ | Continuous @ $100\ ^\circ\mathrm{C}$ |
|---|---|---|---|---|---|---|
| **Driver MOSFETs (limiting)** | $90\ ^\circ\mathrm{C}$ | **$1.094\ ^\circ\mathrm{C}/\mathrm{Nm}^2$** | **$510.4\ \mathrm{s}$** ($8.5\ \mathrm{min}$) | **$6.41\ \mathrm{Nm}$** ($8.1\ \mathrm{A}$) | **$7.09\ \mathrm{Nm}$** ($8.9\ \mathrm{A}$) | Trips at $90\ ^\circ\mathrm{C}$ |
| **Stator Winding** | $130\ ^\circ\mathrm{C}$ | **$0.860\ ^\circ\mathrm{C}/\mathrm{Nm}^2$** | **$252.1\ \mathrm{s}$** ($4.2\ \mathrm{min}$) | — | $8.00\ \mathrm{Nm}$ ($10.1\ \mathrm{A}$) | **$9.34\ \mathrm{Nm}$** ($11.8\ \mathrm{A}$) |

Measured output torque tracked commanded torque within **$0.67\%$** ($\tau_{\mathrm{meas}}/\tau_{\mathrm{cmd}} = 0.9933$), while DC supply draw stayed below $2.7\ \mathrm{A}$ even at $11\ \mathrm{Nm}$ stall ($13.9\ \mathrm{A}$ phase current at zero mechanical power). Crucially, **the rear MOSFET driver stage — not copper winding heat — caps uncooled continuous output to $7.09\ \mathrm{Nm}$ at $80\ ^\circ\mathrm{C}$**. Adding a rear-cover heatsink + fan shifts the bottleneck toward the stator, unlocking $+30\text{--}48\%$ continuous torque ($9.3\text{--}10.5\ \mathrm{Nm}$).

## Shoulder transmission: 6:1 support-free helical UHMWPE capstan

For the $43\ \mathrm{Nm}$ shoulder joint ($\pm 90^\circ$ range), 3D-printed spur-gear rolling mechanisms introduce tooth backlash that magnifies into millimeters of end-effector play at $800\ \mathrm{mm}$ reach. Instead, I designed a **fixed-axis zero-backlash capstan stage** wound with **$2\ \mathrm{mm}$ 12-strand braided UHMWPE rope** ($4.9\ \mathrm{kN}$ rated break strength):

- **Support-free FDM helical motor pinion:** Direct-bolts to the IM6014 rotor flange ($\varnothing 54.6\ \mathrm{mm}$, $3 \times \mathrm{M5}$ + four axial `#8-32` reinforcing through-bolts) and is supported outboard by a `608` ball bearing ($1.37\ \mathrm{kN}$ static rating vs $\sim 450\ \mathrm{N}$ nominal / $800\ \mathrm{N}$ peak radial cable load). Uses a $2.6\ \mathrm{mm}$-pitch right-hand helix ($\varnothing 22.66\ \mathrm{mm}$ rope-center pitch diameter) with a **$90^\circ$ V-groove ($45^\circ$ flanks)** so the entire helix prints vertically without support material.
- **CAD interference catch:** Cross-section auditing of the STEP model revealed a $0.22\ \mathrm{mm}$ wall breakthrough between the $45^\circ$ diamond mid-travel rope anchor hole and the four $\varnothing 4.55\ \mathrm{mm}$ `#8-32` axial bolt bores; resizing the diamond anchor from $3.0\ \mathrm{mm}$ to $2.5\ \mathrm{mm}$ restored full wall integrity.
- **Thermal-driven ratio selection:** Our initial $5.00:1$ sector drum ($\varnothing 113.3\ \mathrm{mm}$) required **$8.60\ \mathrm{Nm}$** continuous motor torque at $43\ \mathrm{Nm}$ horizontal hold — exceeding the measured $7.09\ \mathrm{Nm}$ MOSFET ceiling! Stepping to a **$6.00:1$ smooth sector drum** ($\varnothing 135.96\ \mathrm{mm}$ pitch, $230^\circ$ wrap sector with an $\mathrm{M4}$ sliding-block creep tensioner and 12-turn pinion) drops continuous motor hold torque to **$7.17\ \mathrm{Nm}$** and raises rope safety factor at $90\ \mathrm{Nm}$ peak to **$3.7\times$** ($1,324\ \mathrm{N}$ tension).

## Elbow transmission: elliptical rolling-contact APM & 16× cable-slack cancellation

Mounting the elbow IM6014 proximally on the upper arm ($50\ \mathrm{mm}$ from the shoulder axis) slashes distal inertia while keeping the elbow cable loop entirely on the upper arm (**zero shoulder-to-elbow kinematic cable coupling**). The elbow joint itself uses a crossed four-bar **Anti-Parallelogram Mechanism (APM)** (`J2assem` CAD: crossed link length $l = 112.029\ \mathrm{mm}$, platform pivot spacing $s = 71.052\ \mathrm{mm}$, parallel height $h = \sqrt{l^2 - s^2} = 86.615\ \mathrm{mm}$).

Solving exact loop closure over $q \in [-90^\circ, +90^\circ]$ shows that the conjugate rolling surfaces are **ellipses** with semi-axes $A = l/2 = 56.0145\ \mathrm{mm}$ and $B = h/2 = 43.3075\ \mathrm{mm}$, with instantaneous platform separation:

$$
d(q) = 2\sqrt{A^2\sin^2(q/2) + B^2\cos^2(q/2)}
$$

growing from $86.615\ \mathrm{mm}$ at $q = 0^\circ$ to $100.06\ \mathrm{mm}$ at $q = \pm 90^\circ$. Anchoring antagonistic block-and-tackle cables directly on the pin line produces **$\pm 13.5\cdot n\ \mathrm{mm}$** of total loop-length swing ($n$ strands per side), slackening the unloaded tendon.

Fitting a virtual rolling circle across the full $180^\circ$ sweep yields radius $r = 66.587\ \mathrm{mm}$ centered **$23.074\ \mathrm{mm}$ behind each pin line** with only **$0.411\ \mathrm{mm}$ peak geometric deviation**. Placing $22\ \mathrm{mm}$ routing pulleys at that $23.07\ \mathrm{mm}$ virtual centrode depth reduces antagonistic cable swing by **$16.5\times$ down to $\pm 0.82\cdot n\ \mathrm{mm}$**, absorbed effortlessly by the tensioner compliance.

## Transport-free safety core, 3-DOF commissioning & VLA bridge

1. **`JointCore` deterministic state machine (`im6014-arm-control`):** Enforces single-owner serial bus leases, monotonic sequence watermarks, per-joint feedback staleness watchdogs, $2^\circ$-grid CAD mesh collision limits ($<0.8\ \mathrm{mm}$ contact threshold), and a $27\ \mathrm{A}$ supply-current budgeter. Verified by an 18-group offline CI suite including negative PTY checks proving zero bytes are transmitted before operator authorization.
2. **Physical 3-DOF arm modes:** Verified gravity auto-calibration ($2.75\ \mathrm{Nm}$ shoulder, $0.26\ \mathrm{Nm}$ forearm), free-hold with $5^\circ$ breakaway/relock, compliant spring-back impedance, Figure-8 trajectory tracking with velocity feedforward, and WebHID SpaceMouse Cartesian IK.
3. **MuJoCo 3.16 & Dream VLA embodiment (`im6014Development`):** Because standard URDF `mimic` tags fail on moving-centrode rolling joints in VLA IK pipelines, `sim_rolling_reach_v1` models conjugate rolling pairs via MuJoCo equality constraints ($r_p\dot{a} = r_d\dot{b},\ q = a + b$) and projects logical joint-space policy actions through the Jacobian transpose ($\tau_m = J^\top \tau_q$).
