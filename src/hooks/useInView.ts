"use client";

import { useEffect, useRef, useState } from "react";

interface UseInViewOptions {
  /** 元素进入多少比例才触发（0~1），默认 0.15 */
  threshold?: number;
  /** 提前/延迟触发的偏移量，默认底部提前 60px */
  rootMargin?: string;
  /** 是否只触发一次（默认 true） */
  once?: boolean;
}

/**
 * 视口感知 Hook — 当元素进入可视区域时触发一次性状态翻转。
 *
 * 基于原生 IntersectionObserver，零轮询、零第三方依赖。
 * 自动尊重 prefers-reduced-motion 无障碍偏好。
 */
export function useInView(options: UseInViewOptions = {}) {
  const {
    threshold = 0.15,
    rootMargin = "0px 0px -60px 0px",
    once = true,
  } = options;

  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // 尊重用户的无障碍偏好——直接跳过动画
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.unobserve(el);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, inView };
}
