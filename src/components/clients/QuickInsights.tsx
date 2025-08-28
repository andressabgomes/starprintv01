import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Star, 
  DollarSign, 
  Target, 
  Users, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Phone,
  Mail,
  MessageSquare,
  Zap
} from 'lucide-react';

interface Insight {
  id: string;
  type: 'success' | 'warning' | 'info' | 'action';
  title: string;
  description: string;
  metric?: string;
  trend?: 'up' | 'down' | 'stable';
  priority: 'high' | 'medium' | 'low';
  action?: {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
  };
}

interface QuickInsightsProps {
  insights: Insight[];
}

const QuickInsights: React.FC<QuickInsightsProps> = ({ insights }) => {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'info': return <Clock className="h-4 w-4" />;
      case 'action': return <Zap className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200 text-green-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'action': return 'bg-purple-50 border-purple-200 text-purple-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
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

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up': return <ArrowUpRight className="h-3 w-3 text-success" />;
      case 'down': return <ArrowDownRight className="h-3 w-3 text-destructive" />;
      default: return null;
    }
  };

  return (
    <Card className="shadow-soft border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-title tracking-title">
          <Zap className="h-5 w-5" />
          Insights Rápidos & Ações Recomendadas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {insights.map((insight) => (
            <div key={insight.id} className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}>
              <div className="flex items-start gap-3">
                {getInsightIcon(insight.type)}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{insight.title}</h4>
                    <Badge className={`text-xs ${getPriorityColor(insight.priority)}`}>
                      {insight.priority === 'high' ? 'Alta' : 
                       insight.priority === 'medium' ? 'Média' : 'Baixa'}
                    </Badge>
                  </div>
                  <p className="text-sm mb-2">{insight.description}</p>
                  
                  {insight.metric && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium">{insight.metric}</span>
                      {getTrendIcon(insight.trend)}
                    </div>
                  )}
                  
                  {insight.action && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={insight.action.onClick}
                      className="w-full mt-2"
                    >
                      {insight.action.icon}
                      {insight.action.label}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickInsights;
