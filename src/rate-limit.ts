export class RateLimiter {
  private readonly windowMs: number;
  private readonly maxRequests: number;
  private queue: number[] = [];

  constructor(maxRequestsPerWindow: number, windowMs: number) {
    this.maxRequests = maxRequestsPerWindow;
    this.windowMs = windowMs;
  }

  async waitForSlot(): Promise<void> {
    const now = Date.now();
    this.queue = this.queue.filter((time) => time > now - this.windowMs);

    if (this.queue.length >= this.maxRequests) {
      const waitMs = this.windowMs - (now - this.queue[0]) + 1;
      await new Promise((resolve) => setTimeout(resolve, waitMs));
      return this.waitForSlot();
    }

    this.queue.push(now);
  }
}
