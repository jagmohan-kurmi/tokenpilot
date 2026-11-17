import type { ModelPricing, ProviderName } from './types';

export const DEFAULT_PRICING: ModelPricing[] = [
  {
    provider: 'openai',
    model: 'gpt-4o-mini',
    inputCostPerMillionTokens: 0.15,
    outputCostPerMillionTokens: 0.6,
    contextWindow: 128000,
    family: 'gpt'
  },
  {
    provider: 'openai',
    model: 'gpt-4o',
    inputCostPerMillionTokens: 5.0,
    outputCostPerMillionTokens: 15.0,
    contextWindow: 128000,
    family: 'gpt'
  },
  {
    provider: 'anthropic',
    model: 'claude-3-5-haiku',
    inputCostPerMillionTokens: 0.8,
    outputCostPerMillionTokens: 4.0,
    contextWindow: 200000,
    family: 'claude'
  },
  {
    provider: 'anthropic',
    model: 'claude-3-5-sonnet',
    inputCostPerMillionTokens: 3.0,
    outputCostPerMillionTokens: 15.0,
    contextWindow: 200000,
    family: 'claude'
  },
  {
    provider: 'gemini',
    model: 'gemini-1.5-flash',
    inputCostPerMillionTokens: 0.075,
    outputCostPerMillionTokens: 0.3,
    contextWindow: 1000000,
    family: 'gemini'
  },
  {
    provider: 'gemini',
    model: 'gemini-1.5-pro',
    inputCostPerMillionTokens: 1.25,
    outputCostPerMillionTokens: 5.0,
    contextWindow: 2000000,
    family: 'gemini'
  }
];

export function getModelPricing(model: string, provider: ProviderName, pricing: ModelPricing[] = DEFAULT_PRICING): ModelPricing | undefined {
  return pricing.find((entry) => entry.provider === provider && entry.model === model) ?? pricing.find((entry) => entry.provider === provider);
}

export function estimateTokenCount(text: string): number {
  const tokens = text.trim().split(/\s+|\p{L}+/u).filter(Boolean).length;
  return Math.max(1, tokens);
}
