import React from 'react';
import { useUsers } from '../../hooks/useUsers';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ShieldAlert, ShieldCheck, UserCog, Loader2, Trash2, Plus } from 'lucide-react';
import { useAuth } from '../../App';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

export default function UsersTab() {
  const { users, loading, error, removeUser, createAdmin, canManageAdmins } = useUsers();
  const { session } = useAuth();
  
  const currentUserEmail = session?.user?.email;

  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [newEmail, setNewEmail] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [isAdding, setIsAdding] = React.useState(false);
  const [addError, setAddError] = React.useState('');

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newPassword) return;
    
    setIsAdding(true);
    setAddError('');
    try {
      await createAdmin(newEmail, newPassword);
      setIsAddOpen(false);
      setNewEmail('');
      setNewPassword('');
    } catch (err: any) {
      setAddError(err.message || 'Failed to add administrator');
    } finally {
      setIsAdding(false);
    }
  };

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
        {canManageAdmins && (
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#0077B6] hover:bg-[#0077B6]/80 text-white flex items-center gap-2">
                <Plus className="h-4 w-4" /> Add Administrator
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 sm:max-w-[425px]">
              <form onSubmit={handleAddSubmit}>
                <DialogHeader>
                  <DialogTitle>Add New Administrator</DialogTitle>
                  <DialogDescription className="text-zinc-400">
                    Create a new admin user. They will immediately have access to this dashboard.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {addError && (
                    <div className="bg-red-950/50 border border-red-900/50 text-red-400 p-3 rounded-md text-sm">
                      {addError}
                    </div>
                  )}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right text-zinc-300">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="col-span-3 bg-zinc-800 border-zinc-700 text-zinc-100"
                      placeholder="admin@example.com"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-right text-zinc-300">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="col-span-3 bg-zinc-800 border-zinc-700 text-zinc-100"
                      placeholder="Min 6 characters"
                      required
                      minLength={6}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isAdding} className="bg-[#0077B6] hover:bg-[#0077B6]/80 text-white">
                    {isAdding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Create Admin
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
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
            {canManageAdmins
              ? 'Current users with access to this dashboard.'
              : 'Your administrator access is active. Super admin privileges are required to manage other admins.'}
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
                    {u.is_super_admin && (
                      <span className="text-[10px] uppercase bg-[#0077B6]/30 text-[#0077B6] px-2 py-0.5 rounded-full border border-[#0077B6]/50">Super Admin</span>
                    )}
                  </h3>
                  <p className="text-sm text-zinc-400 flex items-center gap-1 mt-0.5">
                    <ShieldAlert className="h-3 w-3" /> {u.is_super_admin ? 'Super Admin' : (u.role || 'Admin')}
                  </p>
                </div>
              </div>
              
              {canManageAdmins && u.email !== currentUserEmail && !u.is_super_admin && (
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
