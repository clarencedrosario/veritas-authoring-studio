import React, { useState } from 'react';
import {
  Play,
  RotateCcw,
  CheckCircle,
  XCircle,
  Award,
  Clock,
  ArrowRight,
  HelpCircle,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import {
  GrammarSeriesProject,
  GrammarClassLevel,
  GrammarTopic,
  GrammarQuestion,
} from '../types';
import { GrammarQuizRunnerTab } from './GrammarQuizRunnerTab';

interface GrammarQuizStudioViewProps {
  seriesProject: GrammarSeriesProject;
  onUpdateSeriesProject: (updated: GrammarSeriesProject) => void;
  isDarkMode: boolean;
}

export const GrammarQuizStudioView: React.FC<GrammarQuizStudioViewProps> = ({
  seriesProject,
  onUpdateSeriesProject,
  isDarkMode,
}) => {
  const [selectedClass, setSelectedClass] = useState<GrammarClassLevel>(
    seriesProject.selectedClass || 'Class 7'
  );
  const [selectedTopicId, setSelectedTopicId] = useState<string>('');

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

  const activeTopic: GrammarTopic | undefined =
    currentBook.topics.find((t) => t.id === selectedTopicId) || currentBook.topics[0];

  return (
    <div
      id="grammar-quiz-studio-root"
      className="flex-1 flex flex-col h-full overflow-hidden bg-[#EDE4D6] dark:bg-[#1e0f18] text-[#292521] dark:text-[#F6F0E7] select-none"
    >
      {/* Subheader */}
      <header className="h-14 border-b border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#F6F0E7] dark:bg-[#2b1622] px-4 sm:px-6 flex items-center justify-between gap-3 shrink-0 z-10">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-[#71685E] dark:text-[#c9b9a6] font-medium hidden sm:inline">
              Class Grade:
            </span>
            <select
              value={selectedClass}
              onChange={(e) => {
                const cls = e.target.value as GrammarClassLevel;
                setSelectedClass(cls);
                const b = seriesProject.books[cls];
                if (b && b.topics.length > 0) setSelectedTopicId(b.topics[0].id);
              }}
              className="bg-[#EDE4D6] dark:bg-[#1e0f18] border border-[#CBBEAC] dark:border-[#4d2b3b] rounded-lg px-3 py-1.5 text-sm font-semibold text-[#292521] dark:text-[#F6F0E7] outline-none cursor-pointer"
            >
              {allClasses.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-[#5A1832] text-[#F6F0E7] border border-[#C29A52]/30">
              {seriesProject.targetBoard}
            </span>
            <span className="text-sm font-medium text-[#71685E] dark:text-[#c9b9a6] hidden sm:inline">
              Interactive Assessment Quiz Runner
            </span>
          </div>
        </div>

        {/* Topic Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-[#71685E] dark:text-[#c9b9a6] font-medium hidden md:inline">
            Unit:
          </span>
          <select
            value={activeTopic?.id || ''}
            onChange={(e) => setSelectedTopicId(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#EDE4D6] dark:bg-[#1e0f18] text-sm font-serif font-medium text-[#292521] dark:text-[#F6F0E7] outline-none max-w-sm truncate cursor-pointer"
          >
            {currentBook.topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Main Canvas */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center">
        <div className="w-full max-w-4xl bg-[#F6F0E7] dark:bg-[#2b1622] border border-[#CBBEAC] dark:border-[#4d2b3b] rounded-2xl shadow-xs p-5 sm:p-8 flex flex-col">
          {activeTopic ? (
            <GrammarQuizRunnerTab
              topic={activeTopic}
              seriesProject={seriesProject}
              onUpdateSeriesProject={onUpdateSeriesProject}
              isDarkMode={isDarkMode}
              selectedClass={selectedClass}
              onSelectClass={(cls) => {
                setSelectedClass(cls);
                const b = seriesProject.books[cls];
                if (b && b.topics.length > 0) setSelectedTopicId(b.topics[0].id);
              }}
              onSelectTopicId={setSelectedTopicId}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
              <BookOpen className="w-12 h-12 text-[#9c9c98] mb-3" />
              <h4 className="text-base font-serif font-bold text-[#191918] dark:text-[#f4f4f5]">
                No Unit Selected
              </h4>
              <p className="text-xs text-[#6e6e6b] dark:text-[#9ca3af] max-w-sm mt-1">
                Please choose a unit from the top selector to begin the interactive quiz.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
