import { z } from 'zod';

// Tipos de erro
export enum ErrorType {
  VALIDATION = 'VALIDATION',
  NETWORK = 'NETWORK',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  UNKNOWN = 'UNKNOWN'
}

export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface AppError {
  type: ErrorType;
  severity: ErrorSeverity;
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  userFriendlyMessage: string;
  retryable: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

// Classe de erro customizada
export class CustomAppError extends Error implements AppError {
  public readonly type: ErrorType;
  public readonly severity: ErrorSeverity;
  public readonly code: string;
  public readonly details?: any;
  public readonly timestamp: Date;
  public readonly userFriendlyMessage: string;
  public readonly retryable: boolean;

  constructor(
    type: ErrorType,
    code: string,
    message: string,
    userFriendlyMessage: string,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    details?: any,
    retryable: boolean = false
  ) {
    super(message);
    this.name = 'CustomAppError';
    this.type = type;
    this.severity = severity;
    this.code = code;
    this.message = message;
    this.userFriendlyMessage = userFriendlyMessage;
    this.details = details;
    this.timestamp = new Date();
    this.retryable = retryable;
  }
}

// Funções utilitárias para tratamento de erros
export const errorHandlers = {
  // Tratar erros de validação Zod
  handleZodError: (error: z.ZodError): AppError => {
    const validationErrors: ValidationError[] = error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
      value: err.received
    }));

    return new CustomAppError(
      ErrorType.VALIDATION,
      'VALIDATION_ERROR',
      'Erro de validação dos dados',
      'Por favor, verifique os dados informados e tente novamente.',
      ErrorSeverity.LOW,
      validationErrors,
      true
    );
  },

  // Tratar erros de rede/Supabase
  handleNetworkError: (error: any): AppError => {
    const isNetworkError = !navigator.onLine || 
      error.message?.includes('network') ||
      error.message?.includes('fetch') ||
      error.code === 'NETWORK_ERROR';

    if (isNetworkError) {
      return new CustomAppError(
        ErrorType.NETWORK,
        'NETWORK_ERROR',
        'Erro de conexão com o servidor',
        'Verifique sua conexão com a internet e tente novamente.',
        ErrorSeverity.HIGH,
        error,
        true
      );
    }

    return new CustomAppError(
      ErrorType.SERVER,
      'SERVER_ERROR',
      'Erro interno do servidor',
      'Ocorreu um erro inesperado. Tente novamente em alguns instantes.',
      ErrorSeverity.HIGH,
      error,
      true
    );
  },

  // Tratar erros de autenticação
  handleAuthError: (error: any): AppError => {
    return new CustomAppError(
      ErrorType.AUTHENTICATION,
      'AUTH_ERROR',
      'Erro de autenticação',
      'Sua sessão expirou. Por favor, faça login novamente.',
      ErrorSeverity.MEDIUM,
      error,
      false
    );
  },

  // Tratar erros de autorização
  handleAuthorizationError: (error: any): AppError => {
    return new CustomAppError(
      ErrorType.AUTHORIZATION,
      'FORBIDDEN',
      'Acesso negado',
      'Você não tem permissão para realizar esta ação.',
      ErrorSeverity.MEDIUM,
      error,
      false
    );
  },

  // Tratar erros de "não encontrado"
  handleNotFoundError: (error: any): AppError => {
    return new CustomAppError(
      ErrorType.NOT_FOUND,
      'NOT_FOUND',
      'Recurso não encontrado',
      'O item solicitado não foi encontrado.',
      ErrorSeverity.LOW,
      error,
      false
    );
  },

  // Tratar erros genéricos
  handleGenericError: (error: any): AppError => {
    console.error('Erro não tratado:', error);

    return new CustomAppError(
      ErrorType.UNKNOWN,
      'UNKNOWN_ERROR',
      'Erro inesperado',
      'Ocorreu um erro inesperado. Tente novamente.',
      ErrorSeverity.MEDIUM,
      error,
      true
    );
  }
};

