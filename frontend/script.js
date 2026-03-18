/* ===================================
   APP STATE
   =================================== */
const AppState = {
    currentUser: null,
    profiles: [],
    currentProfileIndex: 0,
    matches: [],
    
    setUser(user) {
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
    },
    
    getUser() {
        if (this.currentUser) return this.currentUser;
        const stored = localStorage.getItem('currentUser');
        if (stored) {
            this.currentUser = JSON.parse(stored);
            return this.currentUser;
        }
        return null;
    },
    
    logout() {
        this.currentUser = null;
        this.currentProfileIndex = 0;
        localStorage.removeItem('currentUser');
    }
};

/* ===================================
   AUTHENTICATION FUNCTIONS
   =================================== */

// Mock database - en production, appelle l'API Python
const mockUsers = [
    {
        id: 1,
        username: 'ElMrGachaMask',
        email: 'el@brainrot.com',
        password: 'hashedpass123',
        age: 24,
        bio: 'Fan d\'anime inutile et de memes sans contexte',
        isBrainrot: true
    },
    {
        id: 2,
        username: 'ProtoJourno',
        email: 'proto@brainrot.com',
        password: 'hashedpass456',
        age: 22,
        bio: 'Je vis pour les shitposts',
        isBrainrot: true
    }
];

const mockProfiles = [
    {
        id: 1,
        username: 'SkywardSword',
        age: 23,
        bio: 'Otaku cultured 🍜 Cherche âme sœur pour regarder des animes chelous',
        image: null
    },
    {
        id: 2,
        username: 'ChaoticNeutral',
        age: 21,
        bio: 'Générateur de memes vivant. Pas normal depuis naissance.',
        image: null
    },
    {
        id: 3,
        username: 'MainPSX',
        age: 25,
        bio: 'Brainrot certifié. Les memes c\'est ma drogue',
        image: null
    },
    {
        id: 4,
        username: 'RizzUp',
        age: 20,
        bio: 'Je comprends rien à ce que je fais mais ça va bien',
        image: null
    }
];

async function handleLogin(email, password) {
    // Simulation d'appel API
    return new Promise((resolve) => {
        setTimeout(() => {
            const user = mockUsers.find(u => u.email === email && u.password === password);
            if (user) {
                AppState.setUser({
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    age: user.age,
                    bio: user.bio
                });
                resolve({ success: true, user });
            } else {
                resolve({ success: false, error: 'Email ou mot de passe incorrect' });
            }
        }, 800);
    });
}

async function handleSignup(data) {
    // Simulation d'appel API
    return new Promise((resolve) => {
        setTimeout(() => {
            if (!data.is_brainrot) {
                resolve({ success: false, error: 'T\'es pas brainrot toi? 🧠💀' });
                return;
            }
            
            const newUser = {
                id: mockUsers.length + 1,
                username: data.username,
                email: data.email,
                password: data.password,
                age: parseInt(data.age),
                bio: data.bio,
                isBrainrot: data.is_brainrot
            };
            
            mockUsers.push(newUser);
            
            AppState.setUser({
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                age: newUser.age,
                bio: newUser.bio
            });
            
            resolve({ success: true, user: newUser });
        }, 800);
    });
}

function handleLogout() {
    AppState.logout();
    updateUIForAuth();
    goToPage('landingPage');
    showToast('À bientôt brainrot! 👋', 'info');
}

/* ===================================
   UI MANAGEMENT
   =================================== */

function updateUIForAuth() {
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const userMenu = document.getElementById('userMenu');
    const userDisplay = document.getElementById('userDisplay');
    const user = AppState.getUser();
    
    if (user) {
        loginBtn.style.display = 'none';
        signupBtn.style.display = 'none';
        userMenu.style.display = 'flex';
        userDisplay.textContent = `@${user.username} 🧠`;
    } else {
        loginBtn.style.display = 'inline-flex';
        signupBtn.style.display = 'inline-flex';
        userMenu.style.display = 'none';
    }
}

function goToPage(pageId) {
    // Fermer tous les modals
    document.querySelectorAll('.page.active').forEach(page => {
        page.classList.remove('active');
    });
    
    // Ouvrir la page demandée
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
}

function closePage(pageId) {
    const page = document.getElementById(pageId);
    if (page) {
        page.classList.remove('active');
    }
    goToPage('landingPage');
}

function switchPage(fromPageId, toPageId) {
    closePage(fromPageId);
    goToPage(toPageId);
}

function goToSwipe() {
    const user = AppState.getUser();
    if (!user) {
        showToast('Tu dois te connecter d\'abord brainrot!', 'error');
        goToPage('loginPage');
        return;
    }
    
    // Charger les profils si besoin
    if (AppState.profiles.length === 0) {
        AppState.profiles = [...mockProfiles];
        AppState.currentProfileIndex = 0;
    }
    
    goToPage('swipePage');
    renderCard();
}

function renderCard() {
    const cardsStack = document.querySelector('.cards-stack');
    cardsStack.innerHTML = '';
    
    if (AppState.currentProfileIndex >= AppState.profiles.length) {
        cardsStack.innerHTML = `
            <div class="profile-card" style="cursor: default;">
                <div class="card-image">
                    <div class="placeholder-image" style="font-size: 8rem;">💀</div>
                </div>
                <div class="card-info">
                    <h3>T'as tout swipe mdr</h3>
                    <p>Reviens plus tard ou va te prendre un vrai café</p>
                </div>
            </div>
        `;
        return;
    }
    
    const profile = AppState.profiles[AppState.currentProfileIndex];
    const card = createProfileCard(profile);
    cardsStack.appendChild(card);
    
    setupSwipeListeners(card);
}

