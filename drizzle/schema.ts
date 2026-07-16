import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Chamados/Tickets de manutenção
 */
export const tickets = mysqlTable("tickets", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  status: mysqlEnum("status", ["aberto", "em_andamento", "resolvido", "fechado"]).default("aberto").notNull(),
  priority: mysqlEnum("priority", ["baixa", "media", "alta", "critica"]).default("media").notNull(),
  sector: varchar("sector", { length: 255 }).notNull(),
  equipment: varchar("equipment", { length: 255 }),
  assignedTo: int("assignedTo").references(() => users.id),
  createdBy: int("createdBy").notNull().references(() => users.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  resolvedAt: timestamp("resolvedAt"),
  resolution: text("resolution"),
});

export type Ticket = typeof tickets.$inferSelect;
export type InsertTicket = typeof tickets.$inferInsert;

/**
 * Comentários em tickets
 */
export const ticketComments = mysqlTable("ticketComments", {
  id: int("id").autoincrement().primaryKey(),
  ticketId: int("ticketId").notNull().references(() => tickets.id),
  userId: int("userId").notNull().references(() => users.id),
  comment: text("comment").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TicketComment = typeof ticketComments.$inferSelect;
export type InsertTicketComment = typeof ticketComments.$inferInsert;

/**
 * Inventário de equipamentos
 */
export const equipment = mysqlTable("equipment", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["pc", "impressora", "servidor", "switch", "roteador", "outro"]).notNull(),
  brand: varchar("brand", { length: 255 }),
  model: varchar("model", { length: 255 }),
  serialNumber: varchar("serialNumber", { length: 255 }).unique(),
  location: varchar("location", { length: 255 }).notNull(),
  status: mysqlEnum("status", ["ativo", "manutencao", "descartado"]).default("ativo").notNull(),
  purchaseDate: timestamp("purchaseDate"),
  warrantyExpiry: timestamp("warrantyExpiry"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Equipment = typeof equipment.$inferSelect;
export type InsertEquipment = typeof equipment.$inferInsert;

/**
 * Histórico de manutenção de equipamentos
 */
export const maintenanceHistory = mysqlTable("maintenanceHistory", {
  id: int("id").autoincrement().primaryKey(),
  equipmentId: int("equipmentId").notNull().references(() => equipment.id),
  type: mysqlEnum("type", ["preventiva", "corretiva", "limpeza", "atualizacao"]).notNull(),
  description: text("description").notNull(),
  technician: int("technician").notNull().references(() => users.id),
  partsUsed: text("partsUsed"),
  hoursSpent: decimal("hoursSpent", { precision: 5, scale: 2 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MaintenanceHistory = typeof maintenanceHistory.$inferSelect;
export type InsertMaintenanceHistory = typeof maintenanceHistory.$inferInsert;

/**
 * Checklist de manutenção preventiva
 */
export const maintenanceChecklist = mysqlTable("maintenanceChecklist", {
  id: int("id").autoincrement().primaryKey(),
  equipmentId: int("equipmentId").notNull().references(() => equipment.id),
  scheduledDate: timestamp("scheduledDate").notNull(),
  completedDate: timestamp("completedDate"),
  completed: boolean("completed").default(false).notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MaintenanceChecklist = typeof maintenanceChecklist.$inferSelect;
export type InsertMaintenanceChecklist = typeof maintenanceChecklist.$inferInsert;

/**
 * Base de conhecimento - Soluções e procedimentos
 */
export const knowledgeBase = mysqlTable("knowledgeBase", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 255 }).notNull(),
  content: text("content").notNull(),
  tags: varchar("tags", { length: 500 }),
  createdBy: int("createdBy").notNull().references(() => users.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type KnowledgeBase = typeof knowledgeBase.$inferSelect;
export type InsertKnowledgeBase = typeof knowledgeBase.$inferInsert;

/**
 * Estoque de peças e materiais
 */
export const inventory = mysqlTable("inventory", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 255 }).notNull(),
  quantity: int("quantity").notNull().default(0),
  minimumQuantity: int("minimumQuantity").notNull().default(5),
  unit: varchar("unit", { length: 50 }).notNull(),
  supplier: varchar("supplier", { length: 255 }),
  cost: decimal("cost", { precision: 10, scale: 2 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Inventory = typeof inventory.$inferSelect;
export type InsertInventory = typeof inventory.$inferInsert;