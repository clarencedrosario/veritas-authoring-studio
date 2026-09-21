import React from 'react';
import {
  GrammarSeriesProject,
  GrammarClassLevel,
} from '../../types';
import { BookProductionDesk } from '../book-production/layout/BookProductionDesk';

export interface TextbookLayoutExporterViewProps {
  seriesProject: GrammarSeriesProject;
  onUpdateSeriesProject?: (updated: GrammarSeriesProject) => void;
  isDarkMode: boolean;
  onNavigateToPreview?: () => void;
  onNavigateToMatrix?: () => void;
  onNavigateToClassTextbook?: (cls: GrammarClassLevel) => void;
}

/**
 * Phase 4G: VERITAS BOOK PRODUCTION DESK
 * Professional publishing-production workspace providing deterministic pagination,
 * real page geometry, master pages, live preflight engine, and prepress export.
 */
export const TextbookLayoutExporterView: React.FC<TextbookLayoutExporterViewProps> = ({
  seriesProject,
  onUpdateSeriesProject,
  isDarkMode,
  onNavigateToPreview,
  onNavigateToMatrix,
  onNavigateToClassTextbook,
}) => {
  return (
    <BookProductionDesk
      seriesProject={seriesProject}
      onUpdateSeriesProject={onUpdateSeriesProject}
      isDarkMode={isDarkMode}
      onNavigateToPreview={onNavigateToPreview}
      onNavigateToMatrix={onNavigateToMatrix}
      onNavigateToClassTextbook={onNavigateToClassTextbook}
    />
  );
};
