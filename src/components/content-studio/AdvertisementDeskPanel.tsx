import React, { useState } from 'react';
import {
  Megaphone,
  Layout,
  Layers,
  Sparkles,
  RefreshCw,
  Check,
  CheckCircle2,
  Copy,
  Eye,
  Sliders,
  Type,
  TrendingUp,
} from 'lucide-react';
import { AdSpecification, AdVariantItem, AdFormatPreset, AdDimensionUnit } from '../../types';
import { AD_FORMAT_PRESETS } from './constants';

interface AdvertisementDeskPanelProps {
  adSpec?: AdSpecification;
  onUpdateAdSpec: (updated: AdSpecification) => void;
  onRunAiCommand: (commandKey: string, customParam?: string) => void;
  onApplyVariantToDraft: (variant: AdVariantItem) => void;
  isGenerating: boolean;
  isDarkMode: boolean;
}

export const AdvertisementDeskPanel: React.FC<AdvertisementDeskPanelProps> = ({
  adSpec,
  onUpdateAdSpec,
  onRunAiCommand,
  onApplyVariantToDraft,
  isGenerating,
  isDarkMode,
}) => {
  const [activeTab, setActiveTab] = useState<'variants' | 'hierarchy' | 'dimensions'>('variants');

  if (!adSpec) return null;

  const handleUpdate = (updates: Partial<AdSpecification>) => {
    onUpdateAdSpec({ ...adSpec, ...updates });
  };

  const handlePresetChange = (presetId: AdFormatPreset) => {
    const found = AD_FORMAT_PRESETS.find((p) => p.id === presetId);
    if (found) {
      handleUpdate({
        formatPreset: presetId,
        width: found.width,
        height: found.height,
        unit: found.unit,
      });
    }
  };

  const activeVariant =
    adSpec.variants.find((v) => v.variantKey === adSpec.activeVariantKey) ||
    adSpec.variants[0] || {
      id: 'var-a',
      variantKey: 'A',
      headline: adSpec.productOrOrg || 'Ad Headline',
      subheadline: adSpec.campaignObjective || 'Subheading',
      bodyCopy: 'Body copy describing the core value proposition.',
      keyBenefits: adSpec.keySellingPoints || [],
      callToAction: adSpec.callToAction || 'Contact us today.',
    };

  return (
    <aside className="w-80 lg:w-96 border-l border-[#CBBEAC] dark:border-[#4d1e2e] bg-[#F6F0E7] dark:bg-[#1a0812] flex flex-col shrink-0 select-none overflow-hidden">
      {/* Ad Desk Header */}
      <div className="p-3.5 border-b border-[#CBBEAC] dark:border-[#4d1e2e] bg-[#EDE4D6] dark:bg-[#200b14] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-[#5A1832] text-[#C29A52] flex items-center justify-center">
            <Megaphone className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-[#9A7438] dark:text-[#C29A52] block">
              Ad & Copywriting Desk
            </span>
            <span className="font-serif font-bold text-xs text-[#35101F] dark:text-[#F6F0E7]">
              {adSpec.formatPreset.replace('_', ' ').toUpperCase()} &bull; {adSpec.width}×{adSpec.height} {adSpec.unit}
            </span>
          </div>
        </div>

        {/* Generate variants button */}
        <button
          onClick={() => onRunAiCommand('ad_generate_variants')}
          disabled={isGenerating}
          className="px-2.5 py-1 rounded-lg bg-[#5A1832] text-[#F6F0E7] text-[11px] font-bold hover:opacity-90 flex items-center space-x-1"
        >
          <Sparkles className="w-3 h-3 text-[#C29A52]" />
          <span>A/B/C Variants</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#CBBEAC] dark:border-[#4d1e2e] bg-[#F6F0E7] dark:bg-[#200b14] p-1 gap-1">
        <button
          onClick={() => setActiveTab('variants')}
          className={`flex-1 py-1 text-center rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'variants'
              ? 'bg-[#5A1832] text-[#F6F0E7] shadow-xs'
              : 'text-[#71685E] dark:text-[#c9b9a6] hover:bg-[#EDE4D6]'
          }`}
        >
          Variants ({adSpec.variants.length})
        </button>
        <button
          onClick={() => setActiveTab('hierarchy')}
          className={`flex-1 py-1 text-center rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'hierarchy'
              ? 'bg-[#5A1832] text-[#F6F0E7] shadow-xs'
              : 'text-[#71685E] dark:text-[#c9b9a6] hover:bg-[#EDE4D6]'
          }`}
        >
          Layout Hierarchy
        </button>
        <button
          onClick={() => setActiveTab('dimensions')}
          className={`flex-1 py-1 text-center rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'dimensions'
              ? 'bg-[#5A1832] text-[#F6F0E7] shadow-xs'
              : 'text-[#71685E] dark:text-[#c9b9a6] hover:bg-[#EDE4D6]'
          }`}
        >
          Format & Specs
        </button>
      </div>

      {/* Main Tab Panels */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-4 text-xs select-text">
        {/* TAB 1: A / B / C VARIANTS COMPARISON */}
        {activeTab === 'variants' && (
          <div className="space-y-3">
            {/* Variant Switcher Pills */}
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-mono uppercase font-bold text-[#9A7438] dark:text-[#C29A52]">
                Side-by-Side Copy Variants
              </span>
              <div className="flex bg-[#EDE4D6] dark:bg-[#200b14] p-0.5 rounded-lg border border-[#CBBEAC] dark:border-[#4d1e2e]">
                {(['A', 'B', 'C'] as const).map((key) => (
                  <button
                    key={key}
                    onClick={() => handleUpdate({ activeVariantKey: key })}
                    className={`px-2.5 py-0.5 rounded text-xs font-bold transition-colors ${
                      adSpec.activeVariantKey === key
                        ? 'bg-[#5A1832] text-[#F6F0E7] shadow-xs'
                        : 'text-[#71685E] dark:text-[#c9b9a6] hover:bg-[#CBBEAC]/50'
                    }`}
                  >
                    Variant {key}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Variant Card */}
            <div className="p-3.5 rounded-2xl bg-[#EDE4D6] dark:bg-[#200b14] border-2 border-[#5A1832] dark:border-[#C29A52] space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#CBBEAC]/50 pb-1.5">
                <span className="font-mono text-xs font-bold uppercase text-[#5A1832] dark:text-[#C29A52]">
                  Active Angle: Variant {activeVariant.variantKey}
                </span>
                <button
                  onClick={() => onApplyVariantToDraft(activeVariant)}
                  className="px-2.5 py-1 rounded-lg bg-[#5A1832] text-[#F6F0E7] text-[10.5px] font-bold hover:opacity-90 flex items-center space-x-1"
                >
                  <Check className="w-3 h-3" />
                  <span>Apply to Canvas</span>
                </button>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-[#71685E] mb-0.5">
                  Headline
                </label>
                <div className="font-serif font-bold text-sm text-[#35101F] dark:text-[#F6F0E7]">
                  {activeVariant.headline}
                </div>
              </div>

              {activeVariant.subheadline && (
                <div>
                  <label className="block text-[10px] font-mono uppercase text-[#71685E] mb-0.5">
                    Subheadline
                  </label>
                  <div className="font-serif text-xs text-[#71685E] dark:text-[#c9b9a6] italic">
                    {activeVariant.subheadline}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-mono uppercase text-[#71685E] mb-0.5">
                  Body Copy
                </label>
                <div className="font-serif text-xs leading-relaxed text-[#292521] dark:text-[#F6F0E7] whitespace-pre-wrap">
                  {activeVariant.bodyCopy}
                </div>
              </div>

              {activeVariant.keyBenefits && activeVariant.keyBenefits.length > 0 && (
                <div>
                  <label className="block text-[10px] font-mono uppercase text-[#71685E] mb-0.5">
                    Key Proof Points
                  </label>
                  <ul className="space-y-0.5">
                    {activeVariant.keyBenefits.map((b, i) => (
                      <li key={i} className="flex items-center space-x-1.5 text-xs text-[#35101F] dark:text-[#F6F0E7]">
                        <span className="text-[#9A7438]">&bull;</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-mono uppercase text-[#71685E] mb-0.5">
                  Call to Action (CTA)
                </label>
                <div className="p-2 rounded-xl bg-[#F6F0E7] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] font-serif font-bold text-xs text-[#5A1832] dark:text-[#C29A52]">
                  {activeVariant.callToAction}
                </div>
              </div>
            </div>

            {/* All 3 variants quick comparison thumbnails */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] font-mono uppercase font-bold text-[#71685E]">
                All Generated Variants (Click to Inspect):
              </span>
              <div className="grid grid-cols-3 gap-2">
                {adSpec.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => handleUpdate({ activeVariantKey: v.variantKey })}
                    className={`p-2 rounded-xl text-left border transition-all ${
                      adSpec.activeVariantKey === v.variantKey
                        ? 'border-[#5A1832] dark:border-[#C29A52] bg-[#EDE4D6] shadow-xs'
                        : 'border-[#CBBEAC] dark:border-[#4d1e2e] bg-[#F6F0E7] hover:bg-[#EDE4D6]/50'
                    }`}
                  >
                    <div className="font-mono font-bold text-[11px] text-[#9A7438]">
                      Variant {v.variantKey}
                    </div>
                    <div className="font-serif text-[11px] font-bold truncate text-[#35101F] dark:text-[#F6F0E7]">
                      {v.headline}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VISUAL CONTENT HIERARCHY PREVIEW */}
        {activeTab === 'hierarchy' && (
          <div className="space-y-3">
            <span className="text-[10.5px] font-mono uppercase font-bold text-[#9A7438] dark:text-[#C29A52]">
              Advertisement Layout Hierarchy Preview
            </span>
            <p className="text-[11px] text-[#71685E]">
              Structural blueprint showing visual weight and copy distribution:
            </p>

            {/* Wireframe Box */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#15060e] border-2 border-dashed border-[#CBBEAC] dark:border-[#4d1e2e] space-y-2.5 font-sans">
              {/* LOGO AREA */}
              <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-800 text-center font-mono text-[10px] uppercase font-bold text-gray-500">
                [ LOGO AREA: {adSpec.productOrOrg || 'BRAND LOGO'} ]
              </div>

              {/* HEADLINE */}
              <div className="p-2 rounded-lg bg-[#5A1832]/10 border border-[#5A1832]/30 text-center">
                <span className="block font-mono text-[9px] uppercase font-bold text-[#5A1832] dark:text-[#C29A52]">
                  HEADLINE (Dominant Weight)
                </span>
                <span className="font-serif font-bold text-sm text-[#35101F] dark:text-[#F6F0E7]">
                  {activeVariant.headline}
                </span>
              </div>

              {/* SUBHEADLINE */}
              <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-center font-serif italic text-xs text-gray-600 dark:text-gray-300">
                [ SUBHEADLINE: {activeVariant.subheadline || 'Supporting deck proposition'} ]
              </div>

              {/* IMAGE PLACEHOLDER */}
              <div className="p-6 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 text-center space-y-1">
                <span className="block font-mono text-[10px] uppercase font-bold text-amber-800 dark:text-amber-400">
                  [ HERO IMAGE PLACEHOLDER ]
                </span>
                <span className="text-[10px] text-amber-700 dark:text-amber-500">
                  Photography: Academic campus grounds / Product in use
                </span>
              </div>

              {/* BODY COPY */}
              <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 font-serif text-xs leading-relaxed text-gray-700 dark:text-gray-200">
                <span className="block font-mono text-[9px] uppercase font-bold text-gray-400 mb-1">
                  BODY COPY
                </span>
                {activeVariant.bodyCopy}
              </div>

              {/* KEY BENEFITS */}
              <div className="p-2 rounded-lg bg-[#EDE4D6] dark:bg-[#200b14] border border-[#CBBEAC] dark:border-[#4d1e2e]">
                <span className="block font-mono text-[9px] uppercase font-bold text-[#9A7438] mb-1">
                  KEY BENEFITS (Bullet Pillars)
                </span>
                <ul className="space-y-0.5 text-xs text-[#35101F] dark:text-[#F6F0E7]">
                  {(activeVariant.keyBenefits || []).map((b, i) => (
                    <li key={i}>&bull; {b}</li>
                  ))}
                </ul>
              </div>

              {/* CALL TO ACTION */}
              <div className="p-2.5 rounded-xl bg-[#5A1832] text-[#F6F0E7] text-center font-serif font-bold text-xs shadow-xs">
                CALL TO ACTION: {activeVariant.callToAction}
              </div>

              {/* CONTACT DETAILS */}
              <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-900 text-center font-mono text-[10px] text-gray-600 dark:text-gray-400">
                CONTACT: {adSpec.contactDetails || 'Inquiries & Admissions Office'}
              </div>

              {/* FOOTER / LEGAL TEXT */}
              <div className="p-1 rounded bg-gray-50 dark:bg-gray-950 text-center font-mono text-[9px] text-gray-400 dark:text-gray-500">
                LEGAL / MANDATORY: {adSpec.mandatoryText || 'Registered charity information and terms.'}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DIMENSIONS & SPECS */}
        {activeTab === 'dimensions' && (
          <div className="space-y-3">
            <div>
              <label className="block text-[10.5px] font-mono font-bold uppercase text-[#9A7438] dark:text-[#C29A52] mb-1">
                Publication Dimension Preset
              </label>
              <select
                value={adSpec.formatPreset}
                onChange={(e) => handlePresetChange(e.target.value as AdFormatPreset)}
                className="w-full p-2 rounded-xl bg-[#EDE4D6] dark:bg-[#200b14] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs font-semibold cursor-pointer"
              >
                {AD_FORMAT_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label} ({p.width} × {p.height} {p.unit})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-[#71685E] mb-0.5">
                  Width
                </label>
                <input
                  type="number"
                  value={adSpec.width}
                  onChange={(e) => handleUpdate({ width: Number(e.target.value) || 0 })}
                  className="w-full p-2 rounded-lg bg-[#EDE4D6] dark:bg-[#200b14] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-[#71685E] mb-0.5">
                  Height
                </label>
                <input
                  type="number"
                  value={adSpec.height}
                  onChange={(e) => handleUpdate({ height: Number(e.target.value) || 0 })}
                  className="w-full p-2 rounded-lg bg-[#EDE4D6] dark:bg-[#200b14] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-[#71685E] mb-0.5">
                  Unit
                </label>
                <select
                  value={adSpec.unit}
                  onChange={(e) => handleUpdate({ unit: e.target.value as AdDimensionUnit })}
                  className="w-full p-2 rounded-lg bg-[#EDE4D6] dark:bg-[#200b14] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs font-mono cursor-pointer"
                >
                  <option value="mm">mm</option>
                  <option value="cm">cm</option>
                  <option value="inches">inches</option>
                  <option value="pixels">pixels</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10.5px] font-mono font-bold uppercase text-[#71685E] mb-1">
                Target Publication / Placement
              </label>
              <input
                type="text"
                value={adSpec.publication}
                onChange={(e) => handleUpdate({ publication: e.target.value })}
                className="w-full p-2 rounded-lg bg-[#EDE4D6] dark:bg-[#200b14] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs"
              />
            </div>

            <div>
              <label className="block text-[10.5px] font-mono font-bold uppercase text-[#71685E] mb-1">
                Offer / Incentive Text
              </label>
              <input
                type="text"
                value={adSpec.offer}
                onChange={(e) => handleUpdate({ offer: e.target.value })}
                className="w-full p-2 rounded-lg bg-[#EDE4D6] dark:bg-[#200b14] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs"
              />
            </div>
          </div>
        )}
      </div>

      {/* Advertising AI Actions Bar */}
      <div className="p-3 border-t border-[#CBBEAC] dark:border-[#4d1e2e] bg-[#EDE4D6] dark:bg-[#200b14] space-y-1.5 shrink-0">
        <span className="text-[10px] font-mono uppercase font-bold text-[#9A7438] dark:text-[#C29A52] block px-1">
          Copywriting AI Actions
        </span>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => onRunAiCommand('ad_headlines')}
            disabled={isGenerating}
            className="p-1.5 rounded-lg bg-[#F6F0E7] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-[11px] font-medium hover:bg-[#5A1832] hover:text-[#F6F0E7] text-left transition-colors truncate"
          >
            10 Headlines
          </button>
          <button
            onClick={() => onRunAiCommand('ad_taglines')}
            disabled={isGenerating}
            className="p-1.5 rounded-lg bg-[#F6F0E7] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-[11px] font-medium hover:bg-[#5A1832] hover:text-[#F6F0E7] text-left transition-colors truncate"
          >
            Generate Taglines
          </button>
          <button
            onClick={() => onRunAiCommand('ad_persuasive')}
            disabled={isGenerating}
            className="p-1.5 rounded-lg bg-[#F6F0E7] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-[11px] font-medium hover:bg-[#5A1832] hover:text-[#F6F0E7] text-left transition-colors truncate"
          >
            More Persuasive
          </button>
          <button
            onClick={() => onRunAiCommand('ad_premium')}
            disabled={isGenerating}
            className="p-1.5 rounded-lg bg-[#F6F0E7] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-[11px] font-medium hover:bg-[#5A1832] hover:text-[#F6F0E7] text-left transition-colors truncate"
          >
            More Premium
          </button>
          <button
            onClick={() => onRunAiCommand('ad_emotional')}
            disabled={isGenerating}
            className="p-1.5 rounded-lg bg-[#F6F0E7] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-[11px] font-medium hover:bg-[#5A1832] hover:text-[#F6F0E7] text-left transition-colors truncate"
          >
            More Emotional
          </button>
          <button
            onClick={() => onRunAiCommand('ad_cta')}
            disabled={isGenerating}
            className="p-1.5 rounded-lg bg-[#F6F0E7] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-[11px] font-medium hover:bg-[#5A1832] hover:text-[#F6F0E7] text-left transition-colors truncate"
          >
            Generate CTAs
          </button>
        </div>
      </div>
    </aside>
  );
};
