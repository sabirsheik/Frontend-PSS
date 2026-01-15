import React from "react";
// Error Boundary Component
interface ErrorBoundaryProps {
  fallback?: React.ReactNode;
  children: React.ReactNode;
}
// Handler for errors in child components
interface ErrorBoundaryState {
  hasError: boolean;
}
// Error Boundary Class Component
class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }
// Update state when an error is caught
  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }
// Log error details
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught error:", error, errorInfo);
  }
// Render fallback UI or children
  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <h2>Something went wrong.</h2>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
