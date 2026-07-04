"use client";

import {
  useRef,
  type CSSProperties,
  type HTMLAttributes,
  type MouseEvent,
} from "react";
import styles from "./SpotlightCard.module.css";

type SpotlightCardProps = HTMLAttributes<HTMLDivElement> & {
  spotlightColor?: string;
};

export default function SpotlightCard({
  children,
  className = "",
  onMouseMove,
  spotlightColor = "rgba(255, 255, 255, 0.25)",
  style,
  ...props
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    onMouseMove?.(event);

    if (!divRef.current) return;

    const rect = divRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    divRef.current.style.setProperty("--mouse-x", `${x}px`);
    divRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div
      {...props}
      ref={divRef}
      onMouseMove={handleMouseMove}
      className={`${styles.cardSpotlight} ${className}`}
      style={
        {
          ...style,
          "--spotlight-color": spotlightColor,
        } as CSSProperties
      }
    >
      <div className={styles.content}>{children}</div>
    </div>
  );
}
