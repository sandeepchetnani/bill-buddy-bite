
import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  onClearSearch
}) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-muted-foreground" />
      </div>
      <Input
        type="text"
        placeholder="Search menu items..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 w-full"
      />
      {searchQuery && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute inset-y-0 right-0 px-3 hover:bg-transparent"
          onClick={onClearSearch}
        >
          Clear
        </Button>
      )}
    </div>
  );
};

export default SearchBar;
