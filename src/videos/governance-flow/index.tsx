import React from 'react';
import {GovernanceFlow as Flow} from '../../templates/GovernanceFlow';
import {SCENARIO} from './script';

/** Reference-architecture flow — registered in Root.tsx (9:16). */
export const GovernanceFlow: React.FC = () => <Flow scenario={SCENARIO} />;
