'use client';

import React, { useState, useEffect } from 'react';
import { KnowledgeEntry, getEntries, createEntry, updateEntry, deleteEntry, uploadImage } from '@/lib/api';
import Header from '@/components/Header';
import EntryCard from '@/components/EntryCard';
import EntryForm from '@/components/EntryForm';
import Dialog from '@/components/Dialog';
import Loading from '@/components/Loading';
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
          <Loading />
        ) : error ? (
          <ErrorMessage 
            message={error} 
            onRetry={fetchEntries} 
          />
        ) : entries.length === 0 ? (
          <div className="text-center p-12 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No entries found</h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">Get started by adding a new knowledge entry</p>
            <button
              onClick={handleAddEntry}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              data-testid="empty-state-add-button"
            >
              Add Entry
            </button>
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
