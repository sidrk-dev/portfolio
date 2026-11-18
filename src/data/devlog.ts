export interface DevlogEntry {
  id: string;
  date: string;
  displayDate: string;
  projectSlug: string;
  projectLabel: string;
  category: "actuators" | "power" | "embedded" | "vla";
  title: string;
  summary: string;
  metrics: string[];
  body: string[];
  codeSnippet?: {
    caption: string;
    code: string;
  };
  image?: {
    src: string;
    alt: string;
    caption: string;
    width: number;
    height: number;
  };
}

export const devlogEntries: DevlogEntry[] = [
  {
    id: "2026-11-17-im6014-thermal-stall-and-6to1-capstan",
    date: "2026-11-17",
    displayDate: "Nov 17, 2026",
    projectSlug: "im6014-qdd-arm",
    projectLabel: "IM6014 QDD Arm",
    category: "actuators",
    title: "Empirical IM6014 locked-rotor thermal characterization forces a 5:1 → 6:1 shoulder capstan redesign",
    summary:
      "Unitree publishes 31.7 Nm peak torque for the IM6014 but zero continuous thermal ratings. A 2,679-sample stepped stall ramp (8 → 11 Nm) proved the internal MOSFET driver hits its 80 °C continuous ceiling at 7.09 Nm — catching a thermal shortfall in my 5:1 capstan before printing the final drum.",
    metrics: ["7.09 Nm cont @ 80 °C MOS", "1.094 °C/Nm² (τ = 510 s)", "5:1 → 6:1 capstan"],
    body: [
      "Holding a 3.0 kg payload horizontally at 800 mm reach requires ~43 Nm of continuous gravity torque at the shoulder. On paper, a 5.00:1 UHMWPE capstan asks the Unitree IM6014 for 8.60 Nm — seemingly comfortable against a 31.7 Nm peak datasheet figure. Because Unitree omits continuous ratings, I built torque_thermal.py to run a stepped locked-rotor characterization (8.0, 9.0, 10.0, and 11.0 Nm steps on a 36.0 V / 27 A bus at 6 Mbps RS-485).",
      "The first run immediately surfaced a mechanical rig artifact: a rigid 4.0° slip abort tripped at 3.7 Nm because the 3D-printed hardstop flexed ~0.95°/Nm elastically (9.6° total travel at 11 Nm plus 4.2° plastic creep). Replacing the fixed window with a compliance-compensated envelope (1.5°/Nm + 2° plus a 1.5° constant-torque creep guard) allowed a clean 681.6 s stepped run up to the 80 °C driver stop during the 11 Nm step.",
      "Fitting first-order lumped thermal models dT/dt = a·τ² − b·(T − Tamb) to both internal thermistors showed that the stator winding (130 °C trip, 0.860 °C/Nm², τ = 252.1 s) can sustain 9.34 Nm at 100 °C, whereas the rear MOSFET driver board (90 °C trip, 1.094 °C/Nm², τ = 510.4 s) saturates at 7.09 Nm at 80 °C (6.41 Nm at 70 °C). At 5:1 (8.60 Nm hold), the MOSFET stage crosses 80 °C in 9.7 min and hits its 90 °C firmware trip at ~13.8 min (25 °C ambient). Bumping the smooth sector drum to Ø135.96 mm (6.00:1) with a 12-turn 45° V-groove pinion drops continuous motor torque to 7.17 Nm while increasing UHMWPE rope safety factor to 3.7× at 90 Nm peak.",
    ],
    codeSnippet: {
      caption: "Lumped thermal fit from torque_thermal_ramp_20261117-190555.analysis.json (2,679 samples @ 36.0 V)",
      code: `Driver MOSFET (90 °C trip):  rise = 1.094 °C/Nm²,  tau = 510.4 s  ->  7.09 Nm cont @ 80 °C (8.9 A phase)
Stator Winding (130 °C trip): rise = 0.860 °C/Nm²,  tau = 252.1 s  ->  9.34 Nm cont @ 100 °C (11.8 A phase)
Torque linearity:             measured / commanded = 0.9933 across 8.0 -> 11.0 Nm`,
    },
  },

  {
    id: "2026-11-17-regen-clamp-current-knee-and-revf-lock",
    date: "2026-11-17",
    displayDate: "Nov 17, 2026",
    projectSlug: "regen-clamp-pcb",
    projectLabel: "Regen Clamp PCB",
    category: "power",
    title: "Qualifying the 20 A Ohm's-law braking knee against the 44 V moteus gripper limit (Rev F release)",
    summary:
      "Post-layout ngspice sweeps from 5 A to 27 A exposed where a single 2 Ω brake resistor stops clamping: above 20 A returned current, I·R_brake exceeds the 40.2 V comparator threshold and crosses 44.23 V at 22 A. Validated a zero-respin dual-resistor parallel wiring topology that holds ≤40.5 V to 35 A.",
    metrics: ["40.24 V @ 15 A (SPICE)", "44.23 V knee @ 22 A (2 Ω)", "≤40.5 V @ 35 A (2× 2 Ω)"],
    body: [
      "Because our 7-DOF arm shares a 36 V bus between Unitree IM6014 actuators (75 V max) and an mjbots moteus r4.11 gripper (44 V absolute max), the regenerative chopper only has an 8 V headroom window. Running a post-layout ngspice sweep across 15 ms braking current pulses showed flat hysteretic regulation (40.10–40.41 V) from 5 A through 20 A, followed by a sharp linear rise to 44.23 V at 22 A and 53.79 V at 27 A.",
      "The transition at 20 A is pure Ohm's law, not comparator lag: at 100% duty cycle, a 2 Ω resistor plus MOSFET Rds(on) requires 40 V across the load just to sink 20 A. Rather than spinning a higher-current board, wiring two external 2 Ω 200 W chassis resistors in parallel (1 Ω effective, each protected by its own 136 °C / 120 V DC SETfuse Q136 alloy thermal fuse and series KSD9700 switch) pushes the saturation knee past 35 A while keeping individual MOSFET pulsed current well inside CRSS042N10N ratings.",
      "Locked Rev F for fabrication alongside enlarged 3.00 mm / 0.90 × 2.00 mm XT60 slots for JLCPCB's -0.08 mm plating tolerance and 82 of 85 SMT parts (including all 6× TO-263 FETs) on single-sided Economic PCBA ($65.38 for 5 bare boards + 2 assembled units).",
    ],
    image: {
      src: "/images/regen/current-sweep.png",
      alt: "Simulated 15 ms braking pulse peak voltage vs returned arm current",
      caption: "Simulated 15 ms braking sweep on the 36 V bus showing the 20 A Ohm's-law saturation knee of a single 2 Ω brake resistor relative to the 44 V moteus r4 limit.",
      width: 1131,
      height: 565,
    },
  },

  {
    id: "2026-11-16-ipc2221b-pad-clearance-and-0p1-dividers",
    date: "2026-11-16",
    displayDate: "Nov 16, 2026",
    projectSlug: "regen-clamp-pcb",
    projectLabel: "Regen Clamp PCB",
    category: "power",
    title: "Fixing 29 IPC-2221B >50 V pad clearances without severing gate-driver ground returns",
    summary:
      "During 48 V braking, bus nodes swing between 52 V and 59.6 V — crossing IPC-2221B's 50 V boundary where uncoated external copper requires 0.50 mm clearance instead of 0.40 mm. A naive global zone bump severed U4's ground pin, motivating targeted per-pad clearances and 0.1% thin-film sense dividers.",
    metrics: ["29 → 0 IPC-2221B violations", "3.5 V → 0.6 V p-p spread", "0.1% RT0603B dividers"],
    body: [
      "Wrote bus_clearance_check.py to audit actual polygon-to-pad distances on every net that exceeds 50 V during 48 V regenerative braking (VIN, MID, VOUT, BRK_DRAIN, DGATE, HGATE). It flagged 29 exposed pads sitting at the 0.40 mm default pour clearance to GND.",
      "Increasing the global GND copper-pour clearance from 0.40 mm to 0.50 mm looked clean visually, but check_netlist.py immediately caught a broken ground return: the wider pullback pinched off the narrow ground web feeding SOT-23-5 gate driver U4 (UCC27517) and its local 1 µF 50 V bypass C19! Reverting the global pour to 0.40 mm and applying surgical per-pad clearances (0.50–0.55 mm on SMT high-voltage pads, 1.0 mm on hand-soldered XT60/XT30/cap pads) plus four localized polygon keepouts cleared all 29 IPC-2221B violations while preserving solid low-inductance return copper under U4.",
      "In the same pass, upgrading R10/R11/R14/R15 from 1% thick-film to 0.1% 75 V thin-film resistors (Yageo RT0603B) collapsed the 48 V resistor-divider tolerance spread from 3.5 V p-p down to 0.6 V p-p (±0.3 V).",
    ],
  },

  {
    id: "2026-11-11-2d-copper-solver-1oz-costdown",
    date: "2026-11-11",
    displayDate: "Nov 11, 2026",
    projectSlug: "regen-clamp-pcb",
    projectLabel: "Regen Clamp PCB",
    category: "power",
    title: "2D finite-difference copper-thermal solver cuts bare-PCB cost by 78% (2 oz → 1 oz Cu)",
    summary:
      "JLCPCB's jump from 1 oz to 2 oz copper added $37.30 to a 5-board prototype run. Instead of guessing trace widths with IPC-2152 charts on irregular pours, I wrote a 0.2 mm finite-difference Laplace + thermal solver across F.Cu, B.Cu, and vias.",
    metrics: ["3.13 mΩ through-path", "+66 K peak @ 27 A (1 oz)", "$47.40 → $10.10 bare PCB"],
    body: [
      "Standard trace-width calculators fail on power distribution boards dominated by slotted polygon pours, stitched via arrays, and 6× TO-263 tabs. I wrote copper_check.py to rasterize the actual KiCad Gerber copper geometry on both layers at 0.2 mm resolution, couple plated through-holes and vias vertically, and solve current density and Joule heating coupled to natural convection (10 W/m²K per face).",
      "At the full 27 A design current, the entire VIN → MID → VOUT → GND copper path measures just 3.13 mΩ in 1 oz (35 µm) copper — dissipating 2.28 W in copper alongside 4.90 W across the four series CRSS042N10N MOSFETs (at hot 6.7 mΩ Rds(on)). Peak steady-state temperature rise reaches +66 K at Q1's tab (+29 K board mean) vs +46 K in 2 oz copper — well inside 105 °C / 130 °C FR-4 and component limits while slashing bare-PCB fab from $47.40 to $10.10.",
    ],
    image: {
      src: "/images/regen/copper-thermal.png",
      alt: "2D finite-difference Joule heating and temperature rise over ambient map in 1 oz copper at 27 A",
      caption: "copper_check.py output on 35 µm (1 oz) copper at 27 A continuous: log10 Joule heat density (left) and steady-state ΔT above ambient in Kelvin (right).",
      width: 1430,
      height: 550,
    },
  },

  {
    id: "2026-11-09-crushing-five-erc-clean-board-killers",
    date: "2026-11-09",
    displayDate: "Nov 09, 2026",
    projectSlug: "regen-clamp-pcb",
    projectLabel: "Regen Clamp PCB",
    category: "power",
    title: "Catching five 'ERC/DRC-clean' board-killers before fab with blind datasheet & CPL verifiers",
    summary:
      "Standard KiCad ERC/DRC and vendor DFM viewers reported zero errors on Rev D — while hiding a reversed CJ431 SOT-23 pinout, two 180°-flipped SMT rotations in the pick-and-place file, a capacitor under a MOSFET tab, and undersized XT60 slots.",
    metrics: ["5 fatal bugs caught pre-fab", "261 pins + 121 terminals audited", "SOT-23 → SOT-223 Q4"],
    body: [
      "After watching standard EDA checks miss real-world assembly killers, I built check_parts.py (a blind pin-by-pin datasheet ledger across all 121 component terminals), check_cpl.py (comparing KiCad pick-and-place rotations against LCSC/EasyEDA pin-1 orientations), and an adversarial multi-model design review script.",
      "On their very first pass over Rev D — a board with 0 ERC and 0 DRC errors — they caught five showstoppers: (1) U2 (CJ431) was wired with standard TL431 SOT-23 pin numbering instead of CJ431's mirrored 1=REF, 2=K, 3=A pinout, which would have shorted the 11.6 V control rail on power-up; (2) U4 (UCC27517) and Q4 (BCP56-16) were rotated 180° in the JLCPCB CPL export; (3) soft-start capacitor C13 physically collided beneath Q9's TO-263 body; (4) XT60 drills were 0.2 mm smaller than Amass datasheet blades; and (5) pass transistor Q4 in SOT-23 (416 °C/W) reached Tj = 157 °C during sustained 48 V braking — solved by upgrading Q4 to SOT-223 BCP56-16 (94 °C/W) and adding dedicated gate driver U4.",
    ],
  },

  {
    id: "2026-11-07-apm-rolling-contact-elbow-and-helical-capstan",
    date: "2026-11-07",
    displayDate: "Nov 07, 2026",
    projectSlug: "im6014-qdd-arm",
    projectLabel: "IM6014 QDD Arm",
    category: "actuators",
    title: "Loop-solving the elliptical APM rolling-contact elbow: 16× cable-slack reduction via virtual centrode placement",
    summary:
      "Solved exact four-bar loop closure on our Onshape J2assem rolling-contact elbow (l = 112.029 mm, s = 71.052 mm) and proved that shifting antagonistic UHMWPE routing pulleys 23.07 mm behind each pin line cuts total loop-length swing from ±13.5·n mm down to ±0.82·n mm.",
    metrics: ["0.411 mm circular error (±90°)", "±13.5·n → ±0.82·n mm slack", "45° support-free V-groove"],
    body: [
      "An anti-parallelogram mechanism (APM) creates a low-friction rolling joint without gear teeth, but its true centrodes are conjugate ellipses with semi-axes A = l/2 = 56.015 mm and B = h/2 = 43.308 mm — meaning pin-to-pin platform spacing grows from 86.615 mm at q = 0° to 100.06 mm at q = 90°. If antagonistic block-and-tackle cables anchor along the pin line, one side pays out faster than the other takes up, creating ±13.5 mm of cable slack per strand.",
      "By fitting the conjugate rolling curve over q ∈ [-90°, +90°], I found a best-fit virtual circle of radius r = 66.587 mm centered 23.074 mm behind each pin line with only 0.411 mm peak geometric deviation across the entire 180° range. Placing 22 mm routing pulleys at that 23.07 mm virtual center depth collapses antagonistic loop-length variation by 16.5× to ±0.82·n mm.",
      "For the 43 Nm shoulder, where printed spur-gear PCRM teeth would amplify backlash across 800 mm reach, I designed a support-free FDM helical pinion (Ø22.66 mm rope pitch, 2.6 mm pitch, 90° V-groove with 45° flanks) driving 2 mm 12-strand UHMWPE rope (4.9 kN break). A STEP cross-section audit caught a 0.22 mm breakthrough between the mid-travel diamond rope anchor and the four #8-32 axial reinforcing screw bores, fixed by resizing the diamond hole from 3.0 mm to 2.5 mm.",
    ],
    image: {
      src: "/images/arm/rolling-contact-preview.png",
      alt: "MuJoCo rolling-contact shoulder and elbow joint kinematics preview",
      caption: "Equality-constrained rolling-contact kinematic model verified in MuJoCo 3.16 across ±90° joint excursions.",
      width: 2160,
      height: 480,
    },
  },

  {
    id: "2026-11-04-eda-fault-injection-and-canary-drc",
    date: "2026-11-04",
    displayDate: "Nov 04, 2026",
    projectSlug: "regen-clamp-pcb",
    projectLabel: "Regen Clamp PCB",
    category: "power",
    title: "Why '0 DRC violations' can lie: 7-fault KiCad injection study & fail-closed canary gates",
    summary:
      "Injected seven deliberate schematic, layout, and rule-file bugs into KiCad 10 and found that a malformed .kicad_dru rule silently evaluates to zero violations. Built gate.py with synthetic 50 mm track-width canary injection to guarantee DRC rules actually execute.",
    metrics: ["7 injected EDA faults tested", "51 2-oz trace violations caught", "Fail-closed canary DRC"],
    body: [
      "While auditing Rev C against JLCPCB's 2 oz copper minimum trace/space rules (0.16 mm vs 1 oz's 0.127 mm), I discovered 51 traces that had passed default DRC. Worse, testing seven deliberate faults (swapped gate labels, 10 kΩ → 10 Ω values, halved FET pads, syntax-broken .kicad_dru files, and suppressed severities) revealed that a broken custom rule file can cause CLI DRC runs to return exit code 0 with '0 violations'.",
      "Built gate.py as a fail-closed release wrapper: before trusting a clean DRC pass, it clones the board in /tmp, injects a canary rule requiring 50 mm minimum track width, and asserts that kicad-cli actively fails on the real copper traces — proving the rule parser, net classes, and severity flags are live.",
    ],
  },

  {
    id: "2026-11-03-48v-psu-latch-interlock",
    date: "2026-11-03",
    displayDate: "Nov 03, 2026",
    projectSlug: "regen-clamp-pcb",
    projectLabel: "Regen Clamp PCB",
    category: "power",
    title: "Catching a 1.15 kW 48 V PSU latch-on failure mode in SPICE & designing the DGATE hardware interlock",
    summary:
      "Worst-case divider tolerance simulation at 48 V showed the hysteretic brake release threshold could dip below VIN at minimum trim — latching the chopper ON directly across the bench supply at 24 A (1.15 kW). Solved in hardware with a 2-transistor DGATE forward-conduction interlock.",
    metrics: ["1.15 kW latch-on averted", "Q10/Q11 DGATE interlock", "VOUT-powered 11.6 V rail"],
    body: [
      "A supply-tracking brake chopper trips at VIN + ΔVtrip and releases at VIN + ΔVtrip − Vhyst (~2.3 V). Running sim_brake_latch_48v.cir across 1% resistor corners at 48 V revealed a subtle trap: if RV1 is set near its +3.0 V minimum trim and sense dividers skew unfavorably, the release threshold drops below VIN + Vdiode. Once a single regen spike fires the chopper, the bench supply itself feeds current through the ideal diode into the 2 Ω brake resistor forever — dumping 24 A / 1.15 kW continuously!",
      "Designed a hardware interlock (Q10 MMBT5401 PNP + Q11 MMBT3904 NPN) referenced to LM74800-Q1's DGATE pin: whenever the ideal diode is forward-conducting (DGATE driven above VIN), Q10/Q11 clamp comparator output CMP_OUT low so the chopper physically cannot fire on forward supply current. The moment motor regen pushes VOUT above VIN, LM74800-Q1 pulls DGATE down in <1 µs, releasing the interlock so braking engages cleanly.",
    ],
  },

  {
    id: "2026-11-02-cracking-unitree-im6014-wine-dll-protocol",
    date: "2026-11-02",
    displayDate: "Nov 02, 2026",
    projectSlug: "im6014-qdd-arm",
    projectLabel: "IM6014 QDD Arm",
    category: "actuators",
    title: "Dumping Unitree's Enigma-packed SDK from Wine RAM to reverse-engineer IM6014 flash ID programming on Linux",
    summary:
      "All Unitree IM6014 actuators ship hardcoded to ID 0 with zero public documentation on changing IDs, and Unitree's Windows GUI crashes on Linux/Wine. Dumped unpacked UnitreeMotorSDK.dll from Wine process memory, disassembled it with Capstone, and commissioned our 3-DOF daisy-chain at 6 Mbps over a ROBOTIS U2D2.",
    metrics: ["80 ms post-reset config window", "FE EE / FC EE CRC32 decoded", "3-DOF live @ 6 Mbps U2D2"],
    body: [
      "We couldn't daisy-chain three IM6014 motors on one RS-485 bus while every motor answered as ID 0, and Unitree Motor Assistant V1.3.2 is wrapped in Enigma Virtual Box and crashes immediately under Wine due to an unhandled null pointer on serial ioctl TIOCGICOUNT. Rather than keeping a Windows laptop tethered to the bench, I launched the packed binary suspended under Wine, dumped the unpacked UnitreeMotorSDK.dll image straight out of process memory (0x2319c0000), and disassembled its config state machine with Capstone.",
      "The disassembly uncovered why naive register scans always got silence: config frames (header FE EE, ID | 0xF0, packed 32-bit op/param descriptor, CRC32) are ONLY accepted inside an ~80 ms window immediately following a unicast Mode-7 Reset command, and require echoing a 16-byte calibration block (param 8) before writing param 0 and issuing flash commit op=2 (which replies 'SaveOK ' within 3 s).",
      "Programmed IDs 0, 1, and 2 natively from Linux over a single ROBOTIS U2D2 adapter at 6 Mbps (0.12 ms RTT), built a 2° CAD self/table collision map, and ran live 3-DOF gravity compensation, spring-back impedance, Figure-8 feed-forward tracking, and SpaceMouse Cartesian IK — immediately observing the +3 V deceleration bus spikes that kicked off the Regen Clamp PCB.",
    ],
    codeSnippet: {
      caption: "Recovered IM6014 non-volatile ID programming sequence (verified on physical motors 0 → 1, 0 → 2)",
      code: `1. Broadcast Stop (mode 0) -> Unicast Reset (mode 7, old_id) -> sleep(80 ms)
2. Unicast Config [FE EE | id|0xF0 | 0x00 | LE32(op,param,A,B) | payload | CRC32]:
   - Read  param 8 (op=0, A=0x20, 16B) -> Write param 8 back (op=1, A=0x10)
   - Write param 0 (op=1, A=0x04, data=new_id) -> Verify FC EE echo
   - Flash commit  (op=2, param=0, data=0x19,0,0,0 + unix_ts) -> Reply: "SaveOK "`,
    },
    image: {
      src: "/images/arm/im6014-3dof-driving.jpg",
      alt: "3-DOF IM6014 prototype running live Cartesian IK over U2D2 at 6 Mbps",
      caption: "All three daisy-chained IM6014 actuators (IDs 0, 1, 2) running 84 Hz Cartesian IK over a single 6 Mbps ROBOTIS U2D2 bus.",
      width: 1440,
      height: 900,
    },
  },

  {
    id: "2026-10-20-jointcore-leases-and-dream-vla-bridge",
    date: "2026-10-20",
    displayDate: "Oct 20, 2026",
    projectSlug: "im6014-qdd-arm",
    projectLabel: "IM6014 QDD Arm",
    category: "actuators",
    title: "Transport-free JointCore safety state machine & equality-constrained MuJoCo VLA embodiment",
    summary:
      "Built a hardware-agnostic Python controller core (108+ tests, PTY serial deadline harness) enforcing single-owner RS-485 bus leases and staleness watchdogs, plus a MuJoCo 3.16 bridge translating VLA joint actions onto mimic-constrained rolling-contact pairs.",
    metrics: ["18-group offline CI suite", "3000 Hz MuJoCo rolling physics", "Jacobian τ_m = J^T τ_q"],
    body: [
      "Before putting multi-joint trajectories onto 31.7 Nm actuators, I separated protocol framing and safety logic into a transport-free JointCore engine: no motion frame can ever leave the host unless an exclusive bus lease is acquired, every configured motor returns fresh CRC-valid feedback within deadline, and velocity/acceleration/lead/effort guards pass. Verified with a negative PTY harness proving zero serial bytes are emitted prior to explicit operator arming.",
      "In parallel, standard URDF parsers and VLA toolchains break on rolling-contact joints because the joint center translates as conjugate surfaces roll (rp·ȧ = rd·ḃ, q = a + b). Built sim_rolling_reach_v1 in MuJoCo 3.16 using equality constraints and Jacobian-transpose torque projection so external VLA policies command clean logical joint angles while local controllers enforce physical contact kinematics.",
    ],
  },

  {
    id: "2026-09-28-scoop-v1-vla-timing-domain-shift",
    date: "2026-09-28",
    displayDate: "Sep 28, 2026",
    projectSlug: "food-scooping-vla",
    projectLabel: "Granular VLA (scoop-v1)",
    category: "vla",
    title: "Why 0.021 offline BC MSE failed closed-loop scooping: uncovering 500 Hz control-timing sensitivity",
    summary:
      "Built a 497-test MuJoCo + LeRobot v0.6.1 granular food-scooping benchmark (30 g / 60 g portions, 1-D load-cell physics, 0.013 mm geometry audit). Discovered that control-loop timing drift shifts physical bead deposition by +30% (30.00 g → 39.00 g) even on exact expert actions.",
    metrics: ["28/30 (93.3%) expert physics gate", "0.013 mm max solid penetration", "497 automated tests"],
    body: [
      "Designed the scoop-v1 embodiment contract to ban simulator cheating: policies receive only 256×256 overhead RGB, 18-D robot proprioception, and a physical 1-D bowl load-cell model (contact force + settling + noise + drift), outputting 10–20 step sequential SE(3) increments (‖Δp‖ ≤ 15 mm, ‖Δr‖ ≤ 0.10 rad via exact SO(3) Exp map) into a 500 Hz controller that strictly rejects out-of-bounds commands instead of silently clipping them.",
      "Our adaptive portioning expert passed 28/30 fresh varied-physics trials (conserving 150–162 g of discrete beads to 2.8e-17 kg numerical precision). However, an 800-step ResNet18 ACT policy with 0.0225 validation loss failed closed-loop replay — and replaying saved expert trajectories across mismatched 2 ms / 500 Hz step boundaries shifted a 30.00 g deposit to 39.00 g true mass (39.61 g settled load-cell mean)! Proved that closed-loop contact manipulation requires strict recording-to-execution control-step equivalence before attributing rollout failures to vision.",
    ],
  },

  {
    id: "2026-09-15-arm2027-ros2-moveit-servo-workstation",
    date: "2026-09-15",
    displayDate: "Sep 15, 2026",
    projectSlug: "arm2027-workstation",
    projectLabel: "ARM2027 Workstation",
    category: "embedded",
    title: "Hardening a 6-DOF ROS 2 Jazzy + MoveIt Servo + SpaceMouse CAN-FD workstation",
    summary:
      "Built a containerized 6-axis teleoperation and hardware bring-up console bridging a 3Dconnexion SpaceMouse, MoveIt Servo singularity handling, Three.js wrist-cam visualization, and a 6-controller moteus CAN-FD backend.",
    metrics: ["118 unit + 43 MoveIt tests", "6-axis SpaceMouse Servo", "7-step CAN-FD bring-up"],
    body: [
      "Integrated Gazebo Harmonic, ros2_control, MoveIt Servo, and a browser-based Three.js operator console with live picture-in-picture virtual wrist camera and raw 6-axis input bars that remain inspectable while motors are paused — letting operators verify coordinate-frame signs before energizing hardware.",
      "Closed 17 subtle concurrency, deadman-release, atomic config-persistence, and graceful CAN-FD shutdown edge cases verified across 118 unit tests, 43 MoveIt integration tests, and headless Playwright UI checks.",
    ],
  },

  {
    id: "2026-07-15-planetary-qdd-stiction-and-fault34",
    date: "2026-07-15",
    displayDate: "Jul 15, 2026",
    projectSlug: "bldc-actuator",
    projectLabel: "BLDC & QDD Test Stand",
    category: "actuators",
    title: "Solving 1:8 planetary QDD calibration stiction, PLL Overvoltage Fault 34 & 200 Hz gravity compensation",
    summary:
      "Characterizing a 21-pole-pair Steadywin GWK8108-8 (1:8 planetary QDD) on moteus uncovered why low encoder-PLL bandwidth triggers DC-bus Overvoltage Fault 34 at speed, culminating in a smooth 200 Hz cosine gravity-compensation loop.",
    metrics: ["0.15 Ω · 35 µH · 16.25 rpm/V", "Fault 34 PLL phase-lag fix", "200 Hz gravity comp + preload"],
    body: [
      "Standard moteus current-mode encoder calibration stalled repeatedly on the 1:8 planetary gearbox's breakaway stiction. Forcing a 30 W open-loop voltage sweep (--cal-never-encoder-current-mode --cal-motor-power 30.0) mapped all 21 pole pairs cleanly (R = 0.15 Ω, L = 35 µH, 24.78 Nm stall @ 24 V).",
      "During high-speed sweeps, lowering the encoder observer bandwidth below 200 Hz to quiet gear noise unexpectedly tripped Fault 34 (Overvoltage): at 21 pole pairs, observer phase lag corrupted the d/q commutation angle at speed, injecting unintended regenerating d-axis current back onto the supply! Restoring 200 Hz PLL bandwidth and adding a 0.04 Nm directional backlash preload eliminated gear rattle and enabled butter-smooth 200 Hz single-link cosine gravity compensation.",
    ],
  },

  {
    id: "2026-05-19-xiao-rp2350-1khz-can-as5600-firmware",
    date: "2026-05-19",
    displayDate: "May 19, 2026",
    projectSlug: "rp2350-robomaster-arm",
    projectLabel: "RP2350 6-DOF CAN Stack",
    category: "embedded",
    title: "Deterministic 1 kHz RP2350 CAN loop + PCA9548A multiplexed AS5600 power-loss pose recovery",
    summary:
      "Refactored our 3-MCU 6-DOF RoboMaster arm architecture onto Seeed XIAO RP2350 nodes running a strict 1 kHz CAN loop with joint-side I2C-multiplexed absolute encoders and coupled bevel-wrist differential mixing.",
    metrics: ["1 kHz loop · 8× ESCs/bus", "PCA9548A + AS5600 EEPROM zero", "Coupled bevel wrist ±0.4°"],
    body: [
      "High-reduction DJI M3508/M2006 actuators (94.23:1 on J1–J3, 44:1 on J4) only know rotor angle mod 360°, meaning any brownout or E-stop normally loses absolute arm pose and risks destructive homing collisions. Added joint-side AS5600 magnetic encoders behind a PCA9548A 8-channel I2C multiplexer on Wire1 with flash-persisted zero offsets and immediate CAN current cutout on stale I2C reads.",
      "Built ik_dashboard_qt.py and pid_tuner.py to coordinate all three MCU nodes (base, J4, and coupled bevel-gear differential wrist motor_a = +pitch + roll, motor_b = +pitch − roll), gating live IK execution until all three boards pass post-reconnect config and telemetry freshness checks.",
    ],
  },

  {
    id: "2026-02-24-hoverboard-ndfeb-demagnetization-forensics",
    date: "2026-02-24",
    displayDate: "Feb 24, 2026",
    projectSlug: "bldc-actuator",
    projectLabel: "BLDC & QDD Test Stand",
    category: "actuators",
    title: "Diagnosing a permanent 20% torque step-drop (8.59 → 6.84 Nm) as irreversible NdFeB magnet demagnetization",
    summary:
      "First locked-rotor stall test on a 30-pole-pair hoverboard motor hit 8.59 Nm, then every subsequent run plateaued at exactly 6.84 Nm even after cooling to ambient. Telemetry forensics traced the step change to partial NdFeB coercivity collapse.",
    metrics: ["8.59 → 6.84 Nm (-20.4% Kt)", "30 pole pairs · 0.265 Ω", "50 Hz CAN-FD + NTC fusion"],
    body: [
      "Wired a 400 W 30-pole-pair direct-drive hub motor to an mjbots moteus r4.11 (10–44 V) + AS5047P 14-bit SPI encoder and fused non-blocking threaded Arduino NTC casing thermistors into a 50 Hz asyncio CAN-FD test stand (also implementing a 100 Hz virtual spring-damper-Coulomb haptic detent knob).",
      "After run #2 pushed outer casing temperature to 64 °C under 15 Nm commanded stall current, measured peak torque dropped permanently from 8.59 Nm to 6.84 Nm. Ruling out 35.00 V bus sag, rotor slip (0.00 r/s), and reversible copper R(T) drift proved internal windings had reached 85–100 °C where high q-axis armature reaction exceeded lowered N-grade NdFeB coercivity — permanently stepping down Kt by 20%. That failure directly shaped the conservative per-step thermal modeling I later built for the Unitree IM6014.",
    ],
  },

  {
    id: "2026-02-14-foc-driver-floating-3p6v-enable-debug",
    date: "2026-02-14",
    displayDate: "Feb 14, 2026",
    projectSlug: "foc-driver",
    projectLabel: "Custom FOC Driver PCB",
    category: "power",
    title: "Oscilloscope root-cause of a dead DRV8313 power stage: tracing a 3.6 V floating EN pin to cross-domain GND",
    summary:
      "First power-up of FOC_DV (custom DRV8313 3-phase driver + dual INA240A2D inline 2010 current-sense PCB) produced zero current while nFAULT read HIGH. Layer-by-layer isolation from bare-metal STM32 timers to internal LDO paths uncovered a missing ground reference.",
    metrics: ["DRV8313 + 2× INA240A2D (50 V/V)", "3.6 V floating EN anomaly", "+3.3INTRN vs +3.3V isolated"],
    body: [
      "When six-step commutation drew 0.00 A on initial bring-up, I bypassed SimpleFOC with a minimal 490 Hz bare-metal PWM test and verified clean 5.0 V square waves at the STM32 pins. On the board, motor-bus LED D1 was lit and open-drain nFAULT (pulled up to DRV8313's internal +3.3INTRN rail via 10 kΩ R6) sat cleanly HIGH, ruling out UVLO, OCP, or thermal shutdown — yet all three motor phases stayed Hi-Z at 0 V.",
      "Probing DRV8313's EN input revealed an anomalous 3.6 V DC level instead of 0 V or 5 V. Cross-referencing TI's DRV8313 internal block diagram explained it: without a unified ground return between the external STM32 controller and the driver board, EN floated to the chip's internal 3.3 V LDO rail (+3.3INTRN) plus a parasitic offset (~3.6 V), holding all half-bridges in Hi-Z per Table 1. Unifying the 0 V reference brought all three phases online and produced clean PWM-rejected sinusoidal phase-current envelopes across both INA240A2D (+3.3V) 2010 shunts.",
    ],
  },
];
