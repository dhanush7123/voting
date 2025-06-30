// ===========================================
// SMART VOTING SYSTEM - MAIN APPLICATION
// RV College of Engineering
// ===========================================

// ===========================================
// ADVANCED DATA STRUCTURES
// ===========================================

// Hash Table Class for Vote Storage with Collision Handling
class HashTable {
    constructor(size = 100) {
        this.size = size;
        this.table = new Array(size).fill(null).map(() => []);
        this.count = 0;
    }

    // Hash function using DJB2 algorithm
    hash(key) {
        let hash = 5381;
        for (let i = 0; i < key.length; i++) {
            hash = ((hash << 5) + hash) + key.charCodeAt(i);
        }
        return Math.abs(hash) % this.size;
    }

    // Insert with collision handling using chaining
    insert(key, value) {
        const index = this.hash(key);
        const bucket = this.table[index];
        
        // Check if key already exists
        const existingIndex = bucket.findIndex(item => item.key === key);
        if (existingIndex !== -1) {
            bucket[existingIndex].value = value;
        } else {
            bucket.push({ key, value, timestamp: Date.now() });
            this.count++;
        }
        
        // Log for blockchain simulation
        this.logToBlockchain('INSERT', key, value);
        
        return true;
    }

    // Get value by key
    get(key) {
        const index = this.hash(key);
        const bucket = this.table[index];
        const item = bucket.find(item => item.key === key);
        return item ? item.value : null;
    }

    // Remove key-value pair
    remove(key) {
        const index = this.hash(key);
        const bucket = this.table[index];
        const itemIndex = bucket.findIndex(item => item.key === key);
        
        if (itemIndex !== -1) {
            const removedItem = bucket.splice(itemIndex, 1)[0];
            this.count--;
            this.logToBlockchain('REMOVE', key, removedItem.value);
            return removedItem.value;
        }
        
        return null;
    }

    // Get all entries
    getAll() {
        const entries = [];
        for (let bucket of this.table) {
            entries.push(...bucket);
        }
        return entries;
    }

    // Get load factor
    getLoadFactor() {
        return this.count / this.size;
    }

    // Resize table if load factor is too high
    resize() {
        if (this.getLoadFactor() > 0.75) {
            const oldTable = this.table;
            this.size *= 2;
            this.table = new Array(this.size).fill(null).map(() => []);
            this.count = 0;
            
            for (let bucket of oldTable) {
                for (let item of bucket) {
                    this.insert(item.key, item.value);
                }
            }
        }
    }

    // Log operations to blockchain
    logToBlockchain(operation, key, value) {
        const block = {
            operation,
            key,
            value,
            timestamp: Date.now(),
            hash: this.generateHash(operation + key + value + Date.now())
        };
        
        // Store in blockchain simulation
        this.addToBlockchain(block);
    }

    // Simple hash generation
    generateHash(data) {
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            const char = data.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString(16);
    }

    // Add to blockchain
    addToBlockchain(block) {
        const blockchain = JSON.parse(localStorage.getItem('votingBlockchain') || '[]');
        block.previousHash = blockchain.length > 0 ? blockchain[blockchain.length - 1].hash : '0000000000000000';
        blockchain.push(block);
        localStorage.setItem('votingBlockchain', JSON.stringify(blockchain));
    }
}

// Graph Structure for Position Dependencies
class VotingGraph {
    constructor() {
        this.adjacencyList = new Map();
        this.positions = new Set();
    }

    // Add position to graph
    addPosition(position) {
        if (!this.adjacencyList.has(position)) {
            this.adjacencyList.set(position, []);
            this.positions.add(position);
        }
    }

    // Add dependency between positions
    addDependency(from, to) {
        this.addPosition(from);
        this.addPosition(to);
        this.adjacencyList.get(from).push(to);
    }

    // Get dependencies for a position
    getDependencies(position) {
        return this.adjacencyList.get(position) || [];
    }

    // Check if position has dependencies
    hasDependencies(position) {
        return this.getDependencies(position).length > 0;
    }

