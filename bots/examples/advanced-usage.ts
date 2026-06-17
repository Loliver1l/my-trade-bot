/**
 * Advanced Usage Example
 * Performance monitoring and metrics analysis
 */

import FreeBot from '../freeBot';

async function advancedUsageExample() {
  console.log('\n=== Free Bot Advanced Usage Example ===\n');

  // Create a bot with aggressive settings
  const bot = new FreeBot({
    initialStake: 2,
    maxConsecutiveLosses: 3,
    maxTradesPerSession: 50,
    riskPerTrade: 0.05,
  });

  bot.start();
  console.log('✅ Aggressive trading session started\n');

  // Execute multiple trades
  console.log('Executing 30 trades...');
  let tradeCount = 0;

  for (let i = 0; i < 30; i++) {
    // Randomly choose prediction type
    const predictions = ['UP', 'DOWN', 'ODD', 'EVEN'] as const;
    const randomPrediction = predictions[Math.floor(Math.random() * 4)];
    const stake = 1 + Math.random() * 2; // Random stake between 1-3

    const result = await bot.executeTrade(randomPrediction, stake, 1);

    if (result) {
      tradeCount++;
    }

    // Show progress
    if ((i + 1) % 10 === 0) {
      const stats = bot.getStats();
      console.log(
        `Progress: ${i + 1} trades | Win Rate: ${(stats.winRate * 100).toFixed(2)}% | Profit: $${stats.totalProfit.toFixed(2)}`
      );
    }
  }

  console.log('\n=== Detailed Statistics ===');
  const stats = bot.getStats();
  console.log(`Total Trades: ${stats.totalTrades}`);
  console.log(`Wins: ${stats.wins}`);
  console.log(`Losses: ${stats.losses}`);
  console.log(`Win Rate: ${(stats.winRate * 100).toFixed(2)}%`);
  console.log(`Total Profit: $${stats.totalProfit.toFixed(2)}`);
  console.log(`Consecutive Losses: ${stats.consecutiveLosses}`);
  console.log(`Last Trade Execution: ${stats.executionTime.toFixed(2)}ms`);

  console.log('\n=== Performance Metrics ===');
  const metrics = bot.getMetrics();
  console.log(`Avg Execution Time: ${metrics.efficiency.toFixed(3)}ms`);
  console.log(`Avg Profit per Trade: $${metrics.profitability.toFixed(2)}`);
  console.log(`Risk/Reward Ratio: ${metrics.riskReward.toFixed(2)}`);

  // Determine performance level
  let performanceLevel = 'AVERAGE';
  if (stats.winRate > 0.55) performanceLevel = 'EXCELLENT';
  else if (stats.winRate > 0.52) performanceLevel = 'GOOD';
  else if (stats.winRate < 0.48) performanceLevel = 'POOR';

  console.log(`\nPerformance Level: ${performanceLevel}`);

  bot.stop();
  console.log('\n✅ Trading session stopped\n');
}

// Run example
advancedUsageExample().catch(console.error);
