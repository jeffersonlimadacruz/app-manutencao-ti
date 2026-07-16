import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useOfflineStorage } from '@/hooks/useOfflineStorage';
import { Plus, Trash2 } from 'lucide-react';
import type { Equipment } from '@/types';

const deleteEquipment = (id: string) => {
  // Placeholder para delete
  console.log('Delete:', id);
};

export default function EquipmentView() {
  const { state, addEquipment } = useOfflineStorage();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'pc' as const,
    brand: '',
    model: '',
    serialNumber: '',
    location: '',
  });

  const handleAddEquipment = (e: React.FormEvent) => {
    e.preventDefault();

    const newEquipment: Equipment = {
      id: `eq_${Date.now()}`,
      name: formData.name,
      type: formData.type,
      brand: formData.brand || undefined,
      model: formData.model || undefined,
      serialNumber: formData.serialNumber || undefined,
      location: formData.location,
      status: 'ativo',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    addEquipment(newEquipment);
    setFormData({ name: '', type: 'pc', brand: '', model: '', serialNumber: '', location: '' });
    setShowForm(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pc':
        return '💻';
      case 'impressora':
        return '🖨️';
      case 'servidor':
        return '🖥️';
      case 'switch':
        return '🔌';
      case 'roteador':
        return '📡';
      default:
        return '⚙️';
    }
  };

  const handleDeleteEquipment = (id: string) => {
    if (confirm('Tem certeza que deseja deletar este equipamento?')) {
      // Deletar equipamento
      const updated = state.equipment.filter(e => e.id !== id);
      // Nota: implementar função de delete no hook
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-white">Inventário de Equipamentos</h3>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-cyan-600 hover:bg-cyan-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Equipamento
        </Button>
      </div>

      {showForm && (
        <Card className="bg-slate-800 border-slate-700 p-6">
          <form onSubmit={handleAddEquipment} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-300 mb-1">Nome</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: PC-001, Impressora-RH"
                required
                className="bg-slate-700 border-slate-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1">Tipo</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                >
                  <option value="pc">PC</option>
                  <option value="impressora">Impressora</option>
                  <option value="servidor">Servidor</option>
                  <option value="switch">Switch</option>
                  <option value="roteador">Roteador</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1">Localização</label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Ex: Sala 101"
                  required
                  className="bg-slate-700 border-slate-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1">Marca</label>
                <Input
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="Ex: Dell, HP"
                  className="bg-slate-700 border-slate-600"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1">Modelo</label>
                <Input
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder="Ex: OptiPlex 7090"
                  className="bg-slate-700 border-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-1">Número de Série</label>
              <Input
                value={formData.serialNumber}
                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                placeholder="Número de série"
                className="bg-slate-700 border-slate-600"
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Adicionar
              </Button>
              <Button
                type="button"
                onClick={() => setShowForm(false)}
                variant="outline"
                className="bg-slate-700 border-slate-600"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {state.equipment.length === 0 ? (
          <Card className="bg-slate-800 border-slate-700 p-6 col-span-full text-center">
            <p className="text-slate-400">Nenhum equipamento registrado</p>
          </Card>
        ) : (
          state.equipment.map((eq) => (
            <Card key={eq.id} className="bg-slate-800 border-slate-700 p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">{getTypeIcon(eq.type)}</div>
                <Button
                  onClick={() => handleDeleteEquipment(eq.id)}
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <h4 className="text-white font-semibold mb-1">{eq.name}</h4>
              <p className="text-sm text-slate-400 mb-3">{eq.type}</p>

              <div className="space-y-1 text-xs text-slate-400">
                {eq.brand && <p><span className="text-slate-300">Marca:</span> {eq.brand}</p>}
                {eq.model && <p><span className="text-slate-300">Modelo:</span> {eq.model}</p>}
                <p><span className="text-slate-300">Local:</span> {eq.location}</p>
                <p className={`${eq.status === 'ativo' ? 'text-green-400' : 'text-yellow-400'}`}>
                  <span className="text-slate-300">Status:</span> {eq.status}
                </p>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
