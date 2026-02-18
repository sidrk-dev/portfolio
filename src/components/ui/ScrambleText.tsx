"use client";

import { useEffect, useState, useRef } from "react";
import { clsx } from "clsx";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789<>/{}[]";

interface ScrambleTextProps {
    texts: string[];
    className?: string;
    delay?: number; // Start delay in seconds
}

export const ScrambleText = ({ texts, className, delay = 0 }: ScrambleTextProps) => {
    const [displayText, setDisplayText] = useState<string>("");
    const [resolvedMask, setResolvedMask] = useState<boolean[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isStarted, setIsStarted] = useState(false);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Start after delay
    useEffect(() => {
        const timeout = setTimeout(() => setIsStarted(true), delay * 1000);
        return () => clearTimeout(timeout);
    }, [delay]);

    useEffect(() => {
        if (!isStarted) return;

        // Safety check for empty texts
        if (!texts || texts.length === 0) return;

        const targetText = texts[currentIndex];

        // Total steps for transition (1.2s / 40ms = 30 steps)
        const totalSteps = 30;
        let step = 0;

        // Phase: 0 = resolve, 1 = wait, 2 = scramble out
        let phase = 0;

        const tick = () => {
            // Phase 0: Resolve (Random -> Target)
            if (phase === 0) {
                step++;
                const progress = step / totalSteps;
                const resolvedCount = Math.floor(progress * targetText.length);

                let currentString = "";
                const newMask = [];

                for (let i = 0; i < targetText.length; i++) {
                    if (i < resolvedCount) {
                        currentString += targetText[i];
                        newMask.push(true);
                    } else {
                        // Random char
                        currentString += CHARS[Math.floor(Math.random() * CHARS.length)];
                        newMask.push(false);
                    }
                }

                setDisplayText(currentString);
                setResolvedMask(newMask);

                if (step >= totalSteps) {
                    // Finished resolving
                    phase = 1;
                    step = 0;
                    // Wait 3 seconds
                    setTimeout(() => {
                        phase = 2; // Trigger scramble out
                    }, 3000);
                }
            }
            // Phase 1: Waiting
            else if (phase === 1) {
                // Do nothing
            }
            // Phase 2: Scramble Out (Target -> Random)
            else if (phase === 2) {
                step++;
                const progress = step / totalSteps;
                const scrambleCount = Math.floor(progress * targetText.length);

                let currentString = "";
                const newMask = [];

                for (let i = 0; i < targetText.length; i++) {
                    if (i < scrambleCount) {
                        // Became random again
                        currentString += CHARS[Math.floor(Math.random() * CHARS.length)];
                        newMask.push(false);
                    } else {
                        // Still resolved
                        currentString += targetText[i];
                        newMask.push(true);
                    }
                }

                setDisplayText(currentString);
                setResolvedMask(newMask);

                if (step >= totalSteps) {
                    // Finished scrambling out
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                    }
                    // Move to next word
                    setCurrentIndex((prev) => (prev + 1) % texts.length);
                }
            }
        };

        intervalRef.current = setInterval(tick, 40);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [currentIndex, isStarted, texts]);

    return (
        <span className={clsx("inline-flex font-mono", className)}>
            {/* 
        We render the characters. 
        Note: displayText might be empty initially.
      */}
            {displayText ? displayText.split("").map((char, index) => (
                <span
                    key={index}
                    className={resolvedMask[index] ? "text-white" : "text-primary"}
                >
                    {char}
                </span>
            )) : <span className="opacity-0">_</span>}
            <span className="sr-only">{texts[currentIndex]}</span>
        </span>
    );
};
