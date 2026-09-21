import { NovelProject, AuditLogEntry, VersionSnapshot } from '../types';
import { INITIAL_NOVEL } from './initialData';
import { encryptData } from './crypto';

const STORAGE_KEY = 'novelcraft_project_v1';
const PASSPHRASE_KEY = 'novelcraft_e2ee_passphrase';

export function loadProjectFromLocal(): NovelProject {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveProjectToLocal(INITIAL_NOVEL);
      return INITIAL_NOVEL;
    }
    const parsed = JSON.parse(raw);
    return parsed;
  } catch (err) {
    console.error('Failed to load project from localStorage:', err);
    return INITIAL_NOVEL;
  }
}

export function saveProjectToLocal(project: NovelProject): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
  } catch (err) {
    console.error('Failed to save project to localStorage:', err);
  }
}

export const loadProjectFromLocalStorage = loadProjectFromLocal;
export const saveProjectToLocalStorage = saveProjectToLocal;

export function getStoredPassphrase(): string | null {
  return sessionStorage.getItem(PASSPHRASE_KEY);
}

export function setStoredPassphrase(passphrase: string): void {
  sessionStorage.setItem(PASSPHRASE_KEY, passphrase);
}

export function clearStoredPassphrase(): void {
  sessionStorage.removeItem(PASSPHRASE_KEY);
}

export async function syncProjectToCloud(
  project: NovelProject,
  passphrase?: string
): Promise<{ success: boolean; version: number; timestamp: string; message: string }> {
  try {
    let payloadData = JSON.stringify(project);
    let iv = '';

    if (project.isEncrypted && passphrase) {
      const encrypted = await encryptData(payloadData, passphrase);
      payloadData = JSON.stringify(encrypted);
      iv = encrypted.iv;
    }

    const currentVersion = (project.versions.length || 0) + 1;
    const totalWords = project.chapters.reduce(
      (acc, c) => acc + c.scenes.reduce((sa, s) => sa + (s.wordCount || 0), 0),
      0
    );

    const body = {
      projectId: project.id,
      encryptedData: payloadData,
      iv,
      version: currentVersion,
      author: project.authorName || 'Author',
      authorEmail: project.team.find((t) => t.role === 'owner')?.email || '',
      metadata: {
        title: project.title,
        wordCount: totalWords,
        chapterCount: project.chapters.length,
        characterCount: project.characters.length,
      },
      auditLog: project.auditLogs,
    };

    const res = await fetch('/api/cloud/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`Sync failed with status ${res.status}`);
    }

    return await res.json();
  } catch (err: any) {
    console.warn('Cloud sync offline or error:', err);
    throw err;
  }
}

export function createAuditLog(
  action: string,
  details: string,
  user: string = 'Evelyn Vance'
): AuditLogEntry {
  return {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    timestamp: new Date().toISOString(),
    user,
    action,
    details,
  };
}

export function createVersionSnapshot(
  project: NovelProject,
  note: string,
  author: string = 'Evelyn Vance'
): VersionSnapshot {
  const totalWords = project.chapters.reduce(
    (acc, c) => acc + c.scenes.reduce((sa, s) => sa + (s.wordCount || 0), 0),
    0
  );

  return {
    id: `ver-${Date.now()}`,
    versionNumber: (project.versions.length || 0) + 1,
    timestamp: new Date().toISOString(),
    title: `Snapshot v${(project.versions.length || 0) + 1}`,
    author,
    wordCount: totalWords,
    summaryNote: note || 'Manual checkpoint',
    dataJson: JSON.stringify(project),
  };
}
