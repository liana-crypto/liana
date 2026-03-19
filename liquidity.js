/**
 * NayroVex Liquidity Engine v1.2
 * الفكرة الخامسة: الربط التلقائي مع UltraLogic Analyzer
 */

// 1. الخوارزمية الأساسية لكشف الفجوات
export const detectFVG = (klines) => {
    if (klines.length < 3) return null;
    const c1 = klines[klines.length - 3];
    const c3 = klines[klines.length - 1];
    const h1 = parseFloat(c1[2]), l1 = parseFloat(c1[3]);
    const h3 = parseFloat(c3[2]), l3 = parseFloat(c3[3]);

    if (l3 > h1) return { type: 'BUY', label: 'Demand Gap', zone: `${h1}-${l3}`, size: (l3-h1).toFixed(2) };
    if (h3 < l1) return { type: 'SELL', label: 'Supply Gap', zone: `${h3}-${l1}`, size: (l1-h3).toFixed(2) };
    return null;
};

// 2. المحرك المدمج (The Auto-Connector)
// هذه الدالة تستدعيها داخل الـ Analyzer Loop
export const processLiquidityLogic = (klines, symbol) => {
    const fvg = detectFVG(klines);
    const analyzerUI = document.querySelector('#fvg-display-zone'); // منطقة مخصصة في واجهة المحلل

    if (!fvg) {
        if(analyzerUI) analyzerUI.innerHTML = `<span class="opacity-20 text-[8px]">MARKET BALANCED</span>`;
        return;
    }

    // أ- عرض البيانات على الـ Analyzer
    if (analyzerUI) {
        analyzerUI.innerHTML = `
            <div class="animate-fade border-l-2 ${fvg.type === 'BUY' ? 'border-cyan-500' : 'border-red-500'} pl-2">
                <div class="text-[9px] font-black text-white">${fvg.label}</div>
                <div class="text-[7px] text-gray-500 font-mono italic">Zone: ${fvg.zone} | Δ: ${fvg.size}</div>
            </div>
        `;
    }

    // ب- إطلاق النبض + الصوت تلقائياً عبر Window
    // نتحقق من وجود الدالة قبل استدعائها لمنع الـ Errors
    if (typeof window.triggerPulse === 'function') {
        window.triggerPulse(fvg.type); 
    } else {
        console.warn("⚠️ triggerPulse not found on window. check notifications.js");
    }

    // ج- إرسال إشعار للنظام (Console Log ملون)
    console.log(`%c ⚡ NX-ENGINE: ${fvg.label} DETECTED ON ${symbol}`, `color: ${fvg.type === 'BUY' ? '#08f7ff' : '#ff3131'}; font-weight: bold;`);
};
