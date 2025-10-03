// API Service for CRUD operations

export interface KnowledgeEntry {
  id?: string | number;
  title: string;
  description: string;
  imageUrl?: string;
  createdAt?: string;
}

const API_URL = 'http://localhost:3001';

/**
 * Fetches all knowledge entries
 */
export async function getEntries(): Promise<KnowledgeEntry[]> {
  const response = await fetch(`${API_URL}/entries`);
  if (!response.ok) {
    throw new Error('Failed to fetch entries');
  }
  return response.json();
}

/**
 * Fetches a single knowledge entry
 */
export async function getEntry(id: string | number): Promise<KnowledgeEntry> {
  const response = await fetch(`${API_URL}/entries/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch entry with ID: ${id}`);
  }
  return response.json();
}

/**
 * Creates a new knowledge entry
 */
export async function createEntry(entry: KnowledgeEntry): Promise<KnowledgeEntry> {
  // Add creation timestamp
  const entryWithTimestamp = {
    ...entry,
    createdAt: new Date().toISOString()
  };

  const response = await fetch(`${API_URL}/entries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(entryWithTimestamp)
  });

  if (!response.ok) {
    throw new Error('Failed to create entry');
  }
  return response.json();
}

/**
 * Updates an existing knowledge entry
 */
export async function updateEntry(id: string | number, entry: Partial<KnowledgeEntry>): Promise<KnowledgeEntry> {
  const response = await fetch(`${API_URL}/entries/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(entry)
  });

  if (!response.ok) {
    throw new Error(`Failed to update entry with ID: ${id}`);
  }
  return response.json();
}

/**
 * Deletes a knowledge entry
 */
export async function deleteEntry(id: string | number): Promise<void> {
  const response = await fetch(`${API_URL}/entries/${id}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    throw new Error(`Failed to delete entry with ID: ${id}`);
  }
}

/**
 * Uploads an image and returns the URL
 * Note: In a real app, this would upload to a server/cloud storage
 * In this mock version, we convert to base64 data URL for persistence
 */
export async function uploadImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // Simulating file upload delay
    setTimeout(() => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          resolve(result); // This will be a data URL like "data:image/jpeg;base64,..."
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      // Convert file to base64 data URL
      reader.readAsDataURL(file);
    }, 500);
  });
}