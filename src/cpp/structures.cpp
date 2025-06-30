// ===========================================
// SMART VOTING SYSTEM - DATA STRUCTURES
// RV College of Engineering
// ===========================================

#include <iostream>
#include <unordered_map>
#include <map>
#include <vector>
#include <string>
#include <queue>
#include <ctime>
#include <sstream>
#include <iomanip>

using namespace std;

// ===========================================
// VOTER AUTHENTICATION STRUCTURES
// ===========================================

// Hash map to store voter credentials
// Key: Voter ID, Value: Password
unordered_map<string, string> voterCredentials;

// Hash map to track who has voted (prevents duplicate voting)
// Key: Voter ID, Value: true if voted
unordered_map<string, bool> votedVoters;

// ===========================================
// CATEGORY AND CANDIDATE MANAGEMENT
// ===========================================

// Structure to store candidate information
struct Candidate {
    string id;
    string name;
    string symbol;
    string logo;
    int voteCount;
    
    Candidate(string cid, string cname, string csymbol, string clogo) {
        id = cid;
        name = cname;
        symbol = csymbol;
        logo = clogo;
        voteCount = 0;
    }
};

// Map to store categories and their candidates
// Key: Category name, Value: Vector of candidates
map<string, vector<Candidate>> categories;

// ===========================================
// VOTING LOGIC STRUCTURES
// ===========================================

// Nested map to store votes
// Outer map: Key = category, Value = inner map
// Inner map: Key = candidate_id, Value = vote_count
unordered_map<string, unordered_map<string, int>> voteCounts;

// ===========================================
// LIVE VOTE COUNTING STRUCTURES
// ===========================================

// Priority queue for sorting candidates by vote count
// Pair: (vote_count, candidate_id) - sorted by vote count (descending)
priority_queue<pair<int, string>> voteQueue;

// ===========================================
// BLOCKCHAIN SIMULATION STRUCTURES
// ===========================================

// Structure for blockchain blocks
struct VoteBlock {
    int blockId;
    string timestamp;
    string voterIdHash;
    string category;
    string candidateId;
    string previousHash;
    string currentHash;
    
