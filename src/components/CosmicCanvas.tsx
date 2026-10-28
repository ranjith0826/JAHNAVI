import React, { useEffect, useRef } from 'react';

interface CosmicCanvasProps {
  isWarping?: boolean;
}

interface Star {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  alpha: number;
  twinkleSpeed: number;
  color: string;
  vx: number;
  vy: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  trail: Array<{ x: number; y: number; alpha: number }>;
}

export const CosmicCanvas: React.FC<CosmicCanvasProps> = ({ isWarping = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX - width / 2) * 0.04;
      mouseRef.current.targetY = (e.clientY - height / 2) * 0.04;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // Star Colors Palette
    const starColors = ['#FFFFFF', '#FDF8F0', '#FDE047', '#E0F2FE', '#E9D5FF', '#FBCFE8'];

    let stars: Star[] = [];
    const numStars = Math.min(450, Math.floor((width * height) / 3200));

    const initStars = () => {
      stars = [];
      for (let i = 0; i < numStars; i++) {
        const radius = Math.random() < 0.85 ? Math.random() * 1.2 + 0.4 : Math.random() * 1.8 + 1.2;
        const color = starColors[Math.floor(Math.random() * starColors.length)];
        const baseAlpha = Math.random() * 0.7 + 0.3;
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius,
          baseAlpha,
          alpha: baseAlpha,
          twinkleSpeed: Math.random() * 0.03 + 0.008,
          color,
          vx: (Math.random() - 0.5) * 0.15,
          vy: -Math.random() * 0.2 - 0.05, // gentle upward drift
        });
      }
    };

    initStars();

    // Shooting stars state
    const shootingStars: ShootingStar[] = [];
    let nextShootingStarTime = Date.now() + 1500;

    const spawnShootingStar = () => {
      const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.3; // ~45 degrees diagonal
      const startX = Math.random() * width * 0.8;
      const startY = Math.random() * (height * 0.4);
      shootingStars.push({
        x: startX,
        y: startY,
        length: Math.random() * 80 + 70,
        speed: Math.random() * 12 + 14,
        angle,
        opacity: 1,
        trail: [],
      });
      nextShootingStarTime = Date.now() + Math.random() * 3500 + 2000;
    };

    let warpProgress = 0;

    const render = () => {
      // Smooth mouse parallax lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      if (isWarping) {
        warpProgress = Math.min(1, warpProgress + 0.02);
      } else {
        warpProgress = Math.max(0, warpProgress - 0.03);
      }

      ctx.clearRect(0, 0, width, height);

      // Deep Cosmic Nebula backdrop gradient
      const bgGradient = ctx.createRadialGradient(
        width * 0.5,
        height * 0.3,
        50,
        width * 0.5,
        height * 0.5,
        Math.max(width, height)
      );
      bgGradient.addColorStop(0, '#0a0b26');
      bgGradient.addColorStop(0.4, '#060719');
      bgGradient.addColorStop(0.8, '#03030c');
      bgGradient.addColorStop(1, '#010207');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Subtle Violet & Magenta Nebula Cloud Glow
      const nebula1 = ctx.createRadialGradient(
        width * 0.25 + mouseRef.current.x * 0.5,
        height * 0.35 + mouseRef.current.y * 0.5,
        20,
        width * 0.25,
        height * 0.35,
        width * 0.45
      );
      nebula1.addColorStop(0, 'rgba(147, 51, 234, 0.12)');
      nebula1.addColorStop(0.5, 'rgba(88, 28, 135, 0.05)');
      nebula1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = nebula1;
      ctx.fillRect(0, 0, width, height);

      const nebula2 = ctx.createRadialGradient(
        width * 0.75 - mouseRef.current.x * 0.5,
        height * 0.65 - mouseRef.current.y * 0.5,
        30,
        width * 0.75,
        height * 0.65,
        width * 0.4
      );
      nebula2.addColorStop(0, 'rgba(236, 72, 153, 0.08)');
      nebula2.addColorStop(0.4, 'rgba(245, 158, 11, 0.04)');
      nebula2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = nebula2;
      ctx.fillRect(0, 0, width, height);

      // Draw and animate stars
      const centerX = width / 2;
      const centerY = height / 2;

      stars.forEach(star => {
        if (warpProgress > 0.05) {
          // Warp hyper-drive streak effect
          const dx = star.x - centerX;
          const dy = star.y - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const speed = (dist / 12) * warpProgress * 2.5;

          const tailX = star.x - (dx / dist) * speed * 2;
          const tailY = star.y - (dy / dist) * speed * 2;

          ctx.strokeStyle = star.color;
          ctx.lineWidth = star.radius * (1 + warpProgress);
          ctx.beginPath();
          ctx.moveTo(star.x, star.y);
          ctx.lineTo(tailX, tailY);
          ctx.stroke();

          star.x += (dx / dist) * speed;
          star.y += (dy / dist) * speed;

          if (star.x < 0 || star.x > width || star.y < 0 || star.y > height) {
            star.x = centerX + (Math.random() - 0.5) * 80;
            star.y = centerY + (Math.random() - 0.5) * 80;
          }
        } else {
          // Regular gentle twinkle and drift
          star.alpha += Math.sin(Date.now() * star.twinkleSpeed * 0.1) * 0.015;
          star.alpha = Math.max(0.15, Math.min(1, star.alpha));

          star.x += star.vx;
          star.y += star.vy;

          if (star.y < 0) star.y = height;
          if (star.x < 0) star.x = width;
          if (star.x > width) star.x = 0;

          const posX = star.x + mouseRef.current.x * (star.radius * 0.6);
          const posY = star.y + mouseRef.current.y * (star.radius * 0.6);

          ctx.save();
          ctx.beginPath();
          ctx.arc(posX, posY, star.radius, 0, Math.PI * 2);
          ctx.fillStyle = star.color;
          ctx.globalAlpha = star.alpha;
          ctx.shadowBlur = star.radius > 1.2 ? 8 : 2;
          ctx.shadowColor = star.color;
          ctx.fill();
          ctx.restore();
        }
      });

      // Handle shooting stars
      if (Date.now() > nextShootingStarTime && !isWarping) {
        spawnShootingStar();
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.opacity -= 0.016;

        if (ss.opacity <= 0 || ss.x > width || ss.y > height) {
          shootingStars.splice(i, 1);
          continue;
        }

        const tailX = ss.x - Math.cos(ss.angle) * ss.length;
        const tailY = ss.y - Math.sin(ss.angle) * ss.length;

        const grad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        grad.addColorStop(0.7, 'rgba(253, 224, 71, ' + (ss.opacity * 0.6) + ')');
        grad.addColorStop(1, 'rgba(255, 255, 255, ' + ss.opacity + ')');

        ctx.save();
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(ss.x, ss.y);
        ctx.stroke();

        // Shimmering head
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#FDE047';
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isWarping]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 w-full h-full"
      style={{ willChange: 'transform' }}
    />
  );
};
