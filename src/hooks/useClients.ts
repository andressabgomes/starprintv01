import { useState, useCallback, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useDebounce } from '@/hooks/usePerformance';
import { useDataCache } from '@/hooks/useDataCache';
import { 
  Client, 
  ClientCreateData, 
  ClientUpdateData, 
  ClientFilters, 
  ClientMetrics,
  ClientSchema,
  ClientAddressSchema,
  ClientContactSchema,
  ClientPersonSchema
} from '@/types/clients';

// Chaves para React Query
const CLIENT_KEYS = {
  all: ['clients'] as const,
  lists: () => [...CLIENT_KEYS.all, 'list'] as const,
  list: (filters: ClientFilters) => [...CLIENT_KEYS.lists(), filters] as const,
  details: () => [...CLIENT_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...CLIENT_KEYS.details(), id] as const,
  metrics: () => [...CLIENT_KEYS.all, 'metrics'] as const,
} as const;

// Serviços de API
const clientService = {
  async fetchClients(filters: ClientFilters = {}): Promise<Client[]> {
    let query = supabase
      .from('clients')
      .select(`
        *,
        addresses:client_addresses(*),
        contacts:client_contacts(*),
        persons:client_persons(*)
      `);

    // Aplicar filtros
    if (filters.searchTerm) {
      query = query.or(`company_name.ilike.%${filters.searchTerm}%,trade_name.ilike.%${filters.searchTerm}%,document_number.ilike.%${filters.searchTerm}%`);
    }
    if (filters.clientType && filters.clientType !== 'all') {
      query = query.eq('client_type', filters.clientType);
    }
    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }
    if (filters.priority && filters.priority !== 'all') {
      query = query.eq('priority', filters.priority);
    }
    if (filters.segment && filters.segment !== 'all') {
      query = query.eq('segment', filters.segment);
    }
    if (filters.size && filters.size !== 'all') {
      query = query.eq('size', filters.size);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Erro ao buscar clientes: ${error.message}`);
    }

    return data || [];
  },

  async fetchClient(id: string): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .select(`
        *,
        addresses:client_addresses(*),
        contacts:client_contacts(*),
        persons:client_persons(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Erro ao buscar cliente: ${error.message}`);
    }

    return data;
  },

  async createClient(clientData: ClientCreateData): Promise<Client> {
    // Validar dados
    const validatedData = ClientSchema.parse(clientData);

    const { data, error } = await supabase
      .from('clients')
      .insert([validatedData])
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao criar cliente: ${error.message}`);
    }

    return data;
  },

  async updateClient(id: string, clientData: ClientUpdateData): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .update(clientData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao atualizar cliente: ${error.message}`);
    }

    return data;
  },

  async deleteClient(id: string): Promise<void> {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Erro ao deletar cliente: ${error.message}`);
    }
  },

  async fetchMetrics(): Promise<ClientMetrics> {
    const { data: clients, error } = await supabase
      .from('clients')
      .select('client_type, status, priority, revenue_potential, satisfaction_score');

    if (error) {
      throw new Error(`Erro ao buscar métricas: ${error.message}`);
    }

    const metrics: ClientMetrics = {
      totalClients: clients?.length || 0,
      strategicClients: clients?.filter(c => c.client_type === 'strategic').length || 0,
      activeClients: clients?.filter(c => c.status === 'active').length || 0,
      prospects: clients?.filter(c => c.status === 'prospect').length || 0,
      highPriority: clients?.filter(c => c.priority === 'high').length || 0,
      overdueContacts: 0, // Implementar lógica específica
      totalRevenue: clients?.reduce((sum, c) => sum + (c.revenue_potential || 0), 0) || 0,
      avgSatisfaction: clients?.length ? 
        clients.reduce((sum, c) => sum + (c.satisfaction_score || 0), 0) / clients.length : 0
    };

    return metrics;
  }
};

