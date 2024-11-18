// src/lib/error-utils.ts
import { ZodError } from 'zod';
import { ValidationError } from '@/lib/validations/trade-schemas';

export type ErrorType = 'validation' | 'api' | 'network' | 'unknown';

export interface AppError {
  type: ErrorType;
  message: string;
  errors?: ValidationError[];
  status?: number;
  originalError?: unknown;
}

export function isAppError(error: unknown): error is AppError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'type' in error &&
    'message' in error
  );
}

export function createAppError(
  type: ErrorType,
  message: string,
  options: Partial<AppError> = {}
): AppError {
  return {
    type,
    message,
    ...options,
  };
}

export function handleApiError(error: unknown): AppError {
  if (error instanceof Response) {
    return createAppError('api', `API Error: ${error.statusText}`, {
      status: error.status,
      originalError: error,
    });
  }

  if (error instanceof ZodError) {
    return createAppError('validation', 'Validation failed', {
      errors: error.errors.map(err => ({
        path: err.path,
        message: err.message,
      })),
      originalError: error,
    });
  }

  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    return createAppError('network', 'Network connection failed', {
      originalError: error,
    });
  }

  if (error instanceof Error) {
    return createAppError('unknown', error.message, {
      originalError: error,
    });
  }

  return createAppError(
    'unknown',
    'An unexpected error occurred',
    { originalError: error }
  );
}

export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  options: {
    onError?: (error: AppError) => void;
    transformError?: (error: unknown) => AppError;
  } = {}
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    const appError = options.transformError?.(error) || handleApiError(error);
    options.onError?.(appError);
    throw appError;
  }
}