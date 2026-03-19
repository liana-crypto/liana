/**
 * NayroVex Alpha Coins Intensive v1.1
 * القسم الثالث: نظام صيد الفرص السريعة والزخم العالي
 */

import { detectFVG } from './liquidity.js';
import { calculateProbability } from './predictor.js';

// 1. القائمة الديناميكية (العملات الأكثر حركة)
const ALPHA_WATCHLIST = ['PEPEUSDT', 'ORDIUSDT', 'WIFUSDT', 'TIAUSDT', 'SOLUSDT', 'BONKUSDT'];

export const initAlphaIntensive = () => {
    const container = document.querySelector('#alpha-list');
    if (!container) return;

    console.log("%c 🚀 NX-ALPHA: Intensive Mode Engaged (15m Flow)", "color: #a855f7; font-weight: bold;");

    // تحديث فائق السرعة (كل 6 ثوانٍ) لملاحقة نبض السوق
    setInterval(async () => {
        const promises = ALPHA_WATCHLIST.map(async (symbol) => {
            try {
                // جلب بيانات 15 دقيقة لرصد الـ FVG والزخم اللحظي
                const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=15m&limit=12`);
                const klines = await res.json();
                
                updateAlphaIntensiveUI(symbol, klines);
            } catch (err) { console.error(`Alpha Error [${symbol}]:`, err); }
        });
        await Promise.all(promises);
    }, 6000);
};

const updateAlphaIntensiveUI = (symbol, klines) => {
    const lastPrice = parseFloat(klines[klines.length - 1][4]);
    const rsi = calculateQuickRSI(klines);
    const fvg = detectFVG(klines.slice(-3));
    
    // تحديد الاتجاه القصير (Short-term Trend)
    const trend = lastPrice > parseFloat(klines[klines.length - 6][4]) ? 'BULLISH' : 'BEARISH';
    
    // المحرك الاحتمالي (Probability Engine)
    const pred = calculateProbability(rsi, fvg, trend);

    let item = document.getElementById(`alpha-intensive-${symbol}`);
    if (!item) {
        item = document.createElement('div');
        item.id = `alpha-intensive-${symbol}`;
        // تصميم هجومي (Neon Purple) لتمييزه عن السبوت
        item.className = "p-3 mb-2 glass border border-purple-500/10 rounded-2xl transition-all duration-300 bg-gradient-to-tr from-purple-500/[0.03] to-transparent";
        document.querySelector('#alpha-list').appendChild(item);
    }

    // 🔊 إطلاق التنبيهات (Pulse + Sound) إذا كانت الفرصة ذهبية (High Confidence)
    if (pred.probability >= 80 && window.triggerPulse) {
        window.triggerPulse(pred.probability > 50 ? 'BUY' : 'SELL');
        // هنا يمكن إضافة سطر لتشغيل صوت تنبيه قصير
    }

    item.innerHTML = `
        <div class="flex justify-between items-center mb-2">
            <div class="flex flex-col">
                <span class="text-[9px] font-black text-white italic tracking-tighter">${symbol}</span>
                <span class="text-[6px] font-black text-purple-500/80 uppercase tracking-[0.2em]">Alpha Target</span>
            </div>
            <div class="text-right">
                <span class="text-[10px] font-mono font-bold text-white tracking-tighter">$${lastPrice}</span>
            </div>
        </div>

        <div class="flex items-center gap-2 mb-2 bg-white/[0.02] p-1.5 rounded-xl border border-white/5">
            <div class="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                <div class="h-full transition-all duration-1000 ${pred.probability > 50 ? 'bg-purple-500 shadow-[0_0_8px_#a855f7]' : 'bg-red-500'}" 
                     style="width: ${pred.probability}%"></div>
            </div>
            <span class="text-[8px] font-black ${pred.probability > 50 ? 'text-purple-400' : 'text-red-400'}">
                ${pred.probability}%
            </span>
        </div>

        <div class="flex justify-between items-center px-1">
            <span class="text-[7px] font-black text-gray-500 uppercase">${pred.signal}</span>
            <div class="flex gap-2">
                <span class="text-[7px] font-black ${fvg ? 'text-cyan-400 animate-pulse' : 'text-gray-700'}">
                    FVG: ${fvg ? fvg.type : 'BAL'}
                </span>
                <span class="text-[7px] font-black ${rsi > 70 || rsi < 30 ? 'text-yellow-500' : 'text-gray-700'}">
                    RSI: ${rsi.toFixed(0)}
                </span>
            </div>
        </div>
    `;
};

function calculateQuickRSI(data) {
    const closes = data.map(d => parseFloat(d[4]));
    let gains = 0, losses = 0;
    for (let i = 1; i < closes.length; i++) {
        let diff = closes[i] - closes[i-1];
        diff >= 0 ? gains += diff : losses -= diff;
    }
    return 100 - (100 / (1 + (gains / (losses || 1))));
}
