/* =========================================================
   sllyd — interactions
   Scroll-scrubbed logo lockup (giant -> navbar), pinned
   horizontal-scroll rooms, hero reveal, waitlist form.
   One rAF scroll loop, cached measures, reduced-motion safe.
   ========================================================= */

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzxs-08TbTLsvNo91lkhOiWU-_Bc0Z3nAPiLRF7R6a6J1ouUq1II2Hn-G0rgUomjMZL/exec';

document.addEventListener('DOMContentLoaded', () => {
    setYear();
    setupHeroReveal();
    setupScrollReveal();
    setupScrollEngine();
    setupForms();
});

/* ---------- helpers ---------- */
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

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
    } catch { return 'Unknown'; }
}

/* ---------- footer year ---------- */
function setYear() {
    const el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
}

/* ---------- hero word reveal (fires when the hero scrolls into view) ---------- */
function setupHeroReveal() {
    const title = document.querySelector('.hero-title');
    if (!title) return;
    const words = title.querySelectorAll('.reveal-word');
    words.forEach((w, i) => { w.style.transitionDelay = `${i * 120}ms`; });
    if (!('IntersectionObserver' in window)) {
        words.forEach(w => w.classList.add('in'));
        return;
    }
    const io = new IntersectionObserver((entries) => {
        entries.forEach(en => {
            if (en.isIntersecting) {
                words.forEach(w => w.classList.add('in'));
                io.disconnect();
            }
        });
    }, { threshold: 0.3 });
    io.observe(title);
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
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    items.forEach(el => io.observe(el));
}

/* ---------- unified scroll engine: logo morph + horizontal pin + nav/progress ---------- */
function setupScrollEngine() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const nav = document.querySelector('.nav');
    const progress = document.createElement('div');
    progress.className = 'scroll-progress';
    document.body.appendChild(progress);

    const logo = document.querySelector('[data-brand-logo]');
    const anchor = document.querySelector('.nav-logo-anchor');
    const announce = document.querySelector('.announce');
    const stageCue = document.querySelector('[data-stage-cue]');
    const hwrap = document.querySelector('[data-hscroll]');
    const htrack = document.querySelector('[data-htrack]');
    const docEl = document.documentElement;

    // per-letter geometry (fractions of the assembled logo box)
    const aspect = logo ? (parseFloat(logo.dataset.aspect) || 1.6148) : 1.6148;
    const geom = logo ? Array.from(logo.querySelectorAll('.brand-letter')).map(el => ({
        el,
        rcx: parseFloat(el.dataset.rcx), rcy: parseFloat(el.dataset.rcy),
        wf: parseFloat(el.dataset.wf), hf: parseFloat(el.dataset.hf),
        bigCx: 0, bigCy: 0, restCx: 0, restCy: 0, baseW: 0, baseH: 0,
    })) : [];
    const STAGGER = 0.05;

    // in reduced-motion, skip the morph entirely: show the assembled nav logo, drop the giant one
    if (reduce && logo) { logo.style.display = 'none'; if (anchor) anchor.style.visibility = 'visible'; }

    let vh = window.innerHeight, vw = window.innerWidth, maxScroll = 0;
    let morphReady = false, restScale = 1;
    let hStart = 0, hEnd = 0, hDist = 0;

    function measure() {
        vh = window.innerHeight; vw = window.innerWidth;
        maxScroll = docEl.scrollHeight - docEl.clientHeight;

        if (geom.length && anchor && !reduce) {
            const bigH = Math.min(vh * 0.60, (vw * 0.80) / aspect); // slightly smaller, balanced
            const bigW = bigH * aspect;
            const bigCx = vw / 2, bigCy = vh * 0.47;
            // park the tagline just below the big logo's bottom edge
            if (stageCue) stageCue.style.top = (bigCy + bigH / 2 + 28) + 'px';
            const ar = anchor.getBoundingClientRect();
            const announceH = announce ? announce.offsetHeight : 0;
            const restH = ar.height || 50;
            const restW = restH * aspect;
            const navCx = ar.left + ar.width / 2;
            const navCy = ar.top + ar.height / 2 - announceH; // banner scrolls away
            restScale = restH / bigH;
            geom.forEach(g => {
                g.baseW = bigW * g.wf; g.baseH = bigH * g.hf;
                g.bigCx = bigCx + (g.rcx - 0.5) * bigW;
                g.bigCy = bigCy + (g.rcy - 0.5) * bigH;
                g.restCx = navCx + (g.rcx - 0.5) * restW;
                g.restCy = navCy + (g.rcy - 0.5) * restH;
                g.el.style.width = g.baseW + 'px';
                g.el.style.height = g.baseH + 'px';
                g.el.style.opacity = '1';
            });
            morphReady = true;
        }
        if (hwrap && htrack && !reduce) {
            const rect = hwrap.getBoundingClientRect();
            hStart = rect.top + window.scrollY;
            hEnd = hStart + hwrap.offsetHeight - vh;
            hDist = Math.max(0, htrack.scrollWidth - vw);
        }
    }

    function render() {
        const y = window.scrollY;
        if (nav) nav.classList.toggle('scrolled', y > 8);
        progress.style.transform = `scaleX(${maxScroll > 0 ? y / maxScroll : 0})`;

        // per-letter morph: each letter scrubs from giant+centered to its navbar slot, staggered
        if (morphReady && !reduce) {
            const p = clamp(y / (vh * 0.78), 0, 1);
            const span = 1 - (geom.length - 1) * STAGGER;
            geom.forEach((g, i) => {
                const e = easeInOut(clamp((p - i * STAGGER) / span, 0, 1));
                const s = lerp(1, restScale, e);
                const cx = lerp(g.bigCx, g.restCx, e);
                const cy = lerp(g.bigCy, g.restCy, e);
                g.el.style.transform = `translate(${cx - g.baseW / 2}px, ${cy - g.baseH / 2}px) scale(${s})`;
            });
            if (stageCue) stageCue.style.opacity = String(clamp(1 - easeInOut(p) * 2.2, 0, 1));
        }

        // horizontal pin: vertical scroll drives horizontal panel travel
        if (htrack && !reduce && hEnd > hStart) {
            const hp = clamp((y - hStart) / (hEnd - hStart), 0, 1);
            htrack.style.transform = `translate3d(${-hp * hDist}px, 0, 0)`;
        }
        ticking = false;
    }

    let ticking = false;
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(render); } };

    measure();
    render();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => { measure(); render(); }, { passive: true });
    // re-measure once fonts/images have settled (layout can shift the pin offsets)
    window.addEventListener('load', () => { measure(); render(); });
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => { measure(); render(); });
    }
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
