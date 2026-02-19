import { useCallback } from 'react';

interface ErrorLog {
  error: Error;
  errorInfo: any;
  timestamp: string;
  url: string;
  userAgent: string;
}

export const useErrorLogger = () => {
  const logError = useCallback(async (error: Error, errorInfo: any) => {
    const errorLog: ErrorLog = {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } as Error,
      errorInfo,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    // Сохраняем в localStorage для отладки
    const errors = JSON.parse(localStorage.getItem('error_logs') || '[]');
    errors.push(errorLog);
    localStorage.setItem('error_logs', JSON.stringify(errors.slice(-10))); // Храним только последние 10

    // В продакшене здесь был бы вызов API для логирования
    console.error('Error logged:', errorLog);

    // Можно отправить в Sentry или другой сервис
    // if (process.env.NODE_ENV === 'production') {
    //   await fetch('/api/log-error', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(errorLog),
    //   });
    // }
  }, []);

  return { logError };
};