    // Get all positions
    getAllPositions() {
        return Array.from(this.positions);
    }

    // Topological sort for voting order
    topologicalSort() {
        const visited = new Set();
        const temp = new Set();
        const order = [];

        const visit = (position) => {
            if (temp.has(position)) {
                throw new Error('Circular dependency detected');
            }
            if (visited.has(position)) {
                return;
            }

            temp.add(position);
            for (let dependency of this.getDependencies(position)) {
                visit(dependency);
            }
            temp.delete(position);
            visited.add(position);
            order.unshift(position);
        };

        for (let position of this.getAllPositions()) {
            if (!visited.has(position)) {
                visit(position);
            }
        }

        return order;
    }
}

// Priority Queue for Vote Counting
class PriorityQueue {
    constructor() {
        this.queue = [];
    }

    // Enqueue with priority
    enqueue(item, priority) {
        this.queue.push({ item, priority });
        this.queue.sort((a, b) => b.priority - a.priority); // Max heap
    }

    // Dequeue highest priority item
    dequeue() {
        return this.queue.shift()?.item;
    }

    // Peek at highest priority item
    peek() {
        return this.queue[0]?.item;
    }

    // Get queue size
    size() {
        return this.queue.length;
    }

    // Check if queue is empty
    isEmpty() {
        return this.queue.length === 0;
    }

    // Get all items sorted by priority
    getAll() {
        return this.queue.map(entry => entry.item);
    }
}

// ===========================================
// MAIN VOTING SYSTEM CLASS
// ===========================================

class SmartVotingSystem {
    constructor() {
        this.voteHashTable = new HashTable(200);
        this.positionGraph = new VotingGraph();
        this.voteQueue = new PriorityQueue();
        this.currentUser = null;
        this.voteHistory = [];
        
        this.initializeSystem();
    }

    // Initialize the voting system
    initializeSystem() {
        // Initialize position graph with dependencies
        this.initializePositionGraph();
        
        // Load existing data
        this.loadExistingData();
        
        // Set up event listeners
        this.setupEventListeners();
        
        console.log('Smart Voting System initialized successfully!');
    }

    // Initialize position dependencies
    initializePositionGraph() {
        const positions = [
            'Principal',
            'Vice Principal', 
            'HOD of ECE',
            'Dean - Academics',
            'Dean - Student Affairs',
            'CR of EC-A'
        ];

        positions.forEach(position => {
            this.positionGraph.addPosition(position);
        });

        // Add some logical dependencies (e.g., Dean positions might depend on Principal)
        this.positionGraph.addDependency('Dean - Academics', 'Principal');
        this.positionGraph.addDependency('Dean - Student Affairs', 'Principal');
        this.positionGraph.addDependency('HOD of ECE', 'Vice Principal');
    }

