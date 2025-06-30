// Theme Management
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.body = document.body;
        this.currentTheme = localStorage.getItem('theme') || 'light';
        
        this.init();
    }
    
    init() {
        // Set initial theme
        this.setTheme(this.currentTheme);
        
        // Add event listener for theme toggle
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }
    
    setTheme(theme) {
        this.currentTheme = theme;
        this.body.className = `${theme}-mode`;
        localStorage.setItem('theme', theme);
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
}

// Splash Screen Management
class SplashScreen {
    constructor() {
        this.redirectDelay = 3000; // 3 seconds
        this.init();
    }
    
    init() {
        // Check if we're on the splash screen
        if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
            this.startRedirectTimer();
            this.addClickHandler();
        }
    }
    
    startRedirectTimer() {
        setTimeout(() => {
            this.redirectToLogin();
        }, this.redirectDelay);
    }
    
    addClickHandler() {
        // Add click handler to the entire splash container
        const splashContainer = document.querySelector('.splash-container');
        if (splashContainer) {
            splashContainer.addEventListener('click', () => {
                this.redirectToLogin();
            });
        }
    }
    
    redirectToLogin() {
        // Add fade out animation
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '0';
        
        setTimeout(() => {
            window.location.href = '/login';
        }, 500);
    }
}

// Form Input Enhancements
class FormEnhancements {
    constructor() {
        this.init();
    }
    
    init() {
        this.addInputFocusEffects();
        this.addPasswordToggle();
    }
    
    addInputFocusEffects() {
        const inputs = document.querySelectorAll('.form-input');
        
        inputs.forEach(input => {
            // Add focus effects
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                input.parentElement.classList.remove('focused');
            });
            
            // Add floating label effect
            input.addEventListener('input', () => {
                if (input.value) {
                    input.classList.add('has-value');
                } else {
                    input.classList.remove('has-value');
                }
            });
        });
    }
    
    addPasswordToggle() {
        const passwordInput = document.getElementById('password');
        if (passwordInput) {
            // Create toggle button
            const toggleBtn = document.createElement('button');
            toggleBtn.type = 'button';
            toggleBtn.className = 'password-toggle';
            toggleBtn.innerHTML = '👁️';
            toggleBtn.style.cssText = `
                position: absolute;
                right: 12px;
                top: 50%;
                transform: translateY(-50%);
                background: none;
                border: none;
                cursor: pointer;
                font-size: 16px;
                opacity: 0.6;
                transition: opacity 0.3s ease;
            `;
            
            // Add hover effect
            toggleBtn.addEventListener('mouseenter', () => {
                toggleBtn.style.opacity = '1';
            });
            
            toggleBtn.addEventListener('mouseleave', () => {
                toggleBtn.style.opacity = '0.6';
            });
            
            // Toggle password visibility
            toggleBtn.addEventListener('click', () => {
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    toggleBtn.innerHTML = '🙈';
                } else {
                    passwordInput.type = 'password';
                    toggleBtn.innerHTML = '👁️';
                }
            });
            
            // Add to password input container
            const passwordGroup = passwordInput.parentElement;
            passwordGroup.style.position = 'relative';
            passwordGroup.appendChild(toggleBtn);
        }
    }
}

// Page Transitions
class PageTransitions {
    constructor() {
        this.init();
    }
    
    init() {
        // Add page load animation
        document.addEventListener('DOMContentLoaded', () => {
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 100);
        });
    }
}

// Create demo user for testing
function createDemoUser() {
    const demoUser = {
        username: 'john_doe',
        fullName: 'John Doe',
        email: 'john.doe@rvce.edu.in',
        password: 'demo123'
    };
    
    // Store demo user in multiple locations to simulate real login
    localStorage.setItem('registeredUsers', JSON.stringify([demoUser]));
    localStorage.setItem('currentUser', JSON.stringify(demoUser));
    localStorage.setItem('loginData', JSON.stringify(demoUser));
    
    console.log('Demo user created:', demoUser);
    return demoUser;
}

// Test function to simulate login
function simulateLogin(username, fullName) {
    const user = {
        username: username,
        fullName: fullName,
        email: `${username}@rvce.edu.in`,
        password: 'demo123'
    };
    
    // Store user data as if logged in
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('loginData', JSON.stringify(user));
    
    // Add to registered users if not exists
    const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const userExists = existingUsers.find(u => u.username === username);
    if (!userExists) {
        existingUsers.push(user);
        localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
    }
    
    console.log('Simulated login for:', user);
    return user;
}

// Check and create demo user if needed
function ensureDemoUser() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        console.log('No user found, creating demo user...');
        return createDemoUser();
    }
    return currentUser;
}

// Enhanced getCurrentUser function
function getCurrentUser() {
    try {
        // First check for currentUser
        const currentUserData = localStorage.getItem('currentUser');
        if (currentUserData) {
            return JSON.parse(currentUserData);
        }
        
        // Fallback to registeredUsers
        const usersData = localStorage.getItem('registeredUsers');
        if (usersData) {
            const users = JSON.parse(usersData);
            if (users && users.length > 0) {
                return users[0];
            }
        }
        
        return null;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}

// Initialize all features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme management
    new ThemeManager();
    
    // Initialize splash screen (only on index page)
    if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
        new SplashScreen();
    }
    
    // Initialize login form (only on login page)
    // new LoginForm();
    new FormEnhancements();
    
    // Initialize page transitions
    new PageTransitions();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K to toggle theme
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const themeManager = new ThemeManager();
            themeManager.toggleTheme();
        }
        
        // Enter key on splash screen to redirect
        if (e.key === 'Enter' && (window.location.pathname === '/' || window.location.pathname.endsWith('index.html'))) {
            const splashScreen = new SplashScreen();
            splashScreen.redirectToLogin();
        }
    });
});

// Add some interactive hover effects
document.addEventListener('DOMContentLoaded', () => {
    // Heart logo hover effect
    const heartLogo = document.querySelector('.heart-logo');
    if (heartLogo) {
        heartLogo.addEventListener('mouseenter', () => {
            heartLogo.style.transform = 'scale(1.1)';
        });
        
        heartLogo.addEventListener('mouseleave', () => {
            heartLogo.style.transform = 'scale(1)';
        });
    }
    
    // Login card hover effect
    const loginCard = document.querySelector('.login-card');
    if (loginCard) {
        loginCard.addEventListener('mouseenter', () => {
            loginCard.style.transform = 'translateY(-5px)';
            loginCard.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
        });
        
        loginCard.addEventListener('mouseleave', () => {
            loginCard.style.transform = 'translateY(0)';
            loginCard.style.boxShadow = '';
        });
    }
});

// Add smooth scrolling for any anchor links
document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}); 