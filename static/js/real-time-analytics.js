// Real-time Analytics System for Smart Voting
class RealTimeAnalytics {
    constructor() {
        this.stats = {
            totalVotes: 0,
            categories: {},
            lastUpdate: new Date(),
            activeUsers: 0
        };
        
        this.updateInterval = null;
        this.initialize();
    }
    
    initialize() {
        console.log('Real-time Analytics initialized');
        this.loadStats();
        this.startUpdates();
    }
    
    loadStats() {
        try {
            // Load vote data from localStorage
            const voteData = localStorage.getItem('voteData');
            if (voteData) {
                const votes = JSON.parse(voteData);
                this.stats.totalVotes = votes.length || 0;
                
                // Calculate category-wise stats
                this.stats.categories = {};
                votes.forEach(vote => {
                    Object.keys(vote.positions).forEach(category => {
                        if (!this.stats.categories[category]) {
                            this.stats.categories[category] = {
                                totalVotes: 0,
                                candidates: {}
                            };
                        }
                        this.stats.categories[category].totalVotes++;
                        
                        const candidate = vote.positions[category];
                        if (!this.stats.categories[category].candidates[candidate]) {
                            this.stats.categories[category].candidates[candidate] = 0;
                        }
                        this.stats.categories[category].candidates[candidate]++;
                    });
                });
            }
            
            // Update active users (simulate)
            this.stats.activeUsers = Math.floor(Math.random() * 50) + 10;
            
        } catch (error) {
            console.error('Error loading analytics stats:', error);
        }
    }
    
    getCurrentStats() {
        return {
            ...this.stats,
            lastUpdate: new Date()
        };
    }
    
    getCategoryStats(category) {
        return this.stats.categories[category] || {
            totalVotes: 0,
            candidates: {}
        };
    }
    
    updateStats() {
        this.loadStats();
        this.stats.lastUpdate = new Date();
        
        // Trigger UI updates
        this.updateUI();
    }
    
    updateUI() {
        // Update total votes display
        const totalVotesElement = document.getElementById('totalVotes');
        if (totalVotesElement) {
            totalVotesElement.textContent = this.stats.totalVotes;
        }
        
        // Update category vote counts
        document.querySelectorAll('.category-card').forEach(card => {
            const category = card.getAttribute('data-category');
            const voteCountElement = card.querySelector('.vote-count');
            if (voteCountElement && this.stats.categories[category]) {
                voteCountElement.textContent = `${this.stats.categories[category].totalVotes} votes cast`;
            }
        });
        
        // Update active users
        const activeUsersElement = document.getElementById('activeUsers');
        if (activeUsersElement) {
            activeUsersElement.textContent = this.stats.activeUsers;
        }
    }
    
    startUpdates() {
        // Update stats every 5 seconds
        this.updateInterval = setInterval(() => {
            this.updateStats();
        }, 5000);
    }
    
    stopUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
    
    // Add a new vote to analytics
    addVote(voteData) {
        try {
            let votes = [];
            const existingVotes = localStorage.getItem('voteData');
            if (existingVotes) {
                votes = JSON.parse(existingVotes);
            }
            
            votes.push(voteData);
            localStorage.setItem('voteData', JSON.stringify(votes));
            
            // Update stats immediately
            this.updateStats();
            
        } catch (error) {
            console.error('Error adding vote to analytics:', error);
        }
    }
    
    // Get voting trends
    getVotingTrends() {
        const trends = {
            mostVotedCategory: null,
            leastVotedCategory: null,
            totalCategories: Object.keys(this.stats.categories).length,
            averageVotesPerCategory: 0
        };
        
        if (Object.keys(this.stats.categories).length > 0) {
            const voteCounts = Object.values(this.stats.categories).map(cat => cat.totalVotes);
            trends.averageVotesPerCategory = voteCounts.reduce((a, b) => a + b, 0) / voteCounts.length;
            
            const categories = Object.keys(this.stats.categories);
            const maxVotes = Math.max(...voteCounts);
            const minVotes = Math.min(...voteCounts);
            
            trends.mostVotedCategory = categories.find(cat => 
                this.stats.categories[cat].totalVotes === maxVotes
            );
            trends.leastVotedCategory = categories.find(cat => 
                this.stats.categories[cat].totalVotes === minVotes
            );
        }
        
        return trends;
    }
    
    // Export analytics data
    exportData() {
        return {
            stats: this.stats,
            trends: this.getVotingTrends(),
            exportTime: new Date().toISOString()
        };
    }
}

// Initialize global instance
window.realTimeAnalytics = new RealTimeAnalytics();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RealTimeAnalytics;
} 