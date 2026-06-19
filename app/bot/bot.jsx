"use client";
import React, { useState } from 'react';

export default function CompleteTradingPlatform() {
    const [currentMainTab, setCurrentMainTab] = useState('Bot Builder');
    const [currentSubTab, setCurrentSubTab] = useState('Trading Bots');
    const [isRunning, setIsRunning] = useState(false);

    const renderMainContent = () => {
        if (currentMainTab === 'Dashboard') {
            return (
                <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '4px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <h3>📈 Performance Dashboard</h3>
                    <p style={{ color: '#666' }}>Real-time statistics, balance overview, and active bot metrics will appear here.</p>
                </div>
            );
        }
        
        if (currentMainTab === 'Charts') {
            return (
                <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '4px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <h3>📊 Live Market Charts</h3>
                    <p style={{ color: '#666' }}>Candlestick feeds and structural digit price graphs mapping the Volatility indices.</p>
                </div>
            );
        }

        return (
            <div>
                <button style={{ backgroundColor: '#00b37e', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', fontWeight: 'bold', fontSize: '15px', marginBottom: '16px', cursor: 'pointer' }}>
                    Quick strategy
                </button>

                <div style={{ backgroundColor: '#ffffff', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.08)', overflow: 'hidden', marginBottom: '16px' }}>
                    <div style={{ backgroundColor: '#2ca05a', color: '#fff', padding: '10px 14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                        📋 1. Trade parameters
                    </div>
                    
                    <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', backgroundColor: '#f9f9fb' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' }}>
                            <span style={{ color: '#666' }}>Market:</span>
                            <select style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc' }}><option>Derived</option></select>
                            <select style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc' }}><option>Continuous Indices</option></select>
                            <select style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc' }}><option>Volatility 10 (1s) Index</option></select>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ color: '#666' }}>Trade Type:</span>
                            <select style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc' }}><option>Digits</option></select>
                            <select style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc' }}><option>Over/Under</option></select>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ color: '#666' }}>Contract Type:</span>
                            <select style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc' }}><option>Both</option></select>
                        </div>
                    </div>

                    <div style={{ backgroundColor: '#2ca05a', color: '#fff', padding: '8px 14px', fontSize: '13px', borderTop: '1px solid #23844a' }}>
                        Run once at start:
                    </div>

                    <div style={{ padding: '14px', backgroundColor: '#eef1f5', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#fff', padding: '6px 12px', borderRadius: '4px', width: 'fit-content', borderLeft: '4px solid #a0a0a0' }}>
                            <span style={{ color: '#555', fontSize: '13px' }}>set STAKE to</span>
                            <input type="text" defaultValue="10" style={{ width: '40px', textAlign: 'center', border: '1px solid #ccc', borderRadius: '3px' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#fff', padding: '6px 12px', borderRadius: '4px', width: 'fit-content', borderLeft: '4px solid #a0a0a0' }}>
                            <span style={{ color: '#555', fontSize: '13px' }}>set TAKE PROFIT to</span>
                            <input type="text" defaultValue="20" style={{ width: '40px', textAlign: 'center', border: '1px solid #ccc', borderRadius: '3px' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#fff', padding: '6px 12px', borderRadius: '4px', width: 'fit-content', borderLeft: '4px solid #a0a0a0' }}>
                            <span style={{ color: '#555', fontSize: '13px' }}>set MARTINGALE to</span>
                            <input type="text" defaultValue="1" style={{ width: '40px', textAlign: 'center', border: '1px solid #ccc', borderRadius: '3px' }} />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div style={{ backgroundColor: '#f4f4f6', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', color: '#333', display: 'flex', flexDirection: 'column' }}>
            
            <div style={{ backgroundColor: '#ffffff', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e5e5' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#4a4a4a' }}>
                        <span style={{ color: '#00b37e' }}>mkoreanwwn</span>.site
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{ backgroundColor: '#85bb25', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', fontWeight: 'bold', fontSize: '13px' }}>Log in</button>
                </div>
            </div>

            <div style={{ backgroundColor: '#a2b61e', display: 'flex', borderBottom: '2px solid #8e9f16' }}>
                {['Dashboard', 'Bot Builder', 'Charts'].map(tab => (
                    <div 
                        key={tab}
                        onClick={() => setCurrentMainTab(tab)}
                        style={{ 
                            padding: '14px 20px', 
                            color: '#fff', 
                            fontWeight: 'bold', 
                            fontSize: '13px', 
                            cursor: 'pointer',
                            backgroundColor: currentMainTab === tab ? '#8e9f16' : 'transparent'
                        }}
                    >
                        {tab}
                    </div>
                ))}
            </div>

            <div style={{ backgroundColor: '#b5c92a', display: 'flex', overflowX: 'auto', whiteSpace: 'nowrap', padding: '2px 0' }}>
                {['Trading Bots', 'Analysis Tool', 'Copy Trading', 'DTrader'].map(subTab => (
                    <div 
                        key={subTab}
                        onClick={() => setCurrentSubTab(subTab)}
                        style={{ 
                            padding: '10px 16px', 
                            color: '#fff', 
                            fontWeight: currentSubTab === subTab ? 'bold' : 'normal', 
                            fontSize: '13px', 
                            cursor: 'pointer',
                            backgroundColor: currentSubTab === subTab ? '#9cb11b' : 'transparent',
                            borderRadius: '4px',
                            margin: '2px 4px'
                        }}
                    >
                        {subTab}
                    </div>
                ))}
            </div>

            <div style={{ padding: '16px', flex: 1, paddingBottom: '90px' }}>
                {renderMainContent()}
            </div>

            <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#ffffff', boxShadow: '0 -2px 10px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', padding: '12px 16px', zIndex: 1000 }}>
                <button 
                    onClick={() => setIsRunning(!isRunning)}
                    style={{ backgroundColor: isRunning ? '#f75a68' : '#2ca5ba', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '4px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}
                >
                    {isRunning ? '🛑 Stop' : '▶️ Run'}
                </button>
                <div style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', color: isRunning ? '#00b37e' : '#4a4a4a', fontSize: '14px' }}>
                    {isRunning ? '⚡ Bot is running...' : 'Bot is not running'}
                </div>
            </div>

        </div>
    );
}
