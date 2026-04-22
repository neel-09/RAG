import React, { useEffect, useRef } from 'react';

const COLORS = [
  [59, 142, 255],
  [0, 229, 255],
  [155, 109, 255],
  [0, 255, 178],
];

export default function ParticleCanvas() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let W, H;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function mkParticle() {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.8 + 0.6,
        opacity: Math.random() * 0.55 + 0.2,
        pulse: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.018 + 0.006,
        colorIdx: Math.floor(Math.random() * COLORS.length),
      };
    }

    resize();
    window.addEventListener('resize', resize);
    particlesRef.current = Array.from({ length: 100 }, mkParticle);

    function draw() {
      ctx.clearRect(0, 0, W, H);
      const pts = particlesRef.current;

      pts.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += p.speed;
        const op = p.opacity * (0.55 + 0.45 * Math.sin(p.pulse));
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        const [r, g, b] = COLORS[p.colorIdx];
        const halo = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
        halo.addColorStop(0, `rgba(${r},${g},${b},${op * 0.55})`);
        halo.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
        ctx.fillStyle = halo;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(op * 1.6, 1)})`;
        ctx.fill();
      });

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            const t = 1 - dist / 140;
            const [r1, g1, b1] = COLORS[pts[i].colorIdx];
            const [r2, g2, b2] = COLORS[pts[j].colorIdx];
            const lg = ctx.createLinearGradient(pts[i].x, pts[i].y, pts[j].x, pts[j].y);
            lg.addColorStop(0, `rgba(${r1},${g1},${b1},${t * 0.22})`);
            lg.addColorStop(1, `rgba(${r2},${g2},${b2},${t * 0.22})`);
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = lg;
            ctx.lineWidth = t * 1.4;
            ctx.stroke();
          }
        }
      }

      animRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.78 }}
    />
  );
}