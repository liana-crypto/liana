/**
 * NayroVex Smart Notifications Engine
 * الفكرة الرابعة: نظام التنبيهات والنبض البصري
 */

// 1. حقن كود الـ CSS (النبض) الذي أعطيتني إياه تلقائياً في الصفحة
const injectPulseCSS = () => {
    const style = document.createElement('style');
    style.innerHTML = `
        /* نبض السيان للفرص الصاعدة */
        @keyframes pulse-cyan {
            0% { box-shadow: 0 0 0 0 rgba(8, 247, 255, 0.4); }
            70% { box-shadow: 0 0 0 15px rgba(8, 247, 255, 0); }
            100% { box-shadow: 0 0 0 0 rgba(8, 247, 255, 0); }
        }

        /* نبض أحمر للتحذير من الهبوط */
        @keyframes pulse-red {
            0% { box-shadow: 0 0 0 0 rgba(255, 49, 49, 0.4); }
            70% { box-shadow: 0 0 0 15px rgba(255, 49, 49, 0); }
            100% { box-shadow: 0 0 0 0 rgba(255, 49, 49, 0); }
        }

        .alert-buy { animation: pulse-cyan 2s infinite !important; border: 1px solid #08f7ff !important; }
        .alert-sell { animation: pulse-red 2s infinite !important; border: 1px solid #ff3131 !important; }
    `;
    document.head.appendChild(style);
};

// تشغيل حقن الستايل فور تحميل الملف
injectPulseCSS();

// 2. وظيفة تشغيل الصوت (Web Audio API)
export const playAlert = (type) => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    if (type === 'SUCCESS') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
    } else {
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
    }

    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.5);
};

// 3. وظيفة تفعيل النبض البصري على الـ Analyzer
export const triggerPulse = (type) => {
    const view = document.querySelector('#analyzer-view');
    if (!view) return;

    view.classList.remove('alert-buy', 'alert-sell');

    if (type === 'BUY') {
        view.classList.add('alert-buy');
        playAlert('SUCCESS');
    } else if (type === 'SELL') {
        view.classList.add('alert-sell');
        playAlert('WARNING');
    }
};
