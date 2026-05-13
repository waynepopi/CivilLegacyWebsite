import React, { useState } from 'react';
import { useServices, ServiceCategory, Service } from '../../hooks/useServices';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { 
  Loader2, AlertCircle, Settings2, Plus, Pencil, Trash2, FolderPlus,
  HardHat, Ruler, Briefcase, Layers, PenTool, BarChart2, Shield, 
  ClipboardCheck, DollarSign, Eye, Waves, Building2, Droplets, 
  Factory, Wrench, GitBranch, FlaskConical, FileText, FileSearch, Settings, Folder
} from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '../../components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '../../components/ui/alert-dialog';

const AVAILABLE_ICONS = {
  HardHat, Ruler, Briefcase, Layers, PenTool, BarChart2, Shield, 
  ClipboardCheck, DollarSign, Eye, Waves, Building2, Droplets, 
  Factory, Wrench, GitBranch, FlaskConical, FileText, FileSearch, Settings, Folder
};

function IconSelector({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  return (
    <div className="grid grid-cols-7 gap-2 max-h-32 overflow-y-auto p-2 border border-zinc-700 rounded-md bg-zinc-800">
      {Object.entries(AVAILABLE_ICONS).map(([name, IconComp]) => (
        <button
          key={name}
          type="button"
          onClick={(e) => { e.preventDefault(); onChange(name); }}
          title={name}
          className={`p-2 rounded flex items-center justify-center transition-colors ${value === name ? 'bg-[#0077B6] text-white' : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-700'}`}
        >
          <IconComp size={18} />
        </button>
      ))}
    </div>
  );
}


export default function ServicesTab() {
  const { categories, services, loading, error, addCategory, updateCategory, deleteCategory, addService, updateService, deleteService } = useServices();

  // Category State
  const [catDialogOpen, setCatDialogOpen] = useState(false);
  const [editCat, setEditCat] = useState<ServiceCategory | null>(null);
  const [catForm, setCatForm] = useState({ title: '', summary: '', icon_name: 'Folder', is_quote_only: false });
  const [catSaving, setCatSaving] = useState(false);

  // Service State
  const [servDialogOpen, setServDialogOpen] = useState(false);
  const [editServ, setEditServ] = useState<Service | null>(null);
  const [servForm, setServForm] = useState({
    category_id: '',
    title: '',
    summary: '',
    details: '', // Comma separated for simplicity in form
    price: '',
    icon_name: 'Settings'
  });
  const [servSaving, setServSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<{ type: 'cat' | 'serv', id: string, name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  // -- Handlers --

  const handleCatSave = async () => {
    if (!catForm.title) return;
    setCatSaving(true);
    try {
      if (editCat) {
        await updateCategory(editCat.id, catForm);
      } else {
        await addCategory(catForm);
      }
      setCatDialogOpen(false);
    } catch (err) {
      console.error(err);
      alert('Failed to save category');
    } finally {
      setCatSaving(false);
    }
  };

  const handleServSave = async () => {
    if (!servForm.title || !servForm.category_id) return;
    setServSaving(true);
    try {
      const payload = {
        category_id: servForm.category_id,
        title: servForm.title,
        summary: servForm.summary,
        details: servForm.details.split(',').map(s => s.trim()).filter(Boolean),
        price: servForm.price ? parseFloat(servForm.price) : null,
        icon_name: servForm.icon_name
      };
      
      if (editServ) {
        await updateService(editServ.id, payload);
      } else {
        await addService(payload);
      }
      setServDialogOpen(false);
    } catch (err) {
      console.error(err);
      alert('Failed to save service');
    } finally {
      setServSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      if (deleteTarget.type === 'cat') {
        await deleteCategory(deleteTarget.id);
      } else {
        await deleteService(deleteTarget.id);
      }
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      alert('Failed to delete (Are there services attached?)');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 text-[#0077B6] animate-spin" /></div>;
  }

  return (
    <div className="space-y-10">
      {/* Categories Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FolderPlus className="h-5 w-5 text-[#0077B6]" /> Service Categories
            </h2>
          </div>
          <Button onClick={() => { setEditCat(null); setCatForm({ title: '', summary: '', icon_name: 'Folder', is_quote_only: false }); setCatDialogOpen(true); }} className="bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700">
            <Plus className="mr-2 h-4 w-4" /> Add Category
          </Button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          {categories.map(c => (
            <Card key={c.id} className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-zinc-100 flex items-center justify-between text-base">
                  {c.title}
                  <div className="flex gap-1">
                    <button onClick={() => { setEditCat(c); setCatForm({ title: c.title, summary: c.summary || '', icon_name: c.icon_name || 'Folder', is_quote_only: c.is_quote_only || false }); setCatDialogOpen(true); }} className="p-1.5 text-zinc-400 hover:text-white bg-zinc-800 rounded">
                      <Pencil className="h-3 w-3" />
                    </button>
                    <button onClick={() => setDeleteTarget({ type: 'cat', id: c.id, name: c.title })} className="p-1.5 text-red-400 hover:text-red-300 bg-red-950/30 rounded">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-zinc-500 line-clamp-2">{c.summary || 'No summary provided.'}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <hr className="border-zinc-800" />

      {/* Services Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-[#0077B6]" /> Storefront Services
            </h2>
          </div>
          <Button onClick={() => { 
            setEditServ(null); 
            setServForm({ category_id: categories[0]?.id || '', title: '', summary: '', details: '', price: '', icon_name: 'Settings' }); 
            setServDialogOpen(true); 
          }} className="bg-[#0077B6] hover:bg-[#005f8e] text-white">
            <Plus className="mr-2 h-4 w-4" /> Add Service
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {services.map(s => {
            const cat = categories.find(c => c.id === s.category_id);
            return (
              <Card key={s.id} className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#0077B6] tracking-wider">{cat?.title || 'Unknown Category'}</span>
                      <CardTitle className="text-zinc-100 text-base mt-1">{s.title}</CardTitle>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => { 
                        setEditServ(s); 
                        setServForm({ category_id: s.category_id, title: s.title, summary: s.summary || '', details: s.details?.join(', ') || '', price: s.price?.toString() || '', icon_name: s.icon_name || 'Settings' }); 
                        setServDialogOpen(true); 
                      }} className="p-1.5 text-zinc-400 hover:text-white bg-zinc-800 rounded">
                        <Pencil className="h-3 w-3" />
                      </button>
                      <button onClick={() => setDeleteTarget({ type: 'serv', id: s.id, name: s.title })} className="p-1.5 text-red-400 hover:text-red-300 bg-red-950/30 rounded">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-zinc-400 mb-2">{s.summary}</p>
                  <div className="font-bold text-emerald-400 text-sm">
                    {s.price ? `$${s.price.toFixed(2)}` : 'Contact for Price'}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Category Dialog */}
      <Dialog open={catDialogOpen} onOpenChange={setCatDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-700 text-white">
          <DialogHeader>
            <DialogTitle>{editCat ? 'Edit Category' : 'Add Category'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm text-zinc-400">Title</label>
              <Input value={catForm.title} onChange={e => setCatForm(f => ({ ...f, title: e.target.value }))} className="bg-zinc-800 border-zinc-700" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-zinc-400">Summary</label>
              <Input value={catForm.summary} onChange={e => setCatForm(f => ({ ...f, summary: e.target.value }))} className="bg-zinc-800 border-zinc-700" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-zinc-400">Select Icon</label>
              <IconSelector value={catForm.icon_name} onChange={val => setCatForm(f => ({ ...f, icon_name: val }))} />
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-zinc-800">
              <input 
                type="checkbox" 
                id="quote_only"
                checked={catForm.is_quote_only} 
                onChange={e => setCatForm(f => ({ ...f, is_quote_only: e.target.checked }))} 
                className="rounded border-zinc-700 bg-zinc-800 text-[#0077B6] focus:ring-[#0077B6]"
              />
              <label htmlFor="quote_only" className="text-sm text-zinc-300">Require Quote Instead of Purchase</label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCatDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCatSave} disabled={catSaving} className="bg-[#0077B6] hover:bg-[#005f8e] text-white">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Service Dialog */}
      <Dialog open={servDialogOpen} onOpenChange={setServDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-700 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>{editServ ? 'Edit Service' : 'Add Service'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Category</label>
                <select 
                  value={servForm.category_id} 
                  onChange={e => {
                    const newCat = e.target.value;
                    const isQuoteOnly = categories.find(cat => cat.id === newCat)?.is_quote_only;
                    setServForm(f => ({ ...f, category_id: newCat, price: isQuoteOnly ? '' : f.price }));
                  }} 
                  className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:ring-1 focus:ring-[#0077B6] focus:outline-none"
                >
                  {categories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Price (USD)</label>
                <Input 
                  type="number" 
                  value={servForm.category_id === 'project-management' ? '' : servForm.price} 
                  onChange={e => setServForm(f => ({ ...f, price: e.target.value }))} 
                  disabled={servForm.category_id === 'project-management'}
                  className="bg-zinc-800 border-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed" 
                  placeholder={servForm.category_id === 'project-management' ? "Quote Only" : "Leave blank if N/A"} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-zinc-400">Title</label>
              <Input value={servForm.title} onChange={e => setServForm(f => ({ ...f, title: e.target.value }))} className="bg-zinc-800 border-zinc-700" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-zinc-400">Summary</label>
              <Input value={servForm.summary} onChange={e => setServForm(f => ({ ...f, summary: e.target.value }))} className="bg-zinc-800 border-zinc-700" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-zinc-400">Details (comma separated)</label>
              <Input value={servForm.details} onChange={e => setServForm(f => ({ ...f, details: e.target.value }))} className="bg-zinc-800 border-zinc-700" placeholder="e.g. Sub-base, Asphalt, Kerb" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-zinc-400">Select Icon</label>
              <IconSelector value={servForm.icon_name} onChange={val => setServForm(f => ({ ...f, icon_name: val }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setServDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleServSave} disabled={servSaving} className="bg-[#0077B6] hover:bg-[#005f8e] text-white">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              This will permanently delete "{deleteTarget?.name}".
              {deleteTarget?.type === 'cat' && " Warning: You cannot delete a category if it still has services."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 border-zinc-700 text-zinc-300">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-red-700 hover:bg-red-600 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}