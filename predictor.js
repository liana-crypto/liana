/**
 * NayroVex Prediction Engine v1.1
 * الفكرة السابعة: المحرك الديناميكي المطور
 */

export const calculateProbability = (rsi, fvg, trend, trendStrength = 1) => {
    let score = 50; // نقطة التعادل

    // 1. منطق الـ RSI (الزخم) - وزن 20%
    if (rsi < 30) score += 15;
    else if (rsi > 70) score -= 15;
    else if (rsi > 45 && rsi < 55) score += (trend === 'BULLISH' ? 5 : -5); // منطقة التذبذب تتبع الاتجاه

    // 2. منطق الـ FVG (السيولة) - وزن 40% (هو الأهم)
    if (fvg) {
        // إذا كان هناك فجوة تتفق مع الاتجاه، النسبة تزيد بقوة
        if (fvg.type === 'BULLISH') {
            score += (trend === 'BULLISH' ? 30 : 15);
        } else if (fvg.type === 'BEARISH') {
            score -= (trend === 'BEARISH' ? 30 : 15);
        }
    }

    // 3. منطق الاتجاه (Trend) - وزن 15%
    const trendMulti = trend === 'BULLISH' ? 10 : -10;
    score += (trendMulti * trendStrength);

    // حصر النتيجة بين 1% و 99%
    score = Math.max(1, Math.min(99, Math.round(score)));

    // تحديد حالة الثقة (Confidence Logic)
    let confidence = 'LOW';
    if (Math.abs(score - 50) > 15) confidence = 'MODERATE';
    if (Math.abs(score - 50) > 30) confidence = 'HIGH';

    return {
        probability: score,
        confidence: confidence,
        signal: getSignalName(score),
        color: score > 50 ? '#08f7ff' : '#ff3131'
    };
};

const getSignalName = (s) => {
    if (s >= 80) return 'ULTRA LONG';
    if (s >= 65) return 'SCALP LONG';
    if (s <= 20) return 'ULTRA SHORT';
    if (s <= 35) return 'SCALP SHORT';
    return 'WAIT / NEUTRAL';
};
