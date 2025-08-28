import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Building2, 
  Users, 
  MapPin, 
  Phone, 
  CheckCircle, 
  Info,
  ArrowRight
} from 'lucide-react';

interface ClientRegistrationSummaryProps {
  onStartRegistration: () => void;
}

const ClientRegistrationSummary: React.FC<ClientRegistrationSummaryProps> = ({ onStartRegistration }) => {
  const registrationSteps = [
    {
      icon: <Building2 className="h-4 w-4" />,
      title: 'Informações Básicas',
      description: 'Razão social, documento, tipo de cliente',
      required: true
    },
    {
      icon: <MapPin className="h-4 w-4" />,
      title: 'Endereços',
      description: 'Principal, cobrança, entrega',
      required: false
    },
    {
      icon: <Phone className="h-4 w-4" />,
      title: 'Contatos',
      description: 'Telefone, email, WhatsApp',
      required: false
    },
    {
      icon: <Users className="h-4 w-4" />,
      title: 'Pessoas de Contato',
      description: 'Tomadores de decisão, contatos principais',
      required: false
    }
  ];

  const tips = [
    'Código do cliente é gerado automaticamente se não informado',
    'Clientes estratégicos recebem prioridade no atendimento',
    'Endereços podem ser adicionados posteriormente',
    'Pessoas de contato podem ser marcadas como tomadores de decisão'
  ];

  return (
    <Card className="shadow-soft border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-title tracking-title">
          <Plus className="h-5 w-5" />
          Cadastro de Clientes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Resumo do Processo */}
        <div>
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <Info className="h-4 w-4 text-primary" />
            Processo de Cadastro
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {registrationSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <div className="text-primary mt-0.5">
                  {step.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{step.title}</h4>
                    {step.required && (
                      <Badge variant="outline" className="text-xs">Obrigatório</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dicas */}
        <div>
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-success" />
            Dicas Importantes
          </h3>
          <div className="space-y-2">
            {tips.map((tip, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <CheckCircle className="h-3 w-3 text-success mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Botão de Ação */}
        <div className="pt-4 border-t">
          <Button 
            onClick={onStartRegistration}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Iniciar Cadastro de Cliente
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientRegistrationSummary;
