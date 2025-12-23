import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Error Boundary for production
class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean; error: Error | null }
> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Application Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-background flex items-center justify-center p-8">
                    <div className="max-w-md text-center">
                        <h1 className="text-2xl font-bold text-red-400 mb-4">Application Error</h1>
                        <p className="text-gray-400 mb-4">Something went wrong. Please refresh the page.</p>
                        <pre className="text-xs text-gray-500 bg-surface p-4 rounded-lg overflow-auto text-left">
                            {this.state.error?.message}
                        </pre>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-sm font-medium transition-colors"
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

const rootElement = document.getElementById('root');

if (!rootElement) {
    throw new Error('Root element not found');
}

ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    </React.StrictMode>
);
