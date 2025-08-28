import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Phone, 
  Mail, 
  MapPin, 
  User, 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  Star, 
  DollarSign, 
  Target, 
  Users, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  Zap,
  Filter,
  RefreshCw
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useClients } from '@/hooks/useClients';
import { AddClientModalRefactored } from './AddClientModalRefactored';
import { ClientFilters, ClientType, ClientStatus, ClientPriority, ClientSize } from '@/types/clients';
import { ClientCard } from './ClientCard';
import { ClientMetrics } from './ClientMetrics';
import { ClientFiltersPanel } from './ClientFiltersPanel';
import { ClientList } from './ClientList';
import { ClientKanban } from './ClientKanban';

type ViewMode = 'list' | 'kanban' | 'analytics';

export const ClientsManagementRefactored: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [filters, setFilters] = useState<ClientFilters>({
    searchTerm: '',
    clientType: 'all',
    status: 'all',
    priority: 'all',
    segment: 'all',
    size: 'all'
  });

  const {
    clients,
    metrics,
    clientStats,
    isLoading,
    metricsLoading,
    error,
    refetch
  } = useClients(filters);

  // Computed values
  const filteredClients = useMemo(() => {
    return clients;
  }, [clients]);

  const clientCounts = useMemo(() => {
    if (!clientStats) return null;

    return {
      total: clients.length,
      strategic: clientStats.byType?.strategic || 0,
      regular: clientStats.byType?.regular || 0,
      prospect: clientStats.byType?.prospect || 0,
      active: clientStats.byStatus?.active || 0,
      inactive: clientStats.byStatus?.inactive || 0,
      suspended: clientStats.byStatus?.suspended || 0
    };
  }, [clients, clientStats]);

  // Handlers
  const handleFilterChange = useCallback((newFilters: Partial<ClientFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const handleRefresh = useCallback(async () => {
    try {
      await refetch();
      toast({
        title: "Sucesso",
        description: "Dados atualizados com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar dados",
        variant: "destructive"
      });
    }
  }, [refetch]);

  const handleClientAdded = useCallback(() => {
    // O hook useClients já invalida o cache automaticamente
    toast({
      title: "Sucesso",
      description: "Cliente adicionado com sucesso!",
    });
  }, []);

  // Loading states
  if (isLoading && !clients.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">Carregando clientes...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="border-destructive/50">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-destructive">Erro ao carregar clientes</h3>
              <p className="text-muted-foreground mt-2">
                {error.message || 'Ocorreu um erro inesperado'}
              </p>
            </div>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com métricas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Clientes</p>
                <p className="text-2xl font-bold">{clientCounts?.total || 0}</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Clientes Estratégicos</p>
                <p className="text-2xl font-bold text-orange-600">{clientCounts?.strategic || 0}</p>
              </div>
              <Star className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Clientes Ativos</p>
                <p className="text-2xl font-bold text-green-600">{clientCounts?.active || 0}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Receita Potencial</p>
                <p className="text-2xl font-bold text-purple-600">
                  R$ {metrics?.totalRevenue?.toLocaleString() || '0'}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controles principais */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Gestão de Clientes
            </CardTitle>
            
            <div className="flex items-center gap-2">
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
              
              <AddClientModalRefactored onClientAdded={handleClientAdded} />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Filtros */}
          <ClientFiltersPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            clientStats={clientStats}
          />

          {/* Tabs de visualização */}
          <Tabs value={viewMode} onValueChange={(value: ViewMode) => setViewMode(value)} className="mt-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="list" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Lista
              </TabsTrigger>
              <TabsTrigger value="kanban" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Kanban
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="mt-6">
              <ClientList
                clients={filteredClients}
                isLoading={isLoading}
                onClientAdded={handleClientAdded}
              />
            </TabsContent>

            <TabsContent value="kanban" className="mt-6">
              <ClientKanban
                clients={filteredClients}
                isLoading={isLoading}
                onClientAdded={handleClientAdded}
              />
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              <ClientMetrics
                metrics={metrics}
                clientStats={clientStats}
                isLoading={metricsLoading}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
