import React from 'react';
import {ExplainerTemplate} from '../../templates/ExplainerTemplate';
import {runtimeGovernanceScript} from './script';

/**
 * Composition wrapper for "What is Runtime Governance?". Binds the explainer
 * template to its script. Registered in Root.tsx as `RuntimeGovernanceExplainer`.
 */
export const RuntimeGovernanceExplainer: React.FC = () => {
  return <ExplainerTemplate script={runtimeGovernanceScript} />;
};
