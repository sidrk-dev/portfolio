## Problem & embodiment design (`scoop-v1`)

Vision-Language-Action (VLA) and imitation-learning benchmarks frequently hide privileged simulator state inside observations or clip wild policy jumps inside forgiving JointPD wrappers — producing policies that look smooth in simulation and fail immediately on physical hardware.

This project builds a **497-test MuJoCo 3.13 + HuggingFace LeRobot v0.6.1** manipulation stack where a 6-DOF robot arm scoops discrete dry granular food beads ($150\text{--}162\ \mathrm{g}$ total mass conserved to $2.78 \times 10^{-17}\ \mathrm{kg}$ numerical precision) from a pan into a weighed bowl to satisfy language-conditioned target portions (`"scoop 30 g"` vs `"scoop 60 g"`).

### Strict non-oracle sensor & SE(3) action contract

`vla/contract.py` enforces a deployable hardware-equivalent interface (`RobotIO`) with **zero oracle particle access**:

- **Observations ($0.20\ \mathrm{s}$ monotonic freshness gate):** `256×256` overhead `uint8` RGB camera frame, $18\text{-D}$ robot state (`q[6]`, `qdot[6]`, `ee_pos[3]`, `ee_rotvec[3]`), target prompt, and a **physical 1-D bowl load-cell model** integrating normal contact forces through realistic mechanical settling time, Gaussian readout noise, transport latency, and zero drift.
- **Sequential incremental $SE(3)$ action chunks ($T = 10\text{--}20$ steps @ $10\ \mathrm{Hz}$):** Rather than absolute poses (which jump discontinuously under camera latency), chunks specify robot-base increments applied via exact $SO(3)$ exponential map composition:

$$
p_{k+1} = p_k + \Delta p_{\mathrm{base}}, \qquad R_{k+1} = \mathrm{Exp}(\Delta r_{\mathrm{base}})\,R_k
$$

subject to per-step norm balls $\|\Delta p_{\mathrm{base}}\|_2 \le 15\ \mathrm{mm}$ and $\|\Delta r_{\mathrm{base}}\|_2 \le 0.10\ \mathrm{rad}$.
- **Reject, never clip (`500 Hz` safety boundary):** A $2\ \mathrm{ms}$ ($500\ \mathrm{Hz}$) bounded IK and dynamics controller validates rotation orthogonality, finite timestamps, norm bounds, joint limits, and collision envelopes — **rejecting invalid chunks with an attributed latched fault rather than silently clipping them**.

## Sub-millimeter solid-geometry audit & teacher isolation

Soft-contact particle simulations can silently leak beads through thin spoon meshes or fake mass transfer. `geometry_audit.py` evaluates exact signed distances against solid primitives across every episode:

- Maximum bead-to-solid penetration: **$0.013\ \mathrm{mm}$** on $30\ \mathrm{g}$ runs ($0.54\text{--}0.79\ \mathrm{mm}$ on $60\ \mathrm{g}$ runs, strictly inside the $1.0\ \mathrm{mm}$ contact-compliance gate); end-effector FK-to-command tracking held within **$0.74\ \mathrm{mm} / 0.12^\circ$**.
- Our portion-aware expert passed **28 / 30 varied-physics trials ($93.3\%$)**, exporting validated multi-modal LeRobot v2 video episodes while quarantining privileged teacher diagnostics inside a non-ingested `.audit/` sidecar.

## Key diagnostic finding: offline BC loss vs. 500 Hz timing equivalence

Before scaling to `SmolVLA` LoRA fine-tuning, I trained an Action Chunking Transformer (`ACT`) baseline with an ImageNet-pretrained `ResNet18` vision backbone (`train_act.py`), reaching a low held-out validation MSE of **`0.0210–0.0225`**. Yet closed-loop physical rollouts failed the deposit gate ($0\ \mathrm{g}$ on seed `12337`, joint-limit trip on seed `42`).

To isolate whether vision or control timing was responsible, I replayed **exact recorded expert action chunks** under two loop configurations:

1. **Matched recording timing (seed `12337`):** First spoon contact at `chunk_021`, first bowl transfer at `chunk_045`, **`30.000 g` true bowl mass** (`30.81 g` settled load-cell mean), `122,000` accepted $500\ \mathrm{Hz}$ steps, `0` rejections.
2. **Shifted `2 ms / 500 Hz` replay boundary (seed `734194281`):** Identical open-loop actions deposited **`39.00 g` (`39.61 g` sensor mean)** — a **$+30\%$ portion overshoot** caused purely by contact-timing drift during the scoop-tilt phase!

This proved a critical deployment lesson for contact-rich Physical AI: **control-step timing is a first-order domain-shift variable**, and offline validation MSE cannot clear a manipulation policy without strict recording-to-execution loop equivalence.
