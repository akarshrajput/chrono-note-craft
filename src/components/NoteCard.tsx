
import React from 'react';
import { format } from 'date-fns';
import { Clock, Pin, PinOff, Trash2, Edit, Bell, BellOff } from 'lucide-react';
import { Note } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useNotes } from '@/context/NotesContext';

interface NoteCardProps {
  note: Note;
  onClick: (note: Note) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onClick }) => {
  const { togglePinNote, removeReminder } = useNotes();
  
  const handlePinToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    togglePinNote(note.id);
  };

  const handleReminderRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeReminder(note.id);
  };
  
  return (
    <Card 
      className={`note-card cursor-pointer h-full ${note.color ? `bg-${note.color}-50 dark:bg-${note.color}-950/30` : ''}`}
      onClick={() => onClick(note)}
    >
      <CardContent className="p-4 flex flex-col h-full">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-lg line-clamp-1">{note.title || 'Untitled Note'}</h3>
          <div className="flex gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handlePinToggle}
                  >
                    {note.isPinned ? (
                      <Pin className="h-4 w-4 text-primary" />
                    ) : (
                      <PinOff className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {note.isPinned ? 'Unpin note' : 'Pin note'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground mb-3 line-clamp-4 flex-grow">
          {note.content || 'No content'}
        </div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            <span>{format(new Date(note.updatedAt), 'MMM d, yyyy')}</span>
          </div>
          
          {note.reminderAt && (
            <div className="flex items-center">
              <Bell className="h-3 w-3 mr-1 text-primary" />
              <span className="mr-1">{format(new Date(note.reminderAt), 'MMM d, h:mm a')}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-5 w-5" 
                      onClick={handleReminderRemove}
                    >
                      <BellOff className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Remove reminder</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NoteCard;
