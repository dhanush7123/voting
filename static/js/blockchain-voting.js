// Blockchain-Based Voting System with Advanced DSA
// CryptoJS library is required for hashing

class Block {
    constructor(timestamp, votes, previousHash = '') {
        this.timestamp = timestamp;
        this.votes = votes;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }
    
    calculateHash() {
        // Using a simple hash function (in production, use CryptoJS)
        const data = this.previousHash + this.timestamp + JSON.stringify(this.votes) + this.nonce;
        return this.simpleHash(data);
    }
    
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(16);
    }
    
    mineBlock(difficulty) {
        const target = Array(difficulty + 1).join("0");
        while (this.hash.substring(0, difficulty) !== target) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log(`Block mined: ${this.hash}`);
    }
}

class VotingBlockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingVotes = [];
        this.voteHistory = new Map();
    }
    
    createGenesisBlock() {
        return new Block(Date.now(), [], "0");
    }
    
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }
    
    addVote(vote) {
        // Validate vote
        if (!this.validateVote(vote)) {
            throw new Error('Invalid vote');
        }
        
        // Check for duplicate votes
        const voteKey = `${vote.voterId}_${vote.category}`;
        if (this.voteHistory.has(voteKey)) {
            throw new Error('Vote already exists');
        }
        
        this.pendingVotes.push(vote);
        this.voteHistory.set(voteKey, vote);
        
        // Mine block if we have enough votes or after timeout
        if (this.pendingVotes.length >= 5) {
            this.minePendingVotes();
        }
        
        return this.getLatestBlock().hash;
    }
    
    validateVote(vote) {
        return vote.voterId && vote.category && vote.candidateId && vote.timestamp;
    }
    
    minePendingVotes() {
        const block = new Block(Date.now(), this.pendingVotes, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);
        this.chain.push(block);
        this.pendingVotes = [];
        
        // Broadcast to all connected clients
        this.broadcastBlock(block);
    }
    
    broadcastBlock(block) {
        // In a real implementation, this would use WebSocket
        if (window.votingWebSocket) {
            window.votingWebSocket.send(JSON.stringify({
                type: 'new_block',
                data: block
            }));
        }
    }
    
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }
            
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
    
    getVoteCounts() {
        const counts = {};
        this.chain.forEach(block => {
            block.votes.forEach(vote => {
                const key = `${vote.category}_${vote.candidateId}`;
                counts[key] = (counts[key] || 0) + 1;
            });
        });
        return counts;
    }
    
    getVoteHistory(voterId) {
        const history = [];
        this.chain.forEach(block => {
            block.votes.forEach(vote => {
                if (vote.voterId === voterId) {
                    history.push(vote);
                }
            });
        });
        return history;
    }
}

// Advanced Data Structures

class CandidateGraph {
    constructor() {
        this.adjacencyList = new Map();
        this.candidates = new Set();
        this.relationships = new Map();
    }
    
    addCandidate(candidateId, candidateData) {
        this.candidates.add(candidateId);
        this.adjacencyList.set(candidateId, []);
        this.relationships.set(candidateId, candidateData);
    }
    
    addRelationship(candidate1, candidate2, relationshipType, weight = 1) {
        if (!this.adjacencyList.has(candidate1)) {
            this.adjacencyList.set(candidate1, []);
        }
        if (!this.adjacencyList.has(candidate2)) {
            this.adjacencyList.set(candidate2, []);
        }
        
        this.adjacencyList.get(candidate1).push({
            candidate: candidate2,
            type: relationshipType,
            weight: weight
        });
        
        this.adjacencyList.get(candidate2).push({
            candidate: candidate1,
            type: relationshipType,
            weight: weight
        });
    }
    
    findSimilarCandidates(candidateId, maxDistance = 2) {
        const visited = new Set();
        const queue = [{ candidate: candidateId, distance: 0 }];
        const similar = [];
        
        while (queue.length > 0) {
            const { candidate, distance } = queue.shift();
            if (visited.has(candidate) || distance > maxDistance) continue;
            visited.add(candidate);
            
            if (distance > 0) {
                similar.push(candidate);
            }
            
            const neighbors = this.adjacencyList.get(candidate) || [];
            neighbors.forEach(neighbor => {
                if (!visited.has(neighbor.candidate)) {
                    queue.push({ candidate: neighbor.candidate, distance: distance + 1 });
                }
            });
        }
        return similar;
    }
    
    getCandidateNetwork() {
        const network = {
            nodes: [],
            edges: []
        };
        
        this.candidates.forEach(candidateId => {
            network.nodes.push({
                id: candidateId,
                ...this.relationships.get(candidateId)
            });
        });
        
        this.adjacencyList.forEach((neighbors, candidateId) => {
            neighbors.forEach(neighbor => {
                network.edges.push({
                    source: candidateId,
                    target: neighbor.candidate,
                    type: neighbor.type,
                    weight: neighbor.weight
                });
            });
        });
        
        return network;
    }
}

class CandidateTrie {
    constructor() {
        this.root = new TrieNode();
    }
    
    insert(candidateName, candidateData) {
        let node = this.root;
        for (let char of candidateName.toLowerCase()) {
            if (!node.children.has(char)) {
                node.children.set(char, new TrieNode());
            }
            node = node.children.get(char);
        }
        node.isEndOfWord = true;
        node.candidateData = candidateData;
    }
    
