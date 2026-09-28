import { ContentOutlineSection } from '../../types';

export type AiActionScope = 'selection' | 'paragraph' | 'section' | 'document';

export interface ResolvedAITarget {
  scope: AiActionScope;
  targetText: string;
  start: number;
  end: number;
  sectionTitle?: string;
  precedingContext: string;
  followingContext: string;
  isValid: boolean;
  validationMessage?: string;
}

/**
 * Authoritative target resolution engine for Content Studio.
 * Computes exact start and end offsets within the document canvas based on the active scope.
 */
export function resolveAITarget(
  scope: AiActionScope,
  fullText: string,
  selectionStart: number,
  selectionEnd: number,
  outline?: ContentOutlineSection[]
): ResolvedAITarget {
  const text = fullText || '';

  if (scope === 'selection') {
    const start = Math.min(selectionStart, selectionEnd);
    const end = Math.max(selectionStart, selectionEnd);
    const targetText = text.slice(start, end).trim();

    if (!targetText || start === end) {
      return {
        scope: 'selection',
        targetText: '',
        start,
        end,
        precedingContext: '',
        followingContext: '',
        isValid: false,
        validationMessage: 'Select text in the document first.',
      };
    }

    return {
      scope: 'selection',
      targetText,
      start,
      end,
      precedingContext: text.slice(Math.max(0, start - 600), start),
      followingContext: text.slice(end, Math.min(text.length, end + 600)),
      isValid: true,
    };
  }

  if (scope === 'paragraph') {
    if (!text.trim()) {
      return {
        scope: 'paragraph',
        targetText: '',
        start: 0,
        end: 0,
        precedingContext: '',
        followingContext: '',
        isValid: false,
        validationMessage: 'The document is currently empty. Place cursor in a paragraph first.',
      };
    }

    const caret = Math.min(selectionStart, text.length);

    // Look backward for \n\n (or beginning of string)
    let paraStart = 0;
    const lastDoubleNewlineBefore = text.lastIndexOf('\n\n', caret - 1);
    if (lastDoubleNewlineBefore !== -1) {
      paraStart = lastDoubleNewlineBefore + 2;
    } else {
      paraStart = 0;
    }

    // Look forward for \n\n (or end of string)
    let paraEnd = text.length;
    const nextDoubleNewlineAfter = text.indexOf('\n\n', caret);
    if (nextDoubleNewlineAfter !== -1) {
      paraEnd = nextDoubleNewlineAfter;
    } else {
      paraEnd = text.length;
    }

    // If caret was on a single newline, adjust
    let targetText = text.slice(paraStart, paraEnd).trim();
    if (!targetText) {
      const lineStart = text.lastIndexOf('\n', caret - 1);
      const lineEnd = text.indexOf('\n', caret);
      const s = lineStart === -1 ? 0 : lineStart + 1;
      const e = lineEnd === -1 ? text.length : lineEnd;
      targetText = text.slice(s, e).trim();
      if (targetText) {
        paraStart = s;
        paraEnd = e;
      }
    }

    if (!targetText) {
      return {
        scope: 'paragraph',
        targetText: '',
        start: paraStart,
        end: paraEnd,
        precedingContext: '',
        followingContext: '',
        isValid: false,
        validationMessage: 'No paragraph found at cursor position. Place cursor inside a paragraph.',
      };
    }

    return {
      scope: 'paragraph',
      targetText,
      start: paraStart,
      end: paraEnd,
      precedingContext: text.slice(Math.max(0, paraStart - 600), paraStart),
      followingContext: text.slice(paraEnd, Math.min(text.length, paraEnd + 600)),
      isValid: true,
    };
  }

  if (scope === 'section') {
    if (!text.trim()) {
      return {
        scope: 'section',
        targetText: '',
        start: 0,
        end: 0,
        precedingContext: '',
        followingContext: '',
        isValid: false,
        validationMessage: 'The document is currently empty.',
      };
    }

    // Find all markdown section headers in the text: lines starting with #, ##, or ###
    const headerRegex = /^(#{1,3}\s+.+)$/gm;
    const matches: Array<{ title: string; index: number; length: number }> = [];
    let match;
    while ((match = headerRegex.exec(text)) !== null) {
      matches.push({
        title: match[1].replace(/^#{1,3}\s+/, '').trim(),
        index: match.index,
        length: match[0].length,
      });
    }

    if (matches.length === 0) {
      return {
        scope: 'section',
        targetText: '',
        start: 0,
        end: 0,
        precedingContext: '',
        followingContext: '',
        isValid: false,
        validationMessage: 'No section header (# or ##) found in this document. Add a heading to define sections.',
      };
    }

    const caret = Math.min(selectionStart, text.length);

    // Find the header immediately preceding or at caret
    let activeHeaderIndex = -1;
    for (let i = 0; i < matches.length; i++) {
      if (matches[i].index <= caret) {
        activeHeaderIndex = i;
      } else {
        break;
      }
    }

    if (activeHeaderIndex === -1) {
      activeHeaderIndex = 0;
    }

    const currentHeader = matches[activeHeaderIndex];
    const nextHeader = matches[activeHeaderIndex + 1];

    // Section body starts right after the header line
    const headerEndIndex = currentHeader.index + currentHeader.length;
    const bodyStart = text[headerEndIndex] === '\n' ? headerEndIndex + 1 : headerEndIndex;
    const bodyEnd = nextHeader ? nextHeader.index : text.length;

    const targetText = text.slice(bodyStart, bodyEnd).trim();

    return {
      scope: 'section',
      targetText: targetText || `[Empty section under "${currentHeader.title}"]`,
      start: bodyStart,
      end: bodyEnd,
      sectionTitle: currentHeader.title,
      precedingContext: text.slice(Math.max(0, currentHeader.index - 500), currentHeader.index),
      followingContext: text.slice(bodyEnd, Math.min(text.length, bodyEnd + 500)),
      isValid: true,
    };
  }

  // Document scope
  return {
    scope: 'document',
    targetText: text.trim(),
    start: 0,
    end: text.length,
    precedingContext: '',
    followingContext: '',
    isValid: true,
  };
}
