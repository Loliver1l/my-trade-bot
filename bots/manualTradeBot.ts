/**
 * Manual Trade Bot - User-Controlled Trading System
 * Allows manual entry, management, and tracking of trades
 * Full control over trade parameters with real-time P&L
 */

interface TradeOrder {
  id: string;
  type: 'BUY' | 'SELL';
  contractType: 'MATCH' | 'DIFFER' | 'UP' | 'DOWN' | 'ODD' | 'EVEN' | 'OVER' | 'UNDER';
  entryPrice: number;
  stake: number;
  quantity: number;
  openTime: number;
  closeTime?: number;
  exitPrice?: number;
  status: 'OPEN' | 'CLOSED' | 'CANCELLED' | 'PENDING';
  profitLoss?: number;
  returnPercent?: number;
  notes?: string;
}

interface ManualBotConfig {
  initialBalance: number;
  maxOpenTrades: number;
  enableAlerts: boolean;
  trackHistory: boolean;
  autoCalculatePnL: boolean;
}

interface ManualBotStats {
  totalBalance: number;
  availableBalance: number;
  usedBalance: number;
  totalTrades: number;
  openTrades: number;
  closedTrades: number;
  totalProfit: number;
  totalLoss: number;
  netProfit: number;
  winRate: number;
  averageWin: number;
  averageLoss: number;
  largestWin: number;
  largestLoss: number;
  profitFactor: number;
}

interface TradeAlert {
  id: string;
  timestamp: number;
  type: 'ENTRY' | 'EXIT' | 'UPDATE' | 'CANCEL' | 'ALERT';
  message: string;
  tradeId: string;
  severity: 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR';
}

class ManualTradeBot {
  private config: ManualBotConfig;
  private trades: Map<string, TradeOrder> = new Map();
  private alerts: TradeAlert[] = [];
  private stats: ManualBotStats;
  private tradeHistory: TradeOrder[] = [];

  constructor(config: Partial<ManualBotConfig> = {}) {
    this.config = {
      initialBalance: config.initialBalance || 10000,
      maxOpenTrades: config.maxOpenTrades || 10,
      enableAlerts: config.enableAlerts ?? true,
      trackHistory: config.trackHistory ?? true,
      autoCalculatePnL: config.autoCalculatePnL ?? true,
    };

    this.stats = {
      totalBalance: this.config.initialBalance,
      availableBalance: this.config.initialBalance,
      usedBalance: 0,
      totalTrades: 0,
      openTrades: 0,
      closedTrades: 0,
      totalProfit: 0,
      totalLoss: 0,
      netProfit: 0,
      winRate: 0,
      averageWin: 0,
      averageLoss: 0,
      largestWin: 0,
      largestLoss: 0,
      profitFactor: 0,
    };
  }

  /**
   * Place a manual BUY trade
   */
  placeBuy(
    contractType: string,
    stake: number,
    quantity: number = 1,
    notes?: string
  ): { success: boolean; tradeId?: string; error?: string } {
    // Validation
    if (this.trades.size >= this.config.maxOpenTrades) {
      const error = `Max open trades (${this.config.maxOpenTrades}) reached`;
      this.createAlert('ENTRY', error, '', 'ERROR');
      return { success: false, error };
    }

    const totalCost = stake * quantity;
    if (totalCost > this.stats.availableBalance) {
      const error = `Insufficient balance. Need $${totalCost}, have $${this.stats.availableBalance}`;
      this.createAlert('ENTRY', error, '', 'ERROR');
      return { success: false, error };
    }

    // Create trade
    const tradeId = this.generateTradeId();
    const trade: TradeOrder = {
      id: tradeId,
      type: 'BUY',
      contractType: contractType as any,
      entryPrice: this.config.initialBalance,
      stake: stake,
      quantity: quantity,
      openTime: Date.now(),
      status: 'OPEN',
      notes: notes,
    };

    this.trades.set(tradeId, trade);
    this.updateBalance();

    const message = `BUY order placed: ${contractType} × ${quantity} @ $${stake} (Total: $${totalCost})`;
    this.createAlert('ENTRY', message, tradeId, 'SUCCESS');

    return { success: true, tradeId };
  }

