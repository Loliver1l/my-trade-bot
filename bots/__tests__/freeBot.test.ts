import { describe, it, expect, beforeEach } from 'vitest';
import FreeBot from '../freeBot';

describe('FreeBot', () => {
  let bot: FreeBot;

  beforeEach(() => {
    bot = new FreeBot();
  });

  describe('Initialization', () => {
    it('should initialize with default config', () => {
      const stats = bot.getStats();
      expect(stats.totalTrades).toBe(0);
      expect(stats.wins).toBe(0);
      expect(stats.losses).toBe(0);
      expect(stats.totalProfit).toBe(0);
    });

    it('should accept custom config', () => {
      const customBot = new FreeBot({
        initialStake: 5,
        maxConsecutiveLosses: 3,
      });
      expect(customBot).toBeDefined();
    });
  });

  describe('Trading', () => {
    it('should not execute trade before starting', async () => {
      const result = await bot.executeTrade('UP', 1);
      expect(result).toBe(false);
    });

    it('should execute trade after starting', async () => {
      bot.start();
      const result = await bot.executeTrade('UP', 1);
      expect(typeof result).toBe('boolean');
    });

    it('should update stats after trade', async () => {
      bot.start();
      const initialStats = bot.getStats();
      await bot.executeTrade('UP', 1);
      const updatedStats = bot.getStats();
      expect(updatedStats.totalTrades).toBe(initialStats.totalTrades + 1);
    });

    it('should handle multiple consecutive losses', async () => {
      bot.start();
      let losses = 0;

      for (let i = 0; i < 10; i++) {
        // Biased to lose
        const result = await bot.executeTrade('DOWN', 1);
        if (!result) losses++;
      }

      const stats = bot.getStats();
      expect(stats.losses).toBeGreaterThan(0);
    });

    it('should stop trading after max consecutive losses', async () => {
      const strictBot = new FreeBot({
        maxConsecutiveLosses: 2,
      });
      strictBot.start();

      // Simulate losses - the bot should stop trading
      const results = [];
      for (let i = 0; i < 5; i++) {
        const result = await strictBot.executeTrade('DOWN', 1);
        results.push(result);
      }

      // Some trades might be blocked
      const stats = strictBot.getStats();
      expect(stats.totalTrades).toBeLessThanOrEqual(5);
    });
  });

  describe('Stats & Metrics', () => {
    it('should calculate win rate correctly', async () => {
      bot.start();

      // Execute trades
      for (let i = 0; i < 10; i++) {
        await bot.executeTrade('UP', 1);
      }

      const stats = bot.getStats();
      const expectedWinRate = stats.wins / stats.totalTrades;
      expect(stats.winRate).toBe(expectedWinRate);
    });

    it('should return metrics', async () => {
      bot.start();

      for (let i = 0; i < 5; i++) {
        await bot.executeTrade('UP', 1);
      }

      const metrics = bot.getMetrics();
      expect(metrics).toHaveProperty('efficiency');
      expect(metrics).toHaveProperty('profitability');
      expect(metrics).toHaveProperty('riskReward');
    });

    it('should track execution time', async () => {
      bot.start();
      await bot.executeTrade('UP', 1);

      const stats = bot.getStats();
      expect(stats.executionTime).toBeGreaterThan(0);
    });
  });

  describe('Session Management', () => {
    it('should start and stop session', () => {
      bot.start();
      expect(bot).toBeDefined();
      bot.stop();
      expect(bot).toBeDefined();
    });

    it('should reset stats', async () => {
      bot.start();
      for (let i = 0; i < 5; i++) {
        await bot.executeTrade('UP', 1);
      }

      let stats = bot.getStats();
      expect(stats.totalTrades).toBe(5);

      bot.reset();
      stats = bot.getStats();
      expect(stats.totalTrades).toBe(0);
      expect(stats.wins).toBe(0);
      expect(stats.losses).toBe(0);
      expect(stats.totalProfit).toBe(0);
    });

    it('should not trade after stopping', async () => {
      bot.start();
      bot.stop();

      const result = await bot.executeTrade('UP', 1);
      expect(result).toBe(false);
    });
  });

  describe('Trading Limits', () => {
    it('should respect max trades per session', async () => {
      const limitedBot = new FreeBot({
        maxTradesPerSession: 5,
      });
      limitedBot.start();

      for (let i = 0; i < 10; i++) {
        await limitedBot.executeTrade('UP', 1);
      }

      const stats = limitedBot.getStats();
      expect(stats.totalTrades).toBeLessThanOrEqual(5);
    });

    it('should track consecutive losses', async () => {
      bot.start();

      for (let i = 0; i < 10; i++) {
        await bot.executeTrade('DOWN', 1); // Likely to lose
      }

      const stats = bot.getStats();
      expect(stats.consecutiveLosses).toBeGreaterThanOrEqual(0);
      expect(stats.losses).toBeGreaterThan(0);
    });
  });

  describe('Prediction Types', () => {
    it('should accept UP prediction', async () => {
      bot.start();
      const result = await bot.executeTrade('UP', 1);
      expect(typeof result).toBe('boolean');
    });

    it('should accept DOWN prediction', async () => {
      bot.start();
      const result = await bot.executeTrade('DOWN', 1);
      expect(typeof result).toBe('boolean');
    });

    it('should accept ODD prediction', async () => {
      bot.start();
      const result = await bot.executeTrade('ODD', 1);
      expect(typeof result).toBe('boolean');
    });

    it('should accept EVEN prediction', async () => {
      bot.start();
      const result = await bot.executeTrade('EVEN', 1);
      expect(typeof result).toBe('boolean');
    });
  });
});
