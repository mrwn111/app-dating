/* ===================================
   ANIMATIONS & INTERACTIONS AVANCÉES
   =================================== */

/**
 * Ce fichier contient des animations supplémentaires
 * et des interactions pour améliorer l'UX.
 * À ajouter à style.css selon tes besoins.
 */

/* ===================================
   PARTICLE EFFECTS
   =================================== */

@keyframes particleFloat {
    0% {
        opacity: 1;
        transform: translateY(0) translateX(0);
    }
    100% {
        opacity: 0;
        transform: translateY(-100px) translateX(var(--tx, 0));
    }
}

.particle {
    position: fixed;
    pointer-events: none;
    font-size: 2rem;
    animation: particleFloat 1s ease-out forwards;
}

/* Fonction JavaScript pour les particules */
function createParticles(x, y, emoji = '❤️', count = 5) {
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = emoji;
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.setProperty('--tx', (Math.random() - 0.5) * 100 + 'px');
        document.body.appendChild(particle);
        
        setTimeout(() => particle.remove(), 1000);
    }
}

// Utilisation: createParticles(event.clientX, event.clientY, '🔥', 10);

/* ===================================
   CONFETTI EFFECT
   =================================== */

@keyframes confettiFall {
    0% {
        opacity: 1;
        transform: translateY(0) rotateZ(0deg);
    }
    100% {
        opacity: 0;
        transform: translateY(600px) rotateZ(360deg);
    }
}

.confetti {
    position: fixed;
    pointer-events: none;
    width: 10px;
    height: 10px;
    animation: confettiFall 3s ease-in forwards;
}

function triggerConfetti(count = 50) {
    const colors = ['#ff6b9d', '#667eea', '#00d4ff', '#2ed573', '#ffa502'];
    
    for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = '-10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = (Math.random() * 0.5) + 's';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 3500);
    }
}

// Utilisation: triggerConfetti() quand match!

/* ===================================
   SHAKE ANIMATION
   =================================== */

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}

.shake {
    animation: shake 0.5s;
}

function shakeElement(element) {
    element.classList.add('shake');
    setTimeout(() => element.classList.remove('shake'), 500);
}

/* ===================================
   PULSE ANIMATION
   =================================== */

@keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: 0.8; }
}

.pulse {
    animation: pulse 2s infinite;
}

/* ===================================
   GLOW EFFECT
   =================================== */

@keyframes glow {
    0%, 100% {
        box-shadow: 0 0 10px rgba(255, 107, 157, 0.5);
    }
    50% {
        box-shadow: 0 0 30px rgba(255, 107, 157, 1);
    }
}

.glow {
    animation: glow 2s ease-in-out infinite;
}

/* ===================================
   SMOOTH SCROLL
   =================================== */

html {
    scroll-behavior: smooth;
}

/* ===================================
   TEXT FADE IN
   =================================== */

@keyframes textFadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.text-fade-in {
    animation: textFadeIn 0.6s ease-out;
}

/* ===================================
   SCALE UP
   =================================== */

@keyframes scaleUp {
    from {
        opacity: 0;
        transform: scale(0.9);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

.scale-up {
    animation: scaleUp 0.4s ease-out;
}

/* ===================================
   BOUNCE ANIMATION
   =================================== */

@keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
    }
    40% {
        transform: translateY(-10px);
    }
    60% {
        transform: translateY(-5px);
    }
}

.bounce {
    animation: bounce 1s ease-in-out infinite;
}

/* ===================================
   FLIP ANIMATION
   =================================== */

@keyframes flip {
    from {
        transform: rotateY(0deg);
    }
    to {
        transform: rotateY(360deg);
    }
}

.flip {
    animation: flip 0.6s ease-in-out;
}

/* ===================================
   RIPPLE EFFECT (Pour les cliques)
   =================================== */

@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

.ripple-effect {
    position: relative;
    overflow: hidden;
}

.ripple-effect::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 10px;
    height: 10px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: ripple 0.6s ease-out;
    pointer-events: none;
}

/* ===================================
   ADVANCED CARD EFFECTS
   =================================== */

