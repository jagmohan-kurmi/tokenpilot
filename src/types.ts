export type ProviderName = 'openai' | 'anthropic' | 'gemini';
export type ModelFamily = 'gpt' | 'claude' | 'gemini';
export type CostUnit = 'input' | 'output';

export interface ModelPricing {
  provider: ProviderName;
  model: string;
  inputCostPerMillionTokens: number;
  outputCostPerMillionTokens: number;
  contextWindow: number;
  family: ModelFamily;
  maxOutputTokens?: number;
}

export interface TokenEstimate {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
}

export interface RequestOptions {
  provider?: ProviderName;
  model?: string;
  maxRetries?: number;
  retryDelayMs?: number;
  cacheTtlSeconds?: number;
  budgetUsd?: number;
}

export interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export interface UsageRecord {
  provider: ProviderName;
  model: string;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
  timestamp: string;
  promptHash: string;
}

export interface BudgetStatus {
  usedUsd: number;
  limitUsd: number;
  remainingUsd: number;
  exceeded: boolean;
}

export interface RoutingDecision {
  provider: ProviderName;
  model: string;
  reason: string;
  estimatedCostUsd: number;
}

export interface RetryDecision {
  attempts: number;
  delayMs: number;
  retryable: boolean;
}

export interface ProviderAdapter {
  provider: ProviderName;
  estimateTokens(prompt: string, responseText?: string, maxOutputTokens?: number): TokenEstimate;
  calculateCost(prompt: string, responseText?: string, model?: string, maxOutputTokens?: number): number;
  getDefaultModel(): string;
}

export interface TokenPilotConfig {
  defaultProvider?: ProviderName;
  budgetUsd?: number;
  cacheTtlSeconds?: number;
  pricing?: ModelPricing[];
}
