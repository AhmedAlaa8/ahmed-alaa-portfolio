"use client";
import { useEffect, useRef } from "react";

// Only visibility transitions touch the DOM; CSS owns the animation frames.
export function useVisibleMotion(enabled) {
  const ref = useRef(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let inView = false;
    const update = () => {
      element.dataset.running = String(enabled && inView && !document.hidden);
    };
    update();
    if (!enabled || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        update();
      },
      { threshold: 0 },
    );
    observer.observe(element);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
      element.dataset.running = "false";
    };
  }, [enabled]);
  return ref;
}
