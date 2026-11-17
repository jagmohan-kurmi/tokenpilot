import type { BudgetStatus, UsageRecord } from './types';

export class BudgetTracker {
  private usage: UsageRecord[] = [];

  constructor(private readonly limitUsd: number) {}

  register(record: UsageRecord): void {
    this.usage.push(record);
  }

  getStatus(): BudgetStatus {
    const usedUsd = this.usage.reduce((total, record) => total + record.costUsd, 0);
    const remainingUsd = Math.max(0, this.limitUsd - usedUsd);
    return {
      usedUsd: Number(usedUsd.toFixed(6)),
      limitUsd: Number(this.limitUsd.toFixed(6)),
      remainingUsd: Number(remainingUsd.toFixed(6)),
      exceeded: usedUsd > this.limitUsd
    };
  }
}