    // Load existing data from localStorage
    loadExistingData() {
        // Load vote history
        const savedVotes = localStorage.getItem('smartVotingVotes');
        if (savedVotes) {
            this.voteHistory = JSON.parse(savedVotes);
            
            // Populate hash table with existing votes
            this.voteHistory.forEach(vote => {
                const key = `${vote.voterId}_${vote.category}`;
                this.voteHashTable.insert(key, vote);
            });
        }

        // Load user data
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
        }
    }

    // Set up event listeners
    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Category card clicks - only on home page, not results page
        if (!window.location.pathname.includes('/results')) {
            const categoryCards = document.querySelectorAll('.category-card');
            categoryCards.forEach(card => {
                card.addEventListener('click', (e) => {
                    const category = card.getAttribute('data-category');
                    this.handleCategoryClick(category, card);
                });
            });
        }

        // Form submissions
        const voteForms = document.querySelectorAll('form');
        voteForms.forEach(form => {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        });
    }

    // Handle category card clicks
    handleCategoryClick(category, card) {
        // Add visual feedback
        card.classList.add('card-clicked');
        
        // Store selected category
        localStorage.setItem('selectedCategory', category);
        
        // Navigate to candidate selection
        setTimeout(() => {
            window.location.href = '/candidate';
        }, 300);
    }

    // Handle form submissions
    handleFormSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);
        
        // Process the form data
        this.processFormData(data, event.target);
    }

    // Process form data
    processFormData(data, form) {
        // Validate form data
        if (!this.validateFormData(data)) {
            this.showNotification('Please fill in all required fields.', 'error');
            return false;
        }

        // Process based on form type
        const formType = form.getAttribute('data-form-type');
        
        switch (formType) {
            case 'vote':
                return this.processVote(data);
            case 'login':
                return this.processLogin(data);
            case 'signup':
                return this.processSignup(data);
            default:
                console.warn('Unknown form type:', formType);
                return false;
        }
    }

    // Validate form data
    validateFormData(data) {
        for (let key in data) {
            if (data[key] === '' || data[key] === null || data[key] === undefined) {
                return false;
            }
        }
        return true;
    }

    // Process vote
    processVote(voteData) {
        if (!this.currentUser) {
            this.showNotification('Please login to vote.', 'error');
            return false;
        }

        const voteKey = `${this.currentUser.username}_${voteData.category}`;
        
        // Check if user has already voted for this category
        if (this.voteHashTable.get(voteKey)) {
            this.showNotification('You have already voted for this category.', 'error');
            return false;
        }

        // Create vote object
        const vote = {
            voterId: this.currentUser.username,
            category: voteData.category,
            candidateId: voteData.candidateId,
            candidateName: voteData.candidateName,
            timestamp: new Date().toISOString(),
            hash: this.generateVoteHash(voteData)
        };

        // Store vote in hash table
        this.voteHashTable.insert(voteKey, vote);
        
        // Add to vote history
        this.voteHistory.push(vote);
        localStorage.setItem('smartVotingVotes', JSON.stringify(this.voteHistory));
        
        // Add to priority queue for counting
        this.voteQueue.enqueue(vote, Date.now());
        
        // Mark category as voted
        const votedCategories = JSON.parse(localStorage.getItem('votedCategories') || '{}');
        votedCategories[voteKey] = true;
        localStorage.setItem('votedCategories', JSON.stringify(votedCategories));
        
        this.showNotification('🎉 Your vote has been cast successfully!', 'success');
        
        // Redirect after delay
        setTimeout(() => {
            window.location.href = '/login';
        }, 2000);
        
        return true;
    }

    // Process login
    processLogin(loginData) {
        const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const user = users.find(u => 
            (u.username === loginData.username || u.email === loginData.username) && 
            u.password === loginData.password
        );

        if (user) {
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.showNotification('Login successful!', 'success');
            
            setTimeout(() => {
                window.location.href = '/login';
            }, 1000);
            
            return true;
        } else {
            this.showNotification('Invalid username/email or password.', 'error');
            return false;
        }
    }

    // Process signup
    processSignup(signupData) {
        const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        
        // Check for duplicate username/email
        const existingUser = users.find(u => 
            u.username === signupData.username || u.email === signupData.email
        );

        if (existingUser) {
            this.showNotification('Username or email already exists.', 'error');
            return false;
        }

        // Create new user
        const newUser = {
            username: signupData.username,
            email: signupData.email,
            password: signupData.password,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('registeredUsers', JSON.stringify(users));
        
        this.showNotification('Account created successfully! Please login.', 'success');
        
        setTimeout(() => {
            window.location.href = '/login';
        }, 1500);
        
        return true;
    }

    // Generate vote hash
    generateVoteHash(voteData) {
        const data = `${voteData.voterId}_${voteData.category}_${voteData.candidateId}_${Date.now()}`;
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            const char = data.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(16);
    }

    // Toggle theme
    toggleTheme() {
        const body = document.body;
        const currentTheme = body.className.includes('dark') ? 'dark' : 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        body.className = `${newTheme}-mode`;
        localStorage.setItem('theme', newTheme);
        
        // Add theme change animation
        body.style.transition = 'all 0.3s ease-in-out';
        setTimeout(() => {
            body.style.transition = '';
        }, 300);
    }

    // Show notification
    showNotification(message, type = 'info') {
        const container = document.getElementById('notificationContainer') || 
                         document.createElement('div');
        
        if (!document.getElementById('notificationContainer')) {
            container.id = 'notificationContainer';
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getNotificationIcon(type)}</span>
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

    // Get notification icon
    getNotificationIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    }

    // Get voting statistics
    getVotingStatistics() {
        const totalVotes = this.voteHistory.length;
        const categories = this.positionGraph.getAllPositions();
        const stats = {};

        categories.forEach(category => {
            const categoryVotes = this.voteHistory.filter(vote => vote.category === category);
            stats[category] = {
                totalVotes: categoryVotes.length,
                candidates: this.getCandidateStats(categoryVotes)
            };
        });

        return {
            totalVotes,
            categories: stats,
            hashTableLoadFactor: this.voteHashTable.getLoadFactor(),
            blockchainSize: this.getBlockchainSize()
        };
    }

    // Get candidate statistics
    getCandidateStats(categoryVotes) {
        const candidateCounts = {};
        
        categoryVotes.forEach(vote => {
            candidateCounts[vote.candidateId] = (candidateCounts[vote.candidateId] || 0) + 1;
        });

        return Object.entries(candidateCounts)
            .map(([candidateId, votes]) => ({ candidateId, votes }))
            .sort((a, b) => b.votes - a.votes);
    }

    // Get blockchain size
    getBlockchainSize() {
        const blockchain = JSON.parse(localStorage.getItem('votingBlockchain') || '[]');
        return blockchain.length;
    }

    // Verify blockchain integrity
    verifyBlockchainIntegrity() {
        const blockchain = JSON.parse(localStorage.getItem('votingBlockchain') || '[]');
        
        for (let i = 1; i < blockchain.length; i++) {
            if (blockchain[i].previousHash !== blockchain[i-1].hash) {
                return false;
            }
        }
        
        return true;
    }

    // Export voting data
    exportVotingData() {
        const data = {
            statistics: this.getVotingStatistics(),
            voteHistory: this.voteHistory,
            blockchain: JSON.parse(localStorage.getItem('votingBlockchain') || '[]'),
            hashTableData: this.voteHashTable.getAll(),
            timestamp: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `voting-data-${Date.now()}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    }

    // Clear all data (for testing)
    clearAllData() {
        localStorage.removeItem('smartVotingVotes');
        localStorage.removeItem('votingBlockchain');
        localStorage.removeItem('votedCategories');
        localStorage.removeItem('currentUser');
        
        this.voteHistory = [];
        this.voteHashTable = new HashTable(200);
        this.voteQueue = new PriorityQueue();
        this.currentUser = null;
        
        this.showNotification('All data cleared successfully.', 'info');
    }
}

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

// Initialize the voting system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.votingSystem = new SmartVotingSystem();
    
    // THEME TOGGLE LOGIC FOR ALL PAGES
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    function updateThemeIcon(theme) {
        const sun = document.querySelector('.light-icon');
        const moon = document.querySelector('.dark-icon');
        if (sun && moon) {
            if (theme === 'dark') {
                sun.style.display = 'none';
                moon.style.display = 'inline';
            } else {
                sun.style.display = 'inline';
                moon.style.display = 'none';
            }
        }
    }
    // Set initial theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.className = `${savedTheme}-mode`;
    updateThemeIcon(savedTheme);
    // Toggle handler
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = body.className.includes('dark') ? 'dark' : 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            body.className = `${newTheme}-mode`;
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
            body.style.transition = 'all 0.3s ease-in-out';
            setTimeout(() => { body.style.transition = ''; }, 300);
        });
    }

    // Add loading animation
    document.body.classList.add('loaded');
});

// Global utility functions
window.VotingUtils = {
    // Format number with commas
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    // Format date
    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // Generate random ID
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    },

    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SmartVotingSystem, HashTable, VotingGraph, PriorityQueue };
} 