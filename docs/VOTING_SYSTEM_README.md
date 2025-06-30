# 🗳️ Smart Voting System - RV College of Engineering

A complete voting system built with C++ backend logic and HTML/CSS/JavaScript frontend, designed for college elections.

## 📁 Project Structure

```
vote/
├── main.cpp                 # C++ backend with DSA concepts
├── candidates.txt           # Candidate data file
├── voting.html             # Voting portal frontend
├── voting.css              # Voting page styles
├── voting.js               # Voting page functionality
├── login.html              # Login page
├── script.js               # Login functionality (updated)
├── signup.js               # Signup functionality (updated)
├── pages/
│   └── signup.html         # Signup page
├── common.css              # Shared styles
├── logo-rvce_0.png         # RV College logo
├── test_account_system.html # Test page for account system
└── VOTING_SYSTEM_README.md # This file
```

## 🧠 DSA Concepts Used

### 1. **Structs** (Data Structures)
```cpp
// Candidate struct to store candidate information
struct Candidate {
    string candidateID;    // Unique ID like "C1", "C2"
    string name;          // Candidate's full name
    string position;      // Position they're running for
    int voteCount;        // Number of votes received
};

// Voter struct to store voter information
struct Voter {
    string voterID;       // Unique voter identification
    bool hasVoted;        // Whether this voter has already voted
};
```

### 2. **Arrays of Structs**
```cpp
// Array to store all candidates
vector<Candidate> allCandidates;

// Array to store all voters
vector<Voter> allVoters;
```

### 3. **File Handling**
- `candidates.txt`: Stores candidate data
- `votes.txt`: Stores cast votes
- `voters.txt`: Tracks who has voted

### 4. **Linear Search** (Simple Hashing Alternative)
```cpp
// Check if voter has already voted using linear search
bool hasVoterAlreadyVoted(string voterID) {
    for (const auto& voter : allVoters) {
        if (voter.voterID == voterID) {
            return voter.hasVoted;
        }
    }
    return false;
}
```

## 🚀 How to Use

### Step 1: Compile and Run C++ Backend
```bash
# Compile the C++ program
g++ main.cpp -o voting_system

# Run the program
./voting_system
```

### Step 2: Use the Web Interface
1. Open `index.html` in your browser
2. Click through the splash screen
3. **Option A: Use Default Accounts**
   - Login with any of these credentials:
     - Username: `admin`, Password: `Admin@123`
     - Username: `user1`, Password: `User1@123`
     - Username: `student`, Password: `Student@123`
   
   **Option B: Create New Account**
   - Click "Sign Up" on the login page
   - Fill in username, email, and password
   - Submit the form
   - You'll be automatically redirected to login
   - Login with your newly created credentials
4. After successful login, you'll be redirected to the voting portal
5. Enter your Voter ID and select candidates for each position
6. Submit your vote

## 🔐 Account System (FIXED!)

### ✅ **What's Fixed:**
- **Account Creation**: New accounts are now properly saved to localStorage
- **Login Integration**: Login page checks both default users and newly created accounts
- **Automatic Redirect**: After signup, users are automatically redirected to login page
- **Duplicate Prevention**: System prevents duplicate usernames and emails
- **Persistent Storage**: Accounts persist between browser sessions

### 🔧 **How It Works:**
1. **Signup Process**:
   - User fills signup form with username, email, password
   - System validates all fields (username uniqueness, email format, password strength)
   - Account is saved to localStorage with timestamp
   - User is redirected to login page after 2 seconds

2. **Login Process**:
   - System loads both default users and signup users from localStorage
   - Validates credentials against combined user list
   - Successful login redirects to voting portal

3. **Default Users** (always available):
   - `admin` / `Admin@123`
   - `user1` / `User1@123`
   - `student` / `Student@123`

### 🧪 **Testing the Account System:**
Open `test_account_system.html` to:
- View all registered users (default + signup)
- Clear signup users (reset)
- Test default user credentials
- Navigate between pages

## 📊 Voting Positions

1. **Principal**
   - C1: Dr. Suresh Kumar
   - C2: Dr. Radha Sharma

2. **Vice Principal**
   - C1: Prof. Prakash Singh
   - C2: Prof. Asha Patel

3. **HOD of ECE**
   - C1: Dr. Kiran Reddy
   - C2: Dr. Vinay Kumar

4. **Dean - Academics**
   - C1: Dr. Meera Iyer
   - C2: Prof. Rajesh Gupta

5. **Dean - Student Affairs**
   - C1: Dr. Priya Sharma
   - C2: Prof. Amit Kumar

6. **CR - ECE-A Section**
   - C1: Rahul Singh
   - C2: Priya Patel

## 🔧 Features

### Frontend Features
- ✅ Responsive design (works on mobile and desktop)
- ✅ Dark/Light mode toggle
- ✅ Smooth animations and transitions
- ✅ Form validation
- ✅ Real-time vote counting
- ✅ Results modal with live updates
- ✅ Prevents double voting
- ✅ Success/error notifications
- ✅ **Account creation and management**
- ✅ **Persistent user storage**

