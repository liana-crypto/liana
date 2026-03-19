/**
 * NayroVex Projects Radar v1.0
 * القسم النهائي: تحليل المشاريع، السيولة، وبيانات المطورين
 */

// قائمة المشاريع المختارة للمتابعة (يمكنك تغييرها أو جعلها ديناميكية)
const PROJECTS_LIST = ['solana', 'polkadot', 'cardano', 'avalanche-2', 'near', 'chainlink'];

export const initProjectsRadar = () => {
    const container = document.querySelector('#projects-list');
    if (!container) return;

    console.log("%c 🛰️ NX-PROJECTS: Intelligence Hub Active", "color: #eab308; font-weight: bold;");

    // تحديث بيانات المشاريع (كل 60 ثانية لأن بيانات CoinGecko لا تتغير بسرعة)
    updateProjectsUI();
    setInterval(updateProjectsUI, 60000);
};

async function updateProjectsUI() {
    const container = document.querySelector('#projects-list');
    
    for (const coinId of PROJECTS_LIST) {
        try {
            // 1. جلب البيانات العميقة من CoinGecko API
            const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&community_data=false&developer_data=true&sparkline=false`);
            const data = await response.json();

            renderProjectCard(data, container);
        } catch (err) {
            console.error(`Project Error [${coinId}]:`, err);
        }
    }
}

const renderProjectCard = (data, container) => {
    const symbol = data.symbol.toUpperCase();
    const price = data.market_data.current_price.usd;
    const change24h = data.market_data.price_change_percentage_24h;
    const liquidity = data.market_data.total_volume.usd;
    
    // تقييم السيولة (كما وضعت في القواعد)
    let liqStatus = "Low";
    if (liquidity > 50000000) liqStatus = "High";
    else if (liquidity > 10000000) liqStatus = "Medium";

    let item = document.getElementById(`project-${data.id}`);
    if (!item) {
        item = document.createElement('div');
        item.id = `project-${data.id}`;
        item.className = "project-card glass p-4 rounded-3xl border border-white/5 mb-4 transition-all hover:border-yellow-500/30";
        container.appendChild(item);
    }

    item.innerHTML = `
        <div class="flex justify-between items-start mb-3">
            <div>
                <h3 class="text-sm font-black text-white uppercase">${data.name} (${symbol})</h3>
                <span class="text-[7px] font-black text-yellow-500 tracking-widest uppercase italic">Sector: ${data.categories[0] || 'Blockchain'}</span>
            </div>
            <div class="text-right">
                <span class="text-xs font-mono font-bold text-white">$${price.toLocaleString()}</span>
                <div class="text-[8px] font-black ${change24h >= 0 ? 'text-green-400' : 'text-red-400'}">
                    ${change24h >= 0 ? '↗' : '↘'} ${change24h.toFixed(2)}%
                </div>
            </div>
        </div>

        <div class="bg-white/[0.02] rounded-2xl p-3 border border-white/5 mb-3">
            <div class="flex justify-between items-center mb-2">
                <span class="text-[7px] font-black text-gray-500 uppercase italic">Dev Activity (GitHub)</span>
                <span class="text-[8px] font-black text-cyan-400 underline italic">Commits: ${data.developer_data.commits_last_4_weeks || 0}</span>
            </div>
            <div class="text-[8px] text-gray-400 leading-relaxed">
                Stars: ${data.developer_data.stars} | Forks: ${data.developer_data.forks}
            </div>
        </div>

        <div class="grid grid-cols-2 gap-4 text-[7px] font-black uppercase tracking-tighter mb-3">
            <div class="flex flex-col">
                <span class="text-gray-600 mb-1">Liquidity (24h)</span>
                <span class="${liqStatus === 'High' ? 'text-green-400' : 'text-yellow-400'} italic">$${(liquidity / 1e6).toFixed(1)}M (${liqStatus})</span>
            </div>
            <div class="flex flex-col text-right">
                <span class="text-gray-600 mb-1">Market Cap Rank</span>
                <span class="text-white">RANK #${data.market_cap_rank}</span>
            </div>
        </div>

        <div class="flex gap-3 pt-3 border-t border-white/5">
            <a href="${data.links.homepage[0]}" target="_blank" class="text-[7px] font-black text-cyan-400 hover:text-white transition-colors uppercase">Website</a>
            <a href="${data.links.repos_url.github[0]}" target="_blank" class="text-[7px] font-black text-gray-500 hover:text-white transition-colors uppercase">GitHub</a>
            <a href="https://twitter.com/${data.links.twitter_screen_name}" target="_blank" class="text-[7px] font-black text-gray-500 hover:text-white transition-colors uppercase">Twitter</a>
        </div>
    `;
};
