
import { Note, NoteList } from '@/types';

export const sortNotesByDate = (notes: Note[], ascending = false): Note[] => {
  return [...notes].sort((a, b) => {
    if (ascending) {
      return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
    } else {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
  });
};

export const filterNotesByList = (notes: Note[], listId: string | null): Note[] => {
  if (listId === null) {
    return notes;
  }
  return notes.filter((note) => note.listId === listId);
};

export const searchNotes = (notes: Note[], query: string): Note[] => {
  const lowerCaseQuery = query.toLowerCase();
  return notes.filter(
    (note) =>
      note.title.toLowerCase().includes(lowerCaseQuery) ||
      note.content.toLowerCase().includes(lowerCaseQuery)
  );
};

export const getNotesWithReminders = (notes: Note[]): Note[] => {
  return notes.filter((note) => note.reminderAt !== undefined);
};

export const getPinnedNotes = (notes: Note[]): Note[] => {
  return notes.filter((note) => note.isPinned);
};

export const getNotesByList = (notes: Note[], lists: NoteList[]): Record<string, Note[]> => {
  return lists.reduce((acc, list) => {
    acc[list.id] = notes.filter((note) => note.listId === list.id);
    return acc;
  }, {} as Record<string, Note[]>);
};
