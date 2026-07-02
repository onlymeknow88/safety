export const DASHBOARD_PALETTE = [
    '#3b82f6', // Blue (Notifikasi)
    '#10b981', // Emerald (LPKS)
    '#8b5cf6', // Violet (LPKL)
    '#ef4444', // Red (PICA Open / Danger)
    '#f59e0b', // Amber (Warning)
    '#06b6d4', // Cyan (Info)
    '#ec4899', // Pink (Secondary Danger)
    '#14b8a6', // Teal
    '#f97316', // Orange
    '#84cc16', // Lime
    '#a855f7', // Purple
    '#6366f1', // Indigo
];

export const STATUS_COLORS = {
    green: {
        light: '#10b981',
        dark: '#34d399',
        bgLight: '#ecfdf5',
        bgDark: '#064e3b',
    },
    red: {
        light: '#ef4444',
        dark: '#f87171',
        bgLight: '#fef2f2',
        bgDark: '#7f1d1d',
    },
    blue: {
        light: '#3b82f6',
        dark: '#60a5fa',
        bgLight: '#eff6ff',
        bgDark: '#1e3a8a',
    },
    amber: {
        light: '#f59e0b',
        dark: '#fbbf24',
        bgLight: '#fffbeb',
        bgDark: '#78350f',
    },
    neutral: {
        light: '#6b7280',
        dark: '#9ca3af',
        bgLight: '#f9fafb',
        bgDark: '#374151',
    }
};

export const CARD_STYLE_PRESETS = (isDarkMode) => ({
    background: isDarkMode ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(12px)',
    border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
    borderRadius: '16px',
    boxShadow: isDarkMode 
        ? '0 4px 30px rgba(0, 0, 0, 0.2)' 
        : '0 4px 30px rgba(0, 0, 0, 0.03)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
});
