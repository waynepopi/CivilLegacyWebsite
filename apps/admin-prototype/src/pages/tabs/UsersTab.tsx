import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Switch } from '../../components/ui/switch';
import { Label } from '../../components/ui/label';
import { AuthContext } from '../../App';
import { ShieldAlert, ShieldCheck, UserCog, UserPlus } from 'lucide-react';

export default function UsersTab() {
  const { state, updateUserPermissions, addUser } = useAppData();
  const { user } = React.useContext(AuthContext);
  const [newUsername, setNewUsername] = useState('');

  const canManage = user?.role === 'Master' || user?.permissions?.canManageMembers;

  const handleAddUser = () => {
    if (!newUsername.trim()) return;

    // In this prototype, Master/Leader only creates basic 'Member' tier users
    // who then log in with default 'admin' password and have no perms by default.
    addUser({
      id: Date.now().toString(),
      username: newUsername,
      role: 'Member',
      permissions: { canEditContent: false, canManageMembers: false }
    });
    setNewUsername('');
  };

  if (!canManage) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
        <ShieldAlert className="h-16 w-16 text-zinc-600" />
        <h2 className="text-2xl font-bold text-zinc-300">Access Denied</h2>
        <p className="text-zinc-500 max-w-md">You do not have the required permissions to view or manage user roles. Please contact an administrator.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <UserCog className="text-blue-500" /> Role Management
        </h2>
      </div>

      <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <UserPlus className="text-blue-500 h-5 w-5" /> Add New Member
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Create a new user with the 'Member' role. You can assign them permissions below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 items-end max-w-md">
            <div className="space-y-2 flex-1">
              <label className="text-sm font-medium text-zinc-300">Username</label>
              <Input
                placeholder="E.g., ContentEditor1"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white focus-visible:ring-blue-500"
              />
            </div>
            <Button onClick={handleAddUser} className="bg-blue-600 hover:bg-blue-700 text-white">
              Create User
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {state.users.map(u => {
          const isMaster = u.role === 'Master';
          const canEditThisUser = user?.role === 'Master' || (user?.role === 'Leader' && u.role === 'Member');

          return (
            <Card key={u.id} className="bg-zinc-900 border-zinc-800 text-zinc-100">
              <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-zinc-800">
                <div>
                  <CardTitle className="text-xl font-bold">{u.username}</CardTitle>
                  <CardDescription className="text-blue-400 font-medium flex items-center gap-1 mt-1">
                    {isMaster && <ShieldCheck className="h-4 w-4" />} {u.role}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-semibold text-zinc-200">Edit Content</Label>
                    <p className="text-sm text-zinc-500">Allow user to add, edit, or delete items on tabs.</p>
                  </div>
                  <Switch
                    checked={u.permissions.canEditContent}
                    disabled={!canEditThisUser || isMaster}
                    onCheckedChange={(checked) => updateUserPermissions(u.id, { ...u.permissions, canEditContent: checked })}
                    className="data-[state=checked]:bg-blue-600"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-semibold text-zinc-200">Manage Members</Label>
                    <p className="text-sm text-zinc-500">Allow user to manage roles and permissions of lower-tier users.</p>
                  </div>
                  <Switch
                    checked={u.permissions.canManageMembers}
                    disabled={!canEditThisUser || isMaster}
                    onCheckedChange={(checked) => updateUserPermissions(u.id, { ...u.permissions, canManageMembers: checked })}
                    className="data-[state=checked]:bg-blue-600"
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}