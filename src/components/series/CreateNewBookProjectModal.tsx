import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Info,
  Calendar,
  Layers,
} from 'lucide-react';
import {
  BookProject,
  CurriculumSystemId,
  GrammarClassLevel,
  BookEditionType,
} from '../../types';
import {
  getDefaultProductionMilestones,
  calculateBookReadiness,
} from '../../utils/bookProjectUtils';
import {
  classToVeritasLevel,
  getDevelopmentalBandForLevel,
  ALL_CLASS_LEVELS,
} from '../../utils/seriesArchitecture';

interface CreateNewBookProjectModalProps {
  seriesTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newProject: BookProject) => void;
}

export const CreateNewBookProjectModal: React.FC<CreateNewBookProjectModalProps> = ({
  seriesTitle,
  isOpen,
  onClose,
  onCreate,
}) => {
  const [board, setBoard] = useState<CurriculumSystemId>('CBSE');
  const [classOrStage, setClassOrStage] = useState('Class 7');
  const [classLevel, setClassLevel] = useState<GrammarClassLevel>('Class 7');
  const [bookTitle, setBookTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [trimSize, setTrimSize] = useState('Crown Quarto (189 × 246 mm)');
  const [targetPageCount, setTargetPageCount] = useState(192);
  const [estimatedWordCount, setEstimatedWordCount] = useState(42000);
  const [author, setAuthor] = useState('');
  const [editor, setEditor] = useState('');
  const [publisher, setPublisher] = useState('');
  const [edition, setEdition] = useState<BookEditionType>('Student Edition');

  if (!isOpen) return null;

  const handleBoardChange = (newBoard: CurriculumSystemId) => {
    setBoard(newBoard);
    if (newBoard === 'Cambridge') {
      setClassOrStage('Cambridge Lower Secondary (Stage 7)');
      setClassLevel('Class 7');
    } else {
      setClassOrStage('Class 7');
      setClassLevel('Class 7');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookTitle.trim()) return;

    const projectId = `bp-${board.toLowerCase()}-${Date.now()}`;
    const code = `BK-${board.toUpperCase()}-${classOrStage.replace(/[^a-zA-Z0-9]/g, '')}-${new Date().getFullYear()}`;

    const vLevel = classToVeritasLevel(classLevel);
    const devBand = getDevelopmentalBandForLevel(vLevel);

    const newProject: BookProject = {
      id: projectId,
      seriesTitle,
      bookTitle: bookTitle.trim(),
      subtitle: subtitle.trim() || undefined,
      board,
      programme: `${board} Graded English Curriculum`,
      classLevel,
      classOrStage,
      veritasLevel: vLevel,
      educationSystem: board,
      officialLevel: classOrStage,
      developmentalBand: devBand.id,
      isOfficialEquivalenceClaimed: false,
      subject: 'English Language & Composition',
      author: author.trim() ? author.trim() : 'Not entered',
      editor: editor.trim() ? editor.trim() : 'Not assigned',
      edition,
      academicYear: `${new Date().getFullYear()}–${new Date().getFullYear() + 1}`,
      isbnPlaceholder: 'Not Assigned',
      isbnStatus: 'Not Assigned',
      targetAge: board === 'Cambridge' ? '11–14 years' : '12–13 years',
      targetPageCount,
      estimatedWordCount,
      trimSize,
      status: 'Planning',
      isManualStatus: false,
      derivedStatus: 'Planning',
      publisher: publisher.trim() ? publisher.trim() : 'To be confirmed',
      internalProjectCode: code,
      copyrightYear: new Date().getFullYear(),
      language: 'English (UK / Commonwealth Standard)',
      notes: 'Newly initialized academic book project. Manuscript drafting pending chapter creation.',
      milestones: getDefaultProductionMilestones('Planning'),
      rightsAndEditions: [],
      lastEdited: new Date().toISOString(),
    };

    // Genuine realistic initial state (0% authored, 0 fake readiness, no fake ISBN)
    newProject.readiness = calculateBookReadiness(newProject, undefined);

    onCreate(newProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-[#F6F0E7] dark:bg-[#1e0f18] border border-[#CBBEAC] dark:border-[#4f2c3d] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#CBBEAC] dark:border-[#4f2c3d] flex items-center justify-between bg-[#EDE4D6] dark:bg-[#2b1622]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#5A1832] text-[#E6C994] flex items-center justify-center shadow-xs">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-[#35101F] dark:text-[#F6F0E7]">
                Initialize New Academic Book Project
              </h2>
              <p className="text-xs text-[#71685E] dark:text-[#c9b9a6]">
                Series: <span className="font-semibold">{seriesTitle}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#71685E] hover:text-[#35101F] dark:hover:text-[#F6F0E7] rounded-lg hover:bg-black/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-[#292521] dark:text-[#F6F0E7]">
          {/* Truth Layer Banner */}
          <div className="p-3 bg-white/70 dark:bg-black/20 rounded-xl border border-[#CBBEAC]/70 dark:border-[#4f2c3d] flex items-start space-x-2 text-[11px] text-[#71685E] dark:text-[#c9b9a6]">
            <ShieldCheck className="w-4 h-4 text-[#C29A52] shrink-0 mt-0.5" />
            <p>
              New projects begin in a neutral, verified state. No invented ISBNs, fake editorial reviews, or mock progress percentages will be asserted.
            </p>
          </div>

          {/* Title and Subtitle */}
          <div className="space-y-3">
            <div>
              <label className="block font-semibold mb-1 text-[#35101F] dark:text-[#F6F0E7]">
                Project Title *
              </label>
              <input
                type="text"
                required
                value={bookTitle}
                onChange={(e) => setBookTitle(e.target.value)}
                placeholder="e.g. English Grammar & Writing Skills (Book 7)"
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#CBBEAC] dark:border-[#4f2c3d] bg-white dark:bg-[#2b1622] text-[#292521] dark:text-[#F6F0E7] focus:ring-2 focus:ring-[#5A1832]/30"
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-[#71685E] dark:text-[#c9b9a6]">
                Subtitle (Optional)
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. A Comprehensive Graded Course for Middle Schools"
                className="w-full px-3 py-2 rounded-lg border border-[#CBBEAC] dark:border-[#4f2c3d] bg-white dark:bg-[#2b1622] text-[#292521] dark:text-[#F6F0E7]"
              />
            </div>
          </div>

          {/* Board, Class Level & Class Stage */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1">
            <div>
              <label className="block font-semibold mb-1 text-[#35101F] dark:text-[#F6F0E7]">
                Target Board *
              </label>
              <select
                value={board}
                onChange={(e) => handleBoardChange(e.target.value as CurriculumSystemId)}
                className="w-full px-3 py-2 rounded-lg border border-[#CBBEAC] dark:border-[#4f2c3d] bg-white dark:bg-[#2b1622] text-[#292521] dark:text-[#F6F0E7]"
              >
                <option value="CBSE">CBSE (Central Board)</option>
                <option value="CISCE">CISCE / ICSE</option>
                <option value="Cambridge">Cambridge International</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-[#35101F] dark:text-[#F6F0E7]">
                Class Level *
              </label>
              <select
                value={classLevel}
                onChange={(e) => {
                  const val = e.target.value as GrammarClassLevel;
                  setClassLevel(val);
                  if (board !== 'Cambridge') setClassOrStage(val);
                }}
                className="w-full px-3 py-2 rounded-lg border border-[#CBBEAC] dark:border-[#4f2c3d] bg-white dark:bg-[#2b1622] text-[#292521] dark:text-[#F6F0E7]"
              >
                {ALL_CLASS_LEVELS.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls} (Level {classToVeritasLevel(cls)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-[#35101F] dark:text-[#F6F0E7]">
                Target Class / Stage *
              </label>
              <input
                type="text"
                required
                value={classOrStage}
                onChange={(e) => setClassOrStage(e.target.value)}
                placeholder={board === 'Cambridge' ? 'e.g. Cambridge Lower Secondary' : 'e.g. Class 7'}
                className="w-full px-3 py-2 rounded-lg border border-[#CBBEAC] dark:border-[#4f2c3d] bg-white dark:bg-[#2b1622] text-[#292521] dark:text-[#F6F0E7]"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-[#35101F] dark:text-[#F6F0E7]">
                Edition Type
              </label>
              <select
                value={edition}
                onChange={(e) => setEdition(e.target.value as BookEditionType)}
                className="w-full px-3 py-2 rounded-lg border border-[#CBBEAC] dark:border-[#4f2c3d] bg-white dark:bg-[#2b1622] text-[#292521] dark:text-[#F6F0E7]"
              >
                <option value="Student Edition">Student Edition</option>
                <option value="Teacher Edition">Teacher Edition</option>
                <option value="Workbook">Workbook</option>
                <option value="Digital Edition">Digital Edition</option>
              </select>
            </div>
          </div>

          {/* Physical Trim Size & Targets */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div>
              <label className="block font-semibold mb-1 text-[#35101F] dark:text-[#F6F0E7]">
                Trim Size *
              </label>
              <select
                value={trimSize}
                onChange={(e) => setTrimSize(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#CBBEAC] dark:border-[#4f2c3d] bg-white dark:bg-[#2b1622] text-[#292521] dark:text-[#F6F0E7]"
              >
                <option value="Crown Quarto (189 × 246 mm)">Crown Quarto (189 × 246 mm)</option>
                <option value="Royal Octavo (156 × 234 mm)">Royal Octavo (156 × 234 mm)</option>
                <option value="Standard A4 (210 × 297 mm)">Standard A4 (210 × 297 mm)</option>
                <option value="US Letter (8.5 × 11 in)">US Letter (8.5 × 11 in)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-[#35101F] dark:text-[#F6F0E7]">
                Target Page Count
              </label>
              <input
                type="number"
                min={32}
                max={600}
                value={targetPageCount}
                onChange={(e) => setTargetPageCount(parseInt(e.target.value) || 192)}
                className="w-full px-3 py-2 rounded-lg border border-[#CBBEAC] dark:border-[#4f2c3d] bg-white dark:bg-[#2b1622] text-[#292521] dark:text-[#F6F0E7]"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-[#35101F] dark:text-[#F6F0E7]">
                Estimated Word Count
              </label>
              <input
                type="number"
                min={5000}
                max={200000}
                value={estimatedWordCount}
                onChange={(e) => setEstimatedWordCount(parseInt(e.target.value) || 42000)}
                className="w-full px-3 py-2 rounded-lg border border-[#CBBEAC] dark:border-[#4f2c3d] bg-white dark:bg-[#2b1622] text-[#292521] dark:text-[#F6F0E7]"
              />
            </div>
          </div>

          {/* Author & Publisher Details (Optional - defaults to neutral states) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t border-[#CBBEAC]/50 dark:border-[#4f2c3d] pt-3">
            <div>
              <label className="block font-medium mb-1 text-[#71685E] dark:text-[#c9b9a6]">
                Author(s)
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Leave blank for 'Not entered'"
                className="w-full px-3 py-2 rounded-lg border border-[#CBBEAC] dark:border-[#4f2c3d] bg-white dark:bg-[#2b1622] text-[#292521] dark:text-[#F6F0E7]"
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-[#71685E] dark:text-[#c9b9a6]">
                Commissioning Editor
              </label>
              <input
                type="text"
                value={editor}
                onChange={(e) => setEditor(e.target.value)}
                placeholder="Leave blank for 'Not assigned'"
                className="w-full px-3 py-2 rounded-lg border border-[#CBBEAC] dark:border-[#4f2c3d] bg-white dark:bg-[#2b1622] text-[#292521] dark:text-[#F6F0E7]"
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-[#71685E] dark:text-[#c9b9a6]">
                Publisher
              </label>
              <input
                type="text"
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                placeholder="Leave blank for 'To be confirmed'"
                className="w-full px-3 py-2 rounded-lg border border-[#CBBEAC] dark:border-[#4f2c3d] bg-white dark:bg-[#2b1622] text-[#292521] dark:text-[#F6F0E7]"
              />
            </div>
          </div>

          {/* Footer Controls */}
          <div className="pt-4 border-t border-[#CBBEAC] dark:border-[#4f2c3d] flex items-center justify-between">
            <div className="text-[11px] text-[#71685E] dark:text-[#c9b9a6]">
              Initial status: <span className="font-semibold text-slate-700 dark:text-slate-300">Planning (0% Authored)</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-[#292521] dark:text-[#F6F0E7] hover:bg-black/5 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!bookTitle.trim()}
                className="px-5 py-2 text-xs font-semibold text-white bg-[#5A1832] hover:bg-[#35101F] disabled:opacity-50 rounded-lg shadow-xs flex items-center space-x-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Book Project</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
