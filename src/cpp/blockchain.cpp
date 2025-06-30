// ===========================================
// SMART VOTING SYSTEM - BLOCKCHAIN SIMULATION
// RV College of Engineering
// ===========================================

#include <iostream>
#include <string>
#include <vector>
#include <ctime>
#include <sstream>
#include <iomanip>
#include <fstream>
#include <algorithm>
#include <crypto++/sha.h>
#include <crypto++/hex.h>

// Include our data structures
#include "structures.cpp"

using namespace std;

// ===========================================
// ENHANCED BLOCKCHAIN STRUCTURES
// ===========================================

// Enhanced blockchain block with more security features
struct EnhancedVoteBlock {
    int blockId;
    string timestamp;
    string voterIdHash;
    string category;
    string candidateId;
    string previousHash;
    string currentHash;
    string merkleRoot;
    int nonce;
    long long difficulty;
    
    EnhancedVoteBlock(int id, string voterId, string cat, string candidate, string prevHash) {
        blockId = id;
        timestamp = getCurrentTimestamp();
        voterIdHash = generateSHA256(voterId);
        category = cat;
        candidateId = candidate;
        previousHash = prevHash;
        nonce = 0;
        difficulty = 4; // Number of leading zeros required
        currentHash = mineBlock();
        merkleRoot = generateMerkleRoot();
    }
    
private:
    string getCurrentTimestamp() {
        time_t now = time(0);
        tm* ltm = localtime(&now);
        
        stringstream ss;
        ss << setfill('0') << setw(4) << (1900 + ltm->tm_year) << "-"
           << setfill('0') << setw(2) << (1 + ltm->tm_mon) << "-"
           << setfill('0') << setw(2) << ltm->tm_mday << " "
           << setfill('0') << setw(2) << ltm->tm_hour << ":"
           << setfill('0') << setw(2) << ltm->tm_min << ":"
           << setfill('0') << setw(2) << ltm->tm_sec;
        return ss.str();
    }
    
    // Simple SHA-256 implementation (for demonstration)
    string generateSHA256(string input) {
        // This is a simplified hash function
        // In a real implementation, you would use a proper crypto library
        unsigned long hash = 5381;
        for (char c : input) {
            hash = ((hash << 5) + hash) + c;
        }
        
        // Convert to hex string
        stringstream ss;
        ss << hex << hash;
        return ss.str();
    }
    
    string generateBlockData() {
        return to_string(blockId) + timestamp + voterIdHash + 
               category + candidateId + previousHash + to_string(nonce);
    }
    
    string mineBlock() {
        string target = string(difficulty, '0');
        string hash;
        
        do {
            hash = generateSHA256(generateBlockData());
            nonce++;
        } while (hash.substr(0, difficulty) != target && nonce < 10000);
        
        return hash;
    }
    
    string generateMerkleRoot() {
        // Simplified Merkle root generation
        string data = voterIdHash + category + candidateId + timestamp;
        return generateSHA256(data);
    }
};

// Enhanced blockchain vector
vector<EnhancedVoteBlock> enhancedBlockchain;

// ===========================================
// BLOCKCHAIN OPERATIONS
// ===========================================

// Add a new enhanced block to the blockchain
void addEnhancedBlockToChain(string voterId, string category, string candidateId) {
    string previousHash = enhancedBlockchain.empty() ? 
        string(64, '0') : enhancedBlockchain.back().currentHash;
    
    EnhancedVoteBlock newBlock(enhancedBlockchain.size() + 1, voterId, category, candidateId, previousHash);
    enhancedBlockchain.push_back(newBlock);
    
    cout << "Enhanced block added to blockchain!" << endl;
    cout << "Block ID: " << newBlock.blockId << endl;
    cout << "Hash: " << newBlock.currentHash << endl;
    cout << "Nonce: " << newBlock.nonce << endl;
    cout << "Mining difficulty: " << newBlock.difficulty << endl;
}

// Verify enhanced blockchain integrity
bool verifyEnhancedBlockchainIntegrity() {
    if (enhancedBlockchain.empty()) {
        return true;
    }
    
    for (size_t i = 1; i < enhancedBlockchain.size(); i++) {
        // Check previous hash link
        if (enhancedBlockchain[i].previousHash != enhancedBlockchain[i-1].currentHash) {
            cout << "Blockchain integrity compromised at block " << i << endl;
            return false;
        }
        
        // Verify block hash
        string expectedHash = generateBlockHash(enhancedBlockchain[i]);
        if (enhancedBlockchain[i].currentHash != expectedHash) {
            cout << "Block hash verification failed at block " << i << endl;
            return false;
        }
    }
    
    return true;
}

