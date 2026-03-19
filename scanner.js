/**
 * NayroVex Global Scanner Pro v1.2
 * الفكرة السادسة: الـ Dashboard التفاعلي مع رصد السيولة اللحظي
 */

import { detectFVG } from './liquidity.js';

const WATCHLIST = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'PEPEUSDT', 'TIAUSDT'];
const INTERVAL = 15000; // تقليل الوقت لـ 15 ثانية لسرعة الاستجابة

export const startGlobalScanner = async () => {
    console.log("%c 🛰️ NX-PRO-v1.2: Radar Scanning Active", "color: #08f7ff; font-weight: bold;");

    setInterval(async () => {
        const scanPromises = WATCHLIST.map(async (symbol) => {
            try {
                const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1h&limit=5`);
                const klines = await res.json();
                
                // 1. تحليل السيولة لكل عملة في القائمة
                const fvg = detectFVG(klines);
                
                // 2. تحديث الواجهة التفاعلية (Dashboard)
                updateScannerUI(symbol, klines, fvg);

                // 3. إطلاق النبض والصوت إذا وجدت فجوة (الفكرة 4)
                if (fvg && typeof window.triggerPulse === 'function') {
                    window.triggerPulse(fvg.type);
                }
                
            } catch (e) { console.error(`Error scanning ${symbol}:`, e); }
        });

        await Promise.all(scanPromises);
    }, INTERVAL);
};

// دالة التحديث الذكي للواجهة
const updateScannerUI = (symbol, klines, fvg) => {
    let item = document.getElementById(`scan-${symbol}`);
    if (!item) {
        item = document.createElement('div');
        item.id = `scan-${symbol}`;
        item.className = "p-2 mb-1 border-b border-white/5 transition-all duration-500 rounded-lg";
        document.querySelector('#scanner-list').appendChild(item);
    }
    
    const lastPrice = parseFloat(klines[klines.length-1][4]).toFixed(2);
    const priceColor = fvg ? (fvg.type === 'BUY' ? 'text-green-400' : 'text-red-400') : 'text-cyan-500';
    
    // إضافة تأثير "الوميض" عند وجود فجوة
    if (fvg) item.classList.add('bg-white/[0.02]', 'border-white/10');

    item.innerHTML = `
        <div class="flex justify-between items-center">
            <span class="font-black text-[9px] text-gray-300">${symbol}</span>
            <span class="font-mono text-[9px] ${priceColor} font-bold">$${lastPrice}</span>
        </div>
        ${fvg ? `
            <div class="flex justify-between items-center mt-1 animate-pulse">
                <span class="text-[7px] font-black ${fvg.type === 'BUY' ? 'text-green-500' : 'text-red-500'} uppercase">${fvg.label}</span>
                <span class="text-[7px] text-gray-500 font-mono italic">Δ: ${fvg.size}</span>
            </div>
        ` : ''}
    `;
};

window.startGlobalScanner = startGlobalScanner;
