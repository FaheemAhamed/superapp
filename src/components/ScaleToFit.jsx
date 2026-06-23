import { useRef, useState, useEffect } from "react";

/**
 * ScaleToFit — auto-scales a fixed-size widget to fill its container.
 * Uses ResizeObserver so it reacts to any container width change.
 *
 * @param {number} nativeWidth  - the widget's designed pixel width
 * @param {number} nativeHeight - the widget's designed pixel height
 * @param {node}   children     - the widget to scale
 */
export default function ScaleToFit({ nativeWidth, nativeHeight, children }) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(() =>
    typeof window !== "undefined"
      ? Math.min(1, (window.innerWidth - 32) / nativeWidth)
      : 1
  );

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const containerW = entry.contentRect.width;
      setScale(Math.min(1, containerW / nativeWidth));
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [nativeWidth]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: `${nativeHeight * scale}px`,
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: `${nativeWidth}px`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
