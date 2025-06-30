// ===========================================
// SMART VOTING SYSTEM - VOTING LOGIC
// RV College of Engineering
// ===========================================

#include <iostream>
#include <string>
#include <unordered_map>
#include <vector>
#include <algorithm>
#include <fstream>
#include <sstream>

// Include our data structures
#include "structures.cpp"

using namespace std;

// ===========================================
// VOTER AUTHENTICATION FUNCTIONS
// ===========================================

// Check if voter credentials are valid
bool authenticateVoter(string voterId, string password) {
    // Check if voter exists in our hash map
    if (voterCredentials.find(voterId) != voterCredentials.end()) {
        // Check if password matches
        if (voterCredentials[voterId] == password) {
            return true;
        }
    }
    return false;
}

// Check if voter has already voted
bool hasVoterVoted(string voterId) {
    return votedVoters.find(voterId) != votedVoters.end() && votedVoters[voterId];
}

// Mark voter as voted
void markVoterAsVoted(string voterId) {
    votedVoters[voterId] = true;
}

// Register a new voter
bool registerVoter(string voterId, string password) {
    // Check if voter already exists
    if (voterCredentials.find(voterId) != voterCredentials.end()) {
        return false; // Voter already exists
    }
    
    // Add new voter to hash map
    voterCredentials[voterId] = password;
    return true;
}

// Get total number of registered voters
int getTotalVoters() {
    return voterCredentials.size();
}

// Get total number of voters who have voted
int getVotedVotersCount() {
    int count = 0;
    for (auto& voter : votedVoters) {
        if (voter.second) {
            count++;
        }
    }
    return count;
}

// ===========================================
// VOTE PROCESSING FUNCTIONS
// ===========================================

// Process a vote for a candidate
bool processVote(string voterId, string category, string candidateId) {
    // Step 1: Validate voter hasn't already voted for this category
    string voteKey = voterId + "_" + category;
    if (votedVoters.find(voteKey) != votedVoters.end()) {
        cout << "Error: Voter " << voterId << " has already voted for " << category << endl;
        return false;
    }
    
    // Step 2: Validate category exists
    if (categories.find(category) == categories.end()) {
        cout << "Error: Category " << category << " does not exist" << endl;
        return false;
    }
    
    // Step 3: Validate candidate exists in the category
    bool candidateExists = false;
    for (auto& candidate : categories[category]) {
        if (candidate.id == candidateId) {
            candidateExists = true;
            break;
        }
    }
    
    if (!candidateExists) {
        cout << "Error: Candidate " << candidateId << " does not exist in category " << category << endl;
        return false;
    }
    
    // Step 4: Update vote count
    voteCounts[category][candidateId]++;
    
    // Step 5: Mark voter as voted for this category
    votedVoters[voteKey] = true;
    
    // Step 6: Add to blockchain
    addBlockToChain(voterId, category, candidateId);
    
    cout << "Vote processed successfully!" << endl;
    cout << "Voter: " << voterId << endl;
    cout << "Category: " << category << endl;
    cout << "Candidate: " << candidateId << endl;
    cout << "New vote count: " << voteCounts[category][candidateId] << endl;
    
    return true;
}

// Get sorted candidates by vote count for a category
vector<pair<string, int>> getSortedCandidatesByVotes(string category) {
    vector<pair<string, int>> sortedCandidates;
    
    if (voteCounts.find(category) != voteCounts.end()) {
        for (auto& candidate : voteCounts[category]) {
            sortedCandidates.push_back({candidate.first, candidate.second});
        }
        
        // Sort by vote count (descending order)
        sort(sortedCandidates.begin(), sortedCandidates.end(), 
             [](const pair<string, int>& a, const pair<string, int>& b) {
                 return a.second > b.second;
             });
    }
    
    return sortedCandidates;
}

// Get winner for a category
string getWinner(string category) {
    vector<pair<string, int>> sortedCandidates = getSortedCandidatesByVotes(category);
    
    if (sortedCandidates.empty()) {
        return "No votes cast yet";
    }
    
    // Check for tie
    if (sortedCandidates.size() > 1 && sortedCandidates[0].second == sortedCandidates[1].second) {
        return "Tie between multiple candidates";
    }
    
    return sortedCandidates[0].first;
}

// Get candidate name by ID
string getCandidateName(string category, string candidateId) {
    if (categories.find(category) != categories.end()) {
        for (auto& candidate : categories[category]) {
            if (candidate.id == candidateId) {
                return candidate.name;
            }
        }
    }
    return "Unknown Candidate";
}

// Get candidate symbol by ID
string getCandidateSymbol(string category, string candidateId) {
    if (categories.find(category) != categories.end()) {
        for (auto& candidate : categories[category]) {
            if (candidate.id == candidateId) {
                return candidate.symbol;
            }
        }
    }
    return "❓";
}

// ===========================================
// DATA PERSISTENCE FUNCTIONS
// ===========================================

