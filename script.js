/* =========================================================
   sllyd — minimal community waitlist
   Effects: hero word reveal, scroll reveals (IntersectionObserver),
   marquee handled in CSS, top-bar shadow on scroll, form submit
   to Google Apps Script.
   ========================================================= */

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzxs-08TbTLsvNo91lkhOiWU-_Bc0Z3nAPiLRF7R6a6J1ouUq1II2Hn-G0rgUomjMZL/exec';

document.addEventListener('DOMContentLoaded', () => {
    setYear();
    setupHeroReveal();
    setupScrollReveal();
    setupTopBarShadow();
    setupScrollProgress();
    setupForms();
});

/* ---------- helpers ---------- */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showNotification(message, type = 'success') {
    const n = document.createElement('div');
    n.className = `notification ${type === 'error' ? 'error' : ''}`;
    n.textContent = message;
    document.body.appendChild(n);
    requestAnimationFrame(() => n.classList.add('show'));
    setTimeout(() => {
        n.classList.remove('show');
        setTimeout(() => n.remove(), 400);
    }, 3200);
}

async function getIPAddress() {
    try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        return data.ip;
    } catch {
        return 'Unknown';
    }
}

/* ---------- footer year ---------- */
function setYear() {
    const el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
}

/* ---------- hero word reveal ---------- */
function setupHeroReveal() {
    const words = document.querySelectorAll('.hero-title .reveal-word');
    words.forEach((w, i) => {
        w.style.transitionDelay = `${80 + i * 70}ms`;
        // Use rAF so the initial state paints before the .in transition begins.
        requestAnimationFrame(() => requestAnimationFrame(() => w.classList.add('in')));
    });
}

/* ---------- scroll reveal ---------- */
function setupScrollReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
        items.forEach(el => el.classList.add('in'));
        return;
    }
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    items.forEach(el => io.observe(el));
}

/* ---------- top bar shadow ---------- */
function setupTopBarShadow() {
    const bar = document.querySelector('.top-bar');
    if (!bar) return;
    const onScroll = () => bar.classList.toggle('scrolled', window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
}

/* ---------- scroll progress ---------- */
function setupScrollProgress() {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);
    const update = () => {
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight;
        const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
        bar.style.width = pct + '%';
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
}

/* ---------- forms ---------- */
function setupForms() {
    const forms = document.querySelectorAll('.cta-form');
    forms.forEach(form => {
        const input = form.querySelector('.email-input');
        const button = form.querySelector('.join-btn');
        const source = form.dataset.source || 'unknown';

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = (input.value || '').trim();
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                input.focus();
                return;
            }

            const originalText = button.textContent;
            button.disabled = true;
            button.textContent = 'Joining…';

            try {
                const ip = await getIPAddress();
                const now = new Date();
                const clientTimestamp =
                    (now.getMonth() + 1) + '/' + now.getDate() + '/' + now.getFullYear() + ' ' +
                    now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0') + ':' + String(now.getSeconds()).padStart(2, '0');

                const params = new URLSearchParams();
                params.append('email', email);
                params.append('source', source);
                params.append('ip', ip);
                params.append('timestamp', clientTimestamp);
                params.append('userAgent', navigator.userAgent);

                await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
                    body: params.toString(),
                    cache: 'no-store',
                });

                showNotification('You\'re on the list. We\'ll be in touch.');
                input.value = '';
            } catch (err) {
                console.error('Waitlist submit error:', err);
                showNotification('Network error. Please try again.', 'error');
            } finally {
                button.disabled = false;
                button.textContent = originalText;
            }
        });
    });
}

