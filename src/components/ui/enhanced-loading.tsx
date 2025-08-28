import React from 'react';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedLoadingProps {
  variant?: 'default' | 'card' | 'fullscreen' | 'success' | 'error';
  text?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const EnhancedLoading: React.FC<EnhancedLoadingProps> = ({
  variant = 'default',
  text = 'Carregando...',
  className,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const getIcon = () => {
    switch (variant) {
      case 'success':
        return <CheckCircle className={cn('text-green-500', sizeClasses[size])} />;
      case 'error':
        return <AlertCircle className={cn('text-red-500', sizeClasses[size])} />;
      default:
        return <Loader2 className={cn('animate-spin', sizeClasses[size])} />;
    }
  };

  const getContainerClasses = () => {
    switch (variant) {
      case 'card':
        return 'p-6 rounded-lg border bg-card';
      case 'fullscreen':
        return 'min-h-screen flex items-center justify-center';
      default:
        return 'flex items-center justify-center p-4';
    }
  };

  return (
    <div className={cn(getContainerClasses(), className)}>
      <div className="flex flex-col items-center space-y-3">
        <div className="relative">
          {getIcon()}
          {variant === 'default' && (
            <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping"></div>
          )}
        </div>
        {text && (
          <p className="text-sm text-muted-foreground font-medium animate-pulse">
            {text}
          </p>
        )}
      </div>
    </div>
  );
};