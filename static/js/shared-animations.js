// Shared Animations and Effects for All Pages
class SharedAnimations {
    constructor() {
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.isTransitioning = false;
        this.audioContext = null;
        this.init();
    }

    init() {
        this.initParticles();
        this.initMouseTracking();
        this.initScrollAnimations();
        this.initRippleEffects();
        this.initAudioFeedback();
        this.initPageTransitions();
        this.initParticleInteraction();
        this.initThemeToggle();
    }

    // Initialize particle system
    initParticles() {
        const particleContainer = document.getElementById('particles-js');
        if (!particleContainer) return;

        // Clear existing particles
        particleContainer.innerHTML = '';

        // Create particles
        for (let i = 0; i < 50; i++) {
            this.createParticle(particleContainer);
        }

        // Animate particles
        this.animateParticles();
    }

    // Create individual particle
    createParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 4 + 2;
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const speed = Math.random() * 2 + 1;
        const angle = Math.random() * Math.PI * 2;
        
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            animation-duration: ${speed}s;
            animation-delay: ${Math.random() * 20}s;
        `;

        container.appendChild(particle);
        
        this.particles.push({
            element: particle,
            x: x,
            y: y,
            speed: speed,
            angle: angle,
            size: size
        });
    }

    // Animate particles
    animateParticles() {
        this.particles.forEach(particle => {
            particle.y += Math.sin(particle.angle) * 0.3;
            particle.x += Math.cos(particle.angle) * 0.3;
            
            // Wrap around screen
            if (particle.x > window.innerWidth) particle.x = 0;
            if (particle.x < 0) particle.x = window.innerWidth;
            if (particle.y > window.innerHeight) particle.y = 0;
            if (particle.y < 0) particle.y = window.innerHeight;
            
            particle.element.style.left = particle.x + 'px';
            particle.element.style.top = particle.y + 'px';
        });

        requestAnimationFrame(() => this.animateParticles());
    }

    // Initialize mouse tracking for particle interaction
    initMouseTracking() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
    }

    // Particle interaction with mouse
    initParticleInteraction() {
        setInterval(() => {
            this.particles.forEach(particle => {
                const distance = Math.sqrt(
                    Math.pow(this.mouseX - particle.x, 2) + 
                    Math.pow(this.mouseY - particle.y, 2)
                );
                
                if (distance < 80) {
                    particle.element.style.transform = `scale(1.3)`;
                    particle.element.style.opacity = '1';
                } else {
                    particle.element.style.transform = `scale(1)`;
                    particle.element.style.opacity = '0.7';
                }
            });
        }, 100);
    }

    // Initialize scroll animations
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, observerOptions);

        // Observe all scroll-reveal elements
        document.querySelectorAll('.scroll-reveal').forEach(el => {
            observer.observe(el);
        });
    }

    // Initialize ripple effects
    initRippleEffects() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn') || 
                e.target.classList.contains('card') ||
                e.target.closest('.btn') ||
                e.target.closest('.card')) {
                this.createRipple(e);
            }
        });
    }

    // Create ripple effect
    createRipple(event) {
        const button = event.target.classList.contains('btn') || event.target.classList.contains('card') 
            ? event.target 
            : event.target.closest('.btn') || event.target.closest('.card');
        
        if (!button) return;

        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;

        button.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // Initialize audio feedback
    initAudioFeedback() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Audio context not supported');
        }
    }

    // Play click sound
    playClickSound() {
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(300, this.audioContext.currentTime + 0.1);

        gainNode.gain.setValueAtTime(0.08, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }

    // Initialize page transitions
    initPageTransitions() {
        // Create transition overlay
        const overlay = document.createElement('div');
        overlay.className = 'page-transition';
        document.body.appendChild(overlay);

        // Add transition to all navigation links and buttons
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            const button = e.target.closest('button[onclick*="location"]');
            
            if (link || button) {
                e.preventDefault();
                const url = link?.href || button?.getAttribute('onclick');
                this.startPageTransition(url);
            }
        });
    }

    // Start page transition
    startPageTransition(url) {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        const overlay = document.querySelector('.page-transition');
        
        // Play transition sound
        this.playClickSound();
        
        // Show overlay
        overlay.classList.add('active');
        
        // Navigate after animation
        setTimeout(() => {
            if (url && url !== 'javascript:void(0)' && !url.includes('onclick')) {
                window.location.href = url;
            } else {
                // Handle onclick navigation
                const button = document.querySelector('button[onclick*="location"]');
                if (button) {
                    const onclick = button.getAttribute('onclick');
                    if (onclick.includes('location.href')) {
                        const match = onclick.match(/location\.href\s*=\s*['"]([^'"]+)['"]/);
                        if (match) {
                            window.location.href = match[1];
                        }
                    }
                }
            }
        }, 300);
    }

    // Initialize theme toggle
    initThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const body = document.body;
        
        if (!themeToggle) return;

        // Set initial theme
        const savedTheme = localStorage.getItem('theme') || 'dark';
        body.className = `${savedTheme}-mode`;
        
        // Theme toggle functionality
        themeToggle.addEventListener('click', () => {
            const currentTheme = body.className.includes('dark') ? 'dark' : 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            body.className = `${newTheme}-mode`;
            localStorage.setItem('theme', newTheme);
            
            // Add theme change animation
            body.style.transition = 'all 0.3s ease-in-out';
            setTimeout(() => {
                body.style.transition = '';
            }, 300);

            // Play sound
            this.playClickSound();
        });
    }

    // Show notification with animation
    showNotification(message, type = 'success') {
        const container = document.getElementById('notificationContainer');
        if (!container) return;
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(-100px);
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            padding: 1rem 2rem;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            transition: transform 0.3s ease;
        `;
        
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'success' ? '✅' : '❌'}</span>
                <span class="notification-message">${message}</span>
            </div>
        `;
        
        container.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(-50%) translateY(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(-50%) translateY(-100px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }

    // Create floating shapes
    createFloatingShapes() {
        const shapes = ['circle', 'square', 'triangle'];
        const colors = ['#667eea', '#764ba2', '#4facfe', '#f093fb'];
        
        for (let i = 0; i < 3; i++) {
            const shape = document.createElement('div');
            shape.className = 'floating-shape';
            
            const shapeType = shapes[Math.floor(Math.random() * shapes.length)];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            shape.style.cssText = `
                position: fixed;
                width: ${Math.random() * 60 + 20}px;
                height: ${Math.random() * 60 + 20}px;
                background: ${color};
                opacity: 0.1;
                border-radius: ${shapeType === 'circle' ? '50%' : '0'};
                top: ${Math.random() * window.innerHeight}px;
                left: ${Math.random() * window.innerWidth}px;
                animation: float ${Math.random() * 4 + 3}s ease-in-out infinite;
                animation-delay: ${Math.random() * 2}s;
                z-index: -1;
            `;
            
            document.body.appendChild(shape);
        }
    }

    // Initialize confetti effect
    initConfetti() {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
        
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.cssText = `
                    position: fixed;
                    width: 8px;
                    height: 8px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    left: ${Math.random() * 100}vw;
                    top: -10px;
                    animation: confettiFall ${Math.random() * 3 + 2}s linear forwards;
                    z-index: 1000;
                `;
                
                document.body.appendChild(confetti);
                
                setTimeout(() => {
                    if (confetti.parentNode) {
                        confetti.remove();
                    }
                }, 5000);
            }, i * 50);
        }
    }

    // Add loading state to button
    addLoadingState(button) {
        button.classList.add('loading');
        button.disabled = true;
    }

    // Remove loading state from button
    removeLoadingState(button) {
        button.classList.remove('loading');
        button.disabled = false;
    }

    // Animate progress bar
    animateProgressBar(progressBar, targetValue) {
        const progressFill = progressBar.querySelector('.progress-fill');
        if (!progressFill) return;

        progressFill.style.width = '0%';
        
        setTimeout(() => {
            progressFill.style.width = targetValue + '%';
        }, 100);
    }

    // Animate counter
    animateCounter(element, targetValue, duration = 2000) {
        const startValue = 0;
        const increment = targetValue / (duration / 16);
        let currentValue = startValue;

        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= targetValue) {
                currentValue = targetValue;
                clearInterval(timer);
            }
            element.textContent = Math.floor(currentValue);
        }, 16);
    }
}

// Initialize shared animations when DOM is loaded
let sharedAnimationsInstance;
document.addEventListener('DOMContentLoaded', function() {
    // Initialize shared animations
    sharedAnimationsInstance = new SharedAnimations();
    window.sharedAnimations = sharedAnimationsInstance;
    // Create floating shapes
    window.sharedAnimations.createFloatingShapes();
    // Add scroll reveal to elements
    document.querySelectorAll('.btn, .card, .form-container, .table-container').forEach(el => {
        el.classList.add('scroll-reveal');
    });
    // Add click sound to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (window.sharedAnimations) {
                window.sharedAnimations.playClickSound();
            }
        });
    });
    // Add confetti on page load for success pages
    if (window.location.pathname.includes('success') || 
        window.location.pathname.includes('results') ||
        window.location.pathname.includes('home')) {
        setTimeout(() => {
            if (window.sharedAnimations) {
                window.sharedAnimations.initConfetti();
            }
        }, 1000);
    }
});

// Add confetti animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        to {
            transform: translateY(100vh) rotate(360deg);
        }
    }
    
    @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(180deg); }
    }
`;
document.head.appendChild(style);

