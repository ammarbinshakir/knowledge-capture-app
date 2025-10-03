'use client';

import React, { useEffect, useRef } from 'react';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Dialog({ isOpen, onClose, title, children }: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Close dialog when clicking outside
  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    // Close dialog on escape key
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent body scrolling when dialog is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Animation classes
  const overlayClasses = isOpen
    ? 'opacity-100 pointer-events-auto'
    : 'opacity-0 pointer-events-none';
    
  const dialogClasses = isOpen
    ? 'opacity-100 translate-y-0 scale-100'
    : 'opacity-0 translate-y-4 scale-95 pointer-events-none';

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${overlayClasses}`}
      style={{ backgroundColor: isOpen ? 'rgba(0, 0, 0, 0.5)' : 'transparent' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      data-testid="dialog-overlay"
    >
      <div
        ref={dialogRef}
        className={`w-full max-w-md transform overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-xl transition-all duration-300 ${dialogClasses}`}
        data-testid="dialog-content"
      >
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h2
            id="dialog-title"
            className="text-lg font-medium text-gray-900 dark:text-white"
          >
            {title}
          </h2>
        </div>
        <div className="max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}