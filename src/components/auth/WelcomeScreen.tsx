import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  MessageSquare, 
  Shield, 
  Users, 
  Headphones, 
  CheckCircle, 
  Clock, 
  Target,
  ArrowRight,
  Star,
  TrendingUp
} from 'lucide-react';
import { User, roleLabels } from '@/types/auth';

interface WelcomeScreenProps {
  user: User | null;
  onSkip?: () => void;
}

export const WelcomeScreen = ({ user, onSkip }: WelcomeScreenProps) => {
  if (!user) return null;

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return Shield;
      case 'gestao': return Users;
      case 'atendente': return Headphones;
      default: return Users;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'from-purple-500 to-purple-600';
      case 'gestao': return 'from-blue-500 to-blue-600';
      case 'atendente': return 'from-green-500 to-green-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getWelcomeMessage = (role: string) => {
    switch (role) {
      case 'admin':
        return {
          title: 'Bem-vindo, Administrador!',
          subtitle: 'Você tem acesso completo ao sistema StarPrint CRM',
          features: [
            'Gerenciar equipe e permissões',
            'Configurar metas e parâmetros',
            'Acessar todos os relatórios',
            'Monitorar performance geral'
          ]
        };
      case 'gestao':
        return {
          title: 'Bem-vindo, Gestor!',
          subtitle: 'Acompanhe métricas e performance da equipe',
          features: [
            'Visualizar relatórios detalhados',
            'Monitorar metas da equipe',
            'Acompanhar escalas e presenças',
            'Analisar dados de clientes'
          ]
        };
      case 'atendente':
        return {
          title: 'Bem-vindo, Atendente!',
          subtitle: 'Pronto para atender seus clientes?',
          features: [
            'Acessar fila de atendimentos',
            'Gerenciar tickets de clientes',
            'Visualizar histórico de conversas',
            'Acompanhar suas métricas'
          ]
        };
      default:
        return {
          title: 'Bem-vindo!',
          subtitle: 'Acesse o sistema StarPrint CRM',
          features: []
        };
    }
  };

  const getQuickStats = (role: string) => {
    switch (role) {
      case 'admin':
        return [
          { 
            label: 'Equipe Ativa', 
            value: '12/15', 
            icon: Users, 
            color: 'blue',
            description: 'Membros online agora'
          },
          { 
            label: 'Atendimentos Hoje', 
            value: '156', 
            icon: MessageSquare, 
            color: 'green',
            description: 'Tickets processados'
          },
          { 
            label: 'Taxa de Resolução', 
            value: '89%', 
            icon: CheckCircle, 
            color: 'emerald',
            description: 'Primeira interação'
          },
          { 
            label: 'Tempo Médio', 
            value: '3.2min', 
            icon: Clock, 
            color: 'orange',
            description: 'Por atendimento'
          }
        ];
      case 'gestao':
        return [
          { 
            label: 'Equipe Online', 
            value: '8/12', 
            icon: Users, 
            color: 'blue',
            description: 'Atendentes disponíveis'
          },
          { 
            label: 'Metas Atingidas', 
            value: '85%', 
            icon: Target, 
            color: 'green',
            description: 'Objetivos do mês'
          },
          { 
            label: 'Satisfação', 
            value: '4.6/5.0', 
            icon: Star, 
            color: 'yellow',
            description: 'Avaliação média'
          },
          { 
            label: 'Tickets Pendentes', 
            value: '23', 
            icon: MessageSquare, 
            color: 'red',
            description: 'Aguardando resposta'
          }
        ];
      case 'atendente':
        return [
          { 
            label: 'Tickets Atendidos', 
            value: '12', 
            icon: MessageSquare, 
            color: 'blue',
            description: 'Hoje'
          },
          { 
            label: 'Tempo Médio', 
            value: '2.8min', 
            icon: Clock, 
            color: 'green',
            description: 'Por atendimento'
          },
          { 
            label: 'Satisfação', 
            value: '4.8/5.0', 
            icon: Star, 
            color: 'yellow',
            description: 'Sua avaliação'
          },
          { 
            label: 'Na Fila', 
            value: '5', 
            icon: ArrowRight, 
            color: 'orange',
            description: 'Tickets aguardando'
          }
        ];
      default:
        return [];
    }
  };

  const welcome = getWelcomeMessage(user.role);
  const stats = getQuickStats(user.role);
  const RoleIcon = getRoleIcon(user.role);
  const roleColor = getRoleColor(user.role);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/50 flex items-center justify-center p-4">
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        .stat-card {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .stat-card:nth-child(1) { animation-delay: 0.1s; }
        .stat-card:nth-child(2) { animation-delay: 0.2s; }
        .stat-card:nth-child(3) { animation-delay: 0.3s; }
        .stat-card:nth-child(4) { animation-delay: 0.4s; }
        
        .progress-bar {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>
      <div className="w-full max-w-4xl">
        {/* Header com informações do usuário */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className={`w-20 h-20 bg-gradient-to-r ${roleColor} rounded-full flex items-center justify-center shadow-xl mr-4`}>
              <RoleIcon className="h-10 w-10 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {welcome.title}
              </h1>
              <p className="text-lg text-muted-foreground">
                {welcome.subtitle}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-4">
            <Badge variant="outline" className="px-4 py-2 text-sm">
              <CheckCircle className="h-4 w-4 mr-2" />
              Sistema Online
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              {roleLabels[user.role]}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card de Boas-vindas */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-muted/30">
            <CardContent className="p-8">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center">
                <Star className="h-6 w-6 mr-3 text-yellow-500" />
                Recursos Disponíveis
              </h2>
              <div className="space-y-3">
                {welcome.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Card de Estatísticas Rápidas */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-muted/30">
            <CardContent className="p-8">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center">
                <Target className="h-6 w-6 mr-3 text-blue-500" />
                Resumo do Sistema
              </h2>
              
              {/* Estatísticas Principais */}
              <div className="space-y-4">
                {stats.map((stat, index) => (
                  <div 
                    key={index} 
                    className="stat-card group flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-muted/30 to-muted/50 hover:from-muted/50 hover:to-muted/70 transition-all duration-300 border border-muted/30 hover:border-muted/50 hover:shadow-md"
                  >
                                         <div className="flex items-center space-x-4">
                       <div className={`w-12 h-12 bg-gradient-to-r from-${stat.color}-500 to-${stat.color}-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                         <stat.icon className="h-6 w-6 text-white" />
                       </div>
                       <div className="text-left">
                         <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
                         <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                         <div className="text-xs text-muted-foreground">{stat.description}</div>
                       </div>
                     </div>
                    
                                         {/* Indicador de status e tendência */}
                     <div className="flex flex-col items-end space-y-1">
                       <div className="flex items-center space-x-2">
                         <div className={`w-2 h-2 rounded-full ${
                           stat.color === 'green' || stat.color === 'emerald' ? 'bg-green-500' :
                           stat.color === 'blue' ? 'bg-blue-500' :
                           stat.color === 'orange' ? 'bg-orange-500' :
                           stat.color === 'yellow' ? 'bg-yellow-500' :
                           'bg-gray-500'
                         }`}></div>
                         <span className="text-xs text-muted-foreground">Ativo</span>
                       </div>
                       <div className="flex items-center space-x-1 text-xs text-green-600">
                         <TrendingUp className="h-3 w-3" />
                         <span>+12%</span>
                       </div>
                     </div>
                  </div>
                ))}
              </div>

              {/* Barra de Progresso Geral */}
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl border border-blue-200/50 hover:from-blue-100 hover:to-blue-200/50 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-blue-800">Performance Geral</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-blue-800">87%</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="progress-bar bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 h-3 rounded-full transition-all duration-2000 ease-out shadow-sm"
                    style={{ width: '87%' }}
                  ></div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-blue-600 font-medium">Sistema funcionando perfeitamente</p>
                  <div className="flex items-center space-x-1 text-xs text-green-600">
                    <TrendingUp className="h-3 w-3" />
                    <span>+5% vs ontem</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Loading Progress */}
        <div className="mt-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>Carregando dashboard...</span>
              <span>4s</span>
            </div>
            <Progress value={25} className="h-2" />
            {onSkip && (
              <button
                onClick={onSkip}
                className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors underline"
              >
                Pular e ir direto ao dashboard
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            StarPrint Etiquetas e Rótulos • CRM v2.0
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Último acesso: {new Date().toLocaleString('pt-BR')}
          </p>
        </div>
      </div>
    </div>
  );
};
