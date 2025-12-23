import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ToastContainer } from '@/components/ui/Toast';

// Pages
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { AuthCallback } from '@/pages/AuthCallback';

// Dashboard
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { OverviewView } from '@/components/dashboard/OverviewView';
import { PromptEditor } from '@/components/dashboard/PromptEditor';
import { MonitorView } from '@/components/dashboard/MonitorView';
import { DeploymentsView } from '@/components/dashboard/DeploymentsView';

/**
 * Protected route wrapper - redirects to login if not authenticated.
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

/**
 * Public route wrapper - redirects to dashboard if already authenticated.
 */
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};

/**
 * Main application routes.
 */
const AppRoutes: React.FC = () => {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Protected dashboard routes */}
            <Route
                path="/dashboard/*"
                element={
                    <ProtectedRoute>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<OverviewView />} />
                <Route path="editor" element={<PromptEditor />} />
                <Route path="monitor" element={<MonitorView />} />
                <Route path="deployments" element={<DeploymentsView />} />
                <Route path="experiments" element={<div className="p-6 text-gray-500">Experiments - Coming Soon</div>} />
                <Route path="settings" element={<div className="p-6 text-gray-500">Settings - Coming Soon</div>} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
};

/**
 * Main App component with providers.
 */
function App() {
    return (
        <Router>
            <AuthProvider>
                <AppRoutes />
                <ToastContainer />
            </AuthProvider>
        </Router>
    );
}

export default App;
