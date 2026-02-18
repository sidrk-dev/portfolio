import { ButtonHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion, HTMLMotionProps } from "framer-motion";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
}

// Combine Framer Motion props with HTML Button props
type MotionButtonProps = ButtonProps & HTMLMotionProps<"button">;

export const Button = forwardRef<HTMLButtonElement, MotionButtonProps>(
    ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
        const baseStyles = "inline-flex items-center justify-center font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 cursor-pointer font-mono uppercase tracking-wider relative overflow-hidden group";

        // Slanted corners clip-path for that "technical" look
        // We'll apply this via class or utility if possible, but inline style is reliable for dynamic
        const clipStyle = { clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)" };

        const variants = {
            primary: "bg-primary text-black hover:bg-white hover:text-black border border-transparent shadow-[0_0_20px_rgba(229,24,55,0.4)]",
            outline: "border border-primary text-primary hover:bg-primary/10 hover:shadow-[0_0_20px_rgba(229,24,55,0.2)]",
            ghost: "hover:bg-accent hover:text-accent-foreground",
        };

        const sizes = {
            sm: "h-9 px-4 text-xs",
            md: "h-12 px-8 text-sm",
            lg: "h-14 px-10 text-base",
        };

        return (
            <motion.button
                ref={ref}
                className={twMerge(baseStyles, variants[variant], sizes[size], className)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)" }}
                {...props}
            >
                {children}
            </motion.button>
        );
    }
);

Button.displayName = "Button";
