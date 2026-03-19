/**
 * NayroVex Spot Analyst - Fixed Edition for GitHub Pages
 */

const SPOT_WATCHLIST = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT'];

export const initSpotCoinsAnalyzer = async () => {
    const container = document.querySelector('#spot-list');
    if (!container) return;

    console.log("Starting Spot Core...");

    const fetchData = async () => {
        for (const symbol of SPOT_WATCHLIST) {
            try {
                // استخدام AllOrigins لتجاوز حظر CORS
                const targetUrl = encodeURIComponent(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);
                const response = await fetch(`https://api.allorigins.win/get?url=${targetUrl}`);
                const json = await response.json();
                const data = JSON.parse(json.contents);

                renderCard(symbol, data, container);
            } catch (e) {
                console.error("Fetch Error:", e);
            }
        }
    };

    fetchData();
    setInterval(fetchData, 30000); // تحديث كل 30 ثانية
};

const renderCard = (symbol, data, container) => {
    let card = document.getElementById(`spot-${symbol}`);
    if (!card) {
        card = document.createElement('div');
        card.id = `spot-${symbol}`;
        card.className = "glass p-4 rounded-2xl border border-white/5 mb-3 transition-all hover:border-cyan-500/30";
        container.appendChild(card);
    }

    const price = parseFloat(data.lastPrice).toLocaleString();
    const change = parseFloat(data.priceChangePercent).toFixed(2);
    const isUp = change >= 0;

    card.innerHTML = `
        <div class="flex justify-between items-center">
            <div>
                <h3 class="text-[10px] font-black text-white">${symbol}</h3>
                <p class="text-[8px] text-gray-500">Vol: ${(parseFloat(data.quoteVolume)/1000000).toFixed(2)}M</p>
            </div>
            <div class="text-right">
                <div class="text-[10px] font-mono font-bold text-white">$${price}</div>
                <div class="text-[8px] font-black ${isUp ? 'text-green-400' : 'text-red-400'}">
                    ${isUp ? '↗' : '↘'} ${change}%
                </div>
            </div>
        </div>
    `;
};
