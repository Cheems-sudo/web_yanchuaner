"use client";

import React from "react";
import { useInView } from "@/hooks/useInView";
import { cn } from "./cn";

interface RevealSectionProps {
  children: React.ReactNode;
  className?: string;
  /** 入场方向，默认 "up" */
  direction?: "up" | "left" | "right" | "scale";
  /** 延迟（秒），用于交错动画 */
  delay?: number;
}

/**
 * 滚动入场包装组件 — 当子元素滚入视口时播放入场动画。
 *
 * 极轻量，零侵入：只需用 <RevealSection> 包裹即可。
 * 支持 direction（方向）和 delay（交错延迟）。
 *
 * @example
 * <RevealSection>
 *   <GlassCard>...</GlassCard>
 * </RevealSection>
 *
 * <RevealSection direction="left" delay={0.2}>
 *   <GlassCard>第二张卡片</GlassCard>
 * </RevealSection>
 */
export function RevealSection({
  children,
  className,
  direction = "up",
  delay = 0,
}: RevealSectionProps) {
  const { ref, inView } = useInView();

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn(
        "transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
        inView
          ? "translate-y-0 translate-x-0 scale-100 opacity-100"
          : direction === "up"
            ? "translate-y-8 opacity-0"
            : direction === "left"
              ? "-translate-x-8 opacity-0"
              : direction === "right"
                ? "translate-x-8 opacity-0"
                : "scale-95 opacity-0",
        className
      )}
      style={delay > 0 ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
