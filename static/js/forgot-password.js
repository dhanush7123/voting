// Forgot Password Page JavaScript for RV College of Engineering Smart Voting System

// Forgot Password Form Management
class ForgotPasswordForm {
    constructor() {
        this.form = document.getElementById('forgotForm');
        this.emailInput = document.getElementById('email');
        this.sendBtn = document.getElementById('sendBtn');
        this.successMessage = document.getElementById('successMessage');
        this.emailError = document.getElementById('emailError');
        
        // Simulated registered emails (replace with actual backend)
        const defaultEmails = [
            'user1@rvce.edu.in',
            'student@rvce.edu.in'
        ];
        
        this.init();
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
            this.handleForgotPassword();
        });
        
        // Real-time email validation
        this.emailInput.addEventListener('input', () => {
            this.validateEmail();
        });
        
        // Blur event for final validation
        this.emailInput.addEventListener('blur', () => {
            this.validateEmail();
        });
        
        // Send button click
        this.sendBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleForgotPassword();
        });
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
        // Check if email is registered (optional - you might want to skip this for security)
        else if (!this.registeredEmails.includes(email.toLowerCase())) {
            isValid = false;
            errorMessage = 'Email not found in our records';
        }
        
        this.showFieldError(this.emailError, errorMessage);
        return isValid;
    }
    
    // Email format validation
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
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
    
    // Handle forgot password submission
    async handleForgotPassword() {
        // Validate email
        const isEmailValid = this.validateEmail();
        
        if (!isEmailValid) {
            this.showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Show loading state
        this.showLoadingState();
        
        try {
            // Simulate API call
            await this.simulateSendResetEmail();
            
            // Show success message
            this.showSuccessMessage();
            
        } catch (error) {
            this.showNotification(error.message, 'error');
        } finally {
            this.hideLoadingState();
        }
    }
    
    // Simulate sending reset email
    async simulateSendResetEmail() {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simulate random failure (5% chance)
        if (Math.random() < 0.05) {
            throw new Error('Failed to send email. Please try again.');
        }
        
        return { success: true };
    }
    
    // Show loading state
    showLoadingState() {
        this.sendBtn.disabled = true;
        this.sendBtn.innerHTML = '<div class="spinner"></div>';
    }
    
    // Hide loading state
    hideLoadingState() {
        this.sendBtn.disabled = false;
        this.sendBtn.innerHTML = '<span class="send-icon">→</span>';
    }
    
    // Show success message
    showSuccessMessage() {
        // Hide the form
        this.form.style.display = 'none';
        
        // Show success message
        this.successMessage.style.display = 'block';
        
        // Add animation
        this.successMessage.style.animation = 'fadeInUp 0.5s ease-out';
        
        // Optional: Redirect to login page after 5 seconds
        setTimeout(() => {
            window.location.href = '/login';
        }, 5000);
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

// Initialize forgot password form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ForgotPasswordForm();
}); 