  /**
   * Place a manual SELL trade
   */
  placeSell(
    contractType: string,
    stake: number,
    quantity: number = 1,
    notes?: string
  ): { success: boolean; tradeId?: string; error?: string } {
    // Similar validation as placeBuy
    if (this.trades.size >= this.config.maxOpenTrades) {
      const error = `Max open trades (${this.config.maxOpenTrades}) reached`;
      this.createAlert('ENTRY', error, '', 'ERROR');
      return { success: false, error };
    }

    const totalCost = stake * quantity;
    if (totalCost > this.stats.availableBalance) {
      const error = `Insufficient balance. Need $${totalCost}, have $${this.stats.availableBalance}`;
      this.createAlert('ENTRY', error, '', 'ERROR');
      return { success: false, error };
    }

    // Create trade
    const tradeId = this.generateTradeId();
    const trade: TradeOrder = {
      id: tradeId,
      type: 'SELL',
      contractType: contractType as any,
      entryPrice: this.config.initialBalance,
      stake: stake,
      quantity: quantity,
      openTime: Date.now(),
      status: 'OPEN',
      notes: notes,
    };

    this.trades.set(tradeId, trade);
    this.updateBalance();

    const message = `SELL order placed: ${contractType} × ${quantity} @ $${stake} (Total: $${totalCost})`;
    this.createAlert('ENTRY', message, tradeId, 'SUCCESS');

    return { success: true, tradeId };
  }

  /**
   * Close a trade with exit price
   */
  closeTrade(
    tradeId: string,
    exitPrice: number,
    notes?: string
  ): { success: boolean; profitLoss?: number; error?: string } {
    const trade = this.trades.get(tradeId);

    if (!trade) {
      const error = `Trade ${tradeId} not found`;
      this.createAlert('EXIT', error, tradeId, 'ERROR');
      return { success: false, error };
    }

    if (trade.status !== 'OPEN') {
      const error = `Trade ${tradeId} is not open (Status: ${trade.status})`;
      this.createAlert('EXIT', error, tradeId, 'ERROR');
      return { success: false, error };
    }

    // Calculate P&L
    const priceDifference = exitPrice - trade.entryPrice;
    const profitLoss = priceDifference * trade.quantity;
    const returnPercent = (priceDifference / trade.entryPrice) * 100;

    // Update trade
    trade.closeTime = Date.now();
    trade.exitPrice = exitPrice;
    trade.status = 'CLOSED';
    trade.profitLoss = profitLoss;
    trade.returnPercent = returnPercent;
    if (notes) trade.notes = notes;

    // Update history
    if (this.config.trackHistory) {
      this.tradeHistory.push({ ...trade });
    }

    this.updateBalance();
    this.updateStats();

    const message = `CLOSED: ${trade.contractType} | P&L: $${profitLoss.toFixed(2)} (${returnPercent.toFixed(2)}%)`;
    this.createAlert('EXIT', message, tradeId, profitLoss > 0 ? 'SUCCESS' : 'WARNING');

    return { success: true, profitLoss };
  }

  /**
   * Cancel an open trade
   */
  cancelTrade(tradeId: string): { success: boolean; error?: string } {
    const trade = this.trades.get(tradeId);

    if (!trade) {
      const error = `Trade ${tradeId} not found`;
      this.createAlert('CANCEL', error, tradeId, 'ERROR');
      return { success: false, error };
    }

    if (trade.status !== 'OPEN') {
      const error = `Cannot cancel: Trade ${tradeId} is ${trade.status}`;
      this.createAlert('CANCEL', error, tradeId, 'ERROR');
      return { success: false, error };
    }

    // Cancel trade
    trade.status = 'CANCELLED';
    this.updateBalance();

    const message = `Trade ${tradeId} cancelled - $${trade.stake * trade.quantity} returned`;
    this.createAlert('CANCEL', message, tradeId, 'INFO');

    return { success: true };
  }

