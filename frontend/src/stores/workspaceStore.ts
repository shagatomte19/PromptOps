/**
 * Workspace store using Zustand for state management.
 * Manages prompts, environments, logs, and UI state.
 */

import { create } from 'zustand';
import type { PromptListItem, Environment, ActivityLog } from '@/types';
import { promptsService, environmentsService, activityService } from '@/services';

// Types
export interface WorkspaceState {
    // Data
    prompts: PromptListItem[];
    environments: Environment[];
    logs: ActivityLog[];

    // UI State
    activeEnvironment: 'production' | 'staging' | 'development';
    isLoading: boolean;
    error: string | null;

    // Actions
    setActiveEnvironment: (env: 'production' | 'staging' | 'development') => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;

    // Data fetching
    fetchPrompts: () => Promise<void>;
    fetchEnvironments: () => Promise<void>;
    fetchLogs: () => Promise<void>;

    // Local log management
    addLog: (level: ActivityLog['level'], message: string, source?: string) => void;
    clearLogs: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
    // Initial state
    prompts: [],
    environments: [],
    logs: [],
    activeEnvironment: 'production',
    isLoading: false,
    error: null,

    // UI Actions
    setActiveEnvironment: (env) => set({ activeEnvironment: env }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),

    // Fetch prompts from API
    fetchPrompts: async () => {
        try {
            set({ isLoading: true, error: null });
            const prompts = await promptsService.list();
            set({ prompts, isLoading: false });
        } catch (error) {
            set({ error: 'Failed to fetch prompts', isLoading: false });
            console.error('Error fetching prompts:', error);
        }
    },

    // Fetch environments from API
    fetchEnvironments: async () => {
        try {
            const environments = await environmentsService.list();
            set({ environments });
        } catch (error) {
            console.error('Error fetching environments:', error);
        }
    },

    // Fetch activity logs from API
    fetchLogs: async () => {
        try {
            const logs = await activityService.getRecent(50);
            set({ logs });
        } catch (error) {
            console.error('Error fetching logs:', error);
        }
    },

    // Add local log entry (for immediate UI feedback)
    addLog: (level, message, source = 'System') => {
        const newLog: ActivityLog = {
            id: Date.now(),
            user_id: '',
            level,
            action: 'local',
            message,
            source,
            metadata: null,
            timestamp: new Date().toISOString(),
        };
        set((state) => ({
            logs: [newLog, ...state.logs].slice(0, 100),
        }));
    },

    // Clear logs
    clearLogs: () => set({ logs: [] }),
}));

// Selector hooks for performance
export const usePrompts = () => useWorkspaceStore((state) => state.prompts);
export const useEnvironments = () => useWorkspaceStore((state) => state.environments);
export const useLogs = () => useWorkspaceStore((state) => state.logs);
export const useActiveEnvironment = () => useWorkspaceStore((state) => state.activeEnvironment);
export const useIsLoading = () => useWorkspaceStore((state) => state.isLoading);
