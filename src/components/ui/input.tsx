import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            "flex h-11 w-full rounded-lg border border-white/[0.09] bg-white/[0.04] px-4 py-2 text-sm text-white",
            "placeholder:text-white/30",
            "focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/40",
            "disabled:cursor-not-allowed disabled:opacity-40",
            "transition-colors duration-150",
            error && "border-red-500/40 focus:ring-red-500/30",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
