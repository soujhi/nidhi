import { useEffect, useRef } from 'react';

export default function GalaxyBackground({ 
  density = 300, 
  rotationSpeed = 0.05, 
  mouseRepulsion = true,
  glowColor = 'rgba(44, 22, 84, 0.15)', // Subtle purple glow
  goldGlowColor = 'rgba(223, 192, 128, 0.05)' // Champagne gold glow
}) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let stars = [];
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let centerX = width / 2;
    let centerY = height / 2;

    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Handle resize
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      centerX = width / 2;
      centerY = height / 2;
      initStars();
    };

    // Track mouse
    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
      mouseRef.current.active = false;
    };

    // Initialize stars in a galaxy spiral / orbit
    const initStars = () => {
      stars = [];
      const numStars = Math.min(density, (width * height) / 3000); // Scale with screen size

      for (let i = 0; i < numStars; i++) {
        // Distribute stars in an orbital system around center
        const radius = Math.random() * Math.max(width, height) * 0.7;
        const angle = Math.random() * Math.PI * 2;
        const size = Math.random() * 1.5 + 0.3;
        
        // Color distribution: mostly white, some champagne gold, some pale violet
        let color = 'rgba(255, 255, 255, ';
        const rand = Math.random();
        if (rand > 0.9) {
          color = 'rgba(223, 192, 128, '; // Champagne gold
        } else if (rand > 0.75) {
          color = 'rgba(192, 132, 252, '; // Pale purple
        }

        stars.push({
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
          originX: centerX + Math.cos(angle) * radius,
          originY: centerY + Math.sin(angle) * radius,
          radius,
          angle,
          speed: (Math.random() * 0.0002 + 0.00005) * (prefersReducedMotion ? 0.1 : 1),
          size,
          opacity: Math.random() * 0.8 + 0.2,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
          twinkleDir: Math.random() > 0.5 ? 1 : -1,
          repelled: false,
          repelX: 0,
          repelY: 0
        });
      }
    };

    // Animate loop
    const animate = () => {
      // Clear with dark transparent black to create subtle trail
      ctx.fillStyle = 'rgba(5, 5, 5, 0.15)';
      ctx.fillRect(0, 0, width, height);

      // Draw large radial glow in the center
      const coreGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(width, height) * 0.5);
      coreGlow.addColorStop(0, glowColor);
      coreGlow.addColorStop(0.3, goldGlowColor);
      coreGlow.addColorStop(1, 'rgba(5, 5, 5, 0)');
      ctx.fillStyle = coreGlow;
      ctx.fillRect(0, 0, width, height);

      const mouse = mouseRef.current;

      stars.forEach((star) => {
        // Orbit update
        if (!prefersReducedMotion) {
          star.angle += star.speed * (rotationSpeed * 20);
        }

        // Calculate standard orbital position
        let targetX = centerX + Math.cos(star.angle) * star.radius;
        let targetY = centerY + Math.sin(star.angle) * star.radius;

        // Mouse repulsion physics
        if (mouseRepulsion && mouse.active) {
          const dx = targetX - mouse.x;
          const dy = targetY - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const repulsionRadius = 150;

          if (dist < repulsionRadius) {
            const force = (repulsionRadius - dist) / repulsionRadius; // 0 to 1
            const angle = Math.atan2(dy, dx);
            const pushDist = force * 40; // Max push pixels
            
            // Push star away
            star.repelX += (Math.cos(angle) * pushDist - star.repelX) * 0.1;
            star.repelY += (Math.sin(angle) * pushDist - star.repelY) * 0.1;
            star.repelled = true;
          } else {
            // Smoothly drift back to orbit
            star.repelX *= 0.95;
            star.repelY *= 0.95;
            if (Math.abs(star.repelX) < 0.1) star.repelX = 0;
            if (Math.abs(star.repelY) < 0.1) star.repelY = 0;
          }
        } else {
          // Fade repulsion
          star.repelX *= 0.92;
          star.repelY *= 0.92;
        }

        star.x = targetX + star.repelX;
        star.y = targetY + star.repelY;

        // Twinkle update
        star.opacity += star.twinkleSpeed * star.twinkleDir;
        if (star.opacity >= 1) {
          star.opacity = 1;
          star.twinkleDir = -1;
        } else if (star.opacity <= 0.1) {
          star.opacity = 0.1;
          star.twinkleDir = 1;
        }

        // Draw star
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        
        let strokeColor = '';
        if (star.size > 1.2) {
          // Brightest stars get glowing effect
          ctx.shadowBlur = 4;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
        } else {
          ctx.shadowBlur = 0;
        }

        if (star.size > 1.0 && Math.random() > 0.99) {
          // Render cross flare for random special stars
          ctx.fillStyle = `rgba(223, 192, 128, ${star.opacity * 0.8})`;
          ctx.fillRect(star.x - star.size * 2, star.y, star.size * 4, 0.5);
          ctx.fillRect(star.x, star.y - star.size * 2, 0.5, star.size * 4);
        }

        ctx.fillStyle = star.size > 1.2 ? `rgba(255, 255, 255, ${star.opacity})` : (star.size > 0.8 ? `rgba(223, 192, 128, ${star.opacity * 0.8})` : `rgba(192, 132, 252, ${star.opacity * 0.6})`);
        ctx.fill();
      });

      // Clear shadow properties for performance
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    // Init and start
    initStars();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [density, rotationSpeed, mouseRepulsion, glowColor, goldGlowColor]);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full -z-10 bg-space-black pointer-events-none block" />;
}
