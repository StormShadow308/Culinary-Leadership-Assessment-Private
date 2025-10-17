// Production logging utility

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  environment: string;
  service: string;
}

class Logger {
  private service: string;
  private environment: string;

  constructor(service: string = 'culinary-assessment') {
    this.service = service;
    this.environment = process.env.NODE_ENV || 'development';
  }

  private formatLog(level: LogLevel, message: string, context?: Record<string, any>): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      environment: this.environment,
      service: this.service,
    };
  }

  private shouldLog(level: LogLevel): boolean {
    const logLevel = process.env.LOG_LEVEL?.toLowerCase() as LogLevel || LogLevel.INFO;
    const levels = [LogLevel.ERROR, LogLevel.WARN, LogLevel.INFO, LogLevel.DEBUG];
    const currentLevelIndex = levels.indexOf(logLevel);
    const messageLevelIndex = levels.indexOf(level);
    
    return messageLevelIndex <= currentLevelIndex;
  }

  private output(entry: LogEntry): void {
    if (!this.shouldLog(entry.level)) {
      return;
    }

    if (this.environment === 'production') {
      // In production, use structured logging
      console.log(JSON.stringify(entry));
    } else {
      // In development, use human-readable format
      const { timestamp, level, message, context } = entry;
      const contextStr = context ? ` ${JSON.stringify(context, null, 2)}` : '';
      console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}${contextStr}`);
    }
  }

  error(message: string, context?: Record<string, any>): void {
    const entry = this.formatLog(LogLevel.ERROR, message, context);
    this.output(entry);
  }

  warn(message: string, context?: Record<string, any>): void {
    const entry = this.formatLog(LogLevel.WARN, message, context);
    this.output(entry);
  }

  info(message: string, context?: Record<string, any>): void {
    const entry = this.formatLog(LogLevel.INFO, message, context);
    this.output(entry);
  }

  debug(message: string, context?: Record<string, any>): void {
    const entry = this.formatLog(LogLevel.DEBUG, message, context);
    this.output(entry);
  }

  // Specialized logging methods
  apiRequest(method: string, url: string, statusCode: number, responseTime?: number): void {
    this.info('API Request', {
      method,
      url,
      statusCode,
      responseTime: responseTime ? `${responseTime}ms` : undefined,
    });
  }

  databaseQuery(query: string, duration?: number, error?: string): void {
    if (error) {
      this.error('Database Query Failed', { query, duration, error });
    } else {
      this.debug('Database Query', { query, duration: duration ? `${duration}ms` : undefined });
    }
  }

  authentication(action: string, userId?: string, success: boolean = true): void {
    this.info('Authentication', {
      action,
      userId,
      success,
    });
  }

  emailSent(to: string, template: string, success: boolean = true, error?: string): void {
    if (success) {
      this.info('Email Sent', { to, template });
    } else {
      this.error('Email Failed', { to, template, error });
    }
  }

  performance(operation: string, duration: number, context?: Record<string, any>): void {
    const level = duration > 5000 ? LogLevel.WARN : LogLevel.INFO;
    const entry = this.formatLog(level, `Performance: ${operation}`, {
      duration: `${duration}ms`,
      ...context,
    });
    this.output(entry);
  }
}

// Export singleton instance
export const logger = new Logger();

// Export class for custom instances
export { Logger };
