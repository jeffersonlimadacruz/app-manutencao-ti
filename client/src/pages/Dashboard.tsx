import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useLocalAuth } from '@/hooks/useLocalAuth';
import { useOfflineStorage } from '@/hooks/useOfflineStorage';
import TicketsView from '@/components/TicketsView';
import EquipmentView from '@/components/EquipmentView';
import MaintenanceView from '@/components/MaintenanceView';
import KnowledgeBaseView from '@/components/KnowledgeBaseView';
import InventoryView from '@/components/InventoryView';
import { LogOut, Wifi, WifiOff, Menu, X } from 'lucide-react';
import { StatusIndicator } from '@/components/StatusIndicator';

type View = 'tickets' | 'equipment' | 'maintenance' | 'knowledge' | 'inventory';

export default function Dashboard() {
  const { currentUser, logout } = useLocalAuth();
  const { state } = useOfflineStorage();
  const [currentView, setCurrentView] = useState<View>('tickets');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    if (confirm('Tem certeza que deseja sair?')) {
      logout();
      window.location.href = '/';
    }
  };

  const menuItems = [
    { id: 'tickets', label: 'Chamados', icon: '🎫' },
    { id: 'equipment', label: 'Equipamentos', icon: '💻' },
    { id: 'maintenance', label: 'Manutenção', icon: '🔧' },
    { id: 'knowledge', label: 'Base de Conhecimento', icon: '📚' },
    { id: 'inventory', label: 'Estoque', icon: '📦' },
  ];

  return (
    <div className="flex h-screen bg-slate-900">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-slate-800 border-r border-slate-700 transition-all duration-300 overflow-hidden flex flex-col`}
      >
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">⚙️</span>
            </div>
            <div>
              <h1 className="text-white font-bold">Manutenção TI</h1>
              <p className="text-xs text-slate-400">Prefeitura</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as View)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                currentView === item.id
                  ? 'bg-cyan-600 text-white'
                  : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700 space-y-3">
          <div className="px-4 py-2 bg-slate-700/50 rounded-lg">
            <p className="text-xs text-slate-400">Usuário</p>
            <p className="text-sm text-white font-medium">{currentUser?.name}</p>
            <p className="text-xs text-slate-400">{currentUser?.email}</p>
          </div>

          <div className="px-4 py-2 bg-slate-700/50 rounded-lg">
            <p className="text-xs text-slate-400 mb-2">Status</p>
            <StatusIndicator />
          </div>

          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full bg-red-600/10 border-red-600/20 text-red-400 hover:bg-red-600/20"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-slate-300 hover:text-white"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <h2 className="text-xl font-bold text-white">
            {menuItems.find(m => m.id === currentView)?.label}
          </h2>

          <div className="text-sm text-slate-400">
            {state.lastSyncTime && (
              <span>Sincronizado: {new Date(state.lastSyncTime).toLocaleTimeString('pt-BR')}</span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {currentView === 'tickets' && <TicketsView />}
          {currentView === 'equipment' && <EquipmentView />}
          {currentView === 'maintenance' && <MaintenanceView />}
          {currentView === 'knowledge' && <KnowledgeBaseView />}
          {currentView === 'inventory' && <InventoryView />}
        </div>
      </div>
    </div>
  );
}
