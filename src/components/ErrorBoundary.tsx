// src/components/ErrorBoundary.tsx
'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AppError, isAppError } from '@/lib/error-utils';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: AppError) => void;
}

interface State {
  error: AppError | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    error: null,
  };

  public static getDerivedStateFromError(error: unknown): State {
    if (isAppError(error)) {
      return { error };
    }
    return {
      error: {
        type: 'unknown',
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      },
    };
  }

  public componentDidCatch(error: unknown) {
    if (this.props.onError && isAppError(error)) {
      this.props.onError(error);
    }
  }

  private handleReset = () => {
    this.setState({ error: null });
  };

  public render() {
    if (this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Alert variant="destructive" className="my-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="mt-2">
            <div className="space-y-2">
              <p>{this.state.error.message}</p>
              {this.state.error.type === 'validation' && this.state.error.errors && (
                <ul className="list-disc pl-4 space-y-1">
                  {this.state.error.errors.map((err, index) => (
                    <li key={index} className="text-sm">
                      {err.message}
                    </li>
                  ))}
                </ul>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={this.handleReset}
                className="mt-2"
              >
                Try Again
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}

export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<Props, 'children'> = {}
) {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary {...options}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}