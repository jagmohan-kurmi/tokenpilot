import { getProviderAdapter } from './adapters';
import type { UsageRecord } from './types';

export class UsageAnalytics {
  private records: UsageRecord[] = [];

  record(entry: UsageRecord): void {
    this.records.push(entry);
  }

  getSummary() {
    const totalCost = this.records.reduce((total, record) => total + record.costUsd, 0);
    const totalTokens = this.records.reduce((total, record) => total + record.inputTokens + record.outputTokens, 0);
    return {
      requests: this.records.length,
      totalCostUsd: Number(totalCost.toFixed(6)),
      totalTokens,
      byProvider: this.records.reduce((map, record) => {
        map[record.provider] = (map[record.provider] ?? 0) + record.costUsd;
        return map;
      }, {} as Record<string, number>)
    };
  }

  estimateForPrompt(prompt: string, provider: 'openai' | 'anthropic' | 'gemini' = 'openai') {
    const adapter = getProviderAdapter(provider);
    return adapter.estimateTokens(prompt);
  }
}
