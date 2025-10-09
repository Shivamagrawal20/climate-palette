import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
}

const SearchBar = ({ value, onChange, onSearch }: SearchBarProps) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="relative w-full max-w-md group">
      <div className="absolute inset-0 bg-glass border border-glass-border rounded-2xl backdrop-blur-glass group-hover:shadow-lg transition-shadow" />
      <div className="relative flex items-center gap-3 px-4 py-3">
        <Search className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        <Input
          type="text"
          placeholder="Search city..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          className="border-0 bg-transparent text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 font-medium"
        />
      </div>
    </div>
  );
};

export default SearchBar;
