import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { NovelProject, ExportOptions } from '../types';

// Helper to trigger browser download of a blob
function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 1. Export as Microsoft Word DOCX (.docx)
export async function exportToDocx(project: NovelProject): Promise<void> {
  const children: Paragraph[] = [];

  // Title Page
  children.push(
    new Paragraph({
      text: project.title.toUpperCase(),
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { before: 2400, after: 300 },
    }),
    new Paragraph({
      text: project.subtitle ? project.subtitle : '',
      alignment: AlignmentType.CENTER,
      spacing: { after: 1200 },
    }),
    new Paragraph({
      text: `By ${project.authorName || 'Author'}`,
      alignment: AlignmentType.CENTER,
      spacing: { after: 3600 },
    }),
    new Paragraph({
      text: `Genre: ${project.genre} | Word Count: ~${getTotalWordCount(project)} words`,
      alignment: AlignmentType.CENTER,
      spacing: { after: 2000 },
      pageBreakBefore: true,
    })
  );

  // Table of Contents / Outline Note if present
  if (project.logline) {
    children.push(
      new Paragraph({
        text: 'SYNOPSIS',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 },
      }),
      new Paragraph({
        text: project.logline,
        spacing: { after: 400 },
      }),
      new Paragraph({
        text: project.synopsis || '',
        spacing: { after: 800 },
        pageBreakBefore: true,
      })
    );
  }

  // Chapters & Scenes
  project.chapters.forEach((chapter) => {
    children.push(
      new Paragraph({
        text: `CHAPTER ${chapter.number}: ${chapter.title.toUpperCase()}`,
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { before: 1200, after: 600 },
        pageBreakBefore: true,
      })
    );

    if (chapter.summary) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `[Chapter Synopsis: ${chapter.summary}]`,
              italics: true,
              color: '666666',
            }),
          ],
          spacing: { after: 400 },
        })
      );
    }

    chapter.scenes.forEach((scene, sceneIndex) => {
      if (sceneIndex > 0) {
        // Scene divider
        children.push(
          new Paragraph({
            text: '# # #',
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 400 },
          })
        );
      }

      const paragraphs = scene.content.split(/\n\s*\n/);
      paragraphs.forEach((para) => {
        const trimmed = para.trim();
        if (trimmed) {
          children.push(
            new Paragraph({
              text: trimmed,
              indent: { firstLine: 720 }, // 0.5 inch standard manuscript first line indent
              spacing: { line: 360, after: 120 }, // 1.5 line spacing
            })
          );
        }
      });
    });
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const safeTitle = (project.title || 'Novel_Manuscript').replace(/[^a-zA-Z0-9_-]/g, '_');
  triggerDownload(blob, `${safeTitle}_Manuscript.docx`);
}

// 2. Export as Markdown (.md)
export function exportToMarkdown(project: NovelProject): void {
  let md = `# ${project.title}\n`;
  if (project.subtitle) md += `*${project.subtitle}*\n\n`;
  md += `**Author:** ${project.authorName || 'Author'}\n`;
  md += `**Genre:** ${project.genre}\n`;
  md += `**Target Word Count:** ${project.targetTotalWords.toLocaleString()}\n`;
  md += `**Export Date:** ${new Date().toLocaleDateString()}\n\n`;

  if (project.logline) {
    md += `## Logline\n${project.logline}\n\n`;
  }
  if (project.synopsis) {
    md += `## Synopsis\n${project.synopsis}\n\n`;
  }

  // Characters
  if (project.characters.length > 0) {
    md += `## Character Dossier\n\n`;
    project.characters.forEach((char) => {
      md += `### ${char.name} (${char.role})\n`;
      if (char.alias) md += `- **Alias:** ${char.alias}\n`;
      md += `- **Archetype:** ${char.archetype}\n`;
      md += `- **Internal Goal:** ${char.internalGoal}\n`;
      md += `- **Conflict & Flaw:** ${char.flaw}\n`;
      md += `- **Voice & Cadence:** ${char.voiceNotes}\n\n`;
    });
  }

  // Chapters
  md += `---\n\n## Manuscript\n\n`;
  project.chapters.forEach((chapter) => {
    md += `### Chapter ${chapter.number}: ${chapter.title}\n\n`;
    if (chapter.summary) md += `> *${chapter.summary}*\n\n`;

    chapter.scenes.forEach((scene, sIdx) => {
      if (sIdx > 0) md += `\n* * *\n\n`;
      md += `#### ${scene.title}\n\n`;
      md += `${scene.content}\n\n`;
    });
  });

  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const safeTitle = (project.title || 'Novel_Manuscript').replace(/[^a-zA-Z0-9_-]/g, '_');
  triggerDownload(blob, `${safeTitle}_Manuscript.md`);
}

// 3. Export as Plain Text (.txt)
export function exportToPlainText(project: NovelProject): void {
  let txt = `${project.title.toUpperCase()}\n`;
  if (project.subtitle) txt += `${project.subtitle}\n`;
  txt += `By ${project.authorName || 'Author'}\n\n`;
  txt += `=========================================\n\n`;

  project.chapters.forEach((chapter) => {
    txt += `\nCHAPTER ${chapter.number}: ${chapter.title.toUpperCase()}\n\n`;
    chapter.scenes.forEach((scene, sIdx) => {
      if (sIdx > 0) txt += `\n\n# # #\n\n\n`;
      txt += `${scene.content}\n\n`;
    });
  });

  const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
  const safeTitle = (project.title || 'Novel_Manuscript').replace(/[^a-zA-Z0-9_-]/g, '_');
  triggerDownload(blob, `${safeTitle}_Manuscript.txt`);
}

// 4. Export JSON Archive (Encrypted or Raw)
export function exportProjectJson(project: NovelProject, isEncryptedPayload?: string): void {
  const exportData = isEncryptedPayload
    ? { encryptedPayload: isEncryptedPayload, isEncrypted: true, exportedAt: new Date().toISOString() }
    : { ...project, exportedAt: new Date().toISOString() };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json;charset=utf-8' });
  const safeTitle = (project.title || 'Novel_Backup').replace(/[^a-zA-Z0-9_-]/g, '_');
  triggerDownload(blob, `${safeTitle}_Project_Backup.json`);
}

function getTotalWordCount(project: NovelProject): number {
  return project.chapters.reduce(
    (acc, chap) => acc + chap.scenes.reduce((sAcc, s) => sAcc + (s.wordCount || 0), 0),
    0
  );
}

export async function exportProject(project: NovelProject, options: ExportOptions): Promise<void> {
  switch (options.format) {
    case 'docx':
      return await exportToDocx(project);
    case 'markdown':
      return exportToMarkdown(project);
    case 'text':
      return exportToPlainText(project);
    case 'json':
      return exportProjectJson(project);
    default:
      return exportToMarkdown(project);
  }
}
