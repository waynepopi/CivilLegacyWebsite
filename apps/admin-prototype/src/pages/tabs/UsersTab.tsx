import React from 'react';
import { useUsers } from '../../hooks/useUsers';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ShieldAlert, ShieldCheck, UserCog, Loader2, Trash2 } from 'lucide-react';
import { useAuth } from '../../App';

export default function UsersTab() {
  const { users, loading, error, removeUser } = useUsers();
  const { session } = useAuth();
  
  const currentUserEmail = session?.user?.email;

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to remove this admin? They will lose dashboard access immediately.")) {
      try {
        await removeUser(id);
      } catch (err) {
        alert("Failed to remove user.");
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 text-[#0077B6] animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <UserCog className="text-[#0077B6]" /> Administrator Management
        </h2>
      </div>

      {error && (
        <div className="bg-red-950/50 border border-red-900/50 text-red-400 p-4 rounded-md">
          {error}
        </div>
      )}

      <Card className="bg-zinc-900 border-zinc-800 text-zinc-100 mb-6">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <ShieldCheck className="text-[#0077B6] h-5 w-5" /> Active Administrators
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Current users with access to this dashboard. Note: Adding new admins requires backend configuration of their Auth User first.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4">
        {users.length === 0 ? (
           <p className="text-zinc-500 text-center py-8">No administrators found.</p>
        ) : (
          users.map(u => (
            <Card key={u.id} className="bg-zinc-900 border-zinc-800 text-zinc-100 flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-[#0077B6]/20 border border-[#0077B6]/30 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-[#0077B6]">{u.email.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    {u.email}
                    {u.email === currentUserEmail && (
                      <span className="text-[10px] uppercase bg-green-900/30 text-green-400 px-2 py-0.5 rounded-full border border-green-800/50">You</span>
                    )}
                  </h3>
                  <p className="text-sm text-zinc-400 flex items-center gap-1 mt-0.5">
                    <ShieldAlert className="h-3 w-3" /> {u.role}
                  </p>
                </div>
              </div>
              
              {u.email !== currentUserEmail && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleDelete(u.id)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-950/30"
                  title="Remove Admin Access"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}