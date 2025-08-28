import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
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
  Zap
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import AddClientModal from './AddClientModal';
import EditClientModal from './EditClientModal';
import QuickInsights from './QuickInsights';
import ClientRegistrationSummary from './ClientRegistrationSummary';

interface Client {
  id: string;
  code: string;
  company_name: string;
  trade_name: string;
  document_type: string;
  document_number: string;
  client_type: string;
  segment: string;
  size: string;
  status: string;
  website?: string;
  notes?: string;
  created_at: string;
  addresses?: ClientAddress[];
  contacts?: ClientContact[];
  persons?: ClientPerson[];
  // Novos campos para métricas
  last_contact?: string;
  revenue_potential?: number;
  satisfaction_score?: number;
  risk_level?: 'low' | 'medium' | 'high';
  next_action?: string;
  priority?: 'high' | 'medium' | 'low';
}

interface ClientAddress {
  id: string;
  address_type: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  is_primary: boolean;
}

interface ClientContact {
  id: string;
  contact_type: string;
  contact_value: string;
  description?: string;
  is_primary: boolean;
  is_whatsapp: boolean;
}

interface ClientPerson {
  id: string;
  name: string;
  role?: string;
  department?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  is_primary: boolean;
  is_decision_maker: boolean;
}

interface QuickMetrics {
  totalClients: number;
  strategicClients: number;
  activeClients: number;
  prospects: number;
  highPriority: number;
  overdueContacts: number;
  totalRevenue: number;
  avgSatisfaction: number;
}

