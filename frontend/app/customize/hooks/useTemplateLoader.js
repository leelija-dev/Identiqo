// app/customize/hooks/useTemplateLoader.js

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { allTemplates, normalizeTemplateHtml } from '@/templatesdata';

export function useTemplateLoader() {
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [currentOrientation, setCurrentOrientation] = useState('landscape');
  const [originalHTML, setOriginalHTML] = useState(null);
  const [pendingTemplateHtml, setPendingTemplateHtml] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const loadedRef = useRef(false);
  const templateCacheRef = useRef(null);

  const loadTemplate = useCallback(() => {
    try {
      let template = null;
      const saved = localStorage.getItem('selectedTemplateForCustomize');
      if (saved) {
        template = JSON.parse(saved);
      }
      if (!template && allTemplates && allTemplates.length > 0) {
        template = { ...allTemplates[0] };
      }
      if (!template) {
        console.error('No template available');
        setIsLoading(false);
        return null;
      }
      const rawHTML = template.fullHTML || template.htmlContent || '';
      const normalizedHTML = normalizeTemplateHtml(rawHTML);
      templateCacheRef.current = template;
      setCurrentTemplate(template);
      setCurrentOrientation(template.orientation || 'landscape');
      setPendingTemplateHtml(normalizedHTML);
      setOriginalHTML(normalizedHTML);
      setIsLoading(false);
      loadedRef.current = true;
      return { template, normalizedHTML };
    } catch (error) {
      console.error('Error loading template:', error);
      setIsLoading(false);
      return null;
    }
  }, []);

  useEffect(() => {
    if (!loadedRef.current) {
      loadTemplate();
    }
  }, [loadTemplate]);

  const resetToOriginal = useCallback(() => {
    if (originalHTML) {
      setPendingTemplateHtml(originalHTML);
      return originalHTML;
    }
    return null;
  }, [originalHTML]);

  const updateTemplateHtml = useCallback((newHtml) => {
    setPendingTemplateHtml(newHtml);
  }, []);

  return {
    currentTemplate: currentTemplate || templateCacheRef.current,
    currentOrientation,
    originalHTML,
    pendingTemplateHtml,
    isLoading,
    setPendingTemplateHtml,
    setCurrentTemplate,
    setCurrentOrientation,
    loadTemplate,
    resetToOriginal,
    updateTemplateHtml,
  };
}