    VoteBlock(int id, string voterId, string cat, string candidate, string prevHash) {
        blockId = id;
        timestamp = getCurrentTimestamp();
        voterIdHash = hashString(voterId);
        category = cat;
        candidateId = candidate;
        previousHash = prevHash;
        currentHash = generateBlockHash();
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
    
    string hashString(string input) {
        // Simple hash function for demonstration
        unsigned long hash = 5381;
        for (char c : input) {
            hash = ((hash << 5) + hash) + c;
        }
        return to_string(hash);
    }
    
    string generateBlockHash() {
        string data = to_string(blockId) + timestamp + voterIdHash + 
                     category + candidateId + previousHash;
        return hashString(data);
    }
};

// Vector to store blockchain blocks
vector<VoteBlock> blockchain;

// ===========================================
// INITIALIZATION FUNCTIONS
// ===========================================

// Initialize default voters (for testing)
void initializeDefaultVoters() {
    voterCredentials["user1"] = "user123";
    voterCredentials["student"] = "student123";
}

// Initialize categories and candidates
void initializeCategories() {
    // Principal Category
    vector<Candidate> principalCandidates = {
        Candidate("P1", "Dr. Subramanya K N", "🦁", "lion.png"),
        Candidate("P2", "Dr. Ravish Aradhya", "🦅", "eagle.png"),
        Candidate("P3", "Prof. Prakash Bhiswaghar", "🐘", "elephant.png"),
        Candidate("P4", "Dr. Srividya", "🦚", "peacock.png"),
        Candidate("P5", "Prof. Shanmukh Nayak", "🐯", "tiger.png")
    };
    categories["Principal"] = principalCandidates;
    
    // Vice Principal Category
    vector<Candidate> vicePrincipalCandidates = {
        Candidate("VP1", "Prof. Geetha ", "🌺", "lotus.png"),
        Candidate("VP2", "Prof. Uma B V", "🌻", "sunflower.png"),
        Candidate("VP3", "Dr. Karyappa", "🌹", "rose.png"),
        Candidate("VP4", "Prof. Kiran", "🌸", "cherry.png"),
        Candidate("VP5", "Dr. Praveen", "🌷", "tulip.png")
    };
    categories["Vice Principal"] = vicePrincipalCandidates;
    
    // HOD of ECE Category
    vector<Candidate> hodECECandidates = {
        Candidate("H1", "Dr. Chethana", "⚡", "lightning.png"),
        Candidate("H2", "Dr. Rajni", "🔌", "plug.png"),
        Candidate("H3", "Prof. Rajith Kumar", "💡", "bulb.png"),
        Candidate("H4", "Dr. M G Ramchandran", "📡", "antenna.png"),
        Candidate("H5", "Prof. Roopa", "🔋", "battery.png")
    };
    categories["HOD of ECE"] = hodECECandidates;
    
    // Dean - Academics Category
    vector<Candidate> deanAcademicsCandidates = {
        Candidate("DA1", "Dr. Meera Iyer", "📚", "books.png"),
        Candidate("DA2", "Prof. Rajesh Gupta", "🎓", "graduation.png"),
        Candidate("DA3", "Dr. Suresh Kumar", "📖", "textbook.png"),
        Candidate("DA4", "Prof. Asha Patel", "✏️", "pencil.png"),
        Candidate("DA5", "Dr. Kiran Reddy", "📝", "notepad.png")
    };
    categories["Dean - Academics"] = deanAcademicsCandidates;
    
    // Dean - Student Affairs Category
    vector<Candidate> deanStudentAffairsCandidates = {
        Candidate("DSA1", "Dr. Priya Sharma", "🎭", "theater.png"),
        Candidate("DSA2", "Prof. Amit Kumar", "⚽", "football.png"),
        Candidate("DSA3", "Dr. Vinay Kumar", "🎨", "art.png"),
        Candidate("DSA4", "Prof. Rahul Singh", "🎵", "music.png"),
        Candidate("DSA5", "Dr. Meera Iyer", "🏃", "running.png")
    };
    categories["Dean - Student Affairs"] = deanStudentAffairsCandidates;
    
    // CR of EC-A Category
    vector<Candidate> crECACandidates = {
        Candidate("CR1", "Darshan Gowda K P", "🚀", "rocket.png"),
        Candidate("CR2", "Aviral", "🌟", "star.png"),
        Candidate("CR3", "Avinash V J", "💫", "sparkle.png"),
        Candidate("CR4", "Bharghav Simha", "✨", "shine.png"),
        Candidate("CR5", "Prashanth G", "🔥", "fire.png")
    };
    categories["CR of EC-A"] = crECACandidates;
}

// Initialize vote counts for all candidates
void initializeVoteCounts() {
    for (auto& category : categories) {
        for (auto& candidate : category.second) {
            voteCounts[category.first][candidate.id] = 0;
        }
    }
}

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

// Get all category names
vector<string> getCategoryNames() {
    vector<string> names;
    for (auto& category : categories) {
        names.push_back(category.first);
    }
    return names;
}

// Get candidates for a specific category
vector<Candidate> getCandidatesForCategory(string category) {
    if (categories.find(category) != categories.end()) {
        return categories[category];
    }
    return vector<Candidate>();
}

// Get vote count for a candidate
int getVoteCount(string category, string candidateId) {
    if (voteCounts.find(category) != voteCounts.end()) {
        if (voteCounts[category].find(candidateId) != voteCounts[category].end()) {
            return voteCounts[category][candidateId];
        }
    }
    return 0;
}

// Get total votes for a category
int getTotalVotesForCategory(string category) {
    int total = 0;
    if (voteCounts.find(category) != voteCounts.end()) {
        for (auto& candidate : voteCounts[category]) {
            total += candidate.second;
        }
    }
    return total;
}

// ===========================================
// BLOCKCHAIN FUNCTIONS
// ===========================================

// Add a new block to the blockchain
void addBlockToChain(string voterId, string category, string candidateId) {
    string previousHash = blockchain.empty() ? "0000000000000000" : blockchain.back().currentHash;
    VoteBlock newBlock(blockchain.size() + 1, voterId, category, candidateId, previousHash);
    blockchain.push_back(newBlock);
}

// Verify blockchain integrity
bool verifyBlockchainIntegrity() {
    for (size_t i = 1; i < blockchain.size(); i++) {
        if (blockchain[i].previousHash != blockchain[i-1].currentHash) {
            return false;
        }
    }
    return true;
}

// Get blockchain size
int getBlockchainSize() {
    return blockchain.size();
}

// ===========================================
// DEBUG AND TESTING FUNCTIONS
// ===========================================

// Print all categories and candidates
void printCategoriesAndCandidates() {
    cout << "=== CATEGORIES AND CANDIDATES ===" << endl;
    for (auto& category : categories) {
        cout << "\nCategory: " << category.first << endl;
        cout << "Candidates:" << endl;
        for (auto& candidate : category.second) {
            cout << "  - " << candidate.id << ": " << candidate.name 
                 << " (" << candidate.symbol << ")" << endl;
        }
    }
}

// Print current vote counts
void printVoteCounts() {
    cout << "\n=== CURRENT VOTE COUNTS ===" << endl;
    for (auto& category : voteCounts) {
        cout << "\nCategory: " << category.first << endl;
        for (auto& candidate : category.second) {
            cout << "  " << candidate.first << ": " << candidate.second << " votes" << endl;
        }
    }
}

// Print blockchain
void printBlockchain() {
    cout << "\n=== BLOCKCHAIN ===" << endl;
    for (auto& block : blockchain) {
        cout << "Block " << block.blockId << ":" << endl;
        cout << "  Timestamp: " << block.timestamp << endl;
        cout << "  Voter Hash: " << block.voterIdHash << endl;
        cout << "  Category: " << block.category << endl;
        cout << "  Candidate: " << block.candidateId << endl;
        cout << "  Previous Hash: " << block.previousHash << endl;
        cout << "  Current Hash: " << block.currentHash << endl;
        cout << endl;
    }
}

// ===========================================
// MAIN INITIALIZATION FUNCTION
// ===========================================

// Initialize all data structures
void initializeVotingSystem() {
    cout << "Initializing Smart Voting System..." << endl;
    
    initializeDefaultVoters();
    initializeCategories();
    initializeVoteCounts();
    
    cout << "Voting system initialized successfully!" << endl;
    cout << "Total categories: " << categories.size() << endl;
    cout << "Total voters: " << voterCredentials.size() << endl;
}

// ===========================================
// COMPILATION TEST FUNCTION
// ===========================================

// This function can be called to test if the file compiles correctly
void testStructures() {
    cout << "Testing data structures..." << endl;
    
    // Test category retrieval
    vector<string> categoryNames = getCategoryNames();
    cout << "Available categories: ";
    for (string name : categoryNames) {
        cout << name << " ";
    }
    cout << endl;
    
    // Test candidate retrieval
    vector<Candidate> principalCandidates = getCandidatesForCategory("Principal");
    cout << "Principal candidates: " << principalCandidates.size() << endl;
    
    // Test vote count
    int voteCount = getVoteCount("Principal", "P1");
    cout << "Initial vote count for P1: " << voteCount << endl;
    
    cout << "All tests passed!" << endl;
}

// Uncomment the following lines to test the file independently
// int main() {
//     initializeVotingSystem();
//     testStructures();
//     return 0;
// } 