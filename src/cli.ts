#!/usr/bin/env node

import { TokenPilot } from './tokenpilot';

function printUsage(): void {
  console.log(`TokenPilot CLI

Usage: tokenpilot --prompt "hello" [--provider openai|anthropic|gemini] [--budget 25]`);
}

function readOption(args: string[], name: string): string | undefined {
  const exact = args.find((arg) => arg === name);
  if (exact) {
    return args[args.indexOf(exact) + 1];
  }

  const equals = args.find((arg) => arg.startsWith(`${name}=`));
  if (equals) {
    return equals.split('=').slice(1).join('=');
  }

  return undefined;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    printUsage();
    return;
  }

  const prompt = readOption(args, '--prompt') ?? '';
  const providerArg = readOption(args, '--provider') ?? 'openai';
  const budgetArg = readOption(args, '--budget');

  if (!prompt) {
    throw new Error('A prompt value is required.');
  }

  const budgetUsd = budgetArg ? Number(budgetArg) : undefined;
  const manager = new TokenPilot({ provider: providerArg as any, budgetUsd });
  const estimate = manager.estimate(prompt, providerArg as any);
  const result = await manager.execute(prompt, async () => ({
    prompt,
    provider: providerArg,
    estimate,
    budgetStatus: manager.getBudgetStatus()
  }));

  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : 'Unknown error';
  console.error(`TokenPilot error: ${message}`);
  process.exit(1);
});
