# RV College of Engineering - Smart Voting System

A modern, responsive voting system website with beautiful animations and dark/light mode support.

## 🚀 Features

### Page 1 - Splash Screen
- **Heart-shaped RV logo** with zoom-in animation
- **Dark/Light mode toggle** (top-right corner)
- **Auto-redirect** to login page after 3 seconds
- **Click anywhere** to skip the splash screen
- **Loading animation** with bouncing dots
- **Responsive design** for all devices

### Page 2 - Login Page
- **Clean login form** with username and password fields
- **Password visibility toggle** (eye icon)
- **Form validation** with helpful error messages
- **Loading states** with spinner animation
- **Success/Error notifications**
- **Sign Up** and **Forgot Password** links
- **Persistent theme** (remembers your preference)

## 🎨 Design Features

- **Modern UI** with smooth animations
- **Gradient backgrounds** and beautiful color schemes
- **Soft shadows** and rounded corners
- **Inter font family** for clean typography
- **Hover effects** and interactive elements
- **Fully responsive** for mobile and desktop

## 📁 File Structure

```
vote/
├── index.html          # Splash screen (Page 1)
├── login.html          # Login page (Page 2)
├── common.css          # Shared styles (theme, base, common components)
├── splash.css          # Splash screen specific styles
├── login.css           # Login page specific styles
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## 🛠️ Setup Instructions

1. **Download/Clone** the project files
2. **Open** `index.html` in your web browser
3. **That's it!** No server setup required

### For Development:
- Use a local server for better development experience
- Example with Python: `python -m http.server 8000`
- Example with Node.js: `npx serve .`

## 🎯 How to Use

### Splash Screen
1. The page loads with a beautiful heart-shaped RV logo
2. Watch the zoom-in animation and loading dots
3. Wait 3 seconds or click anywhere to proceed
4. Use the theme toggle (☀️/🌙) to switch between light and dark modes

### Login Page
1. Enter your username (minimum 3 characters)
2. Enter your password (minimum 6 characters)
3. Click "Sign In" or press Enter
4. Watch the loading animation
5. See success/error notifications
6. Use the password toggle (👁️) to show/hide password

## ⌨️ Keyboard Shortcuts

- **Ctrl/Cmd + K**: Toggle dark/light mode
- **Enter** (on splash screen): Skip to login page
- **Enter** (on login form): Submit the form

## 🎨 Customization

### CSS File Organization
The styles are now organized into separate files for easier maintenance:

- **`common.css`**: Theme variables, base styles, shared components
- **`splash.css`**: Splash screen specific styles and animations
- **`login.css`**: Login page specific styles and form elements

### Colors
The color scheme is defined in CSS variables in `common.css`:
```css
:root {
    --bg-primary-light: #ffffff;
    --accent-light: #3b82f6;
    /* ... more variables */
}
```

### Logo
Replace the placeholder heart logo:
1. Find the `.heart-shape` class in `splash.css`
2. Replace the CSS-based heart with your actual logo image
3. Update the HTML structure accordingly

### Animations
Modify animation durations and effects in their respective CSS files:
- **Splash animations**: `splash.css`
- **Login animations**: `login.css`
- **Common animations**: `common.css`

## 🔧 Technical Details

### Technologies Used
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with animations
- **Vanilla JavaScript** - No frameworks required
- **CSS Grid & Flexbox** - Responsive layouts
- **CSS Custom Properties** - Theme management

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Performance
- **Lightweight** - No external dependencies
- **Fast loading** - Optimized CSS and JS
- **Smooth animations** - Hardware-accelerated CSS transforms
- **Modular CSS** - Separate files for better caching

## 🚀 Future Enhancements

- [ ] Add actual authentication backend
- [ ] Create voting dashboard
- [ ] Add user registration
- [ ] Implement password recovery
- [ ] Add more animations and micro-interactions
- [ ] Create admin panel
- [ ] Add real-time voting features

## 📝 Notes

- The login form currently uses simulated authentication
- Replace the placeholder validation with your actual backend
- The heart logo is CSS-based; replace with your actual RV logo
- Theme preference is saved in localStorage
- All animations are CSS-based for optimal performance
- CSS files are organized for easy maintenance and future expansion

## 🤝 Contributing

Feel free to enhance the code and submit improvements!

## 📄 License

This project is open source and available under the MIT License.

---

**Built with ❤️ for RV College of Engineering** 