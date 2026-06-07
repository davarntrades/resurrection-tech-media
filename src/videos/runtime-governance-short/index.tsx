import React from 'react';
import {ShortTemplate} from '../../templates/ShortTemplate';

/**
 * Feed short composition wrapper. `compact` tunes the layout for the square
 * (1:1) master; the vertical (9:16) master uses the default. Registered in
 * Root.tsx as RuntimeGovernanceShort_9x16 and _1x1.
 */
export const RuntimeGovernanceShort: React.FC<{compact?: boolean}> = ({
  compact = false,
}) => {
  return <ShortTemplate compact={compact} />;
};
