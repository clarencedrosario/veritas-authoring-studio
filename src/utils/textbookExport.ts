import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
} from 'docx';
import {
  GrammarSeriesProject,
  ClassCurriculumBook,
  GrammarTopic,
  GrammarClassLevel,
  SpiralCurriculumMatrix,
} from '../types';
import { cleanMarkdownSyntax } from './pedagogicalProfileSystem';

export type TextbookExportFormat =
  | 'print_pdf'
  | 'docx'
  | 'html_ebook'
  | 'lms_json'
  | 'matrix_csv'
  | 'markdown'
  | 'worksheet_pdf';

export type TextbookTrimSize = 'crown_quarto' | 'royal_octavo' | 'a4' | 'us_letter';

export interface TextbookExportOptions {
  format: TextbookExportFormat;
  trimSize: TextbookTrimSize;
  edition: 'student' | 'teacher_master';
  includeFrontMatter: boolean;
  includeScopeMatrix: boolean;
  includeAnswerKeys: boolean;
  includeTestSeries: boolean;
  includeRubrics: boolean;
  targetClassLevel: GrammarClassLevel | 'all';
  singleTopicId?: string;
  fontSizePt: number; // e.g. 11
  fontFamily: 'garamond' | 'georgia' | 'merriweather' | 'schoolbook' | 'dyslexic';
}

export const TRIM_SIZE_CONFIGS: Record<
  TextbookTrimSize,
  { name: string; widthMm: number; heightMm: number; inches: string; description: string }
> = {
  crown_quarto: {
    name: 'Crown Quarto (School Textbook Standard)',
    widthMm: 189,
    heightMm: 246,
    inches: '7.44" × 9.69"',
    description: 'Premier standard for K-12 primary and secondary school grammar coursebooks.',
  },
  royal_octavo: {
    name: 'Royal Octavo (Academic & Senior Secondary)',
    widthMm: 156,
    heightMm: 234,
    inches: '6.14" × 9.21"',
    description: 'Compact high-density trim for Class 9–12 senior school grammar and composition.',
  },
  a4: {
    name: 'Standard A4 (Classroom Binder / Workbook)',
    widthMm: 210,
    heightMm: 297,
    inches: '8.27" × 11.69"',
    description: 'Generous format optimized for worksheets, homework assignments, and teacher masters.',
  },
  us_letter: {
    name: 'US Letter (Standard Sheet)',
    widthMm: 216,
    heightMm: 279,
    inches: '8.50" × 11.00"',
    description: 'Standard desktop printer and photocopier specification across North American curricula.',
  },
};

