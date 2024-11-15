import React from 'react';
import { FaSearch } from 'react-icons/fa';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  setSearchTerm,
}) => (
  <div className="flex items-center w-full">
    <input
      type="text"
      placeholder="Search events"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none "
      aria-label="Search events"
    />
  </div>
);
