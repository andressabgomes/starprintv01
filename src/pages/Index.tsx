
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigation } from '@/hooks/useNavigation';
import CRMLayout from '../components/CRMLayout';
import { WelcomeScreen } from '../components/auth/WelcomeScreen';
import { EnhancedLoading } from '../components/ui/enhanced-loading';

const Index = () => {
  const { user } = useAuth();
  const { setActiveSection } = useNavigation();
  const [showWelcome, setShowWelcome] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Mostrar tela de boas-vindas por 4 segundos
    const timer = setTimeout(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setShowWelcome(false);
        setActiveSection('dashboard');
        setIsTransitioning(false);
      }, 500); // Tempo para a transição
    }, 4000);

    return () => clearTimeout(timer);
  }, [setActiveSection]);

  const handleSkipWelcome = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setShowWelcome(false);
      setActiveSection('dashboard');
      setIsTransitioning(false);
    }, 300);
  };

  if (isTransitioning) {
    return (
      <EnhancedLoading 
        variant="fullscreen" 
        text="Carregando dashboard..." 
        size="lg"
      />
    );
  }

  if (showWelcome) {
    return <WelcomeScreen user={user} onSkip={handleSkipWelcome} />;
  }

  return <CRMLayout />;
};

export default Index;
