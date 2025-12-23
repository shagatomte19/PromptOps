/**
 * Inference API service for AI execution.
 */

import api from './api';
import type { InferenceRequest, InferenceResponse } from '@/types';

export const inferenceService = {
    /**
     * Run inference (non-streaming).
     */
    async run(request: InferenceRequest): Promise<InferenceResponse> {
        const response = await api.post<InferenceResponse>('/inference/run', request);
        return response.data;
    },

    /**
     * Run inference with streaming (Server-Sent Events).
     * Returns an EventSource that emits chunks.
     */
    runStream(
        request: InferenceRequest,
        onChunk: (text: string) => void,
        onDone: (stats: { latency_ms: number; total_chars: number }) => void,
        onError: (error: string) => void
    ): () => void {
        // We need to use fetch with SSE for streaming
        const controller = new AbortController();

        const runStream = async () => {
            try {
                // Get current session token
                const { supabase } = await import('./supabase');
                const { data: { session } } = await supabase.auth.getSession();

                const response = await fetch('/api/v1/inference/run/stream', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': session?.access_token ? `Bearer ${session.access_token}` : '',
                    },
                    body: JSON.stringify(request),
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const reader = response.body?.getReader();
                const decoder = new TextDecoder();

                if (!reader) {
                    throw new Error('No response body');
                }

                while (true) {
                    const { done, value } = await reader.read();

                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split('\n');

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            try {
                                const data = JSON.parse(line.slice(6));

                                if (data.type === 'chunk') {
                                    onChunk(data.text);
                                } else if (data.type === 'done') {
                                    onDone({ latency_ms: data.latency_ms, total_chars: data.total_chars });
                                } else if (data.type === 'error') {
                                    onError(data.error);
                                }
                            } catch {
                                // Ignore parsing errors for incomplete chunks
                            }
                        }
                    }
                }
            } catch (error) {
                if (error instanceof Error && error.name !== 'AbortError') {
                    onError(error.message);
                }
            }
        };

        runStream();

        // Return abort function
        return () => controller.abort();
    },

    /**
     * Test a specific prompt version.
     */
    async test(promptId: number, versionId: number, variables: Record<string, string>): Promise<InferenceResponse> {
        const response = await api.post<InferenceResponse>('/inference/test', {
            prompt_id: promptId,
            version_id: versionId,
            variables,
        });
        return response.data;
    },
};

export default inferenceService;
