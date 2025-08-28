import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, History, Users, BarChart3, TrendingUp, Target, Zap } from 'lucide-react';
import ClientsManagement from './clients/ClientsManagement';
import ServiceHistoryManager from './clients/ServiceHistoryManager';
import ClientAnalytics from './clients/ClientAnalytics';

const ClientesSection = () => {
  const [activeTab, setActiveTab] = useState('gestao');

  useEffect(() => {
    console.log('🎯 ClientesSection carregado!');
    console.log('📊 Aba ativa:', activeTab);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto max-w-container px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-title tracking-title text-foreground">Painel de Valor - Clientes</h1>
              <p className="text-muted-foreground mt-1">Gestão estratégica orientada a resultados para equipes comerciais e de atendimento</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-primary/10 px-3 py-1 rounded-full">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm text-primary font-medium">+15% crescimento</span>
              </div>
              <div className="flex items-center space-x-2 bg-success/10 px-3 py-1 rounded-full">
                <Target className="h-4 w-4 text-success" />
                <span className="text-sm text-success font-medium">Meta atingida</span>
              </div>
              <div className="flex items-center space-x-2 bg-warning/10 px-3 py-1 rounded-full">
                <Zap className="h-4 w-4 text-warning" />
                <span className="text-sm text-warning font-medium">Eficiência +25%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto max-w-container px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="h-12 bg-transparent p-0 space-x-8">
              <TabsTrigger 
                value="gestao" 
                className="flex items-center space-x-2 h-12 px-0 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none"
              >
                <Building2 className="h-4 w-4" />
                <span>Gestão Estratégica</span>
              </TabsTrigger>
              <TabsTrigger 
                value="historico" 
                className="flex items-center space-x-2 h-12 px-0 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none"
              >
                <History className="h-4 w-4" />
                <span>Histórico de Serviços</span>
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="flex items-center space-x-2 h-12 px-0 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Analytics Avançado</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-container px-4 py-6">
        <Tabs value={activeTab} className="w-full">
          <TabsContent value="gestao" className="mt-6">
            <ClientsManagement />
          </TabsContent>
          
          <TabsContent value="historico" className="mt-6">
            <ServiceHistoryManager />
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-6">
            <ClientAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientesSection;
