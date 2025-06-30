// Reset Password Page JavaScript for RV College of Engineering Smart Voting System

// Reset Password Form Management
class ResetPasswordForm {
    constructor() {
        this.form = document.getElementById('resetForm');
        this.newPasswordInput = document.getElementById('newPassword');
        this.confirmPasswordInput = document.getElementById('confirmPassword');
        this.strengthFill = document.getElementById('strengthFill');
        this.strengthText = document.getElementById('strengthText');
        this.newPasswordError = document.getElementById('newPasswordError');
        this.confirmPasswordError = document.getElementById('confirmPasswordError');
        this.successMessage = document.getElementById('successMessage');
        
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
            this.handleResetPassword();
        });
        
        // Real-time validation
        this.newPasswordInput.addEventListener('input', () => {
            this.validateNewPassword();
            this.updatePasswordStrength();
            this.validateConfirmPassword();
        });
        this.confirmPasswordInput.addEventListener('input', () => {
            this.validateConfirmPassword();
        });
    }
    
    // New password validation
    validateNewPassword() {
        const password = this.newPasswordInput.value;
        let isValid = true;
        let errorMessage = '';
        
        if (!password) {
            isValid = false;
            errorMessage = 'Password is required';
        } else if (password.length < 8) {
            isValid = false;
            errorMessage = 'Password must be at least 8 characters long';
        } else if (!this.isStrongPassword(password)) {
            isValid = false;
            errorMessage = 'Password must contain uppercase, lowercase, number, and special character';
        }
        this.showFieldError(this.newPasswordError, errorMessage);
        return isValid;
    }
    
    // Confirm password validation
    validateConfirmPassword() {
        const password = this.newPasswordInput.value;
        const confirm = this.confirmPasswordInput.value;
        let isValid = true;
        let errorMessage = '';
        if (!confirm) {
            isValid = false;
            errorMessage = 'Please confirm your password';
        } else if (password !== confirm) {
            isValid = false;
            errorMessage = 'Passwords do not match';
        }
        this.showFieldError(this.confirmPasswordError, errorMessage);
        return isValid;
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
        const password = this.newPasswordInput.value;
        if (!password) {
            this.strengthFill.className = 'strength-fill';
            this.strengthText.textContent = 'Password strength';
            return;
        }
        let strength = 0;
        let strengthLabel = '';
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/\d/.test(password)) strength += 1;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;
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
    
    // Handle reset password submission
    async handleResetPassword() {
        const isNewPasswordValid = this.validateNewPassword();
        const isConfirmValid = this.validateConfirmPassword();
        if (!isNewPasswordValid || !isConfirmValid) {
            this.showNotification('Please fix the errors above', 'error');
            return;
        }
        this.showLoadingState();
        try {
            await this.simulateResetPassword();
            this.showSuccessMessage();
        } catch (error) {
            this.showNotification(error.message, 'error');
        } finally {
            this.hideLoadingState();
        }
    }
    // Simulate reset password API call
    async simulateResetPassword() {
        await new Promise(resolve => setTimeout(resolve, 1500));
        if (Math.random() < 0.05) {
            throw new Error('Failed to update password. Please try again.');
        }
        return { success: true };
    }
    showLoadingState() {
        const button = this.form.querySelector('.reset-btn');
        const btnText = button.querySelector('.btn-text');
        const btnLoader = button.querySelector('.btn-loader');
        btnText.style.display = 'none';
        btnLoader.style.display = 'block';
        button.disabled = true;
    }
    hideLoadingState() {
        const button = this.form.querySelector('.reset-btn');
        const btnText = button.querySelector('.btn-text');
        const btnLoader = button.querySelector('.btn-loader');
        btnText.style.display = 'block';
        btnLoader.style.display = 'none';
        button.disabled = false;
    }
    showSuccessMessage() {
        this.form.style.display = 'none';
        this.successMessage.style.display = 'block';
        this.successMessage.style.animation = 'fadeInUp 0.5s ease-out';
        setTimeout(() => {
            window.location.href = '/login';
        }, 4000);
    }
    showNotification(message, type) {
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'success' ? '✅' : '❌'}</span>
                <span class="notification-message">${message}</span>
            </div>
        `;
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
        document.body.appendChild(notification);
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    new ResetPasswordForm();
}); 