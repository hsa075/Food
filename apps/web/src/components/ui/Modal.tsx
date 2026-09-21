'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-xl',
  }[maxWidth];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-uttara-charcoal/50 backdrop-blur-xs animate-fadeIn">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
        aria-hidden="true" 
      />
      <div className={`relative w-full ${maxWidthClass} bg-white rounded-brand shadow-lifted border border-uttara-cream-border p-6 z-10 transition-all`}>
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-uttara-cream-border">
          {title && <h3 className="text-lg font-serif font-semibold text-uttara-charcoal">{title}</h3>}
          <button
            onClick={onClose}
            className="p-1 rounded-full text-uttara-charcoal-muted hover:bg-uttara-cream hover:text-uttara-charcoal transition-colors ml-auto"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end md:hidden bg-uttara-charcoal/40 backdrop-blur-xs">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full bg-white rounded-t-2xl shadow-lifted border-t border-uttara-cream-border p-5 z-10 max-h-[85vh] overflow-y-auto">
        {/* Drag handle pill */}
        <div className="w-12 h-1.5 bg-uttara-cream-border rounded-full mx-auto mb-4" />
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-uttara-cream-border">
          {title && <h3 className="text-lg font-serif font-semibold text-uttara-charcoal">{title}</h3>}
          <button
            onClick={onClose}
            className="p-1 rounded-full text-uttara-charcoal-muted hover:bg-uttara-cream ml-auto"
            aria-label="Close sheet"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};
