
export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  listId?: string;
  reminderAt?: Date;
  userId: string;
  isPinned: boolean;
  color?: string;
}

export interface NoteList {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  color?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  photoURL?: string;
}

export interface ReminderSettings {
  enabled: boolean;
  date?: Date;
  time?: string;
}

export type NoteDisplayMode = "grid" | "list";

export type ThemeMode = "light" | "dark" | "system";
