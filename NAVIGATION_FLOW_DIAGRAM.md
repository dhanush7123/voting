# Smart Voting System - Navigation Flow Diagram

## Page Navigation Map

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SMART VOTING SYSTEM                               │
│                              Navigation Flow                                 │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐
│   SPLASH PAGE   │  (index.html)
│                 │
│ CSS: common.css │
│     splash.css  │
│                 │
│ Features:       │
│ • RVCE Logo     │
│ • Loading Dots  │
│ • Starfield     │
│ • Theme Toggle  │
└─────────┬───────┘
          │
          │ Auto-redirect (3.5s)
          ▼
┌─────────────────┐
│   LOGIN PAGE    │  (login.html)
│                 │
│ CSS: shared-    │
│   animations.css│
│   login-space.css│
│                 │
│ Buttons/Links:  │
│ • Sign In →     │
│   home.html     │
│ • Sign Up →     │
│   signup.html   │
│ • Forgot Pass → │
│   forgot-password.html
│                 │
│ Features:       │
│ • Space Theme   │
│ • Spaceships    │
│ • Password Toggle│
│ • Form Validation│
└─────────┬───────┘
          │
          │ Successful Login
          ▼
┌─────────────────┐
│   HOME PAGE     │  (home.html)
│                 │
│ CSS: home.css   │
│   profile-panel.css│
│                 │
│ Buttons/Links:  │
│ • Start Voting →│
│   Scroll to     │
│   Categories    │
│ • View Results →│
│   results.html  │
│ • Profile Icon →│
│   Open Panel    │
│ • Category Cards│
│   → voting.html │
│ • Logout →      │
│   login.html    │
│                 │
│ Features:       │
│ • Category Grid │
│ • Profile Panel │
│ • Welcome Msg   │
│ • Particle BG   │
└─────────┬───────┘
          │
          │ Category Selection
          ▼
┌─────────────────┐
│  VOTING PAGE    │  (voting.html)
│                 │
│ CSS: shared-    │
│   animations.css│
│                 │
│ Buttons/Links:  │
│ • Cast Vote →   │
│   Submit & Show │
│   Results       │
│ • Footer Links: │
│   Home, Results,│
│   Login         │
│                 │
│ Features:       │
│ • Voter ID      │
│ • Position      │
│   Dropdowns     │
│ • Live Results  │
│ • Form Validation│
└─────────┬───────┘
          │
          │ Vote Submission
          ▼
┌─────────────────┐
│  RESULTS PAGE   │  (results.html)
│                 │
│ CSS: shared-    │
│   animations.css│
│                 │
│ Buttons/Links:  │
│ • Back to Home →│
│   home.html     │
│ • Back to Cats →│
│   Categories    │
│   View          │
│ • Footer Links: │
│   Home, Login,  │
│   Sign Up       │
│                 │
│ Features:       │
│ • Category Cards│
│ • Detailed      │
│   Results       │
│ • D3.js Charts  │
│ • Winner Modal  │
└─────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                           ALTERNATIVE FLOWS                                 │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   SIGNUP PAGE   │    │ FORGOT PASSWORD │    │ RESET PASSWORD  │
│                 │    │                 │    │                 │
│ CSS: shared-    │    │ CSS: shared-    │    │ CSS: shared-    │
│   animations.css│    │   animations.css│    │   animations.css│
│                 │    │                 │    │                 │
│ Buttons/Links:  │    │ Buttons/Links:  │    │ Buttons/Links:  │
│ • Create Acc →  │    │ • Send → Email  │    │ • Update Pass → │
│   login.html    │    │   Reset         │    │   Success Msg   │
│ • Sign In →     │    │ • Back to Sign →│    │ • Back to Sign →│
│   login.html    │    │   login.html    │    │   login.html    │
│ • Sign Up →     │    │ • Sign Up →     │    │                 │
│   signup.html   │    │   signup.html   │    │ Features:       │
│                 │    │                 │    │ • Pass Strength │
│ Features:       │    │ Features:       │    │ • Confirmation  │
│ • Pass Strength │    │ • Email Valid   │    │ • Success Msg   │
│ • Real-time Val │    │ • Success Msg   │    │ • Form Anim     │
│ • Particle BG   │    │ • Particle BG   │    │                 │
│ • Form Anim     │    │ • Form Anim     │    └─────────────────┘
└─────────────────┘    └─────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                           CSS FILE MAPPING                                  │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  shared-animations.css  (Used by ALL pages except splash)                   │
│  ├── Global theme variables (light/dark mode)                              │
│  ├── Particle background animations                                         │
│  ├── Form styling and animations                                           │
│  ├── Button effects and hover states                                       │
│  ├── Notification system                                                   │
│  ├── Loading states and shimmer effects                                    │
│  └── Responsive design utilities                                           │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  common.css  (Used by splash page)                                          │
│  ├── Basic layout and typography                                            │
│  ├── Theme toggle functionality                                             │
│  └── Common utility classes                                                 │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  splash.css  (Used by splash page)                                          │
│  ├── Splash screen animations                                               │
│  ├── Logo and heart animations                                              │
│  ├── Loading dots animation                                                 │
│  └── Starfield background                                                   │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  login-space.css  (Used by login page)                                      │
│  ├── Space theme styling                                                    │
│  ├── Spaceship animations                                                   │
│  ├── Asteroid floating effects                                              │
│  └── Space-themed form elements                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  home.css  (Used by home page)                                              │
│  ├── Hero section styling                                                   │
│  ├── Category cards layout                                                  │
│  ├── Welcome section animations                                             │
│  └── Button styling and effects                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  profile-panel.css  (Used by home page)                                     │
│  ├── Profile panel overlay                                                  │
│  ├── Avatar upload functionality                                            │
│  ├── User information form                                                  │
│  └── Panel animations and transitions                                       │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                           BUTTON ANALYSIS                                   │
└─────────────────────────────────────────────────────────────────────────────┘

