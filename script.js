// Minimal JS: Google Sheet email collection only
document.addEventListener('DOMContentLoaded', function() {
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwpMjwxAOBju-Mcc-D0b1RUh2GSftZ5qErfHKl9pt4U2evNUVyVPTF34AGv7sc2-2e-Ww/exec';

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showNotification(message, type = 'info') {
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();
        const n = document.createElement('div');
        n.className = `notification notification-${type}`;
        n.textContent = message;
        document.body.appendChild(n);
        setTimeout(() => n.classList.add('show'), 100);
        setTimeout(() => { n.classList.remove('show'); setTimeout(() => n.remove(), 300); }, 4000);
    }

    async function submitEmail(form) {
        const emailInput = form.querySelector('input[name="email"]');
        const submitBtn = form.querySelector('.join-btn');
        const email = (emailInput?.value || '').trim();
        const source = form.getAttribute('data-source') || 'unknown';

        if (!email) { showNotification('Please enter your email address', 'error'); emailInput?.focus(); return; }
        if (!isValidEmail(email)) { showNotification('Please enter a valid email address', 'error'); emailInput?.focus(); return; }

        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Joining...'; }

        try {
            const params = new URLSearchParams({ email, source }).toString();
            // Fire-and-forget to avoid parsing/redirect quirks. If it doesn't throw, show success.
            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
                body: params,
                mode: 'no-cors',
                cache: 'no-store'
            });
            showNotification('🎉 Successfully joined the waitlist!', 'success');
            if (emailInput) emailInput.value = '';
        } catch (err) {
            console.error('Email submit error:', err);
            showNotification('Network error. Please check your connection.', 'error');
        } finally {
            if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Join Waitlist'; }
        }
    }

    document.querySelectorAll('.cta-form').forEach((form) => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            submitEmail(form);
        });
    });
});
