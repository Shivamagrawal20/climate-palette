import { Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface FavoriteCitiesProps {
  favorites: string[];
  currentCity: string;
  onAddFavorite: (city: string) => void;
  onRemoveFavorite: (city: string) => void;
  onSelectCity: (city: string) => void;
}

const FavoriteCities = ({
  favorites,
  currentCity,
  onAddFavorite,
  onRemoveFavorite,
  onSelectCity,
}: FavoriteCitiesProps) => {
  const isFavorite = favorites.includes(currentCity);

  return (
    <div className="space-y-4">
      {/* Add/Remove Current City */}
      {currentCity && (
        <Button
          onClick={() => (isFavorite ? onRemoveFavorite(currentCity) : onAddFavorite(currentCity))}
          variant="secondary"
          size="sm"
          className="bg-glass border border-glass-border backdrop-blur-glass"
        >
          <Star className={`w-4 h-4 mr-2 ${isFavorite ? "fill-primary text-primary" : ""}`} />
          {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        </Button>
      )}

      {/* Favorite Cities List */}
      {favorites.length > 0 && (
        <div className="relative">
          <div className="absolute inset-0 bg-glass border border-glass-border rounded-2xl backdrop-blur-glass" />
          <div className="relative p-4">
            <h3 className="text-sm font-semibold mb-3 text-foreground">Favorite Cities</h3>
            <div className="flex flex-wrap gap-2">
              {favorites.map((city) => (
                <Badge
                  key={city}
                  variant="secondary"
                  className="bg-secondary/50 hover:bg-secondary/70 cursor-pointer group pr-1"
                  onClick={() => onSelectCity(city)}
                >
                  <Star className="w-3 h-3 mr-1 fill-primary text-primary" />
                  {city}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFavorite(city);
                    }}
                    className="ml-2 p-1 hover:bg-destructive/20 rounded-sm transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoriteCities;
