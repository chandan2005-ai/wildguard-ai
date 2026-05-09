document.addEventListener('DOMContentLoaded', () => {
    // Splash
    setTimeout(() => {
        const splash = document.getElementById('splashScreen');
        const main = document.getElementById('mainApp');
        if (splash) splash.style.display = 'none';
        if (main) main.style.display = 'block';
    }, 2000);

    if (!localStorage.getItem('wildguard_user')) {
        window.location.href = '/login';
        return;
    }

    if (typeof loadSettings === 'function') loadSettings();
    if (typeof initMap === 'function') initMap();
    if (typeof initCharts === 'function') initCharts();

    const startBtn = document.getElementById('startCamBtn');
    const stopBtn = document.getElementById('stopCamBtn');
    if (startBtn) startBtn.addEventListener('click', startCamera);
    if (stopBtn) stopBtn.addEventListener('click', stopCamera);

    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const tabId = btn.dataset.tab;
            document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('show', 'active'));
            const target = document.getElementById(tabId);
            if (target) target.classList.add('show', 'active');
            if (tabId === 'historyTab' && typeof loadHistory === 'function') loadHistory();
            if (tabId === 'analyticsTab' && typeof refreshCharts === 'function') refreshCharts();
        });
    });

    setInterval(() => {
        const clock = document.getElementById('liveClock');
        if (clock) clock.textContent = new Date().toLocaleTimeString();
    }, 1000);

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/static/js/sw.js');
    }

    if (Notification.permission !== 'denied') {
        Notification.requestPermission();
    }

    if (typeof loadHistory === 'function') loadHistory();
});