'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

interface ComponentInfo {
    ref: string
    value: string
    title: string
    description: string
    specs: string[]
}

const COMPONENT_INFO: Record<string, ComponentInfo> = {
    U1: {
        ref: 'U1', value: 'DRV8313PWP',
        title: 'Three-Phase Gate Driver',
        description: 'The core of the motor driver. The DRV8313 accepts PWM logic signals from the STM32 and drives the six half-bridge FETs that switch current through the motor windings. It includes a bootstrap charge pump for high-side gate drive, plus integrated overcurrent and thermal fault protection.',
        specs: ['Motor supply: 8–60V', 'Output: 2.5A continuous per phase', 'Bootstrap charge pump for high-side gate drive', 'Overcurrent + thermal shutdown with nFAULT flag', 'Package: HTSSOP-28 (PWP)'],
    },
    U2: {
        ref: 'U2', value: '2×5 Pin Header',
        title: 'STM32 / SWD Interface Header',
        description: 'A 10-pin 2.54mm header that serves as the central MCU interface. All PWM control signals, enable pins, and the ADC current sense outputs route through here to the external STM32. The pinout also follows the ARM CoreSight SWD standard for firmware flashing and debugging via ST-Link.',
        specs: ['SWD pins: SWDIO, SWDCLK', 'PWM inputs: INH/INL for all 3 phases', 'nFAULT and nSLEEP control', 'ADC outputs: CA_out, CC_out'],
    },
    U3: {
        ref: 'U3', value: 'INA240A2D',
        title: 'Phase A Current Sense Amplifier',
        description: 'Amplifies the voltage drop across the phase A shunt resistor into a 0–3.3V signal readable by the STM32 ADC. The A2 variant has a fixed 50V/V gain. Enhanced PWM rejection is the key feature here — without it, the fast motor switching transients would saturate the amplifier mid-commutation.',
        specs: ['Fixed gain: 50 V/V', 'Bidirectional: measures + and − current', 'Enhanced PWM rejection for accurate mid-cycle readings', 'Zero-drift for low offset error', 'Supply: isolated +3.3VADC rail'],
    },
    U4: {
        ref: 'U4', value: 'INA240A2D',
        title: 'Phase C Current Sense Amplifier',
        description: 'Measures phase C current. Sensing phases A and C is sufficient because phase B is derived by Kirchhoff\'s current law: Ia + Ib + Ic = 0 for a star-connected motor. This saves one amplifier while enabling full 3-phase current reconstruction for FOC.',
        specs: ['Identical spec to U3 for symmetrical sensing', 'Output: CC_out to STM32 ADC', 'KCL allows Phase B derivation in firmware'],
    },
    R4: {
        ref: 'R4', value: 'Shunt Resistor',
        title: 'Phase A Current Sense Shunt',
        description: 'A low-resistance power resistor placed inline on motor phase A. Current through it creates a voltage drop (V = I × R) that U3 amplifies. The 2010 (2512) package is chosen for its power rating — at full stall current this resistor dissipates meaningful heat.',
        specs: ['Package: R_2010 (2512 footprint)', 'Inline on Phase A between DRV8313 OUT1 and motor terminal', 'Power package required for high stall current'],
    },
    R5: {
        ref: 'R5', value: 'Shunt Resistor',
        title: 'Phase C Current Sense Shunt',
        description: 'Identical role to R4 but on phase C. Both shunts must be the same value to ensure symmetrical gain across the two measurement channels.',
        specs: ['Package: R_2010 (2512 footprint)', 'Inline on Phase C between DRV8313 OUT3 and motor terminal'],
    },
    C1: {
        ref: 'C1', value: '100µF',
        title: 'Bulk Motor Supply Decoupling',
        description: 'Stores charge to supply large transient currents during motor commutation without drooping the supply rail. Without this the sharp current spikes from FET switching can reset the MCU or inject noise into logic signals.',
        specs: ['100µF electrolytic', 'Placed close to DRV8313 VM pin', 'Handles low-frequency transient current'],
    },
    C2: {
        ref: 'C2', value: '100nF',
        title: 'DRV8313 High-Frequency Bypass',
        description: 'Ceramic bypass for the DRV8313 logic supply. Ceramics have very low ESL so they absorb the fast switching edges that the bulk electrolytic cannot. Placed as close to the IC supply pin as possible.',
        specs: ['100nF ceramic, 0603', 'Handles high-frequency switching noise'],
    },
    C3: {
        ref: 'C3', value: '100nF',
        title: 'DRV8313 High-Frequency Bypass (2nd)',
        description: 'Second ceramic bypass on the DRV8313 logic rail for improved high-frequency filtering. Redundant bypassing increases effectiveness across a wider frequency range.',
        specs: ['100nF ceramic, 0603'],
    },
    C4: {
        ref: 'C4', value: '470nF',
        title: 'ADC Reference Decoupling',
        description: 'Filters the +3.3VADC supply that feeds the INA240 amplifiers. Noise on this rail appears as a DC offset or noise floor in the current measurement. Separating and decoupling the ADC reference is what makes the current sensing accurate.',
        specs: ['470nF ceramic, 0603', 'On isolated +3.3VADC rail'],
    },
    C5: {
        ref: 'C5', value: '1µF',
        title: 'INA240 (Phase A) Supply Bypass',
        description: 'Local bypass for U3 (INA240 phase A). Ensures the amplifier has a stable supply during the STM32 ADC sampling window.',
        specs: ['1µF ceramic, 0603'],
    },
    C6: {
        ref: 'C6', value: '1µF',
        title: 'INA240 (Phase C) Supply Bypass',
        description: 'Same role as C5 for U4. Symmetrical bypassing on both current sense channels.',
        specs: ['1µF ceramic, 0603'],
    },
    D1: {
        ref: 'D1', value: 'LED',
        title: 'Fault Indicator LED',
        description: 'Connected to the DRV8313 nFAULT open-drain output. Illuminates when the driver detects overcurrent or overtemperature. During debugging this was essential — when the EN pin floated the LED stayed off, confirming a logic problem rather than a power fault.',
        specs: ['Anode: +3.3V via R3 (1kΩ)', 'Cathode: nFAULT (pulled low on fault)', '0603 package'],
    },
    R3: {
        ref: 'R3', value: '1kΩ',
        title: 'LED Series Resistor',
        description: 'Limits LED forward current. At 3.3V supply with ~2V LED Vf: (3.3 − 2.0) / 1000 = 1.3mA. Dim but clearly visible and well within safe operating range.',
        specs: ['1kΩ, 0603'],
    },
    R7: {
        ref: 'R7', value: '10kΩ',
        title: 'nFAULT Pull-up Resistor',
        description: 'The DRV8313 nFAULT pin is open-drain — it can only sink current, not source it. Without this pull-up the pin would float and read garbage. 10kΩ to +3.3V gives a clean logic-HIGH when no fault is present.',
        specs: ['10kΩ, 0603', 'Pull-up to +3.3V'],
    },
    R1: {
        ref: 'R1', value: '10kΩ',
        title: 'Enable Pin Pull-down',
        description: 'Holds an EN pin LOW when the MCU GPIO is in high-impedance mode (during boot). Without this the DRV8313 could briefly enable during MCU initialization, sending spurious pulses to the motor.',
        specs: ['10kΩ, 0603', 'Pull-down to GND'],
    },
    R2: {
        ref: 'R2', value: '10kΩ',
        title: 'nSLEEP Pull-down',
        description: 'Ensures the DRV8313 starts in sleep mode (outputs disabled) until the MCU explicitly drives nSLEEP HIGH. A safe default state.',
        specs: ['10kΩ, 0603', 'Pull-down to GND'],
    },
    R6: {
        ref: 'R6', value: '10kΩ',
        title: 'Control Pin Pull Resistor',
        description: 'Pull resistor for a DRV8313 control input, ensuring a defined default logic state during MCU initialization.',
        specs: ['10kΩ, 0603'],
    },
    J1: {
        ref: 'J1', value: '2-pin Header',
        title: 'ADC Output Connector',
        description: 'Routes CA_out and CC_out from the INA240 amplifiers to the STM32 ADC input pins. Having a dedicated connector makes it easy to probe the current sense signals with an oscilloscope independently of the MCU header.',
        specs: ['Pin 1: CA_out (Phase A, amplified)', 'Pin 2: CC_out (Phase C, amplified)', '2.54mm pitch'],
    },
    J3: {
        ref: 'J3', value: 'TB001-500-03BE',
        title: 'Motor Phase Terminal Block',
        description: 'Screw terminal block providing the high-current connection between the PCB and the brushless motor phase wires. The 5mm pitch and screw clamping handle the motor current reliably compared to a standard pin header.',
        specs: ['3-position, 5mm pitch', 'Connections: Phase A, Phase B, Phase C', 'Rated for continuous motor current'],
    },
}

