// =============================================================
// VERITAS Academic Book Studio — Import From Question Bank Modal
// Reusable Question Import with zero destructive mutation of master bank
// =============================================================

import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  Filter,
  Plus,
  Check,
  BookOpen,
  Layers,
  HelpCircle,
  Database,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import {
  GrammarSeriesProject,
  GrammarQuestion,
  QuestionType,
  CognitiveLevel,
} from '../../../types';

export interface ImportFromQuestionBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  seriesProject?: GrammarSeriesProject;
  exerciseTitle: string;
  onImportQuestions: (questions: GrammarQuestion[]) => void;
}

export const ImportFromQuestionBankModal: React.FC<ImportFromQuestionBankModalProps> = ({
  isOpen,
  onClose,
  seriesProject,
  exerciseTitle,
  onImportQuestions,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterCognitive, setFilterCognitive] = useState<string>('all');
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<Set<string>>(new Set());

  // Aggregate questions from seriesProject or default bank pool
  const bankQuestions = useMemo(() => {
    const list: Array<{
      question: GrammarQuestion;
      topicTitle: string;
      classLevel: string;
    }> = [];

    if (seriesProject?.books) {
      Object.entries(seriesProject.books).forEach(([classKey, book]) => {
        if (book.topics) {
          book.topics.forEach((topic) => {
            if (topic.exercises) {
              topic.exercises.forEach((ex) => {
                if (ex.questions) {
                  ex.questions.forEach((q) => {
                    list.push({
                      question: q,
                      topicTitle: topic.title,
                      classLevel: classKey,
                    });
                  });
                }
              });
            }
          });
        }
      });
    }

    // Deduplicate by question text/id if needed
    const seen = new Set<string>();
    return list.filter((item) => {
      const key = item.question.id || item.question.prompt;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [seriesProject]);

  // Filtered list
  const filteredQuestions = useMemo(() => {
    return bankQuestions.filter((item) => {
      const q = item.question;
      const matchesSearch =
        !searchQuery.trim() ||
        (q.prompt && q.prompt.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (q.correctAnswer && q.correctAnswer.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.topicTitle && item.topicTitle.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType = filterType === 'all' || q.type === filterType;
      const matchesDifficulty =
        filterDifficulty === 'all' || (q.difficulty || '').toLowerCase() === filterDifficulty.toLowerCase();
      const matchesCognitive =
        filterCognitive === 'all' || (q.cognitiveLevel || '').toLowerCase() === filterCognitive.toLowerCase();

      return matchesSearch && matchesType && matchesDifficulty && matchesCognitive;
    });
  }, [bankQuestions, searchQuery, filterType, filterDifficulty, filterCognitive]);

  if (!isOpen) return null;

  const toggleSelect = (id: string) => {
    setSelectedQuestionIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedQuestionIds.size === filteredQuestions.length) {
      setSelectedQuestionIds(new Set());
    } else {
      setSelectedQuestionIds(new Set(filteredQuestions.map((item) => item.question.id)));
    }
  };

  const handleConfirmImport = () => {
    const selected = bankQuestions
      .filter((item) => selectedQuestionIds.has(item.question.id))
      .map((item) => {
        const original = item.question;
        // Non-destructive snapshot copy with fresh chapter-scoped instance ID
        const cloned: GrammarQuestion = {
          ...original,
          id: `q-inst-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          sourceQuestionBankId: original.id,
          source: 'Question Bank',
          metadata: {
            ...original.metadata,
            importedAt: new Date().toISOString(),
            originalTopic: item.topicTitle,
            originalClass: item.classLevel,
          },
        };
        return cloned;
      });

    onImportQuestions(selected);
    setSelectedQuestionIds(new Set());
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-hidden select-none"
      onClick={onClose}
    >
      <div
        className="bg-[#F6F0E7] border border-[#C29A52]/40 rounded-2xl shadow-2xl max-w-4xl w-full text-[#292521] max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="import-bank-title"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#CBBEAC] bg-[#EDE4D6] flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#5A1832] text-[#F6F0E7] flex items-center justify-center shadow-xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 id="import-bank-title" className="font-serif font-bold text-base text-[#35101F]">
                Import from Question Bank
              </h2>
              <p className="text-xs text-[#71685E]">
                Import canonical questions into <span className="font-bold text-[#5A1832]">{exerciseTitle}</span> (copies are isolated and safe)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#71685E] hover:text-[#35101F] hover:bg-[#CBBEAC]/40 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter / Search Bar */}
        <div className="p-4 border-b border-[#CBBEAC] bg-[#FAF7F2] flex flex-wrap items-center gap-3 shrink-0">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-[#71685E] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by prompt stem, answer, or concept..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#FFFDF8] border border-[#CBBEAC] rounded-lg text-xs text-[#292521] placeholder-[#71685E]/60 focus:outline-none focus:border-[#5A1832]"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-lg px-2.5 py-1.5 text-xs text-[#292521] focus:outline-none focus:border-[#5A1832]"
            >
              <option value="all">All Types</option>
              <option value="mcq">MCQ</option>
              <option value="fill_in_blanks">Fill in Blanks</option>
              <option value="identify_underline">Identify / Underline</option>
              <option value="rewrite_sentence">Transformation</option>
              <option value="error_correction">Error Correction</option>
              <option value="short_answer">Short Answer</option>
              <option value="open_ended">Open Ended</option>
            </select>

            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-lg px-2.5 py-1.5 text-xs text-[#292521] focus:outline-none focus:border-[#5A1832]"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy / Foundational</option>
              <option value="medium">Medium / Standard</option>
              <option value="hard">Hard / Advanced</option>
            </select>

            <select
              value={filterCognitive}
              onChange={(e) => setFilterCognitive(e.target.value)}
              className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-lg px-2.5 py-1.5 text-xs text-[#292521] focus:outline-none focus:border-[#5A1832]"
            >
              <option value="all">All Bloom Levels</option>
              <option value="remembering">Remembering</option>
              <option value="understanding">Understanding</option>
              <option value="applying">Applying</option>
              <option value="analyzing">Analyzing</option>
              <option value="evaluating">Evaluating</option>
            </select>
          </div>
        </div>

        {/* Selection summary & batch action */}
        <div className="px-6 py-2 bg-[#EDE4D6]/70 border-b border-[#CBBEAC] flex items-center justify-between text-xs text-[#71685E]">
          <span>
            Found <strong className="text-[#35101F]">{filteredQuestions.length}</strong> questions in repository
          </span>
          <button
            type="button"
            onClick={handleSelectAll}
            className="text-[#5A1832] font-medium hover:underline cursor-pointer"
          >
            {selectedQuestionIds.size === filteredQuestions.length && filteredQuestions.length > 0
              ? 'Deselect All'
              : 'Select All Visible'}
          </button>
        </div>

        {/* Questions List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[250px]">
          {filteredQuestions.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-center p-6 text-[#71685E]">
              <Database className="w-8 h-8 text-[#CBBEAC] mb-2" />
              <p className="font-serif font-bold text-sm text-[#35101F]">No questions found</p>
              <p className="text-xs mt-1">Try broadening your search query or relaxing filter criteria.</p>
            </div>
          ) : (
            filteredQuestions.map((item) => {
              const q = item.question;
              const isSelected = selectedQuestionIds.has(q.id);
              return (
                <div
                  key={q.id}
                  onClick={() => toggleSelect(q.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#FFFDF8] border-[#5A1832] shadow-sm ring-1 ring-[#5A1832]/30'
                      : 'bg-[#FFFDF8] border-[#CBBEAC] hover:border-[#C29A52]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isSelected
                          ? 'bg-[#5A1832] border-[#5A1832] text-white'
                          : 'border-[#CBBEAC] bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap text-[11px]">
                        <span className="px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-[#EDE4D6] text-[#5A1832]">
                          {q.type.replace('_', ' ')}
                        </span>
                        <span className="text-[#71685E] font-medium">
                          {q.difficulty || 'Medium'} &bull; {q.cognitiveLevel || 'Applying'}
                        </span>
                        <span className="text-[#71685E] ml-auto">
                          {item.topicTitle} &bull; {item.classLevel}
                        </span>
                      </div>

                      <p className="text-xs font-serif text-[#292521] leading-relaxed">
                        {q.prompt || q.originalSentence || q.blanksSentence || '(Question stem)'}
                      </p>

                      {q.correctAnswer && (
                        <div className="text-[11px] bg-[#FAF7F2] p-2 rounded border border-[#CBBEAC]/50 text-[#71685E]">
                          <strong className="text-[#5A1832]">Answer Key: </strong>
                          <span>{q.correctAnswer}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-[#CBBEAC] bg-[#EDE4D6] flex items-center justify-between shrink-0">
          <span className="text-xs text-[#71685E]">
            Selected: <strong className="text-[#5A1832]">{selectedQuestionIds.size}</strong> question(s)
          </span>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg border border-[#CBBEAC] text-xs font-serif font-medium text-[#71685E] hover:text-[#292521] hover:bg-[#CBBEAC]/30 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={selectedQuestionIds.size === 0}
              onClick={handleConfirmImport}
              className={`px-4 py-1.5 rounded-lg text-xs font-serif font-bold text-white flex items-center gap-1.5 shadow-xs transition-all ${
                selectedQuestionIds.size === 0
                  ? 'bg-[#CBBEAC] cursor-not-allowed text-[#71685E]'
                  : 'bg-[#5A1832] hover:bg-[#431225] cursor-pointer'
              }`}
            >
              <Plus className="w-4 h-4" />
              Import {selectedQuestionIds.size > 0 ? `(${selectedQuestionIds.size})` : ''} to Exercise
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
