'use client';

import { useEffect, useCallback } from 'react';

interface UseAdminShortcutProps {
  onAdminShortcut: () => void;
}

export function useAdminShortcut({ onAdminShortcut }: UseAdminShortcutProps) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Check for Ctrl+Shift+A (or Cmd+Shift+A on Mac)
    if (
      (event.ctrlKey || event.metaKey) && 
      event.shiftKey && 
      event.key === 'a'
    ) {
      event.preventDefault();
      onAdminShortcut();
    }
  }, [onAdminShortcut]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}