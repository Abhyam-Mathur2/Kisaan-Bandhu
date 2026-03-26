import React from "react";

const AnimatedBackground = ({ variant = "landing" }) => {
  const isLanding = variant === "landing";

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Sun/Sunrise Gradient (Landing Only) */}
      {isLanding && (
        <div 
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-amber-200/40 via-orange-100/20 to-transparent blur-[120px]"
          style={{ animation: "shimmer 10s infinite ease-in-out" }}
        />
      )}

      {/* Clouds (Landing Only) */}
      {isLanding && (
        <>
          <Cloud delay="0s" top="10%" scale={1} duration="40s" />
          <Cloud delay="15s" top="15%" scale={0.7} duration="55s" />
          <Cloud delay="5s" top="5%" scale={0.5} duration="70s" />
        </>
      )}

      {/* Birds (Landing Only) */}
      {isLanding && (
        <>
          <Bird delay="3s" top="16%" duration="26s" />
          <Bird delay="10s" top="20%" duration="25s" />
          <Bird delay="14s" top="24%" duration="30s" />
          <Bird delay="18s" top="30%" duration="35s" />
          <Bird delay="24s" top="12%" duration="40s" />
        </>
      )}

      {/* Floating Seeds/Leaves (Both Variants) */}
      {[...Array(isLanding ? 12 : 8)].map((_, i) => (
        <Seed 
          key={i} 
          delay={`${Math.random() * 10}s`} 
          left={`${Math.random() * 100}%`} 
          size={isLanding ? 8 + Math.random() * 12 : 4 + Math.random() * 8}
        />
      ))}
    </div>
  );
};

const Cloud = ({ delay, top, scale, duration }) => (
  <div 
    className="absolute left-[-200px] opacity-40 will-change-transform"
    style={{ 
      top, 
      transform: `scale(${scale})`,
      animation: `drift ${duration} infinite linear ${delay}`
    }}
  >
    <svg width="200" height="100" viewBox="0 0 200 100" fill="white">
      <path d="M40 80 Q 20 80 20 60 Q 20 40 40 40 Q 45 20 70 20 Q 95 20 100 40 Q 120 20 150 20 Q 180 20 180 50 Q 180 80 150 80 Z" />
    </svg>
  </div>
);

const Seed = ({ delay, left, size }) => (
  <div 
    className="absolute bottom-0 opacity-0 will-change-transform"
    style={{ 
      left, 
      width: `${size}px`, 
      height: `${size}px`,
      animation: `float-up 10s infinite linear ${delay}`
    }}
  >
    <svg viewBox="0 0 10 10" fill="#10b981" opacity="0.4">
      <path d="M5 0 C 8 3 8 7 5 10 C 2 7 2 3 5 0 Z" />
    </svg>
  </div>
);

const Bird = ({ delay, top, duration }) => (
  <div 
    className="absolute left-[-50px] opacity-30 will-change-transform"
    style={{ 
      top,
      animation: `drift ${duration} infinite linear ${delay}`
    }}
  >
    <svg width="20" height="15" viewBox="0 0 20 15" fill="none" stroke="#064e3b" strokeWidth="1.5">
      <path d="M0 5 Q 5 0 10 5 Q 15 0 20 5" />
    </svg>
  </div>
);

export default AnimatedBackground;
