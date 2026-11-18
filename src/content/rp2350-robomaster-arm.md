## Architecture & problem solved

Multi-DOF manipulators built from high-reduction brushless gearmotors — here DJI RoboMaster **M3508** ($94.23:1$ on `J1–J3`, $44:1$ on `J4`) and **M2006** bevel-wrist actuators driven by `C620`/`C610` ESCs on a $24\ \mathrm{V}$ bus — suffer from two recurring failure modes in student and prototype stacks:

1. **Power-loss pose amnesia:** Internal ESC Hall/magnetic encoders only report rotor angle $\bmod\ 360^\circ$ before the $94.23:1$ gearbox. Any power cycle, E-stop, or USB reset loses absolute joint angle, causing naive homing routines to slam links into hardstops.
2. **Uncoordinated multi-MCU startup:** Splitting 6 joints + gripper across multiple CAN segments causes violent jumps if one microcontroller begins streaming closed-loop targets while another node is still initializing or running stale gains.

`RP2350-Robomaster-Control` and its modular $1\ \mathrm{kHz}$ firmware core (`shiny-parakeet`) solve both across a **3-node Seeed XIAO RP2350 / RP2040 distributed serial-to-CAN architecture**.

## Deterministic 1 kHz CAN loop & multiplexed AS5600 pose recovery

Each microcontroller node (`base` driving `J1–J3`, `joint4` driving `J4`, and `wrist` driving `J5–J6` + `MD10C` end-effector) executes a hardware-timed **$1\ \mathrm{kHz}$ control cycle** (`LoopCycleController`) communicating over **$1\ \mathrm{Mbps}$ SPI-CAN** (`MCP2515`) to up to 8 DJI ESCs per bus:

- **Dual-source encoder remapping (`ENCMAP` / `ABSPID`):** Joint-side **AS5600** 12-bit magnetic absolute encoders sit behind a **PCA9548A** 8-channel $\mathrm{I^2C}$ multiplexer on `Wire1`. Calibration zero offsets (`abs_zero_offset`) and PID gains persist in RP2350 flash EEPROM so every joint boots knowing its exact physical angle across power cycles without homing motion.
- **Fail-silent sensor watchdog:** If any multiplexed AS5600 channel fails $\mathrm{I^2C}$ ACK or exceeds staleness bounds, `MotorController.hpp` immediately zeroes that channel's outbound CAN current frame before integral windup can build.

## Coupled 2-DOF bevel-gear differential wrist

Joints 5 and 6 share a compact bevel-gear differential where neither motor maps 1-to-1 to a single Euler axis. Firmware closes outer-loop pitch and roll angle PID controllers and mixes velocity references symmetrically into inner ESC speed loops:

$$
\omega_A = +\dot{\theta}_{\mathrm{pitch,cmd}} + \dot{\theta}_{\mathrm{roll,cmd}}, \qquad \omega_B = +\dot{\theta}_{\mathrm{pitch,cmd}} - \dot{\theta}_{\mathrm{roll,cmd}}
$$

with a $0.4^\circ$ positional deadband to eliminate gear-mesh hunting at rest and dual-stage clamping (bounding per-axis command authority before clamping combined motor speed so pitch saturation never flips roll sign).

## Safety-gated PyQt 3D IK & live PID tuning suite

To commission the 6-DOF arm without blind serial commands, I built two desktop operator tools in Python + PyQt + `ikpy`:

- **`ik_dashboard_qt.py`:** Interactive 3D URDF visualizer and live Cartesian IK engine that **refuses to arm motion unless all 3 MCU nodes are connected, configuration hashes match, telemetry timestamps are fresh, and post-reconnect state synchronization passes**.
- **`pid_tuner.py`:** Real-time cascaded Angle $\rightarrow$ Speed PID tuner with live step-response plotting, one-click encoder polarity inversion, and JSON profile export, paired with a containerized **ROS 2 / MoveIt 2** `ros2_control` hardware bridge (`armUS2026`).
