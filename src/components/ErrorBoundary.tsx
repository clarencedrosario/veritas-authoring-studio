import React, { ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Veritas ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReload = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[280px] p-8 flex flex-col items-center justify-center text-center bg-[#EDE4D6] dark:bg-[#1e0f18] text-[#292521] dark:text-[#F6F0E7] border border-[#CBBEAC] dark:border-[#4f2c3d] rounded-2xl m-4">
          <div className="w-12 h-12 rounded-xl bg-[#5A1832] text-[#C29A52] flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-serif font-bold text-[#35101F] dark:text-[#F6F0E7] mb-2">
            {this.props.fallbackTitle || 'A component encountered an issue'}
          </h3>
          <p className="text-[14.5px] text-[#71685E] dark:text-[#c9b9a6] max-w-md mb-5 leading-relaxed">
            {this.state.error?.message || 'An unexpected rendering condition occurred.'}
          </p>
          <button
            onClick={this.handleReload}
            className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#5A1832] hover:bg-[#35101F] text-[#F6F0E7] text-[15px] font-semibold flex items-center space-x-2 shadow-xs transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-[#C29A52]" />
            <span>Recover View</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
