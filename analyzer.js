<!DOCTYPE html>  <html lang="ar" dir="rtl">  
<head>  
    <meta charset="UTF-8">  
    <meta name="viewport" content="width=device-width, initial-scale=1.0">  
    <title>NayroVex Ultra Terminal | Final Edition</title>  
    <script src="https://cdn.tailwindcss.com"></script>  
    <style>  
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;900&family=JetBrains+Mono:wght@500&display=swap');  
        :root { --neon-cyan: #08f7ff; --neon-green: #39ff14; --neon-red: #ff3131; }  
        body { background: #020202; color: #e5e7eb; font-family: 'Inter', sans-serif; overflow-x: hidden; }  
        .glass { background: rgba(10, 10, 10, 0.8); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.05); }  
        .neon-text-cyan { text-shadow: 0 0 10px rgba(8, 247, 255, 0.5); }  
        .custom-scroll::-webkit-scrollbar { width: 3px; }  
        .custom-scroll::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 10px; }  
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: var(--neon-cyan); }  
        @keyframes scan { 0% { top: 0; } 100% { top: 100%; } }  
        .scanner { height: 2px; background: linear-gradient(to bottom, transparent, var(--neon-cyan), transparent); position: absolute; width: 100%; animation: scan 3s linear infinite; opacity: 0.2; }  
    </style>  
</head>  
<body class="selection:bg-cyan-500/30">  <header class="border-b border-white/5 bg-black/90 sticky top-0 z-[100] px-6 py-4 backdrop-blur-md">  
    <div class="max-w-[1700px] mx-auto flex justify-between items-center">  
        <div class="flex items-center gap-4">  
            <div class="w-12 h-12 bg-cyan-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(8,247,255,0.3)]">  
                <span class="font-black text-black text-2xl tracking-tighter">NX</span>  
            </div>  
            <div>  
                <h1 class="text-xl font-black tracking-tighter uppercase italic leading-none">Ultra <span class="text-cyan-400">Terminal</span></h1>  
                <p class="text-[8px] font-mono text-gray-500 uppercase tracking-[0.4em] mt-1">2026 Core v2.0</p>  
            </div>  
        </div>  
          
        <div class="flex gap-4">  
            <button onclick="exportPortfolio()" class="text-[9px] border border-white/10 px-3 py-1.5 rounded-lg hover:bg-white/5 transition font-black uppercase tracking-widest text-gray-400">Export JSON</button>  
            <div class="hidden md:flex items-center gap-2 text-[10px] font-mono text-cyan-500 bg-cyan-500/5 px-4 py-1.5 rounded-full border border-cyan-500/20">  
                <span class="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></span> SYSTEM_LIVE  
            </div>  
        </div>  
    </div>  
</header>  

<main class="max-w-[1700px] mx-auto p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">  
      
    <aside class="lg:col-span-3 space-y-4">  
        <div class="flex justify-between items-center px-2">  
            <h2 class="text-xs font-black text-gray-500 uppercase tracking-[0.3em]">Alpha Radar</h2>  
            <span id="radar-count" class="text-[10px] text-cyan-500 font-mono">--</span>  
        </div>  
        <div id="radar-list" class="h-[82vh] overflow-y-auto custom-scroll pr-2 space-y-3">  
            </div>  
    </aside>  

    <section class="lg:col-span-5 space-y-8">  
        <div id="analyzer-view" class="glass rounded-[2.5rem] min-h-[400px] relative overflow-hidden flex flex-col items-center justify-center p-8 border-cyan-500/10">  
            <div class="scanner"></div>  
            <div class="opacity-20 text-6xl mb-4">🛰️</div>  
            <h3 class="text-gray-600 font-black uppercase tracking-widest text-sm">Waiting for Target Selection</h3>  
        </div>  

        <div class="glass p-6 rounded-[2rem] border-white/5">  
            <h4 class="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Market Sentiment Index</h4>  
            <div class="flex gap-2 h-2 rounded-full overflow-hidden bg-white/5">  
                <div id="bull-bar" class="bg-green-500 transition-all duration-1000" style="width: 50%"></div>  
                <div id="bear-bar" class="bg-red-500 transition-all duration-1000" style="width: 50%"></div>  
            </div>  
            <div class="flex justify-between mt-2 font-mono text-[9px] font-bold">  
                <span class="text-green-500 uppercase">Bullish</span>  
                <span class="text-red-500 uppercase">Bearish</span>  
            </div>  
        </div>  
    </section>  

    <aside class="lg:col-span-4 space-y-6">  
        <div class="glass p-8 rounded-[2.5rem] border-white/5 shadow-2xl">  
            <h3 class="text-lg font-black text-white uppercase italic tracking-tighter mb-6">Spot Assets</h3>  
              
            <form onsubmit="addAsset(event)" class="grid grid-cols-3 gap-2 mb-8">  
                <input id="p-sym" type="text" placeholder="COIN" class="bg-black/50 border border-white/5 p-3 rounded-xl text-[10px] text-white font-bold uppercase outline-none focus:border-cyan-500">  
                <input id="p-qty" type="number" step="any" placeholder="Qty" class="bg-black/50 border border-white/5 p-3 rounded-xl text-[10px] text-white outline-none focus:border-cyan-500">  
                <button type="submit" class="bg-white text-black font-black rounded-xl text-[9px] uppercase hover:bg-cyan-400 transition">Add</button>  
            </form>  

            <div id="portfolio-list" class="space-y-3 max-h-[50vh] overflow-y-auto custom-scroll pr-2"></div>  

            <div id="portfolio-summary" class="mt-8 pt-6 border-t border-white/5">  
                </div>  
        </div>  
    </aside>  
