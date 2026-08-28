"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * Live WebGPU phosphor field behind the hero, rendered with vgpu. Falls back
 * to the static heritage ASCII art when WebGPU is unavailable or the visitor
 * prefers reduced motion.
 */
export function HeroPhosphor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !("gpu" in navigator)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let disposed = false;
    let stopLoop: (() => void) | undefined;
    let disposeGpu: (() => void) | undefined;
    let removeListeners: (() => void) | undefined;

    (async () => {
      const [vgpu, shader] = await Promise.all([
        import("vgpu"),
        import("./hero-phosphor.wgsl"),
      ]);
      if (disposed) return;

      const gpu = await vgpu.init();
      if (disposed) {
        gpu.dispose();
        return;
      }
      disposeGpu = () => gpu.dispose();

      const output = vgpu.surface(gpu, canvas, {
        dpr: [1, 1.75],
        alphaMode: "premultiplied",
        clearColor: [0, 0, 0, 0],
      });
      const dots = vgpu.effect(gpu, shader.default);
      const time = vgpu.clock(gpu);

      const pointer = { x: 0.7, y: 0.4 };
      const target = { x: 0.7, y: 0.4 };
      let lastMove = Number.NEGATIVE_INFINITY;
      let glow = 0;

      const onMove = (event: PointerEvent) => {
        const rect = canvas.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        target.x = (event.clientX - rect.left) / rect.width;
        target.y = (event.clientY - rect.top) / rect.height;
        lastMove = performance.now();
      };
      window.addEventListener("pointermove", onMove, { passive: true });

      const startLoop = () =>
        vgpu.frameLoop(gpu, (frame) => {
          pointer.x += (target.x - pointer.x) * 0.06;
          pointer.y += (target.y - pointer.y) * 0.06;
          const recent = performance.now() - lastMove < 2000;
          glow += ((recent ? 1 : 0) - glow) * 0.04;
          dots.set({
            params: {
              pointer: [pointer.x, pointer.y],
              aspect: output.size[0] / Math.max(1, output.size[1]),
              time: time.time,
              glow,
              fade: Math.min(1, time.time / 1.6),
            },
          });
          frame.pass(output, dots);
        });

      let loop: { stop(): void } | undefined = startLoop();

      // Don't burn GPU frames while the hero is scrolled out of view.
      const observer = new IntersectionObserver(([entry]) => {
        if (disposed) return;
        if (entry.isIntersecting && !loop) {
          loop = startLoop();
        } else if (!entry.isIntersecting && loop) {
          loop.stop();
          loop = undefined;
        }
      });
      observer.observe(canvas);

      stopLoop = () => loop?.stop();
      removeListeners = () => {
        window.removeEventListener("pointermove", onMove);
        observer.disconnect();
      };

      setLive(true);
    })().catch(() => {
      // WebGPU init failed: the static ASCII art below stays visible.
    });

    return () => {
      disposed = true;
      removeListeners?.();
      stopLoop?.();
      disposeGpu?.();
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-1000 ${
          live ? "opacity-100" : "opacity-0"
        }`}
      />
      {/* Heritage ASCII art — illustration only, never the logo */}
      <Image
        src="/mark-ascii-green.png"
        alt=""
        width={760}
        height={541}
        aria-hidden="true"
        className={`pointer-events-none absolute right-14 top-8 hidden w-[520px] transition-opacity duration-1000 lg:block ${
          live ? "opacity-0" : "opacity-[0.06]"
        }`}
      />
    </>
  );
}
