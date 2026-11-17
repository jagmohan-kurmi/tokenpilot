import { estimateTokenCount, getModelPricing } from './pricing';
import type { ProviderAdapter, ProviderName, TokenEstimate } from './types';

const ADAPTERS: Record<ProviderName, ProviderAdapter> = {
  openai: {
    provider: 'openai',
    getDefaultModel: () => 'gpt-4o-mini',
    estimateTokens(prompt, responseText = '', maxOutputTokens = 512) {
      const inputTokens = estimateTokenCount(prompt);
      const outputTokens = estimateTokenCount(responseText || ' '.repeat(maxOutputTokens));
      const totalTokens = inputTokens + outputTokens;
      return {
        inputTokens,
        outputTokens,
        totalTokens,
        estimatedCostUsd: this.calculateCost(prompt, responseText, this.getDefaultModel(), maxOutputTokens)
      };
    },
    calculateCost(prompt, responseText = '', model = 'gpt-4o-mini', maxOutputTokens = 512) {
      const pricing = getModelPricing(model, 'openai');
      if (!pricing) return 0;
      const inputTokens = Math.max(1, estimateTokenCount(prompt));
      const outputTokens = Math.max(1, estimateTokenCount(responseText || ' '.repeat(maxOutputTokens)));
      const inputCost = (inputTokens / 1_000_000) * pricing.inputCostPerMillionTokens;
      const outputCost = (outputTokens / 1_000_000) * pricing.outputCostPerMillionTokens;
      return Number((inputCost + outputCost).toFixed(6));
    }
  },
  anthropic: {
    provider: 'anthropic',
    getDefaultModel: () => 'claude-3-5-haiku',
    estimateTokens(prompt, responseText = '', maxOutputTokens = 512) {
      const inputTokens = estimateTokenCount(prompt);
      const outputTokens = estimateTokenCount(responseText || ' '.repeat(maxOutputTokens));
      const totalTokens = inputTokens + outputTokens;
      return {
        inputTokens,
        outputTokens,
        totalTokens,
        estimatedCostUsd: this.calculateCost(prompt, responseText, this.getDefaultModel(), maxOutputTokens)
      };
    },
    calculateCost(prompt, responseText = '', model = 'claude-3-5-haiku', maxOutputTokens = 512) {
      const pricing = getModelPricing(model, 'anthropic');
      if (!pricing) return 0;
      const inputTokens = Math.max(1, estimateTokenCount(prompt));
      const outputTokens = Math.max(1, estimateTokenCount(responseText || ' '.repeat(maxOutputTokens)));
      const inputCost = (inputTokens / 1_000_000) * pricing.inputCostPerMillionTokens;
      const outputCost = (outputTokens / 1_000_000) * pricing.outputCostPerMillionTokens;
      return Number((inputCost + outputCost).toFixed(6));
    }
  },
  gemini: {
    provider: 'gemini',
    getDefaultModel: () => 'gemini-1.5-flash',
    estimateTokens(prompt, responseText = '', maxOutputTokens = 512) {
      const inputTokens = estimateTokenCount(prompt);
      const outputTokens = estimateTokenCount(responseText || ' '.repeat(maxOutputTokens));
      const totalTokens = inputTokens + outputTokens;
      return {
        inputTokens,
        outputTokens,
        totalTokens,
        estimatedCostUsd: this.calculateCost(prompt, responseText, this.getDefaultModel(), maxOutputTokens)
      };
    },
    calculateCost(prompt, responseText = '', model = 'gemini-1.5-flash', maxOutputTokens = 512) {
      const pricing = getModelPricing(model, 'gemini');
      if (!pricing) return 0;
      const inputTokens = Math.max(1, estimateTokenCount(prompt));
      const outputTokens = Math.max(1, estimateTokenCount(responseText || ' '.repeat(maxOutputTokens)));
      const inputCost = (inputTokens / 1_000_000) * pricing.inputCostPerMillionTokens;
      const outputCost = (outputTokens / 1_000_000) * pricing.outputCostPerMillionTokens;
      return Number((inputCost + outputCost).toFixed(6));
    }
  }
};

export function getProviderAdapter(provider: ProviderName): ProviderAdapter {
  return ADAPTERS[provider];
}

export function getProviderList(): ProviderName[] {
  return Object.keys(ADAPTERS) as ProviderName[];
}
