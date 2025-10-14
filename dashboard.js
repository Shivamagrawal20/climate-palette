// Constants
const DEFAULT_API_KEY = "901bc23c33a0d73bc73de4858b84ca69";
const API_BASE_URL = "https://api.openweathermap.org/data/2.5";

// State
let state = {
    apiKey: localStorage.getItem("weatherApiKey") || DEFAULT_API_KEY,
    tempUnit: localStorage.getItem("tempUnit") || "C",
    favoriteCities: JSON.parse(localStorage.getItem("favoriteCities") || "[]"),
    currentCity: null,
    weatherData: null
};

// DOM Elements
const backBtn = document.getElementById("backBtn");
const searchInputDashboard = document.getElementById("searchInputDashboard");
const settingsBtnDashboard = document.getElementById("settingsBtnDashboard");
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
    backBtn.addEventListener("click", () => {
        window.location.href = "home.html";
    });
    
    searchInputDashboard.addEventListener("keypress", (e) => {
        if (e.key === "Enter") handleSearch(searchInputDashboard.value);
    });
    
    settingsBtnDashboard.addEventListener("click", openSettings);
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
    
    // Load weather data for the selected city
    const selectedCity = localStorage.getItem("selectedCity");
    if (selectedCity) {
        fetchWeather(selectedCity);
    } else {
        // If no city selected, redirect to home
        window.location.href = "home.html";
    }
}

// Search & Location
async function handleSearch(city) {
    if (!city.trim()) return;
    await fetchWeather(city);
}

async function fetchWeather(city) {
    showLoading(true);
    
    try {
        // Fetch current weather
        const currentUrl = `${API_BASE_URL}/weather?q=${city}&appid=${state.apiKey}&units=metric`;
        const currentResponse = await fetch(currentUrl);
        const currentData = await currentResponse.json();
        
        if (currentData.cod !== 200) {
            throw new Error(currentData.message || "City not found");
        }
        
        // Fetch forecast
        const forecastUrl = `${API_BASE_URL}/forecast?q=${city}&appid=${state.apiKey}&units=metric`;
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();
        
        // Process data
        state.weatherData = processWeatherData(currentData, forecastData);
        state.currentCity = city;
        
        // Update UI
        renderWeather();
        
    } catch (error) {
        console.error("Error fetching weather:", error);
        alert(error.message || "Failed to fetch weather data");
    } finally {
        showLoading(false);
    }
}

function processWeatherData(current, forecast) {
    // Process hourly data (first 8 hours)
    const hourlyData = forecast.list.slice(0, 8).map(item => ({
        time: new Date(item.dt * 1000).toLocaleTimeString("en-US", { 
            hour: "numeric", 
            hour12: true 
        }),
        temp: item.main.temp,
        condition: item.weather[0].main
    }));
    
    // Process daily data (7 days)
    const dailyMap = {};
    forecast.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString("en-US", { weekday: "short" });
        
        if (!dailyMap[day]) {
            dailyMap[day] = {
                day,
                temps: [],
                condition: item.weather[0].main
            };
        }
        dailyMap[day].temps.push(item.main.temp);
    });
    
    const dailyData = Object.values(dailyMap).slice(0, 7).map(day => ({
        day: day.day,
        tempMax: Math.max(...day.temps),
        tempMin: Math.min(...day.temps),
        condition: day.condition
    }));
    
    return {
        current: {
            temp: current.main.temp,
            condition: current.weather[0].main,
            city: current.name,
            country: current.sys.country,
            feelsLike: current.main.feels_like,
            humidity: current.main.humidity,
            windSpeed: current.wind.speed,
            visibility: current.visibility / 1000,
            pressure: current.main.pressure,
            uvIndex: 0,
            sunrise: new Date(current.sys.sunrise * 1000).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true
            }),
            sunset: new Date(current.sys.sunset * 1000).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true
            })
        },
        hourly: hourlyData,
        daily: dailyData
    };
}

