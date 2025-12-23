/**
 * Prompts API service.
 */

import api from './api';
import type { Prompt, PromptListItem, PromptVersion, PromptCreateData, VersionCreateData } from '@/types';

export const promptsService = {
    /**
     * List all prompts for the current user.
     */
    async list(): Promise<PromptListItem[]> {
        const response = await api.get<PromptListItem[]>('/prompts');
        return response.data;
    },

    /**
     * Get a prompt with all its versions.
     */
    async get(promptId: number): Promise<Prompt> {
        const response = await api.get<Prompt>(`/prompts/${promptId}`);
        return response.data;
    },

    /**
     * Create a new prompt.
     */
    async create(data: PromptCreateData): Promise<Prompt> {
        const response = await api.post<Prompt>('/prompts', data);
        return response.data;
    },

    /**
     * Update a prompt's metadata.
     */
    async update(promptId: number, data: { name?: string; description?: string }): Promise<Prompt> {
        const response = await api.put<Prompt>(`/prompts/${promptId}`, data);
        return response.data;
    },

    /**
     * Delete a prompt.
     */
    async delete(promptId: number): Promise<void> {
        await api.delete(`/prompts/${promptId}`);
    },

    /**
     * List all versions for a prompt.
     */
    async listVersions(promptId: number): Promise<PromptVersion[]> {
        const response = await api.get<PromptVersion[]>(`/prompts/${promptId}/versions`);
        return response.data;
    },

    /**
     * Create a new version for a prompt.
     */
    async createVersion(promptId: number, data: VersionCreateData): Promise<PromptVersion> {
        const response = await api.post<PromptVersion>(`/prompts/${promptId}/versions`, data);
        return response.data;
    },

    /**
     * Get a specific version.
     */
    async getVersion(promptId: number, versionId: number): Promise<PromptVersion> {
        const response = await api.get<PromptVersion>(`/prompts/${promptId}/versions/${versionId}`);
        return response.data;
    },
};

export default promptsService;