// Export functions for use in other scripts
// Use the sharedAnimationsInstance for all exports
Object.defineProperty(window, 'sharedAnimations', {
    get: function() { return sharedAnimationsInstance; },
    configurable: true
});

window.sharedAnimations = window.sharedAnimations || {};
window.sharedAnimations.shootingStars = function() {
    // Shooting Stars
    function createShootingStar() {
        const star = document.createElement('div');
        star.className = 'shooting-star';
        star.style.left = Math.random() * window.innerWidth + 'px';
        star.style.top = Math.random() * (window.innerHeight / 2) + 'px';
        star.style.animationDuration = (0.4 + Math.random() * 0.6) + 's';
        document.body.appendChild(star);
        setTimeout(() => star.remove(), 800);
    }
    setInterval(createShootingStar, 350 + Math.random() * 400); // Even more frequent

    // Twinkling Stars
    function createTwinklingStar() {
        const twinkle = document.createElement('div');
        twinkle.className = 'twinkling-star';
        twinkle.style.left = Math.random() * window.innerWidth + 'px';
        twinkle.style.top = Math.random() * window.innerHeight + 'px';
        twinkle.style.width = twinkle.style.height = (1 + Math.random() * 2) + 'px';
        twinkle.style.opacity = 0.5 + Math.random() * 0.5;
        document.body.appendChild(twinkle);
        setTimeout(() => twinkle.remove(), 3000 + Math.random() * 2000);
    }
    setInterval(createTwinklingStar, 120);

    // Solar System Elements (planets/comets)
    function createPlanetOrComet() {
        const types = ['planet', 'comet'];
        const type = types[Math.floor(Math.random() * types.length)];
        const elem = document.createElement('div');
        if (type === 'planet') {
            elem.className = 'solar-planet';
            elem.style.left = Math.random() * window.innerWidth + 'px';
            elem.style.top = (window.innerHeight * 0.7 + Math.random() * window.innerHeight * 0.2) + 'px';
            elem.style.width = elem.style.height = (10 + Math.random() * 20) + 'px';
            elem.style.background = ['#feca57', '#54a0ff', '#ff6b6b', '#1dd1a1', '#576574'][Math.floor(Math.random()*5)];
            elem.style.borderRadius = '50%';
            elem.style.position = 'fixed';
            elem.style.opacity = 0.7;
        } else {
            elem.className = 'solar-comet';
            elem.style.left = Math.random() * window.innerWidth + 'px';
            elem.style.top = Math.random() * (window.innerHeight / 2) + 'px';
            elem.style.width = '3px';
            elem.style.height = '40px';
            elem.style.background = 'linear-gradient(180deg, #fff 0%, rgba(255,255,255,0) 100%)';
            elem.style.opacity = 0.6;
            elem.style.borderRadius = '2px';
            elem.style.position = 'fixed';
            elem.style.transform = 'rotate(' + (15 + Math.random()*30) + 'deg)';
            elem.style.animation = 'shooting-star-move 1.2s linear forwards';
        }
        document.body.appendChild(elem);
        setTimeout(() => elem.remove(), 4000);
    }
    setInterval(createPlanetOrComet, 2500 + Math.random() * 2000);
}; 