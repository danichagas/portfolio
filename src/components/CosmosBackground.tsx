import { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  vxBase: number;
  vyBase: number;
  radius: number;
  opacity: number;
  tint: 'teal' | 'sky';
}

interface Vortex {
  x: number;
  y: number;
  bornAt: number;
  duration: number;
  mass: number;
}

interface Shockwave {
  x: number;
  y: number;
  bornAt: number;
  duration: number;
  maxRadius: number;
}

const LINK_DISTANCE = 150;
const ATTRACT_DISTANCE = 180;
const MAX_VORTICES = 4;

export function CosmosBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let animationFrameId = 0;

    const mouse = {
      x: -9999,
      y: -9999,
      active: false,
      downX: 0,
      downY: 0,
    };

    let particles: Particle[] = [];
    const vortices: Vortex[] = [];
    const shockwaves: Shockwave[] = [];

    const createParticle = (w: number, h: number): Particle => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.25 + Math.random() * 0.35;
      const vxBase = Math.cos(angle) * speed;
      const vyBase = Math.sin(angle) * speed;

      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: vxBase,
        vy: vyBase,
        vxBase,
        vyBase,
        radius: 1.2 + Math.random() * 2.0,
        opacity: 0.3 + Math.random() * 0.25,
        tint: Math.random() > 0.35 ? 'teal' : 'sky',
      };
    };

    const syncCanvasSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const targetCount = Math.min(
        65,
        Math.max(26, Math.round((width * height) / 21000)),
      );

      if (particles.length === 0) {
        particles = Array.from({ length: targetCount }, () =>
          createParticle(width, height),
        );
      } else if (particles.length < targetCount) {
        while (particles.length < targetCount) {
          particles.push(createParticle(width, height));
        }
      } else if (particles.length > targetCount) {
        particles.length = targetCount;
      }
    };

    syncCanvasSize();
    const readyTimer = window.setTimeout(() => setIsReady(true), 60);

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    const handlePointerDown = (event: PointerEvent) => {
      mouse.downX = event.clientX;
      mouse.downY = event.clientY;
    };

    const handleClick = (event: MouseEvent) => {
      if (prefersReducedMotion) return;

      const dragDist = Math.hypot(
        event.clientX - mouse.downX,
        event.clientY - mouse.downY,
      );
      if (dragDist > 6) return;

      const target = event.target as HTMLElement | null;
      if (
        target?.closest(
          'a, button, input, textarea, select, label, article, img, nav, h1, h2, h3, p, ul, ol, footer',
        )
      ) {
        return;
      }

      const now = performance.now();
      const existing = vortices.find(
        (v) => Math.hypot(v.x - event.clientX, v.y - event.clientY) < 90,
      );

      if (existing) {
        existing.mass += 1;
        existing.duration += 900;
        if (existing.mass >= 4) {
          shockwaves.push({
            x: existing.x,
            y: existing.y,
            bornAt: now,
            duration: 750,
            maxRadius: Math.min(320, width * 0.4),
          });
          for (const p of particles) {
            const dx = p.x - existing.x;
            const dy = p.y - existing.y;
            const dist = Math.hypot(dx, dy) || 1;
            if (dist < 260) {
              const force = ((260 - dist) / 260) * 4.2;
              p.vx += (dx / dist) * force;
              p.vy += (dy / dist) * force;
            }
          }
          const idx = vortices.indexOf(existing);
          if (idx !== -1) vortices.splice(idx, 1);
        }
        return;
      }

      if (vortices.length >= MAX_VORTICES) {
        vortices.shift();
      }

      vortices.push({
        x: event.clientX,
        y: event.clientY,
        bornAt: now,
        duration: 3200,
        mass: 1,
      });
    };

    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 16.667, 2.2);
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      // Limpa vórtices e ondas expirados
      for (let i = vortices.length - 1; i >= 0; i--) {
        if (now - vortices[i].bornAt >= vortices[i].duration) {
          vortices.splice(i, 1);
        }
      }
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        if (now - shockwaves[i].bornAt >= shockwaves[i].duration) {
          shockwaves.splice(i, 1);
        }
      }

      // Atualiza física das partículas
      if (!prefersReducedMotion) {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          // Relaxamento suave de volta à velocidade orbital base
          p.vx += (p.vxBase - p.vx) * 0.025 * dt;
          p.vy += (p.vyBase - p.vy) * 0.025 * dt;

          // Atração suave ao cursor (onHover: attract, raio 180px)
          if (mouse.active) {
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const dist = Math.hypot(dx, dy);

            if (dist < ATTRACT_DISTANCE && dist > 22) {
              const pull = ((ATTRACT_DISTANCE - dist) / ATTRACT_DISTANCE) * 0.055 * dt;
              p.vx += (dx / dist) * pull;
              p.vy += (dy / dist) * pull;
            }
          }

          // Singularidades / vórtices ao clicar no fundo vazio
          for (const v of vortices) {
            const reach = Math.min(340, width * 0.5) * (1 + (v.mass - 1) * 0.18);
            const dx = v.x - p.x;
            const dy = v.y - p.y;
            const dist = Math.hypot(dx, dy);

            if (dist < reach && dist > 14) {
              const factor = (1 - dist / reach) * (0.11 + v.mass * 0.03) * dt;
              // Componente radial + tangencial (órbita espiral)
              const nx = dx / dist;
              const ny = dy / dist;
              p.vx += (nx * 0.65 - ny * 0.75) * factor * 2.2;
              p.vy += (ny * 0.65 + nx * 0.75) * factor * 2.2;
            }
          }

          // Limita velocidade máxima para manter movimento elegante
          const speed = Math.hypot(p.vx, p.vy);
          if (speed > 3.2) {
            p.vx = (p.vx / speed) * 3.2;
            p.vy = (p.vy / speed) * 3.2;
          }

          p.x += p.vx * dt;
          p.y += p.vy * dt;

          // Rebate suave nas bordas (outMode: bounce)
          if (p.x <= p.radius) {
            p.x = p.radius;
            p.vx = Math.abs(p.vx);
            p.vxBase = Math.abs(p.vxBase);
          } else if (p.x >= width - p.radius) {
            p.x = width - p.radius;
            p.vx = -Math.abs(p.vx);
            p.vxBase = -Math.abs(p.vxBase);
          }

          if (p.y <= p.radius) {
            p.y = p.radius;
            p.vy = Math.abs(p.vy);
            p.vyBase = Math.abs(p.vyBase);
          } else if (p.y >= height - p.radius) {
            p.y = height - p.radius;
            p.vy = -Math.abs(p.vy);
            p.vyBase = -Math.abs(p.vyBase);
          }
        }
      }

      // Colisões elásticas leves e linhas de conexão entre átomos próximos
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < LINK_DISTANCE * LINK_DISTANCE) {
            const dist = Math.sqrt(distSq) || 1;
            const minDist = p1.radius + p2.radius + 2;

            if (!prefersReducedMotion && dist < minDist) {
              const nx = dx / dist;
              const ny = dy / dist;
              const overlap = (minDist - dist) * 0.5;
              p1.x -= nx * overlap;
              p1.y -= ny * overlap;
              p2.x += nx * overlap;
              p2.y += ny * overlap;
            }

            let alpha = (1 - dist / LINK_DISTANCE) * 0.24;

            if (mouse.active) {
              const midX = (p1.x + p2.x) * 0.5;
              const midY = (p1.y + p2.y) * 0.5;
              const cursorDist = Math.hypot(mouse.x - midX, mouse.y - midY);
              if (cursorDist < ATTRACT_DISTANCE) {
                alpha += (1 - cursorDist / ATTRACT_DISTANCE) * 0.14;
              }
            }

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(226, 232, 240, ${alpha.toFixed(3)})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }

        // Linhas gravitacionais sutis até o cursor quando próximo
        if (mouse.active) {
          const cdx = mouse.x - p1.x;
          const cdy = mouse.y - p1.y;
          const cDist = Math.hypot(cdx, cdy);
          if (cDist < ATTRACT_DISTANCE * 0.85) {
            const cAlpha = (1 - cDist / (ATTRACT_DISTANCE * 0.85)) * 0.16;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(94, 234, 212, ${cAlpha.toFixed(3)})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      // Renderiza vórtices gravitacionais de clique
      for (const v of vortices) {
        const elapsed = now - v.bornAt;
        const progress = elapsed / v.duration;
        const envelope =
          progress < 0.12
            ? progress / 0.12
            : progress > 0.8
              ? (1 - progress) / 0.2
              : 1;
        const coreRadius = (12 + v.mass * 4) * envelope;
        const reach = Math.min(280, width * 0.42);

        for (const p of particles) {
          const dist = Math.hypot(v.x - p.x, v.y - p.y);
          if (dist < reach) {
            const tAlpha = (1 - dist / reach) * 0.22 * envelope;
            ctx.beginPath();
            ctx.moveTo(v.x, v.y);
            ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = `rgba(94, 234, 212, ${tAlpha.toFixed(3)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        const grad = ctx.createRadialGradient(
          v.x,
          v.y,
          1,
          v.x,
          v.y,
          coreRadius * 2.8,
        );
        grad.addColorStop(0, `rgba(15, 23, 42, ${(0.9 * envelope).toFixed(3)})`);
        grad.addColorStop(
          0.45,
          `rgba(45, 212, 191, ${(0.35 * envelope).toFixed(3)})`,
        );
        grad.addColorStop(1, 'rgba(45, 212, 191, 0)');

        ctx.beginPath();
        ctx.arc(v.x, v.y, coreRadius * 2.8, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.save();
        ctx.translate(v.x, v.y);
        ctx.rotate(now * 0.003);
        ctx.beginPath();
        ctx.arc(0, 0, coreRadius, 0, Math.PI * 1.45);
        ctx.strokeStyle = `rgba(94, 234, 212, ${(0.55 * envelope).toFixed(3)})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.restore();
      }

      // Renderiza ondas de choque ao colapsar singularidade
      for (const sw of shockwaves) {
        const p = (now - sw.bornAt) / sw.duration;
        const radius = sw.maxRadius * (1 - Math.pow(1 - p, 3));
        const alpha = (1 - p) * 0.4;
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(94, 234, 212, ${alpha.toFixed(3)})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Desenha átomos/partículas
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const rgb = p.tint === 'teal' ? '94, 234, 212' : '56, 189, 248';

        if (p.radius > 2.2) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rgb}, ${(p.opacity * 0.16).toFixed(3)})`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb}, ${p.opacity.toFixed(3)})`;
        ctx.fill();
      }

      if (!prefersReducedMotion && !document.hidden) {
        animationFrameId = window.requestAnimationFrame(render);
      }
    };

    const handleVisibilityChange = () => {
      if (!document.hidden && !prefersReducedMotion) {
        lastTime = performance.now();
        window.cancelAnimationFrame(animationFrameId);
        animationFrameId = window.requestAnimationFrame(render);
      } else {
        window.cancelAnimationFrame(animationFrameId);
      }
    };

    animationFrameId = window.requestAnimationFrame(render);

    window.addEventListener('resize', syncCanvasSize, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('click', handleClick, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.clearTimeout(readyTimer);
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', syncCanvasSize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('click', handleClick);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-0 h-full w-full transition-opacity duration-[2500ms] ease-out motion-reduce:transition-none ${
        isReady ? 'opacity-100' : 'opacity-0'
      }`}
    />
  );
}
