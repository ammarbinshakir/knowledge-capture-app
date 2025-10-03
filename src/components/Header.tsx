'use client';

import React from 'react';

interface HeaderProps {
  onAddEntry: () => void;
}

export default function Header({ onAddEntry }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 shadow-md px-4 py-3 sm:px-6">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Knowledge Capture
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manufacturing Technicians
            </p>
          </div>
        </div>
        <div>
          <button
            onClick={onAddEntry}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            data-testid="add-entry-button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Add Entry
          </button>
        </div>
      </div>
    </header>
  );
}