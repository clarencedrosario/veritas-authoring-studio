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
    const targetText = text.slice(start, end);

    if (!targetText.trim() || start === end) {
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
    const separators = [...text.matchAll(/\n[ \t]*\n+/g)];
    let paraStart = 0;
    let paraEnd = text.length;
    let previousSeparatorEnd = 0;
    let foundParagraph = false;
    let insideSeparator = false;

    for (const separator of separators) {
      const separatorStart = separator.index ?? 0;
      const separatorEnd = separatorStart + separator[0].length;
      if (caret <= separatorStart) {
        paraStart = previousSeparatorEnd;
        paraEnd = separatorStart;
        foundParagraph = true;
        break;
      }
      if (caret < separatorEnd) {
        insideSeparator = true;
        break;
      }
      previousSeparatorEnd = separatorEnd;
    }

    if (!foundParagraph && !insideSeparator && previousSeparatorEnd <= caret) {
      const nextSeparator = separators.find((separator) => (separator.index ?? 0) >= caret);
      if (!nextSeparator || caret >= (nextSeparator.index ?? 0) + nextSeparator[0].length) {
        paraStart = previousSeparatorEnd;
        paraEnd = nextSeparator?.index ?? text.length;
        foundParagraph = true;
      }
    }

    const targetText = foundParagraph ? text.slice(paraStart, paraEnd) : '';
    if (!targetText.trim()) {
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

    const headerRegex = /^(#{1,6})\s+(.+)$/gm;
    const matches: Array<{ title: string; level: number; index: number; length: number }> = [];
    let match;
    while ((match = headerRegex.exec(text)) !== null) {
      matches.push({
        title: match[2].trim(),
        level: match[1].length,
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
        validationMessage: 'No section heading found in this document. Add a heading to define sections.',
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
      return {
        scope: 'section',
        targetText: '',
        start: 0,
        end: 0,
        precedingContext: '',
        followingContext: '',
        isValid: false,
        validationMessage: 'Place the cursor inside a headed section before using section scope.',
      };
    }

    const currentHeader = matches[activeHeaderIndex];
    const nextHeader = matches.slice(activeHeaderIndex + 1).find((heading) => heading.level <= currentHeader.level);

    // Section body starts right after the header line
    const headerEndIndex = currentHeader.index + currentHeader.length;
    const bodyStart = text[headerEndIndex] === '\n' ? headerEndIndex + 1 : headerEndIndex;
    const bodyEnd = nextHeader ? nextHeader.index : text.length;

    const targetText = text.slice(bodyStart, bodyEnd);

    if (!targetText.trim()) {
      return {
        scope: 'section',
        targetText: '',
        start: bodyStart,
        end: bodyEnd,
        sectionTitle: currentHeader.title,
        precedingContext: text.slice(Math.max(0, currentHeader.index - 500), currentHeader.index),
        followingContext: text.slice(bodyEnd, Math.min(text.length, bodyEnd + 500)),
        isValid: false,
        validationMessage: `The section "${currentHeader.title}" is empty. Add text before using this scope.`,
      };
    }

    return {
      scope: 'section',
      targetText,
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
    targetText: text,
    start: 0,
    end: text.length,
    precedingContext: '',
    followingContext: '',
    isValid: true,
  };
}
