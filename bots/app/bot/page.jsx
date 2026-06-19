"use client";
import React, { useState, useEffect, useRef } from 'react';

export default function BotDashboard() {
    const [isRunning, setIsRunning] = useState(false);
    const [marketFeed, setMarketFeed] = useState([3, 5, 7, 3, 9, 3, 5, 1, 2, 7, 5, 5, 8, 0, 3, 9, 4, 3, 5]);
    const [signals, setSignals] = useState({ green: '-', blue: '-', yellow: '-', red: '-' });
    const intervalRef = useRef(null);

    // Run calculation cycle whenever the market data changes
    useEffect(() => {
        if (marketFeed.length === 0) return;

        const frequencyGrid = Array(10).fill(0);
        marketFeed.forEach(digit => frequencyGrid[digit]++);

        const sortedMarketData = frequencyGrid
            .map((count, digit) => ({ digit, count }))
            .sort((a, b) => b.count - a.count);

        setSignals({
            green: `Digit ${sortedMarketData[0].digit} (${sortedMarketData[0].count}x)`,
            blue: `Digit ${sortedMarketData[1].digit} (${sortedMarketData[1].count}x)`,
            yellow: `Digit ${sortedMarketData[8].digit} (${sortedMarketData[8].count}x)`,
            red: `Digit ${sortedMarketData[9].digit} (${sortedMarketData[9].count}x)`
        });
    }, [marketFeed]);

    const startBot = () => {
        if (isRunning) return;
        setIsRunning(true);

        intervalRef.current = setInterval(() => {
            setMarketFeed(prevFeed => {
                const newTick = Math.floor(Math.random() * 10);
                const updatedFeed = [...prevFeed, newTick];
                if (updatedFeed.length > 50) updatedFeed.shift(); // Keep latest 50 ticks
                return updatedFeed;
            });
        }, 2000);
    };

    const stopBot = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setIsRunning(false);
    };

    // Cleanup interval if component unmounts
    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    return (
        <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', backgroundColor: '#121214', color: '#e1e1e6', fontFamily: 'sans-serif', borderRadius: '8px' }}>
            <h2 style={{ textAlign: 'center' }}>🤖 Market Analyzer Engine</h2>
            
            <div style={{ 
                padding: '12px', 
                borderRadius: '6px', 
                backgroundColor: '#202024', 
                marginBottom: '20px', 
                fontWeight: 'bold', 
                textAlign: 'center',
                color: isRunning ? '#00b37e' : '#f75a68'
            }}>
                STATUS: {isRunning ? "RUNNING ⚡" : "IDLE 🔘"}
            </div>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
                <button 
                    onClick={startBot} 
                    disabled={isRunning}
                    style={{ flex: 1, padding: '15px', background: isRunning ? '#29292e' : '#00b37e', color: '#fff', border: 'none', borderRadius: '6px', cursor: isRunning ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
                >
                    RUN BOT 🟢
                </button>
                <button 
                    onClick={stopBot} 
                    disabled={!isRunning}
                    style={{ flex: 1, padding: '15px', background: !isRunning ? '#29292e' : '#f75a68', color: '#fff', border: 'none', borderRadius: '6px', cursor: !isRunning ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
                >
                    STOP BOT 🔴
                </button>
            </div>

            <h3>Signals Matrix</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ padding: '15px', borderRadius: '6px', background: '#202024', borderLeft: '5px solid #00b37e' }}>
                    <strong>🟢 GREEN (Most):</strong><br />{signals.green}
                </div>
                <div style={{ padding: '15px', borderRadius: '6px', background: '#202024', borderLeft: '5px solid #00b7ff' }}>
                    <strong>🔵 BLUE (2nd Most):</strong><br />{signals.blue}
                </div>
                <div style={{ padding: '15px', borderRadius: '6px', background: '#202024', borderLeft: '5px solid #fba94c' }}>
                    <strong>🟡 YELLOW (2nd Least):</strong><br />{signals.yellow}
                </div>
                <div style={{ padding: '15px', borderRadius: '6px', background: '#202024', borderLeft: '5px solid #f75a68' }}>
                    <strong>🔴 RED (Least):</strong><br />{signals.red}
                </div>
            </div>
        </div>
    );
}
