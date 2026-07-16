import { useEffect, useState } from 'react';
import type { AppState, Ticket, Equipment, MaintenanceHistory, KnowledgeBase, Inventory, MaintenanceChecklist } from '@/types';

const STORAGE_KEY = 'maintenance_app_state';

export function useOfflineStorage() {
  const [state, setState] = useState<AppState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do localStorage:', error);
    }

    return {
      users: [],
      tickets: [],
      equipment: [],
      maintenanceHistory: [],
      maintenanceChecklist: [],
      knowledgeBase: [],
      inventory: [],
      isOnline: navigator.onLine,
    };
  });

  // Salvar estado no localStorage sempre que mudar
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Erro ao salvar dados no localStorage:', error);
    }
  }, [state]);

  // Monitorar conexão de internet
  useEffect(() => {
    const handleOnline = () => setState(prev => ({ ...prev, isOnline: true, lastSyncTime: Date.now() }));
    const handleOffline = () => setState(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Funções para adicionar/atualizar dados
  const addTicket = (ticket: Ticket) => {
    setState(prev => ({
      ...prev,
      tickets: [...prev.tickets, { ...ticket, synced: false }],
    }));
  };

  const updateTicket = (id: string, updates: Partial<Ticket>) => {
    setState(prev => ({
      ...prev,
      tickets: prev.tickets.map(t =>
        t.id === id ? { ...t, ...updates, synced: false, updatedAt: Date.now() } : t
      ),
    }));
  };

  const deleteTicket = (id: string) => {
    setState(prev => ({
      ...prev,
      tickets: prev.tickets.filter(t => t.id !== id),
    }));
  };

  const addEquipment = (equipment: Equipment) => {
    setState(prev => ({
      ...prev,
      equipment: [...prev.equipment, { ...equipment, synced: false }],
    }));
  };

  const updateEquipment = (id: string, updates: Partial<Equipment>) => {
    setState(prev => ({
      ...prev,
      equipment: prev.equipment.map(e =>
        e.id === id ? { ...e, ...updates, synced: false, updatedAt: Date.now() } : e
      ),
    }));
  };

  const addMaintenanceHistory = (history: MaintenanceHistory) => {
    setState(prev => ({
      ...prev,
      maintenanceHistory: [...prev.maintenanceHistory, { ...history, synced: false }],
    }));
  };

  const addMaintenanceChecklist = (checklist: MaintenanceChecklist) => {
    setState(prev => ({
      ...prev,
      maintenanceChecklist: [...prev.maintenanceChecklist, { ...checklist, synced: false }],
    }));
  };

  const updateMaintenanceChecklist = (id: string, updates: Partial<MaintenanceChecklist>) => {
    setState(prev => ({
      ...prev,
      maintenanceChecklist: prev.maintenanceChecklist.map(c =>
        c.id === id ? { ...c, ...updates, synced: false } : c
      ),
    }));
  };

  const addKnowledgeBase = (kb: KnowledgeBase) => {
    setState(prev => ({
      ...prev,
      knowledgeBase: [...prev.knowledgeBase, { ...kb, synced: false }],
    }));
  };

  const addInventory = (item: Inventory) => {
    setState(prev => ({
      ...prev,
      inventory: [...prev.inventory, { ...item, synced: false }],
    }));
  };

  const updateInventory = (id: string, updates: Partial<Inventory>) => {
    setState(prev => ({
      ...prev,
      inventory: prev.inventory.map(i =>
        i.id === id ? { ...i, ...updates, synced: false, updatedAt: Date.now() } : i
      ),
    }));
  };

  const addCommentToTicket = (ticketId: string, comment: any) => {
    setState(prev => ({
      ...prev,
      tickets: prev.tickets.map(t =>
        t.id === ticketId
          ? { ...t, comments: [...t.comments, { ...comment, synced: false }], synced: false }
          : t
      ),
    }));
  };

  const addNotification = (notification: any) => {
    setState(prev => ({
      ...prev,
      notifications: [...(prev.notifications || []), notification],
    }));
  };

  return {
    state,
    addNotification,
    addTicket,
    updateTicket,
    deleteTicket,
    addEquipment,
    updateEquipment,
    addMaintenanceHistory,
    addMaintenanceChecklist,
    updateMaintenanceChecklist,
    addKnowledgeBase,
    addInventory,
    updateInventory,
    addCommentToTicket,
  };
}
