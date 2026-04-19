import { router } from "@inertiajs/react";

const TOKEN_KEY = "jwt_token";
const EXPIRE_KEY = "token_expires_at";
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000; // PRODUCTION_VERSION_1.0.1

const TokenManager = {
    /**
     * Save token and set expiration timestamp (Updated to 24h)
     */
    setToken(token, expiresIn = TWENTY_FOUR_HOURS) {
        const expiresAt = Date.now() + expiresIn;
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(EXPIRE_KEY, expiresAt.toString());
    },

    /**
     * Get token if not expired, otherwise remove it
     */
    getToken() {
        if (this.isTokenExpired()) {
            this.logout(); // Langsung paksa logout (redirect) kalau sudah basi
            return null;
        }
        return localStorage.getItem(TOKEN_KEY);
    },

    /**
     * Remove token and expiration timestamp
     */
    removeToken() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(EXPIRE_KEY);
        // Optional: Trigger a page reload or Inertia visit to logout if on a protected page
    },

    /**
     * Check if token has passed the 24-hour mark
     */
    isTokenExpired() {
        const token = localStorage.getItem(TOKEN_KEY);
        const expiresAt = localStorage.getItem(EXPIRE_KEY);

        // Jika tidak ada token, anggap expired (harus login)
        if (!token || !expiresAt) return true;

        const now = Date.now();
        // Jika waktu sekarang sudah melewati waktu expired
        if (now > parseInt(expiresAt)) {
            return true;
        }

        return false;
    },

    /**
     * Force logout function
     * Clears local storage and redirects to the login page, 
     * ensuring session and JWT are both treated as invalid.
     */
    logout() {
        this.removeToken();
        // Gunakan Inertia router untuk logout beneran ke server
        // Supaya Session Laravel juga hancur dan tidak kena Redirect Loop
        router.post('/logout');
    },

    /**
     * Start background checker
     */
    startExpirationCheck() {
        // Cek tiap 5 detik apakah token sudah expired
        setInterval(() => {
            if (this.isTokenExpired() && localStorage.getItem(TOKEN_KEY)) {
                this.logout();
            }
        }, 5000);
    }
};

export default TokenManager;
