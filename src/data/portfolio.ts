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
      link: "https://github.com/sidrk-dev/bldc-actuator",
      image: "/portfolio/images/bldc-actuator.jpg",
    },
    {
      title: "Custom FOC Driver PCB",
      slug: "foc-driver",
      tags: ["KiCad", "DRV8313", "INA240", "Current Sensing", "SMD Soldering", "STM32", "Debugging"],
      description:
        "Custom BLDC motor driver PCB built around the DRV8313 with inline current sensing on two phases using TI INA240A2D amplifiers. Diagnosed a silent hardware bring-up failure using bare-metal firmware and oscilloscope measurements, tracing the root cause to a missing ground reference that left the enable pin floating at 3.6V.",
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
      link: "#",
    },
    {
      title: "Crazyflie Drone Swarm",
      slug: "crazyflie-swarm",
      tags: ["Python", "ROS", "Path Planning", "IEEE CASE"],
      description:
        "Programmed a swarm of Crazyflie drones with a Python-based coordination protocol for real-time path planning and collision avoidance. Motor optimizations improved battery life by 50%. Co-authored paper accepted to IEEE CASE 2024.",
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
