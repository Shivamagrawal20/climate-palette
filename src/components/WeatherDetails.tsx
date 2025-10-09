import { Droplets, Wind, Eye, Gauge, Sun, Sunrise } from "lucide-react";

interface WeatherDetailsProps {
  humidity: number;
  windSpeed: number;
  visibility: number;
  pressure: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
}

const WeatherDetails = ({
  humidity,
  windSpeed,
  visibility,
  pressure,
  uvIndex,
  sunrise,
  sunset,
}: WeatherDetailsProps) => {
  const details = [
    { icon: Droplets, label: "Humidity", value: `${humidity}%` },
    { icon: Wind, label: "Wind Speed", value: `${windSpeed} m/s` },
    { icon: Eye, label: "Visibility", value: `${(visibility / 1000).toFixed(1)} km` },
    { icon: Gauge, label: "Pressure", value: `${pressure} hPa` },
    { icon: Sun, label: "UV Index", value: uvIndex.toString() },
    { icon: Sunrise, label: "Sunrise/Sunset", value: `${sunrise} / ${sunset}` },
  ];

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-glass border border-glass-border rounded-3xl backdrop-blur-glass shadow-glass" />
      <div className="relative p-6">
        <h2 className="text-lg font-semibold mb-4 text-foreground">Weather Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {details.map((detail, index) => {
            const Icon = detail.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-xl bg-secondary/20 border border-glass-border"
              >
                <div className="p-3 rounded-xl bg-primary/10">
                  <Icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{detail.label}</p>
                  <p className="text-sm font-semibold text-foreground">{detail.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeatherDetails;
