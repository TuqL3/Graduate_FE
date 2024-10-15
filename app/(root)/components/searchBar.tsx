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
    {/* <button className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
      <FaSearch />
    </button> */}
  </div>
);
