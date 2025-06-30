#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

// ===========================================
// DATA STRUCTURES (Beginner-friendly DSA concepts)
// ===========================================

// Struct to store candidate information
struct Candidate {
    string candidateID;    // Unique ID like "C1", "C2"
    string name;          // Candidate's full name
    string position;      // Position they're running for
    int voteCount;        // Number of votes received
};

// Struct to store voter information
struct Voter {
    string voterID;       // Unique voter identification
    bool hasVoted;        // Whether this voter has already voted
};

// ===========================================
// GLOBAL VARIABLES (Data storage)
// ===========================================

// Array to store all candidates (using array of structs)
vector<Candidate> allCandidates;

// Array to store all voters (using array of structs)
vector<Voter> allVoters;

// Array to store different voting positions
string votingPositions[] = {
    "Principal",
    "Vice Principal", 
    "HOD of ECE",
    "Dean - Academics",
    "Dean - Student Affairs",
    "CR - ECE-A Section"
};

// ===========================================
// FILE HANDLING FUNCTIONS
// ===========================================

// Function to load candidates from candidates.txt file
void loadCandidatesFromFile() {
    ifstream file("candidates.txt");
    if (!file.is_open()) {
        cout << "Error: Could not open candidates.txt file!" << endl;
        return;
    }
    
    string line;
    while (getline(file, line)) {
        // Parse line: Position|CandidateID|Name
        size_t pos1 = line.find('|');
        size_t pos2 = line.find('|', pos1 + 1);
        
        if (pos1 != string::npos && pos2 != string::npos) {
            Candidate newCandidate;
            newCandidate.position = line.substr(0, pos1);
            newCandidate.candidateID = line.substr(pos1 + 1, pos2 - pos1 - 1);
            newCandidate.name = line.substr(pos2 + 1);
            newCandidate.voteCount = 0;
            
            allCandidates.push_back(newCandidate);
        }
    }
    file.close();
    cout << "Loaded " << allCandidates.size() << " candidates from file." << endl;
}

// Function to load voters from voters.txt file
void loadVotersFromFile() {
    ifstream file("voters.txt");
    if (!file.is_open()) {
        cout << "Note: voters.txt not found. Creating new file." << endl;
        return;
    }
    
    string line;
    while (getline(file, line)) {
        // Parse line: VoterID|HasVoted
        size_t pos = line.find('|');
        if (pos != string::npos) {
            Voter newVoter;
            newVoter.voterID = line.substr(0, pos);
            newVoter.hasVoted = (line.substr(pos + 1) == "true");
            allVoters.push_back(newVoter);
        }
    }
    file.close();
    cout << "Loaded " << allVoters.size() << " voters from file." << endl;
}

// Function to save votes to votes.txt file
void saveVoteToFile(string voterID, string position, string candidateID) {
    ofstream file("votes.txt", ios::app); // ios::app means append mode
    if (file.is_open()) {
        file << voterID << "|" << position << "|" << candidateID << endl;
        file.close();
        cout << "Vote saved to file successfully!" << endl;
    } else {
        cout << "Error: Could not save vote to file!" << endl;
    }
}

// Function to mark voter as voted in voters.txt
void markVoterAsVoted(string voterID) {
    // First, check if voter already exists
    bool voterExists = false;
    for (auto& voter : allVoters) {
        if (voter.voterID == voterID) {
            voter.hasVoted = true;
            voterExists = true;
            break;
        }
    }
    
    // If voter doesn't exist, add them
    if (!voterExists) {
        Voter newVoter;
        newVoter.voterID = voterID;
        newVoter.hasVoted = true;
        allVoters.push_back(newVoter);
    }
    
    // Save updated voter list to file
    ofstream file("voters.txt");
    if (file.is_open()) {
        for (const auto& voter : allVoters) {
            file << voter.voterID << "|" << (voter.hasVoted ? "true" : "false") << endl;
        }
        file.close();
        cout << "Voter marked as voted successfully!" << endl;
    } else {
        cout << "Error: Could not update voter file!" << endl;
    }
}

// ===========================================
// VALIDATION FUNCTIONS (Simple linear search)
// ===========================================

// Function to check if a voter has already voted (using linear search)
bool hasVoterAlreadyVoted(string voterID) {
    for (const auto& voter : allVoters) {
        if (voter.voterID == voterID) {
            return voter.hasVoted;
        }
    }
    return false; // Voter not found, so hasn't voted
}