// Render Functions
function renderWeather() {
    if (!state.weatherData) return;
    
    updateBackground(state.weatherData.current.condition);
    renderCurrentWeather();
    renderHourlyForecast();
    renderDailyForecast();
    renderWeatherDetails();
    renderFavorites();
}

function renderCurrentWeather() {
    const { current } = state.weatherData;
    const container = document.getElementById("currentWeather");
    
    const icon = getWeatherIconSVG(current.condition, 80);
    const temp = formatTemp(current.temp);
    
    container.innerHTML = `
        <div class="weather-icon-large">${icon}</div>
        <div class="temp-large">${temp}</div>
        <div class="condition">${current.condition}</div>
        <div class="location">${current.city}, ${current.country}</div>
        <div class="current-stats">
            <div class="stat">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2v10m0 0L8 8m4 4 4-4"></path>
                </svg>
                <span>Feels like ${formatTemp(current.feelsLike)}</span>
            </div>
            <div class="stat">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
                </svg>
                <span>${current.humidity}% Humidity</span>
            </div>
            <div class="stat">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path>
                </svg>
                <span>${current.windSpeed} m/s Wind</span>
            </div>
        </div>
    `;
}

function renderHourlyForecast() {
    const container = document.getElementById("hourlyForecast");
    const hourlyHTML = state.weatherData.hourly.map(hour => {
        const icon = getWeatherIconSVG(hour.condition, 32);
        return `
            <div class="hourly-item">
                <div style="font-size: 0.875rem; margin-bottom: 0.5rem;">${hour.time}</div>
                <div style="margin-bottom: 0.5rem;">${icon}</div>
                <div style="font-weight: 600;">${formatTemp(hour.temp)}</div>
            </div>
        `;
    }).join("");
    
    container.innerHTML = `
        <h3 class="forecast-title">Hourly Forecast</h3>
        <div class="hourly-scroll">${hourlyHTML}</div>
    `;
}

function renderDailyForecast() {
    const container = document.getElementById("dailyForecast");
    const dailyHTML = state.weatherData.daily.map(day => {
        const icon = getWeatherIconSVG(day.condition, 24);
        return `
            <div class="daily-item">
                <div class="daily-day">${day.day}</div>
                <div class="daily-condition">
                    ${icon}
                    <span style="text-transform: capitalize;">${day.condition}</span>
                </div>
                <div class="daily-temps">
                    <span style="font-weight: 600;">${Math.round(day.tempMax)}°</span>
                    <span style="color: var(--muted-foreground);">${Math.round(day.tempMin)}°</span>
                </div>
            </div>
        `;
    }).join("");
    
    container.innerHTML = `
        <h3 class="forecast-title">7-Day Forecast</h3>
        ${dailyHTML}
    `;
}

function renderWeatherDetails() {
    const { current } = state.weatherData;
    const container = document.getElementById("weatherDetails");
    
    const details = [
        { icon: "droplet", label: "Humidity", value: `${current.humidity}%` },
        { icon: "wind", label: "Wind Speed", value: `${current.windSpeed} m/s` },
        { icon: "eye", label: "Visibility", value: `${current.visibility} km` },
        { icon: "gauge", label: "Pressure", value: `${current.pressure} hPa` },
        { icon: "sun", label: "UV Index", value: current.uvIndex },
        { icon: "sunrise", label: "Sunrise", value: current.sunrise },
        { icon: "sunset", label: "Sunset", value: current.sunset }
    ];
    
    const detailsHTML = details.map(detail => `
        <div class="detail-item">
            <div class="detail-icon">${getDetailIconSVG(detail.icon)}</div>
            <div class="detail-label">${detail.label}</div>
            <div class="detail-value">${detail.value}</div>
        </div>
    `).join("");
    
    container.innerHTML = `
        <h3 class="forecast-title">Weather Details</h3>
        <div class="details-grid">${detailsHTML}</div>
    `;
}

