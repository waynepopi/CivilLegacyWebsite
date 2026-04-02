import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { AuthContext } from '../../App';
import { UserPlus, Pencil, Trash2 } from 'lucide-react';

export default function TeamTab() {
  const { state, updateState } = useAppData();
  const { user } = React.useContext(AuthContext);

  const canEdit = user?.role === 'Master' || user?.permissions?.canEditContent;

  const handleDelete = (id: string) => {
    updateState({ team: state.team.filter(t => t.id !== id) });
  };

  const handleEdit = (id: string) => {
    // Just a dummy action for the prototype to show interactivity
    alert(`Editing team member ${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Team Management</h2>
        {canEdit && (
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <UserPlus className="mr-2 h-4 w-4" /> Add Member
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {state.team.map(member => (
          <Card key={member.id} className="bg-zinc-900 border-zinc-800 text-zinc-100">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <img src={member.imageUrl} alt={member.name} className="h-16 w-16 rounded-full object-cover border-2 border-zinc-700" />
              <div className="flex-1">
                <CardTitle className="text-lg font-bold">{member.name}</CardTitle>
                <div className="text-sm text-blue-400 font-medium">{member.role}</div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-400 mt-2 mb-4 line-clamp-3">{member.bio}</p>
              {canEdit && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(member.id)} className="flex-1 border-zinc-700 hover:bg-zinc-800 text-zinc-300">
                    <Pencil className="mr-2 h-4 w-4" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(member.id)} className="flex-1 border-red-900/50 hover:bg-red-900/20 text-red-400">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}