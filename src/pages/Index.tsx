import { useState, useEffect } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";
import SearchBar from "@/components/SearchBar";
import CurrentWeather from "@/components/CurrentWeather";
import HourlyForecast from "@/components/HourlyForecast";
import DailyForecast from "@/components/DailyForecast";
import WeatherDetails from "@/components/WeatherDetails";
import { Button } from "@/components/ui/button";
import weatherHero from "@/assets/weather-hero.png";

// OpenWeatherMap API - users can replace with their own key
const API_KEY = "bd5e378503939ddaee76f12ad7a97608"; // Free tier key for demo
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

  const fetchWeather = async (city: string) => {
    setLoading(true);
    try {
      // Fetch current weather
      const currentRes = await fetch(
        `${API_BASE}/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      
      if (!currentRes.ok) throw new Error("City not found");
      
      const currentData = await currentRes.json();

      // Fetch forecast
      const forecastRes = await fetch(
        `${API_BASE}/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      const forecastData = await forecastRes.json();

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
    } catch (error) {
      toast.error("Failed to fetch weather data. Please try again.");
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
              `${API_BASE}/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
            );
            const data = await res.json();
            fetchWeather(data.name);
          } catch (error) {
            toast.error("Failed to get location");
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
    <div className="min-h-screen bg-weather-gradient overflow-hidden">
      {/* Welcome Screen */}
      {showWelcome && !weatherData && (
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
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
            {/* Header with Search */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="w-full md:w-auto">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onSearch={handleSearch}
                />
              </div>
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