function renderFavorites() {
    const container = document.getElementById("favoritesContainer");
    
    if (state.favoriteCities.length === 0) {
        container.classList.add("hidden");
        return;
    }
    
    container.classList.remove("hidden");
    const favoritesHTML = state.favoriteCities.map(city => `
        <span class="favorite-badge" onclick="handleSearch('${city}')">${city}</span>
    `).join("");
    
    container.innerHTML = `
        <h3 class="favorites-title">Favorite Cities</h3>
        <div class="favorites-list">${favoritesHTML}</div>
    `;
}

// Helper Functions
function formatTemp(temp) {
    const value = state.tempUnit === "F" ? (temp * 9/5) + 32 : temp;
    return `${Math.round(value)}°${state.tempUnit}`;
}

function getWeatherIconSVG(condition, size = 24) {
    const lower = condition.toLowerCase();
    const stroke = "currentColor";
    const strokeWidth = "1.5";
    
    if (lower.includes("rain")) {
        return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}">
            <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
            <path d="M16 14v6m-4-6v6m-4-6v6"></path>
        </svg>`;
    }
    if (lower.includes("drizzle")) {
        return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}">
            <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
            <path d="M8 19v1m8-1v1m-4-2v1"></path>
        </svg>`;
    }
    if (lower.includes("snow")) {
        return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}">
            <path d="m10 10-6.157 3.632M14 10l6.157 3.632M12 3v18m0-2.5v-2m0-5v-2m0-2.5v-2"></path>
            <path d="M8 8 4.5 5.5M16 8l3.5-2.5m0 15L16 18M8 18l-3.5 2.5"></path>
        </svg>`;
    }
    if (lower.includes("clear")) {
        return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}">
            <circle cx="12" cy="12" r="4"></circle>
            <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>
        </svg>`;
    }
    // Default: cloud
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}">
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
    </svg>`;
}

function getDetailIconSVG(type) {
    const icons = {
        droplet: '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>',
        wind: '<path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path>',
        eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle>',
        gauge: '<path d="m12 14 4-4"></path><path d="M3.34 19a10 10 0 1 1 17.32 0"></path>',
        sun: '<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>',
        sunrise: '<path d="M12 2v8m-4-4 4 4 4-4M2 18h2m16 0h2M6 22h12a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2z"></path>',
        sunset: '<path d="M12 10V2m-4 4 4-4 4 4M2 18h2m16 0h2M6 22h12a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2z"></path>'
    };
    
    return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${icons[type] || ''}</svg>`;
}

function updateBackground(condition) {
    const gradients = {
        clear: "linear-gradient(135deg, hsl(200, 80%, 50%), hsl(220, 70%, 60%), hsl(240, 60%, 70%))",
        rain: "linear-gradient(135deg, hsl(220, 40%, 30%), hsl(230, 50%, 40%), hsl(240, 60%, 50%))",
        clouds: "linear-gradient(135deg, hsl(210, 30%, 40%), hsl(220, 40%, 50%), hsl(230, 50%, 60%))",
        snow: "linear-gradient(135deg, hsl(200, 30%, 70%), hsl(210, 40%, 80%), hsl(220, 50%, 90%))",
        default: "linear-gradient(135deg, hsl(260, 80%, 35%), hsl(250, 70%, 45%), hsl(240, 60%, 55%))"
    };
    
    const lower = condition.toLowerCase();
    let gradient = gradients.default;
    
    if (lower.includes("clear")) gradient = gradients.clear;
    else if (lower.includes("rain") || lower.includes("drizzle")) gradient = gradients.rain;
    else if (lower.includes("cloud")) gradient = gradients.clouds;
    else if (lower.includes("snow")) gradient = gradients.snow;
    
    document.body.style.background = gradient;
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
    if (state.weatherData) renderWeather();
}

function updateTempUnitUI() {
    tempCelsius.classList.toggle("active", state.tempUnit === "C");
    tempFahrenheit.classList.toggle("active", state.tempUnit === "F");
}
