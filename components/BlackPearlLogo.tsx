import React from "react";
import { cn } from "@/lib/utils";

interface BlackPearlLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  subtext?: string;
  hideText?: boolean;
}

export function BlackPearlLogo({ className, size = "md", subtext = "portal", hideText = false }: BlackPearlLogoProps) {
  const containerSizes = {
    sm: "size-8",
    md: "size-10",
    lg: "size-12",
  };

  const pearlSizes = {
    sm: "size-3.5",
    md: "size-4.5",
    lg: "size-5.5",
  };

  const textSizes = {
    sm: "text-[10px]",
    md: "text-[12px]",
    lg: "text-[14px]",
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* The Black Pearl Sphere */}
      <div
        className={cn(
          "relative flex items-center justify-center rounded-xl border border-white/10 shadow-2xl overflow-hidden shrink-0",
          containerSizes[size],
          "bg-linear-to-br from-[#0a6670] to-[#01454d]"
        )}
      >
        {/* Iridescent Glow Layer */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(32,214,227,0.2),transparent_70%)]" />
        
        {/* The Pearl itself */}
        <div
          className={cn(
            "relative rounded-full transition-all duration-1000 animate-pulse",
            pearlSizes[size],
            "bg-[#012a2f] shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),0_0_15px_rgba(32,214,227,0.4)]",
            "border border-primary/20"
          )}
        >
          {/* Surface reflection (Highight) */}
          <div className="absolute top-[15%] left-[20%] size-1.5 rounded-full bg-white/40 blur-[0.5px]" />
          
          {/* Inner core glow */}
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(32,214,227,0.3),transparent_60%)]" />
        </div>
      </div>

      {/* Typography */}
      {!hideText && (
        <div className="leading-none whitespace-nowrap transition-all duration-300">
          <div className={cn("font-black tracking-[0.25em] text-white", textSizes[size])}>
            BLACK <span className="text-primary italic">PEARL</span>
          </div>
          {subtext && (
            <div className="mt-1 text-[9px] font-medium uppercase tracking-[0.3em] text-primary/60">
              {subtext}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
