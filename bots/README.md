# Free Bot - Trading Bot Module

A high-performance, lightweight trading bot optimized for fast execution and efficient resource usage.

## Overview

The Free Bot is designed to execute trades quickly with minimal computational overhead. It features intelligent caching, risk management, and real-time performance metrics.

## Features

- ⚡ **Fast Execution**: Minimal overhead with performance tracking
- 💾 **Smart Caching**: Reuses prediction analysis for repeated scenarios
- 🛡️ **Risk Management**: 
  - Max consecutive losses limit
  - Position size management
  - Configurable stakes
- 📊 **Real-time Stats**: 
  - Win rate tracking
  - Profit/loss monitoring
  - Trade efficiency metrics
- 🎯 **Multiple Contract Types**: 
  - UP/DOWN (MULT)
  - ODD/EVEN
  - OVER/UNDER

## Installation

```bash
npm install
```

## Quick Start

```typescript
import FreeBot from './bots/freeBot';

// Initialize bot with config
const bot = new FreeBot({
  initialStake: 1,
  maxConsecutiveLosses: 5,
  contractType: 'DIFF',
  riskPerTrade: 0.02,
  maxTradesPerSession: 100,
  minTickFrequency: 1000,
});

// Start trading
bot.start();

// Execute a trade
const result = await bot.executeTrade('UP', 1.5, 1);

// Get stats
const stats = bot.getStats();
console.log(`Win Rate: ${(stats.winRate * 100).toFixed(2)}%`);
console.log(`Total Profit: ${stats.totalProfit}`);

// Get performance metrics
const metrics = bot.getMetrics();
console.log('Metrics:', metrics);

// Stop trading
bot.stop();

// Reset for new session
bot.reset();
```

## Configuration

### TradeConfig Interface

```typescript
interface TradeConfig {
  initialStake: number;           // Base stake amount (default: 1)
  maxConsecutiveLosses: number;   // Max losing trades before stop (default: 5)
  contractType: string;           // MULT | DIFF | ODD | EVEN | OVER | UNDER
  riskPerTrade: number;           // Risk percentage per trade (default: 0.02)
  maxTradesPerSession: number;    // Max trades before auto-stop (default: 100)
  minTickFrequency: number;       // Min milliseconds between trades (default: 1000)
}
```

## API Reference

### Methods

#### `executeTrade(prediction, stake, duration)`
Executes a single trade with the given parameters.

**Parameters:**
- `prediction`: 'UP' | 'DOWN' | 'ODD' | 'EVEN' - Trade direction/type
- `stake`: number - Amount to trade
- `duration`: number - Contract duration in ticks (default: 1)

**Returns:** Promise<boolean> - true if trade wins, false otherwise

#### `start()`
Start a new trading session and initialize caching.

#### `stop()`
Stop the current trading session.

#### `getStats()`
Get current trading statistics.

**Returns:** 
```typescript
interface BotStats {
  totalTrades: number;       // Total trades executed
  wins: number;              // Winning trades
  losses: number;            // Losing trades
  totalProfit: number;       // Net profit/loss
  winRate: number;           // Win rate (0-1)
  consecutiveLosses: number; // Current losing streak
  executionTime: number;     // Last trade execution time (ms)
}
```

#### `getMetrics()`
Get performance metrics for the session.

**Returns:**
```typescript
interface Metrics {
  efficiency: number;  // Avg execution time per trade (lower is better)
  profitability: number; // Avg profit per trade
  riskReward: number;  // Risk/reward ratio
}
```

#### `reset()`
Clear all stats and cache for a new session.

## Usage Examples

### Example 1: Simple Trading Loop

```typescript
const bot = new FreeBot();
bot.start();

const predictions = ['UP', 'DOWN', 'UP', 'DOWN'];
for (const prediction of predictions) {
  const win = await bot.executeTrade(prediction, 1);
  console.log(`Trade: ${prediction} - ${win ? 'WIN' : 'LOSS'}`);
}

const stats = bot.getStats();
bot.stop();
```

### Example 2: Custom Configuration

```typescript
const aggressiveBot = new FreeBot({
  initialStake: 2,
  maxConsecutiveLosses: 3,
  maxTradesPerSession: 50,
  riskPerTrade: 0.05,
});

aggressiveBot.start();
// Trade execution...
aggressiveBot.stop();
```

### Example 3: Performance Monitoring

```typescript
const bot = new FreeBot();
bot.start();

// Execute some trades...
for (let i = 0; i < 20; i++) {
  const prediction = Math.random() > 0.5 ? 'UP' : 'DOWN';
  await bot.executeTrade(prediction, 1);
}

const stats = bot.getStats();
const metrics = bot.getMetrics();

console.log(`Win Rate: ${(stats.winRate * 100).toFixed(2)}%`);
console.log(`Profit: $${stats.totalProfit.toFixed(2)}`);
console.log(`Avg Execution: ${metrics.efficiency.toFixed(2)}ms`);
console.log(`Risk/Reward Ratio: ${metrics.riskReward.toFixed(2)}`);

bot.stop();
```

## Integration with Deriv API

To integrate with the actual Deriv WebSocket API, replace the `simulateTrade` method:

```typescript
private async simulateTrade(prediction: string, stake: number, confidence: number) {
  // Connect to Deriv WebSocket
  // Send buy contract request
  // Wait for contract result
  // Return actual win/loss result
}
```

## Performance Optimization Tips

1. **Cache Reuse**: The bot caches prediction analysis to avoid recomputation
2. **Early Exit**: Validates conditions before executing trades
3. **Batch Updates**: Stats are updated efficiently in one operation
4. **Memory Management**: Cache is cleared on session reset

## Testing

Run the test suite:

```bash
npm test
```

## License

MIT
