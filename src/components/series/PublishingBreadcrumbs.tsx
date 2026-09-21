import React from 'react';
import { ChevronRight, Home, BookOpen, Layers, Globe2, BookMarked, Sparkles } from 'lucide-react';
import { MainTab } from '../Sidebar';

export interface BreadcrumbItem {
  label: string;
  tab?: MainTab;
  onClick?: () => void;
  icon?: React.ComponentType<{ className?: string }>;
  isCurrent?: boolean;
}

interface PublishingBreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const PublishingBreadcrumbs: React.FC<PublishingBreadcrumbsProps> = ({
  items,
  className = '',
}) => {
  return (
    <nav
      id="publishing-hierarchy-breadcrumbs"
      aria-label="Publishing Hierarchy Breadcrumb"
      className={`flex items-center flex-wrap gap-1.5 py-2 px-3 sm:px-4 rounded-xl bg-[#F6F0E7]/90 dark:bg-[#2b1622]/90 border border-[#CBBEAC] dark:border-[#4f2c3d] text-xs shadow-2xs ${className}`}
    >
      <div className="flex items-center space-x-1 text-[#9A7438] dark:text-[#C29A52] font-semibold text-[11px] uppercase tracking-wider font-mono mr-1">
        <span>Hierarchy</span>
      </div>

      {items.map((item, index) => {
        const isLast = index === items.length - 1 || item.isCurrent;
        const Icon = item.icon;

        return (
          <React.Fragment key={`${item.label}-${index}`}>
            {index > 0 && (
              <ChevronRight className="w-3.5 h-3.5 text-[#9A7438]/60 dark:text-[#C29A52]/60 shrink-0" />
            )}

            {isLast ? (
              <span
                id={`breadcrumb-current-${index}`}
                className="font-serif font-bold text-[#5A1832] dark:text-[#E6C994] flex items-center space-x-1.5 px-2 py-1 rounded-md bg-[#EDE4D6] dark:bg-[#35101F]/80 border border-[#CBBEAC]/50 dark:border-[#5A1832]"
              >
                {Icon && <Icon className="w-3.5 h-3.5 shrink-0 text-[#C29A52]" />}
                <span className="truncate max-w-[240px] sm:max-w-none">{item.label}</span>
              </span>
            ) : (
              <button
                type="button"
                id={`breadcrumb-link-${index}`}
                onClick={item.onClick}
                className="text-[#71685E] dark:text-[#c9b9a6] hover:text-[#35101F] dark:hover:text-[#F6F0E7] flex items-center space-x-1 px-1.5 py-0.5 rounded hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] transition-colors truncate max-w-[200px] sm:max-w-none font-medium"
              >
                {Icon && <Icon className="w-3.5 h-3.5 shrink-0 text-[#9A7438] dark:text-[#C29A52]" />}
                <span>{item.label}</span>
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
