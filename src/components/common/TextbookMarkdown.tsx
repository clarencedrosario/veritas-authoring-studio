import React, { useMemo } from 'react';
import Markdown from 'react-markdown';
import { sanitizeStudentTypography } from '../../utils/pedagogicalProfileSystem';

interface TextbookMarkdownProps {
  content: string;
  className?: string;
  isDarkMode?: boolean;
}

export const TextbookMarkdown: React.FC<TextbookMarkdownProps> = ({
  content,
  className = '',
  isDarkMode = false,
}) => {
  if (!content) return null;

  // Preprocess content so raw Markdown list artefacts, bullets, and typography render cleanly
  const normalizedContent = useMemo(() => {
    if (!content) return '';

    // 1. Sanitize typography (convert programming arrows to typographic arrows, etc.)
    let text = sanitizeStudentTypography(content);

    // 2. Prevent accidental indented code blocks in Markdown (e.g. 4 spaces before lists or answer keys)
    // CommonMark treats lines starting with 4+ spaces as <pre><code>. Strip leading 4 spaces unless inside a ``` fence.
    const lines = text.split('\n');
    let insideFence = false;
    const processedLines = lines.map((line) => {
      if (/^```/.test(line.trim())) {
        insideFence = !insideFence;
        return line;
      }
      if (insideFence) return line;

      // If line starts with 4+ spaces followed by a list marker, bullet, or bold word, unindent it
      if (/^\s{2,8}(?:[0-9]+\.|\*|-|•|\*\*|Rule|\(?[a-zA-Z]\))/i.test(line)) {
        return line.trimStart();
      }

      // Convert unicode bullets at the beginning of a line to standard markdown list item
      if (/^[ \t]*[•·∙○●]\s*/.test(line)) {
        return line.replace(/^[ \t]*[•·∙○●]\s*/, '- ');
      }

      return line;
    });
    text = processedLines.join('\n');

    // 3. Ensure bold syntax with parentheses like (**word**) or (**word** / **word**) parses cleanly
    text = text
      .replace(/\(\*\*(.+?)\*\*\)/g, '(**$1**)')
      .replace(/\s*->\s*/g, ' → ')
      .replace(/\s*=>\s*/g, ' → ');

    return text;
  }, [content]);

  return (
    <div className={`textbook-markdown leading-relaxed ${className}`}>
      <Markdown
        components={{
          h1: ({ node, ...props }) => (
            <h1
              className="text-xl sm:text-2xl font-serif font-bold text-[#5A1832] dark:text-[#C29A52] border-b border-[#CBBEAC] dark:border-stone-800 pb-1 mt-4 mb-2 first:mt-0"
              {...props}
            />
          ),
          h2: ({ node, ...props }) => (
            <h2
              className="text-lg sm:text-xl font-serif font-bold text-[#35101F] dark:text-[#C29A52] mt-4 mb-2 first:mt-0"
              {...props}
            />
          ),
          h3: ({ node, ...props }) => (
            <h3
              className="text-base sm:text-lg font-serif font-bold text-[#5A1832] dark:text-amber-300 mt-3 mb-1.5 first:mt-0"
              {...props}
            />
          ),
          h4: ({ node, ...props }) => (
            <h4
              className="text-sm font-sans font-bold uppercase tracking-wider text-[#9A7438] dark:text-amber-400 mt-3 mb-1"
              {...props}
            />
          ),
          p: ({ node, ...props }) => (
            <p className="my-2 leading-relaxed" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc pl-5 my-2 space-y-1" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal pl-5 my-2 space-y-1" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="leading-relaxed" {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-bold text-[#35101F] dark:text-amber-200" {...props} />
          ),
          em: ({ node, ...props }) => (
            <em className="italic text-[#5A1832] dark:text-amber-300/90 font-serif" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-[#C29A52] bg-[#F6F0E7]/80 dark:bg-slate-900/60 pl-3 py-1.5 my-2.5 rounded-r-lg italic"
              {...props}
            />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-3 rounded-lg border border-[#CBBEAC] dark:border-stone-800">
              <table className="min-w-full divide-y divide-[#CBBEAC] dark:divide-stone-800 text-left text-xs sm:text-sm" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-[#EDE4D6] dark:bg-stone-900 font-bold text-[#35101F] dark:text-[#C29A52]" {...props} />
          ),
          tbody: ({ node, ...props }) => (
            <tbody className="divide-y divide-[#CBBEAC]/50 dark:divide-stone-800/60" {...props} />
          ),
          tr: ({ node, ...props }) => (
            <tr className="hover:bg-amber-500/5 transition-colors" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th className="p-2 font-semibold" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="p-2" {...props} />
          ),
          code: ({ node, ...props }) => (
            <code className="px-1.5 py-0.5 rounded-md font-mono text-xs bg-amber-500/10 text-[#5A1832] dark:text-amber-300 font-bold" {...props} />
          ),
        }}
      >
        {normalizedContent}
      </Markdown>
    </div>
  );
};