// Function to validate if candidate ID exists for a position
bool isValidCandidate(string candidateID, string position) {
    for (const auto& candidate : allCandidates) {
        if (candidate.candidateID == candidateID && candidate.position == position) {
            return true;
        }
    }
    return false;
}

// ===========================================
// DISPLAY FUNCTIONS
// ===========================================

// Function to display all candidates for a specific position
void displayCandidatesForPosition(string position) {
    cout << "\n=== Candidates for " << position << " ===" << endl;
    bool found = false;
    
    for (const auto& candidate : allCandidates) {
        if (candidate.position == position) {
            cout << candidate.candidateID << ": " << candidate.name << endl;
            found = true;
        }
    }
    
    if (!found) {
        cout << "No candidates found for this position." << endl;
    }
}

// Function to display voting results
void displayVotingResults() {
    cout << "\n=== VOTING RESULTS ===" << endl;
    
    for (const string& position : votingPositions) {
        cout << "\n" << position << ":" << endl;
        cout << "-------------------" << endl;
        
        // Count votes for each candidate in this position
        for (const auto& candidate : allCandidates) {
            if (candidate.position == position) {
                cout << candidate.name << " (" << candidate.candidateID << "): " 
                     << candidate.voteCount << " votes" << endl;
            }
        }
    }
}

// ===========================================
// MAIN VOTING LOGIC
// ===========================================

// Function to cast a vote for a specific position
void castVoteForPosition(string voterID, string position) {
    cout << "\n--- Voting for " << position << " ---" << endl;
    
    // Display candidates for this position
    displayCandidatesForPosition(position);
    
    // Get user choice
    string choice;
    cout << "\nEnter candidate ID (e.g., C1, C2): ";
    cin >> choice;
    
    // Validate the choice
    if (isValidCandidate(choice, position)) {
        // Save the vote
        saveVoteToFile(voterID, position, choice);
        
        // Update vote count in memory
        for (auto& candidate : allCandidates) {
            if (candidate.candidateID == choice && candidate.position == position) {
                candidate.voteCount++;
                break;
            }
        }
        
        cout << "✓ Vote cast successfully for " << position << "!" << endl;
    } else {
        cout << "✗ Invalid candidate ID. Please try again." << endl;
        castVoteForPosition(voterID, position); // Recursive call to retry
    }
}

// Main function to handle the complete voting process
void startVotingProcess() {
    string voterID;
    
    // Step 1: Get Voter ID
    cout << "\n=== RV College of Engineering - Smart Voting System ===" << endl;
    cout << "Please enter your Voter ID: ";
    cin >> voterID;
    
    // Step 2: Check if voter has already voted
    if (hasVoterAlreadyVoted(voterID)) {
        cout << "✗ You have already voted! Each voter can only vote once." << endl;
        return;
    }
    
    cout << "✓ Voter ID validated. You can proceed to vote." << endl;
    
    // Step 3: Vote for each position
    for (const string& position : votingPositions) {
        castVoteForPosition(voterID, position);
    }
    
    // Step 4: Mark voter as voted
    markVoterAsVoted(voterID);
    
    cout << "\n🎉 CONGRATULATIONS! Your vote has been cast successfully!" << endl;
    cout << "Thank you for participating in the RV College of Engineering elections." << endl;
}

// ===========================================
// MAIN FUNCTION
// ===========================================

int main() {
    cout << "Loading voting system..." << endl;
    
    // Load data from files
    loadCandidatesFromFile();
    loadVotersFromFile();
    
    // Main menu loop
    int choice;
    do {
        cout << "\n=== RV College of Engineering - Smart Voting System ===" << endl;
        cout << "1. Cast Vote" << endl;
        cout << "2. View Results" << endl;
        cout << "3. Exit" << endl;
        cout << "Enter your choice (1-3): ";
        cin >> choice;
        
        switch (choice) {
            case 1:
                startVotingProcess();
                break;
            case 2:
                displayVotingResults();
                break;
            case 3:
                cout << "Thank you for using the Smart Voting System!" << endl;
                break;
            default:
                cout << "Invalid choice. Please try again." << endl;
        }
    } while (choice != 3);
    
    return 0;
} 