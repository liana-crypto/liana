// radar_final.js - The Ultra Edition (HOT/COLD Colors + Quick Fav)
export const initRadarV2 = (limit = 15, minVolume = 50000000) => {
    const radarContainer = document.querySelector('#alpha-radar');
    let favorites = JSON.parse(localStorage.getItem('nayro_favs')) || [];

    const getIcon = (symbol) => `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/${symbol.replace('USDT', '').toLowerCase()}.png`;

    // نظام الـ AI Score المتقدم
    function calculateAdvancedScore(change, vol, high, low, last) {
        let score = 50 + (change * 1.5);
        if (vol > 300000000) score += 10;
        const position = ((last - low) / (high - low)) * 100;
        if (position > 85) score += 10;
        return Math.min(Math.max(score, 5), 99).toFixed(0);
    }

    window.toggleFav = (e, symbol) => {
        e.stopPropagation(); // منع فتح التحليل عند الضغط على النجمة
        const index = favorites.indexOf(symbol);
        index > -1 ? favorites.splice(index, 1) : favorites.push(symbol);
        localStorage.setItem('nayro_favs', JSON.stringify(favorites));
        fetchMarketData(); 
    };

    async function fetchMarketData() {
        try {
            const response = await fetch('https://api.binance.com/api/v3/ticker/24hr');
            const data = await response.json();
            const activeCoins = data
                .filter(coin => coin.symbol.endsWith('USDT') && parseFloat(coin.quoteVolume) > minVolume)
                .sort((a, b) => b.priceChangePercent - a.priceChangePercent).slice(0, limit);
            renderRadar(activeCoins);
        } catch (error) { console.error("Radar Error"); }
    }

    function renderRadar(coins) {
        radarContainer.innerHTML = coins.map(coin => {
            const score = calculateAdvancedScore(parseFloat(coin.priceChangePercent), parseFloat(coin.quoteVolume), parseFloat(coin.highPrice), parseFloat(coin.lowPrice), parseFloat(coin.lastPrice));
            const isFav = favorites.includes(coin.symbol);
            
            // تحديد لون الخلفية حسب الـ Score (اقتراحك العبقري)
            const bgClass = score > 75 ? 'bg-cyan-950/20 border-cyan-500/20' : score > 50 ? 'bg-yellow-950/10 border-yellow-500/10' : 'bg-red-950/10 border-red-500/10';
            const scoreColor = score > 75 ? 'text-cyan-400' : score > 50 ? 'text-yellow-500' : 'text-red-500';

            return `
            <div onclick="window.openAnalysis('${coin.symbol}')" 
                 class="relative group p-4 mb-3 rounded-2xl border transition-all duration-300 active:scale-95 cursor-pointer overflow-hidden ${bgClass} hover:border-white/20">
                
                <div class="flex justify-between items-center relative z-10">
                    <div class="flex items-center gap-3">
                        <button onclick="window.toggleFav(event, '${coin.symbol}')" class="text-lg transition hover:scale-125 ${isFav ? 'text-yellow-400' : 'text-gray-700'}">
                            ${isFav ? '★' : '☆'}
                        </button>
                        
                        <img src="${getIcon(coin.symbol)}" onerror="this.src='https://via.placeholder.com/30/111/fff?text=${coin.symbol[0]}'" class="w-8 h-8 rounded-full">
                        
                        <div>
                            <h3 class="font-bold text-sm text-white">${coin.symbol}</h3>
                            <span class="text-[9px] font-mono text-gray-500">$${(parseFloat(coin.quoteVolume)/1000000).toFixed(1)}M Vol</span>
                        </div>
                    </div>

                    <div class="flex items-center gap-4">
                        <div class="text-right">
                            <div class="text-sm font-bold text-white tracking-tighter">$${parseFloat(coin.lastPrice)}</div>
                            <div class="text-[10px] ${coin.priceChangePercent >= 0 ? 'text-green-400' : 'text-red-400'} font-bold">${coin.priceChangePercent}%</div>
                        </div>
                        
                        <div class="flex flex-col items-center border-l border-white/5 pl-3">
                            <span class="text-[8px] text-gray-600 font-black uppercase">AI</span>
                            <span class="text-lg font-black ${scoreColor}">${score}</span>
                        </div>
                    </div>
                </div>
            </div>`;
        }).join('');
    }

    setInterval(fetchMarketData, 12000);
    fetchMarketData();
};
