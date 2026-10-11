import React from 'react';
import type {BoardFormat, BoardMode} from '../../components/authority/paper';
import {AuthorityBoard} from '../../templates/AuthorityBoard';
import {SCENARIO} from './script';

/** Board composition wrapper — registered in Root.tsx in all four masters. */
export const MaterialsDiscovery: React.FC<{
  format: BoardFormat;
  mode: BoardMode;
}> = ({format, mode}) => (
  <AuthorityBoard scenario={SCENARIO} format={format} mode={mode} />
);
