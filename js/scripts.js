// Load header, footer, and chatbot components
document.addEventListener('DOMContentLoaded', () => {
    const loadComponent = async (id, path) => {
        try {
            const res = await fetch(path);
            const html = await res.text();
            const host = document.getElementById(id);
            if (host) host.innerHTML = html;
        } catch (err) {
            console.error(`Error loading ${path}:`, err);
        }
    };

    loadComponent('header-placeholder', '/top-academy/components/header.html');
    loadComponent('footer-placeholder', '/top-academy/components/footer.html');

    // Inject chatbot widget globally if not already present
    (async () => {
        try {
            if (!document.getElementById('chatbot-widget')) {
                const res = await fetch('/top-academy/components/chatbot.html');
                const html = await res.text();
                const container = document.createElement('div');
                container.innerHTML = html;
                document.body.appendChild(container.firstElementChild);
            }
            // Ensure chatbot script loaded once
            const existing = Array.from(document.scripts).some(s => s.src.endsWith('/js/chatbot.js'));
            if (!existing) {
                const s = document.createElement('script');
                s.src = '/top-academy/js/chatbot.js';
                document.body.appendChild(s);
            }
        } catch (err) {
            console.error('Error injecting chatbot widget:', err);
        }
    })();
});