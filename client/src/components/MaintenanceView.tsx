import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useOfflineStorage } from '@/hooks/useOfflineStorage';
import { Plus } from 'lucide-react';

export default function MaintenanceView() {
  const { state, updateMaintenanceChecklist } = useOfflineStorage();
  const [showForm, setShowForm] = useState(false);

  const handleCompleteChecklist = (id: string) => {
    updateMaintenanceChecklist(id, {
      completed: true,
      completedDate: Date.now(),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-white">Manutenção</h3>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-cyan-600 hover:bg-cyan-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Registro
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Histórico</h4>
          <div className="space-y-3">
            {state.maintenanceHistory.length === 0 ? (
              <Card className="bg-slate-800 border-slate-700 p-4 text-center">
                <p className="text-slate-400">Nenhum registro de manutenção</p>
              </Card>
            ) : (
              state.maintenanceHistory.map((mh) => (
                <Card key={mh.id} className="bg-slate-800 border-slate-700 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-white font-semibold">{mh.type}</p>
                      <p className="text-sm text-slate-400">{mh.technicianName}</p>
                    </div>
                    <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded">
                      {mh.hoursSpent ? `${mh.hoursSpent}h` : '-'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300">{mh.description}</p>
                  {mh.partsUsed && (
                    <p className="text-xs text-slate-400 mt-2">Peças: {mh.partsUsed}</p>
                  )}
                </Card>
              ))
            )}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Checklist Preventiva</h4>
          <div className="space-y-3">
            {state.maintenanceChecklist.length === 0 ? (
              <Card className="bg-slate-800 border-slate-700 p-4 text-center">
                <p className="text-slate-400">Nenhum checklist agendado</p>
              </Card>
            ) : (
              state.maintenanceChecklist.map((mc) => (
                <Card
                  key={mc.id}
                  className={`border-slate-700 p-4 ${
                    mc.completed ? 'bg-green-500/10 border-green-500/20' : 'bg-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-white font-semibold">
                        {mc.completed ? '✓' : '○'} Manutenção Agendada
                      </p>
                      <p className="text-sm text-slate-400">
                        {new Date(mc.scheduledDate).toLocaleDateString('pt-BR')}
                      </p>
                      {mc.notes && (
                        <p className="text-sm text-slate-300 mt-2">{mc.notes}</p>
                      )}
                    </div>
                    {!mc.completed && (
                      <Button
                        onClick={() => handleCompleteChecklist(mc.id)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Marcar Pronto
                      </Button>
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
