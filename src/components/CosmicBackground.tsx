"use client";

import React, { memo } from "react";

/**
 * 首页氛围背景：一层克制的渐变光晕。
 * 早期版本叠加了星空 / 流星 / 噪点多套动画，视觉过载且耗 GPU，
 * 现精简为单层柔和光晕，仅用于首页 Hero，其余页面保持纯净留白。
 */
const CosmicBackground = memo(function CosmicBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* 渐变星云光晕 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(124,58,237,0.12),transparent_45%),radial-gradient(circle_at_80%_90%,rgba(167,139,250,0.15),transparent_50%)]" />
      {/* 动态流星扫过层 */}
      <div className="meteor-layer absolute inset-0 opacity-[0.15]" />
    </div>
  );
});

export default CosmicBackground;