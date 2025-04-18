
import React, { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Note } from '@/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useNotes } from '@/context/NotesContext';

interface NoteEditorProps {
  note?: Note;
  onClose: () => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ note, onClose }) => {
  const { addNote, updateNote, lists } = useNotes();
  
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [listId, setListId] = useState<string | undefined>(note?.listId);
  const [reminderDate, setReminderDate] = useState<Date | undefined>(note?.reminderAt);
  const [reminderTime, setReminderTime] = useState<string>('12:00');
  
  // Set reminder time when component mounts or reminderDate changes
  useEffect(() => {
    if (note?.reminderAt) {
      const date = new Date(note.reminderAt);
      setReminderTime(format(date, 'HH:mm'));
    }
  }, [note?.reminderAt]);

  const handleSave = () => {
    // Combine date and time for reminder
    let reminderAt: Date | undefined = undefined;
    if (reminderDate) {
      const [hours, minutes] = reminderTime.split(':').map(Number);
      reminderAt = new Date(reminderDate);
      reminderAt.setHours(hours, minutes);
    }
    
    if (note) {
      updateNote(note.id, {
        title,
        content,
        listId,
        reminderAt,
      });
    } else {
      addNote({
        title,
        content,
        listId,
        reminderAt,
        isPinned: false,
      });
    }
    onClose();
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <Input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-2xl font-medium border-none focus-visible:ring-0 px-0"
      />
      
      <Textarea
        placeholder="Write your note here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[200px] resize-none border-none focus-visible:ring-0 px-0"
      />
      
      <div className="flex flex-wrap gap-4 items-center">
        <div>
          <Label htmlFor="list">List</Label>
          <select
            id="list"
            value={listId || ''}
            onChange={(e) => setListId(e.target.value || undefined)}
            className="ml-2 p-1 rounded bg-background border"
          >
            <option value="">None</option>
            {lists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <Label>Reminder</Label>
          <div className="flex items-center gap-2 ml-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[160px] justify-start text-left font-normal",
                    !reminderDate && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {reminderDate ? format(reminderDate, 'PP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 pointer-events-auto">
                <CalendarComponent
                  mode="single"
                  selected={reminderDate}
                  onSelect={setReminderDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              <Input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="w-[100px]"
                disabled={!reminderDate}
              />
            </div>
            
            {reminderDate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReminderDate(undefined)}
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} disabled={!title && !content}>
          {note ? 'Save Changes' : 'Create Note'}
        </Button>
      </div>
    </div>
  );
};

export default NoteEditor;