  /**
   * Modify an open trade
   */
  modifyTrade(
    tradeId: string,
    updates: { stake?: number; quantity?: number; notes?: string }
  ): { success: boolean; error?: string } {
    const trade = this.trades.get(tradeId);

    if (!trade) {
      return { success: false, error: `Trade ${tradeId} not found` };
    }

    if (trade.status !== 'OPEN') {
      return { success: false, error: `Trade ${tradeId} is not open` };
    }

    // Check balance if stake/quantity changed
    if (updates.stake || updates.quantity) {
      const newStake = updates.stake || trade.stake;
      const newQuantity = updates.quantity || trade.quantity;
      const newCost = newStake * newQuantity;
      const oldCost = trade.stake * trade.quantity;
      const costDifference = newCost - oldCost;

      if (costDifference > this.stats.availableBalance) {
        return {
          success: false,
          error: `Insufficient balance for modification. Need $${costDifference}`,
        };
      }
    }

    // Apply updates
    if (updates.stake) trade.stake = updates.stake;
    if (updates.quantity) trade.quantity = updates.quantity;
    if (updates.notes) trade.notes = updates.notes;

    this.updateBalance();

    const message = `Trade ${tradeId} modified`;
    this.createAlert('UPDATE', message, tradeId, 'INFO');

    return { success: true };
  }

  /**
   * Get trade details
   */
  getTrade(tradeId: string): TradeOrder | undefined {
    return this.trades.get(tradeId);
  }

  /**
   * Get all open trades
   */
  getOpenTrades(): TradeOrder[] {
    return Array.from(this.trades.values()).filter((t) => t.status === 'OPEN');
  }

  /**
   * Get all closed trades
   */
  getClosedTrades(): TradeOrder[] {
    return this.tradeHistory;
  }

  /**
   * Get all trades with specific status
   */
  getTradesByStatus(status: 'OPEN' | 'CLOSED' | 'CANCELLED'): TradeOrder[] {
    return Array.from(this.trades.values()).filter((t) => t.status === status);
  }

  /**
   * Calculate unrealized P&L for open trades
   */
  calculateUnrealizedPnL(): number {
    let totalUnrealizedPnL = 0;

    for (const trade of this.getOpenTrades()) {
      if (trade.exitPrice !== undefined) {
        const priceDifference = trade.exitPrice - trade.entryPrice;
        totalUnrealizedPnL += priceDifference * trade.quantity;
      }
    }

    return totalUnrealizedPnL;
  }

  /**
   * Update balance based on open and closed trades
   */
  private updateBalance(): void {
    let usedBalance = 0;

    for (const trade of this.getOpenTrades()) {
      usedBalance += trade.stake * trade.quantity;
    }

    this.stats.usedBalance = usedBalance;
    this.stats.availableBalance = this.config.initialBalance - usedBalance;
    this.stats.totalBalance = this.config.initialBalance;
    this.stats.openTrades = this.getOpenTrades().length;
    this.stats.closedTrades = this.getClosedTrades().length;
    this.stats.totalTrades = this.trades.size;
  }

  /**
   * Update comprehensive statistics
   */
  private updateStats(): void {
    const closedTrades = this.getClosedTrades();
    let totalProfit = 0;
    let totalLoss = 0;
    let wins = 0;
    let losses = 0;

    for (const trade of closedTrades) {
      if (trade.profitLoss !== undefined) {
        if (trade.profitLoss > 0) {
          totalProfit += trade.profitLoss;
          wins++;
        } else {
          totalLoss += Math.abs(trade.profitLoss);
          losses++;
        }
      }
    }

    this.stats.totalProfit = totalProfit;
    this.stats.totalLoss = totalLoss;
    this.stats.netProfit = totalProfit - totalLoss;
    this.stats.winRate = closedTrades.length > 0 ? wins / closedTrades.length : 0;
    this.stats.averageWin = wins > 0 ? totalProfit / wins : 0;
    this.stats.averageLoss = losses > 0 ? totalLoss / losses : 0;

    // Find largest win/loss
    let largestWin = 0;
    let largestLoss = 0;
    for (const trade of closedTrades) {
      if (trade.profitLoss !== undefined) {
        if (trade.profitLoss > largestWin) largestWin = trade.profitLoss;
        if (trade.profitLoss < largestLoss) largestLoss = trade.profitLoss;
      }
    }
    this.stats.largestWin = largestWin;
    this.stats.largestLoss = Math.abs(largestLoss);

    // Profit factor
    this.stats.profitFactor = totalLoss > 0 ? totalProfit / totalLoss : totalProfit > 0 ? 999 : 0;
  }

