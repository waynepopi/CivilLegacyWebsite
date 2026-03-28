import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { AuthContext } from '../../App';
import { Plus, Trash2, Edit } from 'lucide-react';

export default function ServicesTab() {
  const { state, addService, deleteService } = useAppData();
  const { user } = React.useContext(AuthContext);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');

  const canEdit = user?.role === 'Master' || user?.permissions?.canEditContent;

  const handleAdd = () => {
    if (!newServiceName || !newServicePrice) return;
    addService({
      id: Date.now().toString(),
      name: newServiceName,
      description: 'New service description',
      price: parseFloat(newServicePrice)
    });
    setNewServiceName('');
    setNewServicePrice('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Services</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {state.services.map(service => (
          <Card key={service.id} className="bg-zinc-900 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-100">{service.name}</CardTitle>
              <div className="flex space-x-2">
                {canEdit && (
                  <>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-400 hover:text-blue-300">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-300" onClick={() => deleteService(service.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">${service.price.toFixed(2)}</div>
              <p className="text-xs text-zinc-400 mt-1">{service.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {canEdit && (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-zinc-100">Add New Service</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4 items-end">
              <div className="space-y-2 flex-1">
                <label className="text-sm text-zinc-400">Name</label>
                <Input
                  value={newServiceName}
                  onChange={e => setNewServiceName(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="E.g. Consultation"
                />
              </div>
              <div className="space-y-2 w-32">
                <label className="text-sm text-zinc-400">Price</label>
                <Input
                  type="number"
                  value={newServicePrice}
                  onChange={e => setNewServicePrice(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="0.00"
                />
              </div>
              <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" /> Add
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}