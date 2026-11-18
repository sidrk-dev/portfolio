## Workstation architecture

`ARM2027` is a containerized 6-DOF manipulator control and hardware-commissioning workstation built on **ROS 2 Jazzy**, **Gazebo Harmonic**, **`ros2_control`**, **MoveIt Servo**, and a six-controller **`mjbots moteus` CAN-FD** hardware interface.

Instead of requiring multi-terminal `ros2 topic pub` incantations during physical bring-up, a lightweight local bridge serves a unified **Three.js (`0.180.0`) browser console** combining live 3D joint telemetry, a picture-in-picture virtual wrist camera, 6-axis **3Dconnexion SpaceMouse** teleoperation, and a staged 7-step hardware commissioning checklist.

## Safe SpaceMouse teleoperation & MoveIt Servo pipeline

- **Frame-verified 6-DOF teleop:** Supports `Move` (translational), `Rotate` (rotational), full `6-axis` Cartesian twist streaming (`Base / world` or `Tool` frame), and single-`Joint` jogging, with MoveIt Servo singularity deceleration and deadman-button pause/hold semantics.
- **Paused raw-input inspection:** All six SpaceMouse axes (`X, Y, Z, RX, RY, RZ`) render live in the operator input monitor **while motor control is paused**, allowing axis polarity and deadzones to be verified before energizing physical actuators.
- **7-stage physical bring-up sequencer:** Enforces motor-off CAN-FD ID probing, configuration backup before vendor calibration, two-point output-angle ratio/direction verification, travel/torque limit staging, and incremental-to-absolute startup checks.

## Verification & concurrency hardening

Hardened 17 subtle edge cases across process lifecycle, SocketCAN disconnect handling, deadman release, and atomic JSON configuration persistence — backed by **118 unit tests**, **43 MoveIt integration tests**, and automated desktop/mobile Playwright UI verification.