// Hook principal para gestão de clientes
export const useClients = (filters: ClientFilters = {}) => {
  const queryClient = useQueryClient();
  const debouncedFilters = useDebounce(filters, 300);
  const cache = useDataCache<Client[]>('clients-list');

  // Query para buscar clientes
  const {
    data: clients = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: CLIENT_KEYS.list(debouncedFilters),
    queryFn: () => clientService.fetchClients(debouncedFilters),
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Query para métricas
  const {
    data: metrics,
    isLoading: metricsLoading
  } = useQuery({
    queryKey: CLIENT_KEYS.metrics(),
    queryFn: clientService.fetchMetrics,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });

  // Mutations
  const createClientMutation = useMutation({
    mutationFn: clientService.createClient,
    onSuccess: (newClient) => {
      queryClient.invalidateQueries({ queryKey: CLIENT_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: CLIENT_KEYS.metrics() });
      cache.invalidate();
      toast({
        title: "Sucesso",
        description: "Cliente criado com sucesso!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const updateClientMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ClientUpdateData }) => 
      clientService.updateClient(id, data),
    onSuccess: (updatedClient) => {
      queryClient.invalidateQueries({ queryKey: CLIENT_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: CLIENT_KEYS.detail(updatedClient.id) });
      queryClient.invalidateQueries({ queryKey: CLIENT_KEYS.metrics() });
      cache.invalidate();
      toast({
        title: "Sucesso",
        description: "Cliente atualizado com sucesso!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const deleteClientMutation = useMutation({
    mutationFn: clientService.deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENT_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: CLIENT_KEYS.metrics() });
      cache.invalidate();
      toast({
        title: "Sucesso",
        description: "Cliente removido com sucesso!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Funções de conveniência
  const createClient = useCallback((data: ClientCreateData) => {
    return createClientMutation.mutateAsync(data);
  }, [createClientMutation]);

  const updateClient = useCallback((id: string, data: ClientUpdateData) => {
    return updateClientMutation.mutateAsync({ id, data });
  }, [updateClientMutation]);

  const deleteClient = useCallback((id: string) => {
    return deleteClientMutation.mutateAsync(id);
  }, [deleteClientMutation]);

  // Computed values
  const filteredClients = useMemo(() => {
    return clients;
  }, [clients]);

  const clientStats = useMemo(() => {
    if (!clients.length) return null;

    return {
      byType: clients.reduce((acc, client) => {
        acc[client.client_type] = (acc[client.client_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byStatus: clients.reduce((acc, client) => {
        acc[client.status] = (acc[client.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      bySegment: clients.reduce((acc, client) => {
        if (client.segment) {
          acc[client.segment] = (acc[client.segment] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>),
    };
  }, [clients]);

  return {
    // Data
    clients: filteredClients,
    metrics,
    clientStats,
    
    // Loading states
    isLoading,
    metricsLoading,
    isCreating: createClientMutation.isPending,
    isUpdating: updateClientMutation.isPending,
    isDeleting: deleteClientMutation.isPending,
    
    // Error states
    error,
    createError: createClientMutation.error,
    updateError: updateClientMutation.error,
    deleteError: deleteClientMutation.error,
    
    // Actions
    createClient,
    updateClient,
    deleteClient,
    refetch,
    
    // Cache
    cache
  };
};

// Hook para cliente individual
export const useClient = (id: string) => {
  const queryClient = useQueryClient();

  const {
    data: client,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: CLIENT_KEYS.detail(id),
    queryFn: () => clientService.fetchClient(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });

  const updateClientMutation = useMutation({
    mutationFn: (data: ClientUpdateData) => clientService.updateClient(id, data),
    onSuccess: (updatedClient) => {
      queryClient.invalidateQueries({ queryKey: CLIENT_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: CLIENT_KEYS.lists() });
      toast({
        title: "Sucesso",
        description: "Cliente atualizado com sucesso!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  return {
    client,
    isLoading,
    error,
    updateClient: updateClientMutation.mutateAsync,
    isUpdating: updateClientMutation.isPending,
    refetch
  };
};
