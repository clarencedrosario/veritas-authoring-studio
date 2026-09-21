import {
  ClarityAuditRequest,
  ClarityAuditResult,
  AccuracyAuditRequest,
  AccuracyAuditResult,
} from '../types';

/**
 * Initiates an editorial clarity audit for assessment and question text.
 * Calls server-side route POST /api/ai/audit-clarity powered by gemini-3.8-flash.
 */
export async function auditQuestionClarity(
  request: ClarityAuditRequest
): Promise<ClarityAuditResult> {
  if (!request.questionText || !request.questionText.trim()) {
    throw new Error('Question text is required to audit clarity.');
  }

  const response = await fetch('/api/ai/audit-clarity', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    let errorMessage = `Clarity audit failed (${response.status}: ${response.statusText})`;
    try {
      const errorJson = await response.json();
      if (errorJson?.error) {
        errorMessage = errorJson.error;
      }
    } catch {
      // Keep default error message if JSON parsing fails
    }
    throw new Error(errorMessage);
  }

  const data: ClarityAuditResult = await response.json();
  return data;
}

/**
 * Initiates an editorial accuracy and answer key audit for assessment items.
 * Calls server-side route POST /api/ai/audit-accuracy powered by gemini-3.8-flash.
 */
export async function auditQuestionAccuracy(
  request: AccuracyAuditRequest
): Promise<AccuracyAuditResult> {
  if (!request.questionText || !request.questionText.trim()) {
    throw new Error('Question text is required to audit accuracy and answer key.');
  }

  const response = await fetch('/api/ai/audit-accuracy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    let errorMessage = `Accuracy audit failed (${response.status}: ${response.statusText})`;
    try {
      const errorJson = await response.json();
      if (errorJson?.error) {
        errorMessage = errorJson.error;
      }
    } catch {
      // Keep default error message if JSON parsing fails
    }
    throw new Error(errorMessage);
  }

  const data: AccuracyAuditResult = await response.json();
  return data;
}
