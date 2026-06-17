/**
 * Maziwa Bot - Risk Monitoring Example
 * Demonstrates real-time risk tracking and adjustment
 */

import MaziwaBot from '../maziwaBot';

async function riskMonitoringExample() {
  console.log('\n╔═════════════════════════════════════════════════╗');
  console.log('║  Maziwa Bot - Real-Time Risk Monitoring Example  ║');
  console.log('╚═════════════════════════════════════════════════╝\n');

  const bot = new MaziwaBot({
    initialBalance: 5000,
    maxRiskPerTrade: 0.03, // 3%
    maxRiskPerDay: 0.15, // 15%
    riskRewardRatio: 1.5,
    maxConsecutiveLosses: 4,
  });

  bot.start();
  console.log('👀 Starting continuous risk monitoring...\n');

  let totalTrades = 0;
  let shouldContinue = true;

  while (shouldContinue && totalTrades < 100) {
    const type = totalTrades % 2 === 0 ? 'MATCH' : 'DIFFER';
    const result = await bot.executeTrade(type);
    totalTrades++;

    // Real-time monitoring every trade
    const stats = bot.getStats();
    const risk = bot.getRiskMetrics();
    const health = bot.getHealthReport();

    console.log(`\n[Trade #${totalTrades}] ${type} - ${result ? '✓ WIN' : '✗ LOSS'}`);
    console.log(`├─ Balance: ${health.balance}`);
    console.log(`├─ P&L: ${health.profitLoss}`);
    console.log(`├─ Win Rate: ${health.winRate}`);
    console.log(`├─ Daily Risk: $${risk.totalRisk.toFixed(2)}/${(
      5000 * 0.15
    ).toFixed(2)}`);
    console.log(`├─ Drawdown: ${risk.currentDrawdown}`);
    console.log(`└─ Status: ${health.status}`);

    // Risk management decisions
    const remainingRisk = parseFloat(risk.remainingDailyRisk);
    if (remainingRisk < 50) {
      console.log('\n⚠️  WARNING: Daily risk limit nearly reached!');
      console.log('   Consider stopping or reducing position size.');
    }

    const drawdown = parseFloat(risk.currentDrawdown.replace('%', ''));
    if (drawdown > 15) {
      console.log('\n⚠️  WARNING: High drawdown detected!');
      console.log('   Consider reducing risk per trade.');
    }

    if (stats.losses >= 4) {
      console.log('\n🛑 STOPPING: Max consecutive losses reached!');
      shouldContinue = false;
    }
  }

  console.log('\n' + '═'.repeat(50));
  console.log('FINAL RISK MONITORING REPORT');
  console.log('═'.repeat(50));

  const finalHealth = bot.getHealthReport();
  console.log(JSON.stringify(finalHealth, null, 2));

  bot.stop();
  console.log('\n✅ Risk monitoring session completed\n');
}

// Run example
riskMonitoringExample().catch(console.error);
