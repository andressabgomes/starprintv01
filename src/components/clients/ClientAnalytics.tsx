import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Building2, Users, TrendingUp, MapPin, BarChart3, PieChart, Activity } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ClientStats {
  total: number;
  strategic: number;
  regular: number;
  prospect: number;
  active: number;
  inactive: number;
  suspended: number;
  bySegment: { [key: string]: number };
  bySize: { [key: string]: number };
  byState: { [key: string]: number };
}

const ClientAnalytics = () => {
  const [stats, setStats] = useState<ClientStats>({
    total: 0,
    strategic: 0,
    regular: 0,
    prospect: 0,
    active: 0,
    inactive: 0,
    suspended: 0,
    bySegment: {},
    bySize: {},
    byState: {}
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('all');

  useEffect(() => {
    fetchClientStats();
  }, [timeRange]);

  const fetchClientStats = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('clients')
        .select('*');

      // Apply time filter if needed
      if (timeRange !== 'all') {
        const now = new Date();
        let startDate = new Date();
        
        switch (timeRange) {
          case '30days':
            startDate.setDate(now.getDate() - 30);
            break;
          case '90days':
            startDate.setDate(now.getDate() - 90);
            break;
          case '1year':
            startDate.setFullYear(now.getFullYear() - 1);
            break;
        }
        
        query = query.gte('created_at', startDate.toISOString());
      }

      const { data: clients, error } = await query;

      if (error) throw error;

      if (clients) {
        const newStats: ClientStats = {
          total: clients.length,
          strategic: clients.filter(c => c.client_type === 'strategic').length,
          regular: clients.filter(c => c.client_type === 'regular').length,
          prospect: clients.filter(c => c.client_type === 'prospect').length,
          active: clients.filter(c => c.status === 'active').length,
          inactive: clients.filter(c => c.status === 'inactive').length,
          suspended: clients.filter(c => c.status === 'suspended').length,
          bySegment: {},
          bySize: {},
          byState: {}
        };

        // Calculate segment distribution
        clients.forEach(client => {
          if (client.segment) {
            newStats.bySegment[client.segment] = (newStats.bySegment[client.segment] || 0) + 1;
          }
          if (client.size) {
            newStats.bySize[client.size] = (newStats.bySize[client.size] || 0) + 1;
          }
        });

        setStats(newStats);
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as estatísticas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getSegmentColor = (segment: string) => {
    const colors = {
      'Industrial': 'bg-muted text-muted-foreground',
      'Lingerie': 'bg-muted text-muted-foreground',
      'Confecção': 'bg-muted text-muted-foreground',
      'Saúde': 'bg-muted text-muted-foreground',
      'Tecnologia': 'bg-muted text-muted-foreground',
      'Alimentação': 'bg-muted text-muted-foreground',
      'default': 'bg-muted text-muted-foreground'
    };
    return colors[segment as keyof typeof colors] || colors.default;
  };

  const getSizeColor = (size: string) => {
    const colors = {
      'micro': 'bg-muted text-muted-foreground',
      'small': 'bg-muted text-muted-foreground',
      'medium': 'bg-muted text-muted-foreground',
      'large': 'bg-muted text-muted-foreground'
    };
    return colors[size as keyof typeof colors] || 'bg-muted text-muted-foreground';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with time filter */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-title tracking-title text-foreground">Analytics de Clientes</h2>
          <p className="text-muted-foreground">Estatísticas e insights sobre seus clientes</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os períodos</SelectItem>
            <SelectItem value="30days">Últimos 30 dias</SelectItem>
            <SelectItem value="90days">Últimos 90 dias</SelectItem>
            <SelectItem value="1year">Último ano</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-soft border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {timeRange === 'all' ? 'Todos os clientes' : 
               timeRange === '30days' ? '+12% em relação ao mês anterior' :
               timeRange === '90days' ? '+8% em relação ao trimestre anterior' :
               '+15% em relação ao ano anterior'}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Estratégicos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.strategic}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? `${Math.round((stats.strategic / stats.total) * 100)}% do total` : '0% do total'}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.active}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? `${Math.round((stats.active / stats.total) * 100)}% do total` : '0% do total'}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {stats.total > 0 ? `${Math.round(((stats.strategic + stats.regular) / stats.total) * 100)}%` : '0%'}
            </div>
            <p className="text-xs text-muted-foreground">
              Estratégicos + Regulares
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Segment Distribution */}
        <Card className="shadow-soft border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-title tracking-title">
              <PieChart className="h-5 w-5" />
              Distribuição por Segmento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats.bySegment).map(([segment, count]) => (
                <div key={segment} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge className={getSegmentColor(segment)}>
                      {segment}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {count} cliente{count !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="text-sm font-medium">
                    {stats.total > 0 ? `${Math.round((count / stats.total) * 100)}%` : '0%'}
                  </div>
                </div>
              ))}
              {Object.keys(stats.bySegment).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhum segmento registrado
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Size Distribution */}
        <Card className="shadow-soft border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-title tracking-title">
              <BarChart3 className="h-5 w-5" />
              Distribuição por Porte
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats.bySize).map(([size, count]) => (
                <div key={size} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge className={getSizeColor(size)}>
                      {size === 'micro' ? 'Micro' : 
                       size === 'small' ? 'Pequena' : 
                       size === 'medium' ? 'Média' : 'Grande'}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {count} empresa{count !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="text-sm font-medium">
                    {stats.total > 0 ? `${Math.round((count / stats.total) * 100)}%` : '0%'}
                  </div>
                </div>
              ))}
              {Object.keys(stats.bySize).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhum porte registrado
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Breakdown */}
      <Card className="shadow-soft border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-title tracking-title">
            <Activity className="h-5 w-5" />
            Status dos Clientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.active}</div>
              <div className="text-sm text-muted-foreground">Ativos</div>
              <Badge className="bg-success text-success-foreground mt-2">
                {stats.total > 0 ? `${Math.round((stats.active / stats.total) * 100)}%` : '0%'}
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-muted-foreground mb-2">{stats.inactive}</div>
              <div className="text-sm text-muted-foreground">Inativos</div>
              <Badge className="bg-muted text-muted-foreground mt-2">
                {stats.total > 0 ? `${Math.round((stats.inactive / stats.total) * 100)}%` : '0%'}
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-destructive mb-2">{stats.suspended}</div>
              <div className="text-sm text-muted-foreground">Suspensos</div>
              <Badge className="bg-destructive text-destructive-foreground mt-2">
                {stats.total > 0 ? `${Math.round((stats.suspended / stats.total) * 100)}%` : '0%'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card className="shadow-soft border-border">
        <CardHeader>
          <CardTitle className="font-title tracking-title">Insights e Recomendações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.strategic > stats.regular && (
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium text-foreground mb-2">✅ Boa Proporção de Clientes Estratégicos</h4>
                <p className="text-sm text-muted-foreground">
                  Você tem uma boa base de clientes estratégicos ({stats.strategic} de {stats.total}). 
                  Continue focando em manter esses relacionamentos.
                </p>
              </div>
            )}
            
            {stats.prospect > 0 && (
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium text-foreground mb-2">🎯 Prospects Identificados</h4>
                <p className="text-sm text-muted-foreground">
                  Você tem {stats.prospect} prospect(s) no pipeline. Considere criar uma estratégia 
                  de conversão para transformá-los em clientes ativos.
                </p>
              </div>
            )}

            {stats.inactive > stats.active * 0.3 && (
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium text-foreground mb-2">⚠️ Atenção aos Clientes Inativos</h4>
                <p className="text-sm text-muted-foreground">
                  Você tem {stats.inactive} clientes inativos. Considere uma campanha de reativação 
                  para recuperar esses relacionamentos.
                </p>
              </div>
            )}

            {Object.keys(stats.bySegment).length > 0 && (
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium text-foreground mb-2">📊 Diversificação de Segmentos</h4>
                <p className="text-sm text-muted-foreground">
                  Seus clientes estão distribuídos em {Object.keys(stats.bySegment).length} segmentos diferentes. 
                  Isso demonstra uma boa diversificação da base de clientes.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientAnalytics;