// --- SVG Component Definitions ---
// viewBox: 0 0 1100 680
// Layout: DRV8313 center, INA240s bottom-left, MCU header right, motor terminal bottom-center

interface SvgComp {
    id: string
    x: number; y: number; w: number; h: number
    color: string
    labelRef: string
    labelVal: string
    shape: 'ic' | 'rect' | 'cap' | 'res' | 'led' | 'conn'
}

const SVG_COMPONENTS: SvgComp[] = [
    { id: 'U1', x: 380, y: 110, w: 220, h: 400, color: '#0891b2', labelRef: 'U1', labelVal: 'DRV8313PWP', shape: 'ic' },
    { id: 'U2', x: 830, y: 120, w: 88, h: 200, color: '#059669', labelRef: 'U2', labelVal: '2×5 Header\nSWD/MCU', shape: 'conn' },
    { id: 'U3', x: 60, y: 460, w: 140, h: 110, color: '#7c3aed', labelRef: 'U3', labelVal: 'INA240A2D', shape: 'ic' },
    { id: 'U4', x: 260, y: 460, w: 140, h: 110, color: '#7c3aed', labelRef: 'U4', labelVal: 'INA240A2D', shape: 'ic' },
    { id: 'R4', x: 160, y: 290, w: 48, h: 22, color: '#d97706', labelRef: 'R4', labelVal: 'Shunt', shape: 'res' },
    { id: 'R5', x: 390, y: 290, w: 48, h: 22, color: '#d97706', labelRef: 'R5', labelVal: 'Shunt', shape: 'res' },
    { id: 'C1', x: 690, y: 170, w: 28, h: 48, color: '#ca8a04', labelRef: 'C1', labelVal: '100µF', shape: 'cap' },
    { id: 'C2', x: 320, y: 80, w: 22, h: 38, color: '#ca8a04', labelRef: 'C2', labelVal: '100nF', shape: 'cap' },
    { id: 'C3', x: 352, y: 80, w: 22, h: 38, color: '#ca8a04', labelRef: 'C3', labelVal: '100nF', shape: 'cap' },
    { id: 'C4', x: 690, y: 100, w: 22, h: 38, color: '#ca8a04', labelRef: 'C4', labelVal: '470nF', shape: 'cap' },
    { id: 'C5', x: 66, y: 430, w: 22, h: 28, color: '#ca8a04', labelRef: 'C5', labelVal: '1µF', shape: 'cap' },
    { id: 'C6', x: 266, y: 430, w: 22, h: 28, color: '#ca8a04', labelRef: 'C6', labelVal: '1µF', shape: 'cap' },
    { id: 'D1', x: 740, y: 380, w: 32, h: 28, color: '#e11d48', labelRef: 'D1', labelVal: 'LED', shape: 'led' },
    { id: 'R3', x: 800, y: 382, w: 36, h: 20, color: '#d97706', labelRef: 'R3', labelVal: '1kΩ', shape: 'res' },
    { id: 'R7', x: 740, y: 320, w: 36, h: 20, color: '#d97706', labelRef: 'R7', labelVal: '10kΩ', shape: 'res' },
    { id: 'R1', x: 300, y: 410, w: 36, h: 20, color: '#d97706', labelRef: 'R1', labelVal: '10kΩ', shape: 'res' },
    { id: 'R2', x: 300, y: 440, w: 36, h: 20, color: '#d97706', labelRef: 'R2', labelVal: '10kΩ', shape: 'res' },
    { id: 'R6', x: 300, y: 470, w: 36, h: 20, color: '#d97706', labelRef: 'R6', labelVal: '10kΩ', shape: 'res' },
    { id: 'J1', x: 60, y: 360, w: 52, h: 50, color: '#16a34a', labelRef: 'J1', labelVal: 'ADC Out', shape: 'conn' },
    { id: 'J3', x: 430, y: 590, w: 140, h: 52, color: '#16a34a', labelRef: 'J3', labelVal: 'Motor Phases\nTB001-500-03BE', shape: 'conn' },
]

