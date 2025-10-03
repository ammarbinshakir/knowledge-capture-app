'use client';

import React, { useState, useEffect } from 'react';
import { KnowledgeEntry, getEntries, createEntry, updateEntry, deleteEntry, uploadImage } from '@/lib/api';
import Header from '@/components/Header';
import EntryCard from '@/components/EntryCard';
import EntryForm from '@/components/EntryForm';
import Dialog from '@/components/Dialog';
// import Loading from '@/components/Loading'; // Using skeleton loading instead
import ErrorMessage from '@/components/ErrorMessage';

export default function Home() {
  const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<KnowledgeEntry | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<string | number | null>(null);

  const isEditing = !!currentEntry?.id;
  const dialogTitle = isEditing ? 'Edit Knowledge Entry' : 'Add Knowledge Entry';

  // Load entries on initial render
  useEffect(() => {
    fetchEntries();
  }, []);

  async function fetchEntries() {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getEntries();
      // Sort by creation date (newest first)
      const sortedData = [...data].sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
      setEntries(sortedData);
    } catch (err) {
      setError('Failed to load entries. Please try again.');
      console.error('Error fetching entries:', err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleAddEntry = () => {
    setCurrentEntry(null);
    setIsDialogOpen(true);
  };

  const handleEditEntry = (entry: KnowledgeEntry) => {
    setCurrentEntry(entry);
    setIsDialogOpen(true);
  };

  const handleDeleteConfirm = (id: string | number) => {
    setEntryToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    // Give time for the dialog closing animation
    setTimeout(() => setCurrentEntry(null), 300);
  };

  const handleSubmit = async (entryData: KnowledgeEntry, file?: File) => {
    setIsSubmitting(true);
    setError(null);
    try {
      let imageUrl = entryData.imageUrl;

      // If there's a file to upload
      if (file) {
        try {
          imageUrl = await uploadImage(file);
        } catch {
          setError('Failed to upload image. Please try again.');
          setIsSubmitting(false);
          return;
        }
      }

      // Combine the entry data with the image URL
      const entryWithImage: KnowledgeEntry = {
        ...entryData,
        imageUrl,
      };

      if (isEditing && entryData.id) {
        // Update existing entry
        const updated = await updateEntry(entryData.id, entryWithImage);
        // Force a complete state refresh to ensure UI updates
        setEntries(prevEntries => 
          prevEntries.map(entry => 
            entry.id === updated.id ? updated : entry
          )
        );
      } else {
        // Create new entry
        const created = await createEntry(entryWithImage);
        setEntries([created, ...entries]);
      }

      // Show success message
      const successMessage = isEditing ? 'Entry updated successfully!' : 'Entry created successfully!';
      
      // You could add a toast notification here
      console.log(successMessage);
      
      // Close the dialog
      handleCloseDialog();
    } catch (err) {
      setError(`Failed to ${isEditing ? 'update' : 'create'} entry. Please try again.`);
      console.error(`Error ${isEditing ? 'updating' : 'creating'} entry:`, err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (entryToDelete === null) return;

    try {
      await deleteEntry(entryToDelete);
      setEntries(entries.filter(entry => entry.id !== entryToDelete));
      setIsDeleteConfirmOpen(false);
    } catch (error) {
      setError('Failed to delete entry. Please try again.');
      console.error('Error deleting entry:', error);
    } finally {
      setEntryToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header onAddEntry={handleAddEntry} />

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Knowledge Entries</h2>
        
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
                  </div>
                  <div className="p-6 md:w-2/3">
                    <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-4 w-3/4"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2 w-2/3"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <ErrorMessage 
            message={error} 
            onRetry={fetchEntries} 
          />
        ) : entries.length === 0 ? (
          <div className="text-center p-12 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-md border-2 border-dashed border-blue-200 dark:border-gray-600">
            <div className="animate-bounce">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">Ready to capture knowledge?</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-md mx-auto">
              Create your first knowledge entry to help your team share important manufacturing processes and insights.
            </p>
            <div className="mt-6 space-y-3">
              <button
                onClick={handleAddEntry}
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                data-testid="empty-state-add-button"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create First Entry
              </button>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                💡 Tip: Include photos and detailed descriptions for better knowledge sharing
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
            {entries.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                onEdit={() => handleEditEntry(entry)}
                onDelete={handleDeleteConfirm}
              />
            ))}
          </div>
        )}
      </main>

      {/* Entry Form Dialog */}
      {isDialogOpen && (
        <Dialog
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          title={dialogTitle}
        >
          <EntryForm
            initialValues={currentEntry || undefined}
            onSubmit={handleSubmit}
            onCancel={handleCloseDialog}
            isSubmitting={isSubmitting}
          />
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteConfirmOpen && (
        <Dialog
          isOpen={isDeleteConfirmOpen}
          onClose={() => setIsDeleteConfirmOpen(false)}
          title="Confirm Delete"
        >
          <div className="p-4">
            <p className="text-gray-700 dark:text-gray-300">
              Are you sure you want to delete this entry? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md"
                data-testid="cancel-delete-button"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                data-testid="confirm-delete-button"
              >
                Delete
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
