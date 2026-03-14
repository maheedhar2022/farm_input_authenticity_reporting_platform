import React, { useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from 'react';

const ParticleCanvas = forwardRef(({ antigravity, triggerBurst }, ref) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animRef = useRef(null);
  const antigravRef = useRef(antigravity);

  useEffect(() => { antigravRef.current = antigravity; }, [antigravity]);

  const spawnAt = useCallback((x, y, n = 10) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    for (let i = 0; i < n; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 3.5;
      const hue = 140 + Math.random() * 80; // Greenish-emerald range
      particlesRef.current.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: 2 + Math.random() * 3,
        life: 1,
        decay: 0.003 + Math.random() * 0.006,
        hue,
        trail: [],
      });
    }
  }, []);

  // Expose spawnAt to parent
  useImperativeHandle(ref, () => ({
    burst: (x, y, n) => spawnAt(x || window.innerWidth / 2, y || window.innerHeight / 2, n || 20),
    clear: () => { particlesRef.current = []; }
  }));

  useEffect(() => {
    if (triggerBurst) {
      const canvas = canvasRef.current;
      if (canvas) {
        spawnAt(canvas.width / 2, canvas.height / 2, 20);
      }
    }
  }, [triggerBurst, spawnAt]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let W, H;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function draw() {
      ctx.clearRect(0, 0, W, H);
      
      const grav = antigravRef.current ? -0.04 : 0.06;
      particlesRef.current = particlesRef.current.filter(p => p.life > 0.01);

      particlesRef.current.forEach(p => {
        p.trail.push({ x: p.x, y: p.y, a: p.life });
        if (p.trail.length > 15) p.trail.shift();

        p.vy += grav;
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;

        if (p.x < 0 || p.x > W) p.vx *= -0.8;
        if (p.y > H) { p.y = H; p.vy *= -0.6; }
        if (p.y < 0) { p.y = 0; p.vy *= -0.6; }

        // Draw trails
        for (let i = 1; i < p.trail.length; i++) {
          const t = p.trail[i], t0 = p.trail[i - 1];
          ctx.beginPath();
          ctx.moveTo(t0.x, t0.y);
          ctx.lineTo(t.x, t.y);
          ctx.strokeStyle = `hsla(${p.hue}, 80%, 60%, ${t.a * 0.2 * (i / p.trail.length)})`;
          ctx.lineWidth = p.r * 0.8;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${p.life})`;
        ctx.fill();
        
        // Glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${p.life * 0.1})`;
        ctx.fill();
      });

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
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
});

export default ParticleCanvas;
