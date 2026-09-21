import React, { useRef, useState } from 'react';
import { ReedKelloggNode, GrammarToken, ClauseType } from '../../types';
import { ZoomIn, ZoomOut, RotateCcw, Download, Sparkles } from 'lucide-react';

interface ReedKelloggCanvasProps {
  nodes: ReedKelloggNode[];
  tokens: GrammarToken[];
  hoveredTokenId: string | null;
  onHoverToken: (tokenId: string | null) => void;
  onSelectToken?: (token: GrammarToken) => void;
  canvasTheme: 'blackboard' | 'parchment' | 'modern';
}

export const ReedKelloggCanvas: React.FC<ReedKelloggCanvasProps> = ({
  nodes,
  tokens,
  hoveredTokenId,
  onHoverToken,
  onSelectToken,
  canvasTheme,
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 30, y: 30 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  // Theme styling
  const themeStyles = {
    blackboard: {
      bg: 'bg-[#152e22]',
      border: 'border-[#2d4d3c]',
      lineColor: '#e2f3e8',
      textColor: '#ffffff',
      subColor: '#a7d7bc',
      accentColor: '#fef08a',
      font: 'font-mono',
    },
    parchment: {
      bg: 'bg-[#fcf9f2]',
      border: 'border-[#e8e0d0]',
      lineColor: '#443828',
      textColor: '#292116',
      subColor: '#6f5e47',
      accentColor: '#b45309',
      font: 'font-serif',
    },
    modern: {
      bg: 'bg-white dark:bg-slate-900',
      border: 'border-stone-200 dark:border-slate-800',
      lineColor: '#334155',
      darkLineColor: '#94a3b8',
      textColor: '#0f172a',
      darkTextColor: '#f8fafc',
      subColor: '#475569',
      accentColor: '#4f46e5',
      font: 'font-sans',
    },
  }[canvasTheme];

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleExportSVG = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reed-kellogg-diagram-${Date.now()}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const findMatchingToken = (wordText: string): GrammarToken | undefined => {
    const clean = wordText.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    return tokens.find((t) => t.word.toLowerCase().replace(/[^a-z0-9]/g, '') === clean);
  };

  const isTokenHighlighted = (wordText: string): boolean => {
    if (!hoveredTokenId) return false;
    const tok = findMatchingToken(wordText);
    return tok?.id === hoveredTokenId;
  };

  return (
    <div className={`relative w-full h-[520px] rounded-2xl border ${themeStyles.border} ${themeStyles.bg} overflow-hidden select-none transition-colors shadow-inner`}>
      {/* Floating Canvas Controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center space-x-1.5 p-1 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-stone-200/70 dark:border-slate-700 shadow-sm text-stone-700 dark:text-slate-200">
        <button
          onClick={() => setZoom((z) => Math.min(z + 0.15, 2.2))}
          title="Zoom In"
          className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-slate-700 text-xs font-semibold"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(z - 0.15, 0.5))}
          title="Zoom Out"
          className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-slate-700 text-xs font-semibold"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            setZoom(1);
            setPan({ x: 30, y: 30 });
          }}
          title="Reset View"
          className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-slate-700 text-xs font-semibold"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <div className="h-4 w-[1px] bg-stone-200 dark:bg-slate-700 mx-1" />
        <button
          onClick={handleExportSVG}
          title="Download Diagram as SVG"
          className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center space-x-1"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export SVG</span>
        </button>
      </div>

      {/* Interactive Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-10 max-w-sm p-3 rounded-xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-stone-200/80 dark:border-slate-800 text-xs shadow-sm space-y-1.5">
        <div className="flex items-center space-x-1.5 font-bold text-stone-900 dark:text-slate-100">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Reed-Kellogg Traditional Rules</span>
        </div>
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-stone-600 dark:text-slate-400">
          <div className="flex items-center space-x-1">
            <span className="font-mono font-bold text-stone-800 dark:text-slate-200">|</span>
            <span>Subject / Verb split (full cross)</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="font-mono font-bold text-stone-800 dark:text-slate-200">|</span>
            <span>Direct Object (stops at line)</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="font-mono font-bold text-stone-800 dark:text-slate-200">\</span>
            <span>Subject Complement (slanted)</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="font-mono font-bold text-stone-800 dark:text-slate-200">/</span>
            <span>Modifiers hang diagonally</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas with Pan & Zoom */}
      <svg
        ref={svgRef}
        className={`w-full h-full cursor-grab active:cursor-grabbing ${themeStyles.font}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {nodes.map((node, nodeIdx) => {
            // Layout baseline calculation
            // Base offset for stacked clauses
            const baseY = 120 + nodeIdx * 190;
            const startX = 60;
            const subjectWidth = Math.max(140, node.subject.length * 14 + 50);
            const verbWidth = Math.max(130, node.verb.length * 14 + 50);
            const objectWidth = node.objectOrComplement
              ? Math.max(140, node.objectOrComplement.length * 14 + 50)
              : 0;

            const subjectEndX = startX + subjectWidth;
            const verbEndX = subjectEndX + verbWidth;
            const baselineEndX = verbEndX + objectWidth;

            const isSubjHighlight = isTokenHighlighted(node.subject);
            const isVerbHighlight = isTokenHighlighted(node.verb);
            const isObjHighlight = node.objectOrComplement ? isTokenHighlighted(node.objectOrComplement) : false;

            return (
              <g key={node.clauseId || nodeIdx} className="transition-all duration-200">
                {/* Clause Badge Header */}
                <g transform={`translate(${startX}, ${baseY - 45})`}>
                  <rect
                    x="-8"
                    y="-16"
                    width={180}
                    height="22"
                    rx="6"
                    fill={canvasTheme === 'blackboard' ? '#1f4834' : canvasTheme === 'parchment' ? '#ebdcc6' : '#e0e7ff'}
                  />
                  <text
                    x="8"
                    y="-1"
                    fontSize="11"
                    fontWeight="700"
                    fill={canvasTheme === 'blackboard' ? '#a7d7bc' : canvasTheme === 'parchment' ? '#5a462b' : '#3730a3'}
                  >
                    {node.clauseType === 'principal'
                      ? 'PRINCIPAL CLAUSE'
                      : node.clauseType === 'coordinate'
                      ? 'COORDINATE CLAUSE'
                      : node.clauseType.toUpperCase().replace('_', ' ')}
                  </text>
                </g>

                {/* Coordinating or Subordinating Bridge Line to Parent if present */}
                {node.conjunctionToParent && nodeIdx > 0 && (
                  <g>
                    {/* Vertical / Slanted dashed connection line */}
                    <line
                      x1={startX + 60}
                      y1={baseY - 70}
                      x2={startX + 60}
                      y2={baseY}
                      stroke={canvasTheme === 'blackboard' ? '#e2f3e8' : '#6366f1'}
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />
                    {/* Conjunction label card */}
                    <rect
                      x={startX + 25}
                      y={baseY - 45}
                      width="70"
                      height="20"
                      rx="4"
                      fill={canvasTheme === 'blackboard' ? '#254e38' : '#eef2ff'}
                      stroke={canvasTheme === 'blackboard' ? '#a7d7bc' : '#818cf8'}
                      strokeWidth="1"
                    />
                    <text
                      x={startX + 60}
                      y={baseY - 31}
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="bold"
                      fill={canvasTheme === 'blackboard' ? '#ffffff' : '#312e81'}
                    >
                      {node.conjunctionToParent.word}
                    </text>
                  </g>
                )}

                {/* 1. Primary Horizontal Baseline */}
                <line
                  x1={startX}
                  y1={baseY}
                  x2={baselineEndX}
                  y2={baseY}
                  stroke={canvasTheme === 'blackboard' ? '#e2f3e8' : canvasTheme === 'parchment' ? '#443828' : '#334155'}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* 2. Vertical Dividing Line: Completely crosses the baseline between Subject and Predicate Verb */}
                <line
                  x1={subjectEndX}
                  y1={baseY - 32}
                  x2={subjectEndX}
                  y2={baseY + 32}
                  stroke={canvasTheme === 'blackboard' ? '#e2f3e8' : canvasTheme === 'parchment' ? '#443828' : '#334155'}
                  strokeWidth="3"
                />

                {/* 3. Direct Object or Complement Dividing Line */}
                {node.objectOrComplement && (
                  <>
                    {node.complementType === 'direct_object' ? (
                      // Direct Object: Vertical line that STOPS strictly at the baseline
                      <line
                        x1={verbEndX}
                        y1={baseY - 30}
                        x2={verbEndX}
                        y2={baseY}
                        stroke={canvasTheme === 'blackboard' ? '#e2f3e8' : canvasTheme === 'parchment' ? '#443828' : '#334155'}
                        strokeWidth="3"
                      />
                    ) : (
                      // Subject/Object Complement: Slanted line tilting backward toward verb
                      <line
                        x1={verbEndX - 10}
                        y1={baseY - 30}
                        x2={verbEndX}
                        y2={baseY}
                        stroke={canvasTheme === 'blackboard' ? '#e2f3e8' : canvasTheme === 'parchment' ? '#443828' : '#334155'}
                        strokeWidth="3"
                      />
                    )}
                  </>
                )}

                {/* 4. Subject Text Label on Baseline */}
                <g
                  className="cursor-pointer group"
                  onClick={() => {
                    const t = findMatchingToken(node.subject);
                    if (t && onSelectToken) onSelectToken(t);
                  }}
                  onMouseEnter={() => {
                    const t = findMatchingToken(node.subject);
                    if (t) onHoverToken(t.id);
                  }}
                  onMouseLeave={() => onHoverToken(null)}
                >
                  {isSubjHighlight && (
                    <rect
                      x={startX + 10}
                      y={baseY - 26}
                      width={subjectWidth - 25}
                      height="30"
                      rx="4"
                      fill="#fef08a"
                      fillOpacity="0.35"
                    />
                  )}
                  <text
                    x={startX + 15}
                    y={baseY - 8}
                    fontSize="18"
                    fontWeight="700"
                    fill={
                      isSubjHighlight
                        ? '#eab308'
                        : canvasTheme === 'blackboard'
                        ? '#ffffff'
                        : canvasTheme === 'parchment'
                        ? '#292116'
                        : '#0f172a'
                    }
                  >
                    {node.subject}
                  </text>
                  <text
                    x={startX + 15}
                    y={baseY - 26}
                    fontSize="10"
                    fontWeight="600"
                    fill={canvasTheme === 'blackboard' ? '#a7d7bc' : '#64748b'}
                  >
                    [SUBJECT]
                  </text>
                </g>

                {/* 5. Verb Text Label on Baseline */}
                <g
                  className="cursor-pointer group"
                  onClick={() => {
                    const t = findMatchingToken(node.verb);
                    if (t && onSelectToken) onSelectToken(t);
                  }}
                  onMouseEnter={() => {
                    const t = findMatchingToken(node.verb);
                    if (t) onHoverToken(t.id);
                  }}
                  onMouseLeave={() => onHoverToken(null)}
                >
                  {isVerbHighlight && (
                    <rect
                      x={subjectEndX + 10}
                      y={baseY - 26}
                      width={verbWidth - 25}
                      height="30"
                      rx="4"
                      fill="#fef08a"
                      fillOpacity="0.35"
                    />
                  )}
                  <text
                    x={subjectEndX + 15}
                    y={baseY - 8}
                    fontSize="18"
                    fontWeight="700"
                    fill={
                      isVerbHighlight
                        ? '#eab308'
                        : canvasTheme === 'blackboard'
                        ? '#ffffff'
                        : canvasTheme === 'parchment'
                        ? '#292116'
                        : '#0f172a'
                    }
                  >
                    {node.verb}
                  </text>
                  <text
                    x={subjectEndX + 15}
                    y={baseY - 26}
                    fontSize="10"
                    fontWeight="600"
                    fill={canvasTheme === 'blackboard' ? '#a7d7bc' : '#64748b'}
                  >
                    [VERB / PREDICATE]
                  </text>
                </g>

                {/* 6. Direct Object / Complement Text Label on Baseline */}
                {node.objectOrComplement && (
                  <g
                    className="cursor-pointer group"
                    onClick={() => {
                      const t = findMatchingToken(node.objectOrComplement!);
                      if (t && onSelectToken) onSelectToken(t);
                    }}
                    onMouseEnter={() => {
                      const t = findMatchingToken(node.objectOrComplement!);
                      if (t) onHoverToken(t.id);
                    }}
                    onMouseLeave={() => onHoverToken(null)}
                  >
                    {isObjHighlight && (
                      <rect
                        x={verbEndX + 10}
                        y={baseY - 26}
                        width={objectWidth - 25}
                        height="30"
                        rx="4"
                        fill="#fef08a"
                        fillOpacity="0.35"
                      />
                    )}
                    <text
                      x={verbEndX + 15}
                      y={baseY - 8}
                      fontSize="18"
                      fontWeight="700"
                      fill={
                        isObjHighlight
                          ? '#eab308'
                          : canvasTheme === 'blackboard'
                          ? '#ffffff'
                          : canvasTheme === 'parchment'
                          ? '#292116'
                          : '#0f172a'
                      }
                    >
                      {node.objectOrComplement}
                    </text>
                    <text
                      x={verbEndX + 15}
                      y={baseY - 26}
                      fontSize="10"
                      fontWeight="600"
                      fill={canvasTheme === 'blackboard' ? '#a7d7bc' : '#64748b'}
                    >
                      {node.complementType === 'direct_object'
                        ? '[DIRECT OBJECT]'
                        : '[SUBJECT COMPLEMENT]'}
                    </text>
                  </g>
                )}

                {/* 7. Subject Modifiers (Adjectives / Determiners) Hanging Diagonally */}
                {node.subjectModifiers.map((mod, modIdx) => {
                  const modStartX = startX + 30 + modIdx * 35;
                  const modEndX = modStartX - 25;
                  const modEndY = baseY + 55;
                  const isModH = isTokenHighlighted(mod.word);

                  return (
                    <g key={modIdx} className="cursor-pointer">
                      <line
                        x1={modStartX}
                        y1={baseY}
                        x2={modEndX}
                        y2={modEndY}
                        stroke={canvasTheme === 'blackboard' ? '#a7d7bc' : '#475569'}
                        strokeWidth="2"
                      />
                      <g transform={`translate(${modStartX - 5}, ${baseY + 12}) rotate(48)`}>
                        <text
                          x="0"
                          y="0"
                          fontSize="13"
                          fontWeight={isModH ? 'bold' : 'normal'}
                          fill={
                            isModH
                              ? '#eab308'
                              : canvasTheme === 'blackboard'
                              ? '#ffffff'
                              : canvasTheme === 'parchment'
                              ? '#3b2f21'
                              : '#1e293b'
                          }
                          onMouseEnter={() => {
                            const t = findMatchingToken(mod.word);
                            if (t) onHoverToken(t.id);
                          }}
                          onMouseLeave={() => onHoverToken(null)}
                        >
                          {mod.word}
                        </text>
                      </g>
                    </g>
                  );
                })}

                {/* 8. Verb Modifiers (Adverbs) Hanging Diagonally */}
                {node.verbModifiers.map((vmod, vIdx) => {
                  const modStartX = subjectEndX + 35 + vIdx * 35;
                  const modEndX = modStartX - 25;
                  const modEndY = baseY + 55;
                  const isModH = isTokenHighlighted(vmod.word);

                  return (
                    <g key={vIdx} className="cursor-pointer">
                      <line
                        x1={modStartX}
                        y1={baseY}
                        x2={modEndX}
                        y2={modEndY}
                        stroke={canvasTheme === 'blackboard' ? '#a7d7bc' : '#475569'}
                        strokeWidth="2"
                      />
                      <g transform={`translate(${modStartX - 5}, ${baseY + 12}) rotate(48)`}>
                        <text
                          x="0"
                          y="0"
                          fontSize="13"
                          fontWeight={isModH ? 'bold' : 'normal'}
                          fill={
                            isModH
                              ? '#eab308'
                              : canvasTheme === 'blackboard'
                              ? '#ffffff'
                              : canvasTheme === 'parchment'
                              ? '#3b2f21'
                              : '#1e293b'
                          }
                          onMouseEnter={() => {
                            const t = findMatchingToken(vmod.word);
                            if (t) onHoverToken(t.id);
                          }}
                          onMouseLeave={() => onHoverToken(null)}
                        >
                          {vmod.word}
                        </text>
                      </g>
                    </g>
                  );
                })}

                {/* 9. Prepositional Phrases (Stepped Slanted + Horizontal Line) */}
                {node.prepPhrases.map((pp, pIdx) => {
                  // Attaches to verb or subject
                  const attachBaseX = pp.attachesTo === 'subject' ? startX + 65 : subjectEndX + 65 + pIdx * 45;
                  const prepCornerX = attachBaseX - 25;
                  const prepCornerY = baseY + 45;
                  const prepEndX = prepCornerX + Math.max(90, pp.object.length * 10 + 30);

                  return (
                    <g key={pIdx}>
                      {/* Slanted line for Preposition */}
                      <line
                        x1={attachBaseX}
                        y1={baseY}
                        x2={prepCornerX}
                        y2={prepCornerY}
                        stroke={canvasTheme === 'blackboard' ? '#e2f3e8' : '#2563eb'}
                        strokeWidth="2"
                      />
                      {/* Text for Preposition placed slanted on the line */}
                      <g transform={`translate(${attachBaseX - 4}, ${baseY + 14}) rotate(45)`}>
                        <text
                          x="0"
                          y="0"
                          fontSize="12"
                          fontWeight="600"
                          fill={canvasTheme === 'blackboard' ? '#a7d7bc' : '#1d4ed8'}
                        >
                          {pp.preposition}
                        </text>
                      </g>

                      {/* Horizontal line for Object of Preposition */}
                      <line
                        x1={prepCornerX}
                        y1={prepCornerY}
                        x2={prepEndX}
                        y2={prepCornerY}
                        stroke={canvasTheme === 'blackboard' ? '#e2f3e8' : '#2563eb'}
                        strokeWidth="2.5"
                      />
                      {/* Object of Preposition Text */}
                      <text
                        x={prepCornerX + 10}
                        y={prepCornerY - 6}
                        fontSize="14"
                        fontWeight="700"
                        fill={canvasTheme === 'blackboard' ? '#ffffff' : '#1e293b'}
                      >
                        {pp.object}
                      </text>

                      {/* Modifiers of Prepositional Object hanging under horizontal line */}
                      {pp.modifiers &&
                        pp.modifiers.map((pmod, pmodIdx) => {
                          const pmodStartX = prepCornerX + 25 + pmodIdx * 25;
                          const pmodEndX = pmodStartX - 18;
                          const pmodEndY = prepCornerY + 40;

                          return (
                            <g key={pmodIdx}>
                              <line
                                x1={pmodStartX}
                                y1={prepCornerY}
                                x2={pmodEndX}
                                y2={pmodEndY}
                                stroke={canvasTheme === 'blackboard' ? '#a7d7bc' : '#64748b'}
                                strokeWidth="1.5"
                              />
                              <g transform={`translate(${pmodStartX - 3}, ${prepCornerY + 10}) rotate(45)`}>
                                <text
                                  x="0"
                                  y="0"
                                  fontSize="11"
                                  fill={canvasTheme === 'blackboard' ? '#e2f3e8' : '#475569'}
                                >
                                  {pmod}
                                </text>
                              </g>
                            </g>
                          );
                        })}
                    </g>
                  );
                })}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};
