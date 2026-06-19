"use client";
import React, { useState } from 'react';

export default function CompleteTradingPlatform() {
    // Navigation States
    const [currentMainTab, setCurrentMainTab] = useState('Bot Builder'); // Dashboard, Bot Builder, Charts
    const [currentSubTab, setCurrentSubTab] = useState('Trading Bots');  // Trading Bots, Hybrid Bots, SpeedBots
    const [isRunning, setIsRunning] = useState(false);

    // Simulated States for alternate screens
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

        // Default view: "Bot Builder"
        return (
            <div>
                {/* Quick Strategy Accent Badge */}
                <button style={{ backgroundColor: '#00b37e', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', fontWeight: 'bold', fontSize: '15px', marginBottom: '16px', cursor: 'pointer' }}>
                    Quick strategy
                </button>

                {/* Block 1: Trade Parameters Container */}
                <div style={{ backgroundColor: '#ffffff', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.08)', overflow: 'hidden', marginBottom: '16px' }}>
                    <div style={{ backgroundColor: '#2ca05a', color: '#fff', padding: '10px 14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                        📋 1. Trade parameters
                    </div>
                    
                    {/* Visual Parameter Dropdowns Section */}
                    <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', backgroundColor: '#f9f9fb' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' }}>
                            <span style={{ color: '#666' }}>Market:</span>
                            <select style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc' }}><option>Derived</option></select> &gt;
                            <select style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc' }}><option>Continuous Indices</option></select> &gt;
                            <select style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc' }}><option>Volatility 10 (1s) Index</option></select>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ color: '#666' }}>Trade Type:</span>
                            <select style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc' }}><option>Digits</option></select> &gt;
                            <select style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc' }}><option>Over/Under</option></select>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ color: '#666' }}>Contract Type:</span>
                            <select style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc' }}><option>Both</option></select>
                        </div>
                    </div>

                    {/* Block Subheader: Run Once At Start Logic */}
                    <div style={{ backgroundColor: '#2ca05a', color: '#fff', padding: '8px 14px', fontSize: '13px', borderTop: '1px solid #23844a' }}>
                        Run once at start:
                    </div>

                    {/* Puzzle Block Parameter Assignment Lines */}
                    <div style={{ padding: '14px', backgroundColor: '#eef1f5', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {['STAKE', 'TAKE PROFIT', 'MARTINGALE'].map((param, index) => (
                            <div key={param} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#fff', padding: '6px 12px', borderRadius: '4px', width: 'fit-content', borderLeft: '4px solid #a0a0a0' }}>
                                <span style={{ color: '#555', fontSize: '13px' }}>set</span>
                                <span style={{ fontWeight: 'bold', background: '#eee', padding: '2px 6px', borderRadius: '3px', fontSize: '12px' }}>{param}</span>
                                <span style={{ color: '#555', fontSize: '13px' }}>to</span>
                                <input type="text" defaultValue={index === 1 ? "20" : index === 2 ? "1" : "10"} style={{ width: '40px', textAlign: 'center', border: '1px solid #ccc', borderRadius: '3px' }} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div style={{ backgroundColor: '#f4f4f6', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', color: '#333', display: 'flex', flexDirection: 'column' }}>
            
            {/* 1. Brand Header */}
            <div style={{ backgroundColor: '#ffffff', padding: '12px
