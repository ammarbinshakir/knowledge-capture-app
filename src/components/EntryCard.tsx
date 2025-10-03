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

  // Update image source when entry changes
  React.useEffect(() => {
    const url = entry.imageUrl;
    if (url && url.startsWith('blob:')) {
      // Blob URLs from previous sessions are invalid, use placeholder
      setImageSrc(getPlaceholderImage());
    } else {
      setImageSrc(url || getPlaceholderImage());
    }
  }, [entry.imageUrl]);

  const handleImageError = () => {
    setImageSrc(getPlaceholderImage());
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-transform hover:scale-[1.02] w-full mb-4" data-testid="entry-card">
      <div className="md:flex">
        <div className="md:w-1/3 relative">
          <div className="h-48 md:h-full md:w-full relative">
            <Image
              src={imageSrc}
              alt={entry.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
              priority={false}
              onError={handleImageError}
            />
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
          
          <div className="mt-4 flex space-x-2">
            <button
              onClick={() => onEdit(entry)}
              className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-md text-sm transition-colors"
              data-testid="edit-button"
            >
              Edit
            </button>
            <button
              onClick={() => entry.id && onDelete(entry.id)}
              className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-md text-sm transition-colors"
              data-testid="delete-button"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}