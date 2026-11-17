import test from 'node:test';
import assert from 'node:assert/strict';

import { TokenPilot } from '../src/tokenpilot';
import { getProviderAdapter, getProviderList } from '../src/adapters';
import { ModelRouter } from '../src/router';

const prompt = 'Write a concise explanation of a secure API key rotation process for a SaaS application.';

test('provider adapters estimate tokens and cost', () => {
  const adapter = getProviderAdapter('openai');
  const estimate = adapter.estimateTokens(prompt, 'This is a short response.', 128);

  assert.ok(estimate.inputTokens > 0);
  assert.ok(estimate.outputTokens > 0);
  assert.ok(estimate.estimatedCostUsd >= 0);
});

test('router chooses a provider model and estimates cost', () => {
  const router = new ModelRouter();
  const decision = router.chooseBestModel(prompt, 'gemini');

  assert.equal(decision.provider, 'gemini');
  assert.ok(decision.estimatedCostUsd >= 0);
  assert.ok(typeof decision.reason === 'string');
});

test('TokenPilot caches and tracks usage', async () => {
  const manager = new TokenPilot({ provider: 'openai', budgetUsd: 50 });
  const result1 = await manager.execute(prompt, async () => ({ ok: true, prompt }));
  const result2 = await manager.execute(prompt, async () => ({ ok: false, prompt }));

  assert.deepEqual(result1, { ok: true, prompt });
  assert.deepEqual(result2, { ok: true, prompt });
  assert.ok(manager.getUsageSummary().requests >= 1);
  assert.ok(manager.getBudgetStatus().remainingUsd >= 0);
});

test('providers list returns supported vendors', () => {
  assert.deepEqual(getProviderList().sort(), ['anthropic', 'gemini', 'openai']);
});
