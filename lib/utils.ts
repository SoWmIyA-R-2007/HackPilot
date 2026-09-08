/**
 * Utility helpers for date math, progress calculation, and formatting
 */

/** Calculate days remaining until a deadline */
export function daysUntil(deadline: string | null): number | null {
  if (!deadline) return null;
  const deadlineDate = new Date(deadline);
  const now = new Date();
  const diffMs = deadlineDate.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

/** Format a time remaining string from a deadline */
export function formatTimeRemaining(deadline: string | null): string {
  if (!deadline) return 'No deadline';
  const days = daysUntil(deadline);
  if (days === null) return 'No deadline';
  if (days < 0) return 'OVERDUE';
  if (days === 0) return 'TODAY';
  if (days === 1) return '1 DAY';
  if (days <= 30) return `${days} DAYS`;
  return `${Math.floor(days / 7)} WEEKS`;
}

/** Calculate weighted completion percentage from tasks */
export function calculateProgress(
  tasks: { status: string; weight: number }[]
): number {
  if (tasks.length === 0) return 0;
  const totalWeight = tasks.reduce((sum, t) => sum + t.weight, 0);
  if (totalWeight === 0) return 0;
  const completedWeight = tasks
    .filter((t) => t.status === 'done')
    .reduce((sum, t) => sum + t.weight, 0);
  return Math.round((completedWeight / totalWeight) * 100);
}

/** Generate a hackathon code from an id */
export function generateCode(id: string): string {
  const short = id.slice(0, 4).toUpperCase();
  return `#HCK-${short}`;
}

/** Format a date string for display */
export function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'TBD';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Generate a unique ID */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Clamp a number between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Default avatar URL for users without one */
export const DEFAULT_AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCBP1kmRXbz68p41fmeAr3Xm4duYseWzve-pBxhFwM_Lvg-cBlibeN9kLMug-zDGpD-cqrq_9_L__iPhMtJdSAfOy8ahxz6rw--W-1ufEsOLPx3JZ5nADHQau3X2E_-KtLsRVTNw7YkiI9LgQEkrpz0fKb8YBbgRv09PaLcW_d_5XVP-ywfmznPoGxqEosCYAK4iTaa16nufLe09_J1Oj4JnYzIjlHyYDIhNd0EJZrDrfMbyrwsLybp';

/** Default banner image */
export const DEFAULT_BANNER =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDPPGJJXsBJuPJ2LuAH9k2wG5C9E-VhExttldyjGQv88ucuC3y6VEGsGOOdTE7-pPtbVD-blGVhBCpAz9Skx4DAukDX4jWvNhAp2BTE41JRKYBtq5ypBokqkq9mJo_wS_rxJemFvl3s11zal5ZfLts-lzNgeBC6X5ZZGCeLDot8l7Tw2eR4LcXsGNj3IjLIzXE1k0NrFnIMyj_v_sQmXAmJALVlC7fiCyxyhDV6wJjCVSDfEiIE97eO';
