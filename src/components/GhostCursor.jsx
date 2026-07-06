import { useEffect, useRef } from 'react';

export default function GhostCursor() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -100, y: -100, targetX: -100, targetY: -100 });
  const trailRef = useRef([]);
  const activeRef = useRef(false);

  useEffect(() => {
    // Disable custom cursor on touch/mobile devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Set cursor active on body
    document.documentElement.classList.add('custom-cursor-active');

    // Resize canvas to full screen
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();

    const handleMouseMove = (e) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
      activeRef.current = true;
    };

    const handleMouseLeave = () => {
      activeRef.current = false;
    };

    // Initialize trail history
    const trailLength = 15;
    for (let i = 0; i < trailLength; i++) {
      trailRef.current.push({ x: -100, y: -100 });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mouse = mouseRef.current;
      const trail = trailRef.current;

      // Smoothly interpolate current cursor coordinate towards target coordinate (lerp)
      const lerpFactor = 0.15;
      mouse.x += (mouse.targetX - mouse.x) * lerpFactor;
      mouse.y += (mouse.targetY - mouse.y) * lerpFactor;

      // Update trail coordinates using linear chain interpolation
      trail[0].x = mouse.x;
      trail[0].y = mouse.y;

      for (let i = 1; i < trail.length; i++) {
        const prev = trail[i - 1];
        const curr = trail[i];
        
        // Each trail point follows the previous one with a springy delay
        curr.x += (prev.x - curr.x) * 0.45;
        curr.y += (prev.y - curr.y) * 0.45;
      }

      if (activeRef.current || Math.abs(mouse.x - mouse.targetX) > 0.5) {
        // Draw the trailing ghost cursor path
        ctx.beginPath();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Set gold/champagne colors with gradients
        ctx.strokeStyle = 'rgba(223, 192, 128, 0.4)';
        
        // Loop through coordinates and connect with curves
        ctx.moveTo(trail[0].x, trail[0].y);
        for (let i = 1; i < trail.length - 1; i++) {
          const xc = (trail[i].x + trail[i + 1].x) / 2;
          const yc = (trail[i].y + trail[i + 1].y) / 2;
          ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
        }

        // Draw trail with variable width (thick at head, tapering off at tail)
        ctx.lineWidth = 4;
        ctx.stroke();

        // Secondary subtle glow line
        ctx.beginPath();
        ctx.moveTo(trail[0].x, trail[0].y);
        for (let i = 1; i < trail.length - 1; i++) {
          const xc = (trail[i].x + trail[i + 1].x) / 2;
          const yc = (trail[i].y + trail[i + 1].y) / 2;
          ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
        }
        ctx.lineWidth = 10;
        ctx.strokeStyle = 'rgba(223, 192, 128, 0.08)';
        ctx.stroke();

        // Draw the primary cursor node (sleek solid gold point)
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#dfc080';
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(223, 192, 128, 0.6)';
        ctx.fill();

        // Draw interactive ring surrounding core cursor
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 10, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(223, 192, 128, 0.5)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    animate();

    return () => {
      document.documentElement.classList.remove('custom-cursor-active');
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[9999] block"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
