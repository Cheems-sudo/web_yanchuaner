"use client";

import React, { useRef } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "./cn";

/**
 * 卡片容器：统一毛玻璃 / 描边 / 圆角 / 阴影。
 * 具有科幻感的 Mouse-Glow 鼠标悬停流光效果。
 * 优化为 0% React 重绘，60 FPS 极速运行。
 */
export function GlassCard({
  children,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  /** 渲染的 HTML 标签，默认 div */
  as?: "div" | "article" | "section";
}) {
  const cardRef = useRef<HTMLElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 直接通过原生样式注入 CSS 变量，0% React 重绘
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <Tag
      ref={cardRef as any}
      onMouseMove={handleMouseMove}
      className={cn("glass-card-premium group/card overflow-hidden", className)}
    >
      {/* 内部高亮光斑 */}
      <div className="glass-card-glow" />
      <div className="relative z-10">{children}</div>
    </Tag>
  );
}

/**
 * 区块标题：图标 + H2，用于卡片内部或页面分区。
 */
export function SectionHeader({
  icon: Icon,
  title,
  action,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  /** 右侧操作区（如「查看全部 →」链接） */
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <div className="flex items-center gap-3">
        {Icon ? <Icon size={26} className="text-brand" aria-hidden="true" /> : null}
        <h2 className="font-heading text-2xl font-bold text-brand-fg">{title}</h2>
      </div>
      {action}
    </div>
  );
}