PRIMARY NAVIGATION BUTTONS:
┌─────────────────┬─────────────────┬─────────────────┐
│ Button          │ Location        │ Destination     │
├─────────────────┼─────────────────┼─────────────────┤
│ Sign In         │ login.html      │ home.html       │
│ Create Account  │ signup.html     │ login.html      │
│ Start Voting    │ home.html       │ Scroll to cats  │
│ View Results    │ home.html       │ results.html    │
│ Cast Your Vote  │ voting.html     │ Submit votes    │
│ Back to Home    │ results.html    │ home.html       │
│ Update Password │ reset-password.html │ Success msg  │
└─────────────────┴─────────────────┴─────────────────┘

SECONDARY NAVIGATION LINKS:
┌─────────────────┬─────────────────┬─────────────────┐
│ Link            │ Location        │ Destination     │
├─────────────────┼─────────────────┼─────────────────┤
│ Sign Up         │ login.html      │ signup.html     │
│ Forgot Password │ login.html      │ forgot-password.html │
│ Sign In         │ signup.html     │ login.html      │
│ Back to Sign In │ forgot-password.html │ login.html  │
│ Sign Up         │ forgot-password.html │ signup.html │
│ Back to Sign In │ reset-password.html │ login.html  │
└─────────────────┴─────────────────┴─────────────────┘

FOOTER NAVIGATION LINKS:
┌─────────────────┬─────────────────┬─────────────────┐
│ Link            │ Pages           │ Destination     │
├─────────────────┼─────────────────┼─────────────────┤
│ Home            │ voting.html,    │ home.html       │
│                 │ results.html    │                 │
│ Results         │ voting.html     │ results.html    │
│ Login           │ voting.html,    │ login.html      │
│                 │ results.html    │                 │
│ Sign Up         │ results.html    │ signup.html     │
└─────────────────┴─────────────────┴─────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                           THEME CONSISTENCY                                 │
└─────────────────────────────────────────────────────────────────────────────┘

COLOR SCHEME:
┌─────────────────┬─────────────────┬─────────────────┐
│ Color Type      │ Hex Code        │ Usage           │
├─────────────────┼─────────────────┼─────────────────┤
│ Primary         │ #667eea         │ Main buttons    │
│ Secondary       │ #764ba2         │ Accents         │
│ Accent          │ #4facfe         │ Highlights      │
│ Success         │ #10b981         │ Success states  │
│ Warning         │ #f59e0b         │ Warnings        │
│ Error           │ #ef4444         │ Error states    │
└─────────────────┴─────────────────┴─────────────────┘

ANIMATIONS:
┌─────────────────┬─────────────────┬─────────────────┐
│ Animation       │ Usage           │ CSS Class       │
├─────────────────┼─────────────────┼─────────────────┤
│ Fade In Up      │ Page transitions│ fadeInUp        │
│ Shimmer         │ Button hover    │ btn-shimmer     │
│ Ripple          │ Click feedback  │ ripple          │
│ Float           │ Background      │ float           │
│ Pulse           │ Loading states  │ pulse           │
│ Glow            │ Interactive     │ glow            │
└─────────────────┴─────────────────┴─────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                           JAVASCRIPT INTEGRATION                            │
└─────────────────────────────────────────────────────────────────────────────┘

SHARED SCRIPTS:
┌─────────────────┬─────────────────┬─────────────────┐
│ Script File     │ Used By         │ Functionality   │
├─────────────────┼─────────────────┼─────────────────┤
│ script.js       │ All pages       │ Common functions│
│ shared-animations.js │ All pages   │ Animations      │
│ home-animations.js │ home.html     │ Home animations │
│ profile-panel.js │ home.html      │ Profile mgmt    │
│ voting.js       │ voting.html     │ Voting logic    │
│ blockchain-voting.js │ voting.html │ Blockchain      │
└─────────────────┴─────────────────┴─────────────────┘

KEY FEATURES:
• Theme switching (light/dark mode)
• Form validation and submission
• Audio feedback on interactions
• Loading states and animations
• Notification system
• Local storage management
• Real-time updates and charts
• Profile management
• Password strength checking
• Responsive design
• Accessibility features
• Security validation 