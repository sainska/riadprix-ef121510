/**
 * Monitoring, Logging, and Error Handling Utilities
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  error?: Error;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 100;

  log(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
    };

    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output
    const logMethod = level === LogLevel.ERROR ? console.error : 
                      level === LogLevel.WARN ? console.warn :
                      level === LogLevel.INFO ? console.info : console.debug;
    
    logMethod(`[${level.toUpperCase()}] ${message}`, context || '', error || '');

    // In production, you might want to send to a logging service
    if (level === LogLevel.ERROR && typeof window !== 'undefined') {
      // Could send to Sentry, LogRocket, etc.
      this.sendToExternalService(entry);
    }
  }

  private sendToExternalService(entry: LogEntry) {
    // Placeholder for external logging service integration
    // Example: Sentry.captureException(entry.error);
  }

  debug(message: string, context?: Record<string, unknown>) {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: Record<string, unknown>) {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: Record<string, unknown>) {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, error?: Error, context?: Record<string, unknown>) {
    this.log(LogLevel.ERROR, message, context, error);
  }

  getLogs(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.logs.filter(log => log.level === level);
    }
    return [...this.logs];
  }

  clear() {
    this.logs = [];
  }
}

export const logger = new Logger();

// Error Boundary Helper
export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// Error Handler Utility
export function handleError(error: unknown, context?: Record<string, unknown>): AppError {
  if (error instanceof AppError) {
    logger.error(error.message, error, { ...error.context, ...context });
    return error;
  }

  if (error instanceof Error) {
    logger.error(error.message, error, context);
    return new AppError(error.message, 'UNKNOWN_ERROR', 500, context);
  }

  const message = String(error);
  logger.error(message, undefined, context);
  return new AppError(message, 'UNKNOWN_ERROR', 500, context);
}

// Performance Monitoring
export function measurePerformance<T>(
  name: string,
  fn: () => T | Promise<T>
): Promise<T> | T {
  const start = performance.now();
  const result = fn();

  if (result instanceof Promise) {
    return result.finally(() => {
      const duration = performance.now() - start;
      logger.debug(`Performance: ${name}`, { duration: `${duration.toFixed(2)}ms` });
    });
  }

  const duration = performance.now() - start;
  logger.debug(`Performance: ${name}`, { duration: `${duration.toFixed(2)}ms` });
  return result;
}

