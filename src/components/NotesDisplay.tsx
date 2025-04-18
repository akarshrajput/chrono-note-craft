
import React, { useState, useMemo } from 'react';
import { Grid, List as ListIcon, Search, Plus } from 'lucide-react';
import { useNotes } from '@/context/NotesContext';
import { Note, NoteDisplayMode } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import NoteCard from '@/components/NoteCard';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import NoteEditor from '@/components/NoteEditor';
import { sortNotesByDate, filterNotesByList, searchNotes, getPinnedNotes } from '@/utils/note-utils';

const NotesDisplay: React.FC = () => {
  const { notes, currentListId, lists } = useNotes();
  const [searchQuery, setSearchQuery] = useState('');
  const [displayMode, setDisplayMode] = useState<NoteDisplayMode>('grid');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isNewNoteOpen, setIsNewNoteOpen] = useState(false);

  const currentList = useMemo(
    () => lists.find(list => list.id === currentListId),
    [lists, currentListId]
  );

  const filteredNotes = useMemo(() => {
    // First filter by current list
    const listNotes = filterNotesByList(notes, currentListId);
    
    // Then apply search if query exists
    return searchQuery
      ? searchNotes(listNotes, searchQuery)
      : listNotes;
  }, [notes, currentListId, searchQuery]);

  // Separated pinned and unpinned notes
  const pinnedNotes = useMemo(() => getPinnedNotes(filteredNotes), [filteredNotes]);
  const unpinnedNotes = useMemo(
    () => filteredNotes.filter(note => !note.isPinned),
    [filteredNotes]
  );

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setSelectedNote(null);
    setIsEditorOpen(false);
    setIsNewNoteOpen(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-2 justify-between items-center mb-6 w-full">
        <h1 className="text-2xl font-semibold">
          {currentList ? currentList.name : 'All Notes'}
        </h1>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-full"
            />
          </div>
          <div className="flex items-center border rounded-md">
            <Button
              variant={displayMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setDisplayMode('grid')}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={displayMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setDisplayMode('list')}
              className="rounded-l-none"
            >
              <ListIcon className="h-4 w-4" />
            </Button>
          </div>
          <Dialog open={isNewNoteOpen} onOpenChange={setIsNewNoteOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Note
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <NoteEditor onClose={handleCloseEditor} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Notes grid/list */}
      <div className="overflow-y-auto flex-grow">
        {/* Dialog for editing note */}
        <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
          <DialogContent className="sm:max-w-[600px]">
            {selectedNote && <NoteEditor note={selectedNote} onClose={handleCloseEditor} />}
          </DialogContent>
        </Dialog>

        {/* Render pinned notes if any */}
        {pinnedNotes.length > 0 && (
          <>
            <div className="text-sm font-medium text-muted-foreground mb-2">PINNED</div>
            <div
              className={
                displayMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8'
                  : 'space-y-4 mb-8'
              }
            >
              {pinnedNotes.map((note) => (
                <NoteCard key={note.id} note={note} onClick={handleNoteClick} />
              ))}
            </div>
          </>
        )}

        {/* Render other notes */}
        {unpinnedNotes.length > 0 ? (
          <>
            {pinnedNotes.length > 0 && (
              <div className="text-sm font-medium text-muted-foreground mb-2">OTHERS</div>
            )}
            <div
              className={
                displayMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
                  : 'space-y-4'
              }
            >
              {unpinnedNotes.map((note) => (
                <NoteCard key={note.id} note={note} onClick={handleNoteClick} />
              ))}
            </div>
          </>
        ) : (
          // Empty state
          filteredNotes.length === 0 && (
            <div className="text-center py-10">
              <p className="text-muted-foreground mb-4">No notes found</p>
              <Button onClick={() => setIsNewNoteOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create your first note
              </Button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default NotesDisplay;
