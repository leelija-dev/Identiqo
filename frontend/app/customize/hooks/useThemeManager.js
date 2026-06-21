// app/customize/hooks/useThemeManager.js
'use client';

import { useState, useCallback } from 'react';

// Predefined themes
const THEMES = {
  Default: { primary: '#ff7e5f', secondary: '#6a11cb', accent: '#2575fc' },
  Sunset: { primary: '#ff6b35', secondary: '#f7931e', accent: '#ff2d55' },
  Ocean: { primary: '#0077b6', secondary: '#00b4d8', accent: '#90e0ef' },
  Forest: { primary: '#2d6a4f', secondary: '#52b788', accent: '#95d5b2' },
  Midnight: { primary: '#6c63ff', secondary: '#3f37c9', accent: '#4895ef' },
  RoseGold: { primary: '#e8a87c', secondary: '#d45d79', accent: '#f0c0a0' },
};

// Deep freeze themes to prevent accidental mutations
Object.values(THEMES).forEach(Object.freeze);
Object.freeze(THEMES);

// Helper: validate hex color (3 or 6 digits)
const isValidColor = (color) =>
  typeof color === 'string' && /^#([0-9A-F]{3}){1,2}$/i.test(color);

export function useThemeManager() {
  // State
  const [selectedTheme, setSelectedTheme] = useState('Default');
  const [customPrimary, setCustomPrimary] = useState('#ff7e5f');
  const [customSecondary, setCustomSecondary] = useState('#6a11cb');
  const [customAccent, setCustomAccent] = useState('#2575fc');
  const [customCardBg, setCustomCardBg] = useState('#ffffff');

  // Apply theme colors to CSS variables
  const applyThemeColors = useCallback((primary, secondary, accent, cardBg, previewCanvasRef, triggerUpdate) => {
    if (previewCanvasRef?.current) {
      previewCanvasRef.current.style.setProperty('--primary', primary);
      previewCanvasRef.current.style.setProperty('--secondary', secondary);
      previewCanvasRef.current.style.setProperty('--accent', accent);
      previewCanvasRef.current.style.setProperty('--card-bg', cardBg || '#ffffff');
    }
    // Always call triggerUpdate if provided (even if canvas is missing)
    triggerUpdate?.();
  }, []);

  // Apply a predefined theme by name
  const applyTheme = useCallback((themeName, previewCanvasRef, triggerUpdate) => {
    const theme = THEMES[themeName];
    if (theme) {
      setSelectedTheme(themeName);
      setCustomPrimary(theme.primary);
      setCustomSecondary(theme.secondary);
      setCustomAccent(theme.accent);
      applyThemeColors(theme.primary, theme.secondary, theme.accent, customCardBg, previewCanvasRef, triggerUpdate);
    }
  }, [customCardBg, applyThemeColors]);

  // Apply custom colors
  const applyCustomColors = useCallback((previewCanvasRef, triggerUpdate) => {
    setSelectedTheme('Custom');
    applyThemeColors(customPrimary, customSecondary, customAccent, customCardBg, previewCanvasRef, triggerUpdate);
  }, [customPrimary, customSecondary, customAccent, customCardBg, applyThemeColors]);

  // Update a single color with auto-apply (with validation)
  const updatePrimary = useCallback((color, previewCanvasRef, triggerUpdate) => {
    if (!isValidColor(color)) return;
    setCustomPrimary(color);
    setSelectedTheme('Custom');
    applyThemeColors(color, customSecondary, customAccent, customCardBg, previewCanvasRef, triggerUpdate);
  }, [customSecondary, customAccent, customCardBg, applyThemeColors]);

  const updateSecondary = useCallback((color, previewCanvasRef, triggerUpdate) => {
    if (!isValidColor(color)) return;
    setCustomSecondary(color);
    setSelectedTheme('Custom');
    applyThemeColors(customPrimary, color, customAccent, customCardBg, previewCanvasRef, triggerUpdate);
  }, [customPrimary, customAccent, customCardBg, applyThemeColors]);

  const updateAccent = useCallback((color, previewCanvasRef, triggerUpdate) => {
    if (!isValidColor(color)) return;
    setCustomAccent(color);
    setSelectedTheme('Custom');
    applyThemeColors(customPrimary, customSecondary, color, customCardBg, previewCanvasRef, triggerUpdate);
  }, [customPrimary, customSecondary, customCardBg, applyThemeColors]);

  const updateCardBg = useCallback((color, previewCanvasRef, triggerUpdate) => {
    if (!isValidColor(color)) return;
    setCustomCardBg(color);
    applyThemeColors(customPrimary, customSecondary, customAccent, color, previewCanvasRef, triggerUpdate);
  }, [customPrimary, customSecondary, customAccent, applyThemeColors]);

  // Reset to default theme
  const resetToDefaultTheme = useCallback((previewCanvasRef, triggerUpdate) => {
    const defaultTheme = THEMES.Default;
    setSelectedTheme('Default');
    setCustomPrimary(defaultTheme.primary);
    setCustomSecondary(defaultTheme.secondary);
    setCustomAccent(defaultTheme.accent);
    setCustomCardBg('#ffffff');
    applyThemeColors(defaultTheme.primary, defaultTheme.secondary, defaultTheme.accent, '#ffffff', previewCanvasRef, triggerUpdate);
  }, [applyThemeColors]);

  // Get current theme colors (always returns same shape with cardBg)
  const getCurrentThemeColors = useCallback(() => {
    const base = THEMES[selectedTheme];
    if (base) {
      return {
        ...base,
        cardBg: customCardBg,
      };
    }
    return {
      primary: customPrimary,
      secondary: customSecondary,
      accent: customAccent,
      cardBg: customCardBg,
    };
  }, [selectedTheme, customPrimary, customSecondary, customAccent, customCardBg]);

  return {
    // State
    selectedTheme,
    customPrimary,
    customSecondary,
    customAccent,
    customCardBg,
    themes: THEMES,
    
    // Setters
    setSelectedTheme,
    setCustomPrimary,
    setCustomSecondary,
    setCustomAccent,
    setCustomCardBg,
    
    // Methods
    applyTheme,
    applyCustomColors,
    updatePrimary,
    updateSecondary,
    updateAccent,
    updateCardBg,
    resetToDefaultTheme,
    getCurrentThemeColors,
    applyThemeColors,
  };
}