## Swarm localization & multi-asset tracking

During my summer research internship in **Prof. Aaron T. Becker's Swarm Robotics Lab** at the **University of Houston**, I worked on multi-drone target tracking, trajectory coordination, and collision-avoidance software in Python (`cflib`) and **ROS 2** for a fleet of **Bitcraze Crazyflie 2.X** nano-quadrotors ($27\ \mathrm{g}$ takeoff mass) localized indoors via **SteamVR Lighthouse V1** optical 3D positioning.

To coordinate smaller drone teams tracking larger sets of moving ground/aerial assets without centralized bottlenecks, agents combine task-assignment updates with real-time **Velocity Obstacles ($\mathrm{VO}_{i|j}$)** collision deconfliction across intersecting 3D flight corridors.

## Motor-mixing control allocation (+50% flight endurance)

Nano-quadrotors operate on tight battery margins ($250\ \mathrm{mAh}$ 1S LiPo) where aggressive attitude corrections saturate individual brushed coreless motors, wasting $I^2R$ power in asymmetric thrust spikes without producing net lift.

Profiling per-motor PWM saturation during multi-waypoint transitions allowed us to re-weight roll/pitch/yaw vs collective-thrust allocation and smooth jerk transients across trajectory segments — **extending usable multi-drone flight endurance by $\sim 50\%$** across physical flight trials.

## Peer-reviewed publication (IEEE CASE 2025)

- **Citation:** M. Shahsavar, **S. Rajasekaran**, R. Kabin, M. Yannuzzi, and A. T. Becker, *"Tracking Multiple Moving Assets with a Smaller Group of Drones,"* in **2025 IEEE 21st International Conference on Automation Science and Engineering (CASE)**, Aug. 2025, pp. 171–178.
- **DOI:** [10.1109/CASE58245.2025.11164124](https://doi.org/10.1109/CASE58245.2025.11164124)
