'use client';
import { useEffect, useRef } from 'react';
import { useTheme } from '@/components/ThemeProvider';

export default function SpotlightCursor() {
  const ref = useRef(null);
  const { dark } = useTheme();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      // Remove transition while moving so it tracks instantly
      el.style.transition = 'opacity 0.4s ease';

      if (dark) {
        // Dark mode: teal glow
        el.style.background = `radial-gradient(
          circle 600px at ${x}px ${y}px,
          rgba(100, 204, 197, 0.18) 0%,
          rgba(23, 104, 135, 0.07) 50%,
          transparent 70%
        )`;
      } else {
        // Light mode: deep blue wash, clearly visible on white/gray
        el.style.background = `radial-gradient(
          circle 480px at ${x}px ${y}px,
          rgba(23, 104, 135, 0.32) 0%,
          rgba(100, 204, 197, 0.18) 35%,
          transparent 65%
        )`;
      }
      el.style.opacity = '1';
    };

    const onLeave = () => {
      el.style.opacity = '0';
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, [dark]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9998,
        opacity: 0,
        transition: 'opacity 0.4s ease',
      }}
    />
  );
}