    search(prefix) {
        let node = this.root;
        for (let char of prefix.toLowerCase()) {
            if (!node.children.has(char)) {
                return [];
            }
            node = node.children.get(char);
        }
        return this.getAllWords(node, prefix);
    }
    
    getAllWords(node, prefix) {
        const results = [];
        if (node.isEndOfWord) {
            results.push({ name: prefix, data: node.candidateData });
        }
        for (let [char, childNode] of node.children) {
            results.push(...this.getAllWords(childNode, prefix + char));
        }
        return results;
    }
    
    autocomplete(prefix, maxResults = 5) {
        const results = this.search(prefix);
        return results.slice(0, maxResults);
    }
}

class TrieNode {
    constructor() {
        this.children = new Map();
        this.isEndOfWord = false;
        this.candidateData = null;
    }
}

// Ranked Choice Voting Implementation

class RankedChoiceVoting {
    constructor() {
        this.candidates = new Map();
        this.votes = [];
        this.rounds = [];
        this.results = [];
    }
    
    addCandidate(candidateId, candidateName) {
        this.candidates.set(candidateId, candidateName);
    }
    
    addVote(rankedChoices) {
        if (this.validateRankedChoices(rankedChoices)) {
            this.votes.push(rankedChoices);
        } else {
            throw new Error('Invalid ranked choices');
        }
    }
    
    validateRankedChoices(choices) {
        const validCandidates = new Set(this.candidates.keys());
        const usedCandidates = new Set();
        
        for (let choice of choices) {
            if (!validCandidates.has(choice) || usedCandidates.has(choice)) {
                return false;
            }
            usedCandidates.add(choice);
        }
        
        return choices.length > 0;
    }
    
    calculateWinner() {
        let currentVotes = [...this.votes];
        let eliminatedCandidates = new Set();
        let round = 1;
        
        while (true) {
            const voteCounts = this.countFirstChoiceVotes(currentVotes, eliminatedCandidates);
            const totalVotes = Object.values(voteCounts).reduce((a, b) => a + b, 0);
            const majority = Math.floor(totalVotes / 2) + 1;
            
            // Record round results
            this.rounds.push({
                round: round,
                voteCounts: { ...voteCounts },
                totalVotes: totalVotes,
                majority: majority,
                eliminated: Array.from(eliminatedCandidates)
            });
            
            // Check for winner
            for (let [candidate, votes] of Object.entries(voteCounts)) {
                if (votes >= majority) {
                    this.results.push({
                        winner: candidate,
                        winnerName: this.candidates.get(candidate),
                        finalVotes: votes,
                        totalVotes: totalVotes,
                        rounds: this.rounds
                    });
                    return candidate;
                }
            }
            
            // Eliminate lowest candidate
            const lowestCandidate = this.findLowestCandidate(voteCounts);
            eliminatedCandidates.add(lowestCandidate);
            
            // Redistribute votes
            currentVotes = this.redistributeVotes(currentVotes, lowestCandidate);
            
            if (eliminatedCandidates.size >= this.candidates.size - 1) {
                // Last candidate remaining
                const remainingCandidates = Array.from(this.candidates.keys())
                    .filter(c => !eliminatedCandidates.has(c));
                if (remainingCandidates.length === 1) {
                    const winner = remainingCandidates[0];
                    this.results.push({
                        winner: winner,
                        winnerName: this.candidates.get(winner),
                        finalVotes: voteCounts[winner] || 0,
                        totalVotes: totalVotes,
                        rounds: this.rounds
                    });
                    return winner;
                }
                break;
            }
            
            round++;
        }
        
        return null;
    }
    
    countFirstChoiceVotes(votes, eliminated) {
        const counts = {};
        votes.forEach(vote => {
            const firstChoice = vote.find(choice => !eliminated.has(choice));
            if (firstChoice) {
                counts[firstChoice] = (counts[firstChoice] || 0) + 1;
            }
        });
        return counts;
    }
    
    findLowestCandidate(voteCounts) {
        let lowestCandidate = null;
        let lowestVotes = Infinity;
        
        for (let [candidate, votes] of Object.entries(voteCounts)) {
            if (votes < lowestVotes) {
                lowestVotes = votes;
                lowestCandidate = candidate;
            }
        }
        
        return lowestCandidate;
    }
    
    redistributeVotes(votes, eliminatedCandidate) {
        return votes.map(vote => {
            const newVote = vote.filter(choice => choice !== eliminatedCandidate);
            return newVote.length > 0 ? newVote : vote;
        });
    }
    
    getResults() {
        return this.results;
    }
    
    getRoundResults() {
        return this.rounds;
    }
}

// Initialize global instances
window.votingBlockchain = new VotingBlockchain();
window.candidateGraph = new CandidateGraph();
window.candidateTrie = new CandidateTrie();
window.rankedChoiceVoting = new RankedChoiceVoting();

// Export for use in other modules
window.BlockchainVoting = {
    VotingBlockchain,
    CandidateGraph,
    CandidateTrie,
    RankedChoiceVoting,
    Block
}; 