// Wire paths [d attribute]
const WIRES = [
    // VCC rail (horizontal, top)
    { d: 'M 60 55 L 1040 55', color: '#ef4444', label: 'VCC' },
    // +3.3V rail
    { d: 'M 60 92 L 1040 92', color: '#f97316', label: '+3.3V' },
    // GND rail
    { d: 'M 60 652 L 1040 652', color: '#6b7280', label: 'GND' },
    // DRV8313 VM to VCC
    { d: 'M 600 180 L 690 180 L 690 55', color: '#ef4444', label: '' },
    // DRV8313 V3P3 to +3.3INTRN (internal ldo output)
    { d: 'M 600 220 L 680 220 L 680 92', color: '#f97316', label: '' },
    // C1 to VCC
    { d: 'M 704 170 L 704 55', color: '#ef4444', label: '' },
    { d: 'M 704 218 L 704 652', color: '#6b7280', label: '' },
    // C2,C3 bypass to DRV8313 top area
    { d: 'M 331 80 L 331 55', color: '#ef4444', label: '' },
    { d: 'M 331 118 L 331 652', color: '#6b7280', label: '' },
    { d: 'M 363 80 L 363 55', color: '#ef4444', label: '' },
    { d: 'M 363 118 L 363 652', color: '#6b7280', label: '' },
    // C4 on +3.3V
    { d: 'M 701 100 L 701 92', color: '#f97316', label: '' },
    { d: 'M 701 138 L 701 652', color: '#6b7280', label: '' },
    // Phase A wire: DRV OUT1 -> R4 -> J3
    { d: 'M 380 210 L 208 210 L 208 290', color: '#22d3ee', label: 'Phase A' },
    { d: 'M 208 312 L 208 430 L 500 430 L 500 590', color: '#22d3ee', label: '' },
    // Phase B wire: DRV OUT2 -> J3 directly
    { d: 'M 380 270 L 240 270 L 240 575', color: '#a78bfa', label: 'Phase B' },
    { d: 'M 240 575 L 500 575 L 500 590', color: '#a78bfa', label: '' },
    // Phase C wire: DRV OUT3 -> R5 -> J3
    { d: 'M 380 330 L 390 330 L 390 290', color: '#4ade80', label: 'Phase C' },
    { d: 'M 438 290 L 438 560 L 500 560', color: '#4ade80', label: '' },
    // nFAULT wire
    { d: 'M 600 460 L 756 460 L 756 408', color: '#f43f5e', label: 'nFAULT' },
    { d: 'M 756 380 L 756 340', color: '#f43f5e', label: '' },
    { d: 'M 756 320 L 756 92', color: '#f97316', label: '' },
    // R3 to +3.3V
    { d: 'M 836 382 L 836 92', color: '#f97316', label: '' },
    // MCU header to +3.3V and GND
    { d: 'M 874 120 L 874 92', color: '#f97316', label: '' },
    { d: 'M 874 320 L 874 652', color: '#6b7280', label: '' },
    // PWM signals: MCU to DRV IN pins
    { d: 'M 830 160 L 620 160 L 620 155 L 600 155', color: '#94a3b8', label: 'INH1-3' },
    { d: 'M 830 190 L 600 190', color: '#94a3b8', label: '' },
    { d: 'M 830 220 L 600 220', color: '#94a3b8', label: '' },
    // EN signals
    { d: 'M 830 250 L 600 250', color: '#64748b', label: 'EN1-3' },
    { d: 'M 830 270 L 600 270', color: '#64748b', label: '' },
    // INA240 U3 inputs from Phase A wire
    { d: 'M 184 310 L 184 515 L 200 515', color: '#22d3ee', label: '' },
    // INA240 U3 output (CA_out) to J1
    { d: 'M 200 495 L 130 495 L 112 495', color: '#f0abfc', label: 'CA_out' },
    { d: 'M 112 495 L 60 495 L 60 410', color: '#f0abfc', label: '' },
    // INA240 U4 inputs from Phase C wire
    { d: 'M 410 310 L 410 515 L 400 515', color: '#4ade80', label: '' },
    // INA240 U4 output (CC_out) to J1
    { d: 'M 260 495 L 130 495', color: '#f0abfc', label: 'CC_out' },
    // GND connections for INA240s
    { d: 'M 130 570 L 130 652', color: '#6b7280', label: '' },
    { d: 'M 330 570 L 330 652', color: '#6b7280', label: '' },
    // +3.3V to INA240s via C5, C6
    { d: 'M 77 430 L 77 92', color: '#f97316', label: '' },
    { d: 'M 277 430 L 277 92', color: '#f97316', label: '' },
    // Pull resistors R1,R2,R6 to GND
    { d: 'M 336 430 L 380 430 L 380 420', color: '#64748b', label: '' },
    { d: 'M 336 460 L 380 460 L 380 440', color: '#64748b', label: '' },
    { d: 'M 336 490 L 380 490 L 380 460', color: '#64748b', label: '' },
    { d: 'M 300 420 L 280 420 L 280 652', color: '#6b7280', label: '' },
    // R shunt connections
    { d: 'M 196 301 L 380 301', color: '#22d3ee', label: '' },
]