// Save vote data to file
void saveVoteData() {
    ofstream file("vote_data.txt");
    if (file.is_open()) {
        // Save vote counts
        for (auto& category : voteCounts) {
            file << "CATEGORY:" << category.first << endl;
            for (auto& candidate : category.second) {
                file << candidate.first << ":" << candidate.second << endl;
            }
            file << "END_CATEGORY" << endl;
        }
        
        // Save voted voters
        file << "VOTED_VOTERS" << endl;
        for (auto& voter : votedVoters) {
            if (voter.second) {
                file << voter.first << endl;
            }
        }
        
        file.close();
        cout << "Vote data saved successfully!" << endl;
    } else {
        cout << "Error: Could not save vote data" << endl;
    }
}

// Load vote data from file
void loadVoteData() {
    ifstream file("vote_data.txt");
    if (file.is_open()) {
        string line;
        string currentCategory = "";
        
        while (getline(file, line)) {
            if (line.substr(0, 9) == "CATEGORY:") {
                currentCategory = line.substr(9);
            } else if (line == "END_CATEGORY") {
                currentCategory = "";
            } else if (line == "VOTED_VOTERS") {
                // Load voted voters
                while (getline(file, line) && !line.empty()) {
                    votedVoters[line] = true;
                }
                break;
            } else if (!currentCategory.empty() && line.find(":") != string::npos) {
                // Parse candidate vote count
                size_t colonPos = line.find(":");
                string candidateId = line.substr(0, colonPos);
                int voteCount = stoi(line.substr(colonPos + 1));
                voteCounts[currentCategory][candidateId] = voteCount;
            }
        }
        
        file.close();
        cout << "Vote data loaded successfully!" << endl;
    } else {
        cout << "No existing vote data found. Starting fresh." << endl;
    }
}

// Save blockchain to file
void saveBlockchain() {
    ofstream file("blockchain.txt");
    if (file.is_open()) {
        for (auto& block : blockchain) {
            file << "BLOCK:" << block.blockId << endl;
            file << "TIMESTAMP:" << block.timestamp << endl;
            file << "VOTER_HASH:" << block.voterIdHash << endl;
            file << "CATEGORY:" << block.category << endl;
            file << "CANDIDATE:" << block.candidateId << endl;
            file << "PREV_HASH:" << block.previousHash << endl;
            file << "CURR_HASH:" << block.currentHash << endl;
            file << "END_BLOCK" << endl;
        }
        file.close();
        cout << "Blockchain saved successfully!" << endl;
    } else {
        cout << "Error: Could not save blockchain" << endl;
    }
}

// Load blockchain from file
void loadBlockchain() {
    ifstream file("blockchain.txt");
    if (file.is_open()) {
        blockchain.clear();
        string line;
        VoteBlock* currentBlock = nullptr;
        int blockId = 0;
        string timestamp, voterHash, category, candidate, prevHash;
        
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
                // Create block with loaded data
                VoteBlock block(blockId, "", category, candidate, prevHash);
                block.timestamp = timestamp;
                block.voterIdHash = voterHash;
                block.currentHash = line.substr(10);
                blockchain.push_back(block);
            }
        }
        
        file.close();
        cout << "Blockchain loaded successfully! Blocks: " << blockchain.size() << endl;
    } else {
        cout << "No existing blockchain found. Starting fresh." << endl;
    }
}

// ===========================================
// STATISTICS AND ANALYTICS FUNCTIONS
// ===========================================

// Get voting statistics
void getVotingStatistics() {
    cout << "\n=== VOTING STATISTICS ===" << endl;
    cout << "Total registered voters: " << getTotalVoters() << endl;
    cout << "Total voters who have voted: " << getVotedVotersCount() << endl;
    cout << "Voter turnout: " << (getTotalVoters() > 0 ? 
        (double)getVotedVotersCount() / getTotalVoters() * 100 : 0) << "%" << endl;
    
    cout << "\nVotes by category:" << endl;
    for (auto& category : categories) {
        int totalVotes = getTotalVotesForCategory(category.first);
        cout << "  " << category.first << ": " << totalVotes << " votes" << endl;
    }
    
    cout << "\nWinners by category:" << endl;
    for (auto& category : categories) {
        string winner = getWinner(category.first);
        if (winner != "No votes cast yet" && winner != "Tie between multiple candidates") {
            string winnerName = getCandidateName(category.first, winner);
            cout << "  " << category.first << ": " << winnerName << " (" << winner << ")" << endl;
        } else {
            cout << "  " << category.first << ": " << winner << endl;
        }
    }
    
    cout << "\nBlockchain integrity: " << (verifyBlockchainIntegrity() ? "✅ Valid" : "❌ Compromised") << endl;
    cout << "Total blocks: " << getBlockchainSize() << endl;
}

