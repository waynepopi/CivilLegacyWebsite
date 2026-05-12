import React, { useState } from 'react';
import { useFooter } from '../../hooks/useFooter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { MapPin, Phone, Building2, Plus, Trash2, Loader2, Edit2, X, Save } from 'lucide-react';

export default function FooterTab() {
  const { branches, loading, error, addBranch, updateBranch, deleteBranch } = useFooter();

  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchAddress, setNewBranchAddress] = useState('');
  const [newBranchPhone, setNewBranchPhone] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editPhone, setEditPhone] = useState('');

  const handleAdd = async () => {
    if (!newBranchName || !newBranchAddress || !newBranchPhone) return;
    setIsSaving(true);
    try {
      await addBranch({
        name: newBranchName,
        address: newBranchAddress,
        phone: newBranchPhone,
        display_order: branches.length,
      });
      setNewBranchName('');
      setNewBranchAddress('');
      setNewBranchPhone('');
    } catch (err) {
      alert("Failed to add branch");
    } finally {
      setIsSaving(false);
    }
  };

  const startEdit = (branch: any) => {
    setEditingId(branch.id);
    setEditName(branch.name);
    setEditAddress(branch.address);
    setEditPhone(branch.phone || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleUpdate = async (id: string) => {
    try {
      await updateBranch(id, {
        name: editName,
        address: editAddress,
        phone: editPhone
      });
      setEditingId(null);
    } catch (err) {
      alert("Failed to update branch");
    }
  };

  if (loading) {
    return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 text-[#0077B6] animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Footer Configuration</h2>
      </div>

      {error && (
        <div className="bg-red-950/50 border border-red-900/50 text-red-400 p-4 rounded-md">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Building2 className="text-[#0077B6] h-5 w-5" /> Active Branches
              </CardTitle>
              <CardDescription className="text-zinc-400">Manage locations displayed in the footer.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {branches.length === 0 ? (
                <p className="text-zinc-500 text-sm">No branches configured.</p>
              ) : (
                branches.map(branch => {
                  const isEditing = editingId === branch.id;
                  
                  return (
                    <div key={branch.id} className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700/50 flex flex-col gap-3">
                      {isEditing ? (
                        <div className="space-y-2">
                          <Input value={editName} onChange={e => setEditName(e.target.value)} className="bg-zinc-800 border-zinc-700 h-8" placeholder="Name" />
                          <Input value={editAddress} onChange={e => setEditAddress(e.target.value)} className="bg-zinc-800 border-zinc-700 h-8" placeholder="Address" />
                          <Input value={editPhone} onChange={e => setEditPhone(e.target.value)} className="bg-zinc-800 border-zinc-700 h-8" placeholder="Phone" />
                          <div className="flex gap-2 pt-2">
                            <Button size="sm" onClick={() => handleUpdate(branch.id)} className="bg-[#0077B6] hover:bg-[#005f8e] text-white flex-1">
                              <Save className="h-4 w-4 mr-2" /> Save
                            </Button>
                            <Button size="sm" variant="ghost" onClick={cancelEdit} className="text-zinc-400 hover:text-zinc-200">
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <h4 className="font-semibold text-zinc-200">{branch.name}</h4>
                            <div className="flex items-center text-sm text-zinc-400 gap-1">
                              <MapPin className="h-3 w-3" /> {branch.address}
                            </div>
                            <div className="flex items-center text-sm text-zinc-400 gap-1">
                              <Phone className="h-3 w-3" /> {branch.phone || 'No phone'}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-zinc-800" onClick={() => startEdit(branch)}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-zinc-800" onClick={() => { if(window.confirm('Delete branch?')) deleteBranch(branch.id); }}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="bg-zinc-900 border-zinc-800 text-zinc-100 h-fit">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Plus className="text-[#0077B6] h-5 w-5" /> Add New Branch
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Location Name</label>
              <Input placeholder="E.g., Northside Office" value={newBranchName} onChange={(e) => setNewBranchName(e.target.value)} className="bg-zinc-800 border-zinc-700 text-white focus-visible:ring-[#0077B6]" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Address</label>
              <Input placeholder="123 Example St..." value={newBranchAddress} onChange={(e) => setNewBranchAddress(e.target.value)} className="bg-zinc-800 border-zinc-700 text-white focus-visible:ring-[#0077B6]" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Phone</label>
              <Input placeholder="555-0199" value={newBranchPhone} onChange={(e) => setNewBranchPhone(e.target.value)} className="bg-zinc-800 border-zinc-700 text-white focus-visible:ring-[#0077B6]" />
            </div>
            <Button onClick={handleAdd} disabled={isSaving || !newBranchName || !newBranchAddress} className="w-full bg-[#0077B6] hover:bg-[#005f8e] text-white mt-4">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Branch Location'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}