// Net labels
const NET_LABELS = [
    { x: 62, y: 48, text: 'VCC (Motor Power)', color: '#fca5a5' },
    { x: 62, y: 85, text: '+3.3V Logic', color: '#fdba74' },
    { x: 62, y: 658, text: 'GND', color: '#9ca3af' },
    { x: 194, y: 282, text: 'PH_CS_A', color: '#67e8f9' },
    { x: 390, y: 282, text: 'PH_CS_C', color: '#86efac' },
    { x: 750, y: 470, text: 'nFAULT', color: '#fb7185' },
    { x: 74, y: 488, text: 'CA_out', color: '#e879f9' },
]

// Pin labels inside DRV8313
const DRV_PINS_LEFT = [
    { y: 155, label: 'INH1', net: 'pwm' },
    { y: 185, label: 'INH2', net: 'pwm' },
    { y: 215, label: 'INH3', net: 'pwm' },
    { y: 250, label: 'EN1', net: 'en' },
    { y: 270, label: 'EN2', net: 'en' },
    { y: 295, label: 'nSLEEP', net: 'ctrl' },
    { y: 330, label: 'OUT1', net: 'phase' },
    { y: 360, label: 'OUT2', net: 'phase' },
    { y: 390, label: 'OUT3', net: 'phase' },
    { y: 440, label: 'COMP+', net: 'ctrl' },
    { y: 465, label: 'COMP-', net: 'ctrl' },
]
const DRV_PINS_RIGHT = [
    { y: 155, label: 'VM', net: 'pwr' },
    { y: 185, label: 'VCP', net: 'pwr' },
    { y: 215, label: 'V3P3', net: 'pwr' },
    { y: 250, label: 'GND', net: 'gnd' },
    { y: 330, label: 'nFAULT', net: 'fault' },
]

