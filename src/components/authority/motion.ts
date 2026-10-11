import type React from 'react';
import {Easing, interpolate} from 'remotion';

export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);

/** 0→1 over `dur` frames starting at `start`, clamped and eased. */
export const progress = (frame: number, start: number, dur = 18): number =>
  interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });

/** Rise-and-settle entrance used by every card on the board. */
export const rise = (p: number, distance = 26): React.CSSProperties => ({
  opacity: p,
  transform: `translateY(${(1 - p) * distance}px) scale(${0.965 + 0.035 * p})`,
});

/** Make a React useId() value safe for SVG url(#…) references. */
export const svgId = (id: string): string => id.replace(/[^a-zA-Z0-9_-]/g, '');
