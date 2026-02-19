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
        "Commodity hoverboard motors repurposed as high-torque robotic actuators — delivering an exceptional torque-to-price ratio compared to any off-the-shelf solution. Characterized motor performance via a custom Python test stand over CAN FD.",
      longDescription: `The Core Idea

Hoverboard motors are one of the best-kept secrets in robotics. For roughly $20–40, you get a large-diameter BLDC motor with an impressive torque output — a torque-to-price ratio that leaves conventional servo motors in the dust. The thesis of this project was simple: can we take these commodity motors and turn them into viable robotic actuators?

The short answer: yes. Here's how.

Choosing the Right Motor Controller

The first challenge was finding a motor controller capable of running Field-Oriented Control (FOC) on a large, multi-pole hoverboard motor. After evaluating several options, I landed on the Moteus r4.11 — a compact, high-performance brushless motor controller that natively supports CAN FD communication and has excellent Python tooling for scripting and data collection.

For position sensing and commutation, I chose the AS5047P absolute magnetic encoder. Unlike incremental encoders, it provides an absolute position reading on startup, which is critical for reliable homing and multi-turn tracking in a robotic joint.

Building the Test Stand

Before integrating the motor into any robot, I needed to characterize it. I built a test stand to answer two key questions:

— How fast can I drive it before it overheats?
— What is the peak torque it can deliver?

Speed was measured directly through the AS5047P encoder, reading electrical and mechanical RPM at increasing voltage levels while monitoring motor temperature. Torque was measured by stalling the motor and reading back the phase currents reported by the Moteus controller — from there, calculating output torque using the motor's Kt constant.

All communication was done over CAN FD to USB, connected to my laptop. A Python script automated the test sequences, logging both speed and torque data and generating plots of the motor's performance envelope.

Results & Next Steps

The characterization data gave us a clear operating map for the motor — peak torque figures, thermal limits, and the voltage headroom available before saturation. These numbers directly informed the design of the custom FOC Driver PCB (a separate project), which aims to bring this same performance into a compact, purpose-built board.

The long-term goal is to integrate these actuators into a legged robot platform, where their low cost and high torque density make them uniquely compelling.`,
      link: "https://github.com/sidrk-dev/bldc-actuator",
      image: "/portfolio/images/bldc-actuator.jpg",
    },
    {
      title: "Custom FOC Driver PCB",
      slug: "foc-driver",
      tags: ["KiCad", "Analog Design", "SMD Soldering", "SimpleFOC"],
      description:
        "Extended the SimpleFOC Mini design with inline current sensing on phases A and C using shunt resistors and op-amp signal conditioning, enabling true closed-loop torque control. Validated phase current waveforms via oscilloscope.",
      longDescription: `
        A custom Brushless DC (BLDC) motor driver designed for FOC applications. 
        
        Features:
        - Integrated inline current sensing for Phase A and C.
        - Compact form factor compatible with simpleFOC library.
        - DRV8313 driver stage.
        - Designed in KiCad and hand-assembled using hot air reflow.
        
        This board enables current-loop control, which is critical for compliance and force-feedback applications in robotics.
      `,
      link: "https://github.com/sidrk-dev/foc-driver", // Placeholder link
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