const NET_COLORS: Record<string, string> = {
    pwm: '#94a3b8', en: '#64748b', ctrl: '#6b7280',
    phase: '#22d3ee', pwr: '#ef4444', gnd: '#6b7280', fault: '#f43f5e',
}

function ResistorShape({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
    return (
        <g>
            <line x1={x} y1={y + h / 2} x2={x + 6} y2={y + h / 2} stroke="#d97706" strokeWidth="1.5" />
            <rect x={x + 6} y={y + 2} width={w - 12} height={h - 4} rx="2" fill="#1c1008" stroke="#d97706" strokeWidth="1.5" />
            <line x1={x + w - 6} y1={y + h / 2} x2={x + w} y2={y + h / 2} stroke="#d97706" strokeWidth="1.5" />
        </g>
    )
}

function CapShape({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
    const cx = x + w / 2
    const mid = y + h / 2
    return (
        <g>
            <line x1={cx} y1={y} x2={cx} y2={mid - 5} stroke="#ca8a04" strokeWidth="1.5" />
            <line x1={x + 2} y1={mid - 5} x2={x + w - 2} y2={mid - 5} stroke="#ca8a04" strokeWidth="2" />
            <line x1={x + 2} y1={mid + 5} x2={x + w - 2} y2={mid + 5} stroke="#ca8a04" strokeWidth="2" />
            <line x1={cx} y1={mid + 5} x2={cx} y2={y + h} stroke="#ca8a04" strokeWidth="1.5" />
        </g>
    )
}

function LedShape({ x, y }: { x: number; y: number }) {
    const cx = x + 16
    const cy = y + 14
    return (
        <g>
            <polygon points={`${cx - 8},${cy - 8} ${cx - 8},${cy + 8} ${cx + 8},${cy}`} fill="#e11d48" fillOpacity="0.3" stroke="#e11d48" strokeWidth="1.5" />
            <line x1={cx + 8} y1={cy - 8} x2={cx + 8} y2={cy + 8} stroke="#e11d48" strokeWidth="1.5" />
            <line x1={x} y1={cy} x2={cx - 8} y2={cy} stroke="#e11d48" strokeWidth="1.5" />
            <line x1={cx + 8} y1={cy} x2={x + 32} y2={cy} stroke="#e11d48" strokeWidth="1.5" />
        </g>
    )
}

export default function SchematicViewer() {
    const [selected, setSelected] = useState<string | null>(null)
    const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 })
    const containerRef = useRef<HTMLDivElement>(null)
    const dragStart = useRef<{ px: number; py: number; tx: number; ty: number } | null>(null)
    const lastPinch = useRef<number | null>(null)

    const info = selected ? COMPONENT_INFO[selected] : null

    // Pointer drag
    const onPointerDown = useCallback((e: React.PointerEvent) => {
        if ((e.target as SVGElement).dataset.comp) return
        dragStart.current = { px: e.clientX, py: e.clientY, tx: transform.x, ty: transform.y }
            ; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    }, [transform])

    const onPointerMove = useCallback((e: React.PointerEvent) => {
        if (!dragStart.current) return
        setTransform(t => ({
            ...t,
            x: dragStart.current!.tx + (e.clientX - dragStart.current!.px),
            y: dragStart.current!.ty + (e.clientY - dragStart.current!.py),
        }))
    }, [])

    const onPointerUp = useCallback(() => { dragStart.current = null }, [])

    // Wheel zoom
    const onWheel = useCallback((e: React.WheelEvent) => {
        e.preventDefault()
        const rect = containerRef.current!.getBoundingClientRect()
        const cx = e.clientX - rect.left
        const cy = e.clientY - rect.top
        const delta = e.deltaY > 0 ? 0.9 : 1.1
        setTransform(t => {
            const ns = Math.max(0.3, Math.min(4, t.scale * delta))
            return {
                scale: ns,
                x: cx - (cx - t.x) * (ns / t.scale),
                y: cy - (cy - t.y) * (ns / t.scale),
            }
        })
    }, [])

    // Touch pinch-zoom
    const onTouchMove = useCallback((e: React.TouchEvent) => {
        if (e.touches.length === 2) {
            e.preventDefault()
            const dx = e.touches[0].clientX - e.touches[1].clientX
            const dy = e.touches[0].clientY - e.touches[1].clientY
            const dist = Math.hypot(dx, dy)
            if (lastPinch.current !== null) {
                const delta = dist / lastPinch.current
                setTransform(t => ({ ...t, scale: Math.max(0.3, Math.min(4, t.scale * delta)) }))
            }
            lastPinch.current = dist
        }
    }, [])

    const onTouchEnd = useCallback(() => { lastPinch.current = null }, [])

    const resetView = () => setTransform({ x: 0, y: 0, scale: 1 })

    return (
        <div className="not-prose my-8 rounded-xl border border-white/10 bg-[#080c10] overflow-hidden select-none">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/3">
                <span className="text-xs font-mono text-cyan-400/80 tracking-widest uppercase">FOC_DV — Schematic</span>
                <div className="flex items-center gap-2">
                    <button onClick={() => setTransform(t => ({ ...t, scale: Math.min(4, t.scale * 1.2) }))} className="w-7 h-7 flex items-center justify-center rounded bg-white/5 hover:bg-white/10 text-white/70 text-sm transition-colors">+</button>
                    <button onClick={() => setTransform(t => ({ ...t, scale: Math.max(0.3, t.scale * 0.83) }))} className="w-7 h-7 flex items-center justify-center rounded bg-white/5 hover:bg-white/10 text-white/70 text-sm transition-colors">−</button>
                    <button onClick={resetView} className="px-2 h-7 flex items-center rounded bg-white/5 hover:bg-white/10 text-white/60 text-xs transition-colors">Reset</button>
                </div>
            </div>

            {/* SVG canvas */}
            <div
                ref={containerRef}
                className="relative overflow-hidden cursor-grab active:cursor-grabbing"
                style={{ height: 480 }}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                onWheel={onWheel}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                <svg
                    viewBox="0 0 1100 680"
                    width="1100" height="680"
                    style={{ transform: `translate(${transform.x}px,${transform.y}px) scale(${transform.scale})`, transformOrigin: '0 0', transition: dragStart.current ? 'none' : 'transform 0.05s' }}
                    className="absolute top-0 left-0"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Background grid */}
                    <defs>
                        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                            <circle cx="0" cy="0" r="0.8" fill="#1e293b" />
                        </pattern>
                    </defs>
                    <rect width="1100" height="680" fill="#080c10" />
                    <rect width="1100" height="680" fill="url(#grid)" />

                    {/* Wires */}
                    {WIRES.map((w, i) => (
                        <g key={i}>
                            <path d={w.d} stroke={w.color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
                        </g>
                    ))}

                    {/* Net labels */}
                    {NET_LABELS.map((l, i) => (
                        <text key={i} x={l.x} y={l.y} fill={l.color} fontSize="9" fontFamily="monospace" opacity="0.7">{l.text}</text>
                    ))}

                    {/* DRV8313 Pin labels */}
                    {DRV_PINS_LEFT.map((p, i) => (
                        <g key={i}>
                            <line x1={370} y1={p.y} x2={380} y2={p.y} stroke={NET_COLORS[p.net]} strokeWidth="1.2" />
                            <text x={375} y={p.y - 2} fill={NET_COLORS[p.net]} fontSize="7.5" fontFamily="monospace" textAnchor="end">{p.label}</text>
                        </g>
                    ))}
                    {DRV_PINS_RIGHT.map((p, i) => (
                        <g key={i}>
                            <line x1={600} y1={p.y} x2={610} y2={p.y} stroke={NET_COLORS[p.net]} strokeWidth="1.2" />
                            <text x={605} y={p.y - 2} fill={NET_COLORS[p.net]} fontSize="7.5" fontFamily="monospace">{p.label}</text>
                        </g>
                    ))}

                    {/* Components */}
                    {SVG_COMPONENTS.map((c) => {
                        const isSelected = selected === c.id
                        const hasInfo = !!COMPONENT_INFO[c.id]
                        return (
                            <g
                                key={c.id}
                                data-comp={c.id}
                                onClick={() => hasInfo && setSelected(isSelected ? null : c.id)}
                                style={{ cursor: hasInfo ? 'pointer' : 'default' }}
                            >
                                {/* Glow on select */}
                                {isSelected && (
                                    <rect x={c.x - 4} y={c.y - 4} width={c.w + 8} height={c.h + 8} rx="6" fill={c.color} opacity="0.15" />
                                )}

                                {/* Shape */}
                                {c.shape === 'res' ? (
                                    <ResistorShape x={c.x} y={c.y} w={c.w} h={c.h} />
                                ) : c.shape === 'cap' ? (
                                    <CapShape x={c.x} y={c.y} w={c.w} h={c.h} />
                                ) : c.shape === 'led' ? (
                                    <LedShape x={c.x} y={c.y} />
                                ) : (
                                    <rect
                                        x={c.x} y={c.y} width={c.w} height={c.h} rx="4"
                                        fill={`${c.color}18`}
                                        stroke={isSelected ? c.color : `${c.color}80`}
                                        strokeWidth={isSelected ? 2 : 1.5}
                                    />
                                )}

                                {/* Reference label */}
                                <text
                                    x={c.x + c.w / 2} y={c.y + 14}
                                    textAnchor="middle" fill={c.color} fontSize="10" fontWeight="600" fontFamily="monospace"
                                    pointerEvents="none"
                                >{c.labelRef}</text>

                                {/* Value label — handle multiline */}
                                {c.labelVal.split('\n').map((line, li) => (
                                    <text
                                        key={li}
                                        x={c.x + c.w / 2} y={c.y + 26 + li * 12}
                                        textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace"
                                        pointerEvents="none"
                                    >{line}</text>
                                ))}

                                {/* Clickable indicator dot */}
                                {hasInfo && !isSelected && (
                                    <circle cx={c.x + c.w - 6} cy={c.y + 6} r={3} fill={c.color} opacity="0.7" pointerEvents="none" />
                                )}
                            </g>
                        )
                    })}
                </svg>

                {/* Hint */}
                <div className="absolute bottom-2 right-3 text-[10px] text-white/30 font-mono pointer-events-none">
                    scroll to zoom · drag to pan · click component for info
                </div>
            </div>

            {/* Info Panel */}
            <div
                className="border-t border-white/10 overflow-hidden transition-all duration-300"
                style={{ maxHeight: info ? 320 : 0 }}
            >
                {info && (
                    <div className="p-5 space-y-3">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-white/10 text-cyan-300">{info.ref}</span>
                                    <span className="font-mono text-xs text-white/50">{info.value}</span>
                                </div>
                                <h3 className="text-white font-semibold text-base">{info.title}</h3>
                            </div>
                            <button onClick={() => setSelected(null)} className="text-white/40 hover:text-white/80 text-lg leading-none mt-1 shrink-0">×</button>
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed">{info.description}</p>
                        {info.specs.length > 0 && (
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                                {info.specs.map((s, i) => (
                                    <li key={i} className="text-xs text-gray-400 flex items-start gap-2">
                                        <span className="text-cyan-500 mt-0.5 shrink-0">›</span>{s}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
