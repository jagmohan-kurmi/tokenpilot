# TokenPilot

TokenPilot is a provider-independent AI API usage optimizer for tracking cost, estimating prompt output size, caching requests, limiting budget usage, and routing traffic across OpenAI, Anthropic and Gemini models.

## Features
- OpenAI, Anthropic and Gemini adapters
- Token usage estimation and tracking
- API cost calculation
- Request caching
- Rate limiting
- Budget limits
- Retry with exponential backoff
- Usage analytics
- Model routing
- Configurable pricing data

## Installation

```bash
npm install @jagmohan-kurmi/tokenpilot
```

## Quick start

```js
const { TokenPilot } = require('@jagmohan-kurmi/tokenpilot');

const manager = new TokenPilot({ provider: 'openai', budgetUsd: 25 });

const result = await manager.execute('Summarize this support ticket in under 50 words.', async () => ({
  summary: 'Customer reported a login issue and needs a reset link.'
}));

console.log(result);
console.log(manager.getBudgetStatus());
```

## CLI

```bash
npx tokenpilot --prompt "Draft a short product update." --provider openai --budget 25
```

## Important note
TokenPilot estimates token usage and cost using configurable pricing values. It does not guarantee actual API savings or model performance across every workload.
