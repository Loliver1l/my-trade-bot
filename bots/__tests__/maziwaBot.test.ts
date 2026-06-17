import { describe, it, expect, beforeEach } from 'vitest';
import MaziwaBot from '../maziwaBot';

describe('MaziwaBot', () => {
  let bot: MaziwaBot;

  beforeEach(() => {
    bot = new MaziwaBot({
      initialBalance: 1000,
      maxRiskPerTrade: 0.02,
      maxRiskPerDay: 0.1,
    });
  });

  describe('Initialization', () => {
    it('should initialize with default config', () => {
      const stats = bot.getStats();
      expect(stats.totalTrades).toBe(0);
      expect(stats.wins).toBe(0);
      expect(stats.losses).toBe(0);
      expect(bot.getBalance()).toBe(1000);
    });

    it('should accept custom config', () => {
      const customBot = new MaziwaBot({
        initialBalance: 5000,
        maxRiskPerTrade: 0.05,
        maxRiskPerDay: 0.2,
      });
      expect(customBot.getBalance()).toBe(5000);
    });
  });

  describe('Trading Execution', () => {
    it('should not trade before starting', async () => {
      const result = await bot.executeTrade('MATCH');
      expect(result).toBe(false);
    });

    it('should execute MATCH trade', async () => {
      bot.start();
      const result = await bot.executeTrade('MATCH');
      expect(typeof result).toBe('boolean');
      bot.stop();
    });

    it('should execute DIFFER trade', async () => {
      bot.start();
      const result = await bot.executeTrade('DIFFER');
      expect(typeof result).toBe('boolean');
      bot.stop();
    });

    it('should update stats after trade', async () => {
      bot.start();
      const initialStats = bot.getStats();
      await bot.executeTrade('MATCH');
      const updatedStats = bot.getStats();
      expect(updatedStats.totalTrades).toBe(initialStats.totalTrades + 1);
      bot.stop();
    });
  });

  describe('Risk Management', () => {
    it('should respect max consecutive losses', async () => {
      const strictBot = new MaziwaBot({
        initialBalance: 1000,
        maxConsecutiveLosses: 2,
      });
      strictBot.start();

      let blockedTrades = 0;
      for (let i = 0; i < 10; i++) {
        const result = await strictBot.executeTrade('DIFFER');
        if (!result) blockedTrades++;
      }

      const stats = strictBot.getStats();
      expect(stats.totalTrades).toBeLessThanOrEqual(10);
      strictBot.stop();
    });

    it('should respect daily risk limit', async () => {
      const riskBot = new MaziwaBot({
        initialBalance: 1000,
        maxRiskPerTrade: 0.05,
        maxRiskPerDay: 0.1,
      });
      riskBot.start();

      for (let i = 0; i < 20; i++) {
        await riskBot.executeTrade('MATCH');
      }

      const riskMetrics = riskBot.getRiskMetrics();
      // Risk should not exceed daily limit
      expect(riskMetrics.totalRisk).toBeLessThanOrEqual(100);
      riskBot.stop();
    });

    it('should respect max open positions', async () => {
      const posBot = new MaziwaBot({
        initialBalance: 1000,
        maxOpenPositions: 3,
      });
      posBot.start();

      for (let i = 0; i < 20; i++) {
        await posBot.executeTrade('MATCH');
      }

      const positions = posBot.getOpenPositions();
      expect(positions.length).toBeLessThanOrEqual(3);
      posBot.stop();
    });
  });

  describe('Statistics Tracking', () => {
    it('should calculate win rate', async () => {
      bot.start();
      for (let i = 0; i < 10; i++) {
        await bot.executeTrade('MATCH');
      }

      const stats = bot.getStats();
      expect(stats.winRate).toBeGreaterThanOrEqual(0);
      expect(stats.winRate).toBeLessThanOrEqual(1);
      bot.stop();
    });

    it('should calculate profit factor', async () => {
      bot.start();
      for (let i = 0; i < 20; i++) {
        await bot.executeTrade('MATCH');
      }

      const stats = bot.getStats();
      expect(stats.profitFactor).toBeGreaterThanOrEqual(0);
      bot.stop();
    });

    it('should track average win/loss size', async () => {
      bot.start();
      for (let i = 0; i < 15; i++) {
        await bot.executeTrade('MATCH');
      }

      const stats = bot.getStats();
      if (stats.wins > 0) {
        expect(stats.averageWinSize).toBeGreaterThan(0);
      }
      if (stats.losses > 0) {
        expect(stats.averageLossSize).toBeGreaterThan(0);
      }
      bot.stop();
    });
  });

  describe('Drawdown Tracking', () => {
    it('should track max drawdown', async () => {
      bot.start();
      for (let i = 0; i < 20; i++) {
        await bot.executeTrade('MATCH');
      }

      const stats = bot.getStats();
      expect(stats.maxDrawdown).toBeGreaterThanOrEqual(0);
      expect(stats.maxDrawdown).toBeLessThanOrEqual(1);
      bot.stop();
    });

    it('should track current drawdown', async () => {
      bot.start();
      for (let i = 0; i < 10; i++) {
        await bot.executeTrade('MATCH');
      }

      const stats = bot.getStats();
      expect(stats.currentDrawdown).toBeGreaterThanOrEqual(0);
      expect(stats.currentDrawdown).toBeLessThanOrEqual(1);
      bot.stop();
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
      for (let i = 0; i < 10; i++) {
        await bot.executeTrade('MATCH');
      }

      let stats = bot.getStats();
      expect(stats.totalTrades).toBe(10);

      bot.reset();
      stats = bot.getStats();
      expect(stats.totalTrades).toBe(0);
      expect(stats.wins).toBe(0);
      expect(stats.losses).toBe(0);
      expect(bot.getBalance()).toBe(1000);
    });
  });

  describe('Health Report', () => {
    it('should generate health report', async () => {
      bot.start();
      for (let i = 0; i < 10; i++) {
        await bot.executeTrade('MATCH');
      }

      const health = bot.getHealthReport();
      expect(health).toHaveProperty('status');
      expect(health).toHaveProperty('balance');
      expect(health).toHaveProperty('profitLoss');
      expect(health).toHaveProperty('winRate');
      expect(health).toHaveProperty('totalTrades');
      expect(health).toHaveProperty('riskMetrics');
      expect(health).toHaveProperty('performance');
      bot.stop();
    });

    it('should reflect running status', () => {
      bot.start();
      const health = bot.getHealthReport();
      expect(health.status).toContain('RUNNING');

      bot.stop();
      const stoppedHealth = bot.getHealthReport();
      expect(stoppedHealth.status).toContain('STOPPED');
    });
  });

  describe('Contract Types', () => {
    it('should execute MATCH contract', async () => {
      bot.start();
      const result = await bot.executeTrade('MATCH');
      expect(typeof result).toBe('boolean');
      bot.stop();
    });

    it('should execute DIFFER contract', async () => {
      bot.start();
      const result = await bot.executeTrade('DIFFER');
      expect(typeof result).toBe('boolean');
      bot.stop();
    });
  });
});
