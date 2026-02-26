export const portfolio = {
  personal: {
    name: "Siddharth Rajasekaran",
    roles: [
      "Hardware Engineer",
      "PCB Designer",
      "Robotics Builder",
      "FOC Developer",
    ],
    bio: "I'm a robotics and hardware engineer at Texas A&M (Class of 2029), passionate about building robots from silicon to firmware. I specialize in BLDC motor control, PCB design, and embedded systems.",
    email: "siddharthrk.dev@gmail.com",
    github: "https://github.com/sidrk-dev",
    linkedin: "https://linkedin.com/in/siddharthrajasekaran",
    twitter: "#",
    location: "Houston, TX",
  },
  stats: [
    { label: "Internships", value: 2 },
    { label: "IEEE Publication", value: 1 },
    { label: "Custom PCBs", value: 2 },
    { label: "Battery Improvement", value: "50%" },
  ],
  projects: [
    {
      title: "BLDC Robot Actuator",
      slug: "bldc-actuator",
      tags: ["Moteus r4.11", "AS5047P", "CAN FD", "Python", "FOC", "Robotics"],
      description:
        "Commodity hoverboard motors repurposed as high-torque robotic actuators, delivering an exceptional torque-to-price ratio compared to any off-the-shelf solution. Characterized motor performance via a custom Python test stand over CAN FD.",
      longDescription: `## The Core Idea

Hoverboard motors are one of the best-kept secrets in robotics. For roughly \$20-40, you get a large-diameter BLDC motor with an impressive torque output, delivering a torque-to-price ratio that leaves conventional servo motors in the dust. The thesis of this project was simple: can we take these commodity motors and turn them into viable robotic actuators?

The short answer: yes. Here's how.

## Choosing the Right Motor Controller

The first challenge was finding a motor controller capable of running Field-Oriented Control (FOC) on a large, multi-pole hoverboard motor. After evaluating several options, I landed on the Moteus r4.11: a compact, high-performance brushless motor controller that natively supports CAN FD communication and has excellent Python tooling for scripting and data collection.

For position sensing and commutation, I chose the AS5047P absolute magnetic encoder. Unlike incremental encoders, it provides an absolute position reading on startup, which is critical for reliable homing and multi-turn tracking in a robotic joint.

---

When building an actuator for real-world use, guessing at motor performance is not enough. You need data. I designed and built a complete characterization and control suite for a **400W hoverboard hub motor** driven by a [mjbots moteus r4.11](https://mjbots.com/products/moteus-r4-11) field-oriented controller. The suite covers locked-rotor torque testing, velocity sweep profiling, real-time multi-sensor telemetry, automated data logging, and an experimental haptic feedback mode. This post covers the full stack: from winding physics to async Python architecture.

---

## The Hardware Stack

| Component | Specs |
|---|---|
| Hoverboard hub motor | 400W, 36V, BLDC, 30 pole pairs |
| mjbots moteus r4.11 | CAN-FD FOC controller, 54V/100A peak |
| AS5047P magnetic encoder | 14-bit resolution, SPI, 200Hz observer |
| Arduino + NTC thermistor | External motor winding temperature |
| 35V regulated bench supply | Stiff bus voltage for repeatable tests |

---

## Motor Physics: What the Calibration Reveals

Before writing a single line of test code, you need to understand what you are driving. I ran the moteus automated calibration pipeline, which performs a sequence of controlled electrical measurements to fully characterize the motor from first principles. No datasheet required.

### How Each Parameter is Measured

**Winding Resistance (0.265 Ohm):** The calibrator locks the rotor stationary and injects a known DC voltage across two motor phases, then measures the resulting steady-state current. With back-EMF eliminated because the rotor is not spinning, \`R = V / I\` gives direct phase resistance. This value is critical for computing the maximum thermally-sustainable current and predicting copper losses under load.

**Phase Inductance (387 uH):** The calibrator sweeps a small AC current signal across the winding at known frequencies and measures the phase lag between voltage and current. The reactance \`X_L = 2*pi*f*L\` gives inductance directly. This value determines the current loop bandwidth. The moteus auto-tunes its current loop PI gains directly from this measurement:

\`\`\`
pid_dq_kp: 0.487       # proportional gain
pid_dq_ki: 333.07      # integral gain
torque_bandwidth: 200 Hz
\`\`\`

**KV (24.18 RPM/V):** With the motor spinning freely at a known speed driven open-loop, the calibrator reads the back-EMF amplitude on the undriven phase. Since \`BEMF = KV * omega\`, dividing out the speed gives the torque constant \`Kt = 1/KV\`, which is the fundamental ratio between current and torque output.

**Pole Pair Mapping (30 pairs, 64-entry offset table):** The calibrator slowly rotates the rotor through one full mechanical revolution while commanding known electrical angles and recording the encoder reading at each step. This maps every electrical cycle to physical rotor position and detects non-uniformities in magnet spacing or flux. The resulting 64-entry offset table is applied in real-time at every commutation step, compensating for manufacturing tolerances that would otherwise produce torque ripple at the pole-pair frequency.

Final calibration results:

| Parameter | Measured Value |
|---|---|
| Pole pairs | 30 |
| Winding resistance | **0.265 Ohm** |
| Phase inductance | **387 uH** |
| KV | **24.18 RPM/V** |
| Current loop bandwidth | 200 Hz |
| Current quality factor | 74.69% |

The 30-pole-pair count is significant. Hoverboard hub motors use a high pole count to produce high torque at low RPM without a gearbox, running direct drive. This means electrical commutation happens 30x per mechanical revolution, which demands a fast control loop. The moteus handles this with a **32kHz PWM switching frequency** and a dedicated Cortex-M4 + FPGA signal chain.

---

## CAN-FD Communication

The moteus controller communicates over **CAN-FD** (Flexible Data-Rate CAN), not standard CAN. CAN-FD allows data payloads up to 64 bytes versus 8 bytes on classic CAN, and bit rates up to 8 Mbit/s on the data phase. For real-time motor control this matters because you can fit a full position, velocity, torque, and telemetry command-response pair in a single frame without fragmentation.

The moteus protocol uses a compact binary register map. Each register has a known address:

\`\`\`python
REG_POSITION  = 0x001
REG_VELOCITY  = 0x002
REG_TORQUE    = 0x003
REG_Q_CURRENT = 0x005
REG_FAULT     = 0x00b
REG_VOLTAGE   = 0x00d
REG_TEMP      = 0x00e   # Controller board temperature
\`\`\`

Commands and queries are transactional. A single \`set_position()\` call sends a command frame and receives a reply containing the requested telemetry in the same round-trip. My control loop achieves **50Hz closed-loop updates** over this interface using the moteus Python SDK, running inside a Python \`asyncio\` event loop.

---

## The AS5047P Magnetic Encoder

Position feedback is provided by an **AS5047P** absolute magnetic rotary encoder. It is a 14-bit (16,384 counts/rev) Hall-effect sensor that reads from a diametrically magnetized magnet on the rotor shaft over SPI. Unlike optical encoders, it has no moving parts and is immune to contamination, making it well suited for motor applications.

The moteus runs a **dedicated encoder observer** tuned to 200Hz bandwidth:

\`\`\`
encoder_filter_kp: 1013.4
encoder_filter_ki: 256753.5
\`\`\`

This Kalman-like filter fuses raw encoder counts with the motor dynamic model to produce a smooth, low-latency velocity estimate even at high pole counts. This is critical for stable current control at 30 pole pairs, since phase lag in the velocity estimate would corrupt the FOC commutation angle and produce instability.

The calibration process maps encoder position to electrical angle across all 30 pole pairs, producing a lookup table that compensates for magnet placement tolerances and encoder eccentricity.

---

## Locked-Rotor Torque Test

The core test is a **locked-rotor (stall) torque characterization**. The motor is mechanically clamped, and torque is commanded via a linear ramp from 0 to 15 Nm over 10 seconds, then held at maximum for 2 seconds. The key control configuration is pure feedforward torque mode:

\`\`\`python
await self.c.set_position(
    position=math.nan,    # No position target
    velocity=0.0,
    kp_scale=0.0,         # PID disabled
    kd_scale=0.0,
    feedforward_torque=cmd_torque,
    maximum_torque=MAX_TEST_TORQUE + 1.0,
    query=True
)
\`\`\`

Setting \`kp_scale=0\` and \`kd_scale=0\` bypasses the position PID entirely. The controller becomes a pure current amplifier. Commanded torque maps directly to q-axis current via \`Iq = T / Kt\`, giving a direct measurement of the motor current-to-torque conversion.

### Multi-Layer Safety Interlock System

Three independent abort conditions protect hardware during high-current stall testing:

\`\`\`
1. Slip guard:       abort if |velocity| > 1.0 rev/s   (rotor not locked)
2. Controller temp:  abort if moteus board > 60 C       (register 0x00e)
3. Motor temp:       abort if winding sensor > 60 C     (Arduino serial)
\`\`\`

If any condition triggers, \`set_stop()\` is called immediately and the partial dataset is flushed to disk.

---

## Multi-Sensor Fusion: Arduino + moteus Telemetry

The moteus reports its own **controller board temperature**, but that tells you nothing about motor winding health. The windings are what actually fails first under sustained stall current. Winding temperature is a direct proxy for insulation life and magnet integrity.

I added an Arduino with an NTC thermistor mounted to the motor casing and fused both temperature channels into the telemetry stream. The challenge was that the main control loop runs async at 50Hz, so blocking serial reads would stall the entire loop. The solution is a background reader thread using a producer-consumer pattern:

\`\`\`python
class ArduinoTempReader:
    def __init__(self, port, baud):
        self.latest_temp = None
        self._stop = threading.Event()
        self._ser = serial.Serial(port, baud, timeout=1)
        self._thread = threading.Thread(target=self._read_loop, daemon=True)
        self._thread.start()

    def _read_loop(self):
        while not self._stop.is_set():
            raw = self._ser.readline().decode('utf-8', errors='replace').strip()
            value_str = raw.split(':')[-1].strip().split()[0]
            self.latest_temp = float(value_str)   # always fresh, non-blocking
\`\`\`

The async control loop samples \`arduino.latest_temp\` each cycle with zero latency added to the critical path. The live console output shows both thermal channels simultaneously:

\`\`\`
[HOLD] Cmd: 15.00 Nm | Meas: 6.86 Nm | Vel: 0.00 r/s | V: 35.00V | Ctrl: 43.0C | Motor: 40.0C
\`\`\`

Both channels are timestamped and written to CSV at 50Hz for post-hoc thermal analysis.

---

## Speed Sweep and Torque-Speed Curve

\`speed_test.py\` sweeps the motor from 1 to 40 rev/s in 2 rev/s increments, holding each step for 5 seconds while logging velocity tracking error, torque, and bus voltage. An automatic saturation detector aborts the sweep when the motor can no longer follow the commanded velocity:

\`\`\`python
if step_data['max_velocity_achieved'] < velocity * 0.5 and velocity > 5.0:
    print("Physical limit reached. Aborting sweep.")
    break
\`\`\`

With KV = 24.18 RPM/V and a 35V bus, theoretical no-load max speed is approximately 846 RPM (14.1 rev/s). The sweep quantifies how much the real speed falls short of this ideal due to resistance losses, frictional loading, and controller current limits.

---

## Haptic Feedback Mode

As a separate application on the same hardware stack, I implemented a **haptic detent knob**. The motor simulates the feel of a precision mechanical encoder at 100Hz. The control law runs a real-time virtual spring, damper, and friction model:

\`\`\`python
spring_torque   = STIFFNESS * position_error        # restoring force to detent
damping_torque  = -DAMPING * current_vel            # velocity-proportional drag
friction_torque = -copysign(FRICTION, current_vel)  # coulomb friction
total_torque    = spring_torque + damping_torque + friction_torque
\`\`\`

This demonstrates closing a real-time feedback loop at the torque level, which is the same technique used in force-controlled exoskeletons, haptic surgical tools, and collaborative robot arms.

---

## Data Pipeline and Root Cause Analysis

All test runs auto-save timestamped CSVs. \`plot_results.py\` generates matplotlib figures with dual y-axes, estimated current overlays using the measured \`Kt\`, and peak annotations.

During testing, I discovered a revealing anomaly. The first locked-rotor run measured **8.59 Nm**, but every subsequent run stabilized at **6.84 Nm**, a permanent 20% reduction. I systematically eliminated causes:

- **Supply voltage:** Rock-solid at 35.00V across all runs. Ruled out.
- **Velocity creep (back-EMF):** Velocity read 0.00 r/s in later runs. Ruled out.
- **Thermal winding resistance rise:** This would cause gradual drift, not a one-time step change.

The data pointed to **partial permanent magnet demagnetization**. The second test pushed motor surface temperature to 64C, and internal winding temperature likely reached 80 to 100C. At those temperatures, the coercivity of NdFeB or ferrite magnets can drop below the demagnetizing field generated by 20A of stall current, causing irreversible flux loss. The result is a permanently reduced torque constant \`Kt\`, observable as a one-time step decrease in measured torque that does not recover with cooling.

---

## Skills Demonstrated

| Area | What Was Done |
|---|---|
| **Motor Control** | FOC feedforward torque mode, back-EMF analysis, Kt measurement, demagnetization diagnosis |
| **Embedded Systems** | CAN-FD protocol, SPI encoder integration, AS5047P observer tuning, Arduino serial peripherals |
| **Software Architecture** | Python asyncio + threading, producer-consumer pattern, 50Hz real-time telemetry loop |
| **Signal Processing** | Encoder observer filter design (Kp=1013, Ki=256K), velocity estimation from 14-bit position |
| **Test Engineering** | Multi-layer safety interlocks, automated timestamped logging, multi-run repeatability analysis |
| **Root Cause Analysis** | Data-driven failure hypothesis from telemetry signatures |

The full codebase is on [GitHub](https://github.com).
`,
      link: "https://github.com/sidrk-dev/bldc-actuator",
      image: "/portfolio/images/bldc-actuator.jpg",
    },
    {
      title: "Custom FOC Driver PCB",
      slug: "foc-driver",
      tags: ["KiCad", "DRV8313", "SMD Soldering", "SimpleFOC", "Oscilloscope", "STM32", "Debugging"],
      description:
        "Custom BLDC motor driver PCB built around the DRV8313. Diagnosed a silent hardware fault using bare-metal firmware and oscilloscope measurements, tracing the root cause to a missing ground reference that left the enable pin at an anomalous 3.6V floating voltage.",
      longDescription: `
## Overview

This project documents the design, assembly, and bring-up debugging of a custom BLDC motor driver PCB built around the Texas Instruments DRV8313 three-phase gate driver. What started as a straightforward motor spin-up turned into a rigorous multi-domain diagnostic exercise spanning firmware, power electronics, and IC datasheet analysis.

---

## Initial Testing: Six-Step Commutation

The first bring-up attempt used a six-step (trapezoidal block) commutation script running on an STM32 microcontroller to command the DRV8313. The motor produced zero response: no movement, no current draw.

Before assuming a hardware issue, I needed to rule out the firmware layer entirely.

---

## 1. Firmware Layer Verification

The STM32 has a significantly more complex hardware timer matrix compared to standard AVR microcontrollers. My initial hypothesis was a software-level timer mapping failure inside the motor control library.

**Action:** Bypassed the library abstraction layer entirely. Wrote a bare-metal C++ script using \`analogWrite()\` to generate a raw 490Hz, 50% duty cycle square wave across pins 5, 6, and 9.

**Result:** Oscilloscope verification confirmed three clean 5.0V square waves at the MCU output pins.

**Conclusion:** The MCU and firmware were generating valid PWM logic. The failure resided in the power stage or driver interface.

---

## 2. Driver Board Diagnostics (Power Stage Domain)

To rule out a flawed sine-wave (SPWM) commutation strategy, I implemented basic 6-step trapezoidal block commutation. The motor still drew zero current.

**Action:** Probed the DRV8313 output phases (OUT1/2/3) and the fault pin (nFT).

**Result:** nFT read logic HIGH, indicating the chip was not in an overcurrent or thermal shutdown state. However, the output phases showed flat 0V lines instead of the expected 12V amplified PWM.

**Conclusion:** The driver was structurally intact but actively refusing to switch its internal FETs.

---

## 3. Logic Level and Interface Analysis (Hardware Domain)

I moved the oscilloscope probe to the control inputs of the DRV8313 to verify signal integrity between the MCU and the driver.

**Action:** Probed the EN (Enable) pin, which must be driven HIGH to wake the chip from its low-power state.

**Result:** The oscilloscope recorded an anomalous **3.6V floating voltage** on the EN pad, rather than the expected 5.0V logic HIGH from the Arduino Uno R4.

---

## 4. Datasheet Root-Cause Analysis

To understand the 3.6V anomaly, I consulted the Texas Instruments DRV8313 datasheet.

**Electrical Characteristics:** The datasheet specifies an internal 3.3V LDO regulator that powers the chip's core logic. The 3.6V reading indicated that the 5V signal from the Arduino was not being interpreted cleanly and was likely being clamped by internal protection diodes (3.3V LDO + approximately 0.3V diode drop).

**Truth Table Analysis:** According to the IC's logic table (Table 1), if the ENx pins do not register a clean logic HIGH, the output H-bridges default to a High-Impedance (Hi-Z) state, essentially acting as an open circuit. This explained the flat 0V output phases despite the fault pin reading healthy.

---

## Resolution

The floating intermediate voltage identified a **missing common ground reference** between the 5V MCU logic domain and the driver's isolated logic rail. By establishing a unified 0V reference and correctly leveling the enable pin to match the driver's internal thresholds, the DRV8313 successfully exited the Hi-Z state. The PWM signals amplified correctly and the motor spun.

---

## Skills Demonstrated

| Area | What Was Done |
|---|---|
| **System-Level Debugging** | Methodical isolation of faults across software abstraction layers, MCU hardware timers, and power electronics |
| **Test and Measurement** | Proficient use of oscilloscopes for validating digital logic integrity and power stage outputs |
| **Datasheet Navigation** | Cross-referencing anomalous hardware behaviors with manufacturer electrical specifications and truth tables to determine IC states |
| **Firmware Engineering** | Writing bare-metal C++ hardware tests to bypass complex libraries during root-cause analysis |
`,
      link: "https://github.com/sidrk-dev/foc-driver",
      image: "/portfolio/images/foc-driver.jpg",
    },
    {
      title: "Medical Device Prototypes",
      subtitle: "Texas Children's Hospital",
      slug: "medical-device-prototypes",
      tags: ["Arduino", "C++", "TMC2209", "Onshape", "UART"],
      description:
        "Designed and prototyped two custom medical devices at TIGr Lab, reducing equipment costs by $5,000+. Built a programmable sample-flipping device with stepper motor control and a precision dipping device with repeatable motion firmware.",
      longDescription: `
        During my internship at Texas Children's Hospital TIGr Lab, I engineered two automated lab devices to replace expensive commercial alternatives.

        1. **Sample Flipper:** A programmable device to gently invert blood sample vials at specific intervals. 
           - Tech: Arduino, Stepper Motors, 3D printed chassis.
        
        2. **Precision Dipper:** An automated dipping mechanism for slide staining.
           - Tech: Linear rails, TMC2209 drivers for silent operation, custom G-code parser.
        
        Both devices are currently in use by the research team, improving workflow efficiency and reproducibility.
      `,
      link: "#",
    },
    {
      title: "Crazyflie Drone Swarm",
      slug: "crazyflie-swarm",
      tags: ["Python", "ROS", "Path Planning", "IEEE CASE"],
      description:
        "Programmed a swarm of Crazyflie drones with a Python-based coordination protocol for real-time path planning and collision avoidance. Motor optimizations improved battery life by 50%. Co-authored paper accepted to IEEE CASE 2024.",
      longDescription: `
        Developed a decentralized coordination framework for a swarm of Crazyflie nano-drones.

        Contributions:
        - Implemented a velocity obstacle based collision avoidance algorithm in Python.
        - Optimized motor mixing algorithms to extend flight time by ~50%.
        - Integrated the system with ROS 2 for ground station monitoring.
        - Conducted real-world flight tests validating the swarm behavior.
        
        The research was published in IEEE CASE 2024.
      `,
      link: "#",
    },
  ],
  skills: [
    {
      category: "Motor Control",
      items: [
        "BLDC",
        "FOC",
        "PID",
        "PWM",
        "SimpleFOC",
        "Moteus",
        "Torque Control",
        "Encoder Integration",
      ],
    },
    {
      category: "Communication",
      items: ["CAN Bus", "UART", "I2C", "SPI", "USB"],
    },
    {
      category: "Hardware",
      items: [
        "PCB Design",
        "SMD Soldering",
        "Oscilloscope",
        "Multimeter",
        "Schematic Capture",
        "Prototyping",
      ],
    },
    {
      category: "Software",
      items: ["C/C++", "Python", "MATLAB", "ROS", "Git", "Arduino IDE"],
    },
    {
      category: "CAD",
      items: [
        "Onshape",
        "SolidWorks",
        "3D Printing (FDM/SLA)",
        "Laser Cutting",
      ],
    },
  ],
  experience: [
    {
      role: "Engineering Intern",
      company: "Texas Children's Hospital",
      location: "Houston TX",
      duration: "Jun–Aug 2025",
      description: "Designed and prototyped custom medical devices.",
    },
    {
      role: "Research Intern",
      company: "University of Houston Swarm Robotics Lab",
      location: "Houston TX",
      duration: "Jun–Aug 2024",
      description: "Worked on Crazyflie drone swarm coordination and control.",
    },
    {
      role: "Team Captain & Lead Builder",
      company: "DeBakey Robotics VEX Team 7390V",
      location: "Houston TX",
      duration: "Sep 2021–Jun 2025",
      description: "Led the team in designing and building competitive robots.",
    },
  ],
};
