"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const finePointer = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = (aPos + 1.0) * 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

// Liquid distortion: samples the logo texture with UVs warped toward the
// cursor (a bulge), plus a gooey ripple, and a cursor-following chrome light.
const FRAG = `
precision mediump float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uMouse;   // uv space, y flipped to match WebGL
uniform float uHover;  // 0..1 eased
uniform float uTime;
uniform float uAspect; // width / height (keeps the blob circular)

void main() {
  vec2 uv = vUv;
  vec2 toM = uv - uMouse;
  vec2 aspM = vec2(toM.x * uAspect, toM.y);
  float dist = length(aspM);
  float radius = 0.30;
  float infl = smoothstep(radius, 0.0, dist) * uHover;

  vec2 dir = toM / (length(toM) + 1e-4);
  float ripple = sin(dist * 26.0 - uTime * 3.5);

  uv -= dir * infl * 0.11;                 // bulge toward the cursor
  uv += dir * infl * ripple * 0.02;        // ripple along the bulge
  uv += infl * 0.012 * vec2(                // gooey wobble
    sin(uv.y * 18.0 + uTime * 1.7),
    cos(uv.x * 18.0 + uTime * 1.5)
  );

  vec4 col = texture2D(uTex, uv);

  // Idle = full white; on hover, dim away from the cursor for a chrome sweep.
  float nearC = smoothstep(radius, 0.0, dist);
  col.rgb *= 1.0 - uHover * 0.18 * (1.0 - nearC);

  gl_FragColor = col;
}`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

export function LiquidLogo({
  src,
  alt,
  ratio,
  className,
}: {
  src: string;
  alt: string;
  /** Intrinsic width / height of the source image. */
  ratio: number;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!wrap || !canvas || !img || reduce() || !finePointer()) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: false,
      antialias: true,
    });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    if (!vs || !fs || !prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    // Two triangles covering clip space.
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTex = gl.getUniformLocation(prog, "uTex");
    const uMouse = gl.getUniformLocation(prog, "uMouse");
    const uHover = gl.getUniformLocation(prog, "uHover");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uAspect = gl.getUniformLocation(prog, "uAspect");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    const s = { mx: 0.5, my: 0.5, tmx: 0.5, tmy: 0.5, h: 0, th: 0 };
    let aspect = ratio;
    let textured = false;
    let raf = 0;
    let running = false;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (!w || !h) return;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      aspect = w / h;
    };

    const draw = (t: number) => {
      gl.clear(gl.COLOR_BUFFER_BIT);
      if (!textured) return;
      gl.uniform1i(uTex, 0);
      gl.uniform2f(uMouse, s.mx, s.my);
      gl.uniform1f(uHover, s.h);
      gl.uniform1f(uTime, t * 0.001);
      gl.uniform1f(uAspect, aspect);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    const tick = (t: number) => {
      s.mx += (s.tmx - s.mx) * 0.12;
      s.my += (s.tmy - s.my) * 0.12;
      s.h += (s.th - s.h) * 0.08;
      draw(t);
      // Idle and settled → stop the loop to spare the GPU.
      if (s.th === 0 && s.h < 0.002) {
        s.h = 0;
        draw(t);
        running = false;
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    const upload = () => {
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      textured = true;
      resize();
      draw(performance.now());
      setActive(true);
    };
    if (img.complete && img.naturalWidth) upload();
    else img.addEventListener("load", upload, { once: true });

    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      s.tmx = (e.clientX - r.left) / r.width;
      s.tmy = 1 - (e.clientY - r.top) / r.height;
      kick();
    };
    const onEnter = () => {
      s.th = 1;
      kick();
    };
    const onLeave = () => {
      s.th = 0;
      s.tmx = 0.5;
      s.tmy = 0.5;
      kick();
    };

    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerenter", onEnter);
    wrap.addEventListener("pointerleave", onLeave);
    const ro = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    ro.observe(wrap);

    return () => {
      cancelAnimationFrame(raf);
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerenter", onEnter);
      wrap.removeEventListener("pointerleave", onLeave);
      img.removeEventListener("load", upload);
      ro.disconnect();
      gl.deleteTexture(tex);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
    };
  }, [src, ratio]);

  return (
    <div
      ref={wrapRef}
      role="img"
      aria-label={alt}
      className={cn("relative", className)}
      style={{ aspectRatio: `${ratio}` }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={src}
        alt=""
        aria-hidden
        crossOrigin="anonymous"
        className={cn(
          "absolute inset-0 size-full object-contain transition-opacity duration-300",
          active && "opacity-0",
        )}
      />
      <canvas
        ref={canvasRef}
        aria-hidden
        className={cn(
          "absolute inset-0 size-full transition-opacity duration-300",
          active ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  );
}