  /**
   * Create trade alert
   */
  private createAlert(
    type: 'ENTRY' | 'EXIT' | 'UPDATE' | 'CANCEL' | 'ALERT',
    message: string,
    tradeId: string,
    severity: 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR'
  ): void {
    if (!this.config.enableAlerts) return;

    const alert: TradeAlert = {
      id: `ALERT_${Date.now()}`,
      timestamp: Date.now(),
      type,
      message,
      tradeId,
      severity,
    };

    this.alerts.push(alert);

    // Keep only last 100 alerts
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(-100);
    }
  }

  /**
   * Get recent alerts
   */
  getAlerts(limit: number = 10): TradeAlert[] {
    return this.alerts.slice(-limit).reverse();
  }

  /**
   * Get statistics
   */
  getStats(): ManualBotStats {
    return { ...this.stats };
  }

  /**
   * Get comprehensive portfolio report
   */
  getPortfolioReport() {
    const stats = this.getStats();
    const openTrades = this.getOpenTrades();
    const unrealizedPnL = this.calculateUnrealizedPnL();

    return {
      accountSummary: {
        totalBalance: `$${stats.totalBalance.toFixed(2)}`,
        availableBalance: `$${stats.availableBalance.toFixed(2)}`,
        usedBalance: `$${stats.usedBalance.toFixed(2)}`,
      },
      performanceSummary: {
        totalProfit: `$${stats.totalProfit.toFixed(2)}`,
        totalLoss: `$${stats.totalLoss.toFixed(2)}`,
        netProfit: `$${stats.netProfit.toFixed(2)}`,
        winRate: `${(stats.winRate * 100).toFixed(2)}%`,
        profitFactor: stats.profitFactor.toFixed(2),
      },
      tradeSummary: {
        totalTrades: stats.totalTrades,
        openTrades: stats.openTrades,
        closedTrades: stats.closedTrades,
        wins: this.getClosedTrades().filter((t) => t.profitLoss! > 0).length,
        losses: this.getClosedTrades().filter((t) => t.profitLoss! < 0).length,
      },
      averageMetrics: {
        averageWin: `$${stats.averageWin.toFixed(2)}`,
        averageLoss: `$${stats.averageLoss.toFixed(2)}`,
        largestWin: `$${stats.largestWin.toFixed(2)}`,
        largestLoss: `$${stats.largestLoss.toFixed(2)}`,
      },
      livePositions: {
        count: openTrades.length,
        totalExposure: `$${openTrades.reduce((sum, t) => sum + t.stake * t.quantity, 0).toFixed(2)}`,
        unrealizedPnL: `$${unrealizedPnL.toFixed(2)}`,
      },
    };
  }

  /**
   * Get trade-by-trade history
   */
  getTradeLog(): TradeOrder[] {
    return [...this.tradeHistory];
  }

  /**
   * Export trades as JSON
   */
  exportTrades(): string {
    return JSON.stringify(
      {
        exportDate: new Date().toISOString(),
        stats: this.getStats(),
        trades: this.getTradeLog(),
        alerts: this.getAlerts(50),
      },
      null,
      2
    );
  }

  /**
   * Reset all data
   */
  reset(): void {
    this.trades.clear();
    this.alerts = [];
    this.tradeHistory = [];
    this.stats = {
      totalBalance: this.config.initialBalance,
      availableBalance: this.config.initialBalance,
      usedBalance: 0,
      totalTrades: 0,
      openTrades: 0,
      closedTrades: 0,
      totalProfit: 0,
      totalLoss: 0,
      netProfit: 0,
      winRate: 0,
      averageWin: 0,
      averageLoss: 0,
      largestWin: 0,
      largestLoss: 0,
      profitFactor: 0,
    };
  }

  /**
   * Generate unique trade ID
   */
  private generateTradeId(): string {
    return `TRD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export default ManualTradeBot;
export type { TradeOrder, ManualBotConfig, ManualBotStats, TradeAlert };
