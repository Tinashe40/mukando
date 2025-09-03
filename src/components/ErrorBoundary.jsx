import React from 'react';
import Icon from "./AppIcon";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    error.__ErrorBoundary = true;
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error("Error caught by ErrorBoundary:", error, errorInfo);
    }
    
    // Call any custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    window.__COMPONENT_ERROR__?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="text-center max-w-md p-6 bg-card rounded-lg border border-border shadow-warm">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center">
                <Icon name="AlertTriangle" size={32} className="text-error" />
              </div>
            </div>

            <h2 className="text-xl font-semibold text-foreground mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-6">
              We encountered an unexpected error while processing your request.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left mb-4 bg-muted p-3 rounded text-sm">
                <summary className="cursor-pointer font-medium">Error Details</summary>
                <p className="mt-2 font-data">{this.state.error.toString()}</p>
                <pre className="mt-2 text-xs overflow-auto">
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2"
              >
                <Icon name="RefreshCw" size={16} />
                Reload Page
              </button>
              
              <button
                onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                className="border border-input bg-background px-4 py-2 rounded-md text-sm font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;