/* Tilt effet 3D */
@keyframes tilt {
    0% {
        transform: perspective(1000px) rotateX(0deg) rotateY(0deg);
    }
    100% {
        transform: perspective(1000px) rotateX(var(--rotateX, 0)) rotateY(var(--rotateY, 0));
    }
}

.card-tilt {
    transform-style: preserve-3d;
}

function addTiltEffect(element) {
    element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const rotateY = ((x - centerX) / centerX) * 10;
        const rotateX = ((centerY - y) / centerY) * 10;
        
        element.style.setProperty('--rotateX', rotateX + 'deg');
        element.style.setProperty('--rotateY', rotateY + 'deg');
        element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    element.addEventListener('mouseleave', () => {
        element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
}

/* ===================================
   GRADIENT ANIMATION
   =================================== */

@keyframes gradientShift {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}

.gradient-animate {
    background: linear-gradient(
        135deg,
        var(--primary),
        var(--accent),
        var(--primary)
    );
    background-size: 200% 200%;
    animation: gradientShift 3s ease infinite;
}

/* ===================================
   LOADING ANIMATIONS
   =================================== */

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(255, 255, 255, 0.1);
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

/* Skeleton loading */
@keyframes skeleton-loading {
    0% {
        background-position: -1000px 0;
    }
    100% {
        background-position: 1000px 0;
    }
}

.skeleton {
    background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.1) 0,
        rgba(255, 255, 255, 0.3) 50%,
        rgba(255, 255, 255, 0.1) 100%
    );
    background-size: 1000px 100%;
    animation: skeleton-loading 2s infinite;
}

/* ===================================
   MODAL ANIMATIONS
   =================================== */

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeInScale {
    from {
        opacity: 0;
        transform: scale(0.95);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

.modal-enter {
    animation: fadeInScale 0.3s ease-out;
}

/* ===================================
   RESPONSIVE ANIMATIONS
   =================================== */

@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}

/* Sombre animations */
@media (prefers-color-scheme: dark) {
    .glow {
        animation: glow 2s ease-in-out infinite;
        /* Déjà sombre, juste ajuster les couleurs */
    }
}

/* ===================================
   JAVASCRIPT HELPERS
   =================================== */

/**
 * Ajouter des animations à l'initialisation
 */
function initAnimations() {
    // Fade in les éléments avec data-animate
    document.querySelectorAll('[data-animate]').forEach((el, index) => {
        el.style.opacity = '0';
        setTimeout(() => {
            el.classList.add('text-fade-in');
            el.style.opacity = '1';
        }, index * 100);
    });
}

/**
 * Déclencher une animation personnalisée
 */
function triggerAnimation(element, animationName, duration = 1000) {
    return new Promise(resolve => {
        const handler = () => {
            element.removeEventListener('animationend', handler);
            element.classList.remove(animationName);
            resolve();
        };
        
        element.addEventListener('animationend', handler);
        element.classList.add(animationName);
        
        setTimeout(resolve, duration);
    });
}

/**
 * Observer pour animations au scroll
 */
function observeAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('text-fade-in');
                observer.unobserve(entry.target);
            }
        });
    });
    
    document.querySelectorAll('[data-animate-on-scroll]').forEach(el => {
        observer.observe(el);
    });
}

/* ===================================
   EASTER EGGS & FUN
   =================================== */

// Konami Code Easter Egg
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    konamiIndex = e.key === konamiCode[konamiIndex] ? konamiIndex + 1 : 0;
    
    if (konamiIndex === konamiCode.length) {
        triggerConfetti(100);
        console.log('🎉 EASTER EGG TROUVÉ!');
        konamiIndex = 0;
    }
});

// Double click pour matcher rapidement
document.addEventListener('dblclick', (e) => {
    if (e.target.closest('.profile-card')) {
        createParticles(e.clientX, e.clientY, '🔥', 15);
    }
});

console.log('✨ Animations et interactions chargées!');
console.log('🎮 Essaie le code Konami: ↑ ↑ ↓ ↓ ← → ← → b a');