"use client";

import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  className?: string;
  onSearch?: (query: string, location: string) => void;
}

export function SearchBar({ className = "", onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query, location);
    }
    // TODO: Implement actual search navigation
    console.log("Searching for:", query, "in", location);
  };

  return (
    <form onSubmit={handleSearch} className={`flex-1 max-w-2xl ${className}`}>
      <div className="relative flex items-center bg-white dark:bg-gray-800 rounded-full border-2 border-brand-blue shadow-sm">
        {/* Search Query Input */}
        <div className="flex items-center flex-1">
          <Search className="w-5 h-5 text-gray-400 ml-4" />
          <Input
            type="text"
            placeholder="What event are you looking for?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-200 bg-transparent border-none outline-none rounded-l-full focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>

        {/* Location Input */}
        <div className="hidden sm:flex items-center border-l border-gray-200 dark:border-gray-700 px-4">
          <MapPin className="w-5 h-5 text-gray-400 mr-2" />
          <Input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="text-gray-700 dark:text-gray-200 bg-transparent border-none outline-none w-24 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>

        {/* Search Button */}
        <Button
          type="submit"
          size="icon"
          className="bg-brand-blue hover:bg-brand-blue/90 text-white rounded-full mr-1 h-10 w-10"
        >
          <Search className="w-5 h-5" />
          <span className="sr-only">Search</span>
        </Button>
      </div>
    </form>
  );
}

// Mobile search bar (icon only, opens modal)
export function MobileSearchButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="md:hidden"
      >
        <Search className="w-5 h-5" />
        <span className="sr-only">Search</span>
      </Button>

      {/* TODO: Implement mobile search modal/sheet */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 md:hidden" onClick={() => setIsOpen(false)}>
          <div className="bg-white dark:bg-gray-900 p-4" onClick={(e) => e.stopPropagation()}>
            <SearchBar />
          </div>
        </div>
      )}
    </>
  );
}
