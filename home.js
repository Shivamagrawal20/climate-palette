// Constants
const DEFAULT_API_KEY = "901bc23c33a0d73bc73de4858b84ca69";

// State
let state = {
    apiKey: localStorage.getItem("weatherApiKey") || DEFAULT_API_KEY,
    tempUnit: localStorage.getItem("tempUnit") || "C"
};

// DOM Elements
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const settingsBtn = document.getElementById("settingsBtn");
const settingsModal = document.getElementById("settingsModal");
const closeSettings = document.getElementById("closeSettings");
const apiKeyInput = document.getElementById("apiKeyInput");
const tempCelsius = document.getElementById("tempCelsius");
const tempFahrenheit = document.getElementById("tempFahrenheit");
const loading = document.getElementById("loading");

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    initializeApp();
});

function initializeApp() {
    apiKeyInput.value = state.apiKey;
    updateTempUnitUI();
    
    // Event Listeners
    searchBtn.addEventListener("click", () => handleSearch(searchInput.value));
    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") handleSearch(searchInput.value);
    });
    
    locationBtn.addEventListener("click", getCurrentLocation);
    settingsBtn.addEventListener("click", openSettings);
    closeSettings.addEventListener("click", closeSettingsModal);
    settingsModal.addEventListener("click", (e) => {
        if (e.target === settingsModal) closeSettingsModal();
    });
    
    tempCelsius.addEventListener("click", () => setTempUnit("C"));
    tempFahrenheit.addEventListener("click", () => setTempUnit("F"));
    
    apiKeyInput.addEventListener("change", (e) => {
        state.apiKey = e.target.value;
        localStorage.setItem("weatherApiKey", state.apiKey);
    });
    
    // Add interactive effects
    addInteractiveEffects();
    
    // Add city card click handlers
    addCityCardHandlers();
}

// Search & Location
async function handleSearch(city) {
    if (!city.trim()) return;
    
    // Store the city in localStorage for the dashboard to use
    localStorage.setItem("selectedCity", city);
    
    // Navigate to dashboard
    window.location.href = "dashboard.html";
}

async function getCurrentLocation() {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser");
        return;
    }
    
    showLoading(true);
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            
            try {
                // Get city name from coordinates
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${state.apiKey}`
                );
                const data = await response.json();
                
                if (data.name) {
                    localStorage.setItem("selectedCity", data.name);
                    window.location.href = "dashboard.html";
                }
            } catch (error) {
                console.error("Error fetching location:", error);
                alert("Failed to get weather for your location");
            } finally {
                showLoading(false);
            }
        },
        (error) => {
            showLoading(false);
            alert("Unable to retrieve your location");
        }
    );
}

// UI Controls
function showLoading(show) {
    if (show) {
        loading.classList.remove("hidden");
    } else {
        loading.classList.add("hidden");
    }
}

function openSettings() {
    settingsModal.classList.remove("hidden");
}

function closeSettingsModal() {
    settingsModal.classList.add("hidden");
}

function setTempUnit(unit) {
    state.tempUnit = unit;
    localStorage.setItem("tempUnit", unit);
    updateTempUnitUI();
}

function updateTempUnitUI() {
    tempCelsius.classList.toggle("active", state.tempUnit === "C");
    tempFahrenheit.classList.toggle("active", state.tempUnit === "F");
}

// Interactive Effects
function addInteractiveEffects() {
    // Animate hero icon based on time of day
    const heroIcon = document.getElementById("heroWeatherIcon");
    const hour = new Date().getHours();
    
    if (hour >= 6 && hour < 12) {
        heroIcon.textContent = "🌅";
    } else if (hour >= 12 && hour < 18) {
        heroIcon.textContent = "☀️";
    } else if (hour >= 18 && hour < 20) {
        heroIcon.textContent = "🌇";
    } else {
        heroIcon.textContent = "🌙";
    }
    
    // Add search input focus effects
    const searchBar = searchInput.closest(".search-bar");
    
    searchInput.addEventListener("focus", () => {
        searchBar.style.transform = "scale(1.02)";
        searchBar.style.boxShadow = "0 8px 30px rgba(0, 0, 0, 0.3)";
    });
    
    searchInput.addEventListener("blur", () => {
        searchBar.style.transform = "scale(1)";
        searchBar.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
    });
    
    // Add typing animation to search input
    searchInput.addEventListener("input", () => {
        if (searchInput.value.length > 0) {
            searchBar.style.borderColor = "var(--primary)";
        } else {
            searchBar.style.borderColor = "var(--glass-border)";
        }
    });
    
    // Add parallax effect to background elements
    window.addEventListener("mousemove", (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        document.querySelectorAll(".floating-cloud").forEach((cloud, index) => {
            const speed = (index + 1) * 0.5;
            const x = (mouseX - 0.5) * speed * 20;
            const y = (mouseY - 0.5) * speed * 20;
            
            cloud.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
}

// City Card Handlers
function addCityCardHandlers() {
    document.querySelectorAll(".city-card").forEach(card => {
        card.addEventListener("click", function(e) {
            const city = this.getAttribute("data-city");
            
            // Add ripple effect
            const ripple = document.createElement("div");
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + "px";
            ripple.style.left = x + "px";
            ripple.style.top = y + "px";
            ripple.classList.add("ripple");
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
                handleSearch(city);
            }, 300);
        });
    });
}
