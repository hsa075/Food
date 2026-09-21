import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import { JowarMandala } from './JowarMandala/JowarMandala';
import { JowarLoadingMark } from './JowarMandala/JowarLoadingMark';

export interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
      <div className="w-16 h-16 rounded-full bg-uttara-cream flex items-center justify-center text-uttara-terracotta mb-4 border border-uttara-cream-border/80 relative">
        {icon || (
          <JowarMandala
            size={36}
            variant="terracotta"
            opacity={0.8}
            strokeWidth={1.3}
          />
        )}
      </div>
      <h3 className="text-lg font-serif font-semibold text-uttara-charcoal mb-2">{title}</h3>
      <p className="text-sm text-uttara-charcoal-muted leading-relaxed mb-6">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction} variant="primary" size="sm">
          {actionText}
        </Button>
      )}
    </div>
  );
};

export interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Preparing fresh oota...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <JowarLoadingMark size="md" message={message} />
    </div>
  );
};

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
      <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 mb-3 border border-rose-200">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-uttara-charcoal mb-1">{title}</h3>
      <p className="text-sm text-uttara-charcoal-muted mb-4">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm" className="gap-2">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </Button>
      )}
    </div>
  );
};
