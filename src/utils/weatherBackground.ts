// Dynamic background gradients based on weather condition
export const getWeatherBackground = (condition: string, isDay: boolean = true): string => {
  const lower = condition.toLowerCase();
  
  if (lower.includes("clear")) {
    return isDay 
      ? "linear-gradient(135deg, hsl(200 80% 50%), hsl(220 70% 60%), hsl(240 60% 70%))"
      : "linear-gradient(135deg, hsl(240 60% 15%), hsl(250 70% 25%), hsl(260 80% 35%))";
  }
  
  if (lower.includes("rain") || lower.includes("drizzle")) {
    return "linear-gradient(135deg, hsl(220 40% 30%), hsl(230 50% 40%), hsl(240 60% 50%))";
  }
  
  if (lower.includes("thunder") || lower.includes("storm")) {
    return "linear-gradient(135deg, hsl(240 30% 15%), hsl(250 40% 25%), hsl(260 50% 35%))";
  }
  
  if (lower.includes("snow")) {
    return "linear-gradient(135deg, hsl(200 30% 70%), hsl(210 40% 80%), hsl(220 50% 90%))";
  }
  
  if (lower.includes("cloud") || lower.includes("overcast")) {
    return "linear-gradient(135deg, hsl(210 30% 40%), hsl(220 40% 50%), hsl(230 50% 60%))";
  }
  
  if (lower.includes("mist") || lower.includes("fog") || lower.includes("haze")) {
    return "linear-gradient(135deg, hsl(200 20% 60%), hsl(210 30% 70%), hsl(220 40% 80%))";
  }
  
  // Default gradient
  return "linear-gradient(135deg, hsl(260 80% 35%), hsl(250 70% 45%), hsl(240 60% 55%))";
};

// Convert Celsius to Fahrenheit
export const celsiusToFahrenheit = (celsius: number): number => {
  return (celsius * 9/5) + 32;
};

// Format temperature based on unit
export const formatTemp = (temp: number, unit: "C" | "F"): string => {
  const value = unit === "F" ? celsiusToFahrenheit(temp) : temp;
  return `${Math.round(value)}°${unit}`;
};
