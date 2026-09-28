import { GrammarTopic } from '../../../types';

/**
 * Reorders a list of chapters from an old index to a new index,
 * re-indexing the order and chapterNumber properties to 1..N.
 */
export function reorderChaptersList(
  topics: GrammarTopic[],
  fromIndex: number,
  toIndex: number
): GrammarTopic[] {
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= topics.length ||
    toIndex >= topics.length
  ) {
    return topics;
  }

  const updated = [...topics];
  const [moved] = updated.splice(fromIndex, 1);
  updated.splice(toIndex, 0, moved);

  return updated.map((t, idx) => ({
    ...t,
    order: idx + 1,
    chapterNumber: idx + 1,
    studioChapter: t.studioChapter
      ? {
          ...t.studioChapter,
          order: idx + 1,
          chapterNumber: idx + 1,
        }
      : undefined,
  }));
}

/**
 * Inserts a chapter (by its ID) before or after a target chapter (by its ID),
 * re-indexing the order and chapterNumber properties to 1..N.
 */
export function insertChapterAt(
  topics: GrammarTopic[],
  fromId: string,
  targetId: string,
  position: 'before' | 'after'
): GrammarTopic[] {
  const fromIndex = topics.findIndex((t) => t.id === fromId);
  const targetIndex = topics.findIndex((t) => t.id === targetId);

  if (fromIndex === -1 || targetIndex === -1 || fromIndex === targetIndex) {
    return topics;
  }

  const result = [...topics];
  const [moved] = result.splice(fromIndex, 1);

  // Find target index in the array after removal of the dragged element
  const newTargetIndex = result.findIndex((t) => t.id === targetId);
  const insertIndex = position === 'before' ? newTargetIndex : newTargetIndex + 1;

  result.splice(insertIndex, 0, moved);

  return result.map((t, idx) => ({
    ...t,
    order: idx + 1,
    chapterNumber: idx + 1,
    studioChapter: t.studioChapter
      ? {
          ...t.studioChapter,
          order: idx + 1,
          chapterNumber: idx + 1,
        }
      : undefined,
  }));
}