// Get detailed results for a category
void getDetailedResults(string category) {
    cout << "\n=== DETAILED RESULTS FOR " << category << " ===" << endl;
    
    vector<pair<string, int>> sortedCandidates = getSortedCandidatesByVotes(category);
    int totalVotes = getTotalVotesForCategory(category);
    
    if (sortedCandidates.empty()) {
        cout << "No votes cast yet for this category." << endl;
        return;
    }
    
    cout << "Total votes: " << totalVotes << endl;
    cout << "\nCandidate Results:" << endl;
    
    for (size_t i = 0; i < sortedCandidates.size(); i++) {
        string candidateId = sortedCandidates[i].first;
        int votes = sortedCandidates[i].second;
        string name = getCandidateName(category, candidateId);
        string symbol = getCandidateSymbol(category, candidateId);
        double percentage = totalVotes > 0 ? (double)votes / totalVotes * 100 : 0;
        
        cout << (i + 1) << ". " << name << " (" << candidateId << ") " << symbol << endl;
        cout << "   Votes: " << votes << " (" << fixed << setprecision(1) << percentage << "%)" << endl;
        
        // Create a simple bar chart
        int barLength = (int)(percentage / 2); // Scale down for display
        cout << "   ";
        for (int j = 0; j < barLength; j++) {
            cout << "█";
        }
        cout << endl;
    }
}

// ===========================================
// VALIDATION AND ERROR HANDLING
// ===========================================

// Validate vote input
bool validateVoteInput(string voterId, string category, string candidateId) {
    // Check if voter ID is not empty
    if (voterId.empty()) {
        cout << "Error: Voter ID cannot be empty" << endl;
        return false;
    }
    
    // Check if category is not empty
    if (category.empty()) {
        cout << "Error: Category cannot be empty" << endl;
        return false;
    }
    
    // Check if candidate ID is not empty
    if (candidateId.empty()) {
        cout << "Error: Candidate ID cannot be empty" << endl;
        return false;
    }
    
    // Check if voter exists
    if (voterCredentials.find(voterId) == voterCredentials.end()) {
        cout << "Error: Voter ID not found" << endl;
        return false;
    }
    
    // Check if category exists
    if (categories.find(category) == categories.end()) {
        cout << "Error: Category not found" << endl;
        return false;
    }
    
    // Check if candidate exists in category
    bool candidateExists = false;
    for (auto& candidate : categories[category]) {
        if (candidate.id == candidateId) {
            candidateExists = true;
            break;
        }
    }
    
    if (!candidateExists) {
        cout << "Error: Candidate not found in category" << endl;
        return false;
    }
    
    return true;
}

// ===========================================
// DEMO AND TESTING FUNCTIONS
// ===========================================

// Run a demo voting session
void runDemoVoting() {
    cout << "\n=== DEMO VOTING SESSION ===" << endl;
    
    // Demo voters
    vector<string> demoVoters = {"V001", "V002", "V003"};
    vector<string> categories = getCategoryNames();
    
    for (string voter : demoVoters) {
        cout << "\nVoter " << voter << " is voting..." << endl;
        
        for (string category : categories) {
            // Get candidates for this category
            vector<Candidate> candidates = getCandidatesForCategory(category);
            if (!candidates.empty()) {
                // Randomly select a candidate
                int randomIndex = rand() % candidates.size();
                string candidateId = candidates[randomIndex].id;
                
                cout << "  Voting for " << category << ": " << candidateId << endl;
                processVote(voter, category, candidateId);
            }
        }
    }
    
    cout << "\nDemo voting session completed!" << endl;
    getVotingStatistics();
}

// ===========================================
// MAIN VOTING FUNCTIONS
// ===========================================

// Initialize the voting system
void initializeVoting() {
    cout << "Initializing voting system..." << endl;
    
    // Initialize data structures
    initializeVotingSystem();
    
    // Load existing data
    loadVoteData();
    loadBlockchain();
    
    cout << "Voting system ready!" << endl;
}

// Cleanup and save data
void cleanupVoting() {
    cout << "Saving data and cleaning up..." << endl;
    
    saveVoteData();
    saveBlockchain();
    
    cout << "Cleanup completed!" << endl;
}

// ===========================================
// COMPILATION TEST FUNCTION
// ===========================================

// This function can be called to test if the file compiles correctly
void testVotingLogic() {
    cout << "Testing voting logic..." << endl;
    
    // Test authentication
    bool authResult = authenticateVoter("V001", "password123");
    cout << "Authentication test: " << (authResult ? "PASS" : "FAIL") << endl;
    
    // Test vote processing
    bool voteResult = processVote("V001", "Principal", "P1");
    cout << "Vote processing test: " << (voteResult ? "PASS" : "FAIL") << endl;
    
    // Test duplicate vote prevention
    bool duplicateResult = processVote("V001", "Principal", "P2");
    cout << "Duplicate vote prevention test: " << (!duplicateResult ? "PASS" : "FAIL") << endl;
    
    cout << "All voting logic tests completed!" << endl;
}

// Uncomment the following lines to test the file independently
// int main() {
//     initializeVoting();
//     testVotingLogic();
//     runDemoVoting();
//     cleanupVoting();
//     return 0;
// } 