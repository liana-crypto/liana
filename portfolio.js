// portfolio.js - Elite Portfolio Management (Nayro Vex Edition)
export const initPortfolio = () => {
    const portfolioContainer = document.querySelector('#portfolio-section');
    let myAssets = JSON.parse(localStorage.getItem('nayro_assets')) || [];

    // 1. دالة إضافة عملة جديدة للمحفظة
    window.addAsset = (e) => {
        e.preventDefault();
        const symbolInput = document.querySelector('#asset-symbol');
        const amountInput = document.querySelector('#asset-amount');
        const priceInput = document.querySelector('#asset-price');

        // تنظيف المدخلات وتحويلها لـ USDT
        const symbol = symbolInput.value.toUpperCase().trim();
        const fullSymbol = symbol.endsWith('USDT') ? symbol : symbol + 'USDT';
        const amount = parseFloat(amountInput.value);
        const buyPrice = parseFloat(priceInput.value);

        if (fullSymbol && amount && buyPrice) {
            myAssets.push({ 
                id: Date.now(),
                symbol: fullSymbol, 
                amount, 
                buyPrice 
            });
            localStorage.setItem('nayro_assets', JSON.stringify(myAssets));
            renderPortfolio();
            e.target.reset();
        }
    };

    // 2. دالة حذف عملة من المحفظة
    window.deleteAsset = (id) => {
        myAssets = myAssets.filter(asset => asset.id !== id);
        localStorage.setItem('nayro_assets', JSON.stringify(myAssets));
        renderPortfolio();
    };

    // 3. دالة الرسم والتحديث اللحظي
    async function renderPortfolio() {
        if (myAssets.length === 0) {
            portfolioContainer.innerHTML = `
                <div class="text-center py-10 border border-dashed border-white/5 rounded-2xl">
                    <p class="text-gray-600 italic text-sm">محفظتك فارغة.. ابدأ بإضافة أولى صفقاتك!</p>
                </div>`;
            return;
        }

        try {
            const response = await fetch('https://api.binance.com/api/v3/ticker/price');
            const prices = await response.json();

            let totalValue = 0;
            let totalProfit = 0;

            const html = myAssets.map(asset => {
                const liveData = prices.find(p => p.symbol === asset.symbol);
                const currentPrice = liveData ? parseFloat(liveData.price) : 0;
                const currentValue = asset.amount * currentPrice;
                const profit = (currentPrice - asset.buyPrice) * asset.amount;
                const profitPercent = ((currentPrice - asset.buyPrice) / asset.buyPrice) * 100;

                totalValue += currentValue;
                totalProfit += profit;

                return `
                <div class="flex justify-between items-center p-4 bg-[#0a0a0a] border border-white/5 rounded-2xl mb-3 hover:border-cyan-500/30 transition-all group">
                    <div class="flex items-center gap-4">
                        <button onclick="deleteAsset(${asset.id})" class="text-gray-700 hover:text-red-500 transition-all">✕</button>
                        <div>
                            <div class="flex items-center gap-2">
                                <h4 class="font-bold text-white text-sm tracking-widest">${asset.symbol}</h4>
                                <button onclick="window.openAnalysis('${asset.symbol}')" 
                                        class="text-[9px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/20 hover:bg-cyan-500 hover:text-black transition-all font-black">
                                    ANALYZE
                                </button>
                            </div>
                            <p class="text-[9px] text-gray-500 font-mono mt-1 uppercase tracking-tighter">QTY: ${asset.amount} | AVG: $${asset.buyPrice}</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="font-black text-white">$${currentValue.toFixed(2)}</div>
                        <div class="text-[10px] font-bold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}">
                            ${profit >= 0 ? '▲' : '▼'} $${Math.abs(profit).toFixed(2)} (${profitPercent.toFixed(2)}%)
                        </div>
                    </div>
                </div>`;
            }).join('');

            portfolioContainer.innerHTML = `
                <div class="bg-gradient-to-r from-cyan-900/20 to-transparent p-6 rounded-2xl mb-6 border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.05)]">
                    <div class="flex justify-between items-end">
                        <div>
                            <span class="text-[9px] text-cyan-500 font-black uppercase tracking-[0.2em]">Live Net Worth</span>
                            <div class="text-4xl font-black text-white mt-1 leading-none">$${totalValue.toFixed(2)}</div>
                        </div>
                        <div class="text-right">
                            <span class="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em]">Total P/L</span>
                            <div class="text-xl font-black ${totalProfit >= 0 ? 'text-green-400' : 'text-red-400'} leading-none">
                                ${totalProfit >= 0 ? '+' : ''}$${totalProfit.toFixed(2)}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                    ${html}
                </div>
            `;
        } catch (error) {
            console.error("Portfolio Update Error");
        }
    }

    // تحديث البيانات كل 15 ثانية لمواكبة السوق
    setInterval(renderPortfolio, 15000);
    renderPortfolio();
};
