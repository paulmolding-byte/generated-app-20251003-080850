import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
export function Header() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };
  return (
    <header className="sticky top-0 z-10 p-4 bg-[#0d0d0d]/80 backdrop-blur-sm">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-vapor-cyan/50" />
        <form onSubmit={handleSearch}>
          <Input
            type="search"
            placeholder="Search for tracks, playlists..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 bg-black/50 border-vapor-cyan/20 focus:ring-vapor-magenta focus:border-vapor-magenta"
          />
        </form>
      </div>
    </header>
  );
}