const ClientsManagement = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [activeView, setActiveView] = useState<'list' | 'kanban' | 'analytics'>('list');
  const [quickMetrics, setQuickMetrics] = useState<QuickMetrics>({
    totalClients: 0,
    strategicClients: 0,
    activeClients: 0,
    prospects: 0,
    highPriority: 0,
    overdueContacts: 0,
    totalRevenue: 0,
    avgSatisfaction: 0
  });

  // Insights simulados para demonstração
  const insights = [
    {
      id: '0',
      type: 'action' as const,
      title: 'Cadastrar Novo Cliente',
      description: 'Adicione um novo cliente ao sistema com informações completas',
      metric: 'Formulário Completo',
      trend: 'stable' as const,
      priority: 'medium' as const,
      action: {
        label: 'Cadastrar',
        icon: <Plus className="h-3 w-3" />,
        onClick: () => {
          // Abrir o modal de cadastro
          const addButton = document.querySelector('[data-add-client]') as HTMLButtonElement;
          if (addButton) addButton.click();
        }
      }
    },
    {
      id: '1',
      type: 'warning' as const,
      title: 'Clientes em Risco',
      description: '5 clientes estratégicos com pagamento em atraso há mais de 30 dias',
      metric: '5 clientes',
      trend: 'up' as const,
      priority: 'high' as const,
      action: {
        label: 'Ver Detalhes',
        icon: <AlertTriangle className="h-3 w-3" />,
        onClick: () => console.log('Ver clientes em risco')
      }
    },
    {
      id: '2',
      type: 'success' as const,
      title: 'Meta de Conversão',
      description: 'Taxa de conversão 15% acima da meta mensal',
      metric: '+15%',
      trend: 'up' as const,
      priority: 'medium' as const,
      action: {
        label: 'Ver Relatório',
        icon: <TrendingUp className="h-3 w-3" />,
        onClick: () => console.log('Ver relatório de conversão')
      }
    },
    {
      id: '3',
      type: 'action' as const,
      title: 'Prospects Qualificados',
      description: '12 prospects qualificados aguardando contato comercial',
      metric: '12 prospects',
      trend: 'stable' as const,
      priority: 'medium' as const,
      action: {
        label: 'Contatar',
        icon: <Phone className="h-3 w-3" />,
        onClick: () => console.log('Contatar prospects')
      }
    },
    {
      id: '4',
      type: 'info' as const,
      title: 'Satisfação Cliente',
      description: 'Score médio de satisfação aumentou 0.3 pontos',
      metric: '+0.3 pts',
      trend: 'up' as const,
      priority: 'low' as const,
      action: {
        label: 'Ver Feedback',
        icon: <Star className="h-3 w-3" />,
        onClick: () => console.log('Ver feedback dos clientes')
      }
    },
    {
      id: '5',
      type: 'warning' as const,
      title: 'Contatos em Atraso',
      description: '8 clientes sem contato há mais de 45 dias',
      metric: '8 clientes',
      trend: 'down' as const,
      priority: 'high' as const,
      action: {
        label: 'Agendar Contatos',
        icon: <Calendar className="h-3 w-3" />,
        onClick: () => console.log('Agendar contatos')
      }
    },
    {
      id: '6',
      type: 'success' as const,
      title: 'Receita Mensal',
      description: 'Receita 8% acima da meta do mês',
      metric: '+8%',
      trend: 'up' as const,
      priority: 'medium' as const,
      action: {
        label: 'Ver Detalhes',
        icon: <DollarSign className="h-3 w-3" />,
        onClick: () => console.log('Ver detalhes da receita')
      }
    }
  ];

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    filterClients();
    calculateQuickMetrics();
  }, [clients, searchTerm, selectedType, selectedStatus, selectedPriority]);

  const fetchClients = async () => {
    try {
      const { data: clientsData, error } = await supabase
        .from('clients')
        .select(`
          *,
          client_addresses(*),
          client_contacts(*),
          client_persons(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Adicionar dados simulados para demonstração
      const enhancedClients = (clientsData || []).map(client => ({
        ...client,
        last_contact: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        revenue_potential: Math.floor(Math.random() * 100000) + 10000,
        satisfaction_score: Math.floor(Math.random() * 2) + 3.5,
        risk_level: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
        next_action: ['Follow-up', 'Proposta', 'Reunião', 'Renovação'][Math.floor(Math.random() * 4)],
        priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low'
      }));

      setClients(enhancedClients);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os clientes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateQuickMetrics = () => {
    const metrics: QuickMetrics = {
      totalClients: clients.length,
      strategicClients: clients.filter(c => c.client_type === 'strategic').length,
      activeClients: clients.filter(c => c.status === 'active').length,
      prospects: clients.filter(c => c.client_type === 'prospect').length,
      highPriority: clients.filter(c => c.priority === 'high').length,
      overdueContacts: clients.filter(c => {
        const lastContact = new Date(c.last_contact || c.created_at);
        const daysSinceContact = (Date.now() - lastContact.getTime()) / (1000 * 60 * 60 * 24);
        return daysSinceContact > 30;
      }).length,
      totalRevenue: clients.reduce((sum, c) => sum + (c.revenue_potential || 0), 0),
      avgSatisfaction: clients.reduce((sum, c) => sum + (c.satisfaction_score || 0), 0) / clients.length || 0
    };
    setQuickMetrics(metrics);
  };

  const filterClients = () => {
    let filtered = clients;

    if (searchTerm) {
      filtered = filtered.filter(client => 
        client.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.trade_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.document_number.includes(searchTerm)
      );
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(client => client.client_type === selectedType);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(client => client.status === selectedStatus);
    }

    if (selectedPriority !== 'all') {
      filtered = filtered.filter(client => client.priority === selectedPriority);
    }

    setFilteredClients(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success text-success-foreground';
      case 'inactive': return 'bg-muted text-muted-foreground';
      case 'suspended': return 'bg-destructive text-destructive-foreground';
      case 'prospect': return 'bg-primary text-primary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'strategic': return 'bg-primary text-primary-foreground';
      case 'regular': return 'bg-muted text-muted-foreground';
      case 'prospect': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'low': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'low': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleViewDetails = (client: Client) => {
    setSelectedClient(client);
    setViewDetailsOpen(true);
  };

  const getDaysSinceContact = (lastContact: string) => {
    const lastContactDate = new Date(lastContact);
    const daysSince = (Date.now() - lastContactDate.getTime()) / (1000 * 60 * 60 * 24);
    return Math.floor(daysSince);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Painel de Clientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Métricas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-soft border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{quickMetrics.totalClients}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="h-3 w-3 text-success mr-1" />
              +{Math.floor(quickMetrics.totalClients * 0.12)} este mês
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Potencial</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              R$ {(quickMetrics.totalRevenue / 1000).toFixed(0)}k
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Target className="h-3 w-3 text-primary mr-1" />
              Meta: R$ 2.5M
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfação Média</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {quickMetrics.avgSatisfaction.toFixed(1)}/5.0
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <CheckCircle className="h-3 w-3 text-success mr-1" />
              {quickMetrics.avgSatisfaction >= 4.0 ? 'Excelente' : 'Bom'}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ações Prioritárias</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{quickMetrics.highPriority}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 text-warning mr-1" />
              {quickMetrics.overdueContacts} contatos em atraso
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights Rápidos */}
      <QuickInsights insights={insights} />

      {/* Resumo de Cadastro */}
      <ClientRegistrationSummary 
        onStartRegistration={() => {
          const addButton = document.querySelector('[data-add-client]') as HTMLButtonElement;
          if (addButton) addButton.click();
        }}
      />

      {/* Controles e Filtros */}
      <Card className="shadow-soft border-border">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="flex items-center gap-2 font-title tracking-title">
              <Building2 className="h-5 w-5" />
              Gestão de Clientes
            </CardTitle>
            <div className="flex items-center gap-4">
              <AddClientModal onClientAdded={fetchClients} />
              <div className="flex items-center gap-2">
                <Tabs value={activeView} onValueChange={(value: 'list' | 'kanban' | 'analytics') => setActiveView(value)}>
                  <TabsList>
                    <TabsTrigger value="list">Lista</TabsTrigger>
                    <TabsTrigger value="kanban">Kanban</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar por nome, código ou documento..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="strategic">Estratégico</SelectItem>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="prospect">Prospect</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                  <SelectItem value="suspended">Suspenso</SelectItem>
                  <SelectItem value="prospect">Prospect</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as prioridades</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="low">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results count */}
            <div className="text-sm text-muted-foreground">
              Mostrando {filteredClients.length} de {clients.length} clientes
            </div>

            {/* Clientes list */}
            <div className="space-y-3">
              {filteredClients.map((client) => (
                <div 
                  key={client.id} 
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors shadow-soft"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline" className="font-mono text-xs">
                        {client.code}
                      </Badge>
                      <Badge className={getTypeColor(client.client_type)}>
                        {client.client_type === 'strategic' ? 'Estratégico' : 
                         client.client_type === 'regular' ? 'Regular' : 'Prospect'}
                      </Badge>
                      <Badge className={getStatusColor(client.status)}>
                        {client.status === 'active' ? 'Ativo' : 
                         client.status === 'inactive' ? 'Inativo' : 
                         client.status === 'suspended' ? 'Suspenso' : 'Prospect'}
                      </Badge>
                      <Badge className={getPriorityColor(client.priority || 'low')}>
                        {client.priority === 'high' ? 'Alta' : 
                         client.priority === 'medium' ? 'Média' : 'Baixa'} Prioridade
                      </Badge>
                      {client.risk_level && (
                        <Badge className={getRiskColor(client.risk_level)}>
                          Risco {client.risk_level === 'high' ? 'Alto' : 
                                 client.risk_level === 'medium' ? 'Médio' : 'Baixo'}
                        </Badge>
                      )}
                    </div>
                    <h4 className="font-medium text-lg">{client.company_name}</h4>
                    {client.trade_name && (
                      <p className="text-sm text-muted-foreground">{client.trade_name}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span>{client.document_type}: {client.document_number}</span>
                      {client.segment && <span>• {client.segment}</span>}
                      {client.size && <span>• {client.size === 'micro' ? 'Micro' : 
                                             client.size === 'small' ? 'Pequena' : 
                                             client.size === 'medium' ? 'Média' : 'Grande'}</span>}
                      {client.revenue_potential && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          R$ {(client.revenue_potential / 1000).toFixed(0)}k
                        </span>
                      )}
                      {client.satisfaction_score && (
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          {client.satisfaction_score.toFixed(1)}
                        </span>
                      )}
                      {client.last_contact && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {getDaysSinceContact(client.last_contact)} dias
                        </span>
                      )}
                    </div>
                    {client.next_action && (
                      <div className="mt-2">
                        <Badge variant="outline" className="text-xs">
                          Próxima ação: {client.next_action}
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewDetails(client)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-3 w-3" />
                      Detalhes
                    </Button>
                    <EditClientModal client={client} onClientUpdated={fetchClients} />
                  </div>
                </div>
              ))}
            </div>

            {filteredClients.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum cliente encontrado com os filtros aplicados</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Client Details Modal */}
      <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto shadow-soft border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-title tracking-title">
              <Building2 className="h-5 w-5" />
              Detalhes do Cliente
            </DialogTitle>
          </DialogHeader>

          {selectedClient && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Informações Básicas</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Código:</strong> {selectedClient.code}</p>
                    <p><strong>Razão Social:</strong> {selectedClient.company_name}</p>
                    {selectedClient.trade_name && (
                      <p><strong>Nome Fantasia:</strong> {selectedClient.trade_name}</p>
                    )}
                    <p><strong>Documento:</strong> {selectedClient.document_type} {selectedClient.document_number}</p>
                    <p><strong>Segmento:</strong> {selectedClient.segment || 'Não informado'}</p>
                    {selectedClient.website && (
                      <p><strong>Website:</strong> <a href={selectedClient.website} target="_blank" className="text-blue-600 hover:underline">{selectedClient.website}</a></p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Status e Classificação</h3>
                  <div className="space-y-2">
                    <Badge className={getStatusColor(selectedClient.status)}>
                      Status: {selectedClient.status === 'active' ? 'Ativo' : 
                              selectedClient.status === 'inactive' ? 'Inativo' : 
                              selectedClient.status === 'suspended' ? 'Suspenso' : 'Prospect'}
                    </Badge>
                    <Badge className={getTypeColor(selectedClient.client_type)}>
                      Tipo: {selectedClient.client_type === 'strategic' ? 'Estratégico' : 
                            selectedClient.client_type === 'regular' ? 'Regular' : 'Prospect'}
                    </Badge>
                    {selectedClient.size && (
                      <Badge variant="outline">
                        Porte: {selectedClient.size === 'micro' ? 'Micro' : 
                               selectedClient.size === 'small' ? 'Pequena' : 
                               selectedClient.size === 'medium' ? 'Média' : 'Grande'}
                      </Badge>
                    )}
                    {selectedClient.priority && (
                      <Badge className={getPriorityColor(selectedClient.priority)}>
                        Prioridade: {selectedClient.priority === 'high' ? 'Alta' : 
                                   selectedClient.priority === 'medium' ? 'Média' : 'Baixa'}
                      </Badge>
                    )}
                    {selectedClient.risk_level && (
                      <Badge className={getRiskColor(selectedClient.risk_level)}>
                        Risco: {selectedClient.risk_level === 'high' ? 'Alto' : 
                               selectedClient.risk_level === 'medium' ? 'Médio' : 'Baixo'}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Métricas Comerciais */}
              {(selectedClient.revenue_potential || selectedClient.satisfaction_score || selectedClient.last_contact) && (
                <div>
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Métricas Comerciais
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedClient.revenue_potential && (
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <DollarSign className="h-4 w-4 text-primary" />
                          <span className="font-medium">Receita Potencial</span>
                        </div>
                        <p className="text-lg font-bold text-primary">
                          R$ {selectedClient.revenue_potential.toLocaleString('pt-BR')}
                        </p>
                      </div>
                    )}
                    {selectedClient.satisfaction_score && (
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Star className="h-4 w-4 text-warning" />
                          <span className="font-medium">Satisfação</span>
                        </div>
                        <p className="text-lg font-bold text-warning">
                          {selectedClient.satisfaction_score.toFixed(1)}/5.0
                        </p>
                      </div>
                    )}
                    {selectedClient.last_contact && (
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Último Contato</span>
                        </div>
                        <p className="text-lg font-bold text-foreground">
                          {getDaysSinceContact(selectedClient.last_contact)} dias atrás
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Addresses */}
              {selectedClient.addresses && selectedClient.addresses.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Endereços
                  </h3>
                  <div className="space-y-2">
                    {selectedClient.addresses.map((address) => (
                      <div key={address.id} className="p-3 bg-muted rounded-lg text-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {address.address_type === 'main' ? 'Principal' : 
                             address.address_type === 'billing' ? 'Cobrança' : 
                             address.address_type === 'delivery' ? 'Entrega' : 'Outro'}
                          </Badge>
                          {address.is_primary && (
                            <Badge className="text-xs bg-success text-success-foreground">
                              Primário
                            </Badge>
                          )}
                        </div>
                        <p>
                          {address.street}, {address.number}
                          {address.complement && `, ${address.complement}`}
                        </p>
                        <p>
                          {address.neighborhood} - {address.city}/{address.state}
                        </p>
                        <p>CEP: {address.zip_code}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contacts */}
              {selectedClient.contacts && selectedClient.contacts.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Contatos
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedClient.contacts.map((contact) => (
                      <div key={contact.id} className="p-3 bg-muted rounded-lg text-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {contact.contact_type === 'phone' ? 'Telefone' : 
                             contact.contact_type === 'mobile' ? 'Celular' : 
                             contact.contact_type === 'email' ? 'Email' : 
                             contact.contact_type === 'whatsapp' ? 'WhatsApp' : 'Fax'}
                          </Badge>
                          {contact.is_primary && (
                            <Badge className="text-xs bg-success text-success-foreground">
                              Primário
                            </Badge>
                          )}
                          {contact.is_whatsapp && (
                            <Badge className="text-xs bg-success text-success-foreground">
                              WhatsApp
                            </Badge>
                          )}
                        </div>
                        <p className="font-mono">{contact.contact_value}</p>
                        {contact.description && (
                          <p className="text-muted-foreground">{contact.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Persons */}
              {selectedClient.persons && selectedClient.persons.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Pessoas de Contato
                  </h3>
                  <div className="space-y-2">
                    {selectedClient.persons.map((person) => (
                      <div key={person.id} className="p-3 bg-muted rounded-lg text-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{person.name}</h4>
                          {person.is_primary && (
                            <Badge className="text-xs bg-success text-success-foreground">
                              Contato Principal
                            </Badge>
                          )}
                          {person.is_decision_maker && (
                            <Badge className="text-xs bg-primary text-primary-foreground">
                              Tomador de Decisão
                            </Badge>
                          )}
                        </div>
                        {person.role && <p><strong>Cargo:</strong> {person.role}</p>}
                        {person.department && <p><strong>Departamento:</strong> {person.department}</p>}
                        {person.email && <p><strong>Email:</strong> {person.email}</p>}
                        {person.phone && <p><strong>Telefone:</strong> {person.phone}</p>}
                        {person.mobile && <p><strong>Celular:</strong> {person.mobile}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedClient.notes && (
                <div>
                  <h3 className="font-medium mb-2">Observações</h3>
                  <div className="p-3 bg-muted rounded-lg text-sm">
                    <p>{selectedClient.notes}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientsManagement;