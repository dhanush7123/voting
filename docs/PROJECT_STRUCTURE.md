# Smart Voting System - Project Structure

## 📁 Organized Folder Structure

The Smart Voting System has been restructured into a modular and organized folder system for better maintainability and collaboration.

### 🏗️ Root Directory Structure

```
vote/
├── index.html                    # Main entry point (redirects to templates)
├── voting_system.exe            # Compiled C++ executable
├── templates/                   # All HTML template files
├── static/                      # Static assets (CSS, JS, Images)
├── src/                         # Source code files
├── docs/                        # Documentation and text files
└── scripts/                     # Build and run scripts
```

### 📄 Templates Folder (`templates/`)
Contains all HTML template files:
- `index.html` - Splash screen
- `login.html` - User login page
- `signup.html` - User registration page
- `forgot-password.html` - Password recovery page
- `reset-password.html` - Password reset page
- `home.html` - Main voting dashboard
- `voting.html` - Voting interface
- `candidate.html` - Candidate selection page
- `results.html` - Voting results page
- `test_account_system.html` - Account system testing
- `demo_dsa_concepts.html` - DSA concepts demonstration

### 🎨 Static Assets (`static/`)
Organized static files for the web interface:

#### CSS Files (`static/css/`)
- `common.css` - Shared styles and components
- `splash.css` - Splash screen styles
- `login.css` - Login page styles
- `signup.css` - Registration page styles
- `forgot-password.css` - Password recovery styles
- `reset-password.css` - Password reset styles
- `voting.css` - Voting interface styles
- `style.css` - Additional styling

#### JavaScript Files (`static/js/`)
- `script.js` - Main application logic
- `signup.js` - Registration functionality
- `forgot-password.js` - Password recovery logic
- `reset-password.js` - Password reset functionality
- `voting.js` - Voting system logic

#### Images (`static/images/`)
- `logo-rvce_0.png` - RV College of Engineering logo
- `monkey-open.png` - UI element
- `monkey-closed.png` - UI element
- `placeholder.txt` - Placeholder file

#### Additional Static Files
- `styles.css` - Comprehensive styling
- `app.js` - Application-specific JavaScript

### 💻 Source Code (`src/`)

#### C++ Files (`src/cpp/`)
- `main.cpp` - Main C++ program entry point
- `structures.cpp` - Data structures implementation
- `voting.cpp` - Voting logic implementation
- `blockchain.cpp` - Blockchain functionality
- `test_main.cpp` - C++ testing utilities

### 📚 Documentation (`docs/`)
- `README.md` - Main project documentation
- `FINAL_SUMMARY.md` - Project summary
- `SMART_VOTING_README.md` - Smart voting system documentation
- `LANDSCAPE_VOTING_README.md` - Landscape voting documentation
- `VOTING_SYSTEM_README.md` - Voting system overview
- `candidates.txt` - Candidate information
- `PROJECT_STRUCTURE.md` - This file

### 🔧 Scripts (`scripts/`)
- `compile_and_test.bat` - C++ compilation and testing script
- `run_voting_system.bat` - C++ voting system runner

## 🔄 Path Updates

All file references have been updated to reflect the new structure:

### HTML Files
- CSS links: `../static/css/filename.css`
- JavaScript links: `../static/js/filename.js`
- Image links: `../static/images/filename.png`
- Internal page links: `filename.html` (relative to templates folder)

### Batch Files
- C++ source paths: `src/cpp/filename.cpp`
- Output executable: `voting_system.exe`

## 🚀 How to Run

### Web Interface
1. Open `index.html` in your browser
2. The system will automatically redirect to `templates/index.html`
3. Navigate through the voting system interface

### C++ Backend
1. Navigate to the project root directory
2. Run `scripts/compile_and_test.bat` to compile and test
3. Or run `scripts/run_voting_system.bat` to compile and run

## ✅ Benefits of New Structure

1. **Modularity**: Clear separation of concerns
2. **Maintainability**: Easy to locate and modify files
3. **Scalability**: Easy to add new features and components
4. **Collaboration**: Team members can work on different modules
5. **Debugging**: Organized structure makes troubleshooting easier
6. **Documentation**: Centralized documentation in docs folder

## 🔧 Maintenance Notes

- All existing functionality has been preserved
- File paths have been updated throughout the project
- No breaking changes to the user experience
- C++ compilation scripts updated for new paths
- Web interface maintains all original features and styling

## 📝 Future Development

This structure supports:
- Adding new voting categories
- Implementing additional security features
- Expanding the blockchain functionality
- Adding new UI components
- Integrating with external systems
- Multi-language support
- Mobile app development

---

*Last Updated: Project Restructuring Complete*
*Maintained by: Smart Voting System Development Team* 