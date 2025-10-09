import { Cloud, CloudRain, Sun, Snowflake, CloudDrizzle } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface HourlyData {
  time: string;
  temp: number;
  condition: string;
}

interface HourlyForecastProps {
  hourlyData: HourlyData[];
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

const HourlyForecast = ({ hourlyData }: HourlyForecastProps) => {
  return (
    <div className="relative animate-fade-in">
      <div className="absolute inset-0 bg-glass border border-glass-border rounded-3xl backdrop-blur-glass shadow-glass hover:shadow-2xl transition-shadow" />
      <div className="relative p-6">
        <h2 className="text-lg font-semibold mb-4 text-foreground">Hourly Forecast</h2>
        <ScrollArea className="w-full">
          <div className="flex gap-4 pb-4">
            {hourlyData.map((hour, index) => {
              const Icon = getWeatherIcon(hour.condition);
              return (
                <div
                  key={index}
                  className="flex-shrink-0 w-20 text-center p-3 rounded-2xl bg-secondary/30 border border-glass-border hover:bg-secondary/50 hover:scale-110 transition-all cursor-pointer group"
                >
                  <p className="text-sm text-muted-foreground mb-2 font-medium">{hour.time}</p>
                  <Icon className="w-8 h-8 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                  <p className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{Math.round(hour.temp)}°</p>
                </div>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
};

export default HourlyForecast;
