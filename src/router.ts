import { getProviderAdapter } from './adapters';
import { DEFAULT_PRICING } from './pricing';
import type { ProviderName, RoutingDecision, TokenPilotConfig } from './types';

export class ModelRouter {
  constructor(private readonly config: TokenPilotConfig = {}) {}

  chooseBestModel(prompt: string, preferredProvider?: ProviderName): RoutingDecision {
    const pricing = this.config.pricing ?? DEFAULT_PRICING;
    const providers: ProviderName[] = preferredProvider ? [preferredProvider] : ['openai', 'anthropic', 'gemini'];

    let choice: RoutingDecision | undefined;

    for (const provider of providers) {
      const adapter = getProviderAdapter(provider);
      const model = adapter.getDefaultModel();
      const estimatedCost = adapter.calculateCost(prompt, '', model);

      if (!choice || estimatedCost < choice.estimatedCostUsd) {
        choice = {
          provider,
          model,
          reason: 'Lowest-cost compatible default model selected for the current prompt size.',
          estimatedCostUsd: Number(estimatedCost.toFixed(6))
        };
      }
    }

    if (!choice) {
      throw new Error('No providers available for routing.');
    }

    return choice;
  }
}
