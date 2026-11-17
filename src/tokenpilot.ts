import { createHash } from 'node:crypto';

import { getProviderAdapter } from './adapters';
import { BudgetTracker } from './budget';
import { SimpleCache } from './cache';
import { RateLimiter } from './rate-limit';
import { ModelRouter } from './router';
import { RetryController } from './retry';
import { UsageAnalytics } from './analytics';
import type { ProviderName, RequestOptions, TokenEstimate, UsageRecord } from './types';

export class TokenPilot {
  private readonly cache: SimpleCache<string>;
  private readonly budgetTracker: BudgetTracker;
  private readonly router: ModelRouter;
  private readonly retryController: RetryController;
  private readonly analytics: UsageAnalytics;
  private readonly rateLimiter: RateLimiter;

  constructor(options: RequestOptions = {}) {
    const defaultProvider = options.provider ?? 'openai';
    const cacheTtlSeconds = options.cacheTtlSeconds ?? 300;
    const budgetUsd = options.budgetUsd ?? 25;

    this.cache = new SimpleCache<string>(cacheTtlSeconds * 1000);
    this.budgetTracker = new BudgetTracker(budgetUsd);
    this.router = new ModelRouter({ defaultProvider, budgetUsd, cacheTtlSeconds });
    this.retryController = new RetryController();
    this.analytics = new UsageAnalytics();
    this.rateLimiter = new RateLimiter(10, 60_000);
  }

  async execute<T>(prompt: string, fn: () => Promise<T>, options: RequestOptions = {}): Promise<T> {
    const promptHash = createHash('sha256').update(prompt).digest('hex');
    const cached = this.cache.get(promptHash);
    if (cached) {
      return JSON.parse(cached) as T;
    }

    await this.rateLimiter.waitForSlot();
    const provider = (options.provider ?? this.router.chooseBestModel(prompt).provider) as ProviderName;
    const adapter = getProviderAdapter(provider);
    const estimate = adapter.estimateTokens(prompt);
    const retryDecision = await this.retryController.nextDelay(1);

    if (this.budgetTracker.getStatus().exceeded) {
      throw new Error('Budget limit exceeded for TokenPilot.');
    }

    const result = await fn();
    const record: UsageRecord = {
      provider,
      model: adapter.getDefaultModel(),
      inputTokens: estimate.inputTokens,
      outputTokens: estimate.outputTokens,
      costUsd: estimate.estimatedCostUsd,
      timestamp: new Date().toISOString(),
      promptHash
    };

    this.budgetTracker.register(record);
    this.analytics.record(record);
    this.cache.set(promptHash, JSON.stringify(result));

    return result;
  }

  estimate(prompt: string, provider: ProviderName = 'openai', responseText?: string): TokenEstimate {
    const adapter = getProviderAdapter(provider);
    return adapter.estimateTokens(prompt, responseText);
  }

  getBudgetStatus() {
    return this.budgetTracker.getStatus();
  }

  getUsageSummary() {
    return this.analytics.getSummary();
  }

  getRetryPlan(attempts: number) {
    return this.retryController.nextDelay(attempts);
  }
}
