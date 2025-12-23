import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { WorkspaceProvider } from '../../contexts/WorkspaceContext';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { PromptEditor } from '../../components/dashboard/PromptEditor';
import { MonitorView } from '../../components/dashboard/MonitorView';
import { DeploymentsView } from '../../components/dashboard/DeploymentsView';
import { OverviewView } from '../../components/dashboard/OverviewView';

export const Dashboard: React.FC = () => {
    return (
        <WorkspaceProvider>
            <Routes>
                <Route element={<DashboardLayout />}>
                    <Route index element={<OverviewView />} />
                    <Route path="editor" element={<PromptEditor />} />
                    <Route path="monitor" element={<MonitorView />} />
                    <Route path="deployments" element={<DeploymentsView />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Route>
            </Routes>
        </WorkspaceProvider>
    );
};