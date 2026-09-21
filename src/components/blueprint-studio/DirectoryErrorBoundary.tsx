import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface DirectoryErrorBoundaryProps {
  onClose: () => void;
  children: React.ReactNode;
}

interface DirectoryErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class DirectoryErrorBoundary extends React.Component<
  DirectoryErrorBoundaryProps,
  DirectoryErrorBoundaryState
> {
  constructor(props: DirectoryErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): DirectoryErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('DirectoryErrorBoundary caught an error:', error, errorInfo);
  }

  handleClose = () => {
    this.setState({ hasError: false, error: undefined });
    this.props.onClose();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          id="directory-error-fallback-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150"
        >
          <div
            id="directory-error-fallback-card"
            className="bg-white dark:bg-[#1E141B] border-2 border-[#8C6D3B]/40 dark:border-[#C29A52]/40 rounded-2xl p-6 max-w-md w-full shadow-2xl text-center space-y-4 text-stone-800 dark:text-stone-100"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center font-bold">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-serif font-bold text-stone-900 dark:text-stone-100">
                Blueprint Directory could not be displayed.
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                An unexpected rendering issue occurred in the directory view. The underlying Board Blueprints screen remains intact.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center">
              <button
                id="btn-close-directory-error-fallback"
                onClick={this.handleClose}
                className="min-h-[38px] px-6 py-2 rounded-xl bg-[#5A1832] dark:bg-[#C29A52] hover:bg-[#35101F] text-white dark:text-[#1e0f18] text-xs font-bold shadow-xs transition-colors flex items-center space-x-1.5"
              >
                <X className="w-4 h-4" />
                <span>Close</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
