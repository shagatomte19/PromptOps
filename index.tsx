import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

// Simple Error Boundary
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, color: 'white', background: '#111', height: '100vh', fontFamily: 'sans-serif' }}>
          <h1 style={{ color: '#ff5555' }}>Application Error</h1>
          <p>Something went wrong initializing the application.</p>
          <pre style={{ color: '#aaa', marginTop: 20, background: '#000', padding: 20, borderRadius: 8, overflow: 'auto' }}>
            {this.state.error?.toString()}
          </pre>
          <p style={{ color: '#666', marginTop: 20 }}>Check the developer console for full stack trace.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
} catch (e) {
  console.error("Failed to mount React app:", e);
  rootElement.innerHTML = `<div style="padding: 20px; color: red;">Failed to mount application: ${e}</div>`;
}