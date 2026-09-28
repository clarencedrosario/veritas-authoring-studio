import React, { useState } from 'react';
import {
  X,
  Download,
  Copy,
  Check,
  Printer,
  FileText,
  Code,
  Share2,
  Newspaper,
  Megaphone,
} from 'lucide-react';
import { ContentDocument } from '../../types';

interface ContentExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: ContentDocument;
  isDarkMode: boolean;
}

export const ContentExportModal: React.FC<ContentExportModalProps> = ({
  isOpen,
  onClose,
  document,
  isDarkMode,
}) => {
  const [format, setFormat] = useState<'markdown' | 'html' | 'plaintext' | 'wire' | 'ad_spec'>('markdown');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateExportText = () => {
    switch (format) {
      case 'markdown':
        return `# ${document.title}
*${document.subtitle}*

**Content Type:** ${document.contentType}
**Category:** ${document.category}
**Word Count:** ${document.wordCount} words
**Target Audience:** ${document.targetAudience}

---

${document.bodyContent}

---
${document.callToAction ? `\n**Call to Action:** ${document.callToAction}\n` : ''}`;

      case 'plaintext':
        return `${document.title.toUpperCase()}
${document.subtitle}

${document.bodyContent}

${document.callToAction ? `CALL TO ACTION: ${document.callToAction}` : ''}`;

      case 'html':
        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${document.title}</title>
  <style>
    body { font-family: Georgia, serif; line-height: 1.7; max-width: 720px; margin: 40px auto; color: #111; }
    h1 { font-size: 2rem; margin-bottom: 0.25rem; }
    .subtitle { font-style: italic; color: #555; margin-bottom: 2rem; font-size: 1.1rem; }
    .cta { border-top: 1px solid #ccc; padding-top: 1rem; margin-top: 2rem; font-weight: bold; }
  </style>
</head>
<body>
  <h1>${document.title}</h1>
  <p class="subtitle">${document.subtitle}</p>
  <div class="content">
    ${document.bodyContent.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>')}
  </div>
  ${document.callToAction ? `<div class="cta">${document.callToAction}</div>` : ''}
</body>
</html>`;

      case 'wire':
        const nr = document.newsroom;
        return `[VERITAS WIRE SERVICE — PRESS TRANSMISSION]
SLUG: ${nr?.slug || 'METRO-NEWS-REPORT'}
SECTION: ${nr?.section || 'General'}
DESK: ${nr?.desk || 'Metro'}
DATELINE: ${nr?.dateline || 'LONDON —'}
BYLINE: ${nr?.byline || 'By Staff Reporter'}
WORD TARGET: ${nr?.wordTarget || document.wordCount} | ACTUAL: ${document.wordCount} words
DEADLINE: ${nr?.deadline || 'IMMEDIATE'}
STATUS: ${nr?.status || 'VERIFIED'}

------------------------------------------------------------
5W1H BRIEF:
WHO: ${nr?.who || 'Official Authorities'}
WHAT: ${nr?.what || document.title}
WHEN: ${nr?.when || 'Recent'}
WHERE: ${nr?.where || 'Local'}
WHY: ${nr?.why || 'Public Interest'}
------------------------------------------------------------

${document.title.toUpperCase()}
${nr?.standfirst ? `[STANDFIRST: ${nr.standfirst}]\n\n` : ''}${document.bodyContent}

[END WIRE DISPATCH]`;

      case 'ad_spec':
        const ad = document.adSpec;
        return `[VERITAS ADVERTISING PRODUCTION SPECIFICATION]
CLIENT / PRODUCT: ${ad?.productOrOrg || document.title}
OBJECTIVE: ${ad?.campaignObjective || 'Customer Inquiry & Enrolment'}
DIMENSIONS: ${ad?.width} × ${ad?.height} ${ad?.unit} (${ad?.formatPreset.toUpperCase()})
PUBLICATION: ${ad?.publication || 'Broadsheet Daily'}
TARGET AUDIENCE: ${ad?.targetAudience || document.targetAudience}

PRIMARY HEADLINE:
${document.title}

BODY COPY:
${document.bodyContent}

KEY BENEFITS:
${ad?.keySellingPoints?.map((p) => `• ${p}`).join('\n') || ''}

CALL TO ACTION:
${ad?.callToAction || document.callToAction}

CONTACT DETAILS:
${ad?.contactDetails || ''}

LEGAL MANDATORY:
${ad?.mandatoryText || ''}`;
    }
  };

  const exportText = generateExportText();

  const handleCopy = () => {
    navigator.clipboard.writeText(exportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const extensions: Record<string, string> = {
      markdown: 'md',
      plaintext: 'txt',
      html: 'html',
      wire: 'txt',
      ad_spec: 'txt',
    };
    const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `${document.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.${extensions[format] || 'txt'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs select-none">
      <div className="w-full max-w-3xl max-h-[90vh] bg-[#F6F0E7] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-[#292521] dark:text-[#F6F0E7]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#CBBEAC] dark:border-[#4d1e2e] bg-[#EDE4D6] dark:bg-[#200b14] flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#5A1832] text-[#C29A52] flex items-center justify-center font-serif font-bold text-base shadow-xs">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10.5px] font-mono uppercase font-bold text-[#9A7438] dark:text-[#C29A52]">
                Publish & Export Centre
              </span>
              <h2 className="text-base sm:text-lg font-serif font-bold text-[#35101F] dark:text-[#F6F0E7]">
                Export "{document.title}"
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#71685E] hover:text-[#35101F] dark:hover:text-[#F6F0E7] hover:bg-[#CBBEAC]/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selector Pills */}
        <div className="p-3 bg-[#EDE4D6]/70 dark:bg-[#200b14]/70 border-b border-[#CBBEAC] dark:border-[#4d1e2e] flex flex-wrap items-center gap-1.5 shrink-0 text-xs">
          {[
            { id: 'markdown', label: 'Markdown (.md)' },
            { id: 'html', label: 'Clean HTML (.html)' },
            { id: 'plaintext', label: 'Plain Text (.txt)' },
            { id: 'wire', label: 'Wire Teletype Dispatch' },
            { id: 'ad_spec', label: 'Ad Production Spec Sheet' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFormat(f.id as any)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
                format === f.id
                  ? 'bg-[#5A1832] text-[#F6F0E7] dark:bg-[#C29A52] dark:text-[#35101F] shadow-xs'
                  : 'bg-[#F6F0E7] dark:bg-[#1a0812] text-[#71685E] dark:text-[#c9b9a6] hover:bg-[#CBBEAC]/40'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Text Preview Box */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          <div className="w-full h-full p-4 rounded-xl bg-[#EDE4D6] dark:bg-[#200b14] border border-[#CBBEAC] dark:border-[#4d1e2e] font-mono text-xs leading-relaxed text-[#292521] dark:text-[#F6F0E7] whitespace-pre-wrap select-text max-h-[50vh] overflow-y-auto">
            {exportText}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#CBBEAC] dark:border-[#4d1e2e] bg-[#EDE4D6] dark:bg-[#200b14] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs font-semibold hover:bg-[#F6F0E7] flex items-center space-x-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print View</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl border border-[#5A1832] dark:border-[#C29A52] text-[#5A1832] dark:text-[#C29A52] text-xs font-bold hover:bg-[#5A1832]/10 transition-colors flex items-center space-x-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy to Clipboard'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-5 py-2 rounded-xl bg-[#5A1832] text-[#F6F0E7] dark:bg-[#C29A52] dark:text-[#35101F] text-xs font-bold hover:opacity-90 flex items-center space-x-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
