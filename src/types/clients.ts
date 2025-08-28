import { z } from 'zod';

// Schemas de validação
export const ClientAddressSchema = z.object({
  id: z.string().uuid().optional(),
  address_type: z.enum(['main', 'billing', 'delivery', 'other']),
  street: z.string().min(1, 'Rua é obrigatória'),
  number: z.string().min(1, 'Número é obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, 'Bairro é obrigatório'),
  city: z.string().min(1, 'Cidade é obrigatória'),
  state: z.string().length(2, 'Estado deve ter 2 caracteres'),
  zip_code: z.string().min(8, 'CEP deve ter pelo menos 8 caracteres'),
  country: z.string().default('Brasil'),
  is_primary: z.boolean().default(false)
});

export const ClientContactSchema = z.object({
  id: z.string().uuid().optional(),
  contact_type: z.enum(['phone', 'mobile', 'email', 'whatsapp']),
  contact_value: z.string().min(1, 'Valor do contato é obrigatório'),
  description: z.string().optional(),
  is_primary: z.boolean().default(false),
  is_whatsapp: z.boolean().default(false)
});

export const ClientPersonSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Nome é obrigatório'),
  role: z.string().optional(),
  department: z.string().optional(),
  email: z.string().email('Email inválido').optional(),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  is_primary: z.boolean().default(false),
  is_decision_maker: z.boolean().default(false)
});

export const ClientSchema = z.object({
  id: z.string().uuid().optional(),
  code: z.string().min(1, 'Código é obrigatório'),
  company_name: z.string().min(1, 'Razão social é obrigatória'),
  trade_name: z.string().optional(),
  document_type: z.enum(['CNPJ', 'CPF']),
  document_number: z.string().min(11, 'Documento deve ter pelo menos 11 caracteres'),
  state_registration: z.string().optional(),
  municipal_registration: z.string().optional(),
  client_type: z.enum(['strategic', 'regular', 'prospect']),
  segment: z.string().optional(),
  size: z.enum(['micro', 'small', 'medium', 'large']).optional(),
  status: z.enum(['active', 'inactive', 'suspended', 'prospect']),
  website: z.string().url().optional().or(z.literal('')),
  notes: z.string().optional(),
  addresses: z.array(ClientAddressSchema).default([]),
  contacts: z.array(ClientContactSchema).default([]),
  persons: z.array(ClientPersonSchema).default([]),
  // Campos de métricas
  last_contact: z.string().optional(),
  revenue_potential: z.number().min(0).optional(),
  satisfaction_score: z.number().min(0).max(10).optional(),
  risk_level: z.enum(['low', 'medium', 'high']).optional(),
  next_action: z.string().optional(),
  priority: z.enum(['high', 'medium', 'low']).optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
});

// Tipos derivados dos schemas
export type ClientAddress = z.infer<typeof ClientAddressSchema>;
export type ClientContact = z.infer<typeof ClientContactSchema>;
export type ClientPerson = z.infer<typeof ClientPersonSchema>;
export type Client = z.infer<typeof ClientSchema>;

// Tipos para formulários
export type ClientFormData = Omit<Client, 'id' | 'created_at' | 'updated_at'>;
export type AddressFormData = Omit<ClientAddress, 'id'>;
export type ContactFormData = Omit<ClientContact, 'id'>;
export type PersonFormData = Omit<ClientPerson, 'id'>;

// Tipos para filtros e busca
export interface ClientFilters {
  searchTerm: string;
  clientType: string;
  status: string;
  priority: string;
  segment: string;
  size: string;
}

export interface ClientMetrics {
  totalClients: number;
  strategicClients: number;
  activeClients: number;
  prospects: number;
  highPriority: number;
  overdueContacts: number;
  totalRevenue: number;
  avgSatisfaction: number;
}

// Tipos para operações
export interface ClientCreateData extends Omit<Client, 'id' | 'created_at' | 'updated_at'> {}
export interface ClientUpdateData extends Partial<Omit<Client, 'id' | 'created_at' | 'updated_at'>> {}

// Enums para melhor type safety
export enum ClientType {
  STRATEGIC = 'strategic',
  REGULAR = 'regular',
  PROSPECT = 'prospect'
}

export enum ClientStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PROSPECT = 'prospect'
}

export enum ClientPriority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

export enum ClientSize {
  MICRO = 'micro',
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large'
}

export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}
