import React from 'react';

/**
 * TabLoadingFallback provides a clean, responsive skeleton loader
 * matching the application theme (light and dark) and maintaining
 * standard accessibility attributes (role="status", aria-live="polite", aria-busy="true").
 */
export default function TabLoadingFallback() {
  return (
    <div
      className="module-loading"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Memuat modul"
    >
      <span className="module-loading-bar" />
      <span className="module-loading-bar" />
      <span className="module-loading-bar" />
      <span className="sr-only">Memuat modul…</span>
    </div>
  );
}
