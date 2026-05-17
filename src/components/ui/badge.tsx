import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium border transition-colors",
  {
    variants: {
      variant: {
        default:    "bg-white/[0.06] text-white/70 border-white/[0.06]",
        secondary:  "bg-white/[0.04] text-white/50 border-white/[0.04]",
        destructive:"bg-red-500/10 text-red-400 border-red-500/20",
        outline:    "text-white/60 border-white/[0.09]",
        success:    "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        warning:    "bg-amber-500/10 text-amber-400 border-amber-500/20",
        purple:     "bg-purple-500/10 text-purple-400 border-purple-500/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
