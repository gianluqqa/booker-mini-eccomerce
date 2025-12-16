"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { Clock } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const NAVBAR_SAFE_ZONE = 80; // px que debemos respetar para no pisar la navbar
const VIEWPORT_PADDING = 12;

const formatTime = (ms: number) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const ReservationTimerBanner = () => {
  const { reservationTimeLeft } = useCart();
  const bubbleRef = useRef<HTMLDivElement | null>(null);
  const pointerOffset = useRef({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: VIEWPORT_PADDING, y: NAVBAR_SAFE_ZONE + VIEWPORT_PADDING });
  const [isDragging, setIsDragging] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window === "undefined") return;
    setPosition({
      x: window.innerWidth - 260,
      y: NAVBAR_SAFE_ZONE + VIEWPORT_PADDING,
    });
  }, []);

  const updatePosition = useCallback((clientX: number, clientY: number) => {
    if (typeof window === "undefined" || !bubbleRef.current) return;
    const bubbleRect = bubbleRef.current.getBoundingClientRect();
    const width = bubbleRect.width;
    const height = bubbleRect.height;
    const maxX = window.innerWidth - width - VIEWPORT_PADDING;
    const maxY = window.innerHeight - height - VIEWPORT_PADDING;
    const minY = NAVBAR_SAFE_ZONE + VIEWPORT_PADDING;

    setPosition({
      x: clamp(clientX - pointerOffset.current.x, VIEWPORT_PADDING, maxX),
      y: clamp(clientY - pointerOffset.current.y, minY, maxY),
    });
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (event: PointerEvent) => {
      event.preventDefault();
      updatePosition(event.clientX, event.clientY);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);

    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging, updatePosition]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    pointerOffset.current = {
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    };
    setIsDragging(true);
  };

  if (!reservationTimeLeft || reservationTimeLeft <= 0 || !isMounted) {
    return null;
  }

  return (
    <div
      ref={bubbleRef}
      className={`fixed z-40 max-w-xs w-[260px] cursor-${isDragging ? "grabbing" : "grab"} select-none`}
      style={{
        top: position.y,
        left: position.x,
        transition: isDragging ? "none" : "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      onPointerDown={handlePointerDown}
    >
      <div className="rounded-2xl bg-[#2e4b30] text-[#f5efe1] shadow-xl shadow-[#2e4b30]/30 p-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-white/5 opacity-0 hover:opacity-100 transition-opacity duration-300" />
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Clock className="w-4 h-4" />
          <span>Reserva activa</span>
        </div>
        <p className="mt-2 text-3xl font-black tracking-tight">{formatTime(reservationTimeLeft)}</p>
        <p className="text-xs text-white/80 mt-1">Completa la compra antes de que termine el tiempo.</p>
        <Link
          href="/cart"
          className="mt-4 inline-flex items-center justify-center rounded-full bg-[#f5efe1] text-[#2e4b30] text-sm font-semibold px-4 py-2 hover:bg-white transition-colors duration-200"
        >
          Ir al carrito
        </Link>
      </div>
    </div>
  );
};

export default ReservationTimerBanner;
