// Tipos para o sistema de manutenção de TI

export interface User {
  id: string;
  name?: string;
  email?: string;
  role: 'tecnico' | 'gerente' | 'admin' | 'chefe';
  userType: 'tecnico' | 'usuario';
  createdAt: number;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'aberto' | 'em_andamento' | 'resolvido' | 'fechado';
  priority: 'baixa' | 'media' | 'alta' | 'critica';
  sector: string;
  equipment?: string;
  assignedTo?: string;
  createdBy: string;
  createdByName?: string;
  createdAt: number;
  updatedAt: number;
  resolvedAt?: number;
  resolution?: string;
  comments: TicketComment[];
  synced?: boolean;
  notified?: boolean;
}

export interface TicketComment {
  id: string;
  ticketId: string;
  userId: string;
  userName: string;
  comment: string;
  createdAt: number;
  synced?: boolean;
}

export interface Equipment {
  id: string;
  name: string;
  type: 'pc' | 'impressora' | 'servidor' | 'switch' | 'roteador' | 'outro';
  brand?: string;
  model?: string;
  serialNumber?: string;
  location: string;
  status: 'ativo' | 'manutencao' | 'descartado';
  purchaseDate?: number;
  warrantyExpiry?: number;
  notes?: string;
  createdAt: number;
  updatedAt: number;
  synced?: boolean;
}

export interface MaintenanceHistory {
  id: string;
  equipmentId: string;
  type: 'preventiva' | 'corretiva' | 'limpeza' | 'atualizacao';
  description: string;
  technician: string;
  technicianName: string;
  partsUsed?: string;
  hoursSpent?: number;
  createdAt: number;
  synced?: boolean;
}

export interface MaintenanceChecklist {
  id: string;
  equipmentId: string;
  scheduledDate: number;
  completedDate?: number;
  completed: boolean;
  notes?: string;
  createdAt: number;
  synced?: boolean;
}

export interface KnowledgeBase {
  id: string;
  title: string;
  category: string;
  content: string;
  tags?: string[];
  createdBy: string;
  createdAt: number;
  updatedAt: number;
  synced?: boolean;
}

export interface Inventory {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minimumQuantity: number;
  unit: string;
  supplier?: string;
  cost?: number;
  notes?: string;
  createdAt: number;
  updatedAt: number;
  synced?: boolean;
}

export interface Notification {
  id: string;
  type: 'novo_chamado' | 'chamado_atualizado' | 'comentario';
  ticketId: string;
  message: string;
  read: boolean;
  createdAt: number;
}

export interface AppState {
  users: User[];
  tickets: Ticket[];
  equipment: Equipment[];
  maintenanceHistory: MaintenanceHistory[];
  maintenanceChecklist: MaintenanceChecklist[];
  knowledgeBase: KnowledgeBase[];
  inventory: Inventory[];
  notifications: Notification[];
  lastSyncTime?: number;
  isOnline: boolean;
}
