import { useState, useEffect } from 'react';
import { Note, CreateNoteData, UpdateNoteData } from '@/types/notes';
import { useAuth } from '@/contexts/AuthContext';

// Mock notes data per tenant
const INITIAL_NOTES: Record<string, Note[]> = {
  company1: [
    {
      id: '1',
      title: 'Welcome to Notes!',
      content: 'This is your first note. Click to edit or create new ones!',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tenantId: 'company1',
      userId: '1',
      tags: ['welcome']
    },
    {
      id: '2', 
      title: 'Project Ideas',
      content: 'Brainstorm session notes:\n- New dashboard design\n- User feedback integration\n- Performance improvements',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      tenantId: 'company1',
      userId: '2',
      tags: ['projects', 'brainstorm']
    }
  ],
  company2: [
    {
      id: '3',
      title: 'Meeting Notes',
      content: 'Team standup - discussed current sprint progress and blockers.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tenantId: 'company2', 
      userId: '3'
    }
  ]
};

export const useNotes = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      // Load notes for current tenant
      const tenantNotes = INITIAL_NOTES[user.tenantId] || [];
      setNotes(tenantNotes);
    }
  }, [user]);

  const createNote = async (data: CreateNoteData): Promise<Note> => {
    if (!user) throw new Error('User not authenticated');
    
    setLoading(true);
    
    // Check note limit
    if (notes.length >= user.noteLimit) {
      setLoading(false);
      throw new Error(`Note limit reached (${user.noteLimit}). Upgrade to add more notes.`);
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newNote: Note = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tenantId: user.tenantId,
      userId: user.id
    };
    
    setNotes(prev => [newNote, ...prev]);
    setLoading(false);
    return newNote;
  };

  const updateNote = async (id: string, data: UpdateNoteData): Promise<Note> => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const updatedNote = notes.find(note => note.id === id);
    if (!updatedNote) throw new Error('Note not found');
    
    const updated = {
      ...updatedNote,
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    setNotes(prev => prev.map(note => note.id === id ? updated : note));
    setLoading(false);
    return updated;
  };

  const deleteNote = async (id: string): Promise<void> => {
    setLoading(true);
    
    // Simulate API delay  
    await new Promise(resolve => setTimeout(resolve, 200));
    
    setNotes(prev => prev.filter(note => note.id !== id));
    setLoading(false);
  };

  return {
    notes,
    loading,
    createNote,
    updateNote,
    deleteNote
  };
};