/**
 * Maziwa Bot - Advanced Risk Management Example
 * Aggressive trading with strict risk controls
 */

import MaziwaBot from '../maziwaBot';

async function advancedMaziwaExample() {
  console.log('\n╔═══════════════════════════════════════════════╗');
  console.log('║  Maziwa Bot - Advanced Risk Management Example ║');
  console.log('╚═══════════════════════════════════════════════╝\n');

  // Aggressive configuration
  const bot = new MaziwaBot({
    initialBalance: 2000,
    maxRiskPerTrade: 0.05, // 5% per trade
    maxRiskPerDay: 0.2, // 20% per day
    riskRewardRatio: 1.2, // Lower requirement
    maxOpenPositions: 5,
    maxConsecutiveLosses: 5,
    enableHedging: true,
    speedOptimization: true,
  });

  console.log('⚙️  Aggressive Configuration:');
  console.log('   • Initial Balance: $2,000');
  console.log('   • Risk per Trade: 5%');
  console.log('   • Daily Risk Cap: 20%');
  console.log('   • Min R:R Ratio: 1.2');
  console.log('   • Max Open Positions: 5');
  console.log('   • Hedging: Enabled\n');

  bot.start();
  console.log('🚀 Aggressive trading session started\n');

  // Monitor performance throughout session
  console.log('Trade Execution Progress:');
  console.log('━'.repeat(60));

  for (let i = 0; i < 50; i++) {
    // Alternate contract types
    const type = i % 2 === 0 ? 'MATCH' : 'DIFFER';
    const result = await bot.executeTrade(type);

    // Print status every 10 trades
    if ((i + 1) % 10 === 0) {
      const stats = bot.getStats();
      const risk = bot.getRiskMetrics();
      const balance = bot.getBalance();

      console.log(`\n📊 Progress after ${i + 1} trades:`);
      console.log(`   Balance: $${balance.toFixed(2)}`);
      console.log(`   Win Rate: ${(stats.winRate * 100).toFixed(2)}%`);
      console.log(`   Profit: $${stats.totalProfit.toFixed(2)}`);
      console.log(
        `   Risk Used: $${risk.totalRisk.toFixed(2)} / $${(2000 * 0.2).toFixed(2)}`
      );
      console.log(`   Drawdown: ${risk.currentDrawdown}`);
    }
  }

  console.log('\n' + '━'.repeat(60));
  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║         FINAL PERFORMANCE REPORT          ║');
  console.log('╚════════════════════════════════════════════╝\n');

  const finalStats = bot.getStats();
  const finalRisk = bot.getRiskMetrics();
  const finalHealth = bot.getHealthReport();

  console.log('💰 Account Status:');
  console.log(`   Status: ${finalHealth.status}`);
  console.log(`   Balance: ${finalHealth.balance}`);
  console.log(`   Profit/Loss: ${finalHealth.profitLoss}`);

  console.log('\n📊 Trading Performance:');
  console.log(`   Total Trades: ${finalStats.totalTrades}`);
  console.log(`   Wins: ${finalStats.wins}`);
  console.log(`   Losses: ${finalStats.losses}`);
  console.log(`   Win Rate: ${finalHealth.winRate}`);
  console.log(`   Avg Win: $${finalStats.averageWinSize.toFixed(2)}`);
  console.log(`   Avg Loss: $${finalStats.averageLossSize.toFixed(2)}`);
  console.log(`   Profit Factor: ${finalRisk.profitFactor}`);

  console.log('\n🛡️  Risk Metrics:');
  console.log(`   Total Risk Taken: $${finalRisk.totalRisk.toFixed(2)}`);
  console.log(`   Daily Risk Cap: $${(2000 * 0.2).toFixed(2)}`);
  console.log(`   Current Drawdown: ${finalRisk.currentDrawdown}`);
  console.log(`   Max Drawdown: ${finalRisk.maxDrawdown}`);

  // Performance rating
  const winRate = finalStats.winRate;
  let rating = '⭐⭐ AVERAGE';
  if (winRate > 0.55) rating = '⭐⭐⭐⭐⭐ EXCELLENT';
  else if (winRate > 0.53) rating = '⭐⭐⭐⭐ VERY GOOD';
  else if (winRate > 0.51) rating = '⭐⭐⭐ GOOD';
  else if (winRate < 0.48) rating = '⭐ POOR';

  console.log(`\n🏆 Overall Rating: ${rating}`);
  console.log(`   (Win Rate: ${(winRate * 100).toFixed(2)}%)\n`);

  bot.stop();
}

// Run example
advancedMaziwaExample().catch(console.error);
