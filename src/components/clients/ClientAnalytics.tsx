import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  MapPin, 
  BarChart3, 
  PieChart, 
  Activity, 
  DollarSign, 
  Target, 
  Clock, 
  Star, 
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Phone,
  Mail,
  Calendar,
  Zap
} from 'lucide-react';
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
  // Novas métricas comerciais
  totalRevenue: number;
  avgTicketValue: number;
  conversionRate: number;
  retentionRate: number;
  satisfactionScore: number;
  responseTime: number;
  churnRate: number;
  growthRate: number;
  topPerformers: Array<{
    name: string;
    value: number;
    metric: string;
  }>;
  alerts: Array<{
    type: 'warning' | 'success' | 'info';
    message: string;
    priority: 'high' | 'medium' | 'low';
  }>;
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
    byState: {},
    totalRevenue: 0,
    avgTicketValue: 0,
    conversionRate: 0,
    retentionRate: 0,
    satisfactionScore: 0,
    responseTime: 0,
    churnRate: 0,
    growthRate: 0,
    topPerformers: [],
    alerts: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30days');
  const [viewMode, setViewMode] = useState<'commercial' | 'operational'>('commercial');

  useEffect(() => {
    fetchClientStats();
  }, [timeRange]);

  const fetchClientStats = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('clients')
        .select('*');

      // Apply time filter
      const now = new Date();
      let startDate = new Date();
      
      switch (timeRange) {
        case '7days':
          startDate.setDate(now.getDate() - 7);
          break;
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

      const { data: clients, error } = await query;

      if (error) throw error;

      if (clients) {
        // Calcular métricas básicas
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
          byState: {},
          // Métricas comerciais simuladas (em um cenário real viriam do backend)
          totalRevenue: clients.length * 15000, // Simulado
          avgTicketValue: 15000,
          conversionRate: clients.filter(c => c.client_type !== 'prospect').length / clients.length * 100,
          retentionRate: 85, // Simulado
          satisfactionScore: 4.2, // Simulado
          responseTime: 2.5, // Simulado em horas
          churnRate: 8, // Simulado
          growthRate: 12, // Simulado
          topPerformers: [
            { name: 'João Silva', value: 45, metric: 'clientes convertidos' },
            { name: 'Maria Santos', value: 92, metric: '% satisfação' },
            { name: 'Pedro Costa', value: 1.8, metric: 'hora resposta' },
            { name: 'Ana Oliveira', value: 180000, metric: 'receita gerada' }
          ],
          alerts: [
            { type: 'warning', message: '5 clientes estratégicos com pagamento em atraso', priority: 'high' },
            { type: 'success', message: 'Taxa de conversão 15% acima da meta', priority: 'medium' },
            { type: 'info', message: '12 prospects qualificados aguardando contato', priority: 'medium' }
          ]
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
      'Industrial': 'bg-blue-100 text-blue-800',
      'Lingerie': 'bg-pink-100 text-pink-800',
      'Confecção': 'bg-purple-100 text-purple-800',
      'Saúde': 'bg-green-100 text-green-800',
      'Tecnologia': 'bg-indigo-100 text-indigo-800',
      'Alimentação': 'bg-orange-100 text-orange-800',
      'default': 'bg-muted text-muted-foreground'
    };
    return colors[segment as keyof typeof colors] || colors.default;
  };

  const getSizeColor = (size: string) => {
    const colors = {
      'micro': 'bg-gray-100 text-gray-800',
      'small': 'bg-blue-100 text-blue-800',
      'medium': 'bg-green-100 text-green-800',
      'large': 'bg-purple-100 text-purple-800'
    };
    return colors[size as keyof typeof colors] || 'bg-muted text-muted-foreground';
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'success': return <CheckCircle className="h-4 w-4" />;
      case 'info': return <Clock className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'success': return 'bg-green-50 border-green-200 text-green-800';
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
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
      {/* Header com controles */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-title tracking-title text-foreground">Painel de Valor - Clientes</h2>
          <p className="text-muted-foreground">Métricas estratégicas para decisões comerciais e operacionais</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={viewMode} onValueChange={(value: 'commercial' | 'operational') => setViewMode(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="commercial">Comercial</SelectItem>
              <SelectItem value="operational">Operacional</SelectItem>
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Últimos 7 dias</SelectItem>
              <SelectItem value="30days">Últimos 30 dias</SelectItem>
              <SelectItem value="90days">Últimos 90 dias</SelectItem>
              <SelectItem value="1year">Último ano</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Alertas Prioritários */}
      {stats.alerts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Alertas e Oportunidades
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {stats.alerts.map((alert, index) => (
              <div key={index} className={`p-4 rounded-lg border ${getAlertColor(alert.type)}`}>
                <div className="flex items-start gap-3">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {alert.priority === 'high' ? 'Alta Prioridade' : 
                       alert.priority === 'medium' ? 'Média Prioridade' : 'Baixa Prioridade'}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-soft border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              R$ {(stats.totalRevenue / 1000).toFixed(0)}k
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="h-3 w-3 text-success mr-1" />
              +{stats.growthRate}% vs período anterior
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {stats.conversionRate.toFixed(1)}%
            </div>
            <Progress value={stats.conversionRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Meta: 25% | Atual: {stats.conversionRate.toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfação</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {stats.satisfactionScore}/5.0
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <CheckCircle className="h-3 w-3 text-success mr-1" />
              {stats.satisfactionScore >= 4.0 ? 'Excelente' : 'Bom'}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo de Resposta</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.responseTime}h
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowDownRight className="h-3 w-3 text-success mr-1" />
              Meta: 4h | Atual: {stats.responseTime}h
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Métricas Secundárias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-soft border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              R$ {stats.avgTicketValue.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground">
              Por cliente
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retenção</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {stats.retentionRate}%
            </div>
            <Progress value={stats.retentionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="shadow-soft border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {stats.churnRate}%
            </div>
                          <p className="text-xs text-muted-foreground">
                Meta: &lt;5%
              </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crescimento</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              +{stats.growthRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              vs período anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <Card className="shadow-soft border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-title tracking-title">
            <Star className="h-5 w-5" />
            Top Performers do Período
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.topPerformers.map((performer, index) => (
              <div key={index} className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{performer.name}</h4>
                  <Badge variant="outline" className="text-xs">
                    #{index + 1}
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-primary">
                  {performer.value.toLocaleString('pt-BR')}
                </div>
                <p className="text-xs text-muted-foreground">
                  {performer.metric}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Distribuições */}
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

      {/* Insights Estratégicos */}
      <Card className="shadow-soft border-border">
        <CardHeader>
          <CardTitle className="font-title tracking-title">Insights Estratégicos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.conversionRate > 20 && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">✅ Conversão Acima da Meta</h4>
                <p className="text-sm text-green-700">
                  Taxa de conversão de {stats.conversionRate.toFixed(1)}% supera a meta de 20%. 
                  Continue investindo nas estratégias atuais.
                </p>
              </div>
            )}
            
            {stats.satisfactionScore >= 4.0 && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">⭐ Alta Satisfação</h4>
                <p className="text-sm text-blue-700">
                  Score de satisfação de {stats.satisfactionScore}/5.0 indica excelente 
                  experiência do cliente. Use como case de sucesso.
                </p>
              </div>
            )}

            {stats.responseTime <= 3 && (
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-medium text-purple-800 mb-2">⚡ Resposta Rápida</h4>
                <p className="text-sm text-purple-700">
                  Tempo de resposta de {stats.responseTime}h está abaixo da meta de 4h. 
                  Mantenha essa eficiência operacional.
                </p>
              </div>
            )}

            {stats.churnRate > 5 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2">⚠️ Atenção ao Churn</h4>
                <p className="text-sm text-yellow-700">
                  Taxa de churn de {stats.churnRate}% está acima da meta de 5%. 
                  Implemente estratégias de retenção.
                </p>
              </div>
            )}

            {stats.growthRate > 10 && (
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                <h4 className="font-medium text-indigo-800 mb-2">📈 Crescimento Sólido</h4>
                <p className="text-sm text-indigo-700">
                  Crescimento de {stats.growthRate}% demonstra expansão saudável. 
                  Considere escalar as estratégias vencedoras.
                </p>
              </div>
            )}

            {stats.strategic > stats.regular && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                <h4 className="font-medium text-emerald-800 mb-2">🎯 Base Estratégica</h4>
                <p className="text-sm text-emerald-700">
                  {stats.strategic} clientes estratégicos representam {Math.round((stats.strategic / stats.total) * 100)}% 
                  da base. Foque na retenção destes.
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
