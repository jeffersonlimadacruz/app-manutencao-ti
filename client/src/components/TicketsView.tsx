import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useOfflineStorage } from '@/hooks/useOfflineStorage';
import { useLocalAuth } from '@/hooks/useLocalAuth';
import { Plus, Trash2, CheckCircle2, AlertCircle, Bell } from 'lucide-react';
import type { Ticket } from '@/types';

export default function TicketsView() {
  const { state, addTicket, updateTicket, deleteTicket, addCommentToTicket, addNotification } = useOfflineStorage();
  const { currentUser, isTecnico } = useLocalAuth();
  const [showForm, setShowForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [comment, setComment] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sector: '',
    equipment: '',
    priority: 'media' as const,
  });

  const handleAddTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const newTicket: Ticket = {
      id: `ticket_${Date.now()}`,
      title: formData.title,
      description: formData.description,
      sector: formData.sector,
      equipment: formData.equipment || undefined,
      status: 'aberto',
      priority: formData.priority,
      createdBy: currentUser.id,
      createdByName: currentUser.name || 'Usuário',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      comments: [],
      notified: false,
    };

    addTicket(newTicket);

    // Notificar técnicos se usuário normal criou chamado
    if (!isTecnico) {
      addNotification({
        id: `notif_${Date.now()}`,
        type: 'novo_chamado',
        ticketId: newTicket.id,
        message: `Novo chamado: ${newTicket.title}`,
        read: false,
        createdAt: Date.now(),
      });
    }

    setFormData({ title: '', description: '', sector: '', equipment: '', priority: 'media' });
    setShowForm(false);
  };

  const handleAddComment = () => {
    if (!selectedTicket || !currentUser || !comment.trim()) return;

    addCommentToTicket(selectedTicket.id, {
      id: `comment_${Date.now()}`,
      ticketId: selectedTicket.id,
      userId: currentUser.id,
      userName: currentUser.name || 'Usuário',
      comment,
      createdAt: Date.now(),
    });

    setComment('');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critica':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'alta':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'media':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolvido':
        return 'text-green-400';
      case 'em_andamento':
        return 'text-blue-400';
      case 'fechado':
        return 'text-slate-400';
      default:
        return 'text-yellow-400';
    }
  };

  // Filtrar tickets baseado no tipo de usuário
  const visibleTickets = isTecnico
    ? state.tickets
    : state.tickets.filter(t => t.createdBy === currentUser?.id);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-white">Chamados</h3>
          <p className="text-sm text-slate-400">
            {isTecnico ? 'Todos os chamados' : 'Seus chamados'}
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-cyan-600 hover:bg-cyan-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Chamado
        </Button>
      </div>

      {showForm && (
        <Card className="bg-slate-800 border-slate-700 p-6">
          <form onSubmit={handleAddTicket} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-300 mb-1">Título</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Descrição breve do problema"
                required
                className="bg-slate-700 border-slate-600"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-1">Descrição</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detalhes do problema"
                required
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1">Setor</label>
                <Input
                  value={formData.sector}
                  onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                  placeholder="Ex: RH, TI, Financeiro"
                  required
                  className="bg-slate-700 border-slate-600"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1">Equipamento</label>
                <Input
                  value={formData.equipment}
                  onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                  placeholder="Ex: PC-001"
                  className="bg-slate-700 border-slate-600"
                />
              </div>
            </div>

            {isTecnico && (
              <div>
                <label className="block text-sm text-slate-300 mb-1">Prioridade</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                >
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                  <option value="critica">Crítica</option>
                </select>
              </div>
            )}

            <div className="flex gap-2">
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Criar Chamado
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {visibleTickets.length === 0 ? (
            <Card className="bg-slate-800 border-slate-700 p-6 text-center">
              <p className="text-slate-400">
                {isTecnico ? 'Nenhum chamado registrado' : 'Você não tem chamados'}
              </p>
            </Card>
          ) : (
            visibleTickets.map((ticket) => (
              <Card
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className={`bg-slate-800 border-slate-700 p-4 cursor-pointer transition-all hover:border-cyan-500 ${
                  selectedTicket?.id === ticket.id ? 'border-cyan-500 bg-slate-700' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="text-white font-semibold">{ticket.title}</h4>
                    <p className="text-sm text-slate-400">
                      {ticket.sector} • {ticket.createdByName}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded text-xs border ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-slate-400 line-clamp-2">{ticket.description}</p>
              </Card>
            ))
          )}
        </div>

        {selectedTicket && (
          <Card className="bg-slate-800 border-slate-700 p-4 h-fit sticky top-6">
            <div className="space-y-4">
              <div>
                <h5 className="text-white font-semibold mb-2">{selectedTicket.title}</h5>
                <p className="text-sm text-slate-400">{selectedTicket.description}</p>
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-slate-400">Criado por:</span>
                  <p className="text-white">{selectedTicket.createdByName}</p>
                </div>

                {isTecnico && (
                  <div>
                    <span className="text-slate-400">Status:</span>
                    <select
                      value={selectedTicket.status}
                      onChange={(e) => updateTicket(selectedTicket.id, { status: e.target.value as any })}
                      className="w-full mt-1 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                    >
                      <option value="aberto">Aberto</option>
                      <option value="em_andamento">Em Andamento</option>
                      <option value="resolvido">Resolvido</option>
                      <option value="fechado">Fechado</option>
                    </select>
                  </div>
                )}

                {selectedTicket.equipment && (
                  <div>
                    <span className="text-slate-400">Equipamento:</span>
                    <p className="text-white">{selectedTicket.equipment}</p>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-700 pt-4">
                <h6 className="text-white font-semibold mb-2">Comentários ({selectedTicket.comments.length})</h6>
                <div className="space-y-2 max-h-40 overflow-y-auto mb-3">
                  {selectedTicket.comments.map((c) => (
                    <div key={c.id} className="bg-slate-700/50 p-2 rounded text-xs">
                      <p className="text-cyan-400 font-semibold">{c.userName}</p>
                      <p className="text-slate-300">{c.comment}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Adicionar comentário..."
                    className="bg-slate-700 border-slate-600 text-sm"
                  />
                  <Button
                    onClick={handleAddComment}
                    size="sm"
                    className="bg-cyan-600 hover:bg-cyan-700"
                  >
                    OK
                  </Button>
                </div>
              </div>

              {isTecnico && (
                <Button
                  onClick={() => {
                    deleteTicket(selectedTicket.id);
                    setSelectedTicket(null);
                  }}
                  variant="outline"
                  className="w-full bg-red-600/10 border-red-600/20 text-red-400 hover:bg-red-600/20"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Deletar
                </Button>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
