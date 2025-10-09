import { Settings as SettingsIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SettingsProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  tempUnit: "C" | "F";
  onTempUnitChange: (unit: "C" | "F") => void;
}

const Settings = ({ apiKey, onApiKeyChange, tempUnit, onTempUnitChange }: SettingsProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="bg-glass border border-glass-border backdrop-blur-glass"
        >
          <SettingsIcon className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-glass-border">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your weather app preferences
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* API Key */}
          <div className="space-y-2">
            <Label htmlFor="api-key">OpenWeatherMap API Key</Label>
            <Input
              id="api-key"
              type="text"
              placeholder="Enter your API key"
              value={apiKey}
              onChange={(e) => onApiKeyChange(e.target.value)}
              className="bg-background"
            />
            <p className="text-xs text-muted-foreground">
              Get your free API key at{" "}
              <a
                href="https://openweathermap.org/api"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                openweathermap.org/api
              </a>
            </p>
          </div>

          {/* Temperature Unit Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="temp-unit">Temperature Unit</Label>
              <p className="text-sm text-muted-foreground">
                {tempUnit === "C" ? "Celsius (°C)" : "Fahrenheit (°F)"}
              </p>
            </div>
            <Switch
              id="temp-unit"
              checked={tempUnit === "F"}
              onCheckedChange={(checked) => onTempUnitChange(checked ? "F" : "C")}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Settings;
