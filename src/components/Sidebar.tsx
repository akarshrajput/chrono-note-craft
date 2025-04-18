
import React, { useState } from 'react';
import { FolderPlus, ListPlus, LogOut, Menu, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { useNotes } from '@/context/NotesContext';
import { useIsMobile } from '@/hooks/use-mobile';
import SidebarListItem from '@/components/SidebarListItem';
import ThemeSwitcher from '@/components/ThemeSwitcher';

const Sidebar: React.FC = () => {
  const { lists, currentListId, addList, setCurrentListId } = useNotes();
  const { user, signout } = useAuth();
  const [isAddListOpen, setIsAddListOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const handleAddList = (e: React.FormEvent) => {
    e.preventDefault();
    if (newListName.trim()) {
      addList({ name: newListName });
      setNewListName('');
      setIsAddListOpen(false);
    }
  };
  
  const sidebarContent = (
    <div className="h-full bg-sidebar flex flex-col w-64">
      {/* Header and close button for mobile */}
      {isMobile && (
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <h2 className="font-semibold">Notes App</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}
      
      {/* User info */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium truncate">{user?.name || user?.email}</p>
            <p className="text-xs text-sidebar-foreground/60 truncate">{user?.email}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={signout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Lists section */}
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm uppercase font-medium text-sidebar-foreground/70">Lists</h3>
          <Dialog open={isAddListOpen} onOpenChange={setIsAddListOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New List</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddList}>
                <Input
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="List name"
                  className="my-4"
                  autoFocus
                />
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddListOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={!newListName.trim()}>
                    Create
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* All notes */}
        <div
          className={`flex items-center justify-between py-2 px-3 rounded-md transition-colors mb-1 cursor-pointer ${
            currentListId === null
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "hover:bg-sidebar-accent/50"
          }`}
          onClick={() => setCurrentListId(null)}
        >
          <span>All Notes</span>
        </div>
        
        {/* List items */}
        <div className="space-y-1">
          {lists.map((list) => (
            <SidebarListItem
              key={list.id}
              list={list}
              isSelected={currentListId === list.id}
            />
          ))}
        </div>
      </div>
      
      {/* Footer with theme switcher */}
      <div className="p-4 border-t border-sidebar-border flex justify-end">
        <ThemeSwitcher />
      </div>
    </div>
  );
  
  // Mobile sidebar toggle button
  if (isMobile) {
    return (
      <>
        <Button
          variant="outline"
          size="icon"
          className="fixed left-4 top-4 z-10"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        {/* Mobile sidebar drawer */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div 
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setIsSidebarOpen(false)}
            />
            <div className="relative z-50">
              {sidebarContent}
            </div>
          </div>
        )}
      </>
    );
  }
  
  // Desktop sidebar
  return sidebarContent;
};

export default Sidebar;