function createProfileCard(profile) {
    const card = document.createElement('div');
    card.className = 'profile-card';
    card.innerHTML = `
        <div class="card-image">
            <div class="placeholder-image">
                <i class="fas fa-user"></i>
            </div>
        </div>
        <div class="card-info">
            <h3>${profile.username}, ${profile.age}</h3>
            <p>${profile.bio}</p>
        </div>
    `;
    return card;
}

function setupSwipeListeners(card) {
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    
    // Mouse
    card.addEventListener('mousedown', (e) => {
        if (e.target.closest('button')) return;
        isDragging = true;
        startX = e.clientX;
        card.classList.add('swiping');
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        currentX = e.clientX - startX;
        const rotation = (currentX / 100) * 10;
        card.style.transform = `translateX(${currentX}px) rotate(${rotation}deg)`;
        card.style.opacity = 1 - Math.abs(currentX / 500);
    });
    
    document.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        card.classList.remove('swiping');
        
        if (Math.abs(currentX) > 100) {
            completeSwipe(currentX > 0 ? 'like' : 'reject');
        } else {
            card.style.transform = '';
            card.style.opacity = '';
        }
        currentX = 0;
    });
    
    // Touch
    card.addEventListener('touchstart', (e) => {
        if (e.target.closest('button')) return;
        isDragging = true;
        startX = e.touches[0].clientX;
        card.classList.add('swiping');
    });
    
    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX - startX;
        const rotation = (currentX / 100) * 10;
        card.style.transform = `translateX(${currentX}px) rotate(${rotation}deg)`;
        card.style.opacity = 1 - Math.abs(currentX / 500);
    });
    
    document.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;
        card.classList.remove('swiping');
        
        if (Math.abs(currentX) > 100) {
            completeSwipe(currentX > 0 ? 'like' : 'reject');
        } else {
            card.style.transform = '';
            card.style.opacity = '';
        }
        currentX = 0;
    });
}

function completeSwipe(action) {
    const profile = AppState.profiles[AppState.currentProfileIndex];
    
    if (action === 'like') {
        AppState.matches.push(profile);
        showToast(`Match avec ${profile.username}! 🔥`, 'success');
    } else {
        showToast(`Nope ${profile.username} 💀`, 'info');
    }
    
    AppState.currentProfileIndex++;
    setTimeout(renderCard, 300);
}

/* ===================================
   FORM HANDLERS
   =================================== */

document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const result = await handleLogin(email, password);
    
    if (result.success) {
        showToast('Connecté! Bienvenue brainrot 🧠', 'success');
        updateUIForAuth();
        closePage('loginPage');
        setTimeout(() => goToSwipe(), 500);
    } else {
        showToast(result.error, 'error');
    }
});

document.getElementById('signupForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password'),
        confirm_password: formData.get('confirm_password'),
        age: formData.get('age'),
        bio: formData.get('bio'),
        is_brainrot: formData.get('is_brainrot') === 'on'
    };
    
    // Validation
    if (data.password !== data.confirm_password) {
        showToast('Les mots de passe ne correspondent pas', 'error');
        return;
    }
    
    if (data.password.length < 6) {
        showToast('Le mot de passe doit faire au moins 6 caractères', 'error');
        return;
    }
    
    const result = await handleSignup(data);
    
    if (result.success) {
        showToast('Bienvenue dans le chaos brainrot! 🎭', 'success');
        updateUIForAuth();
        closePage('signupPage');
        setTimeout(() => goToSwipe(), 500);
    } else {
        showToast(result.error, 'error');
    }
});

/* ===================================
   BUTTON LISTENERS
   =================================== */

document.getElementById('loginBtn').addEventListener('click', () => {
    goToPage('loginPage');
});

document.getElementById('signupBtn').addEventListener('click', () => {
    goToPage('signupPage');
});

document.getElementById('logoutBtn').addEventListener('click', handleLogout);

document.getElementById('landingSignupBtn').addEventListener('click', () => {
    goToPage('signupPage');
});

document.getElementById('landingLoginBtn').addEventListener('click', () => {
    goToPage('loginPage');
});

document.getElementById('rejectBtn').addEventListener('click', () => {
    completeSwipe('reject');
});

document.getElementById('likeBtn').addEventListener('click', () => {
    completeSwipe('like');
});

/* ===================================
   KEYBOARD SHORTCUTS
   =================================== */

document.addEventListener('keydown', (e) => {
    if (AppState.getUser() && document.getElementById('swipePage').classList.contains('active')) {
        if (e.key === 'ArrowLeft') {
            completeSwipe('reject');
        } else if (e.key === 'ArrowRight') {
            completeSwipe('like');
        }
    }
});

/* ===================================
   TOAST NOTIFICATIONS
   =================================== */

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    // Auto-remove après 3 secondes
    setTimeout(() => {
        toast.style.animation = 'slideOutToast 0.4s ease-out forwards';
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

@keyframes slideOutToast {
    from {
        opacity: 1;
        transform: translateX(0);
    }
    to {
        opacity: 0;
        transform: translateX(400px);
    }
}

/* ===================================
   INITIALIZATION
   =================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Vérifier si l'utilisateur est déjà connecté
    updateUIForAuth();
    
    // Charger les profils
    AppState.profiles = [...mockProfiles];
    
    console.log('🧠 BrainRotMatch est prêt!');
});