### Backend Features
- ✅ File-based data storage
- ✅ Voter validation
- ✅ Vote counting and results
- ✅ Prevents duplicate voting
- ✅ Modular code structure
- ✅ Beginner-friendly comments

## 📝 File Formats

### candidates.txt
```
Position|CandidateID|Name
Principal|C1|Dr. Suresh Kumar
Principal|C2|Dr. Radha Sharma
```

### votes.txt
```
VoterID|Position|CandidateID
V001|Principal|C1
V001|Vice Principal|C2
```

### voters.txt
```
VoterID|HasVoted
V001|true
V002|false
```

### localStorage (Web Interface)
```javascript
// Registered users structure
{
  "registeredUsers": [
    {
      "username": "newuser",
      "email": "user@example.com",
      "password": "Password123!",
      "createdAt": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

## 🎯 Learning Objectives

This project demonstrates:

1. **Data Structures**: Using structs to organize data
2. **Arrays**: Storing multiple objects efficiently
3. **File I/O**: Reading and writing data to files
4. **Search Algorithms**: Linear search for validation
5. **Modular Programming**: Breaking code into functions
6. **Frontend-Backend Integration**: HTML/CSS/JS with C++ logic
7. **Data Validation**: Ensuring data integrity
8. **User Experience**: Creating intuitive interfaces
9. **Account Management**: User registration and authentication
10. **Persistent Storage**: localStorage for web applications

## 🔍 Code Explanation

### Key Functions in main.cpp:

1. **`loadCandidatesFromFile()`**: Reads candidate data from file
2. **`hasVoterAlreadyVoted()`**: Checks if voter has voted (linear search)
3. **`saveVoteToFile()`**: Saves vote to votes.txt
4. **`markVoterAsVoted()`**: Updates voter status
5. **`displayVotingResults()`**: Shows current vote counts

### Key Classes in voting.js:

1. **`VotingForm`**: Handles form submission and validation
2. **`ResultsModal`**: Manages results display
3. **`ThemeManager`**: Handles dark/light mode

### Key Classes in signup.js:

1. **`SignUpForm`**: Handles account creation and validation
2. **`loadExistingUsers()`**: Loads users from localStorage
3. **`saveUserToStorage()`**: Saves new accounts to localStorage
4. **`isEmailAlreadyRegistered()`**: Prevents duplicate emails

### Key Classes in script.js:

1. **`LoginForm`**: Handles authentication
2. **`loadRegisteredUsers()`**: Combines default and signup users
3. **`simulateLogin()`**: Validates credentials

## 🛠️ Customization

### Adding New Positions:
1. Update `votingPositions[]` array in `main.cpp`
2. Add candidates to `candidates.txt`
3. Update HTML form in `voting.html`
4. Update JavaScript validation in `voting.js`

### Changing Candidates:
1. Edit `candidates.txt` file
2. Update candidate names in `voting.html`
3. Update candidate mapping in `voting.js`

### Modifying Account System:
1. Edit validation rules in `signup.js`
2. Modify default users in `script.js`
3. Change redirect behavior in `signup.js`

## 🎨 Design Features

- **Modern UI**: Clean, professional design
- **Responsive**: Works on all screen sizes
- **Accessible**: Keyboard navigation support
- **Smooth Animations**: Enhanced user experience
- **Consistent Branding**: RV College of Engineering theme

## 🔒 Security Features

- **Voter ID Validation**: Prevents duplicate voting
- **Form Validation**: Ensures complete data entry
- **Data Integrity**: File-based storage with validation
- **Session Management**: Tracks voting status
- **Account Security**: Username/email uniqueness validation
- **Password Strength**: Enforces strong password requirements

## 📱 Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## 🚀 Future Enhancements

1. **Database Integration**: Replace file storage with SQLite/MySQL
2. **Real-time Updates**: WebSocket for live results
3. **Admin Panel**: Manage candidates and elections
4. **Voter Authentication**: Secure login system
5. **Audit Trail**: Detailed voting logs
6. **Email Notifications**: Vote confirmation emails
7. **Password Hashing**: Secure password storage
8. **Session Management**: JWT tokens for authentication

## 🐛 Troubleshooting

### Common Issues:

1. **"Invalid credentials" after signup**:
   - Check that you're using the exact username/password from signup
   - Try refreshing the login page
   - Use the test page to verify account creation

2. **Signup not working**:
   - Ensure all fields are filled correctly
   - Check password strength requirements
   - Verify email format is valid

3. **Voting not working**:
   - Make sure you're logged in first
   - Check that all positions have candidates selected
   - Verify Voter ID is entered

### Testing:
Use `test_account_system.html` to debug account issues and verify system functionality.

---

**Built with ❤️ for RV College of Engineering**

*This project demonstrates fundamental DSA concepts in a practical, real-world application with a complete account management system.* 