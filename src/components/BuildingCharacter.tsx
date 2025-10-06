import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface BuildingCharacterProps {
  color: string;
  height: number;
  width: number;
  x: number;
  y: number;
  mouseX: number;
  mouseY: number;
  isClicked: boolean;
}

export const BuildingCharacter = ({
  color,
  height,
  width,
  x,
  y,
  mouseX,
  mouseY,
  isClicked
}: BuildingCharacterProps) => {
  const [eyeX, setEyeX] = useState(0);
  const [eyeY, setEyeY] = useState(0);
  const [expression, setExpression] = useState<'happy' | 'excited' | 'neutral'>('neutral');

  useEffect(() => {
    const centerX = x + width / 2;
    const centerY = y + height / 3;

    const angle = Math.atan2(mouseY - centerY, mouseX - centerX);
    const distance = Math.min(3, Math.hypot(mouseX - centerX, mouseY - centerY) / 100);

    setEyeX(Math.cos(angle) * distance);
    setEyeY(Math.sin(angle) * distance);
  }, [mouseX, mouseY, x, y, width, height]);

  useEffect(() => {
    if (isClicked) {
      setExpression('excited');
      const timer = setTimeout(() => setExpression('happy'), 500);
      return () => clearTimeout(timer);
    }
  }, [isClicked]);

  const mouthPath = expression === 'excited'
    ? `M ${width * 0.3} ${height * 0.65} Q ${width * 0.5} ${height * 0.75} ${width * 0.7} ${height * 0.65}`
    : expression === 'happy'
    ? `M ${width * 0.3} ${height * 0.65} Q ${width * 0.5} ${height * 0.72} ${width * 0.7} ${height * 0.65}`
    : `M ${width * 0.35} ${height * 0.7} L ${width * 0.65} ${height * 0.7}`;

  return (
    <motion.div
      className="absolute"
      style={{ left: x, top: y }}
      animate={{
        y: isClicked ? -10 : 0,
        rotate: isClicked ? [0, -5, 5, -5, 0] : 0
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id={`grad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: color, stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: color, stopOpacity: 0.7 }} />
          </linearGradient>
        </defs>

        <rect
          x="0"
          y="0"
          width={width}
          height={height}
          rx="8"
          fill={`url(#grad-${color})`}
        />

        <rect x={width * 0.15} y={height * 0.15} width={width * 0.2} height={height * 0.15} fill="rgba(255,255,255,0.3)" rx="2" />
        <rect x={width * 0.65} y={height * 0.15} width={width * 0.2} height={height * 0.15} fill="rgba(255,255,255,0.3)" rx="2" />
        <rect x={width * 0.15} y={height * 0.35} width={width * 0.2} height={height * 0.15} fill="rgba(255,255,255,0.3)" rx="2" />
        <rect x={width * 0.65} y={height * 0.35} width={width * 0.2} height={height * 0.15} fill="rgba(255,255,255,0.3)" rx="2" />

        <g>
          <circle
            cx={width * 0.35 + eyeX}
            cy={height * 0.45 + eyeY}
            r={width * 0.05}
            fill="#1f2937"
          />
          <circle
            cx={width * 0.65 + eyeX}
            cy={height * 0.45 + eyeY}
            r={width * 0.05}
            fill="#1f2937"
          />

          <circle
            cx={width * 0.35 + eyeX + 2}
            cy={height * 0.45 + eyeY - 1}
            r={width * 0.02}
            fill="white"
          />
          <circle
            cx={width * 0.65 + eyeX + 2}
            cy={height * 0.45 + eyeY - 1}
            r={width * 0.02}
            fill="white"
          />
        </g>

        <motion.path
          d={mouthPath}
          stroke="#1f2937"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          animate={{ d: mouthPath }}
          transition={{ duration: 0.3 }}
        />

        {expression === 'excited' && (
          <>
            <line x1={width * 0.25} y1={height * 0.38} x2={width * 0.3} y2={height * 0.35} stroke="#1f2937" strokeWidth="2" strokeLinecap="round" />
            <line x1={width * 0.75} y1={height * 0.38} x2={width * 0.7} y2={height * 0.35} stroke="#1f2937" strokeWidth="2" strokeLinecap="round" />
          </>
        )}
      </svg>
    </motion.div>
  );
};
