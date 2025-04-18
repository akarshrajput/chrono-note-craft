
import React from 'react';
import { useNotes } from '@/context/NotesContext';
import Sidebar from '@/components/Sidebar';
import NotesDisplay from '@/components/NotesDisplay';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-row">
      <Sidebar />
      <div className="flex-1 p-6 overflow-hidden">
        <NotesDisplay />
      </div>
    </div>
  );
};

export default Dashboard;