// Helper: trigger browser file download
export function triggerBrowserDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// -------------------------------------------------------------
// 1. DOCX EXPORTER (Microsoft Word .docx for Grammar Textbook)
// -------------------------------------------------------------
export async function exportTextbookToDocx(
  book: ClassCurriculumBook,
  series: GrammarSeriesProject,
  options: TextbookExportOptions
): Promise<void> {
  const children: (Paragraph | Table)[] = [];
  const isTeacher = options.edition === 'teacher_master';

  // Front Matter: Title Page
  if (options.includeFrontMatter) {
    children.push(
      new Paragraph({
        text: series.seriesTitle.toUpperCase(),
        alignment: AlignmentType.CENTER,
        spacing: { before: 2000, after: 300 },
        children: [
          new TextRun({
            text: series.seriesTitle.toUpperCase(),
            bold: true,
            size: 40,
            color: '1e293b',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 600 },
        children: [
          new TextRun({
            text: `${book.title} • ${book.ageBracket}`,
            bold: true,
            size: 28,
            color: 'd97706',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 1400 },
        children: [
          new TextRun({
            text: `Curriculum Alignment: ${series.targetBoard} & National Education Frameworks`,
            italics: true,
            size: 22,
            color: '475569',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: isTeacher ? "TEACHER'S MASTER EDITION" : 'STUDENT COURSEBOOK & WORKBOOK',
            bold: true,
            size: 24,
            color: isTeacher ? 'dc2626' : '0284c7',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 2800 },
        children: [
          new TextRun({
            text: `Author & Editorial Chair: ${series.author || 'Academic Advisory Council'}`,
            size: 20,
            color: '64748b',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 1200 },
        pageBreakBefore: true,
        children: [
          new TextRun({
            text: 'PEDAGOGICAL FOREWORD & SCOPE',
            bold: true,
            size: 28,
            color: '1e293b',
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 400 },
        children: [
          new TextRun({
            text: book.description,
            size: 22,
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 800 },
        children: [
          new TextRun({
            text: `Pedagogical Focus: ${book.pedagogicalFocus}`,
            italics: true,
            size: 20,
            color: '334155',
          }),
        ],
      })
    );

    // Table of Contents
    children.push(
      new Paragraph({
        spacing: { before: 400, after: 300 },
        children: [
          new TextRun({
            text: 'TABLE OF CONTENTS',
            bold: true,
            size: 24,
            color: '1e293b',
          }),
        ],
      })
    );

    book.topics.forEach((topic, idx) => {
      children.push(
        new Paragraph({
          spacing: { after: 160 },
          children: [
            new TextRun({
              text: `Unit ${idx + 1}: ${topic.title} `,
              bold: true,
              size: 20,
            }),
            new TextRun({
              text: `[${topic.category}] ................................................ Page ${10 + idx * 6}`,
              color: '64748b',
              size: 18,
            }),
          ],
        })
      );
    });

    children.push(
      new Paragraph({
        text: '',
        pageBreakBefore: true,
      })
    );
  }

  // Topics / Chapters
  const topicsToExport = options.singleTopicId
    ? book.topics.filter((t) => t.id === options.singleTopicId)
    : book.topics;

  topicsToExport.forEach((topic, topicIdx) => {
    // Unit Heading
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        pageBreakBefore: topicIdx > 0 || options.includeFrontMatter,
        spacing: { before: 400, after: 200 },
        children: [
          new TextRun({
            text: `UNIT ${topicIdx + 1}: ${topic.title.toUpperCase()}`,
            bold: true,
            size: 30,
            color: '1e293b',
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 300 },
        children: [
          new TextRun({
            text: `Strand: ${topic.category} | Level: ${topic.classLevel}`,
            bold: true,
            size: 18,
            color: 'd97706',
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 400 },
        children: [
          new TextRun({
            text: topic.overview,
            size: 22,
          }),
        ],
      })
    );

    // Learning Objectives Callout Table
    if (topic.learningObjectives && topic.learningObjectives.length > 0) {
      children.push(
        new Paragraph({
          spacing: { before: 200, after: 120 },
          children: [
            new TextRun({
              text: 'Learning Objectives & Competencies:',
              bold: true,
              size: 20,
              color: '0369a1',
            }),
          ],
        })
      );
      topic.learningObjectives.forEach((obj) => {
        children.push(
          new Paragraph({
            indent: { left: 360 },
            spacing: { after: 80 },
            children: [
              new TextRun({ text: '✓  ', bold: true, color: '0284c7' }),
              new TextRun({ text: obj, size: 20 }),
            ],
          })
        );
      });
    }

    // Definitions & Form Rules
    if (topic.definitions && topic.definitions.length > 0) {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 },
          children: [
            new TextRun({
              text: 'Core Definitions & Grammatical Rules',
              bold: true,
              size: 24,
              color: '1e293b',
            }),
          ],
        })
      );

      topic.definitions.forEach((def) => {
        children.push(
          new Paragraph({
            spacing: { before: 200, after: 100 },
            children: [
              new TextRun({
                text: `• Definition: ${def.term}`,
                bold: true,
                size: 22,
                color: 'b45309',
              }),
            ],
          }),
          new Paragraph({
            indent: { left: 240 },
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: def.ageAppropriateExplanation,
                size: 20,
              }),
            ],
          })
        );

        if (def.formulaOrSyntax) {
          children.push(
            new Paragraph({
              indent: { left: 360 },
              spacing: { after: 150 },
              children: [
                new TextRun({ text: 'Syntax / Formula: ', bold: true, size: 19 }),
                new TextRun({
                  text: def.formulaOrSyntax,
                  bold: true,
                  color: '0f766e',
                  size: 20,
                }),
              ],
            })
          );
        }

        if (def.rules && def.rules.length > 0) {
          def.rules.forEach((rule, rIdx) => {
            children.push(
              new Paragraph({
                indent: { left: 480 },
                spacing: { after: 80 },
                children: [
                  new TextRun({ text: `Rule ${rIdx + 1}: `, bold: true, size: 19 }),
                  new TextRun({ text: rule, size: 19 }),
                ],
              })
            );
          });
        }

        if (def.examples && def.examples.length > 0) {
          children.push(
            new Paragraph({
              indent: { left: 360 },
              spacing: { before: 100, after: 60 },
              children: [
                new TextRun({ text: 'Model Sentences:', bold: true, italics: true, size: 19 }),
              ],
            })
          );
          def.examples.forEach((ex) => {
            children.push(
              new Paragraph({
                indent: { left: 480 },
                spacing: { after: 60 },
                children: [
                  new TextRun({ text: `— "${ex.sentence}" `, italics: true, size: 19 }),
                  ex.note
                    ? new TextRun({ text: `(${ex.note})`, color: '64748b', size: 17 })
                    : new TextRun(''),
                ],
              })
            );
          });
        }
      });
    }

    // Theory & Notes
    if (topic.notesAndTheoryMarkdown) {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 },
          children: [
            new TextRun({
              text: 'Pedagogical Notes & Usage Guidelines',
              bold: true,
              size: 24,
            }),
          ],
        })
      );
      const paras = topic.notesAndTheoryMarkdown.split('\n\n');
      paras.forEach((p) => {
        if (p.trim()) {
          children.push(
            new Paragraph({
              spacing: { after: 180 },
              children: [new TextRun({ text: cleanMarkdownSyntax(p.trim()), size: 20 })],
            })
          );
        }
      });
    }

    // Graded Practice Exercises
    if (topic.exercises && topic.exercises.length > 0) {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 500, after: 200 },
          children: [
            new TextRun({
              text: 'Graded Classroom Exercises',
              bold: true,
              size: 24,
              color: '1e293b',
            }),
          ],
        })
      );

      topic.exercises.forEach((ex, exIdx) => {
        children.push(
          new Paragraph({
            spacing: { before: 300, after: 100 },
            children: [
              new TextRun({
                text: `Exercise ${exIdx + 1}: ${ex.title} `,
                bold: true,
                size: 21,
                color: '0369a1',
              }),
              new TextRun({
                text: `[Max Marks: ${ex.maxMarks || ex.questions.length}]`,
                bold: true,
                size: 18,
                color: '0284c7',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: `Instructions: ${ex.instructions}`,
                italics: true,
                size: 19,
                color: '475569',
              }),
            ],
          })
        );

        ex.questions.forEach((q, qIdx) => {
          children.push(
            new Paragraph({
              indent: { left: 240 },
              spacing: { before: 120, after: 80 },
              children: [
                new TextRun({ text: `Q${qIdx + 1}. `, bold: true, size: 20 }),
                new TextRun({ text: q.prompt, size: 20 }),
                new TextRun({
                  text: `  [${q.marks || 1} mark]`,
                  bold: true,
                  size: 16,
                  color: '64748b',
                }),
              ],
            })
          );

          if (q.options && q.options.length > 0) {
            const optRuns: TextRun[] = [];
            q.options.forEach((opt, oIdx) => {
              const letter = String.fromCharCode(65 + oIdx);
              optRuns.push(
                new TextRun({
                  text: `(${letter}) ${opt}      `,
                  size: 19,
                })
              );
            });
            children.push(
              new Paragraph({
                indent: { left: 480 },
                spacing: { after: 100 },
                children: optRuns,
              })
            );
          }

          // In Teacher Edition, render answer inline with distinction
          if (isTeacher && q.correctAnswer) {
            children.push(
              new Paragraph({
                indent: { left: 480 },
                spacing: { after: 120 },
                children: [
                  new TextRun({
                    text: `[Answer Key]: ${q.correctAnswer} `,
                    bold: true,
                    color: '15803d',
                    size: 18,
                  }),
                  q.explanation
                    ? new TextRun({
                        text: `(Note: ${q.explanation})`,
                        italics: true,
                        color: '166534',
                        size: 17,
                      })
                    : new TextRun(''),
                ],
              })
            );
          } else if (!isTeacher) {
            // Student Edition blank answer line
            children.push(
              new Paragraph({
                indent: { left: 480 },
                spacing: { after: 120 },
                children: [
                  new TextRun({
                    text: 'Answer: ____________________________________________________',
                    color: 'cbd5e1',
                    size: 18,
                  }),
                ],
              })
            );
          }
        });
      });
    }

    // Summative Test Series
    if (options.includeTestSeries && topic.testSeries && topic.testSeries.length > 0) {
      topic.testSeries.forEach((test) => {
        children.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            pageBreakBefore: true,
            spacing: { before: 400, after: 150 },
            children: [
              new TextRun({
                text: test.title.toUpperCase(),
                bold: true,
                size: 26,
                color: 'dc2626',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: `Time: ${test.durationMinutes} Minutes | Max Marks: ${test.totalMarks}`,
                bold: true,
                size: 19,
                color: '475569',
              }),
            ],
          })
        );

        test.sections.forEach((sec, sIdx) => {
          children.push(
            new Paragraph({
              spacing: { before: 200, after: 100 },
              children: [
                new TextRun({
                  text: `Section ${String.fromCharCode(65 + sIdx)}: ${sec.title}`,
                  bold: true,
                  size: 21,
                  color: '1e293b',
                }),
              ],
            }),
            new Paragraph({
              spacing: { after: 150 },
              children: [
                new TextRun({
                  text: sec.description,
                  italics: true,
                  size: 18,
                  color: '64748b',
                }),
              ],
            })
          );

          sec.questions.forEach((q, qIdx) => {
            children.push(
              new Paragraph({
                indent: { left: 240 },
                spacing: { after: 80 },
                children: [
                  new TextRun({ text: `${qIdx + 1}. `, bold: true, size: 20 }),
                  new TextRun({ text: q.prompt, size: 20 }),
                  new TextRun({
                    text: ` [${q.marks || 1} mark]`,
                    bold: true,
                    size: 16,
                    color: '64748b',
                  }),
                ],
              })
            );

            if (isTeacher && q.correctAnswer) {
              children.push(
                new Paragraph({
                  indent: { left: 480 },
                  spacing: { after: 100 },
                  children: [
                    new TextRun({
                      text: `[Answer]: ${q.correctAnswer}`,
                      bold: true,
                      color: '15803d',
                      size: 18,
                    }),
                  ],
                })
              );
            }
          });
        });
      });
    }
  });

  // Back Matter: Comprehensive Answer Key Appendix
  if (options.includeAnswerKeys && !isTeacher) {
    children.push(
      new Paragraph({
        pageBreakBefore: true,
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 600, after: 300 },
        children: [
          new TextRun({
            text: 'APPENDIX: COMPREHENSIVE ANSWER KEY',
            bold: true,
            size: 28,
            color: '1e293b',
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 400 },
        children: [
          new TextRun({
            text: 'Self-check solution matrix for student independent practice and home study.',
            italics: true,
            size: 20,
            color: '64748b',
          }),
        ],
      })
    );

    topicsToExport.forEach((topic, tIdx) => {
      children.push(
        new Paragraph({
          spacing: { before: 200, after: 100 },
          children: [
            new TextRun({
              text: `Unit ${tIdx + 1}: ${topic.title}`,
              bold: true,
              size: 22,
              color: 'd97706',
            }),
          ],
        })
      );

      topic.exercises.forEach((ex, exIdx) => {
        children.push(
          new Paragraph({
            indent: { left: 200 },
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: `Exercise ${exIdx + 1}: `,
                bold: true,
                size: 19,
              }),
              ...ex.questions.map((q, qIdx) =>
                new TextRun({
                  text: `Q${qIdx + 1}: ${q.correctAnswer || 'Answer provided in text'}; `,
                  size: 18,
                })
              ),
            ],
          })
        );
      });
    });
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const safeTitle = (book.title || 'Grammar_Textbook').replace(/[^a-zA-Z0-9_-]/g, '_');
  const editionTag = isTeacher ? 'Teachers_Master' : 'Student_Edition';
  triggerBrowserDownload(blob, `${safeTitle}_${editionTag}.docx`);
}

