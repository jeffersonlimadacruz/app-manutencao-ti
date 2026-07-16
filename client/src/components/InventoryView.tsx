import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useOfflineStorage } from '@/hooks/useOfflineStorage';
import { Plus, AlertTriangle } from 'lucide-react';

export default function InventoryView() {
  const { state, addInventory, updateInventory } = useOfflineStorage();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: 0,
    minimumQuantity: 5,
    unit: '',
    supplier: '',
    cost: 0,
  });

  const handleAddInventory = (e: React.FormEvent) => {
    e.preventDefault();

    addInventory({
      id: `inv_${Date.now()}`,
      name: formData.name,
      category: formData.category,
      quantity: formData.quantity,
      minimumQuantity: formData.minimumQuantity,
      unit: formData.unit,
      supplier: formData.supplier || undefined,
      cost: formData.cost || undefined,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    setFormData({
      name: '',
      category: '',
      quantity: 0,
      minimumQuantity: 5,
      unit: '',
      supplier: '',
      cost: 0,
    });
    setShowForm(false);
  };

  const lowStockItems = state.inventory.filter(
    (item) => item.quantity <= item.minimumQuantity
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-white">Estoque de Peças</h3>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-cyan-600 hover:bg-cyan-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Item
        </Button>
      </div>

      {lowStockItems.length > 0 && (
        <Card className="bg-yellow-500/10 border-yellow-500/20 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-yellow-400 font-semibold mb-1">Itens com Estoque Baixo</h4>
              <p className="text-sm text-yellow-300">
                {lowStockItems.map((item) => item.name).join(', ')}
              </p>
            </div>
          </div>
        </Card>
      )}

      {showForm && (
        <Card className="bg-slate-800 border-slate-700 p-6">
          <form onSubmit={handleAddInventory} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-300 mb-1">Nome do Item</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: RAM DDR4 8GB"
                required
                className="bg-slate-700 border-slate-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1">Categoria</label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Ex: Memória, Cabo"
                  required
                  className="bg-slate-700 border-slate-600"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1">Unidade</label>
                <Input
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  placeholder="Ex: un, m, kg"
                  required
                  className="bg-slate-700 border-slate-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1">Quantidade</label>
                <Input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                  required
                  className="bg-slate-700 border-slate-600"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1">Mínimo</label>
                <Input
                  type="number"
                  value={formData.minimumQuantity}
                  onChange={(e) =>
                    setFormData({ ...formData, minimumQuantity: parseInt(e.target.value) })
                  }
                  className="bg-slate-700 border-slate-600"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1">Custo (R$)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) })}
                  className="bg-slate-700 border-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-1">Fornecedor</label>
              <Input
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                placeholder="Nome do fornecedor"
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
        {state.inventory.length === 0 ? (
          <Card className="bg-slate-800 border-slate-700 p-6 col-span-full text-center">
            <p className="text-slate-400">Nenhum item no estoque</p>
          </Card>
        ) : (
          state.inventory.map((item) => (
            <Card
              key={item.id}
              className={`border-slate-700 p-4 ${
                item.quantity <= item.minimumQuantity
                  ? 'bg-yellow-500/10 border-yellow-500/20'
                  : 'bg-slate-800'
              }`}
            >
              <h4 className="text-white font-semibold mb-2">{item.name}</h4>
              <p className="text-sm text-slate-400 mb-3">{item.category}</p>

              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Quantidade:</span>
                  <span
                    className={
                      item.quantity <= item.minimumQuantity
                        ? 'text-yellow-400 font-semibold'
                        : 'text-white'
                    }
                  >
                    {item.quantity} {item.unit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Mínimo:</span>
                  <span className="text-white">{item.minimumQuantity}</span>
                </div>
                {item.cost && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Custo:</span>
                    <span className="text-white">R$ {item.cost.toFixed(2)}</span>
                  </div>
                )}
                {item.supplier && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Fornecedor:</span>
                    <span className="text-white text-xs">{item.supplier}</span>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
