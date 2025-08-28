import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

interface MobileAppFeatures {
  isInstalled: boolean;
  isStandalone: boolean;
  isOnline: boolean;
  canInstall: boolean;
  installPrompt: any;
  showInstallPrompt: () => void;
  registerServiceWorker: () => Promise<void>;
  requestNotificationPermission: () => Promise<boolean>;
  sendNotification: (title: string, options?: NotificationOptions) => void;
  vibrate: (pattern?: number | number[]) => void;
  share: (data: ShareData) => Promise<void>;
  getBatteryInfo: () => Promise<BatteryInfo>;
  getNetworkInfo: () => Promise<NetworkInfo>;
}

interface BatteryInfo {
  level: number;
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
}

interface NetworkInfo {
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
}

export const useMobileApp = (): MobileAppFeatures => {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [canInstall, setCanInstall] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  // Verificar se o app está instalado
  useEffect(() => {
    const checkInstallation = () => {
      // Verificar se está em modo standalone (instalado)
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
                              (window.navigator as any).standalone === true;
      
      setIsStandalone(isStandaloneMode);
      setIsInstalled(isStandaloneMode);
    };

    checkInstallation();
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      toast({
        title: "App Instalado!",
        description: "StarPrint CRM foi instalado com sucesso no seu dispositivo.",
      });
    });
  }, []);

  // Monitorar status online/offline
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Conexão Restaurada",
        description: "Você está online novamente.",
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "Modo Offline",
        description: "Algumas funcionalidades podem estar limitadas.",
        variant: "destructive"
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Capturar prompt de instalação
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      setCanInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Registrar Service Worker
  const registerServiceWorker = useCallback(async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registrado:', registration);
        
        // Verificar atualizações
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                toast({
                  title: "Nova Versão Disponível",
                  description: "Uma nova versão do app está disponível. Recarregue para atualizar.",
                });
              }
            });
          }
        });

        return registration;
      } catch (error) {
        console.error('Erro ao registrar Service Worker:', error);
        throw error;
      }
    }
  }, []);

  // Solicitar permissão de notificação
  const requestNotificationPermission = useCallback(async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.log('Este navegador não suporta notificações');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      toast({
        title: "Permissão Negada",
        description: "As notificações foram negadas. Você pode habilitar nas configurações do navegador.",
        variant: "destructive"
      });
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        toast({
          title: "Notificações Habilitadas",
          description: "Você receberá notificações importantes do StarPrint CRM.",
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao solicitar permissão de notificação:', error);
      return false;
    }
  }, []);

  // Enviar notificação
  const sendNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (Notification.permission === 'granted') {
      const notification = new Notification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        ...options
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }
  }, []);

  // Vibração
  const vibrate = useCallback((pattern: number | number[] = 200) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }, []);

  // Compartilhamento
  const share = useCallback(async (data: ShareData) => {
    if ('share' in navigator) {
      try {
        await navigator.share(data);
      } catch (error) {
        console.error('Erro ao compartilhar:', error);
      }
    } else {
      // Fallback para navegadores que não suportam Web Share API
      if (data.url) {
        navigator.clipboard.writeText(data.url);
        toast({
          title: "Link Copiado",
          description: "O link foi copiado para a área de transferência.",
        });
      }
    }
  }, []);

  // Informações da bateria
  const getBatteryInfo = useCallback(async (): Promise<BatteryInfo> => {
    if ('getBattery' in navigator) {
      try {
        const battery = await (navigator as any).getBattery();
        return {
          level: battery.level,
          charging: battery.charging,
          chargingTime: battery.chargingTime,
          dischargingTime: battery.dischargingTime
        };
      } catch (error) {
        console.error('Erro ao obter informações da bateria:', error);
      }
    }
    
    return {
      level: 0,
      charging: false,
      chargingTime: 0,
      dischargingTime: 0
    };
  }, []);

  // Informações da rede
  const getNetworkInfo = useCallback(async (): Promise<NetworkInfo> => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      return {
        effectiveType: connection.effectiveType || 'unknown',
        downlink: connection.downlink || 0,
        rtt: connection.rtt || 0,
        saveData: connection.saveData || false
      };
    }
    
    return {
      effectiveType: 'unknown',
      downlink: 0,
      rtt: 0,
      saveData: false
    };
  }, []);

  // Mostrar prompt de instalação
  const showInstallPrompt = useCallback(() => {
    if (installPrompt) {
      installPrompt.prompt();
      installPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('Usuário aceitou a instalação');
          setCanInstall(false);
        } else {
          console.log('Usuário recusou a instalação');
        }
        setInstallPrompt(null);
      });
    }
  }, [installPrompt]);

  return {
    isInstalled,
    isStandalone,
    isOnline,
    canInstall,
    installPrompt,
    showInstallPrompt,
    registerServiceWorker,
    requestNotificationPermission,
    sendNotification,
    vibrate,
    share,
    getBatteryInfo,
    getNetworkInfo
  };
};
