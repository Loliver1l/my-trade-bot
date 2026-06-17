/**
 * Basic Usage Example
 * Simple trading loop with the Free Bot
 */

import FreeBot from '../freeBot';

async function basicUsageExample() {
  console.log('\n=== Free Bot Basic Usage Example ===\n');

  // Initialize the bot
  const bot = new FreeBot({
    initialStake: 1,
    maxConsecutiveLosses: 5,
    maxTradesPerSession: 20,
  });

  // Start trading session
  bot.start();
  console.log('✅ Trading session started\n');

  // Simple trading loop
  const predictions = ['UP', 'DOWN', 'UP', 'DOWN', 'UP'];

  for (const prediction of predictions) {
    const stake = 1;
    console.log(`Executing trade: ${prediction} with stake ${stake}...`);

    const result = await bot.executeTrade(
      prediction as 'UP' | 'DOWN' | 'ODD' | 'EVEN',
      stake,
      1
    );

    console.log(`Result: ${result ? '✅ WIN' : '❌ LOSS'}\n`);
  }

  // Get stats
  const stats = bot.getStats();
  console.log('\n=== Trading Statistics ===');
  console.log(`Total Trades: ${stats.totalTrades}`);
  console.log(`Wins: ${stats.wins}`);
  console.log(`Losses: ${stats.losses}`);
  console.log(`Win Rate: ${(stats.winRate * 100).toFixed(2)}%`);
  console.log(`Total Profit: $${stats.totalProfit.toFixed(2)}\n`);

  // Stop session
  bot.stop();
  console.log('✅ Trading session stopped\n');
}

// Run example
basicUsageExample().catch(console.error);
