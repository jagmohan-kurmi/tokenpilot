import type { RetryDecision } from './types';

export class RetryController {
  async nextDelay(attempts: number, baseDelayMs: number = 250): Promise<RetryDecision> {
    const retryable = attempts < 4;
    const delayMs = retryable ? baseDelayMs * 2 ** (attempts - 1) : 0;
    return {
      attempts,
      delayMs,
      retryable
    };
  }
}
