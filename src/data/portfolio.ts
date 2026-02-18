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
      tags: ["C++", "PCB Design", "FOC", "CAN Bus", "AS5600"],
      description:
        "Reverse-engineered hoverboard BLDC motors into high-torque robotic actuators. Implemented Field-Oriented Control (FOC) for silent torque control, integrated magnetic encoders for closed-loop feedback, and designed a custom motor controller PCB with CAN communication.",
      longDescription: `
        This project involved reverse-engineering readily available hoverboard BLDC motors to create high-performance, low-cost robotic actuators. 
        
        Key challenges included:
        - designing a custom PCB to mount the AS5600 magnetic encoder.
        - implementing FOC (Field Oriented Control) on an STM32/RP2040 microcontroller for smooth, silent torque control.
        - debugging CAN bus communication for reliable multi-motor coordination.

        The result is a actuator capable of ~15Nm peak torque with position control, suitable for legged robots and arm manipulators.
      `,
      link: "https://github.com/sidrk-dev/bldc-actuator", // Placeholder link
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