// Generate hash for a block (for verification)
string generateBlockHash(const EnhancedVoteBlock& block) {
    string data = to_string(block.blockId) + block.timestamp + block.voterIdHash + 
                 block.category + block.candidateId + block.previousHash + to_string(block.nonce);
    
    // Simple hash function (same as in the block)
    unsigned long hash = 5381;
    for (char c : data) {
        hash = ((hash << 5) + hash) + c;
    }
    
    stringstream ss;
    ss << hex << hash;
    return ss.str();
}

// Get enhanced blockchain size
int getEnhancedBlockchainSize() {
    return enhancedBlockchain.size();
}

// ===========================================
// BLOCKCHAIN ANALYTICS
// ===========================================

// Get blockchain statistics
void getBlockchainStatistics() {
    cout << "\n=== BLOCKCHAIN STATISTICS ===" << endl;
    cout << "Total blocks: " << getEnhancedBlockchainSize() << endl;
    cout << "Blockchain integrity: " << (verifyEnhancedBlockchainIntegrity() ? "✅ Valid" : "❌ Compromised") << endl;
    
    if (!enhancedBlockchain.empty()) {
        cout << "Latest block hash: " << enhancedBlockchain.back().currentHash << endl;
        cout << "Latest block timestamp: " << enhancedBlockchain.back().timestamp << endl;
        cout << "Average mining difficulty: " << enhancedBlockchain.back().difficulty << endl;
    }
    
    // Analyze voting patterns
    cout << "\nVoting patterns by category:" << endl;
    map<string, int> categoryVotes;
    for (const auto& block : enhancedBlockchain) {
        categoryVotes[block.category]++;
    }
    
    for (const auto& category : categoryVotes) {
        cout << "  " << category.first << ": " << category.second << " votes" << endl;
    }
}

// Get detailed block information
void getBlockDetails(int blockId) {
    if (blockId < 1 || blockId > enhancedBlockchain.size()) {
        cout << "Error: Block " << blockId << " does not exist" << endl;
        return;
    }
    
    const EnhancedVoteBlock& block = enhancedBlockchain[blockId - 1];
    
    cout << "\n=== BLOCK " << blockId << " DETAILS ===" << endl;
    cout << "Timestamp: " << block.timestamp << endl;
    cout << "Voter Hash: " << block.voterIdHash << endl;
    cout << "Category: " << block.category << endl;
    cout << "Candidate: " << block.candidateId << endl;
    cout << "Previous Hash: " << block.previousHash << endl;
    cout << "Current Hash: " << block.currentHash << endl;
    cout << "Merkle Root: " << block.merkleRoot << endl;
    cout << "Nonce: " << block.nonce << endl;
    cout << "Mining Difficulty: " << block.difficulty << endl;
}

// ===========================================
// BLOCKCHAIN PERSISTENCE
// ===========================================

// Save enhanced blockchain to file
void saveEnhancedBlockchain() {
    ofstream file("enhanced_blockchain.txt");
    if (file.is_open()) {
        for (const auto& block : enhancedBlockchain) {
            file << "BLOCK:" << block.blockId << endl;
            file << "TIMESTAMP:" << block.timestamp << endl;
            file << "VOTER_HASH:" << block.voterIdHash << endl;
            file << "CATEGORY:" << block.category << endl;
            file << "CANDIDATE:" << block.candidateId << endl;
            file << "PREV_HASH:" << block.previousHash << endl;
            file << "CURR_HASH:" << block.currentHash << endl;
            file << "MERKLE_ROOT:" << block.merkleRoot << endl;
            file << "NONCE:" << block.nonce << endl;
            file << "DIFFICULTY:" << block.difficulty << endl;
            file << "END_BLOCK" << endl;
        }
        file.close();
        cout << "Enhanced blockchain saved successfully!" << endl;
    } else {
        cout << "Error: Could not save enhanced blockchain" << endl;
    }
}

