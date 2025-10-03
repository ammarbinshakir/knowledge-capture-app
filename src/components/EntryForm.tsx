'use client';

import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { KnowledgeEntry } from '@/lib/api';
import { validateImageFile } from '@/lib/utils';

interface EntryFormProps {
  initialValues?: KnowledgeEntry;
  onSubmit: (entry: KnowledgeEntry, file?: File) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const defaultEntry: KnowledgeEntry = {
  title: '',
  description: '',
};

export default function EntryForm({ 
  initialValues = defaultEntry, 
  onSubmit,
  onCancel,
  isSubmitting
}: EntryFormProps) {
  const [entry, setEntry] = useState<KnowledgeEntry>(initialValues);
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialValues.imageUrl || null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!initialValues.id;

  // Update form when initialValues change
  useEffect(() => {
    setEntry(initialValues);
    // Handle broken blob URLs from previous sessions
    if (initialValues.imageUrl) {
      if (initialValues.imageUrl.startsWith('blob:')) {
        // Blob URLs from previous sessions are invalid, use placeholder
        setImagePreview('/images/placeholder.jpg');
      } else {
        // Data URLs or regular URLs should work
        setImagePreview(initialValues.imageUrl);
      }
    } else {
      setImagePreview(null);
    }
    setFile(null);
    setErrors({});
  }, [initialValues]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEntry((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const selectedFile = e.target.files[0];
    
    if (!validateImageFile(selectedFile)) {
      setErrors((prev) => ({ 
        ...prev, 
        image: 'Please select a valid image file (JPEG, PNG, GIF, or WebP)' 
      }));
      return;
    }

    setFile(selectedFile);
    setErrors((prev) => ({ ...prev, image: '' }));
    setImagePreview(URL.createObjectURL(selectedFile));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!entry.title.trim()) newErrors.title = 'Title is required';
    if (!entry.description.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await onSubmit(entry, file || undefined);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md" data-testid="entry-form">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={entry.title}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
          placeholder="Enter knowledge entry title"
          data-testid="title-input"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={entry.description}
          onChange={handleChange}
          rows={4}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
          placeholder="Enter detailed description"
          data-testid="description-input"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
        )}
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Image {isEditing && '(optional)'}
        </label>
        <div className="flex items-center space-x-4">
          {imagePreview && (
            <div className="relative h-16 w-16 rounded-md overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreview}
                alt="Preview"
                className="h-full w-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/placeholder.jpg';
                  setImagePreview('/images/placeholder.jpg');
                }}
              />
            </div>
          )}
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-500 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-200 dark:hover:file:bg-blue-800"
            data-testid="image-input"
          />
        </div>
        {errors.image && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.image}</p>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md transition-colors"
          disabled={isSubmitting}
          data-testid="cancel-button"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center"
          disabled={isSubmitting}
          data-testid="submit-button"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            isEditing ? 'Update Entry' : 'Create Entry'
          )}
        </button>
      </div>
    </form>
  );
}
