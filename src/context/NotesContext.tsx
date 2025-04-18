
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Note, NoteList } from '@/types';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

type NotesContextType = {
  notes: Note[];
  lists: NoteList[];
  currentListId: string | null;
  setCurrentListId: (id: string | null) => void;
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => void;
  updateNote: (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'userId'>>) => void;
  deleteNote: (id: string) => void;
  addList: (list: Omit<NoteList, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => void;
  updateList: (id: string, updates: Partial<Omit<NoteList, 'id' | 'createdAt' | 'updatedAt' | 'userId'>>) => void;
  deleteList: (id: string) => void;
  togglePinNote: (id: string) => void;
  addReminder: (id: string, reminderAt: Date) => void;
  removeReminder: (id: string) => void;
};

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [lists, setLists] = useState<NoteList[]>([]);
  const [currentListId, setCurrentListId] = useState<string | null>(null);

  // Load notes and lists from localStorage on mount or user change
  useEffect(() => {
    if (user) {
      try {
        // Load notes
        const storedNotes = localStorage.getItem(`noteapp-notes-${user.id}`);
        if (storedNotes) {
          const parsedNotes = JSON.parse(storedNotes).map((note: any) => ({
            ...note,
            createdAt: new Date(note.createdAt),
            updatedAt: new Date(note.updatedAt),
            reminderAt: note.reminderAt ? new Date(note.reminderAt) : undefined
          }));
          setNotes(parsedNotes);
        }

        // Load lists
        const storedLists = localStorage.getItem(`noteapp-lists-${user.id}`);
        if (storedLists) {
          const parsedLists = JSON.parse(storedLists).map((list: any) => ({
            ...list,
            createdAt: new Date(list.createdAt),
            updatedAt: new Date(list.updatedAt)
          }));
          setLists(parsedLists);
        } else {
          // Create default list
          const defaultList: NoteList = {
            id: 'default',
            name: 'Default',
            userId: user.id,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          setLists([defaultList]);
          localStorage.setItem(`noteapp-lists-${user.id}`, JSON.stringify([defaultList]));
        }
      } catch (error) {
        console.error('Error loading data from localStorage', error);
      }
    } else {
      // Reset state when user logs out
      setNotes([]);
      setLists([]);
      setCurrentListId(null);
    }
  }, [user]);

  // Save notes and lists to localStorage whenever they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`noteapp-notes-${user.id}`, JSON.stringify(notes));
      localStorage.setItem(`noteapp-lists-${user.id}`, JSON.stringify(lists));
    }
  }, [notes, lists, user]);

  const addNote = (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    if (!user) return;

    const newNote: Note = {
      ...note,
      id: `note-${Date.now()}`,
      userId: user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setNotes((prev) => [newNote, ...prev]);
    toast.success("Note created successfully");
  };

  const updateNote = (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'userId'>>) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? { ...note, ...updates, updatedAt: new Date() }
          : note
      )
    );
    toast.success("Note updated successfully");
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
    toast.success("Note deleted successfully");
  };

  const addList = (list: Omit<NoteList, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    if (!user) return;

    const newList: NoteList = {
      ...list,
      id: `list-${Date.now()}`,
      userId: user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setLists((prev) => [...prev, newList]);
    toast.success("List created successfully");
  };

  const updateList = (id: string, updates: Partial<Omit<NoteList, 'id' | 'createdAt' | 'updatedAt' | 'userId'>>) => {
    setLists((prev) =>
      prev.map((list) =>
        list.id === id
          ? { ...list, ...updates, updatedAt: new Date() }
          : list
      )
    );
    toast.success("List updated successfully");
  };

  const deleteList = (id: string) => {
    // Don't delete notes, just unassign them from the list
    setNotes((prev) =>
      prev.map((note) =>
        note.listId === id
          ? { ...note, listId: undefined }
          : note
      )
    );
    
    setLists((prev) => prev.filter((list) => list.id !== id));
    
    // If the current list is being deleted, reset to null
    if (currentListId === id) {
      setCurrentListId(null);
    }
    
    toast.success("List deleted successfully");
  };

  const togglePinNote = (id: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? { ...note, isPinned: !note.isPinned, updatedAt: new Date() }
          : note
      )
    );
  };

  const addReminder = (id: string, reminderAt: Date) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? { ...note, reminderAt, updatedAt: new Date() }
          : note
      )
    );
    toast.success("Reminder set successfully");
  };

  const removeReminder = (id: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? { ...note, reminderAt: undefined, updatedAt: new Date() }
          : note
      )
    );
    toast.success("Reminder removed");
  };

  const value = {
    notes,
    lists,
    currentListId,
    setCurrentListId,
    addNote,
    updateNote,
    deleteNote,
    addList,
    updateList,
    deleteList,
    togglePinNote,
    addReminder,
    removeReminder
  };

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};
