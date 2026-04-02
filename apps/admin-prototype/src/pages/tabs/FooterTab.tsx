import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { AuthContext } from '../../App';
import { MapPin, Phone, Building2, Plus, Trash2 } from 'lucide-react';

export default function FooterTab() {
  const { state, addBranch, deleteBranch } = useAppData();
  const { user } = React.useContext(AuthContext);

  const canEdit = user?.role === 'Master' || user?.permissions?.canEditContent;

  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchAddress, setNewBranchAddress] = useState('');
  const [newBranchPhone, setNewBranchPhone] = useState('');

  const handleAdd = () => {
    if (!newBranchName || !newBranchAddress || !newBranchPhone) return;
    addBranch({
      id: Date.now().toString(),
      name: newBranchName,
      address: newBranchAddress,
      phone: newBranchPhone
    });
    setNewBranchName('');
    setNewBranchAddress('');
    setNewBranchPhone('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Footer Configuration</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Building2 className="text-blue-500 h-5 w-5" /> Active Branches
              </CardTitle>
              <CardDescription className="text-zinc-400">Manage locations displayed in the footer.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {state.branches.map(branch => (
                <div key={branch.id} className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700/50 flex justify-between items-center">
                  <div className="space-y-1">
                    <h4 className="font-semibold text-zinc-200">{branch.name}</h4>
                    <div className="flex items-center text-sm text-zinc-400 gap-1">
                      <MapPin className="h-3 w-3" /> {branch.address}
                    </div>
                    <div className="flex items-center text-sm text-zinc-400 gap-1">
                      <Phone className="h-3 w-3" /> {branch.phone}
                    </div>
                  </div>
                  {canEdit && (
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-zinc-800" onClick={() => deleteBranch(branch.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {canEdit && (
          <Card className="bg-zinc-900 border-zinc-800 text-zinc-100 h-fit">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Plus className="text-blue-500 h-5 w-5" /> Add New Branch
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Location Name</label>
                <Input
                  placeholder="E.g., Northside Office"
                  value={newBranchName}
                  onChange={(e) => setNewBranchName(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Address</label>
                <Input
                  placeholder="123 Example St..."
                  value={newBranchAddress}
                  onChange={(e) => setNewBranchAddress(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Phone</label>
                <Input
                  placeholder="555-0199"
                  value={newBranchPhone}
                  onChange={(e) => setNewBranchPhone(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              <Button onClick={handleAdd} className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4">
                Save Branch Location
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}