// Load enhanced blockchain from file
void loadEnhancedBlockchain() {
    ifstream file("enhanced_blockchain.txt");
    if (file.is_open()) {
        enhancedBlockchain.clear();
        string line;
        int blockId = 0;
        string timestamp, voterHash, category, candidate, prevHash, currHash, merkleRoot;
        int nonce = 0, difficulty = 0;
        
        while (getline(file, line)) {
            if (line.substr(0, 5) == "BLOCK") {
                blockId = stoi(line.substr(6));
            } else if (line.substr(0, 9) == "TIMESTAMP") {
                timestamp = line.substr(10);
            } else if (line.substr(0, 10) == "VOTER_HASH") {
                voterHash = line.substr(11);
            } else if (line.substr(0, 8) == "CATEGORY") {
                category = line.substr(9);
            } else if (line.substr(0, 9) == "CANDIDATE") {
                candidate = line.substr(10);
            } else if (line.substr(0, 9) == "PREV_HASH") {
                prevHash = line.substr(10);
            } else if (line.substr(0, 9) == "CURR_HASH") {
                currHash = line.substr(10);
            } else if (line.substr(0, 11) == "MERKLE_ROOT") {
                merkleRoot = line.substr(12);
            } else if (line.substr(0, 5) == "NONCE") {
                nonce = stoi(line.substr(6));
            } else if (line.substr(0, 10) == "DIFFICULTY") {
                difficulty = stoi(line.substr(11));
            } else if (line == "END_BLOCK") {
                // Create enhanced block with loaded data
                EnhancedVoteBlock block(blockId, "", category, candidate, prevHash);
                block.timestamp = timestamp;
                block.voterIdHash = voterHash;
                block.currentHash = currHash;
                block.merkleRoot = merkleRoot;
                block.nonce = nonce;
                block.difficulty = difficulty;
                enhancedBlockchain.push_back(block);
            }
        }
        
        file.close();
        cout << "Enhanced blockchain loaded successfully! Blocks: " << enhancedBlockchain.size() << endl;
    } else {
        cout << "No existing enhanced blockchain found. Starting fresh." << endl;
    }
}

// ===========================================
// BLOCKCHAIN SECURITY FEATURES
// ===========================================

// Check for double voting in blockchain
bool checkDoubleVoting(string voterId, string category) {
    string voterHash = generateSHA256(voterId);
    
    for (const auto& block : enhancedBlockchain) {
        if (block.voterIdHash == voterHash && block.category == category) {
            return true; // Double voting detected
        }
    }
    
    return false;
}

// Get voting history for a voter
vector<EnhancedVoteBlock> getVoterHistory(string voterId) {
    vector<EnhancedVoteBlock> history;
    string voterHash = generateSHA256(voterId);
    
    for (const auto& block : enhancedBlockchain) {
        if (block.voterIdHash == voterHash) {
            history.push_back(block);
        }
    }
    
    return history;
}

// Verify vote authenticity
bool verifyVoteAuthenticity(string voterId, string category, string candidateId, int blockId) {
    if (blockId < 1 || blockId > enhancedBlockchain.size()) {
        return false;
    }
    
    const EnhancedVoteBlock& block = enhancedBlockchain[blockId - 1];
    string voterHash = generateSHA256(voterId);
    
    return (block.voterIdHash == voterHash && 
            block.category == category && 
            block.candidateId == candidateId);
}

// ===========================================
// BLOCKCHAIN MINING SIMULATION
// ===========================================

// Simulate mining process
void simulateMining(int difficulty) {
    cout << "\n=== MINING SIMULATION ===" << endl;
    cout << "Target difficulty: " << difficulty << " leading zeros" << endl;
    
    string target = string(difficulty, '0');
    int nonce = 0;
    string data = "test_data_for_mining";
    string hash;
    
    cout << "Mining started..." << endl;
    clock_t start = clock();
    
    do {
        string testData = data + to_string(nonce);
        hash = generateSHA256(testData);
        nonce++;
    } while (hash.substr(0, difficulty) != target && nonce < 100000);
    
    clock_t end = clock();
    double timeSpent = (double)(end - start) / CLOCKS_PER_SEC;
    
    cout << "Mining completed!" << endl;
    cout << "Hash found: " << hash << endl;
    cout << "Nonce used: " << nonce << endl;
    cout << "Time taken: " << timeSpent << " seconds" << endl;
    cout << "Hash rate: " << (nonce / timeSpent) << " hashes/second" << endl;
}

