import { Cloud, CloudRain, Sun, Wind, Snowflake, CloudDrizzle } from "lucide-react";

interface CurrentWeatherProps {
  temp: number;
  condition: string;
  city: string;
  country: string;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
}

const getWeatherIcon = (condition: string) => {
  const lower = condition.toLowerCase();
  if (lower.includes("rain")) return CloudRain;
  if (lower.includes("drizzle")) return CloudDrizzle;
  if (lower.includes("snow")) return Snowflake;
  if (lower.includes("cloud")) return Cloud;
  if (lower.includes("clear")) return Sun;
  return Cloud;
};

const CurrentWeather = ({ temp, condition, city, country, feelsLike, humidity, windSpeed }: CurrentWeatherProps) => {
  const Icon = getWeatherIcon(condition);

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-glass border border-glass-border rounded-3xl backdrop-blur-glass shadow-glass" />
      <div className="relative p-8 text-center">
        <div className="flex items-center justify-center mb-6">
          <Icon className="w-24 h-24 text-primary drop-shadow-glow" strokeWidth={1.5} />
        </div>
        
        <h1 className="text-7xl font-bold mb-2 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
          {Math.round(temp)}°
        </h1>
        
        <p className="text-xl text-muted-foreground mb-1">{condition}</p>
        <p className="text-lg font-medium text-foreground mb-6">
          {city}, {country}
        </p>

        <div className="flex items-center justify-center gap-8 pt-6 border-t border-glass-border">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Feels like</p>
            <p className="text-xl font-semibold text-foreground">{Math.round(feelsLike)}°</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Humidity</p>
            <p className="text-xl font-semibold text-foreground">{humidity}%</p>
          </div>
          <div className="text-center flex items-center gap-1">
            <div>
              <p className="text-sm text-muted-foreground">Wind</p>
              <p className="text-xl font-semibold text-foreground">{windSpeed} m/s</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
