"use client";

import { motion } from "framer-motion";
import { clsx } from "clsx";

interface SplitTextProps {
    text: string;
    className?: string;
    delay?: number;
}

export const SplitText = ({ text, className = "", delay = 0 }: SplitTextProps) => {
    const characters = text.split("");

    return (
        <div className={clsx("inline-block", className)}>
            {characters.map((char, index) => (
                <motion.span
                    key={index}
                    className="inline-block"
                    initial={{ y: 60, opacity: 0, clipPath: "inset(0 0 100% 0)" }}
                    animate={{ y: 0, opacity: 1, clipPath: "inset(0 0 0% 0)" }}
                    transition={{
                        type: "spring",
                        damping: 12,
                        stiffness: 100,
                        delay: delay + index * 0.04,
                    }}
                >
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </div>
    );
};
