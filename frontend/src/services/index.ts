/**
 * Environments, Experiments, Deployments, Metrics, Activity API services.
 */

import api from './api';
import type {
    Environment,
    Experiment,
    Deployment,
    MetricsOverview,
    LatencyData,
    CostData,
    ActivityLog,
} from '@/types';

// Re-export services from separate files
export { default as promptsService } from './prompts';
export { default as inferenceService } from './inference';
export { supabase } from './supabase';

// ====== Environments ======

export const environmentsService = {
    async list(): Promise<Environment[]> {
        const response = await api.get<Environment[]>('/environments');
        return response.data;
    },

    async create(data: Partial<Environment>): Promise<Environment> {
        const response = await api.post<Environment>('/environments', data);
        return response.data;
    },

    async delete(envId: number): Promise<void> {
        await api.delete(`/environments/${envId}`);
    },
};

// ====== Experiments ======

export const experimentsService = {
    async list(promptId?: number): Promise<Experiment[]> {
        const params = promptId ? { prompt_id: promptId } : {};
        const response = await api.get<Experiment[]>('/experiments', { params });
        return response.data;
    },

    async get(experimentId: number): Promise<Experiment> {
        const response = await api.get<Experiment>(`/experiments/${experimentId}`);
        return response.data;
    },

    async create(data: {
        prompt_id: number;
        name: string;
        description?: string;
        variants: Array<{
            name: string;
            system_prompt: string;
            user_prompt: string;
            model: string;
            temperature: number;
            traffic_weight: number;
        }>;
    }): Promise<Experiment> {
        const response = await api.post<Experiment>('/experiments', data);
        return response.data;
    },

    async update(experimentId: number, data: { name?: string; description?: string; status?: string }): Promise<Experiment> {
        const response = await api.put<Experiment>(`/experiments/${experimentId}`, data);
        return response.data;
    },

    async delete(experimentId: number): Promise<void> {
        await api.delete(`/experiments/${experimentId}`);
    },

    async start(experimentId: number): Promise<Experiment> {
        const response = await api.post<Experiment>(`/experiments/${experimentId}/start`);
        return response.data;
    },

    async stop(experimentId: number): Promise<Experiment> {
        const response = await api.post<Experiment>(`/experiments/${experimentId}/stop`);
        return response.data;
    },
};

// ====== Deployments ======

export const deploymentsService = {
    async list(environmentId?: number, promptId?: number): Promise<Deployment[]> {
        const params: Record<string, number> = {};
        if (environmentId) params.environment_id = environmentId;
        if (promptId) params.prompt_id = promptId;
        const response = await api.get<Deployment[]>('/deployments', { params });
        return response.data;
    },

    async get(deploymentId: number): Promise<Deployment> {
        const response = await api.get<Deployment>(`/deployments/${deploymentId}`);
        return response.data;
    },

    async create(data: { version_id: number; environment_id: number; notes?: string }): Promise<Deployment> {
        const response = await api.post<Deployment>('/deployments', data);
        return response.data;
    },

    async rollback(deploymentId: number, reason?: string): Promise<Deployment> {
        const response = await api.post<Deployment>(`/deployments/${deploymentId}/rollback`, { reason });
        return response.data;
    },

    async getActive(environmentId: number, promptId: number): Promise<Deployment | null> {
        try {
            const response = await api.get<Deployment>(`/deployments/active/${environmentId}/${promptId}`);
            return response.data;
        } catch {
            return null;
        }
    },
};

// ====== Metrics ======

export const metricsService = {
    async getOverview(days: number = 7): Promise<MetricsOverview> {
        const response = await api.get<MetricsOverview>('/metrics/overview', { params: { days } });
        return response.data;
    },

    async getLatency(days: number = 7): Promise<LatencyData[]> {
        const response = await api.get<LatencyData[]>('/metrics/latency', { params: { days } });
        return response.data;
    },

    async getCosts(days: number = 30): Promise<CostData[]> {
        const response = await api.get<CostData[]>('/metrics/costs', { params: { days } });
        return response.data;
    },

    async getByModel(days: number = 30): Promise<Array<{
        model: string;
        request_count: number;
        success_rate: number;
        avg_latency_ms: number;
        total_tokens: number;
        total_cost_cents: number;
    }>> {
        const response = await api.get('/metrics/by-model', { params: { days } });
        return response.data;
    },
};

// ====== Activity ======

export const activityService = {
    async list(params?: {
        limit?: number;
        offset?: number;
        level?: string;
        action?: string;
        search?: string;
    }): Promise<ActivityLog[]> {
        const response = await api.get<ActivityLog[]>('/activity', { params });
        return response.data;
    },

    async getRecent(limit: number = 10): Promise<ActivityLog[]> {
        const response = await api.get<ActivityLog[]>('/activity/recent', { params: { limit } });
        return response.data;
    },

    async getActionTypes(): Promise<string[]> {
        const response = await api.get<{ actions: string[] }>('/activity/actions');
        return response.data.actions;
    },
};
