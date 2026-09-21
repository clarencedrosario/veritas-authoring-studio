import React, { useState } from 'react';
import {
  Download,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight,
  TrendingUp,
  FileText,
  Filter,
  Check,
} from 'lucide-react';
import { NovelProject } from '../types';

interface AnalyticsViewProps {
  project: NovelProject;
  isDarkMode: boolean;
}

interface TaskItem {
  id: string;
  title: string;
  assignee: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Planned' | 'Initiated' | 'Ongoing' | 'Completed';
  category: 'Manuscript' | 'Proofreading' | 'Cover Art' | 'Grammar' | 'Export';
  completionType?: 'Early' | 'On Time' | 'Late';
  dueDate: string;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ project, isDarkMode }) => {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Tasks' | 'Risk' | 'Priority' | 'Completed'>('Tasks');
  const [viewMode, setViewMode] = useState<'task_analysis' | 'manuscript_stats'>('task_analysis');
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);

  // Dynamic project manuscript calculations
  const totalWords = project.chapters.reduce(
    (acc, c) => acc + c.scenes.reduce((sa, s) => sa + (s.wordCount || 0), 0),
    0
  );
  const targetWords = project.targetTotalWords || 80000;
  const progressPercent = Math.min(100, Math.round((totalWords / targetWords) * 100));
  const estimatedPages = Math.round(totalWords / 250);
  const totalReadingMinutes = Math.round(totalWords / 225);

  // Task Analysis Live Data
  const [taskList, setTaskList] = useState<TaskItem[]>([
    { id: '1', title: 'Chapter 1–3 Exposition Polish', assignee: project.authorName || 'Author', priority: 'High', status: 'Completed', category: 'Manuscript', completionType: 'Early', dueDate: 'Sep 10' },
    { id: '2', title: 'Character Dialogue Cadence Audit', assignee: 'Lead Editor', priority: 'High', status: 'Completed', category: 'Manuscript', completionType: 'Early', dueDate: 'Sep 12' },
    { id: '3', title: 'Class 10 Board Blueprint Alignment', assignee: 'Curriculum Head', priority: 'High', status: 'Completed', category: 'Grammar', completionType: 'Early', dueDate: 'Sep 15' },
    { id: '4', title: 'Plot Architecture Climax Calibration', assignee: 'Co-Author', priority: 'Medium', status: 'Ongoing', category: 'Manuscript', completionType: 'On Time', dueDate: 'Sep 18' },
    { id: '5', title: 'Sensory Imagery Density Pass', assignee: 'Voice Guard AI', priority: 'Medium', status: 'Ongoing', category: 'Proofreading', completionType: 'On Time', dueDate: 'Sep 20' },
    { id: '6', title: 'Crown Quarto Print Margin Validation', assignee: 'Typesetter', priority: 'Medium', status: 'Initiated', category: 'Export', completionType: 'On Time', dueDate: 'Sep 22' },
    { id: '7', title: 'Cover Typographic Spine Contrast Check', assignee: 'Art Director', priority: 'Low', status: 'Initiated', category: 'Cover Art', completionType: 'On Time', dueDate: 'Sep 25' },
    { id: '8', title: 'CBSE Section B Error Bank Expansion', assignee: 'Language Team', priority: 'High', status: 'Planned', category: 'Grammar', completionType: 'On Time', dueDate: 'Sep 28' },
    { id: '9', title: 'Spaced Repetition Deck Flashcard Proof', assignee: 'Educator Panel', priority: 'Medium', status: 'Planned', category: 'Grammar', completionType: 'On Time', dueDate: 'Oct 02' },
    { id: '10', title: 'EPUB / Kindle Format Integrity Check', assignee: 'Digital Tech', priority: 'Low', status: 'Planned', category: 'Export', completionType: 'On Time', dueDate: 'Oct 05' },
    { id: '11', title: 'Final ISBN & CIP Cataloguing Metadata', assignee: 'Publisher Agent', priority: 'High', status: 'Planned', category: 'Export', completionType: 'Late', dueDate: 'Oct 08' },
  ]);

  const totalTasksCount = taskList.length; // 11
  const completedTasksCount = taskList.filter((t) => t.status === 'Completed').length; // 3
  const outstandingTasksCount = totalTasksCount - completedTasksCount; // 8
  const completedEarlyCount = taskList.filter((t) => t.completionType === 'Early').length; // 3

  // Assigned YoY Data points (Jan - Dec)
  const yoyMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const thisYearAssigned = [16, 17, 30, 36, 42, 48, 43, 58, 54, 60, 68, 74];
  const lastYearAssigned = [12, 13, 20, 26, 32, 34, 30, 42, 38, 45, 52, 58];

  // Completed YoY Data points
  const thisYearCompleted = [28, 32, 40, 48, 56, 52, 48, 62, 70, 78, 86, 92];
  const lastYearCompleted = [20, 24, 28, 34, 38, 42, 40, 48, 52, 58, 62, 68];

  // Export Executive Milestone Report
  const handleExportReport = () => {
    const reportText = `=====================================================
TASK ANALYSIS & PROJECT VELOCITY REPORT (SUNNY SURF)
=====================================================
Project: ${project.title}
Author: ${project.authorName || 'Author'}
Generated: ${new Date().toLocaleString()}

1. TASK & OPERATIONAL VELOCITY
- Total Tasks: ${totalTasksCount}
- Outstanding Tasks: ${outstandingTasksCount}
- Average Task Time: 19 days
- Tasks Assigned Increase YoY: +267%
- Completed Early: ${completedEarlyCount}
- Task Status: 27% Planned, 27% Initiated, 18% Ongoing, 27% Completed

2. MANUSCRIPT MILESTONES
- Word Count: ${totalWords.toLocaleString()} / ${targetWords.toLocaleString()} (${progressPercent}%)
- Estimated Trade Paperback Pages: ~${estimatedPages} pages
- Reading Completion: ~${(totalReadingMinutes / 60).toFixed(1)} hours
- Total Chapters: ${project.chapters.length}

3. SUNNY SURF COLOR SYSTEM
- Primary Surf Navy: #172554 / #1e3a8a
- Electric Surf Blue: #2563eb / #3b82f6
- Soft Surf Sky Pill: #e9f0fc
- Sunny Amber / Orange: #f59e0b / #f97316
=====================================================`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.title.replace(/\s+/g, '_')}_SunnySurf_TaskAnalysis.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="analytics-view" className="flex-1 overflow-y-auto p-4 md:p-8 bg-white dark:bg-[#0b1120] text-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* TOP BAR: TASK ANALYSIS TITLE & FILTERS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase font-sans">
              TASK ANALYSIS
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Operational velocity, YoY task completion, and performance benchmarks.
            </p>
          </div>

          {/* Filter Chips matching top-right of image: Tasks, Risk, Priority, Completed */}
          <div className="flex items-center flex-wrap gap-2 sm:gap-3 text-xs font-semibold">
            <button
              onClick={() => setActiveFilter('Tasks')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                activeFilter === 'Tasks'
                  ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Tasks</span>
            </button>

            <button
              onClick={() => setActiveFilter('Risk')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                activeFilter === 'Risk'
                  ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-400'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-xs bg-amber-500" />
              <span>Risk</span>
            </button>

            <button
              onClick={() => setActiveFilter('Priority')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                activeFilter === 'Priority'
                  ? 'bg-[#ea580c] text-white border-[#ea580c] shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-orange-400'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-xs bg-[#ea580c]" />
              <span>Priority</span>
            </button>

            <button
              onClick={() => setActiveFilter('Completed')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                activeFilter === 'Completed'
                  ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-400'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-xs bg-amber-400" />
              <span>Completed</span>
            </button>

            <button
              onClick={handleExportReport}
              className="ml-auto px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center space-x-1.5 text-xs font-semibold shadow-2xs"
              title="Export Report"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* PRIMARY GRID OF CARDS (TOP 3 CARDS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* CARD 1: Assigned YoY (4 cols) */}
          <div className="lg:col-span-4 bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between">
            {/* Header pill strip - clean neutral slate */}
            <div className="w-full bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60 px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center justify-between mb-4">
              <span>Assigned YoY</span>
              <div className="flex items-center space-x-3 text-[10px] font-semibold">
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] inline-block" />
                  <span className="text-slate-700 dark:text-slate-300">This Year</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded-full border border-slate-400 bg-slate-200 inline-block" />
                  <span className="text-slate-700 dark:text-slate-300">Last Year</span>
                </span>
              </div>
            </div>

            {/* Dual Line Trend Chart with Area Gradient */}
            <div className="relative h-48 w-full flex items-end">
              {/* Y Axis scale: 0, 20, 40, 60 */}
              <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] font-mono text-slate-400 pr-2">
                <span>60</span>
                <span>40</span>
                <span>20</span>
                <span>0</span>
              </div>

              {/* Chart SVG */}
              <div className="ml-6 w-full h-full flex flex-col justify-between">
                <svg className="w-full h-38 overflow-visible" viewBox="0 0 300 120" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="surfAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#eff6ff" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal grid guide lines */}
                  <line x1="0" y1="20" x2="300" y2="20" stroke="#f1f5f9" strokeDasharray="3 3" />
                  <line x1="0" y1="60" x2="300" y2="60" stroke="#f1f5f9" strokeDasharray="3 3" />
                  <line x1="0" y1="100" x2="300" y2="100" stroke="#e2e8f0" />

                  {/* Area fill */}
                  <polygon
                    points="0,95 27,90 54,82 81,74 108,68 135,62 162,70 189,45 216,50 243,38 270,28 297,18 297,110 0,110"
                    fill="url(#surfAreaGrad)"
                  />

                  {/* Last Year line (Sky Blue) */}
                  <polyline
                    fill="none"
                    stroke="#93c5fd"
                    strokeWidth="2.5"
                    points="0,100 27,98 54,88 81,80 108,74 135,70 162,76 189,60 216,66 243,54 270,44 297,36"
                  />

                  {/* This Year line (Sunny Orange) */}
                  <polyline
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2.5"
                    points="0,95 27,90 54,82 81,74 108,68 135,62 162,70 189,45 216,50 243,38 270,28 297,18"
                  />

                  {/* End node dots */}
                  <circle cx="297" cy="18" r="4" fill="#f59e0b" />
                  <circle cx="297" cy="36" r="4" fill="#93c5fd" stroke="#ffffff" strokeWidth="1" />
                </svg>

                {/* X Axis Months Jan - Dec */}
                <div className="flex justify-between text-[8px] sm:text-[9px] text-slate-400 font-medium pt-2 border-t border-slate-100 dark:border-slate-800">
                  {yoyMonths.map((m, idx) => (
                    <span key={idx} className="truncate">{m}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2: Completed YoY (4 cols) */}
          <div className="lg:col-span-4 bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between">
            <div className="w-full bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60 px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center justify-between mb-4">
              <span>Completed YoY</span>
              <div className="flex items-center space-x-3 text-[10px] font-semibold">
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] inline-block" />
                  <span className="text-slate-700 dark:text-slate-300">This Year</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#93c5fd] inline-block" />
                  <span className="text-slate-700 dark:text-slate-300">Last Year</span>
                </span>
              </div>
            </div>

            {/* Grouped Bar Chart */}
            <div className="relative h-48 w-full flex items-end">
              {/* Y Axis: 0, 20, 40, 60, 80, 100 */}
              <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] font-mono text-slate-400 pr-2">
                <span>100</span>
                <span>80</span>
                <span>60</span>
                <span>40</span>
                <span>20</span>
                <span>0</span>
              </div>

              <div className="ml-6 w-full h-full flex flex-col justify-between">
                <div className="flex-1 flex items-end justify-between gap-1 pt-2">
                  {yoyMonths.map((month, idx) => {
                    const thisVal = thisYearCompleted[idx];
                    const lastVal = lastYearCompleted[idx];
                    return (
                      <div key={idx} className="flex-1 flex items-end justify-center space-x-0.5 group relative">
                        {/* Tooltip on hover */}
                        <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[9px] px-1.5 py-0.5 rounded pointer-events-none whitespace-nowrap z-10">
                          TY: {thisVal} | LY: {lastVal}
                        </div>
                        {/* Amber bar (This Year) */}
                        <div
                          className="w-1.5 sm:w-2 bg-[#f59e0b] rounded-t-xs hover:brightness-110 transition-all"
                          style={{ height: `${(thisVal / 100) * 110}px` }}
                        />
                        {/* Sky Blue bar (Last Year) */}
                        <div
                          className="w-1.5 sm:w-2 bg-[#93c5fd] rounded-t-xs hover:brightness-110 transition-all"
                          style={{ height: `${(lastVal / 100) * 110}px` }}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Months */}
                <div className="flex justify-between text-[8px] sm:text-[9px] text-slate-400 font-medium pt-2 border-t border-slate-100 dark:border-slate-800">
                  {yoyMonths.map((m, idx) => (
                    <span key={idx} className="truncate">{m}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CARD 3: Priority Donut (4 cols) */}
          <div className="lg:col-span-4 bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between">
            <div className="w-full bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60 px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center justify-between mb-4">
              <span>Priority</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Distribution</span>
            </div>

            {/* SVG Donut Chart with Exact Percentages: 33%, 11%, 11%, 22%, 22% */}
            <div className="flex items-center justify-center relative h-48">
              <svg className="w-44 h-44 transform -rotate-90" viewBox="0 0 100 100">
                {/* 33% Amber Orange */}
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="transparent"
                  stroke="#f59e0b"
                  strokeWidth="20"
                  strokeDasharray="72.6 147.4"
                  strokeDashoffset="0"
                  className="hover:opacity-90 transition-opacity cursor-pointer"
                />
                {/* 11% Deep Navy */}
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="transparent"
                  stroke="#172554"
                  strokeWidth="20"
                  strokeDasharray="24.2 195.8"
                  strokeDashoffset="-72.6"
                  className="hover:opacity-90 transition-opacity cursor-pointer"
                />
                {/* 11% Electric Blue */}
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="transparent"
                  stroke="#2563eb"
                  strokeWidth="20"
                  strokeDasharray="24.2 195.8"
                  strokeDashoffset="-96.8"
                  className="hover:opacity-90 transition-opacity cursor-pointer"
                />
                {/* 22% Royal/Sky Blue */}
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="transparent"
                  stroke="#3b82f6"
                  strokeWidth="20"
                  strokeDasharray="48.4 171.6"
                  strokeDashoffset="-121"
                  className="hover:opacity-90 transition-opacity cursor-pointer"
                />
                {/* 22% Soft Sky Blue */}
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="transparent"
                  stroke="#93c5fd"
                  strokeWidth="20"
                  strokeDasharray="48.4 171.6"
                  strokeDashoffset="-169.4"
                  className="hover:opacity-90 transition-opacity cursor-pointer"
                />
                {/* Inner cutout hole */}
                <circle cx="50" cy="50" r="22" fill={isDarkMode ? '#0f172a' : '#ffffff'} />
              </svg>

              {/* Floating Labels over Donut as seen in image */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="absolute left-8 top-18 text-[11px] font-extrabold text-white">33%</span>
                <span className="absolute top-7 left-20 text-[10px] font-bold text-white">11%</span>
                <span className="absolute top-7 right-20 text-[10px] font-bold text-white">11%</span>
                <span className="absolute right-9 top-18 text-[11px] font-extrabold text-white">22%</span>
                <span className="absolute bottom-10 right-16 text-[11px] font-extrabold text-slate-800 dark:text-slate-900">22%</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECOND ROW: OUTSTANDING, COMPLETED, HEALTH & SUNNY SURF SHOWCASE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

          {/* CARD 4: Outstanding (4 cols) */}
          <div className="lg:col-span-4 bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between">
            <div className="w-full bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60 px-3.5 py-1.5 rounded-lg text-xs font-bold mb-4">
              Outstanding
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Semicircular Donut / Gauge (27%, 27%, 18%, 27%) */}
              <div className="relative w-44 h-26 flex items-end justify-center">
                <svg className="w-44 h-26 overflow-visible" viewBox="0 0 100 50">
                  {/* Gauge Base arc */}
                  <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#e2e8f0" strokeWidth="18" />
                  {/* Amber slice 27% */}
                  <path
                    d="M 10 50 A 40 40 0 0 1 23 23"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="18"
                    className="hover:opacity-90 cursor-pointer"
                  />
                  {/* Deep Navy slice 27% */}
                  <path
                    d="M 23 23 A 40 40 0 0 1 50 10"
                    fill="none"
                    stroke="#172554"
                    strokeWidth="18"
                    className="hover:opacity-90 cursor-pointer"
                  />
                  {/* Royal Blue slice 18% */}
                  <path
                    d="M 50 10 A 40 40 0 0 1 68 16"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="18"
                    className="hover:opacity-90 cursor-pointer"
                  />
                  {/* Sky Blue slice 27% */}
                  <path
                    d="M 68 16 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke="#93c5fd"
                    strokeWidth="18"
                    className="hover:opacity-90 cursor-pointer"
                  />
                </svg>

                {/* Semicircle percent labels */}
                <span className="absolute left-6 bottom-4 text-[10px] font-bold text-white">27%</span>
                <span className="absolute left-16 top-6 text-[10px] font-bold text-white">27%</span>
                <span className="absolute right-18 top-6 text-[10px] font-bold text-white">18%</span>
                <span className="absolute right-6 bottom-4 text-[10px] font-bold text-[#1e3a8a] dark:text-slate-900">27%</span>
              </div>

              {/* Legend with matching dots */}
              <div className="space-y-1.5 text-[11px] font-medium shrink-0">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                  <span className="text-slate-700 dark:text-slate-300">Planned Tasks</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#172554] dark:bg-blue-300" />
                  <span className="text-slate-700 dark:text-slate-300">Initiated Tasks</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb]" />
                  <span className="text-slate-700 dark:text-slate-300">Ongoing Tasks</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#93c5fd]" />
                  <span className="text-slate-700 dark:text-slate-300">Completed Tasks</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
              8 of 11 operational tasks active across curriculum &amp; publishing.
            </div>
          </div>

          {/* CARD 5: Completed (4 cols) */}
          <div className="lg:col-span-4 bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between">
            <div className="w-full bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60 px-3.5 py-1.5 rounded-lg text-xs font-bold mb-3">
              Completed
            </div>

            {/* Sub-legend as seen in image */}
            <div className="flex items-center space-x-3 text-[10px] font-semibold mb-4">
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                <span className="text-slate-700 dark:text-slate-300">Completed Early</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#93c5fd]" />
                <span className="text-slate-700 dark:text-slate-300">Completed on Time</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#fbcfe8]" />
                <span className="text-slate-700 dark:text-slate-300">Completed Late</span>
              </span>
            </div>

            {/* Horizontal tiered bars (matching the image) */}
            <div className="space-y-3 flex-1 flex flex-col justify-center">
              {/* Early (Amber) */}
              <div className="w-full">
                <div className="h-4 bg-[#f59e0b] rounded-r-md" style={{ width: '42%' }} />
              </div>
              {/* On Time (Sky Blue) */}
              <div className="w-full">
                <div className="h-4 bg-[#93c5fd] rounded-r-md" style={{ width: '78%' }} />
              </div>
              {/* Late (Peach/Rose) */}
              <div className="w-full">
                <div className="h-4 bg-[#fbcfe8] dark:bg-rose-900/60 rounded-r-md" style={{ width: '28%' }} />
              </div>
            </div>

            {/* Horizontal Axis numbers: 2, 3, 4, 5, 6 */}
            <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-3 border-t border-slate-100 dark:border-slate-800">
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
              <span>6</span>
            </div>
          </div>

          {/* CARD 6: Health & Velocity (4 cols) */}
          <div className="lg:col-span-4 bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between">
            <div className="w-full bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60 px-3.5 py-1.5 rounded-lg text-xs font-bold mb-4">
              Health
            </div>

            <div className="relative h-36 w-full flex items-end justify-between">
              {/* Scale: 8, 6, 4, 2 */}
              <div className="absolute left-0 top-0 bottom-4 flex flex-col justify-between text-[10px] font-mono text-slate-400">
                <span>8</span>
                <span>6</span>
                <span>4</span>
                <span>2</span>
              </div>

              {/* Bar clusters */}
              <div className="ml-6 w-full h-full flex items-end justify-around pb-2">
                <div className="flex items-end space-x-1">
                  <div className="w-4 bg-blue-600 rounded-t-xs" style={{ height: '36px' }} />
                  <div className="w-4 bg-[#f59e0b] rounded-t-xs" style={{ height: '36px' }} />
                </div>
                <div className="flex items-end space-x-1">
                  <div className="w-4 bg-[#bfdbfe] rounded-t-xs" style={{ height: '64px' }} />
                  <div className="w-4 bg-blue-700 rounded-t-xs" style={{ height: '14px' }} />
                </div>
                <div className="flex items-end space-x-1">
                  <div className="w-4 bg-[#f59e0b] rounded-t-xs" style={{ height: '50px' }} />
                  <div className="w-4 bg-[#93c5fd] rounded-t-xs" style={{ height: '80px' }} />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-emerald-600 font-semibold flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Optimum Velocity
              </span>
              <span className="text-slate-400 font-mono">0.94 PBI/day</span>
            </div>
          </div>
        </div>

        {/* THIRD ROW: SUMMARY NUMBERS & INTERACTIVE "SUNNY SURF" SHOWCASE CARD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* TASK ANALYSIS STATS ROW (8 cols) */}
          <div className="lg:col-span-8 bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
            <div className="w-full bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60 px-3.5 py-1.5 rounded-lg text-xs font-bold">
              Task Analysis Metrics
            </div>

            {/* Exactly the 5 metric blocks from the image: 11, 8, 19, 267%, 3 */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center sm:text-left">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-sans">
                  11
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                  Total Tasks
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-sans">
                  8
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                  Outstanding Tasks
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-sans">
                  19
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                  Average Task Time (days)
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="text-3xl sm:text-4xl font-extrabold text-blue-600 dark:text-blue-400 font-sans">
                  267%
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                  Tasks Assigned Increase YoY
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="text-3xl sm:text-4xl font-extrabold text-[#f59e0b] font-sans">
                  3
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                  Completed Early
                </div>
              </div>
            </div>

            {/* Task Item Explorer */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center justify-between">
                <span>Active Tracked Tasks</span>
                <span className="text-[10px] text-blue-600 dark:text-blue-400">Click to inspect</span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                {taskList.slice(0, 5).map((t) => (
                  <div
                    key={t.id}
                    className="p-3 bg-white dark:bg-slate-900/60 flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <span
                        className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                          t.status === 'Completed'
                            ? 'bg-emerald-500'
                            : t.status === 'Ongoing'
                            ? 'bg-blue-600'
                            : t.status === 'Initiated'
                            ? 'bg-slate-800 dark:bg-blue-300'
                            : 'bg-[#f59e0b]'
                        }`}
                      />
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{t.title}</div>
                        <div className="text-[10px] text-slate-400">{t.category} &bull; Assignee: {t.assignee}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          t.priority === 'High'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : t.priority === 'Medium'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {t.priority}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">{t.dueDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* THE EXACT "SUNNY SURF" FLOATING CARD FROM THE IMAGE (4 cols) */}
          <div className="lg:col-span-4 bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-md relative overflow-hidden">
            {/* Top Badge: "Sunny Surf" */}
            <div className="space-y-1 mb-4">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white font-sans tracking-tight">
                Sunny Surf
              </h2>
              {/* Electric Blue Underline Bar (Exact match) */}
              <div className="w-20 h-1.5 bg-blue-600 rounded-full" />
            </div>

            {/* Inner Dashboard Preview Box */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
              {/* Mini dark pill */}
              <div className="w-16 h-3.5 bg-slate-800 dark:bg-slate-700 rounded-full" />

              <div className="flex items-center justify-between">
                {/* Donut Preview */}
                <div className="relative w-20 h-20">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 40 40">
                    <circle cx="20" cy="20" r="14" fill="transparent" stroke="#f59e0b" strokeWidth="6" strokeDasharray="30 70" />
                    <circle cx="20" cy="20" r="14" fill="transparent" stroke="#1e3a8a" strokeWidth="6" strokeDasharray="25 75" strokeDashoffset="-30" />
                    <circle cx="20" cy="20" r="14" fill="transparent" stroke="#2563eb" strokeWidth="6" strokeDasharray="25 75" strokeDashoffset="-55" />
                    <circle cx="20" cy="20" r="14" fill="transparent" stroke="#fed7aa" strokeWidth="6" strokeDasharray="20 80" strokeDashoffset="-80" />
                  </svg>
                </div>

                {/* 4 horizontal lines */}
                <div className="space-y-1.5 flex-1 ml-4">
                  <div className="w-full h-2 bg-slate-300 dark:bg-slate-700 rounded-full" />
                  <div className="w-4/5 h-2 bg-slate-300 dark:bg-slate-700 rounded-full" />
                  <div className="w-full h-2 bg-slate-300 dark:bg-slate-700 rounded-full" />
                  <div className="w-3/5 h-2 bg-slate-300 dark:bg-slate-700 rounded-full" />
                </div>
              </div>

              {/* Bottom 24% soft tile + blue button */}
              <div className="flex items-center justify-between pt-2">
                <div className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-lg font-black text-slate-900 dark:text-white">24%</span>
                  <div className="w-8 h-1 bg-slate-300 dark:bg-slate-600 rounded-full mx-auto mt-1" />
                </div>

                {/* Electric Blue Pill Action Button (Exact match) */}
                <button
                  onClick={handleExportReport}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center space-x-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Export Report</span>
                </button>
              </div>
            </div>

            {/* Design Spec Details */}
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 space-y-1">
              <div className="font-semibold text-slate-700 dark:text-slate-300">Theme Details:</div>
              <div className="flex items-center space-x-2 text-[10px]">
                <span className="px-1.5 py-0.5 rounded bg-slate-900 text-white">#0F172A</span>
                <span className="px-1.5 py-0.5 rounded bg-[#2563EB] text-white">#2563EB</span>
                <span className="px-1.5 py-0.5 rounded bg-[#F59E0B] text-white">#F59E0B</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300">#F1F5F9</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
