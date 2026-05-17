"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium",
    "select-none cursor-pointer",
    /* transitions — include transform for press effect */
    "transition-all duration-150 ease-out",
    /* press */
    "active:scale-[0.96]",
    /* keyboard focus */
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:ring-offset-1 focus-visible:ring-offset-[#0a0a0a]",
    /* disabled */
    "disabled:pointer-events-none disabled:opacity-40",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "bg-emerald-500 text-black font-semibold hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]",
        destructive:
          "bg-transparent text-red-400 border border-red-500/20 hover:bg-red-500/[0.08] hover:border-red-500/30",
        outline:
          "border border-white/[0.09] bg-transparent text-white/70 hover:border-white/[0.18] hover:text-white hover:bg-white/[0.03]",
        secondary:
          "bg-white/[0.06] text-white hover:bg-white/[0.10]",
        ghost:
          "text-white/55 hover:text-white hover:bg-white/[0.06]",
        link:
          "text-emerald-400 underline-offset-4 hover:underline p-0 h-auto",
        glass:
          "bg-white/[0.04] border border-white/[0.07] text-white hover:bg-white/[0.08] hover:border-white/[0.12]",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm:      "h-8 px-3 text-xs",
        lg:      "h-11 px-7 text-base",
        icon:    "h-9 w-9",
        "icon-sm": "h-7 w-7",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

function ThreeDots({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-[3px]", className)} aria-label="Loading">
      <span className="w-[3px] h-[3px] rounded-full bg-current animate-dot-1" />
      <span className="w-[3px] h-[3px] rounded-full bg-current animate-dot-2" />
      <span className="w-[3px] h-[3px] rounded-full bg-current animate-dot-3" />
    </span>
  );
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading ? <ThreeDots /> : children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants, ThreeDots };
