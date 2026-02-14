(function () {
    var STORAGE_KEY = 'portfolio-theme';

    function getStoredTheme() {
        try {
            return localStorage.getItem(STORAGE_KEY);
        } catch (e) {
            return null;
        }
    }

    function setStoredTheme(theme) {
        try {
            if (theme) localStorage.setItem(STORAGE_KEY, theme);
            else localStorage.removeItem(STORAGE_KEY);
        } catch (e) {}
    }

    function getSystemPreference() {
        if (typeof window.matchMedia !== 'function') return null;
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }

    function applyTheme(theme) {
        var doc = document.documentElement;
        if (theme === 'light') {
            doc.setAttribute('data-theme', 'light');
        } else {
            doc.removeAttribute('data-theme');
            doc.setAttribute('data-theme', 'dark');
        }
    }

    function initTheme() {
        var theme = getStoredTheme();
        if (!theme) theme = getSystemPreference() || 'dark';
        applyTheme(theme);
        updateToggleLabel(theme);
    }

    function updateToggleLabel(theme) {
        var btn = document.getElementById('theme-toggle-btn');
        if (!btn) return;
        btn.setAttribute('aria-label', theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
        btn.textContent = theme === 'light' ? '\u263D' : '\u263C';
    }

    function toggleTheme() {
        var current = document.documentElement.getAttribute('data-theme');
        var next = current === 'light' ? 'dark' : 'light';
        applyTheme(next);
        setStoredTheme(next);
        updateToggleLabel(next);
    }

    document.addEventListener('DOMContentLoaded', function () {
        initTheme();
        var btn = document.getElementById('theme-toggle-btn');
        if (btn) btn.addEventListener('click', toggleTheme);
    });
})();
