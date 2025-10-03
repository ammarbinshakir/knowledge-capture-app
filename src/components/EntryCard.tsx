'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { KnowledgeEntry } from '@/lib/api';
import { formatDate, truncateText, getPlaceholderImage } from '@/lib/utils';

interface EntryCardProps {
  entry: KnowledgeEntry;
  onEdit: (entry: KnowledgeEntry) => void;
  onDelete: (id: string | number) => void;
}

export default function EntryCard({ entry, onEdit, onDelete }: EntryCardProps) {
  const [imageSrc, setImageSrc] = useState(() => {
    // Check if the imageUrl is a blob URL that might be invalid
    const url = entry.imageUrl;
    if (url && url.startsWith('blob:')) {
      // Blob URLs from previous sessions are invalid, use placeholder
      return getPlaceholderImage();
    }
    return url || getPlaceholderImage();
  });

  const [isPlaceholder, setIsPlaceholder] = useState(() => {
    return !entry.imageUrl || entry.imageUrl.startsWith('blob:');
  });

  // Update image source when entry changes
  React.useEffect(() => {
    const url = entry.imageUrl;
    if (url && url.startsWith('blob:')) {
      // Blob URLs from previous sessions are invalid, use placeholder
      setImageSrc(getPlaceholderImage());
      setIsPlaceholder(true);
    } else if (url) {
      setImageSrc(url);
      setIsPlaceholder(false);
    } else {
      setImageSrc(getPlaceholderImage());
      setIsPlaceholder(true);
    }
  }, [entry.imageUrl]);

  const handleImageError = () => {
    setImageSrc(getPlaceholderImage());
    setIsPlaceholder(true);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/10 w-full mb-4 group" data-testid="entry-card">
      <div className="md:flex">
        <div className="md:w-1/3 relative">
          <div className={`h-48 md:h-full md:w-full relative ${isPlaceholder ? 'bg-gray-100 dark:bg-gray-700' : ''}`}>
            {!isPlaceholder ? (
              <Image
                src={imageSrc}
                alt={entry.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
                priority={false}
                onError={handleImageError}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">No Image</p>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="p-4 md:w-2/3">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
            {entry.createdAt && formatDate(entry.createdAt)}
          </div>
          <h2 className="text-xl font-bold mt-1 text-gray-900 dark:text-white">
            {entry.title}
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {truncateText(entry.description, 100)}
          </p>
          
          <div className="mt-4 flex space-x-3">
            <button
              onClick={() => onEdit(entry)}
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-0.5"
              data-testid="edit-button"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
            <button
              onClick={() => entry.id && onDelete(entry.id)}
              className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-red-500/25 transform hover:-translate-y-0.5"
              data-testid="delete-button"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}