// -------------------------------------------------------------
// 2. STANDALONE HTML5 eBOOK & PRINT-READY DOCUMENT EXPORTER
// -------------------------------------------------------------
export function generateTextbookHtml(
  book: ClassCurriculumBook,
  series: GrammarSeriesProject,
  options: TextbookExportOptions
): string {
  const isTeacher = options.edition === 'teacher_master';
  const trim = TRIM_SIZE_CONFIGS[options.trimSize];
  const topicsToExport = options.singleTopicId
    ? book.topics.filter((t) => t.id === options.singleTopicId)
    : book.topics;

  const fontClass =
    options.fontFamily === 'garamond'
      ? 'font-serif'
      : options.fontFamily === 'georgia'
      ? 'font-serif'
      : options.fontFamily === 'schoolbook'
      ? 'font-serif'
      : options.fontFamily === 'dyslexic'
      ? 'font-sans'
      : 'font-serif';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${book.title} - ${isTeacher ? "Teacher's Master Edition" : 'Student Edition'}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@400;500;600;700&display=swap');

    :root {
      --primary: #d97706;
      --primary-dark: #b45309;
      --text: #1e293b;
      --text-muted: #64748b;
      --bg: #ffffff;
      --border: #e2e8f0;
      --card-bg: #f8fafc;
      --correct: #15803d;
    }

    @page {
      size: ${trim.widthMm}mm ${trim.heightMm}mm;
      margin: 18mm 16mm 18mm 20mm;
      @bottom-right {
        content: counter(page);
        font-family: 'Inter', sans-serif;
        font-size: 9pt;
        color: #64748b;
      }
      @top-center {
        content: "${book.title} • ${series.targetBoard}";
        font-family: 'Inter', sans-serif;
        font-size: 8pt;
        color: #94a3b8;
        border-bottom: 0.5pt solid #cbd5e1;
        padding-bottom: 4mm;
      }
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 0;
      font-family: 'Crimson Pro', Georgia, serif;
      font-size: ${options.fontSizePt}pt;
      line-height: 1.55;
      color: var(--text);
      background: #f1f5f9;
    }

    .book-container {
      max-width: 900px;
      margin: 0 auto;
      background: #ffffff;
      box-shadow: 0 10px 35px rgba(0,0,0,0.1);
      padding: 3rem 3.5rem;
    }

    @media print {
      body {
        background: transparent;
      }
      .book-container {
        box-shadow: none;
        padding: 0;
        max-width: none;
      }
      .no-print {
        display: none !important;
      }
      .page-break {
        page-break-before: always;
        break-before: page;
      }
      .avoid-break {
        page-break-inside: avoid;
        break-inside: avoid;
      }
    }

    /* Typography */
    h1, h2, h3, h4 {
      font-family: 'Inter', sans-serif;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.25;
    }

    .unit-title {
      font-size: 1.85rem;
      border-bottom: 2px solid var(--primary);
      padding-bottom: 0.4rem;
      margin-top: 1.5rem;
      margin-bottom: 0.5rem;
    }

    .strand-badge {
      display: inline-block;
      font-family: 'Inter', sans-serif;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      background: #fef3c7;
      color: #92400e;
      padding: 0.2rem 0.6rem;
      border-radius: 9999px;
      margin-bottom: 0.5rem;
    }

    /* Callout Anchor Charts */
    .anchor-chart {
      background: #f0fdf4;
      border-left: 4px solid #16a34a;
      padding: 1rem 1.25rem;
      border-radius: 0 8px 8px 0;
      margin: 1.25rem 0;
    }

    .rule-box {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 8px;
      padding: 1rem 1.25rem;
      margin: 1rem 0;
    }

    .caution-box {
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-radius: 8px;
      padding: 0.85rem 1.15rem;
      margin: 1rem 0;
    }

    /* Exercises */
    .exercise-section {
      background: #fafafa;
      border: 1px solid #e5e5e5;
      border-radius: 8px;
      padding: 1.25rem 1.5rem;
      margin: 1.5rem 0;
    }

    .question-item {
      margin-bottom: 0.85rem;
    }

    .question-prompt {
      font-weight: 600;
    }

    .options-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 0.5rem;
      margin-top: 0.35rem;
      margin-left: 1.5rem;
    }

    .teacher-answer {
      background: #dcfce7;
      color: #14532d;
      font-family: 'Inter', sans-serif;
      font-size: 0.85rem;
      font-weight: 600;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      display: inline-block;
      margin-top: 0.25rem;
    }

    .blank-line {
      display: block;
      border-bottom: 1px dotted #94a3b8;
      height: 1.2rem;
      margin: 0.35rem 0;
    }

    /* Cover Page */
    .cover-page {
      min-height: 80vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      border: 3px double #d97706;
      padding: 3rem 2rem;
      margin-bottom: 3rem;
      background: linear-gradient(180deg, #fffbeb 0%, #ffffff 100%);
    }

    .print-controls {
      position: sticky;
      top: 1rem;
      z-index: 100;
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .btn-action {
      background: #d97706;
      color: white;
      border: none;
      padding: 0.6rem 1.2rem;
      font-family: 'Inter', sans-serif;
      font-size: 0.875rem;
      font-weight: 600;
      border-radius: 6px;
      cursor: pointer;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
    }
    .btn-action:hover {
      background: #b45309;
    }
  </style>
</head>
<body class="${fontClass}">

  <div class="book-container">
    <!-- Screen Print Toolbar -->
    <div class="print-controls no-print">
      <button class="btn-action" onclick="window.print()">🖨️ Print / Save as PDF</button>
      <button class="btn-action" style="background: #0284c7;" onclick="window.close()">✕ Close View</button>
    </div>

    <!-- FRONT MATTER -->
    ${
      options.includeFrontMatter
        ? `
    <div class="cover-page page-break">
      <p style="font-family: 'Inter', sans-serif; font-size: 0.9rem; letter-spacing: 0.2em; text-transform: uppercase; color: #78350f; font-weight: 700;">
        ${series.seriesTitle}
      </p>
      <h1 style="font-size: 2.8rem; margin: 0.8rem 0; color: #1e293b;">
        ${book.title}
      </h1>
      <p style="font-family: 'Inter', sans-serif; font-size: 1.15rem; color: #d97706; font-weight: 600; margin-bottom: 1.5rem;">
        ${book.ageBracket} • ${series.targetBoard}
      </p>
      <div style="display: inline-block; padding: 0.4rem 1.2rem; border-radius: 9999px; font-family: 'Inter', sans-serif; font-weight: 700; font-size: 0.85rem; letter-spacing: 0.05em; text-transform: uppercase; background: ${
        isTeacher ? '#fee2e2; color: #b91c1c;' : '#e0f2fe; color: #0369a1;'
      }">
        ${isTeacher ? "TEACHER'S MASTER EDITION WITH SOLUTION KEYS" : 'STUDENT COURSEBOOK & WORKBOOK'}
      </div>
      <div style="margin-top: 4rem; font-family: 'Inter', sans-serif; font-size: 0.95rem; color: #475569;">
        <p><strong>Senior Author & Curriculum Lead:</strong> ${series.author || 'Academic Advisory Board'}</p>
        <p><strong>Published By:</strong> Academic Textbook Guild & NovelCraft Education Press</p>
      </div>
    </div>

    <div class="page-break" style="padding: 2rem 0;">
      <h2 style="font-size: 1.6rem; border-bottom: 2px solid #cbd5e1; padding-bottom: 0.4rem;">Table of Contents</h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 1.5rem; font-family: 'Inter', sans-serif; font-size: 0.95rem;">
        <thead>
          <tr style="border-bottom: 1.5px solid #94a3b8; text-align: left;">
            <th style="padding: 0.5rem 0;">Unit &amp; Topic</th>
            <th style="padding: 0.5rem 0;">Strand</th>
            <th style="padding: 0.5rem 0; text-align: right;">Target Page</th>
          </tr>
        </thead>
        <tbody>
          ${book.topics
            .map(
              (t, i) => `
            <tr style="border-bottom: 1px dotted #e2e8f0;">
              <td style="padding: 0.6rem 0; font-weight: 600;">Unit ${i + 1}: ${t.title}</td>
              <td style="padding: 0.6rem 0; color: #64748b;">${t.category}</td>
              <td style="padding: 0.6rem 0; text-align: right; color: #94a3b8;">${10 + i * 8}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    </div>
    `
        : ''
    }

    <!-- CHAPTERS & TOPICS -->
    ${topicsToExport
      .map(
        (topic, tIdx) => `
      <div class="page-break" style="margin-top: 2rem;">
        <span class="strand-badge">${topic.category}</span>
        <h2 class="unit-title">Unit ${tIdx + 1}: ${topic.title}</h2>
        <p style="font-size: 1.15rem; color: #334155; margin-bottom: 1.25rem;">${topic.overview}</p>

        <!-- Learning Outcomes -->
        <div class="anchor-chart avoid-break">
          <strong style="font-family: 'Inter', sans-serif; color: #166534; display: block; margin-bottom: 0.4rem;">
            🎯 Learning Competencies &amp; Outcomes:
          </strong>
          <ul style="margin: 0; padding-left: 1.25rem; font-size: 0.95rem;">
            ${topic.learningObjectives.map((obj) => `<li>${obj}</li>`).join('')}
          </ul>
        </div>

        <!-- Rules & Definitions -->
        ${topic.definitions
          .map(
            (def) => `
          <div class="rule-box avoid-break">
            <h3 style="font-size: 1.2rem; margin: 0 0 0.4rem 0; color: #1e3a8a;">
              Definition: ${def.term}
            </h3>
            <p style="margin: 0 0 0.5rem 0;">${def.ageAppropriateExplanation}</p>
            ${
              def.formulaOrSyntax
                ? `
              <div style="background: #ffffff; border: 1px dashed #93c5fd; padding: 0.5rem 0.75rem; border-radius: 4px; font-family: monospace; font-weight: 700; color: #0369a1; margin: 0.5rem 0;">
                Formula: ${def.formulaOrSyntax}
              </div>
            `
                : ''
            }
            <div style="margin-top: 0.5rem;">
              <strong style="font-size: 0.9rem; color: #475569; font-family: 'Inter', sans-serif;">Rules to Remember:</strong>
              <ul style="margin: 0.25rem 0; padding-left: 1.2rem; font-size: 0.95rem;">
                ${def.rules.map((r) => `<li>${r}</li>`).join('')}
              </ul>
            </div>
            ${
              def.examples && def.examples.length > 0
                ? `
              <div style="margin-top: 0.5rem;">
                <strong style="font-size: 0.9rem; color: #475569; font-family: 'Inter', sans-serif;">Model Examples:</strong>
                <ul style="margin: 0.25rem 0; padding-left: 1.2rem; font-style: italic;">
                  ${def.examples
                    .map(
                      (ex) =>
                        `<li>"${ex.sentence}" ${ex.note ? `<span style="color:#64748b; font-style: normal; font-size: 0.85rem;">(${ex.note})</span>` : ''}</li>`
                    )
                    .join('')}
                </ul>
              </div>
            `
                : ''
            }
          </div>
        `
          )
          .join('')}

        <!-- Graded Exercises -->
        ${topic.exercises
          .map(
            (ex, exIdx) => `
          <div class="exercise-section avoid-break">
            <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.4rem; margin-bottom: 0.75rem;">
              <h3 style="font-size: 1.15rem; margin: 0; color: #0f172a;">
                Exercise ${exIdx + 1}: ${ex.title}
              </h3>
              <span style="font-family: 'Inter', sans-serif; font-size: 0.85rem; font-weight: 700; color: #0284c7;">
                [Max Marks: ${ex.maxMarks || ex.questions.length}]
              </span>
            </div>
            <p style="font-style: italic; color: #475569; margin: 0 0 1rem 0; font-size: 0.95rem;">
              Instructions: ${ex.instructions}
            </p>

            ${ex.questions
              .map(
                (q, qIdx) => `
              <div class="question-item">
                <div class="question-prompt">
                  ${qIdx + 1}. ${q.prompt}
                  <span style="font-size: 0.8rem; font-weight: normal; color: #94a3b8;">[${q.marks || 1}M]</span>
                </div>
                ${
                  q.options && q.options.length > 0
                    ? `
                  <div class="options-grid">
                    ${q.options.map((opt, oIdx) => `<div>(${String.fromCharCode(65 + oIdx)}) ${opt}</div>`).join('')}
                  </div>
                `
                    : ''
                }
                ${
                  isTeacher && q.correctAnswer
                    ? `
                  <div class="teacher-answer">
                    ✓ Key: ${q.correctAnswer} ${q.explanation ? `• ${q.explanation}` : ''}
                  </div>
                `
                    : `<span class="blank-line"></span>`
                }
              </div>
            `
              )
              .join('')}
          </div>
        `
          )
          .join('')}
      </div>
    `
      )
      .join('')}

    <!-- BACK MATTER: ANSWER KEY -->
    ${
      options.includeAnswerKeys && !isTeacher
        ? `
      <div class="page-break" style="margin-top: 3rem;">
        <h2 style="font-size: 1.8rem; border-bottom: 2px solid #cbd5e1; padding-bottom: 0.4rem;">
          Appendix: Full Solutions &amp; Answer Key
        </h2>
        <p style="color: #64748b; font-style: italic; margin-bottom: 1.5rem;">
          Cross-referenced solutions for all textbook unit exercises.
        </p>

        ${topicsToExport
          .map(
            (topic, tIdx) => `
          <div class="avoid-break" style="margin-bottom: 1.5rem; background: #fafafa; border: 1px solid #e5e5e5; border-radius: 6px; padding: 1rem;">
            <h4 style="margin: 0 0 0.5rem 0; color: #d97706;">Unit ${tIdx + 1}: ${topic.title}</h4>
            ${topic.exercises
              .map(
                (ex, exIdx) => `
              <div style="margin-bottom: 0.5rem; font-size: 0.95rem;">
                <strong>Ex ${exIdx + 1}:</strong>
                ${ex.questions.map((q, qIdx) => `Q${qIdx + 1}: <em>${q.correctAnswer || 'Answer in text'}</em>; `).join('')}
              </div>
            `
              )
              .join('')}
          </div>
        `
          )
          .join('')}
      </div>
    `
        : ''
    }
  </div>

</body>
</html>`;
}

// -------------------------------------------------------------
// 3. LMS QUESTION BANK EXPORTER (Structured JSON)
// -------------------------------------------------------------
export function exportTextbookToLmsJson(
  book: ClassCurriculumBook,
  series: GrammarSeriesProject
): void {
  const lmsPayload = {
    schema: 'NovelCraft-LMS-QTI-2.1',
    seriesTitle: series.seriesTitle,
    targetBoard: series.targetBoard,
    bookTitle: book.title,
    classLevel: book.classLevel,
    ageBracket: book.ageBracket,
    exportedAt: new Date().toISOString(),
    totalTopics: book.topics.length,
    topics: book.topics.map((t) => ({
      id: t.id,
      title: t.title,
      strand: t.category,
      learningObjectives: t.learningObjectives,
      exercises: t.exercises.map((ex) => ({
        id: ex.id,
        title: ex.title,
        instructions: ex.instructions,
        maxMarks: ex.maxMarks,
        questions: ex.questions.map((q) => ({
          id: q.id,
          prompt: q.prompt,
          type: q.type,
          marks: q.marks,
          options: q.options || [],
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
        })),
      })),
      testSeries: t.testSeries.map((test) => ({
        id: test.id,
        title: test.title,
        durationMinutes: test.durationMinutes,
        totalMarks: test.totalMarks,
        sections: test.sections.map((s) => ({
          id: s.id,
          title: s.title,
          description: s.description,
          questions: s.questions,
        })),
      })),
    })),
  };

  const blob = new Blob([JSON.stringify(lmsPayload, null, 2)], {
    type: 'application/json;charset=utf-8',
  });
  const safeTitle = (book.title || 'Grammar_LMS').replace(/[^a-zA-Z0-9_-]/g, '_');
  triggerBrowserDownload(blob, `${safeTitle}_LMS_Question_Bank.json`);
}

// -------------------------------------------------------------
// 4. SPIRAL SCOPE & SEQUENCE MATRIX CSV EXPORTER
// -------------------------------------------------------------
export function exportScopeSequenceToCsv(
  matrix: SpiralCurriculumMatrix,
  seriesTitle: string
): void {
  const classes: GrammarClassLevel[] = [
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

  const headers = ['Strand', 'Curriculum Topic', 'Description', ...classes];

  const rows = matrix.topics.map((topic) => {
    const row = [
      `"${topic.strand.replace(/"/g, '""')}"`,
      `"${topic.title.replace(/"/g, '""')}"`,
      `"${topic.description.replace(/"/g, '""')}"`,
    ];
    classes.forEach((cls) => {
      const cell = topic.progression[cls];
      const stage = cell ? cell.stage : 'none';
      const notes = cell && cell.subtopicsOrNotes ? ` (${cell.subtopicsOrNotes})` : '';
      row.push(`"${stage}${notes.replace(/"/g, '""')}"`);
    });
    return row.join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  const safeTitle = (seriesTitle || 'Spiral_Scope_Sequence').replace(/[^a-zA-Z0-9_-]/g, '_');
  triggerBrowserDownload(blob, `${safeTitle}_Curriculum_Matrix.csv`);
}

// -------------------------------------------------------------
// 5. MARKDOWN REPOSITORY EXPORTER (.md)
// -------------------------------------------------------------
export function exportTextbookToMarkdown(
  book: ClassCurriculumBook,
  series: GrammarSeriesProject,
  options: TextbookExportOptions
): void {
  let md = `---
title: "${book.title}"
series: "${series.seriesTitle}"
targetBoard: "${series.targetBoard}"
classLevel: "${book.classLevel}"
ageBracket: "${book.ageBracket}"
edition: "${options.edition}"
exportedDate: "${new Date().toISOString()}"
---

# ${book.title}
*Curriculum Standard: ${series.targetBoard} | ${book.ageBracket}*
**Author / Academic Committee:** ${series.author || 'Academic Advisory Council'}

## Pedagogical Overview
${book.description}

**Core Pedagogical Focus:** ${book.pedagogicalFocus}

---

## Table of Contents
${book.topics.map((t, idx) => `${idx + 1}. **${t.title}** (${t.category})`).join('\n')}

---

`;

  const topicsToExport = options.singleTopicId
    ? book.topics.filter((t) => t.id === options.singleTopicId)
    : book.topics;

  topicsToExport.forEach((topic, idx) => {
    md += `\n# Unit ${idx + 1}: ${topic.title}\n`;
    md += `**Strand:** ${topic.category} | **Class Level:** ${topic.classLevel}\n\n`;
    md += `${topic.overview}\n\n`;

    if (topic.learningObjectives.length > 0) {
      md += `### Learning Competencies & Objectives\n`;
      topic.learningObjectives.forEach((obj) => {
        md += `- [x] ${obj}\n`;
      });
      md += `\n`;
    }

    if (topic.definitions.length > 0) {
      md += `### Form & Grammatical Rules\n\n`;
      topic.definitions.forEach((def) => {
        md += `#### Definition: ${def.term}\n`;
        md += `> ${def.ageAppropriateExplanation}\n\n`;
        if (def.formulaOrSyntax) {
          md += `\`Formula: ${def.formulaOrSyntax}\`\n\n`;
        }
        if (def.rules.length > 0) {
          md += `**Rules:**\n`;
          def.rules.forEach((r, rIdx) => {
            md += `${rIdx + 1}. ${r}\n`;
          });
          md += `\n`;
        }
        if (def.examples && def.examples.length > 0) {
          md += `**Examples:**\n`;
          def.examples.forEach((ex) => {
            md += `- *"${ex.sentence}"* ${ex.note ? `— ${ex.note}` : ''}\n`;
          });
          md += `\n`;
        }
      });
    }

    if (topic.exercises.length > 0) {
      md += `### Practice Exercises\n\n`;
      topic.exercises.forEach((ex, exIdx) => {
        md += `#### Exercise ${exIdx + 1}: ${ex.title} [${ex.maxMarks || ex.questions.length} Marks]\n`;
        md += `*Instructions: ${ex.instructions}*\n\n`;
        ex.questions.forEach((q, qIdx) => {
          md += `${qIdx + 1}. ${q.prompt} *[${q.marks || 1} mark]*\n`;
          if (q.options && q.options.length > 0) {
            md += `   ${q.options.map((opt, oIdx) => `(${String.fromCharCode(65 + oIdx)}) ${opt}`).join('  ')}\n`;
          }
          if (options.edition === 'teacher_master' && q.correctAnswer) {
            md += `   **Answer Key:** ${q.correctAnswer} ${q.explanation ? `(${q.explanation})` : ''}\n`;
          }
          md += `\n`;
        });
      });
    }
  });

  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const safeTitle = (book.title || 'Grammar_Textbook').replace(/[^a-zA-Z0-9_-]/g, '_');
  triggerBrowserDownload(blob, `${safeTitle}_Textbook_Source.md`);
}
