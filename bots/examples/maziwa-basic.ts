/**
 * Maziwa Bot - Basic Usage Example
 * Conservative risk management approach
 */

import MaziwaBot from '../maziwaBot';

async function basicMaziwaExample() {
  console.log('\n╔══════════════════════════════════════╗');
  console.log('║  Maziwa Bot - Basic Trading Example   ║');
  console.log('╚══════════════════════════════════════╝\n');

  // Initialize with conservative settings
  const bot = new MaziwaBot({
    initialBalance: 1000,
    maxRiskPerTrade: 0.02, // 2% per trade
    maxRiskPerDay: 0.1, // 10% per day
    riskRewardRatio: 1.5,
    maxConsecutiveLosses: 4,
  });

  console.log('📊 Bot Configuration:');
  console.log('   • Initial Balance: $1,000');
  console.log('   • Max Risk per Trade: 2%');
  console.log('   • Max Risk per Day: 10%');
  console.log('   • Min R:R Ratio: 1.5');
  console.log('   • Max Consecutive Losses: 4\n');

  // Start trading session
  bot.start();
  console.log('✅ Trading session started\n');

  // Execute trades
  const trades = [
    'MATCH',
    'DIFFER',
    'MATCH',
    'MATCH',
    'DIFFER',
    'MATCH',
    'DIFFER',
    'DIFFER',
    'MATCH',
    'MATCH',
  ];

  console.log('Executing trades:');
  for (let i = 0; i < trades.length; i++) {
    const type = trades[i] as 'MATCH' | 'DIFFER';
    const result = await bot.executeTrade(type);
    const symbol = result ? '✓ WIN' : '✗ LOSS';
    console.log(`  ${i + 1}. ${type.padEnd(6)} - ${symbol}`);
  }

  console.log('\n════════════════════════════════════════');
  console.log('            TRADING STATISTICS');
  console.log('════════════════════════════════════════\n');

  const stats = bot.getStats();
  console.log(`📈 Win Rate:          ${(stats.winRate * 100).toFixed(2)}%`);
  console.log(`💰 Total Profit:      $${stats.totalProfit.toFixed(2)}`);
  console.log(`🎯 Average Win:       $${stats.averageWinSize.toFixed(2)}`);
  console.log(`📉 Average Loss:      $${stats.averageLossSize.toFixed(2)}`);
  console.log(`📊 Profit Factor:     ${stats.profitFactor.toFixed(2)}`);

  console.log('\n════════════════════════════════════════');
  console.log('           RISK MANAGEMENT');
  console.log('════════════════════════════════════════\n');

  const risk = bot.getRiskMetrics();
  console.log(`💼 Current Balance:   ${risk.currentBalance}`);
  console.log(`⚠️  Daily Risk Used:   $${risk.totalRisk.toFixed(2)}`);
  console.log(`📌 Remaining Risk:    $${risk.remainingDailyRisk.toFixed(2)}`);
  console.log(`📉 Current Drawdown:  ${risk.currentDrawdown}`);
  console.log(`⬇️  Max Drawdown:      ${risk.maxDrawdown}`);

  console.log('\n════════════════════════════════════════');
  console.log('          PERFORMANCE METRICS');
  console.log('════════════════════════════════════════\n');

  const metrics = bot.getMetrics();
  console.log(`⚡ Execution Speed:   ${metrics.execSpeed}`);
  console.log(`📊 Trades per Hour:   ${metrics.tradesPerHour.toFixed(2)}`);

  bot.stop();
  console.log('\n✅ Trading session completed\n');
}

// Run example
basicMaziwaExample().catch(console.error);
