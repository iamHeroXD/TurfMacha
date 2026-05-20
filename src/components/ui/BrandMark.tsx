import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrandMarkProps {
  size?: number;
  rotate?: boolean;
  className?: string;
}

export function BrandMark({ size = 40, rotate = true, className }: BrandMarkProps) {
  return (
    <div
      className={cn(
        "rounded-xl overflow-hidden shrink-0 shadow-md",
        rotate && "-rotate-6",
        className
      )}
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
    >
      <Image
        src="/logoofturfmacha.png"
        alt="TurfMacha"
        width={size}
        height={size}
        className="object-cover w-full h-full"
        priority
      />
    </div>
  );
}
