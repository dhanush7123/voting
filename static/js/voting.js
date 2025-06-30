// ===========================================
// VOTING SYSTEM JAVASCRIPT
// ===========================================

// Theme Management (reused from script.js)
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

// Voting Form Management
class VotingForm {
    constructor() {
        this.form = document.getElementById('votingForm');
        this.voterIDInput = document.getElementById('voterID');
        this.votedVoters = new Set(); // Simulate voters who have already voted
        
        // Load existing voted voters from localStorage (simulating file storage)
        this.loadVotedVoters();
        
        this.init();
    }
    
    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleVoteSubmission();
            });
        }
        
        // Add form enhancements
        this.addFormEnhancements();
    }
    
    // Load voted voters from localStorage (simulating voters.txt)
    loadVotedVoters() {
        const votedVotersData = localStorage.getItem('votedVoters');
        if (votedVotersData) {
            const voters = JSON.parse(votedVotersData);
            this.votedVoters = new Set(voters);
        }
    }
    
    // Save voted voters to localStorage (simulating voters.txt)
    saveVotedVoters() {
        localStorage.setItem('votedVoters', JSON.stringify([...this.votedVoters]));
    }
    
    // Save vote to localStorage (simulating votes.txt)
    saveVoteToStorage(voterID, votes) {
        const existingVotes = JSON.parse(localStorage.getItem('votes') || '[]');
        const voteRecord = {
            voterID: voterID,
            timestamp: new Date().toISOString(),
            votes: votes
        };
        existingVotes.push(voteRecord);
        localStorage.setItem('votes', JSON.stringify(existingVotes));

        // --- NEW: Save to smartVotingVotes for homepage/results compatibility ---
        const smartVotingVotes = JSON.parse(localStorage.getItem('smartVotingVotes') || '[]');
        // votes: { principal: ..., vicePrincipal: ..., ... }
        Object.entries(votes).forEach(([categoryKey, candidateId]) => {
            // Map categoryKey to display name
            const categoryMap = {
                principal: 'Principal',
                vicePrincipal: 'Vice Principal',
                hodECE: 'HOD of ECE',
                deanAcademics: 'Dean - Academics',
                deanStudentAffairs: 'Dean - Student Affairs',
                crECEA: 'CR of EC-A'
            };
            const candidateNameMap = {
                Principal: { C1: 'Dr. Suresh Kumar', C2: 'Dr. Radha Sharma' },
                'Vice Principal': { C1: 'Prof. Prakash Singh', C2: 'Prof. Asha Patel' },
                'HOD of ECE': { C1: 'Dr. Kiran Reddy', C2: 'Dr. Vinay Kumar' },
                'Dean - Academics': { C1: 'Dr. Meera Iyer', C2: 'Prof. Rajesh Gupta' },
                'Dean - Student Affairs': { C1: 'Dr. Priya Sharma', C2: 'Prof. Amit Kumar' },
                'CR of EC-A': { C1: 'Rahul Singh', C2: 'Priya Patel' }
            };
            const category = categoryMap[categoryKey] || categoryKey;
            const candidateName = candidateNameMap[category]?.[candidateId] || candidateId;
            smartVotingVotes.push({
                voterId: voterID,
                category: category,
                candidateId: candidateId,
                candidateName: candidateName,
                timestamp: new Date().toISOString(),
                hash: '' // Optionally generate a hash if needed
            });
        });
        localStorage.setItem('smartVotingVotes', JSON.stringify(smartVotingVotes));
    }
    
    async handleVoteSubmission() {
        const formData = new FormData(this.form);
        const voterID = formData.get('voterID');
        
        // Validate voter ID
        if (!voterID.trim()) {
            this.showNotification('Please enter a valid Voter ID.', 'error');
            return;
        }
        
        // Check if voter has already voted
        if (this.votedVoters.has(voterID)) {
            this.showNotification('You have already voted! Each voter can only vote once.', 'error');
            return;
        }
        
        // Collect all votes
        const votes = {
            principal: formData.get('principal'),
            vicePrincipal: formData.get('vicePrincipal'),
            hodECE: formData.get('hodECE'),
            deanAcademics: formData.get('deanAcademics'),
            deanStudentAffairs: formData.get('deanStudentAffairs'),
            crECEA: formData.get('crECEA')
        };
        
        // Validate that all positions have been voted for
        const positions = Object.keys(votes);
        const missingVotes = positions.filter(pos => !votes[pos]);
        
        if (missingVotes.length > 0) {
            this.showNotification('Please select candidates for all positions before submitting.', 'error');
            return;
        }
        
        // Show loading state
        this.showLoadingState();
        
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Save the vote
            this.saveVoteToStorage(voterID, votes);
            
            // Mark voter as voted
            this.votedVoters.add(voterID);
            this.saveVotedVoters();
            
            // Show success message
            this.showSuccessMessage();
            
            // Reset form
            this.form.reset();
            
        } catch (error) {
            this.showNotification('An error occurred while submitting your vote. Please try again.', 'error');
        } finally {
            this.hideLoadingState();
        }
    }
    
    showLoadingState() {
        const button = this.form.querySelector('.voting-btn');
        const btnText = button.querySelector('.btn-text');
        const btnLoader = button.querySelector('.btn-loader');
        
        btnText.style.display = 'none';
        btnLoader.style.display = 'block';
        button.disabled = true;
    }
    
    hideLoadingState() {
        const button = this.form.querySelector('.voting-btn');
        const btnText = button.querySelector('.btn-text');
        const btnLoader = button.querySelector('.btn-loader');
        
        btnText.style.display = 'block';
        btnLoader.style.display = 'none';
        button.disabled = false;
    }
    
    showSuccessMessage() {
        this.showNotification('🎉 Your vote has been cast successfully! Thank you for participating in the RV College of Engineering elections.', 'success');
    }
    
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
            max-width: 90%;
            text-align: center;
        `;
        
        // Add animation keyframes
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateX(-50%) translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(-50%) translateY(0);
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Add to page
        document.body.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
    
    addFormEnhancements() {
        // Add focus effects to form elements
        const formElements = this.form.querySelectorAll('.form-input, .form-select');
        
        formElements.forEach(element => {
            element.addEventListener('focus', () => {
                element.parentElement.classList.add('focused');
            });
            
            element.addEventListener('blur', () => {
                element.parentElement.classList.remove('focused');
            });
        });
    }
}

// Results Modal Management
class ResultsModal {
    constructor() {
        this.modal = document.getElementById('resultsModal');
        this.closeBtn = document.querySelector('.close');
        this.viewResultsBtn = document.getElementById('viewResults');
        this.resultsContent = document.getElementById('resultsContent');
        
        this.init();
    }
    
    init() {
        if (this.viewResultsBtn) {
            this.viewResultsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showResults();
            });
        }
        
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => {
                this.hideModal();
            });
        }
        
        // Close modal when clicking outside
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.hideModal();
                }
            });
        }
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'block') {
                this.hideModal();
            }
        });
    }
    
    showResults() {
        const results = this.calculateResults();
        this.displayResults(results);
        this.showModal();
    }
    
    calculateResults() {
        const votes = JSON.parse(localStorage.getItem('votes') || '[]');
        const results = {
            'Principal': { 'C1': 0, 'C2': 0 },
            'Vice Principal': { 'C1': 0, 'C2': 0 },
            'HOD of ECE': { 'C1': 0, 'C2': 0 },
            'Dean - Academics': { 'C1': 0, 'C2': 0 },
            'Dean - Student Affairs': { 'C1': 0, 'C2': 0 },
            'CR - ECE-A Section': { 'C1': 0, 'C2': 0 }
        };
        
        // Count votes for each position
        votes.forEach(voteRecord => {
            const voteData = voteRecord.votes;
            
            if (voteData.principal) results['Principal'][voteData.principal]++;
            if (voteData.vicePrincipal) results['Vice Principal'][voteData.vicePrincipal]++;
            if (voteData.hodECE) results['HOD of ECE'][voteData.hodECE]++;
            if (voteData.deanAcademics) results['Dean - Academics'][voteData.deanAcademics]++;
            if (voteData.deanStudentAffairs) results['Dean - Student Affairs'][voteData.deanStudentAffairs]++;
            if (voteData.crECEA) results['CR - ECE-A Section'][voteData.crECEA]++;
        });
        
        return results;
    }
    
    displayResults(results) {
        const candidateNames = {
            'Principal': { 'C1': 'Dr. Suresh Kumar', 'C2': 'Dr. Radha Sharma' },
            'Vice Principal': { 'C1': 'Prof. Prakash Singh', 'C2': 'Prof. Asha Patel' },
            'HOD of ECE': { 'C1': 'Dr. Kiran Reddy', 'C2': 'Dr. Vinay Kumar' },
            'Dean - Academics': { 'C1': 'Dr. Meera Iyer', 'C2': 'Prof. Rajesh Gupta' },
            'Dean - Student Affairs': { 'C1': 'Dr. Priya Sharma', 'C2': 'Prof. Amit Kumar' },
            'CR - ECE-A Section': { 'C1': 'Rahul Singh', 'C2': 'Priya Patel' }
        };
        
        let html = '';
        
        Object.entries(results).forEach(([position, candidates]) => {
            html += `
                <div class="results-section">
                    <h3>${position}</h3>
            `;
            
            Object.entries(candidates).forEach(([candidateID, voteCount]) => {
                const candidateName = candidateNames[position][candidateID];
                html += `
                    <div class="candidate-result">
                        <span class="candidate-name">${candidateName} (${candidateID})</span>
                        <span class="vote-count">${voteCount} votes</span>
                    </div>
                `;
            });
            
            html += '</div>';
        });
        
        // Add total votes count
        const totalVotes = JSON.parse(localStorage.getItem('votes') || '[]').length;
        html += `
            <div class="results-section">
                <h3>Summary</h3>
                <div class="candidate-result">
                    <span class="candidate-name">Total Votes Cast</span>
                    <span class="vote-count">${totalVotes} votes</span>
                </div>
            </div>
        `;
        
        this.resultsContent.innerHTML = html;
    }
    
    showModal() {
        this.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    hideModal() {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
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

// Migration: Convert old 'votes' to 'smartVotingVotes' format if needed
function migrateVotesToSmartVotingVotes() {
    const oldVotes = JSON.parse(localStorage.getItem('votes') || '[]');
    let smartVotingVotes = JSON.parse(localStorage.getItem('smartVotingVotes') || '[]');
    // Only migrate if smartVotingVotes is empty and oldVotes exist
    if (oldVotes.length > 0 && smartVotingVotes.length === 0) {
        oldVotes.forEach(voteRecord => {
            const voterID = voteRecord.voterID;
            const votes = voteRecord.votes;
            const timestamp = voteRecord.timestamp;
            const categoryMap = {
                principal: 'Principal',
                vicePrincipal: 'Vice Principal',
                hodECE: 'HOD of ECE',
                deanAcademics: 'Dean - Academics',
                deanStudentAffairs: 'Dean - Student Affairs',
                crECEA: 'CR of EC-A'
            };
            const candidateNameMap = {
                Principal: { C1: 'Dr. Suresh Kumar', C2: 'Dr. Radha Sharma' },
                'Vice Principal': { C1: 'Prof. Prakash Singh', C2: 'Prof. Asha Patel' },
                'HOD of ECE': { C1: 'Dr. Kiran Reddy', C2: 'Dr. Vinay Kumar' },
                'Dean - Academics': { C1: 'Dr. Meera Iyer', C2: 'Prof. Rajesh Gupta' },
                'Dean - Student Affairs': { C1: 'Dr. Priya Sharma', C2: 'Prof. Amit Kumar' },
                'CR of EC-A': { C1: 'Rahul Singh', C2: 'Priya Patel' }
            };
            Object.entries(votes).forEach(([categoryKey, candidateId]) => {
                const category = categoryMap[categoryKey] || categoryKey;
                const candidateName = candidateNameMap[category]?.[candidateId] || candidateId;
                smartVotingVotes.push({
                    voterId: voterID,
                    category: category,
                    candidateId: candidateId,
                    candidateName: candidateName,
                    timestamp: timestamp,
                    hash: ''
                });
            });
        });
        localStorage.setItem('smartVotingVotes', JSON.stringify(smartVotingVotes));
    }
}

// Call migration on page load
migrateVotesToSmartVotingVotes();

// Initialize all features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme management
    new ThemeManager();
    
    // Initialize voting form
    new VotingForm();
    
    // Initialize results modal
    new ResultsModal();
    
    // Initialize page transitions
    new PageTransitions();
}); 