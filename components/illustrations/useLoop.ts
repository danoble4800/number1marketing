'use client';

import { useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useState, type RefObject } from 'react';

export const EASE = [0.25, 0, 0, 1] as const;

// Steps through 0..steps-1 on a timer while `ref` is on screen. Reduced motion
// shows the finished last step. Shared by the looping illustrations site-wide.
export function useLoop(ref: RefObject<HTMLElement>, steps: number, stepMs: number) {
  const inView = useInView(ref, { margin: '-80px' });
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduceMotion) {
      setStep(steps - 1);
      return;
    }
    if (!inView) return;
    const id = setInterval(() => setStep((s) => (s + 1) % steps), stepMs);
    return () => clearInterval(id);
  }, [inView, reduceMotion, steps, stepMs]);

  return step;
}

// Shared entrance for chips and bubbles that pop into a scene.
export const pop = {
  initial: { opacity: 0, y: 10, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.35, ease: EASE },
};
