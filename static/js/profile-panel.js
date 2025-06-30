// Profile Panel JavaScript - Smart Voting System

// Global variables
let currentUser = null;
let profileData = {};

// Initialize profile system
function initializeProfile() {
    // Get current user
    currentUser = getCurrentUser();
    if (!currentUser) {
        console.error('No user found');
        return;
    }

    // Load profile data
    loadProfileData();
    
    // Update profile display
    updateProfileDisplay();
    
    // Add event listeners
    addProfileEventListeners();
    
    // Initialize file upload
    initializeFileUpload();
    
    console.log('Profile system initialized for user:', currentUser.username);
}

// Initialize profile panel when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for other scripts to load
    setTimeout(() => {
        initializeProfile();
    }, 100);
});

// Get current user with better error handling
function getCurrentUser() {
    try {
        const usersData = localStorage.getItem('registeredUsers');
        if (usersData) {
            const users = JSON.parse(usersData);
            if (users && users.length > 0) {
                return users[0];
            }
        }
        
        // Fallback: check for currentUser directly
        const currentUserData = localStorage.getItem('currentUser');
        if (currentUserData) {
            return JSON.parse(currentUserData);
        }
        
        return null;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}

// Load profile data from localStorage
function loadProfileData() {
    const savedProfile = localStorage.getItem(`profile_${currentUser.username}`);
    if (savedProfile) {
        profileData = JSON.parse(savedProfile);
    } else {
        // Initialize with default values from current user
        profileData = {
            fullName: currentUser.fullName || currentUser.username,
            username: currentUser.username,
            usn: '',
            dob: '',
            gender: '',
            avatar: null
        };
    }
    
    console.log('Loaded profile data:', profileData);
}

// Update profile display
function updateProfileDisplay() {
    // Update profile icon
    updateProfileIcon();
    
    // Update panel content
    updatePanelContent();
}

// Update profile icon with better error handling
function updateProfileIcon() {
    try {
        const profileInitial = document.getElementById('profileInitial');
        const avatarImage = document.getElementById('avatarImage');
        const avatarInitial = document.getElementById('avatarInitial');
        
        if (!profileInitial || !avatarImage || !avatarInitial) {
            console.warn('Profile elements not found');
            return;
        }
        
        if (profileData.avatar) {
            // Show uploaded image
            avatarImage.src = profileData.avatar;
            avatarImage.style.display = 'block';
            avatarInitial.style.display = 'none';
            
            // Update profile icon
            const profileAvatar = document.getElementById('profileAvatar');
            if (profileAvatar) {
                profileAvatar.innerHTML = `<img src="${profileData.avatar}" alt="Profile" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
            }
        } else {
            // Show initial from username - ensure it's the actual username
            const username = profileData.username || currentUser.username || 'U';
            const initial = username.charAt(0).toUpperCase();
            
            console.log('Setting profile initial to:', initial, 'from username:', username);
            
            profileInitial.textContent = initial;
            avatarInitial.textContent = initial;
            
            avatarImage.style.display = 'none';
            avatarInitial.style.display = 'block';
        }
    } catch (error) {
        console.error('Error updating profile icon:', error);
    }
}

// Update panel content
function updatePanelContent() {
    try {
        // Update form fields with actual user data
        const fullNameField = document.getElementById('fullName');
        const usernameField = document.getElementById('username');
        const usnField = document.getElementById('usn');
        const dobField = document.getElementById('dob');
        const genderField = document.getElementById('gender');
        
        if (fullNameField) fullNameField.value = profileData.fullName || currentUser.fullName || currentUser.username || '';
        if (usernameField) usernameField.value = profileData.username || currentUser.username || '';
        if (usnField) usnField.value = profileData.usn || '';
        if (dobField) dobField.value = profileData.dob || '';
        if (genderField) genderField.value = profileData.gender || '';
        
        console.log('Updated panel content with:', {
            fullName: profileData.fullName || currentUser.fullName,
            username: profileData.username || currentUser.username
        });
    } catch (error) {
        console.error('Error updating panel content:', error);
    }
}

// Add event listeners
function addProfileEventListeners() {
    // Profile icon click
    const profileIcon = document.getElementById('profileIcon');
    profileIcon.addEventListener('click', toggleProfilePanel);
    
    // Close button
    const closeBtn = document.getElementById('closeProfilePanel');
    closeBtn.addEventListener('click', closeProfilePanel);
    
    // Overlay click
    const overlay = document.getElementById('profileOverlay');
    overlay.addEventListener('click', closeProfilePanel);
    
    // Save button
    const saveBtn = document.getElementById('saveProfileBtn');
    saveBtn.addEventListener('click', saveProfile);
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', logout);
    
    // Upload button
    const uploadBtn = document.getElementById('uploadBtn');
    uploadBtn.addEventListener('click', showUploadOptions);
    
    // Avatar container click
    const avatarContainer = document.querySelector('.avatar-container');
    avatarContainer.addEventListener('click', showUploadOptions);
}

// Toggle profile panel
function toggleProfilePanel() {
    const panel = document.getElementById('profilePanel');
    const overlay = document.getElementById('profileOverlay');
    
    if (panel.classList.contains('open')) {
        closeProfilePanel();
    } else {
        openProfilePanel();
    }
}

// Open profile panel
function openProfilePanel() {
    const panel = document.getElementById('profilePanel');
    const overlay = document.getElementById('profileOverlay');
    
    panel.classList.add('open');
    overlay.classList.add('active');
    
    // Play click sound
    playClickSound();
    
    // Add body scroll lock
    document.body.style.overflow = 'hidden';
}

// Close profile panel
function closeProfilePanel() {
    const panel = document.getElementById('profilePanel');
    const overlay = document.getElementById('profileOverlay');
    
    panel.classList.remove('open');
    overlay.classList.remove('active');
    
    // Play click sound
    playClickSound();
    
    // Remove body scroll lock
    document.body.style.overflow = '';
}

// Show upload options
function showUploadOptions() {
    // Create upload options modal
    const modal = document.createElement('div');
    modal.className = 'upload-modal';
    modal.innerHTML = `
        <div class="upload-modal-content">
            <div class="upload-modal-header">
                <h3>Upload Profile Picture</h3>
                <button class="modal-close" onclick="this.closest('.upload-modal').remove()">×</button>
            </div>
            <div class="upload-modal-body">
                <button class="upload-option" onclick="selectFile()">
                    <span class="upload-option-icon">📁</span>
                    <span class="upload-option-text">Choose from Device</span>
                </button>
                <button class="upload-option" onclick="openCamera()">
                    <span class="upload-option-icon">📷</span>
                    <span class="upload-option-text">Take Photo</span>
                </button>
            </div>
        </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .upload-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            z-index: 3000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
        }
        .upload-modal-content {
            background: var(--bg-glass);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 2rem;
            max-width: 400px;
            width: 90%;
            animation: slideInUp 0.4s ease;
        }
        .upload-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
        }
        .upload-modal-header h3 {
            color: var(--text-primary);
            margin: 0;
        }
        .modal-close {
            background: none;
            border: none;
            color: var(--text-secondary);
            font-size: 1.5rem;
            cursor: pointer;
            transition: var(--transition-normal);
        }
        .modal-close:hover {
            color: var(--error-color);
        }
        .upload-option {
            width: 100%;
            background: var(--bg-card);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            padding: 1rem;
            margin-bottom: 1rem;
            color: var(--text-primary);
            cursor: pointer;
            transition: all var(--transition-normal);
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        .upload-option:hover {
            background: var(--gradient-primary);
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
        }
        .upload-option-icon {
            font-size: 1.5rem;
        }
        .upload-option-text {
            font-size: 1rem;
            font-weight: 500;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Select file from device
function selectFile() {
    const fileInput = document.getElementById('fileInput');
    fileInput.click();
}

// Open camera
function openCamera() {
    const cameraInput = document.getElementById('cameraInput');
    cameraInput.click();
}

// Initialize file upload
function initializeFileUpload() {
    const fileInput = document.getElementById('fileInput');
    const cameraInput = document.getElementById('cameraInput');
    
    fileInput.addEventListener('change', handleFileSelect);
    cameraInput.addEventListener('change', handleFileSelect);
}

// Handle file selection
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            showNotification('Please select an image file.', 'error');
            return;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showNotification('File size must be less than 5MB.', 'error');
            return;
        }
        
        // Process the image
        processImage(file);
        
        // Close upload modal
        const modal = document.querySelector('.upload-modal');
        if (modal) {
            modal.remove();
        }
    }
}

// Process image file
function processImage(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageData = e.target.result;
        
        // Create image element to get dimensions
        const img = new Image();
        img.onload = function() {
            // Resize image if needed
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Set maximum dimensions
            const maxSize = 300;
            let { width, height } = img;
            
            if (width > height) {
                if (width > maxSize) {
                    height = (height * maxSize) / width;
                    width = maxSize;
                }
            } else {
                if (height > maxSize) {
                    width = (width * maxSize) / height;
                    height = maxSize;
                }
            }
            
            canvas.width = width;
            canvas.height = height;
            
            // Draw resized image
            ctx.drawImage(img, 0, 0, width, height);
            
            // Convert to base64
            const resizedImageData = canvas.toDataURL('image/jpeg', 0.8);
            
            // Save to profile data
            profileData.avatar = resizedImageData;
            saveProfileData();
            
            // Update display
            updateProfileDisplay();
            
            showNotification('Profile picture updated successfully!', 'success');
        };
        img.src = imageData;
    };
    reader.readAsDataURL(file);
}

// Save profile data
function saveProfile() {
    const saveBtn = document.getElementById('saveProfileBtn');
    
    // Add loading state
    saveBtn.classList.add('loading');
    saveBtn.disabled = true;
    
    // Get form data
    profileData.usn = document.getElementById('usn').value;
    profileData.dob = document.getElementById('dob').value;
    profileData.gender = document.getElementById('gender').value;
    
    // Save to localStorage
    saveProfileData();
    
    // Simulate save delay
    setTimeout(() => {
        // Remove loading state
        saveBtn.classList.remove('loading');
        saveBtn.classList.add('success');
        saveBtn.disabled = false;
        
        showNotification('Profile saved successfully!', 'success');
        
        // Remove success state after delay
        setTimeout(() => {
            saveBtn.classList.remove('success');
        }, 2000);
    }, 1000);
}

// Save profile data to localStorage
function saveProfileData() {
    localStorage.setItem(`profile_${currentUser.username}`, JSON.stringify(profileData));
}

// Logout function
function logout() {
    // Show confirmation dialog
    if (confirm('Are you sure you want to logout?')) {
        // Clear all session data
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userSession');
        localStorage.removeItem('userProfile');
        localStorage.removeItem('loggedInUser');
        
        // Clear any other user-related data
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.startsWith('profile_') || key.startsWith('user_') || key.startsWith('session_'))) {
                keysToRemove.push(key);
            }
        }
        
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        // Show logout notification
        showNotification('Logged out successfully. Redirecting to login...', 'success');
        
        // Close profile panel
        closeProfilePanel();
        
        // Redirect to login page after a short delay
        setTimeout(() => {
            window.location.href = '/login';
        }, 1500);
    }
}

// Play click sound
function playClickSound() {
    const audio = document.getElementById('clickSound');
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
    }
}

// Show notification
function showNotification(message, type) {
    const container = document.getElementById('notificationContainer');
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✅' : '❌'}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    container.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// Export for global access
window.profilePanel = {
    initialize: initializeProfile,
    getCurrentUser: getCurrentUser,
    updateProfileDisplay: updateProfileDisplay,
    toggleProfilePanel: toggleProfilePanel,
    openProfilePanel: openProfilePanel,
    closeProfilePanel: closeProfilePanel,
    logout: logout
}; 