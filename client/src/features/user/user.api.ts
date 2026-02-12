// No backend user-settings endpoint exists.
// This module is a placeholder for local-only user preferences.

import type { ThemePreference } from './user.types';

export const getThemePreference = (): ThemePreference => {
  const stored = localStorage.getItem('theme');
  return { theme: stored === 'light' ? 'light' : 'dark' };
};

export const setThemePreference = (theme: ThemePreference['theme']): void => {
  localStorage.setItem('theme', theme);
};
