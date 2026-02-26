## Overview

This project documents the design, assembly, and bring-up debugging of a custom BLDC motor driver PCB built around the Texas Instruments DRV8313 three-phase gate driver. What started as a straightforward motor spin-up turned into a rigorous multi-domain diagnostic exercise spanning firmware, power electronics, and IC datasheet analysis.

---

## Initial Testing: Six-Step Commutation

The first bring-up attempt used a six-step (trapezoidal block) commutation script running on an STM32 microcontroller to command the DRV8313. The motor produced zero response: no movement, no current draw.

Before assuming a hardware issue, I needed to rule out the firmware layer entirely.

---

## 1. Firmware Layer Verification

The STM32 has a significantly more complex hardware timer matrix compared to standard AVR microcontrollers. My initial hypothesis was a software-level timer mapping failure inside the motor control library.

**Action:** Bypassed the motor control library entirely. Wrote a minimal C++ test using `analogWrite()` to generate a raw 490Hz, 50% duty cycle square wave directly across the three PWM output pins, with no library abstraction in the signal path.

**Result:** Oscilloscope verification confirmed three clean 5.0V square waves at the MCU output pins.

**Conclusion:** The MCU and firmware were generating valid PWM logic. The failure resided in the power stage or driver interface.

---

## 2. Driver Board Diagnostics (Power Stage Domain)

With firmware confirmed good, I focused on the driver board itself. The 6-step commutation script was still active, the motor still drew zero current, and the fault pin showed no error.

**Action:** Probed the DRV8313 output phases (OUT1/2/3) and the fault pin (nFAULT).

**Result:** nFAULT read logic HIGH, indicating the chip was not in an overcurrent or thermal shutdown state. However, the output phases showed flat 0V lines instead of the expected 12V amplified PWM.

**Conclusion:** The driver was structurally intact but actively refusing to switch its internal FETs.

---

## 3. Logic Level and Interface Analysis (Hardware Domain)

I moved the oscilloscope probe to the control inputs of the DRV8313 to verify signal integrity between the MCU and the driver.

**Action:** Probed the EN (Enable) pin, which must be driven HIGH to wake the chip from its low-power state.

**Result:** The oscilloscope recorded an anomalous **3.6V floating voltage** on the EN pad, rather than the expected 5.0V logic HIGH from the STM32.

---

## 4. Datasheet Root-Cause Analysis

To understand the 3.6V anomaly, I consulted the Texas Instruments DRV8313 datasheet.

**Electrical Characteristics:** The datasheet specifies an internal 3.3V LDO regulator that powers the chip's core logic. Without a shared ground between the STM32 and the driver board, the EN pin had no valid return path for the logic signal. Instead of sitting at 0V (logic LOW) or 5V (logic HIGH), it floated to the chip's internal logic supply rail (~3.3V) plus parasitic offset, settling at approximately 3.6V.

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
| **Firmware Engineering** | Writing minimal C++ hardware tests to bypass complex libraries during root-cause analysis |
