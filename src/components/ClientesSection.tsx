import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, History, Users, BarChart3 } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestão de Clientes</h1>
            <p className="text-sm text-gray-600 mt-1">Gerencie seus clientes e histórico de serviços</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
              <Building2 className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-700 font-medium">59 clientes cadastrados</span>
            </div>
            <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
              <Users className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-700 font-medium">49 estratégicos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="h-12 bg-transparent p-0 space-x-8">
            <TabsTrigger 
              value="gestao" 
              className="flex items-center space-x-2 h-12 px-0 border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none"
            >
              <Building2 className="h-4 w-4" />
              <span>Gestão de Clientes</span>
            </TabsTrigger>
            <TabsTrigger 
              value="historico" 
              className="flex items-center space-x-2 h-12 px-0 border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none"
            >
              <History className="h-4 w-4" />
              <span>Histórico de Serviços</span>
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="flex items-center space-x-2 h-12 px-0 border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <div className="p-6">
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
