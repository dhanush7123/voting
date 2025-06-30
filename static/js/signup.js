// Sign Up Page JavaScript for RV College of Engineering Smart Voting System

// Sign Up Form Management
class SignUpForm {
    constructor() {
        this.form = document.getElementById('signupForm');
        this.usernameInput = document.getElementById('username');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.strengthFill = document.getElementById('strengthFill');
        this.strengthText = document.getElementById('strengthText');
        
        // Error message elements
        this.usernameError = document.getElementById('usernameError');
        this.emailError = document.getElementById('emailError');
        this.passwordError = document.getElementById('passwordError');
        
        // Load existing users from localStorage
        this.existingUsers = this.loadExistingUsers();
        
        this.init();
    }
    
    // Load existing users from localStorage
    loadExistingUsers() {
        const usersData = localStorage.getItem('registeredUsers');
        if (usersData) {
            const users = JSON.parse(usersData);
            return users.map(user => user.username.toLowerCase());
        }
        return ['user1', 'testuser', 'student']; // Default users
    }
    
    // Save new user to localStorage
    saveUserToStorage(username, email, password) {
        const usersData = localStorage.getItem('registeredUsers');
        let users = [];
        
        if (usersData) {
            users = JSON.parse(usersData);
        }
        
        // Add new user
        const newUser = {
            username: username,
            email: email,
            password: password, // In a real app, this should be hashed
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('registeredUsers', JSON.stringify(users));
        
        // Update existing users list
        this.existingUsers.push(username.toLowerCase());
    }
    
    init() {
        if (this.form) {
            this.setupEventListeners();
        }
    }
    
    setupEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSignUp();
        });
        
        // Real-time validation
        this.usernameInput.addEventListener('input', () => {
            this.validateUsername();
        });
        
        this.emailInput.addEventListener('input', () => {
            this.validateEmail();
        });
        
        this.passwordInput.addEventListener('input', () => {
            this.validatePassword();
            this.updatePasswordStrength();
        });
        
        // Blur events for final validation
        this.usernameInput.addEventListener('blur', () => {
            this.validateUsername();
        });
        
        this.emailInput.addEventListener('blur', () => {
            this.validateEmail();
        });
        
        this.passwordInput.addEventListener('blur', () => {
            this.validatePassword();
        });
    }
    
    // Username validation
    validateUsername() {
        const username = this.usernameInput.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Check if empty
        if (!username) {
            isValid = false;
            errorMessage = 'Username is required';
        }
        // Check minimum length
        else if (username.length < 3) {
            isValid = false;
            errorMessage = 'Username must be at least 3 characters long';
        }
        // Check if username already exists
        else if (this.existingUsers.includes(username.toLowerCase())) {
            isValid = false;
            errorMessage = 'Username already exists';
        }
        // Check for valid characters
        else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            isValid = false;
            errorMessage = 'Username can only contain letters, numbers, and underscores';
        }
        
        this.showFieldError(this.usernameError, errorMessage);
        return isValid;
    }
    
    // Email validation
    validateEmail() {
        const email = this.emailInput.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Check if empty
        if (!email) {
            isValid = false;
            errorMessage = 'Email is required';
        }
        // Check email format
        else if (!this.isValidEmail(email)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
        // Check if email already exists
        else if (this.isEmailAlreadyRegistered(email)) {
            isValid = false;
            errorMessage = 'Email is already registered';
        }
        
        this.showFieldError(this.emailError, errorMessage);
        return isValid;
    }
    
    // Check if email is already registered
    isEmailAlreadyRegistered(email) {
        const usersData = localStorage.getItem('registeredUsers');
        if (usersData) {
            const users = JSON.parse(usersData);
            return users.some(user => user.email.toLowerCase() === email.toLowerCase());
        }
        return false;
    }
    
    // Password validation
    validatePassword() {
        const password = this.passwordInput.value;
        let isValid = true;
        let errorMessage = '';
        
        // Check if empty
        if (!password) {
            isValid = false;
            errorMessage = 'Password is required';
        }
        // Check minimum length
        else if (password.length < 8) {
            isValid = false;
            errorMessage = 'Password must be at least 8 characters long';
        }
        // Check for strong password criteria
        else if (!this.isStrongPassword(password)) {
            isValid = false;
            errorMessage = 'Password must contain uppercase, lowercase, number, and special character';
        }
        
        this.showFieldError(this.passwordError, errorMessage);
        return isValid;
    }
    
    // Email format validation
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Strong password validation
    isStrongPassword(password) {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
    }
    
    // Update password strength indicator
    updatePasswordStrength() {
        const password = this.passwordInput.value;
        
        if (!password) {
            this.strengthFill.className = 'strength-fill';
            this.strengthText.textContent = 'Password strength';
            return;
        }
        
        let strength = 0;
        let strengthLabel = '';
        
        // Calculate strength
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/\d/.test(password)) strength += 1;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;
        
        // Set strength level
        if (strength <= 2) {
            this.strengthFill.className = 'strength-fill weak';
            strengthLabel = 'Weak';
        } else if (strength <= 3) {
            this.strengthFill.className = 'strength-fill medium';
            strengthLabel = 'Medium';
        } else {
            this.strengthFill.className = 'strength-fill strong';
            strengthLabel = 'Strong';
        }
        
        this.strengthText.textContent = strengthLabel;
    }
    
    // Show/hide field error
    showFieldError(errorElement, message) {
        if (message) {
            errorElement.textContent = message;
            errorElement.style.display = 'flex';
        } else {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }
    
    // Handle sign up submission
    async handleSignUp() {
        // Validate all fields
        const isUsernameValid = this.validateUsername();
        const isEmailValid = this.validateEmail();
        const isPasswordValid = this.validatePassword();
        
        if (!isUsernameValid || !isEmailValid || !isPasswordValid) {
            this.showNotification('Please fix the errors above', 'error');
            return;
        }
        
        // Show loading state
        this.showLoadingState();
        
        try {
            // Simulate API call
            await this.simulateSignUp();
            
            // Save user to localStorage
            const username = this.usernameInput.value.trim();
            const email = this.emailInput.value.trim();
            const password = this.passwordInput.value;
            
            this.saveUserToStorage(username, email, password);
            
            // Show success message
            this.showSuccessMessage();
            
        } catch (error) {
            this.showNotification(error.message, 'error');
        } finally {
            this.hideLoadingState();
        }
    }
    
    // Simulate sign up API call
    async simulateSignUp() {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simulate random failure (5% chance)
        if (Math.random() < 0.05) {
            throw new Error('Network error. Please try again.');
        }
        
        return { success: true };
    }
    
    // Show loading state
    showLoadingState() {
        const button = this.form.querySelector('.signup-btn');
        const btnText = button.querySelector('.btn-text');
        const btnLoader = button.querySelector('.btn-loader');
        
        btnText.style.display = 'none';
        btnLoader.style.display = 'block';
        button.disabled = true;
    }
    
    // Hide loading state
    hideLoadingState() {
        const button = this.form.querySelector('.signup-btn');
        const btnText = button.querySelector('.btn-text');
        const btnLoader = button.querySelector('.btn-loader');
        
        btnText.style.display = 'block';
        btnLoader.style.display = 'none';
        button.disabled = false;
    }
    
    // Show success message
    showSuccessMessage() {
        this.showNotification('Account created successfully! Redirecting to login...', 'success');
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
            window.location.href = '/login';
        }, 2000);
    }
    
    // Show notification
    showNotification(message, type) {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'success' ? '✅' : '❌'}</span>
                <span class="notification-message">${message}</span>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            animation: slideDown 0.3s ease-out;
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
}

// Initialize sign up form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SignUpForm();
}); 