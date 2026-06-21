// app/customize/hooks/useDraftManager.js
'use client';

import { useState, useCallback, useEffect } from 'react';

// --- Constants ---
const DRAFT_STORAGE_KEY = 'cardstudio_drafts';
const MAX_DRAFTS = 5;
const MAX_DRAFT_SIZE_KB = 1500;
const MIN_DRAFTS_TO_KEEP = 2;

// --- Helpers ---
const isBrowser = typeof window !== 'undefined';

const getStoredDrafts = () => {
  if (!isBrowser) return [];
  try {
    return JSON.parse(localStorage.getItem(DRAFT_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};

// FIX 1: Safer crypto check (no optional chaining risk)
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
};

// --- Hook ---
export function useDraftManager() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [drafts, setDrafts] = useState([]);

  // Load drafts on mount (auto‑load)
  useEffect(() => {
    setDrafts(getStoredDrafts());
  }, []);

  const loadDrafts = useCallback(() => {
    const stored = getStoredDrafts();
    setDrafts(stored);
    return stored;
  }, []);

  const saveToDrafts = useCallback(
    (template, orientation, htmlContent, templateName) => {
      try {
        const existingDrafts = getStoredDrafts();

        const htmlSizeKB = new Blob([htmlContent]).size / 1024;

        if (process.env.NODE_ENV === 'development') {
          console.log(`[Draft Save] HTML Size: ${htmlSizeKB.toFixed(1)} KB`);
        }

        if (htmlSizeKB > MAX_DRAFT_SIZE_KB) {
          throw new Error(
            `Draft too large (${htmlSizeKB.toFixed(0)} KB). Try removing large images before saving.`
          );
        }

        const timestamp = new Date().toISOString();
        const uniqueName = `${templateName || 'Custom'} (Draft - ${timestamp})`;

        const newDraft = {
          id: generateId(),
          name: uniqueName,
          templateId: template?.id || null,
          orientation,
          fullHTML: htmlContent,
          createdAt: timestamp,
          sizeKB: Number(htmlSizeKB.toFixed(1)),
        };

        existingDrafts.unshift(newDraft);

        if (existingDrafts.length > MAX_DRAFTS) {
          existingDrafts.length = MAX_DRAFTS;
        }

        let saveSucceeded = false;

        try {
          localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(existingDrafts));
          saveSucceeded = true;
        } catch (storageError) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('[Draft Save] Storage full, trimming drafts...');
          }

          while (existingDrafts.length > MIN_DRAFTS_TO_KEEP) {
            existingDrafts.pop();
            try {
              localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(existingDrafts));
              saveSucceeded = true;
              break;
            } catch (_) {
              // Continue trimming
            }
          }
        }

        if (!saveSucceeded) {
          throw new Error('Storage quota exceeded even after trimming drafts');
        }

        // FIX 2: Spread to avoid accidental future mutation
        setDrafts([...existingDrafts]);
        setHasUnsavedChanges(false);

        return newDraft;
      } catch (error) {
        // FIX 3: Keep console.error (unchanged, these are useful)
        console.error('Draft save failed:', error.message);
        return null;
      }
    },
    []
  );

  const deleteDraft = useCallback((draftId) => {
    try {
      const existingDrafts = getStoredDrafts();
      const filteredDrafts = existingDrafts.filter((draft) => draft.id !== draftId);
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(filteredDrafts));
      setDrafts(filteredDrafts);
      return true;
    } catch (error) {
      console.error('Error deleting draft:', error);
      return false;
    }
  }, []);

  const loadDraft = useCallback((draftId) => {
    try {
      const existingDrafts = getStoredDrafts();
      return existingDrafts.find((d) => d.id === draftId) || null;
    } catch (error) {
      console.error('Error loading draft:', error);
      return null;
    }
  }, []);

  const clearAllDrafts = useCallback(() => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setDrafts([]);
      return true;
    } catch (error) {
      console.error('Error clearing drafts:', error);
      return false;
    }
  }, []);

  const markUnsaved = useCallback(() => {
    setHasUnsavedChanges(true);
  }, []);

  const clearUnsaved = useCallback(() => {
    setHasUnsavedChanges(false);
  }, []);

  return {
    hasUnsavedChanges,
    drafts,
    loadDrafts,
    saveToDrafts,
    deleteDraft,
    loadDraft,
    clearAllDrafts,
    markUnsaved,
    clearUnsaved,
  };
}