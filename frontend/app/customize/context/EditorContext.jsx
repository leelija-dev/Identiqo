// app/customize/context/EditorContext.jsx

'use client';

import { createContext, useContext } from 'react';
import { useCustomizePage } from '../hooks/useCustomizePage';
import { ToastProvider, useToast } from './ToastContext';

// Create the context
const EditorContext = createContext(null);

// Editor provider with its own logic
function EditorProviderInner({ children }) {
  const editorData = useCustomizePage();
  return (
    <EditorContext.Provider value={editorData}>
      {children}
    </EditorContext.Provider>
  );
}

// Main provider that wraps with ToastProvider FIRST
export function EditorProvider({ children }) {
  return (
    <ToastProvider>
      <EditorProviderInner>
        {children}
      </EditorProviderInner>
    </ToastProvider>
  );
}

// Custom hook to consume the context easily
export function useEditor() {
  const context = useContext(EditorContext);
  
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  
  return context;
}