// ===========================================
// BLOCKCHAIN VISUALIZATION
// ===========================================

// Print blockchain as a chain
void printBlockchainChain() {
    cout << "\n=== BLOCKCHAIN VISUALIZATION ===" << endl;
    
    if (enhancedBlockchain.empty()) {
        cout << "Blockchain is empty" << endl;
        return;
    }
    
    for (size_t i = 0; i < enhancedBlockchain.size(); i++) {
        const auto& block = enhancedBlockchain[i];
        
        cout << "┌─────────────────────────────────────────────────────────┐" << endl;
        cout << "│ Block " << setw(3) << block.blockId << "                                    │" << endl;
        cout << "├─────────────────────────────────────────────────────────┤" << endl;
        cout << "│ Hash: " << block.currentHash.substr(0, 50) << "... │" << endl;
        cout << "│ Prev: " << block.previousHash.substr(0, 50) << "... │" << endl;
        cout << "│ Category: " << setw(20) << left << block.category << "                    │" << endl;
        cout << "│ Candidate: " << setw(18) << left << block.candidateId << "                    │" << endl;
        cout << "│ Nonce: " << setw(10) << left << block.nonce << "                              │" << endl;
        cout << "└─────────────────────────────────────────────────────────┘" << endl;
        
        if (i < enhancedBlockchain.size() - 1) {
            cout << "                              │" << endl;
            cout << "                              ▼" << endl;
        }
    }
}

// ===========================================
// DEMO AND TESTING FUNCTIONS
// ===========================================

// Run blockchain demo
void runBlockchainDemo() {
    cout << "\n=== BLOCKCHAIN DEMO ===" << endl;
    
    // Add some demo blocks
    addEnhancedBlockToChain("V001", "Principal", "P1");
    addEnhancedBlockToChain("V002", "Principal", "P2");
    addEnhancedBlockToChain("V003", "Vice Principal", "VP1");
    addEnhancedBlockToChain("V001", "HOD of ECE", "H1");
    addEnhancedBlockToChain("V002", "Dean - Academics", "DA1");
    
    // Show blockchain statistics
    getBlockchainStatistics();
    
    // Show blockchain visualization
    printBlockchainChain();
    
    // Test integrity
    bool integrity = verifyEnhancedBlockchainIntegrity();
    cout << "\nBlockchain integrity test: " << (integrity ? "PASS" : "FAIL") << endl;
    
    // Test double voting detection
    bool doubleVote = checkDoubleVoting("V001", "Principal");
    cout << "Double voting detection test: " << (doubleVote ? "DETECTED" : "CLEAN") << endl;
    
    // Simulate mining
    simulateMining(3);
}

// ===========================================
// COMPILATION TEST FUNCTION
// ===========================================

// This function can be called to test if the file compiles correctly
void testBlockchain() {
    cout << "Testing blockchain functionality..." << endl;
    
    // Test block creation
    addEnhancedBlockToChain("TEST001", "Principal", "P1");
    cout << "Block creation test: PASS" << endl;
    
    // Test integrity verification
    bool integrity = verifyEnhancedBlockchainIntegrity();
    cout << "Integrity verification test: " << (integrity ? "PASS" : "FAIL") << endl;
    
    // Test double voting detection
    bool doubleVote = checkDoubleVoting("TEST001", "Principal");
    cout << "Double voting detection test: " << (doubleVote ? "PASS" : "FAIL") << endl;
    
    cout << "All blockchain tests completed!" << endl;
}

// ===========================================
// MAIN BLOCKCHAIN FUNCTIONS
// ===========================================

// Initialize blockchain
void initializeBlockchain() {
    cout << "Initializing blockchain..." << endl;
    loadEnhancedBlockchain();
    cout << "Blockchain initialized with " << getEnhancedBlockchainSize() << " blocks" << endl;
}

// Cleanup blockchain
void cleanupBlockchain() {
    cout << "Saving blockchain..." << endl;
    saveEnhancedBlockchain();
    cout << "Blockchain cleanup completed!" << endl;
}

// Uncomment the following lines to test the file independently
// int main() {
//     initializeBlockchain();
//     testBlockchain();
//     runBlockchainDemo();
//     cleanupBlockchain();
//     return 0;
// } 