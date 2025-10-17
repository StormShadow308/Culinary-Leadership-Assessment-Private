// Production error handling utilities

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
  context?: Record<string, any>;
}

export class CustomError extends Error implements AppError {
  public statusCode: number;
  public isOperational: boolean;
  public context?: Record<string, any>;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    context?: Record<string, any>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.context = context;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class DatabaseError extends CustomError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 500, true, context);
  }
}

export class ValidationError extends CustomError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 400, true, context);
  }
}

export class AuthenticationError extends CustomError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 401, true, context);
  }
}

export class AuthorizationError extends CustomError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 403, true, context);
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 404, true, context);
  }
}

// Error logging utility
export function logError(error: AppError | Error, context?: Record<string, any>) {
  const errorInfo = {
    message: error.message,
    name: error.name,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    context: context || (error as AppError).context || {},
  };

  if (process.env.NODE_ENV === 'production') {
    // In production, log to external service (e.g., Sentry)
    console.error('Production Error:', JSON.stringify(errorInfo, null, 2));
  } else {
    // In development, log with full details
    console.error('Development Error:', errorInfo);
  }
}

// Global error handler for unhandled rejections
export function setupGlobalErrorHandlers() {
  process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    logError(new Error(`Unhandled Rejection: ${reason}`), { promise });
  });

  process.on('uncaughtException', (error: Error) => {
    logError(error);
    // In production, you might want to exit gracefully
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  });
}

// API error response formatter
export function formatErrorResponse(error: AppError | Error) {
  const isOperational = (error as AppError).isOperational ?? true;
  const statusCode = (error as AppError).statusCode ?? 500;

  // Don't expose internal errors in production
  const message = process.env.NODE_ENV === 'production' && !isOperational
    ? 'Internal server error'
    : error.message;

  return {
    error: {
      message,
      statusCode,
      timestamp: new Date().toISOString(),
      ...(process.env.NODE_ENV !== 'production' && {
        stack: error.stack,
        name: error.name,
      }),
    },
  };
}

// Database error handler
export function handleDatabaseError(error: any, context?: Record<string, any>): DatabaseError {
  let message = 'Database operation failed';
  
  if (error.code) {
    switch (error.code) {
      case '23505': // Unique violation
        message = 'Record already exists';
        break;
      case '23503': // Foreign key violation
        message = 'Referenced record not found';
        break;
      case '23502': // Not null violation
        message = 'Required field is missing';
        break;
      case '42P01': // Undefined table
        message = 'Database table not found';
        break;
      case '42P07': // Duplicate table
        message = 'Database table already exists';
        break;
      default:
        message = `Database error: ${error.message}`;
    }
  }

  logError(new DatabaseError(message, context), { originalError: error });
  return new DatabaseError(message, context);
}

// Validation error handler
export function handleValidationError(message: string, context?: Record<string, any>): ValidationError {
  logError(new ValidationError(message, context));
  return new ValidationError(message, context);
}
