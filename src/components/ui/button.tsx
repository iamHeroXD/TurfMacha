"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold",
    "select-none cursor-pointer",
    "transition-all duration-150 ease-out",
    "active:scale-[0.96]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-40",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "bg-[#0D4D36] text-[#F4F1EB] hover:bg-[#0D4D36]/90 shadow-sm hover:shadow-md shadow-[#0D4D36]/15",
        destructive:
          "bg-transparent text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-secondary hover:border-border/80",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "text-muted-foreground hover:text-foreground hover:bg-secondary",
        link:
          "text-[#0D4D36] underline-offset-4 hover:underline p-0 h-auto",
        glass:
          "bg-card/70 border border-border text-foreground hover:bg-card backdrop-blur-sm",
      },
      size: {
        default:   "h-10 px-5 py-2",
        sm:        "h-8  px-3 text-xs",
        lg:        "h-12 px-8 text-base",
        icon:      "h-9  w-9",
        "icon-sm": "h-7  w-7",
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
