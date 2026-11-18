export type ProjectCategory = "power" | "actuators" | "embedded" | "vla";

export interface ProjectLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface ProjectPlate {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  maxRem?: number;
}

export interface ProjectSpecRow {
  parameter: string;
  value: string;
  notes?: string;
}

export interface ProjectItem {
  slug: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  category: ProjectCategory;
  categoryLabel: string;
  period: string;
  status: string;
  featured?: boolean;
  summary: string;
  tileSub: string;
  metrics: { label: string; value: string }[];
  tags: string[];
  image: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  links: ProjectLink[];
  plates?: ProjectPlate[];
  specs?: ProjectSpecRow[];
  relatedSlugs: string[];
  interactiveWidget?: "regen-inspector" | "im6014-thermal" | "foc-schematic";
}

export const CATEGORY_LABELS: Record<"all" | ProjectCategory, string> = {
  all: "All systems",
  actuators: "Actuators & mechanics",
  power: "Power & PCBs",
  embedded: "Embedded & controls",
  vla: "Sim & Physical AI",
};

const EXT = "\u2197\uFE0E";

export const portfolio = {
  personal: {
    name: "Siddharth Rajasekaran",
    shortName: "Sid Rajasekaran",
    headline: "Robotics & Hardware Engineering @ Texas A&M · College Station & Houston, TX",
    seeking:
      "Seeking Summer / Fall 2027 internships at robotics startups — hardware, power electronics, actuators, and real-time controls",
    lede:
      "I build full-stack robotic hardware from the power bus up: 24–48 V regenerative braking and precharge PCBs, quasi-direct-drive (QDD) cable-capstan and rolling-contact transmissions, deterministic CAN-FD / 6 Mbps RS-485 motor stacks, and safety-gated manipulation policies.",
    email: "siddharthrk.dev@gmail.com",
    github: "https://github.com/sidrk-dev",
    linkedin: "https://www.linkedin.com/in/siddharthrajasekaran/",
    ieeeDoi: "https://doi.org/10.1109/CASE58245.2025.11164124",
    location: "College Station / Houston, TX",
    school: "Texas A&M University",
    degree: "B.S. Engineering (Robotics & Hardware Focus), Expected May 2029",
    quickFacts: [
      { key: "focus", value: "Power PCBs · QDD actuators & cable/rolling joints · 1 kHz motor control · Physical AI" },
      { key: "active", value: "7-DOF QDD manipulator (6:1 UHMWPE capstan + APM rolling elbow) + 48 V / 27 A regen clamp PCB" },
      { key: "track", value: "2nd-author IEEE CASE 2025 paper · Texas Children's TIGr Lab & UH Swarm Robotics internships" },
    ],
  },

  now: [
    {
      slug: "regen-clamp-pcb",
      label: "Pre-fab Rev F · SPICE + IPC-2221B verified · Nov 2026",
      title: "24–48 V / 27 A supply-tracking regenerative brake clamp & linear-SOA precharge power distribution PCB",
      image: "/images/regen/revf-3d.png",
      imageWidth: 1456,
      imageHeight: 1120,
      imageAlt: "3D KiCad raytrace of Rev F 24-48V 27A regenerative braking clamp and soft-start power distribution board",
      summary:
        "Sits between a 36 V / 27 A bench supply and a 7-motor QDD arm whose mjbots moteus r4.11 gripper has a strict 44 V absolute maximum. Integrates an LM74800-Q1 ideal diode, 140 V/s dV/dt linear precharge (0.34 A simulated inrush into 2,480 µF), an output-powered 11.6 V control rail that stays alive if the PSU trips off, and a 0.1%-trimmed LM393 + UCC27517 hysteretic brake chopper with a hardware DGATE supply-latch interlock. Verified with ngspice transient sweeps, a 0.2 mm 2D finite-difference copper-thermal solver, and zero-waiver IPC-2581 / DRC gates.",
    },
    {
      slug: "im6014-qdd-arm",
      label: "Active hardware + controls · Oct – Nov 2026",
      title: "Low-inertia QDD manipulator: 6:1 helical UHMWPE capstan shoulder, elliptical rolling-contact elbow & 6 Mbps RS-485 stack",
      image: "/images/arm/im6014-3dof-driving.jpg",
      imageWidth: 1440,
      imageHeight: 900,
      imageAlt: "3-DOF Unitree IM6014 arm digital twin tracking a Cartesian figure-8 trajectory at 84 Hz over 6 Mbps RS-485",
      summary:
        "Commissioned a 3-DOF physical Unitree IM6014 prototype at 6 Mbps over a ROBOTIS U2D2 after dumping UnitreeMotorSDK.dll from Wine memory to reverse-engineer the undocumented 80 ms post-reset flash ID protocol. On Nov 17, stepped locked-rotor thermal testing (2,679 samples) proved the IM6014 is MOSFET-driver limited to 7.09 Nm continuous at 80 °C (1.094 °C/Nm², τ = 510 s), directly driving a redesign of the zero-backlash shoulder capstan from 5:1 to 6:1 alongside a loop-solved anti-parallelogram rolling-contact elbow.",
    },
  ],

  projects: [
    {
      slug: "im6014-qdd-arm",
      title: "Low-Inertia QDD Robot Arm: Capstan Shoulder, APM Rolling-Contact Elbow & 6 Mbps RS-485 Stack",
      shortTitle: "IM6014 QDD Arm & Rolling-Contact Joints",
      subtitle: "Hardware prototype + actuator thermal characterization + MuJoCo / VLA embodiment · Oct – Nov 2026",
      category: "actuators",
      categoryLabel: "Actuators & mechanics",
      period: "Oct – Nov 2026",
      status: "3-DOF bench-running · 7-DOF transmissions & thermal sizing complete",
      featured: true,
      tileSub: "Reverse-engineered 6 Mbps RS-485 flash protocol, 7.09 Nm thermal limit characterization, 6:1 UHMWPE capstan & APM rolling elbow",
      summary:
        "End-to-end actuator, transmission, and real-time control development for an 800 mm-reach, 3 kg-payload quasi-direct-drive manipulator built around Unitree IM6014 (38/3 planetary) actuators and an mjbots moteus r4.11 gripper.",
      metrics: [
        { label: "Continuous limit", value: "7.09 Nm @ 80 °C (MOSFET)" },
        { label: "Shoulder drive", value: "6.0:1 helical UHMWPE capstan" },
        { label: "Elbow cable swing", value: "±0.82·n mm (virtual centrode)" },
        { label: "Bus latency", value: "6 Mbps RS-485 · 0.12 ms RTT" },
      ],
      tags: ["Unitree IM6014", "RS-485 Reverse Eng", "Capstan Drive", "Rolling-Contact APM", "MuJoCo 3.16", "Three.js", "Python"],
      image: "/images/arm/im6014-3dof-driving.jpg",
      imageAlt: "3-DOF Unitree IM6014 arm digital twin and live telemetry console running Cartesian IK at 84 Hz",
      imageWidth: 1440,
      imageHeight: 900,
      interactiveWidget: "im6014-thermal",
      links: [
        { label: `im6014-arm-control ${EXT}`, href: "https://github.com/sidrk-dev/im6014-arm-control", external: true },
        { label: `im6014Development (rolling joints + VLA) ${EXT}`, href: "https://github.com/sidrk-dev/im6014Development", external: true },
        { label: `3-DOF IK & auto-cal collab ${EXT}`, href: "https://github.com/ANGELOREYES-afk/arm_3dof_sim", external: true },
      ],
      specs: [
        { parameter: "Target manipulator envelope", value: "7-DOF (6-DOF arm + 1-DOF moteus gripper)", notes: "800 mm reach, ≥3.0 kg horizontal payload (43 Nm shoulder / 19 Nm elbow gravity hold)" },
        { parameter: "Primary QDD actuators", value: "Unitree IM6014 (N6014B-12.6)", notes: "Ø65 mm, 500 g, 38/3 (12.667:1) planetary, 31.7 Nm peak, 36.0 V bus" },
        { parameter: "Measured continuous rating", value: "7.09 Nm @ 80 °C driver / 6.41 Nm @ 70 °C", notes: "Driver MOSFET rise 1.094 °C/Nm² (τ = 510.4 s) vs stator 0.860 °C/Nm² (τ = 252.1 s)" },
        { parameter: "Shoulder transmission", value: "6.00:1 zero-backlash helical UHMWPE capstan", notes: "2 mm 12-strand UHMWPE (4.9 kN break, 3.7× SF @ 90 Nm), Ø22.66 mm 45° V-groove pinion → Ø135.96 mm sector drum" },
        { parameter: "Elbow transmission", value: "Anti-parallelogram (APM) elliptical rolling joint", notes: "l = 112.029 mm, s = 71.052 mm; 0.411 mm circular error over ±90°; pulleys at 23.07 mm depth cut cable swing 16×" },
        { parameter: "Transport & safety core", value: "ROBOTIS U2D2 @ 6 Mbps RS-485 + JointCore", notes: "Single-owner bus lease, CRC32 framing, 2° mesh collision map, 27 A PSU current budgeter" },
      ],
      plates: [
        {
          src: "/images/arm/im6014-3dof-driving.jpg",
          alt: "3-DOF IM6014 web commissioning and Cartesian IK console tracking a figure-8 path at 84 Hz",
          caption: "Browser commissioning & Cartesian IK console driving the 3-DOF IM6014 prototype at 84 Hz (0.12–0.14 ms per-motor RS-485 round-trip at 6 Mbps, zero CRC rejections across 9,345 frames).",
          width: 1440,
          height: 900,
        },
        {
          src: "/images/arm/im6014-3dof-calibrating.jpg",
          alt: "Sensorless mechanical hard-stop auto-calibration routine verifying measured span against CAD contact angles",
          caption: "Sensorless hard-stop auto-calibration: seeks low/high mechanical contacts under bounded torque and cross-checks measured IM6014 output encoder spans against CAD-predicted contact geometry within ±3–4°.",
          width: 1440,
          height: 900,
        },
        {
          src: "/images/arm/rolling-contact-preview.png",
          alt: "MuJoCo 3.16 equality-constrained rolling-contact shoulder and elbow simulation across three poses",
          caption: "MuJoCo 3.16 equality-constrained rolling-contact joint model mapping conjugate rolling pairs (rp·ȧ = rd·ḃ, q = a + b) to independent joint-action coordinates with Jacobian-transpose effort projection.",
          width: 2160,
          height: 480,
        },
        {
          src: "/images/arm/im6014-bench-dark.png",
          alt: "PySide6 IM6014 Motor Bench dark UI showing live position and torque plots at 36.000 V",
          caption: "Single-actuator PySide6 diagnostic bench with explicit pre-arm safety interlocks, live 36 V bus/torque/position strip charts, and raw packet inspection.",
          width: 1280,
          height: 1024,
        },
      ],
      relatedSlugs: ["regen-clamp-pcb", "bldc-actuator", "arm2027-workstation"],
    },

    {
      slug: "regen-clamp-pcb",
      title: "24–48 V / 27 A Supply-Tracking Regen Clamp & Soft-Start Power Distribution PCB (Rev F)",
      shortTitle: "Regen Clamp & Precharge PCB",
      subtitle: "KiCad 10 · ngspice transient/SOA verification · 2D copper-thermal solver · Pre-fab Rev F · Nov 2026",
      category: "power",
      categoryLabel: "Power & PCBs",
      period: "Nov 2026",
      status: "Pre-fab Rev F · SPICE, IPC-2221B & 261-pin netlist verified",
      featured: true,
      tileSub: "LM74800-Q1 ideal diode + 140 V/s soft-start + 0.1% supply-tracking 21.5 A brake chopper (SPICE & IPC verified)",
      summary:
        "125 × 100 mm 2-layer power distribution and bus-clamping board protecting bench supplies and 44 V-max motor controllers during multi-axis QDD arm deceleration and backdriving.",
      metrics: [
        { label: "Bus clamp @ 36 V", value: "40.2 V peak (SPICE)" },
        { label: "Soft-start inrush", value: "0.34 A @ 140 V/s (SPICE)" },
        { label: "Through-path R", value: "3.13 mΩ (2.28 W Cu @ 27 A)" },
        { label: "Verification", value: "0 ERC/DRC · 261/261 IPC-2581" },
      ],
      tags: ["KiCad 10", "LM74800-Q1", "UCC27517", "ngspice", "Power Electronics", "IPC-2221B", "Python DFM"],
      image: "/images/regen/revf-3d.png",
      imageAlt: "Isometric 3D render of the Rev F Regen Clamp and Soft-Start PCB showing 6 TO-263 MOSFETs, XT60 input/brake, and 5 XT30 outputs",
      imageWidth: 1456,
      imageHeight: 1120,
      interactiveWidget: "regen-inspector",
      links: [
        { label: `regen-clamp-board repo ${EXT}`, href: "https://github.com/sidrk-dev/regen-clamp-board", external: true },
        { label: `11-block schematic (PDF) ${EXT}`, href: "/docs/regen_precharge_schematic.pdf", external: true },
      ],
      specs: [
        { parameter: "Input & distribution", value: "24–48 V DC, 27 A design (XT60 in → 5× XT30PW-F out)", notes: "15 A continuous / 30 A burst per XT30 branch; UVLO ≈ 13.5 V, input OVP cut-off ≈ 57 V" },
        { parameter: "Ideal diode + soft start", value: "TI LM74800QDRRRQ1 + 4× CRSS042N10N (100 V, 4.2 mΩ)", notes: "Q1‖Q7 reverse-blocks in <1 µs; Q2‖Q8 ramps VOUT at ~140 V/s (12 W peak / 1.6 J @ 36 V, <10% DC SOA)" },
        { parameter: "Supply-tracking chopper", value: "LM393 + UCC27517 (4 A, 22 ns) + Q3‖Q9 CRSS042N10N", notes: "0.1% Yageo RT0603B dividers narrow 48 V resistor spread from 3.5 V to 0.6 V p-p; +3.0 to +7.5 V trim, 2.3 V hyst" },
        { parameter: "Self-powered control rail", value: "11.6 V VREG derived from VOUT (CJ431 + SOT-223 BCP56-16)", notes: "Brake chopper remains active even if PSU trips OVP or is unplugged while arm is backdriven" },
        { parameter: "Hardware fault interlocks", value: "Q10/Q11 DGATE latch-off + KSD9700 + 120 V DC Q136 fuse", notes: "Prevents 24 A / 1.15 kW forward PSU latch-on; TÜV 25 A DC alloy thermal fuse clears shorted-FET faults" },
        { parameter: "Copper & fab optimization", value: "125 × 100 mm, 2-layer 1 oz Cu ($65.38 for 5 PCB + 2 PCBA)", notes: "0.2 mm finite-difference solve proved +66 K max tab rise @ 27 A on 1 oz Cu, saving 78% bare-board cost vs 2 oz" },
      ],
      plates: [
        {
          src: "/images/regen/revf-top.png",
          alt: "Top-down 3D render of Rev F Regen Clamp and Precharge PCB showing power path along top and control section below",
          caption: "Rev F top view (125 × 100 mm): high-current path runs straight left-to-right across J1 (XT60 PSU in) → Q1/Q7 ideal diode → Q2/Q8 linear precharge → 4× 470 µF 100 V bulk bank → 5× XT30 motor branches, isolated from the analog comparator and gate-drive bay below.",
          width: 2016,
          height: 1624,
        },
        {
          src: "/images/regen/current-sweep.png",
          alt: "ngspice simulated 15 ms braking pulse peak bus voltage vs returned arm current from 5 A to 27 A",
          caption: "Post-layout ngspice braking sweep (15 ms pulse on 36 V bus, +4 V trip): a single 2 Ω 200 W resistor holds VOUT near 40.24 V up to 20 A before crossing the 44 V moteus r4 limit at 22 A; two parallel 2 Ω resistors (1 Ω effective) extend flat 40.5 V clamping to 35 A.",
          width: 1131,
          height: 565,
        },
        {
          src: "/images/regen/copper-thermal.png",
          alt: "2D finite-difference copper Joule heat input and steady-state temperature rise map at 27 A in 1 oz copper",
          caption: "Custom 2D finite-difference resistive-thermal solve (copper_check.py, 0.2 mm grid across F.Cu + B.Cu + PTH/vias at 27 A): 3.13 mΩ total copper path (2.28 W Cu + 4.90 W MOSFET loss), +66 K peak at Q1 tab and +29 K board mean on 1 oz copper.",
          width: 1430,
          height: 550,
        },
        {
          src: "/images/regen/revf-factory.png",
          alt: "JLCPCB Economic PCBA preview showing 82 machine-placed SMT components including 6 TO-263 MOSFETs",
          caption: "Factory SMT assembly configuration: 82 of 85 surface-mount parts (including 6× TO-263 power MOSFETs, LM74800-Q1, UCC27517, 0.1% sense network, and SMCJ51A TVS diodes) machine-placed on F.Cu; connectors, switch, trimmer, bulk electrolytics, and 3× 1206 100 V MLCCs (C1, C2, C6, hand-soldered to avoid board-flex cracking) complete bring-up.",
          width: 1656,
          height: 1376,
        },
      ],
      relatedSlugs: ["im6014-qdd-arm", "foc-driver", "bldc-actuator"],
    },

    {
      slug: "rp2350-robomaster-arm",
      title: "Distributed 3-MCU 6-DOF Arm Firmware, Multiplexed Absolute Encoders & Live IK Suite",
      shortTitle: "RP2350 6-DOF CAN Firmware & IK",
      subtitle: "Embedded C++17 (XIAO RP2350 / RP2040) · 1 kHz MCP2515 CAN · PyQt 3D IK & PID Tuner · Feb – Jul 2026",
      category: "embedded",
      categoryLabel: "Embedded & controls",
      period: "Feb – Jul 2026",
      status: "Hardware-tested firmware + operator GUIs + ROS 2 MoveIt bridge",
      featured: true,
      tileSub: "1 kHz 3-node CAN bus driving M3508/M2006 ESCs, PCA9548A + AS5600 power-loss pose recovery & bevel-wrist mixing",
      summary:
        "Deterministic multi-microcontroller serial-to-CAN motor control stack for a 6-DOF robotic arm, eliminating startup homing crashes via joint-side absolute encoders and safety-gated desktop IK tooling.",
      metrics: [
        { label: "Control loop", value: "1 kHz deterministic ISR / CAN" },
        { label: "Topology", value: "3× RP2040/RP2350 · 1 Mbps CAN" },
        { label: "Gear ratios", value: "94.23:1 (J1–3) · 44:1 (J4)" },
        { label: "Wrist deadband", value: "0.4° coupled bevel diff mix" },
      ],
      tags: ["C++17", "XIAO RP2350", "CAN Bus (1 Mbps)", "AS5600 + PCA9548A", "Cascaded PID", "PyQt 3D IK", "ROS 2 Control"],
      image: "/images/rp2350-can-architecture.svg",
      imageAlt: "System architecture diagram of the 3-MCU RP2350 1 Mbps CAN motor control and multiplexed AS5600 absolute encoder stack",
      imageWidth: 1200,
      imageHeight: 800,
      links: [
        { label: `RP2350-Robomaster-Control ${EXT}`, href: "https://github.com/sidrk-dev/RP2350-Robomaster-Control", external: true },
        { label: `1 kHz XIAO RP2350 + AS5600 module ${EXT}`, href: "https://github.com/sidrk-dev/shiny-parakeet", external: true },
        { label: `ROS 2 / MoveIt 2 integration ${EXT}`, href: "https://github.com/sidrk-dev/armUS2026", external: true },
      ],
      specs: [
        { parameter: "Microcontroller nodes", value: "3× RP2040 / Seeed XIAO RP2350 + MCP2515 SPI-CAN", notes: "Base node (J1–J3 M3508 @ 94.23:1), J4 node (M3508 @ 44:1), Wrist node (J5–J6 M2006 bevel differential)" },
        { parameter: "Control frequency", value: "1 kHz loop cycle + 1 Mbps CAN bus (24 V)", notes: "Drives up to 8 DJI C620/C610 ESCs per bus with immediate current zeroing on stale/invalid encoder reads" },
        { parameter: "Pose recovery", value: "PCA9548A 8-ch I2C mux + AS5600 joint encoders", notes: "Runtime ENCMAP / ABSPID switching with EEPROM-persisted abs_zero_offset recovers true joint pose across power loss" },
        { parameter: "Differential wrist", value: "Coupled 2-DOF bevel-gear pitch/roll mixer", notes: "motor_a = +pitch + roll, motor_b = +pitch − roll with 0.4° deadband and independent axis/motor speed clamps" },
        { parameter: "Operator tooling", value: "ik_dashboard_qt.py + pid_tuner.py + ros2_control", notes: "Blocks motion until all 3 MCUs report online, config-synced, and telemetry-fresh" },
      ],
      relatedSlugs: ["im6014-qdd-arm", "arm2027-workstation", "foc-driver"],
    },

    {
      slug: "foc-driver",
      title: "Custom 3-Phase BLDC FOC Driver PCB with Dual Inline Phase Current Sensing (FOC_DV)",
      shortTitle: "Custom FOC Driver PCB",
      subtitle: "KiCad · TI DRV8313 + 2× INA240A2D · STM32 SimpleFOC · Oscilloscope Bring-Up · Dec 2025 – Feb 2026",
      category: "power",
      categoryLabel: "Power & PCBs",
      period: "Dec 2025 – Feb 2026",
      status: "Fabricated, hand-assembled & oscilloscope-validated",
      featured: true,
      tileSub: "Hand-soldered DRV8313 + 50 V/V PWM-rejection INA240A2D 2010 shunts; debugged 3.6 V floating-EN ground fault",
      summary:
        "Custom 3-phase brushless gate-driver board separating DRV8313's internal +3.3INTRN LDO rail from the external INA240A2D +3.3V current-sense supply, brought up via systematic firmware-to-power-stage oscilloscope isolation.",
      metrics: [
        { label: "Gate driver", value: "DRV8313 (8–60 V, 2.5 A/ph)" },
        { label: "Current sense", value: "2× INA240A2D + 2010 shunts" },
        { label: "Rail isolation", value: "+3.3INTRN vs +3.3V sense" },
        { label: "Root cause", value: "3.6 V floating EN → missing GND" },
      ],
      tags: ["KiCad", "DRV8313", "INA240A2D", "Inline Current Sense", "STM32", "Oscilloscope Debugging", "SMD Assembly"],
      image: "/images/foc-driver.jpg",
      imageAlt: "Macro microscope photo of hand-soldered DRV8313 28-pin HTSSOP gate driver, INA240A2D current sense amplifier, and 2010 shunt resistors",
      imageWidth: 767,
      imageHeight: 1024,
      interactiveWidget: "foc-schematic",
      links: [
        { label: `KiCad source, Gerbers & BOM ${EXT}`, href: "https://github.com/sidrk-dev/portfolio/tree/main/FOC_DV/FOC_DV", external: true },
      ],
      plates: [
        {
          src: "/images/foc-driver.jpg",
          alt: "Microscope inspection photo of hand-soldered DRV8313PWP, INA240A2D, and 2010 current shunts R4 and R5",
          caption: "Assembled FOC_DV prototype under inspection: 0.65 mm-pitch DRV8313PWP (U1), zero-drift INA240A2D amplifier (U3), 0603 decoupling (C2, C3, C6), and 2010 inline phase shunts (R4, R5).",
          width: 767,
          height: 1024,
          maxRem: 24,
        },
        {
          src: "/images/foc-schematic.png",
          alt: "Full KiCad schematic for FOC_DV showing DRV8313, dual INA240A2D phase shunts, 2x5 MCU control header, and separated +3.3INTRN and +3.3V rails",
          caption: "FOC_DV KiCad schematic: inline 2010 shunts (R4, R5) on phases A and C reconstruct phase B via Kirchhoff's current law (Ia + Ib + Ic = 0) while separating DRV8313's internal +3.3INTRN rail (V3P3 + C4) from the external +3.3V INA240A2D supply.",
          width: 1024,
          height: 627,
        },
      ],
      relatedSlugs: ["regen-clamp-pcb", "bldc-actuator", "rp2350-robomaster-arm"],
    },

    {
      slug: "bldc-actuator",
      title: "Direct-Drive & Planetary QDD Actuator Characterization Test Stand (moteus CAN-FD)",
      shortTitle: "BLDC & QDD Actuator Test Stand",
      subtitle: "mjbots moteus r4.11 · AS5047P 14-bit SPI · NdFeB Demagnetization & 200 Hz Gravity Comp · Feb – Jul 2026",
      category: "actuators",
      categoryLabel: "Actuators & mechanics",
      period: "Feb – Jul 2026",
      status: "Bench-validated across 30-pole-pair direct-drive & 1:8 planetary QDD",
      featured: false,
      tileSub: "First-principles R/L/Kv calibration, 50–200 Hz CAN-FD telemetry, NdFeB demagnetization root-cause & 1:8 QDD gravity comp",
      summary:
        "Locked-rotor and dynamic characterization rig for commodity 30-pole-pair hoverboard motors and 1:8 planetary QDD actuators (Steadywin GWK8108-8) over CAN-FD, uncovering irreversible magnet demagnetization and encoder-PLL overvoltage faults.",
      metrics: [
        { label: "Measured motor", value: "0.265 Ω · 387 µH · 24.18 KV" },
        { label: "Torque loop", value: "200 Hz dq BW · 32 kHz PWM" },
        { label: "Demag diagnosis", value: "8.59 → 6.84 Nm (-20% Kt step)" },
        { label: "Geared QDD", value: "1:8 GWK8108-8 · 200 Hz grav-comp" },
      ],
      tags: ["moteus r4.11", "CAN-FD", "AS5047P", "FOC Physics", "Thermal Demagnetization", "Gravity Compensation", "Python asyncio"],
      image: "/images/bldc-actuator.jpg",
      imageAlt: "Benchtop BLDC robotic actuator characterization test stand with custom 3D-printed fixture, moteus r4.11 controller, and 35V supply",
      imageWidth: 1024,
      imageHeight: 768,
      links: [
        { label: `Characterization report (MD) ${EXT}`, href: "https://github.com/sidrk-dev/portfolio/blob/main/motor_characterization_blog.md", external: true },
      ],
      plates: [
        {
          src: "/images/bldc-actuator.jpg",
          alt: "Custom 3D-printed actuator characterization rig on benchtop with moteus r4.11, USB CAN-FD interface, and regulated 35V bench supply",
          caption: "Actuator test stand with custom 3D-printed structural fixture, mjbots moteus r4.11 (10–44 V) over CAN-FD, AS5047P 14-bit SPI magnetic encoder, threaded Arduino NTC winding thermal monitor, and 35 V regulated bus.",
          width: 1024,
          height: 768,
        },
      ],
      relatedSlugs: ["im6014-qdd-arm", "regen-clamp-pcb", "foc-driver"],
    },

    {
      slug: "food-scooping-vla",
      title: "Contact-Rich 6-DOF Granular Manipulation & Safety-Bounded SE(3) VLA Pipeline",
      shortTitle: "Granular Manipulation VLA (scoop-v1)",
      subtitle: "MuJoCo 3.13 · LeRobot v0.6.1 (ACT / SmolVLA) · 500 Hz Safety Boundary · 497 Automated Tests · Sep 2026",
      category: "vla",
      categoryLabel: "Sim & Physical AI",
      period: "Sep 2026",
      status: "28/30 varied-physics expert gate passed · ACT closed-loop timing study complete",
      featured: false,
      tileSub: "Portion-controlled granular bead scooping (30 g / 60 g) with non-oracle load-cell physics, 0.013 mm geometry audit & SE(3) guards",
      summary:
        "Simulation-first Physical AI testbed evaluating vision-language-action (VLA) and Action Chunking Transformer (ACT) policies on contact-rich granular scooping behind a strict 500 Hz SE(3) rejection boundary.",
      metrics: [
        { label: "Expert gate", value: "28/30 trials (93.3%) varied physics" },
        { label: "Control boundary", value: "500 Hz IK · ≤15 mm / 0.10 rad" },
        { label: "Geometry audit", value: "0.013 mm max solid penetration" },
        { label: "Test suite", value: "497 unit + physics gate tests" },
      ],
      tags: ["MuJoCo", "LeRobot v0.6.1", "ACT / SmolVLA", "SE(3) Control", "Granular Physics", "PyTorch"],
      image: "/images/vla-scoop-architecture.svg",
      imageAlt: "Architecture diagram of the scoop-v1 non-oracle granular manipulation contract, 500 Hz SE(3) safety controller, and LeRobot pipeline",
      imageWidth: 1200,
      imageHeight: 800,
      links: [],
      specs: [
        { parameter: "Observation contract (scoop-v1)", value: "256×256 overhead RGB + 18-D proprioception + 1-D load cell", notes: "0.2 s freshness gate; strictly bans oracle particle positions/masses from policy space" },
        { parameter: "Action parameterization", value: "10–20 step relative SE(3) chunks @ 10 Hz", notes: "p_next = p + Δp (‖Δp‖ ≤ 15 mm), R_next = Exp(Δr_base) R (‖Δr‖ ≤ 0.10 rad); out-of-bounds rejected, never clipped" },
        { parameter: "Physical scale sensor model", value: "Contact-force 1-D bowl load cell", notes: "Models settling dynamics, Gaussian noise, transport latency, and baseline drift; mass conserved to 2.8e-17 kg" },
        { parameter: "Key closed-loop finding", value: "Offline BC MSE 0.0210 ≠ closed-loop contact stability", notes: "2 ms/500 Hz replay timing shift moves 30.00 g deposit to 39.00 g true mass (39.61 g settled load-cell mean)" },
      ],
      relatedSlugs: ["im6014-qdd-arm", "arm2027-workstation"],
    },

    {
      slug: "arm2027-workstation",
      title: "6-DOF ROS 2 Jazzy + MoveIt Servo + SpaceMouse Web Control Workstation (ARM2027)",
      shortTitle: "ARM2027 ROS 2 Servo Workstation",
      subtitle: "ROS 2 Jazzy · Gazebo Harmonic · MoveIt Servo · 6× moteus CAN-FD · Three.js · Sep 2026",
      category: "embedded",
      categoryLabel: "Embedded & controls",
      period: "Sep 2026",
      status: "Containerized stack · 118 unit + 43 MoveIt integration tests passing",
      featured: false,
      tileSub: "6-axis SpaceMouse Cartesian Servo, virtual wrist camera, hardware bring-up sequencer & 6× moteus CAN-FD backend",
      summary:
        "Full-stack containerized operator workstation bridging 6-DOF SpaceMouse teleoperation, MoveIt Servo singularity-aware Cartesian streaming, and safe multi-joint mjbots moteus CAN-FD commissioning.",
      metrics: [
        { label: "Control stack", value: "ROS 2 Jazzy + MoveIt Servo" },
        { label: "Hardware backend", value: "6× moteus CAN-FD + SocketCAN" },
        { label: "Verification", value: "118 unit + 43 MoveIt + Playwright" },
        { label: "Teleop", value: "6-DOF SpaceMouse + wrist cam" },
      ],
      tags: ["ROS 2 Jazzy", "MoveIt Servo", "ros2_control", "moteus CAN-FD", "Three.js", "SpaceMouse", "Docker"],
      image: "/images/arm/arm2027-workstation.png",
      imageAlt: "ARM2027 browser workstation showing 3D 6-DOF robot view, virtual wrist camera picture-in-picture, SpaceMouse 6-axis sliders, and 7-step physical bring-up checklist",
      imageWidth: 1280,
      imageHeight: 2288,
      links: [],
      plates: [
        {
          src: "/images/arm/arm2027-workstation.png",
          alt: "Full ARM2027 control console with 3D viewport, virtual wrist camera, 6-axis SpaceMouse input monitor, and staged CAN-FD commissioning workflow",
          caption: "ARM2027 operator console: 3D digital twin with picture-in-picture wrist camera, live 6-axis SpaceMouse monitor (usable while motors are paused to verify frame axes safely), and a 7-stage CAN-FD hardware commissioning workflow.",
          width: 1280,
          height: 2288,
          maxRem: 36,
        },
        {
          src: "/images/arm/arm2027-robot.png",
          alt: "6-DOF ARM2027 URDF assembly showing joint coordinate frames from base to tool flange",
          caption: "6-DOF ARM2027 kinematic model with explicit joint coordinate frames verified across MoveIt Servo and Gazebo Harmonic.",
          width: 1920,
          height: 1080,
        },
      ],
      relatedSlugs: ["im6014-qdd-arm", "rp2350-robomaster-arm"],
    },

    {
      slug: "crazyflie-swarm",
      title: "Decentralized Crazyflie Nano-Drone Swarm & Multi-Asset Tracking (IEEE CASE 2025)",
      shortTitle: "Crazyflie Swarm (IEEE CASE '25)",
      subtitle: "University of Houston Swarm Robotics Lab · Python · SteamVR Lighthouse 3D · ROS 2 · 2024 – 2025",
      category: "embedded",
      categoryLabel: "Embedded & controls",
      period: "Summer 2024 · Pub. Aug 2025",
      status: "2nd-author paper published in IEEE CASE 2025 (pp. 171–178)",
      featured: false,
      tileSub: "2nd-author IEEE CASE 2025 paper: multi-asset drone swarm tracking, collision avoidance & +50% flight endurance",
      summary:
        "Multi-drone coordination, velocity-obstacle collision avoidance, and motor-mixing optimization on Bitcraze Crazyflie 2.X nano-quadrotors in Prof. Aaron T. Becker's Swarm Robotics Lab, published in IEEE CASE 2025.",
      metrics: [
        { label: "Publication", value: "IEEE CASE 2025 (2nd author)" },
        { label: "Endurance gain", value: "+50% flight time (motor mixing)" },
        { label: "Localization", value: "SteamVR Lighthouse V1 3D" },
        { label: "Pages / DOI", value: "pp. 171–178 · IEEE Xplore" },
      ],
      tags: ["Swarm Robotics", "Python (cflib)", "ROS 2", "Collision Avoidance", "IEEE CASE 2025", "Crazyflie 2.X"],
      image: "/images/crazyflie-swarm-diagram.svg",
      imageAlt: "Velocity-obstacle multi-drone coordination and Lighthouse 3D localization diagram for Crazyflie swarm",
      imageWidth: 1200,
      imageHeight: 800,
      links: [
        { label: `IEEE CASE 2025 paper (DOI) ${EXT}`, href: "https://doi.org/10.1109/CASE58245.2025.11164124", external: true },
      ],
      relatedSlugs: ["rp2350-robomaster-arm", "arm2027-workstation"],
    },

    {
      slug: "medical-device-prototypes",
      title: "Automated Lab Instrumentation: Programmable Vial Flipper & Silent-Stepper Slide Dipper",
      shortTitle: "Automated Lab Devices (TCH)",
      subtitle: "Texas Children's Hospital TIGr Lab · C++ · TMC2209 UART · Onshape · Summer 2025",
      category: "embedded",
      categoryLabel: "Embedded & controls",
      period: "Jun – Aug 2025",
      status: "Deployed in daily lab use · $5,000+ equipment cost saved",
      featured: false,
      tileSub: "Two benchtop lab automation instruments in active research use at Texas Children's Hospital, saving $5,000+",
      summary:
        "Designed, machined/3D-printed, wired, and programmed two custom benchtop automation instruments at Texas Children's Hospital TIGr Lab to replace $5,000+ commercial staining and blood-inversion equipment.",
      metrics: [
        { label: "Cost reduction", value: "$5,000+ vs commercial units" },
        { label: "Drivers", value: "TMC2209 silent UART microstep" },
        { label: "Motion parser", value: "Custom deterministic C++ G-code" },
        { label: "Deployment", value: "In active TIGr Lab research use" },
      ],
      tags: ["C++", "TMC2209 UART", "Stepper Motion Control", "Onshape CAD", "FDM/SLA Prototyping", "Medical Hardware"],
      image: "/images/medical-devices-diagram.svg",
      imageAlt: "Mechanical and control block diagram of the programmable vial flipper and linear-rail TMC2209 slide dipper",
      imageWidth: 1200,
      imageHeight: 800,
      links: [],
      relatedSlugs: ["rp2350-robomaster-arm", "foc-driver"],
    },
  ] as ProjectItem[],

  experience: [
    {
      role: "Independent Robotics Hardware & Controls R&D",
      org: "QDD Manipulation & Power Electronics",
      location: "College Station, TX",
      when: "Feb 2026 — now",
      bullets: [
        "Designed a 24–48 V / 27 A supply-tracking regenerative braking clamp and linear-SOA precharge PCB (Rev F) in KiCad 10 with ngspice verification, 0.1% divider tolerance stacking, and custom 2D finite-difference copper-thermal & IPC-2221B Python audit scripts.",
        "Commissioned a 3-DOF Unitree IM6014 QDD prototype at 6 Mbps RS-485 over ROBOTIS U2D2 on Linux after reverse-engineering Unitree's Enigma-packed SDK DLL in Wine memory; characterized continuous MOSFET vs stator thermal limits (7.09 Nm @ 80 °C) to size a 6:1 UHMWPE helical capstan shoulder and elliptical rolling-contact elbow.",
        "Built a 3-MCU XIAO RP2350 1 kHz CAN + multiplexed AS5600 absolute-encoder firmware stack and safety-gated PyQt 3D IK suite for a 6-DOF RoboMaster arm.",
      ],
    },
    {
      role: "Engineering Intern",
      org: "Texas Children's Hospital — TIGr Lab",
      location: "Houston, TX",
      when: "Jun — Aug 2025",
      bullets: [
        "Designed, CADed in Onshape, 3D-printed, and wrote C++ motion firmware for two custom automated laboratory instruments (programmable blood-vial inverter and TMC2209 linear-rail slide-staining dipper), cutting lab equipment costs by $5,000+.",
        "Implemented UART-configured TMC2209 silent microstepping and a repeatable dwell/speed profile parser still running in daily wet-lab workflows.",
      ],
    },
    {
      role: "Robotics Research Intern (Prof. Aaron T. Becker)",
      org: "University of Houston — Swarm Robotics Lab",
      location: "Houston, TX",
      when: "Jun — Aug 2024",
      bullets: [
        "Developed multi-agent tracking, decentralized velocity-obstacle collision avoidance, and 3D trajectory coordination in Python & ROS 2 for Bitcraze Crazyflie nano-drones under SteamVR Lighthouse localization.",
        "Optimized quadrotor motor-mixing control allocation to extend flight endurance by ~50%; 2nd author on 'Tracking Multiple Moving Assets with a Smaller Group of Drones' (IEEE CASE 2025, pp. 171–178).",
      ],
    },
    {
      role: "Team Captain & Lead Hardware/Software Builder",
      org: "DeBakey Robotics — VEX Team 7390V / 7390A",
      location: "Houston, TX",
      when: "Sep 2021 — Jun 2025",
      bullets: [
        "Led mechanical drivetrain/mechanism CAD, fabrication, and C++ PROS autonomous control (dual-wheel + IMU odometry, lateral/angular PID) across four competitive seasons.",
      ],
    },
  ],

  skills: [
    {
      group: "Power & Mixed-Signal PCBs",
      items: "KiCad 10 (schematic, layout, custom DRU), ideal-diode & linear-SOA precharge (LM74800-Q1), hysteretic regen brake choppers (UCC27517, LM393), 3-phase gate drivers (DRV8313), inline PWM-rejection current sensing (INA240A2D), ngspice transient/thermal simulation, IPC-2221B / IPC-2581 DFM scripting, SMD hot-air/iron rework, oscilloscope bring-up",
    },
    {
      group: "Actuators & Transmissions",
      items: "BLDC / PMSM FOC physics (R, L, Kv/Kt, dq-axis PI, encoder PLL bandwidth, NdFeB thermal demagnetization), QDD planetary actuators (Unitree IM6014, mjbots moteus r4.11, DJI M3508/M2006, Steadywin GWK8108-8), zero-backlash UHMWPE helical capstan drives, anti-parallelogram (APM) rolling-contact joints, coupled bevel-gear differential wrists",
    },
    {
      group: "Embedded, Buses & Controls",
      items: "C/C++17, Python 3.12 (asyncio, PySide6/Qt), STM32 (SWD, SimpleFOC), RP2040 / Seeed XIAO RP2350 (1 kHz hardware timer ISRs), CAN-FD & CAN 2.0B (MCP2515, SocketCAN), 6 Mbps RS-485 binary protocols & CRC32 framing, SPI/I2C encoders (AS5047P, PCA9548A + AS5600), ROS 2 Jazzy, ros2_control, MoveIt 2 / MoveIt Servo, gravity compensation & impedance control",
    },
    {
      group: "Simulation, CAD & Physical AI",
      items: "MuJoCo 3.13–3.16 (equality-constrained rolling joints, granular contact physics), HuggingFace LeRobot v0.6.1 (ACT, SmolVLA, SE(3) incremental contracts), Gazebo Harmonic, Three.js WebGL digital twins, Onshape, SolidWorks, URDF/MJCF/STEP, FDM/SLA 3D printing, laser cutting, Linux / Docker / GitHub Actions CI",
    },
  ],
};
