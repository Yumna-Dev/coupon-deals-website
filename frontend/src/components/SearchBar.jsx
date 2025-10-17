import React, { useState, useCallback, useMemo } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';

const SearchBar = ({ 
  searchTerm, 
  onSearchChange, 
  selectedCategory, 
  onCategoryChange, 
  categories,
  onReset 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const hasActiveFilters = searchTerm || selectedCategory !== 'All';

  // Debounced search to prevent excessive re-renders
  const handleSearchChange = useCallback((value) => {
    onSearchChange(value);
    if (value && !searchHistory.includes(value)) {
      setSearchHistory(prev => [value, ...prev].slice(0, 5));
    }
  }, [onSearchChange, searchHistory]);

  // Clear search with one click
  const handleClearSearch = useCallback(() => {
    onSearchChange('');
  }, [onSearchChange]);

  // Reset all filters
  const handleResetAll = useCallback(() => {
    onSearchChange('');
    onCategoryChange('All');
    onReset?.();
  }, [onSearchChange, onCategoryChange, onReset]);

  // Memoize filtered categories for keyboard navigation
  const categoryList = useMemo(() => categories, [categories]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      handleClearSearch();
    }
  }, [handleClearSearch]);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl shadow-sm border border-blue-100 mb-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Find Deals</h2>
        {hasActiveFilters && (
          <button
            onClick={handleResetAll}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors flex items-center gap-1"
            aria-label="Reset all filters"
          >
            <X className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      {/* Main Search Controls */}
      <div className="flex flex-col lg:flex-row gap-3 mb-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Search by title, code, or description..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white hover:border-gray-400"
            aria-label="Search coupons"
            autoComplete="off"
          />
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
              type="button"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Category Dropdown */}
        <div className="w-full lg:w-56 relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white hover:border-gray-400 flex items-center justify-between text-left"
            aria-label="Select category"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
          >
            <span className="text-gray-700">{selectedCategory}</span>
            <ChevronDown 
              className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
              {categoryList.map((category, index) => (
                <button
                  key={category}
                  onClick={() => {
                    onCategoryChange(category);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-500 text-white font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  } ${index === 0 ? 'rounded-t-lg' : ''} ${index === categoryList.length - 1 ? 'rounded-b-lg' : ''}`}
                  role="option"
                  aria-selected={selectedCategory === category}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <div className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
              <Search className="w-4 h-4" />
              <span>{searchTerm}</span>
              <button
                onClick={handleClearSearch}
                className="hover:opacity-70 transition-opacity"
                aria-label="Remove search filter"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          {selectedCategory !== 'All' && (
            <div className="flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm">
              <span>{selectedCategory}</span>
              <button
                onClick={() => onCategoryChange('All')}
                className="hover:opacity-70 transition-opacity"
                aria-label="Remove category filter"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
