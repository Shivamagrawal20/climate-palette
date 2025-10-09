import { useState, useEffect } from "react";
import { MapPin, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import SearchBar from "@/components/SearchBar";
import CurrentWeather from "@/components/CurrentWeather";
import HourlyForecast from "@/components/HourlyForecast";
import DailyForecast from "@/components/DailyForecast";
import WeatherDetails from "@/components/WeatherDetails";
import Settings from "@/components/Settings";
import FavoriteCities from "@/components/FavoriteCities";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import weatherHero from "@/assets/weather-hero.png";
import { getWeatherBackground, formatTemp } from "@/utils/weatherBackground";

// Default API key (users should replace with their own)
const DEFAULT_API_KEY = "bd5e378503939ddaee76f12ad7a97608";
const API_BASE = "https://api.openweathermap.org/data/2.5";

interface WeatherData {
  temp: number;
  condition: string;
  city: string;
  country: string;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  visibility: number;
  pressure: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
}

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [hourlyData, setHourlyData] = useState<any[]>([]);
  const [dailyData, setDailyData] = useState<any[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("weatherApiKey") || DEFAULT_API_KEY);
  const [tempUnit, setTempUnit] = useState<"C" | "F">(() => 
    (localStorage.getItem("tempUnit") as "C" | "F") || "C"
  );
  const [favorites, setFavorites] = useState<string[]>(() => 
    JSON.parse(localStorage.getItem("favoriteCities") || "[]")
  );
  const [weatherBg, setWeatherBg] = useState<string>(
    "linear-gradient(135deg, hsl(260 80% 35%), hsl(250 70% 45%), hsl(240 60% 55%))"
  );

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem("weatherApiKey", apiKey);
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem("tempUnit", tempUnit);
  }, [tempUnit]);

  useEffect(() => {
    localStorage.setItem("favoriteCities", JSON.stringify(favorites));
  }, [favorites]);

  const handleAddFavorite = (city: string) => {
    if (!favorites.includes(city)) {
      setFavorites([...favorites, city]);
      toast.success(`${city} added to favorites`);
    }
  };

  const handleRemoveFavorite = (city: string) => {
    setFavorites(favorites.filter(f => f !== city));
    toast.success(`${city} removed from favorites`);
  };

  const handleSelectFavorite = (city: string) => {
    setSearchQuery(city);
    fetchWeather(city);
  };

  const fetchWeather = async (city: string) => {
    if (!apiKey) {
      toast.error("Please set your API key in settings");
      return;
    }

    setLoading(true);
    try {
      // Fetch current weather
      const currentRes = await fetch(
        `${API_BASE}/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      
      if (!currentRes.ok) {
        if (currentRes.status === 429) {
          throw new Error("API rate limit exceeded. Please use your own API key in settings.");
        } else if (currentRes.status === 401) {
          throw new Error("Invalid API key. Please check your settings.");
        }
        throw new Error("City not found");
      }
      
      const currentData = await currentRes.json();

      // Fetch forecast
      const forecastRes = await fetch(
        `${API_BASE}/forecast?q=${city}&appid=${apiKey}&units=metric`
      );
      const forecastData = await forecastRes.json();

      // Update background based on weather
      const isDay = new Date().getHours() >= 6 && new Date().getHours() < 18;
      setWeatherBg(getWeatherBackground(currentData.weather[0].main, isDay));

      // Process current weather
      const sunrise = new Date(currentData.sys.sunrise * 1000).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      const sunset = new Date(currentData.sys.sunset * 1000).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

      setWeatherData({
        temp: currentData.main.temp,
        condition: currentData.weather[0].main,
        city: currentData.name,
        country: currentData.sys.country,
        feelsLike: currentData.main.feels_like,
        humidity: currentData.main.humidity,
        windSpeed: currentData.wind.speed,
        visibility: currentData.visibility,
        pressure: currentData.main.pressure,
        uvIndex: 3, // UV index requires separate API call
        sunrise,
        sunset,
      });

      // Process hourly forecast (next 24 hours, every 3 hours)
      const hourly = forecastData.list.slice(0, 8).map((item: any) => ({
        time: new Date(item.dt * 1000).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        temp: item.main.temp,
        condition: item.weather[0].main,
      }));
      setHourlyData(hourly);

      // Process daily forecast (7 days)
      const dailyMap = new Map();
      forecastData.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000).toLocaleDateString("en-US", {
          weekday: "short",
        });
        if (!dailyMap.has(date)) {
          dailyMap.set(date, {
            day: date,
            tempMax: item.main.temp_max,
            tempMin: item.main.temp_min,
            condition: item.weather[0].main,
          });
        } else {
          const existing = dailyMap.get(date);
          existing.tempMax = Math.max(existing.tempMax, item.main.temp_max);
          existing.tempMin = Math.min(existing.tempMin, item.main.temp_min);
        }
      });
      setDailyData(Array.from(dailyMap.values()).slice(0, 7));

      setShowWelcome(false);
      toast.success(`Weather data loaded for ${currentData.name}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch weather data. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      fetchWeather(searchQuery);
    }
  };

  const handleGetCurrentLocation = () => {
    if ("geolocation" in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await fetch(
              `${API_BASE}/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
            );
            
            if (!res.ok) {
              if (res.status === 429) {
                throw new Error("API rate limit exceeded. Please use your own API key.");
              }
              throw new Error("Failed to fetch weather");
            }
            
            const data = await res.json();
            fetchWeather(data.name);
          } catch (error: any) {
            toast.error(error.message || "Failed to get location");
            setLoading(false);
          }
        },
        () => {
          toast.error("Location permission denied");
          setLoading(false);
        }
      );
    } else {
      toast.error("Geolocation not supported");
    }
  };

  return (
    <div 
      className="min-h-screen overflow-hidden transition-all duration-1000"
      style={{ background: weatherBg }}
    >
      {/* API Key Warning */}
      {apiKey === DEFAULT_API_KEY && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4">
          <Alert className="bg-destructive/10 border-destructive/50 backdrop-blur-sm">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Using demo API key (limited requests). Get your free key at{" "}
              <a 
                href="https://openweathermap.org/api" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline font-semibold"
              >
                OpenWeatherMap
              </a>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Welcome Screen */}
      {showWelcome && !weatherData && (
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
          {/* Settings Icon */}
          <div className="absolute top-6 right-6">
            <Settings
              apiKey={apiKey}
              onApiKeyChange={setApiKey}
              tempUnit={tempUnit}
              onTempUnitChange={setTempUnit}
            />
          </div>
          
          <div className="max-w-md w-full text-center space-y-8">
            <img
              src={weatherHero}
              alt="Weather illustration"
              className="w-64 h-64 mx-auto object-contain drop-shadow-2xl"
            />
            <div>
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Weather
              </h1>
              <h2 className="text-4xl font-bold text-primary mb-2">ForeCasts</h2>
              <p className="text-lg text-muted-foreground mt-4">
                Get accurate weather forecasts for any city
              </p>
            </div>

            <div className="space-y-4">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={handleSearch}
              />
              <Button
                onClick={handleGetCurrentLocation}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 rounded-2xl shadow-lg"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <MapPin className="w-5 h-5 mr-2" />
                    Use My Location
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Weather Dashboard */}
      {weatherData && (
        <div className="min-h-screen p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header with Search and Settings */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="w-full md:w-auto">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onSearch={handleSearch}
                />
              </div>
              <div className="flex items-center gap-2">
                <Settings
                  apiKey={apiKey}
                  onApiKeyChange={setApiKey}
                  tempUnit={tempUnit}
                  onTempUnitChange={setTempUnit}
                />
                <Button
                  onClick={handleGetCurrentLocation}
                  variant="secondary"
                  className="bg-glass border border-glass-border backdrop-blur-glass"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <MapPin className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Favorite Cities */}
            <FavoriteCities
              favorites={favorites}
              currentCity={weatherData.city}
              onAddFavorite={handleAddFavorite}
              onRemoveFavorite={handleRemoveFavorite}
              onSelectCity={handleSelectFavorite}
            />

            {/* Current Weather */}
            <CurrentWeather {...weatherData} />

            {/* Hourly Forecast */}
            {hourlyData.length > 0 && <HourlyForecast hourlyData={hourlyData} />}

            {/* Grid Layout for Daily and Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {dailyData.length > 0 && <DailyForecast dailyData={dailyData} />}
              <WeatherDetails {...weatherData} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
