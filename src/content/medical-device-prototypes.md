## Clinical lab problem

At **Texas Children's Hospital (TIGr Lab)**, wet-lab researchers routinely perform repetitive slide-staining immersion protocols and gentle blood-vial inversions where commercial benchtop instruments cost \$2,500–\$5,000+ per station and still lock technicians into rigid vendor timer presets. Over my Summer 2025 engineering internship, I designed, CADed in **Onshape**, 3D-printed (FDM/SLA), wired, and wrote embedded **C++** firmware for two custom benchtop motion instruments — **saving over \$5,000** and remaining in active daily research use.

## 1. Linear-rail TMC2209 precision slide-staining dipper

- **Mechanics:** Rigid vertical linear-rail carriage carrying multi-slide staining racks across reagent baths with repeatable immersion depth and drip-off clearance.
- **Drive & firmware:** Configured a **Trinamic TMC2209** stepper driver over single-wire **UART** (`StealthChop2` silent current-mode microstepping) driven by a custom lightweight C++ motion/G-code command parser supporting programmable immersion velocities, agitation strokes, and multi-stage dwell timers.

## 2. Low-shear programmable blood-vial inverter

- **Mechanics:** Balanced rotary drum assembly with compliant quick-release vial cradles engineered in Onshape for continuous benchtop duty cycles.
- **Motion profiling:** Smooth trapezoidal acceleration/deceleration profiles across $180^\circ$ inversions keep fluid shear low (preventing sample hemolysis or foaming) while maintaining exact mixing intervals across long assay runs.
