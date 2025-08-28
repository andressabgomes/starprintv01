import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Smartphone, 
  X, 
  Star, 
  Zap, 
  Shield,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useMobileApp } from '@/hooks/useMobileApp';

interface InstallAppBannerProps {
  onClose?: () => void;
}

const InstallAppBanner: React.FC<InstallAppBannerProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const { 
    canInstall, 
    isInstalled, 
    isOnline, 
    showInstallPrompt,
    registerServiceWorker,
    requestNotificationPermission
  } = useMobileApp();

  useEffect(() => {
    // Verificar se já foi dispensado
    const dismissed = localStorage.getItem('app-install-dismissed');
    if (dismissed) {
      setIsDismissed(true);
    }

    // Mostrar banner se pode instalar e não está instalado
    if (canInstall && !isInstalled && !isDismissed) {
      setIsVisible(true);
    }
  }, [canInstall, isInstalled, isDismissed]);

  const handleInstall = async () => {
    try {
      // Registrar service worker primeiro
      await registerServiceWorker();
      
      // Solicitar permissão de notificação
      await requestNotificationPermission();
      
      // Mostrar prompt de instalação
      showInstallPrompt();
      
      // Ocultar banner
      setIsVisible(false);
    } catch (error) {
      console.error('Erro ao instalar app:', error);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('app-install-dismissed', 'true');
    onClose?.();
  };

  const handleRemindLater = () => {
    setIsVisible(false);
    // Remover do localStorage para mostrar novamente em 24h
    setTimeout(() => {
      localStorage.removeItem('app-install-dismissed');
    }, 24 * 60 * 60 * 1000);
    onClose?.();
  };

  if (!isVisible || isInstalled) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 left-4 right-4 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <Smartphone className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-semibold text-white">Instalar StarPrint CRM</h3>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  App
                </Badge>
              </div>
              <p className="text-sm text-white/90 mb-3">
                Instale o app para acesso rápido, notificações e funcionalidade offline
              </p>
              
              {/* Benefícios */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="flex items-center space-x-1 text-xs">
                  <Zap className="h-3 w-3" />
                  <span>Acesso Rápido</span>
                </div>
                <div className="flex items-center space-x-1 text-xs">
                  <Wifi className="h-3 w-3" />
                  <span>Funciona Offline</span>
                </div>
                <div className="flex items-center space-x-1 text-xs">
                  <Star className="h-3 w-3" />
                  <span>Notificações</span>
                </div>
                <div className="flex items-center space-x-1 text-xs">
                  <Shield className="h-3 w-3" />
                  <span>Mais Seguro</span>
                </div>
              </div>

              {/* Botões */}
              <div className="flex space-x-2">
                <Button 
                  onClick={handleInstall}
                  className="flex-1 bg-white text-blue-600 hover:bg-white/90"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Instalar
                </Button>
                <Button 
                  onClick={handleRemindLater}
                  variant="outline" 
                  className="border-white/30 text-white hover:bg-white/10"
                  size="sm"
                >
                  Depois
                </Button>
              </div>
            </div>
          </div>
          
          <Button
            onClick={handleDismiss}
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InstallAppBanner;
