
'use client';

import React, {
  FC,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';

const ANIMATION_CONFIG = {
  SMOOTH_DURATION: 600,
  INITIAL_DURATION: 1500,
};

const clamp = (val: number, min = 0, max = 100) => Math.min(Math.max(val, min), max);
const round = (val: number, p = 3) => parseFloat(val.toFixed(p));
const adjust = (val: number, fromMin: number, fromMax: number, toMin: number, toMax: number) =>
  round(toMin + ((toMax - toMin) * (val - fromMin)) / (fromMax - fromMin));
const easeInOutCubic = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

interface HolographicCardProps {
  children: ReactNode;
  enableTilt?: boolean;
  className?: string;
}

const HolographicCard: FC<HolographicCardProps> = ({
  children,
  enableTilt = true,
  className = '',
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const animationHandlers = useMemo(() => {
    if (!enableTilt) return null;

    let rafId: number | null = null;

    const updateTransform = (offsetX: number, offsetY: number, card: HTMLElement, wrap: HTMLElement) => {
      const { clientWidth: width, clientHeight: height } = card;
      const percentX = clamp((100 / width) * offsetX);
      const percentY = clamp((100 / height) * offsetY);
      const centerX = percentX - 50;
      const centerY = percentY - 50;

      const props: Record<string, string> = {
        '--pointer-x': `${percentX}%`,
        '--pointer-y': `${percentY}%`,
        '--background-x': `${adjust(percentX, 0, 100, 35, 65)}%`,
        '--background-y': `${adjust(percentY, 0, 100, 35, 65)}%`,
        '--pointer-from-center': `${clamp(Math.hypot(centerY, centerX) / 50, 0, 1)}`,
        '--rotate-x': `${round(-(centerY / 5))}deg`,
        '--rotate-y': `${round(centerX / 4)}deg`,
      };
      Object.entries(props).forEach(([p, v]) => wrap.style.setProperty(p, v));
    };

    const smoothAnimation = (duration: number, startX: number, startY: number, card: HTMLElement, wrap: HTMLElement) => {
      const startTime = performance.now();
      const targetX = wrap.clientWidth / 2;
      const targetY = wrap.clientHeight / 2;

      const loop = (currentTime: number) => {
        const progress = clamp((currentTime - startTime) / duration);
        const eased = easeInOutCubic(progress);
        const currentX = adjust(eased, 0, 1, startX, targetX);
        const currentY = adjust(eased, 0, 1, startY, targetY);
        updateTransform(currentX, currentY, card, wrap);
        if (progress < 1) rafId = requestAnimationFrame(loop);
      };
      rafId = requestAnimationFrame(loop);
    };

    return {
      updateTransform,
      smoothAnimation,
      cancel: () => rafId && cancelAnimationFrame(rafId),
    };
  }, [enableTilt]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!cardRef.current || !wrapRef.current || !animationHandlers) return;
    const rect = cardRef.current.getBoundingClientRect();
    animationHandlers.updateTransform(e.clientX - rect.left, e.clientY - rect.top, cardRef.current, wrapRef.current);
  }, [animationHandlers]);

  const handlePointerEnter = useCallback(() => {
    if (!wrapRef.current || !cardRef.current || !animationHandlers) return;
    animationHandlers.cancel();
    wrapRef.current.classList.add('active');
    cardRef.current.classList.add('active');
  }, [animationHandlers]);

  const handlePointerLeave = useCallback((e: React.PointerEvent) => {
    if (!wrapRef.current || !cardRef.current || !animationHandlers) return;
    wrapRef.current.classList.remove('active');
    cardRef.current.classList.remove('active');
    animationHandlers.smoothAnimation(ANIMATION_CONFIG.SMOOTH_DURATION, e.nativeEvent.offsetX, e.nativeEvent.offsetY, cardRef.current, wrapRef.current);
  }, [animationHandlers]);
  
  useEffect(() => {
    if (!enableTilt || !animationHandlers || !wrapRef.current || !cardRef.current) return;

    const wrap = wrapRef.current;
    const card = cardRef.current;
    const { INITIAL_DURATION } = ANIMATION_CONFIG;
    
    const initialX = wrap.clientWidth / 2;
    const initialY = wrap.clientHeight / 2;

    animationHandlers.updateTransform(initialX, initialY, card, wrap);
    animationHandlers.smoothAnimation(INITIAL_DURATION, initialX, initialY, card, wrap);

  }, [enableTilt, animationHandlers]);

  return (
    <div
      ref={wrapRef}
      className={`hc-wrapper ${className}`}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        ref={cardRef}
        className="hc-card"
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{
          position: 'relative',
          background: 'linear-gradient(135deg, rgba(230, 246, 250, 0.15) 0%, rgba(243, 252, 235, 0.15) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '16px',
          padding: '24px',
          transformStyle: 'preserve-3d',
          transform: 'rotateX(var(--rotate-x, 0deg)) rotateY(var(--rotate-y, 0deg))',
          transition: 'transform 0.1s ease-out',
          boxShadow: `
            0 0 6px rgba(0,0,0,0.03),
            0 2px 6px rgba(0,0,0,0.08),
            inset 3px 3px 0.5px -3px rgba(230,246,250,0.9),
            inset -3px -3px 0.5px -3px rgba(243,252,235,0.85),
            inset 1px 1px 1px -0.5px rgba(230,246,250,0.6),
            inset -1px -1px 1px -0.5px rgba(243,252,235,0.6),
            inset 0 0 6px 6px rgba(230,246,250,0.12),
            inset 0 0 2px 2px rgba(243,252,235,0.06),
            0 0 12px rgba(230,246,250,0.15)
          `,
        }}
      >
        <div className="hc-inside" style={{ position: 'relative', zIndex: 1 }}>
          <div 
            className="hc-shine" 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `radial-gradient(circle at var(--pointer-x, 50%) var(--pointer-y, 50%), rgba(255,255,255,0.2) 0%, transparent 50%)`,
              borderRadius: '16px',
              opacity: 'var(--pointer-from-center, 0)',
              transition: 'opacity 0.2s ease',
            }}
          />
          <div 
            className="hc-glare" 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)`,
              borderRadius: '16px',
              transform: `translateX(calc(var(--pointer-x, 50%) - 50%)) translateY(calc(var(--pointer-y, 50%) - 50%))`,
              opacity: 'var(--pointer-from-center, 0)',
              transition: 'opacity 0.2s ease',
            }}
          />
          <div className="hc-content-wrapper" style={{ position: 'relative', zIndex: 2 }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HolographicCard;
