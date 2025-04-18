
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { NoteList } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useNotes } from '@/context/NotesContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface SidebarListItemProps {
  list: NoteList;
  isSelected: boolean;
}

const SidebarListItem: React.FC<SidebarListItemProps> = ({ list, isSelected }) => {
  const { setCurrentListId, updateList, deleteList } = useNotes();
  const [isEditing, setIsEditing] = React.useState(false);
  const [newName, setNewName] = React.useState(list.name);
  
  const handleNameChange = (e: React.FormEvent) => {
    e.preventDefault();
    updateList(list.id, { name: newName });
    setIsEditing(false);
  };
  
  const handleDelete = () => {
    deleteList(list.id);
  };
  
  return (
    <div 
      className={cn(
        "flex items-center justify-between py-2 px-3 rounded-md transition-colors",
        isSelected 
          ? "bg-sidebar-accent text-sidebar-accent-foreground" 
          : "hover:bg-sidebar-accent/50"
      )}
    >
      <div 
        className="flex-1 cursor-pointer truncate"
        onClick={() => setCurrentListId(list.id)}
      >
        {list.name}
      </div>
      
      <div className="flex items-center gap-1">
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Edit className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit List</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleNameChange}>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="List name"
                className="my-4"
                autoFocus
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!newName.trim()}>
                  Save
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Trash2 className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete List</DialogTitle>
            </DialogHeader>
            <p className="py-4">
              Are you sure you want to delete "{list.name}"? Notes in this list will not be deleted.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => {}}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SidebarListItem;