</main>  

<script>  
    /* --- CORE SYSTEM LOGIC --- */  
    let assets = JSON.parse(localStorage.getItem('nx_portfolio')) || [];  
      
    // 1. RADAR SYSTEM  
    const initRadar = async () => {  
        try {  
            const res = await fetch('https://api.binance.com/api/v3/ticker/24hr');  
            const data = await res.json();  
            const coins = data.filter(c => c.symbol.endsWith('USDT') && parseFloat(c.quoteVolume) > 50000000)  
                              .sort((a,b) => b.priceChangePercent - a.priceChangePercent).slice(0, 20);  
              
            document.querySelector('#radar-count').innerText = `${coins.length} ACTIVE`;  
              
            const list = document.querySelector('#radar-list');  
            list.innerHTML = coins.map(c => {  
                const change = parseFloat(c.priceChangePercent);  
                const score = Math.min(Math.max(50 + (change * 1.5), 10), 99).toFixed(0);  
                const color = score > 70 ? 'text-cyan-400' : score > 40 ? 'text-yellow-500' : 'text-red-500';  
                const icon = `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/${c.symbol.replace('USDT', '').toLowerCase()}.png`;  

                return `  
                <div onclick="analyze('${c.symbol}')" class="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 transition-all cursor-pointer group flex justify-between items-center">  
                    <div class="flex items-center gap-3">  
                        <img src="${icon}" onerror="this.src='https://via.placeholder.com/30/111/fff?text=${c.symbol[0]}'" class="w-8 h-8 rounded-full">  
                        <div>  
                            <h4 class="text-xs font-black text-white">${c.symbol}</h4>  
                            <span class="text-[8px] text-gray-600 font-mono italic">$${(parseFloat(c.quoteVolume)/1000000).toFixed(0)}M Vol</span>  
                        </div>  
                    </div>  
                    <div class="text-right flex items-center gap-4">  
                        <div>  
                            <div class="text-[10px] font-bold text-white tracking-tighter">$${parseFloat(c.lastPrice)}</div>  
                            <div class="text-[9px] ${change >= 0 ? 'text-green-500' : 'text-red-500'} font-black">${change}%</div>  
                        </div>  
                        <div class="border-l border-white/5 pl-3">  
                            <span class="${color} text-lg font-black italic neon-text-cyan">${score}</span>  
                        </div>  
                    </div>  
                </div>`;  
            }).join('');  

            // Update Sentiment  
            const bulls = coins.filter(c => parseFloat(c.priceChangePercent) > 0).length;  
            const bullPct = (bulls / coins.length) * 100;  
            document.querySelector('#bull-bar').style.width = bullPct + '%';  
            document.querySelector('#bear-bar').style.width = (100 - bullPct) + '%';  

        } catch(e) { console.error("Radar Offline"); }  
    };  

    // 2. ANALYZER SYSTEM  
    window.analyze = async (symbol) => {  
        const view = document.querySelector('#analyzer-view');  
        view.innerHTML = `<div class="p-20 text-cyan-500 font-mono text-[10px] animate-pulse tracking-[0.5em] uppercase">Deep Scan Initialized: ${symbol}</div>`;  
          
        try {  
            const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1h&limit=50`);  
            const k = await res.json();  
            const prices = k.map(c => parseFloat(c[4]));  
            const current = prices[prices.length-1];  

            // Simple RSI  
            let g = 0, l = 0;  
            for(let i=1; i<prices.length; i++) {  
                let d = prices[i]-prices[i-1];  
                d >= 0 ? g += d : l -= d;  
            }  
            const rsi = (100 - (100 / (1 + (g/l)))).toFixed(2);  
            const trend = current > prices[0] ? "BULLISH" : "BEARISH";  
              
            view.innerHTML = `  
            <div class="w-full h-full p-10 animate-fade relative z-10">  
                <div class="flex justify-between items-start mb-12">  
                    <div>  
                        <h2 class="text-6xl font-black text-white italic tracking-tighter">${symbol}</h2>  
                        <p class="text-2xl text-cyan-400 font-mono font-black mt-2">$${current}</p>  
                    </div>  
                    <div class="text-right">  
                        <span class="text-[9px] text-gray-600 font-black uppercase tracking-widest">Signal Status</span>  
                        <div class="text-2xl font-black ${rsi < 35 ? 'text-green-500' : rsi > 70 ? 'text-red-500' : 'text-yellow-500'} italic">${rsi < 35 ? 'STRONG BUY' : rsi > 70 ? 'OVERBOUGHT' : 'ACCUMULATE'}</div>  
                    </div>  
                </div>  
                <div class="grid grid-cols-2 gap-4">  
                    <div class="bg-white/[0.03] p-6 rounded-3xl border border-white/5 text-center">  
                        <span class="text-[8px] text-gray-600 block mb-2 uppercase font-black">RSI Strength</span>  
                        <span class="text-3xl font-black text-white">${rsi}</span>  
                    </div>  
                    <div class="bg-white/[0.03] p-6 rounded-3xl border border-white/5 text-center">  
                        <span class="text-[8px] text-gray-600 block mb-2 uppercase font-black">Market Trend</span>  
                        <span class="text-3xl font-black ${trend === 'BULLISH' ? 'text-green-500' : 'text-red-500'}">${trend}</span>  
                    </div>  
                </div>  
                <button onclick="window.open('https://www.tradingview.com/chart/?symbol=BINANCE:${symbol}')" class="w-full mt-8 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] transition border border-white/5">Launch TV Chart</button>  
            </div>`;  
              
            if(window.innerWidth < 1024) view.scrollIntoView({behavior: 'smooth'});  
        } catch(e) { view.innerHTML = "Analysis Error"; }  
    };  

    // 3. PORTFOLIO SYSTEM  
    window.addAsset = (e) => {  
        e.preventDefault();  
        const s = document.querySelector('#p-sym').value.toUpperCase().trim();  
        const q = parseFloat(document.querySelector('#p-qty').value);  
        if(s && q) {  
            assets.push({symbol: s.endsWith('USDT') ? s : s+'USDT', qty: q, buyPrice: 0});  
            localStorage.setItem('nx_portfolio', JSON.stringify(assets));  
            renderPortfolio(); e.target.reset();  
        }  
    };  

    const renderPortfolio = async () => {  
        const list = document.querySelector('#portfolio-list');  
        const summary = document.querySelector('#portfolio-summary');  
        if(assets.length === 0) { list.innerHTML = `<p class="text-center py-10 text-gray-700 text-[10px] uppercase font-bold italic tracking-widest">No Assets Tracked</p>`; return; }  

        const res = await fetch('https://api.binance.com/api/v3/ticker/price');  
        const prices = await res.json();  
        let totalVal = 0;  

        list.innerHTML = assets.map((a, idx) => {  
            const live = parseFloat(prices.find(p => p.symbol === a.symbol)?.price || 0);  
            const val = a.qty * live;  
            totalVal += val;  
            return `  
            <div class="flex justify-between items-center p-4 bg-white/[0.02] border border-white/5 rounded-2xl group">  
                <div class="flex items-center gap-3">  
                    <button onclick="removeAsset(${idx})" class="text-gray-800 hover:text-red-500 transition">✕</button>  
                    <div>  
                        <h4 class="text-[11px] font-black text-white">${a.symbol}</h4>  
                        <p class="text-[8px] text-gray-600 font-mono">QTY: ${a.qty}</p>  
                    </div>  
                </div>  
                <div class="text-right">  
                    <div class="text-[11px] font-black text-white">$${val.toFixed(2)}</div>  
                    <button onclick="analyze('${a.symbol}')" class="text-[7px] text-cyan-500 font-black uppercase tracking-tighter hover:text-white transition">Quick Scan</button>  
                </div>  
            </div>`;  
        }).join('');  

        summary.innerHTML = `  
            <div class="flex justify-between items-end">  
                <div>  
                    <span class="text-[8px] text-gray-500 font-black uppercase tracking-[0.2em]">Net Worth</span>  
                    <div class="text-3xl font-black text-white italic tracking-tighter leading-none mt-1">$${totalVal.toFixed(2)}</div>  
                </div>  
                <div class="w-10 h-10 bg-cyan-500/10 rounded-full flex items-center justify-center text-cyan-500 text-xs">₿</div>  
            </div>`;  
    };  

    window.removeAsset = (idx) => { assets.splice(idx, 1); localStorage.setItem('nx_portfolio', JSON.stringify(assets)); renderPortfolio(); };  
    window.exportPortfolio = () => {  
        const blob = new Blob([JSON.stringify(assets)], {type: 'application/json'});  
        const url = URL.createObjectURL(blob);  
        const a = document.createElement('a'); a.href = url; a.download = 'nayrovex_portfolio.json'; a.click();  
    };  

    // START ENGINE  
    initRadar(); renderPortfolio();  
    setInterval(initRadar, 20000);  
    setInterval(renderPortfolio, 30000);  

</script>

</body>  
</html>  
