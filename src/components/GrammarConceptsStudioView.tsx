import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  Trash2,
  Check,
  BookOpen,
  Sparkles,
  ChevronRight,
  GitFork,
  ArrowRight,
  HelpCircle,
  Lightbulb,
  AlertCircle,
  FileText,
} from 'lucide-react';
import {
  GrammarSeriesProject,
  GrammarClassLevel,
  GrammarTopic,
  GrammarDefinition,
} from '../types';

interface GrammarConceptsStudioViewProps {
  seriesProject: GrammarSeriesProject;
  onUpdateSeriesProject: (updated: GrammarSeriesProject) => void;
  isDarkMode: boolean;
  onNavigateToDiagrammer?: (sentence: string) => void;
  onNavigateToTextbook?: () => void;
}

export const GrammarConceptsStudioView: React.FC<GrammarConceptsStudioViewProps> = ({
  seriesProject,
  onUpdateSeriesProject,
  isDarkMode,
  onNavigateToDiagrammer,
  onNavigateToTextbook,
}) => {
  const [selectedClass, setSelectedClass] = useState<GrammarClassLevel>(
    seriesProject.selectedClass || 'Class 7'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStrand, setSelectedStrand] = useState<string>('all');
  const [selectedConceptId, setSelectedConceptId] = useState<string>('');

  const allClasses: GrammarClassLevel[] = [
    'Class 3',
    'Class 4',
    'Class 5',
    'Class 6',
    'Class 7',
    'Class 8',
    'Class 9',
    'Class 10',
    'Class 11',
    'Class 12',
  ];

  const currentBook = seriesProject.books[selectedClass] || {
    classLevel: selectedClass,
    title: `${seriesProject.seriesTitle} - ${selectedClass}`,
    topics: [],
  };

  // Flatten all concepts / definitions across topics
  const allConcepts = useMemo(() => {
    const list: Array<{
      definition: GrammarDefinition;
      topicId: string;
      topicTitle: string;
      topicCategory: string;
    }> = [];

    currentBook.topics.forEach((topic) => {
      topic.definitions.forEach((def) => {
        list.push({
          definition: def,
          topicId: topic.id,
          topicTitle: topic.title,
          topicCategory: topic.category,
        });
      });
    });

    return list;
  }, [currentBook]);

  // Filtered concepts
  const filteredConcepts = useMemo(() => {
    return allConcepts.filter(({ definition, topicTitle, topicCategory }) => {
      const matchesSearch =
        !searchQuery ||
        definition.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        definition.ageAppropriateExplanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topicTitle.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStrand =
        selectedStrand === 'all' ||
        topicCategory.toLowerCase() === selectedStrand.toLowerCase() ||
        definition.partOfSpeechOrCategory.toLowerCase() === selectedStrand.toLowerCase();

      return matchesSearch && matchesStrand;
    });
  }, [allConcepts, searchQuery, selectedStrand]);

  const activeEntry = useMemo(() => {
    if (selectedConceptId) {
      const found = allConcepts.find((e) => e.definition.id === selectedConceptId);
      if (found) return found;
    }
    return filteredConcepts[0] || allConcepts[0];
  }, [selectedConceptId, allConcepts, filteredConcepts]);

  const activeConcept = activeEntry?.definition;

  const handleUpdateConcept = (updatedDef: GrammarDefinition) => {
    if (!activeEntry) return;

    const topic = currentBook.topics.find((t) => t.id === activeEntry.topicId);
    if (!topic) return;

    const updatedDefinitions = topic.definitions.map((d) =>
      d.id === updatedDef.id ? updatedDef : d
    );
    const updatedTopic: GrammarTopic = { ...topic, definitions: updatedDefinitions };
    const updatedBook = {
      ...currentBook,
      topics: currentBook.topics.map((t) => (t.id === topic.id ? updatedTopic : t)),
    };

    onUpdateSeriesProject({
      ...seriesProject,
      books: {
        ...seriesProject.books,
        [selectedClass]: updatedBook,
      },
      lastUpdated: new Date().toISOString(),
    });
  };

  const handleCreateNewConcept = () => {
    let targetTopic = currentBook.topics[0];
    if (!targetTopic) return;

    const newDef: GrammarDefinition = {
      id: `def_${Date.now()}`,
      term: 'New Grammar Concept',
      partOfSpeechOrCategory: targetTopic.category || 'Parts of Speech',
      ageAppropriateExplanation:
        'Clear, concise conceptual definition calibrated to standard curriculum guidelines.',
      rules: ['State the structural rule governing this grammatical component.'],
      formulaOrSyntax: 'Subject + Auxiliary Verb + Main Verb',
      examples: [
        {
          sentence: 'The dedicated scholar completed the exhaustive grammatical investigation.',
          highlightWord: 'completed',
          note: 'Active voice past transitive construction',
        },
      ],
      commonMistakes: [
        {
          incorrect: 'He did not went there.',
          correct: 'He did not go there.',
          reason: 'Auxiliary "did" requires the base form of the principal verb (bare infinitive).',
        },
      ],
    };

    const updatedTopic = {
      ...targetTopic,
      definitions: [...targetTopic.definitions, newDef],
    };

    const updatedBook = {
      ...currentBook,
      topics: currentBook.topics.map((t) => (t.id === targetTopic.id ? updatedTopic : t)),
    };

    onUpdateSeriesProject({
      ...seriesProject,
      books: {
        ...seriesProject.books,
        [selectedClass]: updatedBook,
      },
      lastUpdated: new Date().toISOString(),
    });

    setSelectedConceptId(newDef.id);
  };

  return (
    <div
      id="grammar-concepts-studio-root"
      className="flex-1 flex flex-col h-full overflow-hidden bg-[#EDE4D6] dark:bg-[#1e0f18] select-none text-[#292521] dark:text-[#F6F0E7]"
    >
      {/* Subheader */}
      <header className="min-h-[52px] border-b border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#F6F0E7] dark:bg-[#2b1622] px-4 sm:px-6 flex items-center justify-between gap-3 shrink-0 z-10">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-[#71685E] dark:text-[#c9b9a6] font-semibold hidden sm:inline">
              Class Grade:
            </span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value as GrammarClassLevel)}
              className="bg-[#EDE4D6] dark:bg-[#1e0f18] border border-[#CBBEAC] dark:border-[#4f2c3d] rounded-xl px-3 py-1.5 text-xs font-semibold text-[#35101F] dark:text-[#F6F0E7] outline-none cursor-pointer"
            >
              {allClasses.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>

          <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-[#EDE4D6] dark:bg-[#35101F] text-[#9A7438] dark:text-[#C29A52] border border-[#CBBEAC] dark:border-[#4f2c3d]">
            {seriesProject.targetBoard}
          </span>
          <span className="text-xs text-[#71685E] dark:text-[#c9b9a6] font-medium">
            {allConcepts.length} Concepts Cataloged
          </span>
        </div>

        <div className="flex items-center space-x-2.5">
          {onNavigateToTextbook && (
            <button
              onClick={onNavigateToTextbook}
              className="min-h-[38px] px-3.5 py-1.5 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] text-xs font-semibold text-[#71685E] dark:text-[#c9b9a6] hover:text-[#35101F] dark:hover:text-[#F6F0E7] transition-colors"
            >
              View in Textbook
            </button>
          )}

          <button
            onClick={handleCreateNewConcept}
            className="min-h-[38px] px-4 py-1.5 rounded-xl bg-[#5A1832] hover:bg-[#35101F] text-[#F6F0E7] text-xs font-bold flex items-center space-x-1.5 shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ New Concept</span>
          </button>
        </div>
      </header>

      {/* Main Two-Pane Split: Concept Index (Left) -> Concept Dossier Canvas (Right) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Concept Index */}
        <aside className="w-72 sm:w-80 border-r border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#F6F0E7] dark:bg-[#25131e] flex flex-col shrink-0">
          <div className="p-3.5 border-b border-[#CBBEAC] dark:border-[#4f2c3d] space-y-2.5 bg-[#EDE4D6] dark:bg-[#1e0f18]">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-[#71685E] dark:text-[#c9b9a6]" />
              <input
                type="text"
                placeholder="Search concepts or rules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full min-h-[38px] pl-9 pr-3 py-1.5 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#F6F0E7] dark:bg-[#2b1622] text-xs text-[#292521] dark:text-[#F6F0E7] placeholder-[#71685E] dark:placeholder-[#a89989] outline-none"
              />
            </div>

            <select
              value={selectedStrand}
              onChange={(e) => setSelectedStrand(e.target.value)}
              className="w-full min-h-[36px] px-3 py-1 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#F6F0E7] dark:bg-[#2b1622] text-xs text-[#71685E] dark:text-[#c9b9a6] outline-none"
            >
              <option value="all">All Strands</option>
              <option value="Parts of Speech">Parts of Speech</option>
              <option value="Syntax & Concord">Syntax &amp; Concord</option>
              <option value="Tenses">Tenses &amp; Aspect</option>
              <option value="Voice & Speech">Voice &amp; Speech</option>
              <option value="Clauses">Clauses &amp; Complex Sentences</option>
            </select>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#CBBEAC]/50 dark:divide-[#4f2c3d]">
            {filteredConcepts.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#71685E] dark:text-[#c9b9a6] font-serif italic leading-relaxed">
                No concepts found.
                <br />
                Click "+ New Concept" to create one.
              </div>
            ) : (
              filteredConcepts.map(({ definition, topicTitle }) => {
                const isSelected = activeConcept?.id === definition.id;

                return (
                  <button
                    key={definition.id}
                    onClick={() => setSelectedConceptId(definition.id)}
                    className={`w-full text-left p-3.5 transition-colors flex flex-col space-y-1.5 ${
                      isSelected
                        ? 'bg-[#EDE4D6] dark:bg-[#35101F] border-l-4 border-[#9A7438] dark:border-[#C29A52]'
                        : 'hover:bg-[#EDE4D6]/50 dark:hover:bg-[#1e0f18]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-mono uppercase font-bold text-[#9A7438] dark:text-[#C29A52]">
                        {definition.partOfSpeechOrCategory || 'Concept'}
                      </span>
                      <span className="font-mono text-[#71685E] dark:text-[#c9b9a6]">{topicTitle}</span>
                    </div>

                    <div className="font-serif font-bold text-sm text-[#35101F] dark:text-[#F6F0E7]">
                      {definition.term}
                    </div>

                    <div className="text-xs text-[#71685E] dark:text-[#c9b9a6] line-clamp-1">
                      {definition.ageAppropriateExplanation}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* Right: Concept Dossier */}
        {activeConcept ? (
          <main className="flex-1 overflow-y-auto bg-[#F6F0E7] dark:bg-[#1e0f18] p-6 sm:p-10 space-y-8">
            <div className="max-w-3xl mx-auto space-y-8 font-serif">
              {/* Header Title & Category */}
              <div className="border-b border-[#CBBEAC] dark:border-[#4f2c3d] pb-6 space-y-2.5">
                <div className="flex items-center justify-between font-sans text-xs text-[#71685E] dark:text-[#c9b9a6]">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono uppercase text-[10px] font-bold px-2.5 py-1 rounded-lg bg-[#EDE4D6] dark:bg-[#35101F] text-[#9A7438] dark:text-[#C29A52] border border-[#CBBEAC] dark:border-[#4f2c3d]">
                      {activeConcept.partOfSpeechOrCategory}
                    </span>
                    <span>&bull;</span>
                    <span>Chapter: {activeEntry?.topicTitle}</span>
                    <span>&bull;</span>
                    <span>{selectedClass}</span>
                  </div>

                  <button
                    onClick={() => {
                      const spec =
                        activeConcept.examples[0]?.sentence ||
                        'The determined candidate answered every question correctly.';
                      if (onNavigateToDiagrammer) onNavigateToDiagrammer(spec);
                    }}
                    className="min-h-[38px] px-3.5 py-1.5 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#EDE4D6] dark:bg-[#2b1622] hover:bg-[#F6F0E7] dark:hover:bg-[#35101F] text-xs font-semibold text-[#5A1832] dark:text-[#C29A52] flex items-center space-x-1.5 transition-colors font-sans"
                  >
                    <GitFork className="w-3.5 h-3.5" />
                    <span>Diagram Specimen</span>
                  </button>
                </div>

                <input
                  type="text"
                  value={activeConcept.term}
                  onChange={(e) =>
                    handleUpdateConcept({ ...activeConcept, term: e.target.value })
                  }
                  className="w-full text-3xl sm:text-4xl font-bold font-serif text-[#35101F] dark:text-[#F6F0E7] bg-transparent outline-none border-b border-transparent hover:border-[#CBBEAC] focus:border-[#9A7438]"
                />
              </div>

              {/* DEFINITION */}
              <section className="space-y-2 font-sans">
                <label className="text-[11px] font-mono uppercase font-bold tracking-wider text-[#9A7438] dark:text-[#C29A52] block">
                  Prescriptive Definition (Age-Appropriate)
                </label>
                <textarea
                  rows={3}
                  value={activeConcept.ageAppropriateExplanation}
                  onChange={(e) =>
                    handleUpdateConcept({
                      ...activeConcept,
                      ageAppropriateExplanation: e.target.value,
                    })
                  }
                  className="w-full text-base text-[#292521] dark:text-[#F6F0E7] bg-[#EDE4D6] dark:bg-[#2b1622] border border-[#CBBEAC] dark:border-[#4f2c3d] rounded-xl p-4 outline-none leading-relaxed font-serif"
                />
              </section>

              {/* RULE / FORMULA */}
              <section className="space-y-2 font-sans">
                <label className="text-[11px] font-mono uppercase font-bold tracking-wider text-[#9A7438] dark:text-[#C29A52] block">
                  Linguistic Rule &amp; Structural Formula
                </label>
                <input
                  type="text"
                  value={activeConcept.formulaOrSyntax || ''}
                  onChange={(e) =>
                    handleUpdateConcept({ ...activeConcept, formulaOrSyntax: e.target.value })
                  }
                  placeholder="e.g. Subject + Modal Auxiliary + Base Verb (V1)"
                  className="w-full text-sm font-mono font-bold text-[#5A1832] dark:text-[#C29A52] bg-[#EDE4D6] dark:bg-[#2b1622] border border-[#CBBEAC] dark:border-[#4f2c3d] rounded-xl p-3.5 outline-none"
                />
              </section>

              {/* EXAMPLES */}
              <section className="space-y-3 font-sans">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono uppercase font-bold tracking-wider text-[#9A7438] dark:text-[#C29A52]">
                    Exemplar Sentences
                  </label>
                  <button
                    onClick={() => {
                      handleUpdateConcept({
                        ...activeConcept,
                        examples: [
                          ...activeConcept.examples,
                          {
                            sentence: 'New illustrative sentence displaying grammatical standard.',
                            note: 'Contextual usage example',
                          },
                        ],
                      });
                    }}
                    className="text-xs font-semibold text-[#5A1832] dark:text-[#C29A52] hover:underline"
                  >
                    + Add Example
                  </button>
                </div>

                <div className="space-y-2.5">
                  {activeConcept.examples.map((ex, exIdx) => (
                    <div
                      key={exIdx}
                      className="p-4 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#EDE4D6] dark:bg-[#2b1622] space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-[#9A7438] dark:text-[#C29A52] font-bold">&bull;</span>
                        <input
                          type="text"
                          value={ex.sentence}
                          onChange={(e) => {
                            const updatedExs = [...activeConcept.examples];
                            updatedExs[exIdx] = { ...ex, sentence: e.target.value };
                            handleUpdateConcept({ ...activeConcept, examples: updatedExs });
                          }}
                          className="flex-1 font-serif text-base italic text-[#292521] dark:text-[#F6F0E7] bg-transparent outline-none"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Editorial linguistic annotation / note..."
                        value={ex.note || ''}
                        onChange={(e) => {
                          const updatedExs = [...activeConcept.examples];
                          updatedExs[exIdx] = { ...ex, note: e.target.value };
                          handleUpdateConcept({ ...activeConcept, examples: updatedExs });
                        }}
                        className="w-full text-xs text-[#71685E] dark:text-[#c9b9a6] bg-transparent outline-none pl-4"
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* COMMON ERRORS TABLE */}
              <section className="space-y-3 font-sans">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono uppercase font-bold tracking-wider text-[#9A7438] dark:text-[#C29A52]">
                    Common Student Errors &amp; Prescriptive Corrections
                  </label>
                  <button
                    onClick={() => {
                      const newErr = {
                        incorrect: 'Incorrect specimen formulation.',
                        correct: 'Prescribed standard formulation.',
                        reason: 'Linguistic rationale governing the rule.',
                      };
                      handleUpdateConcept({
                        ...activeConcept,
                        commonMistakes: [...(activeConcept.commonMistakes || []), newErr],
                      });
                    }}
                    className="text-xs font-semibold text-[#5A1832] dark:text-[#C29A52] hover:underline"
                  >
                    + Add Error Pattern
                  </button>
                </div>

                <div className="overflow-hidden rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#EDE4D6] dark:bg-[#35101F] text-[10px] font-mono uppercase font-bold text-[#71685E] dark:text-[#c9b9a6] border-b border-[#CBBEAC] dark:border-[#4f2c3d]">
                      <tr>
                        <th className="p-3.5">Frequent Error</th>
                        <th className="p-3.5">Standard Correction</th>
                        <th className="p-3.5">Grammatical Rationale</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#CBBEAC]/50 dark:divide-[#4f2c3d] bg-[#F6F0E7] dark:bg-[#25131e]">
                      {(activeConcept.commonMistakes || []).map((err, idx) => (
                        <tr key={idx}>
                          <td className="p-3.5 text-[#8B1E1E] dark:text-[#f87171] font-serif">
                            <input
                              type="text"
                              value={err.incorrect}
                              onChange={(e) => {
                                const updated = [...(activeConcept.commonMistakes || [])];
                                updated[idx] = { ...err, incorrect: e.target.value };
                                handleUpdateConcept({
                                  ...activeConcept,
                                  commonMistakes: updated,
                                });
                              }}
                              className="w-full bg-transparent outline-none"
                            />
                          </td>
                          <td className="p-3.5 text-[#2D5A27] dark:text-[#4ade80] font-serif font-bold">
                            <input
                              type="text"
                              value={err.correct}
                              onChange={(e) => {
                                const updated = [...(activeConcept.commonMistakes || [])];
                                updated[idx] = { ...err, correct: e.target.value };
                                handleUpdateConcept({
                                  ...activeConcept,
                                  commonMistakes: updated,
                                });
                              }}
                              className="w-full bg-transparent outline-none"
                            />
                          </td>
                          <td className="p-3.5 text-[#71685E] dark:text-[#c9b9a6]">
                            <input
                              type="text"
                              value={err.reason}
                              onChange={(e) => {
                                const updated = [...(activeConcept.commonMistakes || [])];
                                updated[idx] = { ...err, reason: e.target.value };
                                handleUpdateConcept({
                                  ...activeConcept,
                                  commonMistakes: updated,
                                });
                              }}
                              className="w-full bg-transparent outline-none"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </main>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-[#F6F0E7] dark:bg-[#1e0f18]">
            <BookOpen className="w-12 h-12 text-[#9A7438] dark:text-[#C29A52] mb-3" />
            <h4 className="text-xl font-serif font-bold text-[#35101F] dark:text-[#F6F0E7]">
              No Concept Selected
            </h4>
            <p className="text-sm text-[#71685E] dark:text-[#c9b9a6] max-w-sm mt-1.5 mb-5 font-serif">
              Select a concept from the index on the left or create a new one.
            </p>
            <button
              onClick={handleCreateNewConcept}
              className="min-h-[42px] px-5 py-2 rounded-xl text-xs font-bold bg-[#5A1832] hover:bg-[#35101F] text-[#F6F0E7] shadow-xs"
            >
              + Create Concept
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
