/**
 * NayroVex Spot Coins Analyzer v1.0
 * الفكرة الثانية: التحليل الشامل للعملات القيادية والمتداولة
 */

import { detectFVG } from './liquidity.js';
import { calculateProbability } from './predictor.js';

// 1. القائمة الشاملة لعملات الـ Spot (العملات الكبيرة والمتداولة)
const SPOT_WATCHLIST = [
    'BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'XRPUSDT', 
    'ADAUSDT', 'AVAXUSDT', 'DOTUSDT', 'LINKUSDT', 'NEARUSDT'
];

export const initSpotCoinsAnalyzer = () => {
    const container = document.querySelector('#spot-list');
    if (!container) return;

    console.log("%c 🏦 NX-SPOT: Core Market Analyzer Active", "color: #00ff88; font-weight: bold;");

    // تحديث مستمر (كل 10 ثوانٍ) لضمان دقة البيانات
    setInterval(async () => {
        const promises = SPOT_WATCHLIST.map(async (symbol) => {
            try {
                // جلب بيانات الشموع (فريم الساعة لقرارات يومية دقيقة)
                const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1h&limit=14`);
                const klines = await res.json();
                
                updateSpotDashboardUI(symbol, klines);
            } catch (err) { console.error(`Spot Analyzer Error [${symbol}]:`, err); }
        });
        await Promise.all(promises);
    }, 10000);
};

const updateSpotDashboardUI = (symbol, klines) => {
    const lastPrice = parseFloat(klines[klines.length - 1][4]);
    const rsi = calculateRSI(klines);
    const fvg = detectFVG(klines.slice(-3));
    
    // تحليل الاتجاه (Trend)
    const trend = klines[klines.length - 1][4] > klines[0][4] ? 'BULLISH' : 'BEARISH';
    
    // استدعاء محرك التوقعات (Prediction Engine) ليعطي الإشارة والنسبة
    const pred = calculateProbability(rsi, fvg, trend);

    let item = document.getElementById(`spot-card-${symbol}`);
    if (!item) {
        item = document.createElement('div');
        item.id = `spot-card-${symbol}`;
        // تصميم البطاقة التفاعلية (Dashboard UI)
        item.className = "p-4 mb-3 glass border border-white/5 rounded-3xl transition-all duration-500 hover:border-cyan-500/20";
        document.querySelector('#spot-list').appendChild(item);
    }

    // تلوين الواجهة بناءً على قوة الإشارة (لون ديناميكي)
    const accentColor = pred.probability > 50 ? 'text-green-400' : 'text-red-400';
    const barColor = pred.probability > 50 ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500 shadow-[0_0_10px_#ef4444]';

    item.innerHTML = `
        <div class="flex justify-between items-start mb-4">
            <div>
                <h3 class="text-sm font-black text-white tracking-tighter">${symbol}</h3>
                <span class="text-[7px] font-black text-gray-500 uppercase tracking-widest">Spot Market</span>
            </div>
            <div class="text-right">
                <div class="text-xs font-mono font-bold text-white">$${lastPrice.toLocaleString()}</div>
                <div class="text-[8px] font-black ${accentColor} uppercase">${pred.signal}</div>
            </div>
        </div>

        <div class="mb-4">
            <div class="flex justify-between text-[8px] font-black text-gray-400 mb-1">
                <span>PROBABILITY SCORE</span>
                <span class="${accentColor}">${pred.probability}%</span>
            </div>
            <div class="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div class="h-full transition-all duration-1000 ${barColor}" style="width: ${pred.probability}%"></div>
            </div>
        </div>

        <div class="grid grid-cols-3 gap-2 pt-3 border-t border-white/5 text-[7px] font-black uppercase tracking-tighter">
            <div class="flex flex-col">
                <span class="text-gray-600 mb-1">Momentum (RSI)</span>
                <span class="${rsi < 35 ? 'text-cyan-400' : rsi > 65 ? 'text-red-400' : 'text-white'}">${rsi.toFixed(1)}</span>
            </div>
            <div class="flex flex-col px-1 border-x border-white/5">
                <span class="text-gray-600 mb-1">Market Trend</span>
                <span class="${trend === 'BULLISH' ? 'text-green-500' : 'text-red-500'}">${trend}</span>
            </div>
            <div class="flex flex-col text-right">
                <span class="text-gray-600 mb-1">Liquidity (FVG)</span>
                <span class="${fvg ? 'text-cyan-400 animate-pulse' : 'text-gray-700'}">${fvg ? fvg.type : 'NONE'}</span>
            </div>
        </div>
    `;
};

// دالة حساب RSI (Period 14)
function calculateRSI(data) {
    const closes = data.map(d => parseFloat(d[4]));
    let gains = 0, losses = 0;
    for (let i = 1; i < closes.length; i++) {
        let diff = closes[i] - closes[i-1];
        diff >= 0 ? gains += diff : losses -= diff;
    }
    const rs = gains / (losses || 1);
    return 100 - (100 / (1 + rs));
}
