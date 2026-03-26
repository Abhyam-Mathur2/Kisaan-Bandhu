import { motion } from "framer-motion";
import { Cloud, Droplets, Sun, Wind } from "lucide-react";

const cropX = [72, 112, 152, 192, 232, 272, 312, 352, 392, 432, 472, 512];
const cropRows = [
  { y: 248, scale: 0.78, opacity: 0.58 },
  { y: 268, scale: 1, opacity: 1 },
];
const skyBirds = [
  { x: 122, y: 74, scale: 0.9, duration: 3.8, delay: 0 },
  { x: 184, y: 58, scale: 0.72, duration: 4.3, delay: 0.2 },
  { x: 432, y: 66, scale: 1, duration: 4.1, delay: 0.35 },
  { x: 504, y: 86, scale: 0.74, duration: 4.6, delay: 0.5 },
];

export default function FarmHeroIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-[620px] rounded-[2rem] border border-emerald-200/70 bg-white/80 shadow-2xl overflow-hidden backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-b from-sky-100/80 via-emerald-50/70 to-emerald-100/80" />

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        className="absolute right-10 top-8 text-amber-500"
      >
        <Sun size={44} strokeWidth={2.3} />
      </motion.div>

      <motion.div
        animate={{ x: [0, 14, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-10 top-8 text-slate-400/80"
      >
        <Cloud size={42} strokeWidth={2} />
      </motion.div>

      <motion.div
        animate={{ x: [0, -12, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-28 top-14 text-slate-500/70"
      >
        <Cloud size={30} strokeWidth={2} />
      </motion.div>

      <svg viewBox="0 0 600 360" className="relative z-10 w-full h-auto">
        {skyBirds.map((bird, i) => (
          <motion.g
            key={`bird-${i}`}
            transform={`translate(${bird.x} ${bird.y}) scale(${bird.scale})`}
            animate={{ x: [0, 8, 0], y: [0, -2, 0] }}
            transition={{ duration: bird.duration, repeat: Infinity, ease: "easeInOut", delay: bird.delay }}
            opacity="0.55"
          >
            <path d="M0 5 Q 5 0 10 5 Q 15 0 20 5" fill="none" stroke="#065f46" strokeWidth="1.7" />
          </motion.g>
        ))}

        <path d="M0 196 C120 148, 240 238, 360 182 C450 140, 540 182, 600 162 L600 360 L0 360 Z" fill="#a7f3d0" />
        <path d="M0 232 C140 188, 290 282, 420 220 C500 190, 555 220, 600 208 L600 360 L0 360 Z" fill="#6ee7b7" />
        <path d="M0 270 C140 240, 310 324, 600 270 L600 360 L0 360 Z" fill="#34d399" />

        <g opacity="0.35" stroke="#0f766e" strokeWidth="2">
          <path d="M60 304 C160 276, 260 336, 360 304 C440 280, 510 316, 580 302" fill="none" />
          <path d="M40 320 C150 292, 280 348, 390 320 C470 296, 530 336, 590 322" fill="none" />
        </g>

        {cropRows.map((row, rowIndex) => (
          <g key={`row-${row.y}`} opacity={row.opacity}>
            {cropX.map((x, i) => (
              <g key={`${row.y}-${x}`} transform={`translate(${x} ${row.y}) scale(${row.scale})`}>
                <motion.g
                  animate={{ rotate: [-2, 2, -2] }}
                  transition={{ duration: 2.6 + (i % 3) * 0.35 + rowIndex * 0.2, repeat: Infinity, ease: "easeInOut" }}
                  style={{ transformOrigin: "0px 36px" }}
                >
                  <line x1="0" y1="40" x2="0" y2="-2" stroke={rowIndex === 0 ? "#0f766e" : "#047857"} strokeWidth="3" strokeLinecap="round" />
                  <ellipse cx="-8" cy="14" rx="8" ry="4" fill="#059669" transform="rotate(-26 -8 14)" />
                  <ellipse cx="8" cy="6" rx="8" ry="4" fill="#10b981" transform="rotate(26 8 6)" />
                  <ellipse cx="-7" cy="25" rx="6" ry="3" fill="#34d399" transform="rotate(-24 -7 25)" />
                </motion.g>
              </g>
            ))}
          </g>
        ))}
      </svg>

      <div className="relative z-20 border-t border-emerald-200/70 bg-white/80 px-6 py-4">
        <div className="grid grid-cols-3 gap-3 text-xs sm:text-sm">
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/80 px-3 py-2">
            <div className="flex items-center gap-2 text-emerald-700 font-bold">
              <Droplets size={14} />
              Moisture
            </div>
            <p className="text-emerald-900/70 mt-1">62% ideal</p>
          </div>
          <div className="rounded-xl border border-amber-100 bg-amber-50/80 px-3 py-2">
            <div className="flex items-center gap-2 text-amber-700 font-bold">
              <Sun size={14} />
              Sunlight
            </div>
            <p className="text-amber-900/70 mt-1">7.4 hr/day</p>
          </div>
          <div className="rounded-xl border border-cyan-100 bg-cyan-50/80 px-3 py-2">
            <div className="flex items-center gap-2 text-cyan-700 font-bold">
              <Wind size={14} />
              Wind
            </div>
            <p className="text-cyan-900/70 mt-1">9 km/h mild</p>
          </div>
        </div>
      </div>
    </div>
  );
}
