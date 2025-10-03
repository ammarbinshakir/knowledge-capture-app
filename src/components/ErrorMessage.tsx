import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-red-50 dark:bg-red-900/20 rounded-lg" data-testid="error-message">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-12 w-12 text-red-500 dark:text-red-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">Error</h3>
      <p className="mt-1 text-gray-600 dark:text-gray-300">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
          data-testid="retry-button"
        >
          Try Again
        </button>
      )}
    </div>
  );
}