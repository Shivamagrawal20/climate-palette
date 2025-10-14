# 🌤️ Weather ForeCasts

A modern, responsive weather application built with vanilla HTML, CSS, and JavaScript. Get accurate weather forecasts for any city worldwide with a beautiful, user-friendly interface.

![Weather ForeCasts](https://img.shields.io/badge/Weather-App-blue?style=for-the-badge&logo=weather)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## ✨ Features

### 🏠 **Homepage**
- **Modern Website Design** with navbar and footer
- **Interactive Hero Section** with animated weather icons
- **Popular Cities Grid** with country flags and ripple effects
- **Quick Stats Display** (1000+ Cities, 24/7 Updates, 99.9% Accuracy)
- **Features Section** highlighting app capabilities
- **About Section** with company information
- **Contact Section** with support details
- **Responsive Design** that works on all devices

### 📊 **Dashboard**
- **Current Weather Display** with large temperature and conditions
- **Hourly Forecast** with 8-hour scrollable timeline
- **7-Day Forecast** with daily highs and lows
- **Detailed Weather Information** (humidity, wind, pressure, sunrise/sunset)
- **Favorites Section** for saved cities
- **Search Functionality** for quick city switching
- **Back Navigation** to return to homepage

### 🎨 **Design Features**
- **Light Theme** with clean, modern aesthetics
- **Glassmorphism Effects** for modern UI elements
- **Smooth Animations** and transitions throughout
- **Interactive Elements** with hover effects and ripple animations
- **Parallax Background Effects** that respond to mouse movement
- **Mobile-First Responsive Design**

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for weather data
- Optional: OpenWeatherMap API key (default key included)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/weather-forecasts.git
   cd weather-forecasts
   ```

2. **Open in browser**
   ```bash
   # Using Python (if installed)
   python3 -m http.server 8000
   
   # Or simply open index.html in your browser
   open index.html
   ```

3. **Access the application**
   - Visit `http://localhost:8000` (if using server)
   - Or double-click `index.html` to open directly

## 📁 Project Structure

```
weather-forecasts/
├── index.html          # Entry point (redirects to home)
├── home.html           # Homepage with search and features
├── dashboard.html      # Weather dashboard
├── home.js             # Homepage JavaScript functionality
├── dashboard.js        # Dashboard JavaScript functionality
├── styles.css          # Shared CSS styles
└── README.md           # Project documentation
```

## 🔧 Configuration

### API Key Setup
1. Get a free API key from [OpenWeatherMap](https://openweathermap.org/api)
2. Open the Settings modal (⚙️ button)
3. Enter your API key in the input field
4. The key is automatically saved in your browser's localStorage

### Temperature Units
- Toggle between Celsius (°C) and Fahrenheit (°F)
- Setting is saved and remembered across sessions

## 🎯 Usage

### Homepage Navigation
1. **Search for Weather**: Enter a city name in the search bar
2. **Use Current Location**: Click the location button for GPS-based weather
3. **Popular Cities**: Click on any city card for instant weather access
4. **Settings**: Configure API key and temperature units

### Dashboard Features
1. **View Current Weather**: Large display with temperature and conditions
2. **Check Hourly Forecast**: Scroll through the next 8 hours
3. **Plan Ahead**: See 7-day forecast with highs and lows
4. **Detailed Information**: View humidity, wind, pressure, and more
5. **Search New City**: Use the search bar to switch locations
6. **Return Home**: Click "Back to Home" to search for another city

## 🌐 Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 Mobile Experience

The application is fully responsive and optimized for mobile devices:
- **Touch-friendly** buttons and interactions
- **Swipe gestures** for scrolling through forecasts
- **Optimized layouts** for small screens
- **Fast loading** on mobile networks

## 🎨 Customization

### Colors
The app uses CSS custom properties for easy theming:
```css
:root {
    --primary: hsl(200, 85%, 60%);      /* Main blue color */
    --accent: hsl(45, 95%, 60%);        /* Accent yellow */
    --background: hsl(0, 0%, 100%);     /* White background */
    --foreground: hsl(240, 10%, 20%);   /* Dark text */
}
```

### Animations
All animations can be customized in the CSS file:
- Hero animations
- Parallax effects
- Hover transitions
- Loading spinners

## 🔒 Privacy & Security

- **No Data Collection**: We don't store personal information
- **Local Storage Only**: Settings are saved locally in your browser
- **Secure API Calls**: All weather data requests use HTTPS
- **No Tracking**: No analytics or tracking scripts

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style and formatting
- Add comments for complex functionality
- Test on multiple browsers and devices
- Ensure responsive design works properly

## 🐛 Bug Reports

Found a bug? Please report it by:
1. Checking existing [issues](https://github.com/yourusername/weather-forecasts/issues)
2. Creating a new issue with:
   - Browser and version
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenWeatherMap** for providing the weather data API
- **CSS Grid and Flexbox** for responsive layouts
- **Modern Web Standards** for cross-browser compatibility
- **GitHub** for hosting and collaboration tools

## 📞 Support

Need help? Contact us:
- 📧 Email: support@weatherforecasts.com
- 🌐 Website: www.weatherforecasts.com
- 💬 Support: 24/7 Customer Support

## 🗺️ Roadmap

### Upcoming Features
- [ ] **Weather Alerts** and notifications
- [ ] **Weather Maps** with radar and satellite imagery
- [ ] **Historical Weather Data** for past dates
- [ ] **Weather Widgets** for embedding
- [ ] **Dark/Light Theme Toggle**
- [ ] **Offline Support** with cached data
- [ ] **Weather Comparison** between cities
- [ ] **Export Weather Data** to PDF/CSV

### Version History
- **v1.0.0** - Initial release with basic weather functionality
- **v1.1.0** - Added multi-page architecture
- **v1.2.0** - Enhanced homepage with website-style design
- **v1.3.0** - Light theme and improved mobile experience

---

<div align="center">
  <p>Made with ❤️ for weather enthusiasts worldwide</p>
  <p>⭐ Star this repository if you found it helpful!</p>
</div>