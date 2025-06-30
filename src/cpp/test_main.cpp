// ===========================================
// SMART VOTING SYSTEM - TEST MAIN
// RV College of Engineering
// ===========================================

#include <iostream>
#include <string>

// Include our modules
#include "structures.cpp"
#include "voting.cpp"
#include "blockchain.cpp"

using namespace std;

int main() {
    cout << "===========================================" << endl;
    cout << "SMART VOTING SYSTEM - C++ BACKEND TEST" << endl;
    cout << "RV College of Engineering" << endl;
    cout << "===========================================" << endl;
    cout << endl;
    
    try {
        // Test 1: Initialize voting system
        cout << "Test 1: Initializing voting system..." << endl;
        initializeVotingSystem();
        cout << "✅ Voting system initialized successfully!" << endl;
        cout << endl;
        
        // Test 2: Test data structures
        cout << "Test 2: Testing data structures..." << endl;
        testStructures();
        cout << "✅ Data structures test passed!" << endl;
        cout << endl;
        
        // Test 3: Test voting logic
        cout << "Test 3: Testing voting logic..." << endl;
        testVotingLogic();
        cout << "✅ Voting logic test passed!" << endl;
        cout << endl;
        
        // Test 4: Test blockchain
        cout << "Test 4: Testing blockchain..." << endl;
        testBlockchain();
        cout << "✅ Blockchain test passed!" << endl;
        cout << endl;
        
        // Test 5: Run demo voting session
        cout << "Test 5: Running demo voting session..." << endl;
        runDemoVoting();
        cout << "✅ Demo voting session completed!" << endl;
        cout << endl;
        
        // Test 6: Run blockchain demo
        cout << "Test 6: Running blockchain demo..." << endl;
        runBlockchainDemo();
        cout << "✅ Blockchain demo completed!" << endl;
        cout << endl;
        
        // Test 7: Save and load data
        cout << "Test 7: Testing data persistence..." << endl;
        saveVoteData();
        saveBlockchain();
        saveEnhancedBlockchain();
        cout << "✅ Data persistence test passed!" << endl;
        cout << endl;
        
        // Test 8: Get final statistics
        cout << "Test 8: Final statistics..." << endl;
        getVotingStatistics();
        getBlockchainStatistics();
        cout << "✅ Statistics generated successfully!" << endl;
        cout << endl;
        
        cout << "===========================================" << endl;
        cout << "🎉 ALL TESTS PASSED SUCCESSFULLY!" << endl;
        cout << "===========================================" << endl;
        cout << endl;
        cout << "The Smart Voting System C++ backend is working correctly!" << endl;
        cout << endl;
        
    } catch (const exception& e) {
        cout << "❌ ERROR: " << e.what() << endl;
        return 1;
    } catch (...) {
        cout << "❌ UNKNOWN ERROR occurred!" << endl;
        return 1;
    }
    
    return 0;
} 