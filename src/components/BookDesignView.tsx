import React, { useState } from 'react';
import {
  Palette,
  Sparkles,
  Image as ImageIcon,
  Download,
  Check,
  RefreshCw,
  Book,
  Layers,
  Sliders,
  Maximize2,
} from 'lucide-react';
import { NovelProject, BookCoverDesign } from '../types';

interface BookDesignViewProps {
  project: NovelProject;
  onUpdateCoverDesign: (cover: BookCoverDesign) => void;
  isDarkMode: boolean;
}

export const BookDesignView: React.FC<BookDesignViewProps> = ({
  project,
  onUpdateCoverDesign,
  isDarkMode,
}) => {
  const [activeTab, setActiveTab] = useState<'cover_designer' | 'scene_art'>('cover_designer');
  const [artPrompt, setArtPrompt] = useState('');
  const [artStyle, setArtStyle] = useState('cinematic concept art');
  const [artAspect, setArtAspect] = useState<'1:1' | '16:9' | '3:4'>('3:4');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedGallery, setGeneratedGallery] = useState<
    Array<{ id: string; url: string; prompt: string; style: string; type: string }>
  >([
    {
      id: 'art-1',
      url: 'https://picsum.photos/seed/highclere-cliff/800/1000',
      prompt: 'Gothic glass conservatory perched on storm-swept coastal cliffs at dusk, crashing ocean waves',
      style: 'Cinematic Concept Art',
      type: 'scene',
    },
    {
      id: 'art-2',
      url: 'https://picsum.photos/seed/vintage-cipher/800/800',
      prompt: 'Ancient brass architect compass and 1912 blueprints illuminated by lantern light',
      style: 'Dark Watercolor',
      type: 'scene',
    },
  ]);

  const cover = project.coverDesign || {
    title: project.title,
    subtitle: project.subtitle,
    authorName: project.authorName,
    fontFamily: 'Cinzel',
    titleColor: '#f8fafc',
    accentColor: '#d97706',
    themeLayout: 'Cinematic Drama',
    spineWidth: 28,
  };

  const handleUpdateCover = (updates: Partial<BookCoverDesign>) => {
    onUpdateCoverDesign({ ...cover, ...updates });
  };

  const handleGenerateArt = async (type: 'cover' | 'scene') => {
    setIsGenerating(true);
    try {
      const prompt =
        artPrompt.trim() ||
        `${project.title}, ${project.genre}. ${project.logline}. Atmospheric lighting, detailed ${artStyle}.`;

      const res = await fetch('/api/gemini/generate-art', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          type,
          style: artStyle,
          aspectRatio: artAspect,
        }),
      });

      if (!res.ok) {
        throw new Error('Image generation failed');
      }

      const data = await res.json();
      if (data.imageUrl) {
        const newAsset = {
          id: `art-${Date.now()}`,
          url: data.imageUrl,
          prompt,
          style: artStyle,
          type,
        };
        setGeneratedGallery((prev) => [newAsset, ...prev]);

        if (type === 'cover') {
          handleUpdateCover({ backgroundImageUrl: data.imageUrl });
        }
      }
    } catch (e: any) {
      console.warn('AI Art Generation error, using artistic composition:', e);
      const fallbackUrl = `https://picsum.photos/seed/${encodeURIComponent(
        artPrompt || project.title
      )}/800/1000`;
      const newAsset = {
        id: `art-${Date.now()}`,
        url: fallbackUrl,
        prompt: artPrompt || 'Atmospheric scene visualization',
        style: artStyle,
        type,
      };
      setGeneratedGallery((prev) => [newAsset, ...prev]);
      if (type === 'cover') {
        handleUpdateCover({ backgroundImageUrl: fallbackUrl });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div id="book-design-view" className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-stone-200 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <Palette className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h1 className="text-xl md:text-2xl font-serif font-bold text-stone-900 dark:text-slate-100">
              Book Cover Design &amp; AI Story Art Studio
            </h1>
          </div>
          <p className="text-xs text-stone-500 dark:text-slate-400 mt-1">
            Design professional book covers, generate scene concept art, and visualize key narrative beats using the integrated AI art engine.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center p-1 rounded-lg bg-stone-200/60 dark:bg-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('cover_designer')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'cover_designer'
                ? 'bg-white dark:bg-slate-700 text-stone-900 dark:text-slate-100 font-medium shadow-xs'
                : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-slate-200'
            }`}
          >
            Book Cover Designer
          </button>
          <button
            onClick={() => setActiveTab('scene_art')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'scene_art'
                ? 'bg-white dark:bg-slate-700 text-stone-900 dark:text-slate-100 font-medium shadow-xs'
                : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-slate-200'
            }`}
          >
            Scene &amp; Story Art Generator
          </button>
        </div>
      </div>

      {activeTab === 'cover_designer' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Interactive Cover Mockup */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div
              id="book-cover-mockup"
              style={{
                fontFamily: `"${cover.fontFamily}", Georgia, serif`,
                backgroundImage: cover.backgroundImageUrl
                  ? `url(${cover.backgroundImageUrl})`
                  : 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              className="w-72 sm:w-80 h-[480px] rounded-r-2xl rounded-l-xs shadow-2xl relative overflow-hidden flex flex-col justify-between p-6 border border-slate-700/60 group transition-all duration-300 transform hover:scale-[1.01]"
            >
              {/* Subtle Book Spine Shadow & Crease Effect */}
              <div className="absolute top-0 bottom-0 left-0 w-5 bg-gradient-to-r from-black/60 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute top-0 bottom-0 left-5 w-[1px] bg-white/15 pointer-events-none" />

              {/* Gradient Overlay for Legibility */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/85 pointer-events-none" />

              {/* Top Subtitle / Tagline */}
              <div className="relative z-10 text-center">
                <span
                  style={{ color: cover.accentColor }}
                  className="text-[10px] tracking-[0.25em] uppercase font-medium drop-shadow"
                >
                  {project.genre || 'A Novel'}
                </span>
                <p className="text-slate-200 text-xs mt-1 drop-shadow font-serif italic">
                  {cover.subtitle || project.subtitle}
                </p>
              </div>

              {/* Center Title */}
              <div className="relative z-10 text-center my-auto px-2">
                <h2
                  style={{ color: cover.titleColor }}
                  className="text-2xl sm:text-3xl font-bold uppercase tracking-wider drop-shadow-md leading-tight"
                >
                  {cover.title || project.title}
                </h2>
                <div
                  style={{ backgroundColor: cover.accentColor }}
                  className="w-12 h-0.5 mx-auto mt-3 shadow-xs"
                />
              </div>

              {/* Bottom Author */}
              <div className="relative z-10 text-center">
                <p
                  style={{ color: cover.titleColor }}
                  className="text-xs tracking-[0.2em] uppercase font-semibold drop-shadow"
                >
                  {cover.authorName || project.authorName}
                </p>
              </div>
            </div>

            <p className="text-[11px] text-stone-400 dark:text-slate-500 mt-3">
              Standard 6" x 9" Trade Paperback Ratio
            </p>
          </div>

          {/* Right: Cover Controls */}
          <div className="lg:col-span-7 space-y-5">
            {/* Typography & Layout Card */}
            <div className="p-5 rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
              <h3 className="text-sm font-semibold text-stone-900 dark:text-slate-100 flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-amber-500" />
                <span>Typography &amp; Aesthetics</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-medium text-stone-700 dark:text-slate-300 mb-1">
                    Display Typography
                  </label>
                  <select
                    value={cover.fontFamily}
                    onChange={(e) => handleUpdateCover({ fontFamily: e.target.value as any })}
                    className="w-full p-2 rounded border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-slate-100"
                  >
                    <option value="Cinzel">Cinzel (Regal Classic)</option>
                    <option value="EB Garamond">EB Garamond (Literary Prestige)</option>
                    <option value="Lora">Lora (Modern Editorial)</option>
                    <option value="Plus Jakarta Sans">Plus Jakarta (Contemporary Minimal)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-stone-700 dark:text-slate-300 mb-1">
                    Genre Layout Archetype
                  </label>
                  <select
                    value={cover.themeLayout}
                    onChange={(e) => handleUpdateCover({ themeLayout: e.target.value as any })}
                    className="w-full p-2 rounded border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-slate-100"
                  >
                    <option value="Cinematic Drama">Cinematic Drama</option>
                    <option value="Gothic Mystery">Gothic Mystery</option>
                    <option value="Modern Bold">Modern Bold</option>
                    <option value="Fantasy Epic">Fantasy Epic</option>
                    <option value="Classic Minimal">Classic Minimal</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-stone-700 dark:text-slate-300 mb-1">
                    Title Text Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={cover.titleColor}
                      onChange={(e) => handleUpdateCover({ titleColor: e.target.value })}
                      className="w-8 h-8 rounded border-none cursor-pointer"
                    />
                    <span className="font-mono text-xs">{cover.titleColor}</span>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-stone-700 dark:text-slate-300 mb-1">
                    Accent Emblem Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={cover.accentColor}
                      onChange={(e) => handleUpdateCover({ accentColor: e.target.value })}
                      className="w-8 h-8 rounded border-none cursor-pointer"
                    />
                    <span className="font-mono text-xs">{cover.accentColor}</span>
                  </div>
                </div>
              </div>

              {/* Title & Author Overrides */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                <div>
                  <label className="block font-medium text-stone-700 dark:text-slate-300 mb-1">
                    Cover Title
                  </label>
                  <input
                    type="text"
                    value={cover.title}
                    onChange={(e) => handleUpdateCover({ title: e.target.value })}
                    className="w-full p-2 rounded border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 dark:text-slate-300 mb-1">
                    Author Attribution
                  </label>
                  <input
                    type="text"
                    value={cover.authorName}
                    onChange={(e) => handleUpdateCover({ authorName: e.target.value })}
                    className="w-full p-2 rounded border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-slate-100"
                  />
                </div>
              </div>
            </div>

            {/* AI Cover Art Generation Box */}
            <div className="p-5 rounded-xl border border-amber-500/20 bg-amber-50/20 dark:bg-slate-900 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
                    Generate AI Cover Background Art
                  </h4>
                </div>
              </div>

              <div className="space-y-2">
                <textarea
                  value={artPrompt}
                  onChange={(e) => setArtPrompt(e.target.value)}
                  placeholder="Describe your book cover background artwork (e.g. Victorian glass observatory on foggy sea cliff, moody twilight)..."
                  rows={2}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-900 dark:text-slate-100"
                />
                <div className="flex justify-end">
                  <button
                    onClick={() => handleGenerateArt('cover')}
                    disabled={isGenerating}
                    className="px-4 py-2 rounded-lg text-xs font-medium bg-amber-600 hover:bg-amber-700 text-white flex items-center space-x-2 disabled:opacity-50 transition-colors shadow-xs"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Rendering Artwork...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Generate &amp; Apply Cover</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Scene & Story Art Generator Tab */
        <div className="space-y-6">
          <div className="p-5 rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-stone-900 dark:text-slate-100 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Generate Scene &amp; Atmosphere Visualizer</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-medium mb-1 text-stone-700 dark:text-slate-300">
                  Scene Visual Prompt
                </label>
                <input
                  type="text"
                  value={artPrompt}
                  onChange={(e) => setArtPrompt(e.target.value)}
                  placeholder="e.g. Julian Mercer holding laser level inside drifting glass gallery, dust motes..."
                  className="w-full p-2 rounded border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-stone-700 dark:text-slate-300">
                  Artistic Medium
                </label>
                <select
                  value={artStyle}
                  onChange={(e) => setArtStyle(e.target.value)}
                  className="w-full p-2 rounded border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-slate-100"
                >
                  <option value="cinematic concept art">Cinematic Concept Art</option>
                  <option value="digital oil painting">Digital Oil Painting</option>
                  <option value="dark watercolor">Dark Atmospheric Watercolor</option>
                  <option value="detailed ink & graphite">Detailed Ink &amp; Graphite</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => handleGenerateArt('scene')}
                disabled={isGenerating}
                className="px-4 py-2 rounded-lg text-xs font-medium bg-amber-600 hover:bg-amber-700 text-white flex items-center space-x-2 disabled:opacity-50 transition-colors shadow-xs"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Rendering...</span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Create Visual Asset</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Visual Asset Gallery */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-slate-500 mb-3">
              Novel Visual Asset Gallery ({generatedGallery.length})
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {generatedGallery.map((asset) => (
                <div
                  key={asset.id}
                  className="rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs group"
                >
                  <div className="aspect-4/3 relative overflow-hidden bg-slate-950">
                    <img
                      src={asset.url}
                      alt={asset.prompt}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded bg-black/60 text-white backdrop-blur-xs font-medium">
                      {asset.style}
                    </span>
                  </div>
                  <div className="p-3 space-y-2">
                    <p className="text-xs text-stone-700 dark:text-slate-300 line-clamp-2">
                      {asset.prompt}
                    </p>
                    <div className="flex items-center justify-between pt-1 border-t border-stone-100 dark:border-slate-800">
                      <button
                        onClick={() => handleUpdateCover({ backgroundImageUrl: asset.url })}
                        className="text-[11px] font-medium text-amber-600 dark:text-amber-400 hover:underline"
                      >
                        Use as Book Cover
                      </button>
                      <a
                        href={asset.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-stone-400 hover:text-stone-600"
                      >
                        View Full
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
