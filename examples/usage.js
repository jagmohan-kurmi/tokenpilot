const { TokenPilot } = require('../dist/src');

async function main() {
  const manager = new TokenPilot({ provider: 'openai', budgetUsd: 10 });
  const result = await manager.execute('Summarize the release plan for a product rollout.', async () => ({
    summary: 'Ship small, measure, and iterate quickly.'
  }));

  console.log(JSON.stringify({ result, budgetStatus: manager.getBudgetStatus() }, null, 2));
}

void main();
