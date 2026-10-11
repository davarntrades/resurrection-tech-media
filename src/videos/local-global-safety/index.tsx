import React from 'react';
import type {BoardFormat, BoardMode} from '../../components/authority/paper';
import {SafetyFlow} from '../../templates/SafetyFlow';
import {SCENARIO} from './script';

/** Local + global safety wrapper — registered in Root.tsx in all four masters. */
export const LocalGlobalSafety: React.FC<{
  format: BoardFormat;
  mode: BoardMode;
}> = ({format, mode}) => (
  <SafetyFlow scenario={SCENARIO} format={format} mode={mode} />
);