// Função principal para tratar erros
export const handleError = (error: any): AppError => {
  // Se já é um AppError, retorna diretamente
  if (error instanceof CustomAppError) {
    return error;
  }

  // Se é um erro Zod
  if (error instanceof z.ZodError) {
    return errorHandlers.handleZodError(error);
  }

  // Se é um erro do Supabase
  if (error?.code) {
    switch (error.code) {
      case 'PGRST116':
        return errorHandlers.handleNotFoundError(error);
      case '42501':
        return errorHandlers.handleAuthorizationError(error);
      case '23505':
        return new CustomAppError(
          ErrorType.VALIDATION,
          'DUPLICATE_ENTRY',
          'Dado duplicado',
          'Este registro já existe no sistema.',
          ErrorSeverity.LOW,
          error,
          false
        );
      default:
        return errorHandlers.handleNetworkError(error);
    }
  }

  // Se é um erro de rede
  if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
    return errorHandlers.handleNetworkError(error);
  }

  // Erro genérico
  return errorHandlers.handleGenericError(error);
};

// Hook para tratamento de erros em componentes
export const useErrorHandler = () => {
  const handleErrorWithToast = (error: any, showToast: boolean = true) => {
    const appError = handleError(error);
    
    if (showToast) {
      // Aqui você pode integrar com seu sistema de toast
      console.error('Erro tratado:', appError);
    }
    
    return appError;
  };

  const handleAsyncError = async <T>(
    asyncFn: () => Promise<T>,
    showToast: boolean = true
  ): Promise<{ data: T | null; error: AppError | null }> => {
    try {
      const data = await asyncFn();
      return { data, error: null };
    } catch (error) {
      const appError = handleErrorWithToast(error, showToast);
      return { data: null, error: appError };
    }
  };

  return {
    handleError: handleErrorWithToast,
    handleAsyncError
  };
};

// Função para log de erros
export const logError = (error: AppError, context?: string) => {
  const logData = {
    timestamp: error.timestamp.toISOString(),
    type: error.type,
    severity: error.severity,
    code: error.code,
    message: error.message,
    userFriendlyMessage: error.userFriendlyMessage,
    details: error.details,
    context,
    userAgent: navigator.userAgent,
    url: window.location.href
  };

  // Em produção, você pode enviar para um serviço de log
  if (process.env.NODE_ENV === 'development') {
    console.group(`🚨 Erro: ${error.code}`);
    console.error(logData);
    console.groupEnd();
  } else {
    // Enviar para serviço de monitoramento (Sentry, LogRocket, etc.)
    console.error('Erro em produção:', logData);
  }
};

// Função para determinar se um erro é recuperável
export const isRecoverableError = (error: AppError): boolean => {
  return error.retryable && error.severity !== ErrorSeverity.CRITICAL;
};

// Função para obter mensagem amigável baseada no tipo de erro
export const getErrorMessage = (error: AppError): string => {
  return error.userFriendlyMessage;
};

// Função para obter ação recomendada baseada no erro
export const getRecommendedAction = (error: AppError): string => {
  switch (error.type) {
    case ErrorType.VALIDATION:
      return 'Verifique os dados informados e tente novamente.';
    case ErrorType.NETWORK:
      return 'Verifique sua conexão com a internet e tente novamente.';
    case ErrorType.AUTHENTICATION:
      return 'Faça login novamente para continuar.';
    case ErrorType.AUTHORIZATION:
      return 'Entre em contato com o administrador do sistema.';
    case ErrorType.NOT_FOUND:
      return 'O item pode ter sido removido ou você pode ter um link desatualizado.';
    case ErrorType.SERVER:
      return 'Tente novamente em alguns instantes. Se o problema persistir, entre em contato com o suporte.';
    default:
      return 'Tente novamente. Se o problema persistir, entre em contato com o suporte.';
  }
};
