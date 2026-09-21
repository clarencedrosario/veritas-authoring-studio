import React, { useState } from 'react';
import { SyntacticTreeNode, GrammarToken } from '../../types';
import { ZoomIn, ZoomOut, RotateCcw, ChevronDown, ChevronRight, Layers } from 'lucide-react';

interface SyntaxTreeCanvasProps {
  rootNode: SyntacticTreeNode;
  tokens: GrammarToken[];
  hoveredTokenId: string | null;
  onHoverToken: (tokenId: string | null) => void;
  onSelectToken?: (token: GrammarToken) => void;
}

export const SyntaxTreeCanvas: React.FC<SyntaxTreeCanvasProps> = ({
  rootNode,
  tokens,
  hoveredTokenId,
  onHoverToken,
  onSelectToken,
}) => {
  const [zoom, setZoom] = useState(1);
  const [collapsedNodes, setCollapsedNodes] = useState<Record<string, boolean>>({});

  const toggleCollapse = (nodeId: string) => {
    setCollapsedNodes((prev) => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  // Node category badges & colors
  const getBadgeStyle = (label: string) => {
    const l = label.toUpperCase();
    if (l.startsWith('S') || l.includes('CLAUSE')) return 'bg-indigo-600 text-white border-indigo-700 shadow-xs';
    if (l.startsWith('NP')) return 'bg-sky-500 text-white border-sky-600 shadow-xs';
    if (l.startsWith('VP')) return 'bg-emerald-600 text-white border-emerald-700 shadow-xs';
    if (l.startsWith('PP')) return 'bg-amber-600 text-white border-amber-700 shadow-xs';
    if (l.startsWith('ADJ')) return 'bg-purple-500 text-white border-purple-600';
    if (l.startsWith('ADV')) return 'bg-pink-500 text-white border-pink-600';
    if (l.startsWith('DET')) return 'bg-stone-500 text-white border-stone-600';
    if (l === 'N') return 'bg-sky-700 text-white border-sky-800';
    if (l === 'V') return 'bg-emerald-700 text-white border-emerald-800';
    return 'bg-stone-600 text-white border-stone-700';
  };

  const renderTreeNode = (node: SyntacticTreeNode, depth = 0) => {
    const isCollapsed = !!collapsedNodes[node.id];
    const hasChildren = node.children && node.children.length > 0;

    // Check if token highlighted
    const isLeafWord = !hasChildren && node.text;
    let isHighlight = false;
    if (isLeafWord && hoveredTokenId) {
      const matchTok = tokens.find((t) => t.word.toLowerCase() === node.text?.toLowerCase());
      if (matchTok?.id === hoveredTokenId) isHighlight = true;
    }

    return (
      <div key={node.id} className="flex flex-col items-center">
        {/* Node Badge */}
        <div
          onClick={() => hasChildren && toggleCollapse(node.id)}
          onMouseEnter={() => {
            if (isLeafWord && node.text) {
              const matchTok = tokens.find((t) => t.word.toLowerCase() === node.text?.toLowerCase());
              if (matchTok) onHoverToken(matchTok.id);
            }
          }}
          onMouseLeave={() => onHoverToken(null)}
          className={`group flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer select-none ${
            isHighlight ? 'ring-4 ring-amber-400 scale-105' : ''
          } ${getBadgeStyle(node.label)}`}
        >
          <span>{node.label}</span>
          {hasChildren && (
            <span className="opacity-80">
              {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </span>
          )}
        </div>

        {/* Node Full Description Gloss (Tooltip / Subtitle) */}
        <span className="text-[10px] text-stone-500 dark:text-slate-400 mt-1 max-w-[110px] text-center truncate">
          {node.fullLabel || node.label}
        </span>

        {/* Leaf Word Display */}
        {isLeafWord && (
          <div className="mt-2 px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-stone-900 dark:text-slate-100 font-serif font-bold text-sm shadow-2xs">
            "{node.text}"
          </div>
        )}

        {/* Children Branches */}
        {hasChildren && !isCollapsed && (
          <div className="flex flex-col items-center w-full">
            {/* Vertical stem down from parent */}
            <div className="w-[1.5px] h-5 bg-stone-300 dark:bg-slate-700" />

            {/* Horizontal branch bar across all children */}
            <div className="flex items-start justify-center gap-4 sm:gap-6 relative pt-2">
              {/* Branch connector line across children */}
              {node.children!.length > 1 && (
                <div className="absolute top-0 left-6 right-6 h-[1.5px] bg-stone-300 dark:bg-slate-700" />
              )}
              {node.children!.map((child) => (
                <div key={child.id} className="relative flex flex-col items-center">
                  <div className="w-[1.5px] h-2 bg-stone-300 dark:bg-slate-700" />
                  {renderTreeNode(child, depth + 1)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative w-full h-[520px] rounded-2xl border border-stone-200 dark:border-slate-800 bg-stone-50/50 dark:bg-slate-900/60 overflow-auto p-6 select-none shadow-inner">
      {/* Canvas Controls */}
      <div className="sticky top-0 right-0 z-10 flex items-center justify-between pb-4">
        <div className="flex items-center space-x-2 text-xs font-bold text-stone-700 dark:text-slate-300">
          <Layers className="w-4 h-4 text-indigo-500" />
          <span>Constituent Syntax Tree (Phrase Structure Grammar)</span>
        </div>

        <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-stone-200 dark:border-slate-700 shadow-xs">
          <button
            onClick={() => setZoom((z) => Math.min(z + 0.1, 1.8))}
            title="Zoom In"
            className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-slate-700 text-xs text-stone-700 dark:text-slate-200"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(z - 0.1, 0.6))}
            title="Zoom Out"
            className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-slate-700 text-xs text-stone-700 dark:text-slate-200"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setZoom(1);
              setCollapsedNodes({});
            }}
            title="Reset Tree"
            className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-slate-700 text-xs text-stone-700 dark:text-slate-200"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tree Viewport with Scale */}
      <div
        className="min-w-max flex justify-center py-6 transition-transform origin-top"
        style={{ transform: `scale(${zoom})` }}
      >
        {renderTreeNode(rootNode)}
      </div>
    </div>
  );
};
