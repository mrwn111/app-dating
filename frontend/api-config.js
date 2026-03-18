/* ===================================
   API CONFIGURATION
   =================================== */

// À customiser selon ton environnement
const CONFIG = {
    // URLs API
    API_BASE_URL: process.env.API_URL || 'http://localhost:5000/api',
    
    // Endpoints
    AUTH: {
        LOGIN: '/auth/login',
        SIGNUP: '/auth/signup',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh'
    },
    
    PROFILES: {
        LIST: '/profiles',
        GET: '/profiles/:id',
        UPDATE: '/profiles/:id',
        UPLOAD_PHOTO: '/profiles/:id/photo'
    },
    
    MATCHES: {
        CREATE: '/matches',
        LIST: '/matches',
        GET: '/matches/:id',
        DELETE: '/matches/:id'
    },
    
    MESSAGES: {
        LIST: '/messages',
        CREATE: '/messages',
        GET: '/messages/:id',
        READ: '/messages/:id/read'
    },
    
    // Timeouts
    TIMEOUT: 30000, // 30 secondes
    
    // Retry
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000,
    
    // Token
    TOKEN_KEY: 'brainrot_token',
    USER_KEY: 'brainrot_user',
    
    // Debug
    DEBUG: true
};

/* ===================================
   API CLIENT
   =================================== */

class APIClient {
    constructor(config) {
        this.config = config;
        this.token = localStorage.getItem(config.TOKEN_KEY);
    }
    
    /**
     * Effectue une requête HTTP avec gestion des erreurs
     */
    async request(endpoint, options = {}) {
        const url = `${this.config.API_BASE_URL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };
        
        // Ajouter le token si disponible
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        const fetchOptions = {
            method: options.method || 'GET',
            headers,
            ...options
        };
        
        // Ajouter le body si c'est un POST/PUT/PATCH
        if (options.body && typeof options.body === 'object') {
            fetchOptions.body = JSON.stringify(options.body);
        }
        
        try {
            const response = await fetch(url, fetchOptions);
            
            // Si 401, token expiré
            if (response.status === 401) {
                this.clearToken();
                // Rediriger vers login
                window.location.href = '/';
                throw new Error('Session expirée');
            }
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Erreur serveur');
            }
            
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
    
    /**
     * Sauvegarde le token JWT
     */
    setToken(token) {
        this.token = token;
        localStorage.setItem(this.config.TOKEN_KEY, token);
    }
    
    /**
     * Supprime le token
     */
    clearToken() {
        this.token = null;
        localStorage.removeItem(this.config.TOKEN_KEY);
        localStorage.removeItem(this.config.USER_KEY);
    }
    
    // ===== AUTH ENDPOINTS =====
    
    async login(email, password) {
        const response = await this.request(this.config.AUTH.LOGIN, {
            method: 'POST',
            body: { email, password }
        });
        this.setToken(response.token);
        return response;
    }
    
    async signup(userData) {
        const response = await this.request(this.config.AUTH.SIGNUP, {
            method: 'POST',
            body: userData
        });
        this.setToken(response.token);
        return response;
    }
    
    async logout() {
        try {
            await this.request(this.config.AUTH.LOGOUT, { method: 'POST' });
        } finally {
            this.clearToken();
        }
    }
    
    // ===== PROFILES ENDPOINTS =====
    
    async getProfiles(filters = {}) {
        const params = new URLSearchParams(filters);
        return this.request(`${this.config.PROFILES.LIST}?${params}`);
    }
    
    async getProfile(id) {
        return this.request(this.config.PROFILES.GET.replace(':id', id));
    }
    
    async updateProfile(id, data) {
        return this.request(this.config.PROFILES.UPDATE.replace(':id', id), {
            method: 'PUT',
            body: data
        });
    }
    
    async uploadPhoto(id, file) {
        const formData = new FormData();
        formData.append('photo', file);
        
        return this.request(this.config.PROFILES.UPLOAD_PHOTO.replace(':id', id), {
            method: 'POST',
            body: formData,
            headers: {} // Laisser le navigateur gérer Content-Type
        });
    }
    
    // ===== MATCHES ENDPOINTS =====
    
    async createMatch(profileId, action) {
        return this.request(this.config.MATCHES.CREATE, {
            method: 'POST',
            body: { profile_id: profileId, action }
        });
    }
    
    async getMatches() {
        return this.request(this.config.MATCHES.LIST);
    }
    
    async deleteMatch(id) {
        return this.request(this.config.MATCHES.DELETE.replace(':id', id), {
            method: 'DELETE'
        });
    }
    
    // ===== MESSAGES ENDPOINTS =====
    
    async getMessages(matchId) {
        return this.request(`${this.config.MESSAGES.LIST}?match_id=${matchId}`);
    }
    
    async sendMessage(matchId, content) {
        return this.request(this.config.MESSAGES.CREATE, {
            method: 'POST',
            body: { match_id: matchId, content }
        });
    }
}

// Instance globale
const apiClient = new APIClient(CONFIG);

// Export pour utilisation
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, APIClient, apiClient };
}