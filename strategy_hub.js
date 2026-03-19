/**
 * NayroVex Intelligence Engine v3.0
 * دمج التقلب الديناميكي + ربط إشارات المحفظة
 */

// 1. حساب أهداف الربح بناءً على تقلب العملة الحقيقي (24h Change)
const calculateDynamicTargets = (price, change24h) => {
    // إذا كانت العملة هادئة نستخدم 1.5%، إذا كانت مجنونة نستخدم نصف نسبة تغيرها اليومي
    const volatility = Math.max(0.015, Math.abs(change24h) / 100 / 2); 
    
    return {
        tp1: (price * (1 + volatility)).toFixed(4),
        tp2: (price * (1 + (volatility * 1.8))).toFixed(4),
        sl: (price * (1 - volatility)).toFixed(4),
        riskLevel: volatility > 0.04 ? 'HIGH VOLATILITY' : 'STABLE'
    };
};

// 2. دالة فحص المحفظة لإطلاق التنبيهات (Pulse Alerts)
const checkPortfolioAlerts = (symbol, rsi, scalpSignal) => {
    const portfolio = JSON.parse(localStorage.getItem('nx_portfolio')) || [];
    const isOwned = portfolio.some(a => a.symbol === symbol);
    
    if (isOwned && (scalpSignal === 'LONG' || scalpSignal === 'SHORT')) {
        // هنا يمكن إطلاق صوت تنبيه أو وميض في المحفظة
        console.log(`%c 🚨 ALERT: ${symbol} is showing a ${scalpSignal} signal!`, 'color: #08f7ff; font-weight: bold;');
        return true; 
    }
    return false;
};

// 3. تحديث واجهة التحليل المدمجة
window.renderUltraLogic = (container, symbol, price, rsi, trend, score, change) => {
    const targets = calculateDynamicTargets(price, change);
    const scalp = (rsi > 67 && change > 4) ? 'SHORT' : (rsi < 33 && change < -4) ? 'LONG' : 'NEUTRAL';
    const hasAlert = checkPortfolioAlerts(symbol, rsi, scalp);

    container.innerHTML = `
    <div class="p-6 animate-fade relative overflow-hidden">
        ${hasAlert ? '<div class="absolute top-0 left-0 w-full h-1 bg-cyan-500 animate-pulse"></div>' : ''}
        
        <div class="flex justify-between items-center mb-6">
            <div>
                <h2 class="text-4xl font-black text-white italic tracking-tighter">${symbol}</h2>
                <div class="text-xs font-mono ${targets.riskLevel === 'HIGH VOLATILITY' ? 'text-red-500' : 'text-gray-500'} uppercase">
                    Mode: ${targets.riskLevel}
                </div>
            </div>
            <div class="text-right">
                <div class="text-3xl font-black text-cyan-400 neon-text-cyan">${score}%</div>
                <span class="text-[8px] text-gray-600 font-black uppercase">AI Match</span>
            </div>
        </div>

        <div class="grid grid-cols-3 gap-2 mb-6">
            <div class="bg-green-500/5 border border-green-500/10 p-3 rounded-xl">
                <span class="text-[7px] text-green-500 font-black block">TARGET 1</span>
                <span class="text-[10px] font-mono text-white">$${targets.tp1}</span>
            </div>
            <div class="bg-green-500/5 border border-green-500/10 p-3 rounded-xl">
                <span class="text-[7px] text-green-500 font-black block">TARGET 2</span>
                <span class="text-[10px] font-mono text-white">$${targets.tp2}</span>
            </div>
            <div class="bg-red-500/5 border border-red-500/10 p-3 rounded-xl">
                <span class="text-[7px] text-red-500 font-black block">STOP LOSS</span>
                <span class="text-[10px] font-mono text-white">$${targets.sl}</span>
            </div>
        </div>

        <div class="flex gap-4 p-4 glass rounded-2xl border-white/5 bg-white/[0.02]">
             <div class="flex-1">
                <span class="text-[8px] text-gray-500 block uppercase mb-1">Scalp Signal</span>
                <span class="font-black ${scalp === 'LONG' ? 'text-green-500' : scalp === 'SHORT' ? 'text-red-500' : 'text-gray-400'}">${scalp}</span>
             </div>
             <div class="w-px bg-white/5"></div>
             <div class="flex-1 text-right">
                <span class="text-[8px] text-gray-500 block uppercase mb-1">RSI Status</span>
                <span class="font-black text-white">${rsi}</span>
             </div>
        </div>
    </div>`;
};
