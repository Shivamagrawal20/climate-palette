import { Cloud, CloudRain, Sun, Snowflake, CloudDrizzle } from "lucide-react";

interface DailyData {
  day: string;
  tempMax: number;
  tempMin: number;
  condition: string;
}

interface DailyForecastProps {
  dailyData: DailyData[];
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

const DailyForecast = ({ dailyData }: DailyForecastProps) => {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-glass border border-glass-border rounded-3xl backdrop-blur-glass shadow-glass" />
      <div className="relative p-6">
        <h2 className="text-lg font-semibold mb-4 text-foreground">7-Day Forecast</h2>
        <div className="space-y-3">
          {dailyData.map((day, index) => {
            const Icon = getWeatherIcon(day.condition);
            return (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-xl bg-secondary/20 border border-glass-border hover:bg-secondary/40 transition-all"
              >
                <p className="text-sm font-medium text-foreground w-20">{day.day}</p>
                <div className="flex items-center gap-3 flex-1 justify-center">
                  <Icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
                  <p className="text-sm text-muted-foreground capitalize">{day.condition}</p>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="font-semibold text-foreground">{Math.round(day.tempMax)}°</span>
                  <span className="text-muted-foreground">{Math.round(day.tempMin)}°</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DailyForecast;
