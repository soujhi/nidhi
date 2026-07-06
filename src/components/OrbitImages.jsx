import { useState } from 'react';
import { motion } from 'framer-motion';

export default function OrbitImages({ images = [] }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Orbit parameters
  const radius = 220; // Radius of orbit in pixels
  const duration = 45; // Duration of one orbit in seconds

  return (
    <div className="relative w-full h-[550px] flex items-center justify-center overflow-hidden">
      {/* Central Star/Core */}
      <div className="absolute z-10 w-16 h-16 rounded-full bg-gradient-to-tr from-glow-purple to-gold-champagne blur-xl opacity-40 animate-pulse-slow pointer-events-none" />
      
      {/* Dashed Orbit Ring */}
      <div 
        className="absolute rounded-full border border-dashed border-gold-champagne/10 pointer-events-none"
        style={{
          width: `${radius * 2}px`,
          height: `${radius * 2}px`,
        }}
      />

      {/* Rotating orbit path wrapper */}
      <motion.div
        className="relative w-full h-full flex items-center justify-center"
        animate={hoveredIndex === null ? { rotate: 360 } : {}}
        transition={{
          repeat: Infinity,
          duration: duration,
          ease: "linear"
        }}
        style={{ originX: '50%', originY: '50%' }}
      >
        {images.map((item, index) => {
          // Space images evenly around the circle
          const angle = (index / images.length) * 360;
          const radian = (angle * Math.PI) / 180;
          const x = Math.cos(radian) * radius;
          const y = Math.sin(radian) * radius;

          return (
            <div
              key={index}
              className="absolute"
              style={{
                left: `calc(50% + ${x}px - 70px)`, // Offset by half of card width (140px)
                top: `calc(50% + ${y}px - 90px)`,  // Offset by half of card height (180px)
                width: '140px',
                height: '180px',
                transformOrigin: 'center center',
              }}
            >
              {/* Counter-rotating card to keep the image upright */}
              <motion.div
                className="w-full h-full"
                animate={
                  hoveredIndex === null 
                    ? { rotate: -360 } 
                    : hoveredIndex === index 
                    ? { rotate: 0, scale: 1.25, zIndex: 50 } 
                    : { rotate: -360, opacity: 0.3, scale: 0.9 }
                }
                transition={
                  hoveredIndex === null 
                    ? {
                        rotate: {
                          repeat: Infinity,
                          duration: duration,
                          ease: "linear"
                        }
                      }
                    : { type: 'spring', stiffness: 300, damping: 20 }
                }
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Polaroid Frame */}
                <div className="w-full h-full bg-zinc-950 p-2 border border-white/10 rounded shadow-2xl flex flex-col justify-between cursor-pointer transition-colors duration-300 hover:border-gold-champagne/40">
                  <div className="w-full h-[120px] bg-zinc-900 rounded overflow-hidden relative">
                    <img
                      src={item.src}
                      alt={item.caption}
                      className="w-full h-full object-cover grayscale contrast-[1.1] hover:grayscale-0 transition-all duration-500"
                      onError={(e) => {
                        // Fallback layout if the photo doesn't exist yet
                        e.target.style.display = 'none';
                        e.target.parentNode.innerHTML = `
                          <div class="w-full h-full flex flex-col items-center justify-center p-2 text-center text-[10px] text-gold-champagne/60 font-mono border border-dashed border-gold-champagne/20 bg-zinc-950">
                            <span>Image missing</span>
                            <span class="mt-1 text-[8px] text-zinc-500 font-mono">${item.src.split('/').pop()}</span>
                          </div>
                        `;
                      }}
                    />
                  </div>
                  
                  {/* Captions - Caveat Handwritten font */}
                  <div className="h-[36px] flex items-center justify-center text-center">
                    <span className="font-handwritten text-gold-champagne text-sm font-medium tracking-wide truncate max-w-full px-1">
                      {item.caption}
                    </span>
                  </div>
                </div>

                {/* Expanded Caption Tooltip below hovered card */}
                {hoveredIndex === index && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-48 text-center bg-space-black/90 px-3 py-1.5 rounded-lg border border-gold-champagne/20 shadow-2xl backdrop-blur-md pointer-events-none"
                  >
                    <p className="font-handwritten text-gold-champagne text-base leading-tight">
                      {item.fullCaption}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
