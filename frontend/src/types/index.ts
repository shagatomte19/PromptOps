/**
 * Shared TypeScript types for PromptOps Cloud.
 */

// ====== User & Auth ======

export interface User {
    id: string;
    email: string | null;
    role: string;
    app_metadata: Record<string, unknown>;
    user_metadata: Record<string, unknown>;
}

// ====== Prompts & Versions ======

export interface PromptVersion {
    id: number;
    prompt_id: number;
    version_tag: string;
    system_prompt: string;
    user_prompt: string;
    model: string;
    temperature: number;
    max_tokens: number;
    commit_message: string | null;
    variables: Record<string, unknown> | null;
    created_at: string;
}

export interface Prompt {
    id: number;
    user_id: string;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
    versions: PromptVersion[];
}

export interface PromptListItem {
    id: number;
    user_id: string;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
    latest_version: string | null;
    version_count: number;
}

export interface PromptCreateData {
    name: string;
    description?: string;
    initial_version?: {
        version_tag: string;
        system_prompt: string;
        user_prompt: string;
        model: string;
        temperature: number;
        max_tokens: number;
        commit_message?: string;
        variables?: Record<string, unknown>;
    };
}

export interface VersionCreateData {
    version_tag: string;
    system_prompt: string;
    user_prompt: string;
    model: string;
    temperature: number;
    max_tokens: number;
    commit_message?: string;
    variables?: Record<string, unknown>;
}

// ====== Environments ======

export interface Environment {
    id: number;
    user_id: string;
    name: string;
    display_name: string;
    description: string | null;
    is_protected: boolean;
    color: string;
    created_at: string;
}

// ====== Experiments ======

export type ExperimentStatus = 'draft' | 'running' | 'paused' | 'completed';

export interface ExperimentVariant {
    id: number;
    experiment_id: number;
    name: string;
    system_prompt: string;
    user_prompt: string;
    model: string;
    temperature: number;
    traffic_weight: number;
    request_count: number;
    success_count: number;
    avg_latency_ms: number;
    avg_tokens: number;
    created_at: string;
}

export interface Experiment {
    id: number;
    prompt_id: number;
    name: string;
    description: string | null;
    status: ExperimentStatus;
    traffic_allocation: Record<string, number>;
    results: Record<string, unknown> | null;
    winner_variant_id: number | null;
    created_at: string;
    started_at: string | null;
    ended_at: string | null;
    variants: ExperimentVariant[];
}

// ====== Deployments ======

export type DeploymentStatus = 'pending' | 'deploying' | 'active' | 'rolled_back' | 'failed';

export interface Deployment {
    id: number;
    version_id: number;
    environment_id: number;
    user_id: string;
    status: DeploymentStatus;
    notes: string | null;
    rolled_back_from_id: number | null;
    created_at: string;
    deployed_at: string | null;
    version_tag: string | null;
    prompt_name: string | null;
    environment_name: string | null;
}

// ====== Metrics ======

export interface MetricsOverview {
    total_requests: number;
    success_rate: number;
    avg_latency_ms: number;
    p95_latency_ms: number;
    p99_latency_ms: number;
    total_tokens: number;
    total_cost_cents: number;
}

export interface LatencyData {
    timestamp: string;
    avg_latency_ms: number;
    p95_latency_ms: number;
    request_count: number;
}

export interface CostData {
    date: string;
    cost_cents: number;
    token_count: number;
}

// ====== Activity Logs ======

export type ActivityLevel = 'info' | 'success' | 'warning' | 'error';

export interface ActivityLog {
    id: number;
    user_id: string;
    level: ActivityLevel;
    action: string;
    message: string;
    source: string;
    metadata: Record<string, unknown> | null;
    timestamp: string;
}

// ====== Inference ======

export interface InferenceRequest {
    system_prompt: string;
    user_prompt: string;
    variables?: Record<string, string>;
    model: string;
    temperature: number;
    max_tokens: number;
    prompt_id?: number;
    version_id?: number;
    deployment_id?: number;
    experiment_variant_id?: number;
}

export interface InferenceResponse {
    text: string;
    model: string;
    latency_ms: number;
    input_tokens: number;
    output_tokens: number;
    total_tokens: number;
    estimated_cost_cents: number;
    success: boolean;
    error: string | null;
}
