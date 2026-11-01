import React, { useEffect, useRef, useState } from 'react';
import { ResponsiveContainer } from 'recharts';

/**
 * SafeResponsiveContainer prevents Recharts 3.x from logging
 * "The width(0) and height(0) of chart should be greater than 0"
 * when charts are mounted inside hidden tab panels or collapsed <details>.
 */
export default function SafeResponsiveContainer({
  children,
  defaultHeight = 256,
  className = 'w-full h-full'
}) {
  const hostRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const w = Math.floor(rect.width);
      const h = Math.floor(rect.height) || defaultHeight;
      setDimensions((prev) => (prev.width === w && prev.height === h ? prev : { width: w, height: h }));
    };

    measure();

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(() => {
        measure();
      });
      observer.observe(el);
      return () => observer.disconnect();
    }

    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [defaultHeight]);

  return (
    <div ref={hostRef} className={className}>
      {dimensions.width > 0 && dimensions.height > 0 ? (
        <ResponsiveContainer width={dimensions.width} height={dimensions.height}>
          {children}
        </ResponsiveContainer>
      ) : null}
    </div>
  );
}
