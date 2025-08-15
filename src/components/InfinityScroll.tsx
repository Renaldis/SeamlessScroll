"use client";

import React, { ReactNode, useEffect, useRef, useState } from "react";

interface InfiniteScrollProps {
  children: ReactNode;
  speed?: number;
  gap?: number;
  pauseOnHover?: boolean;
  draggable?: boolean;
}

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  children,
  speed = 1,
  gap = 2,
  pauseOnHover = true,
  draggable = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const items = React.Children.toArray(children);
  const loopedItems = [...items, ...items, ...items];

  useEffect(() => {
    if (!containerRef.current) return;

    let animationFrame: number;
    const step = () => {
      if (!isPaused && !isDragging && containerRef.current) {
        containerRef.current.scrollLeft += speed;
        handleLoop();
      }
      animationFrame = requestAnimationFrame(step);
    };

    const handleLoop = () => {
      const container = containerRef.current;
      if (!container) return;
      const segmentWidth = container.scrollWidth / 3;
      if (container.scrollLeft >= segmentWidth * 2) {
        container.scrollLeft -= segmentWidth;
      } else if (container.scrollLeft <= 0) {
        container.scrollLeft += segmentWidth;
      }
    };

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [isPaused, isDragging, speed]);

  const handleDown = (clientX: number) => {
    if (!draggable) return;
    setIsDragging(true);
    setStartX(clientX - (containerRef.current?.offsetLeft || 0));
    setScrollLeft(containerRef.current?.scrollLeft || 0);
    setIsPaused(true);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging || !draggable) return;
    const x = clientX - (containerRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 1;
    if (containerRef.current) {
      containerRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleUp = () => {
    if (!draggable) return;
    setIsDragging(false);
    setIsPaused(false);
  };

  const handleLeave = () => {
    if (!draggable) return;
    setIsDragging(false);
    if (pauseOnHover) setIsPaused(false);
  };

  return (
    <div
      ref={containerRef}
      className={`flex overflow-x-scroll no-scrollbar ${
        draggable ? (isDragging ? "grabbing" : "grab") : ""
      }`}
      style={{ columnGap: `${gap}rem` }}
      onMouseDown={(e) => handleDown(e.pageX)}
      onMouseMove={(e) => handleMove(e.pageX)}
      onMouseUp={handleUp}
      onMouseLeave={handleLeave}
      onTouchStart={(e) => handleDown(e.touches[0].pageX)}
      onTouchMove={(e) => handleMove(e.touches[0].pageX)}
      onTouchEnd={handleUp}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
    >
      {loopedItems.map((child, idx) => (
        <div key={idx}>{child}</div>
      ))}
    </div>
  );
};

export default InfiniteScroll;
