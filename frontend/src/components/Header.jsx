// src/components/Header.jsx
import React from 'react';

const Header = ({ savedCount, onShowSaved, showSaved }) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">CouponDeals</h1>
            <p className="text-gray-600 text-sm">Find the best deals and save big!</p>
          </div>
          <button
            onClick={onShowSaved}
            className={`relative px-4 py-2 rounded-lg transition-colors ${
              showSaved 
                ? 'bg-blue-700 text-white' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {showSaved ? 'Show All' : 'Saved Coupons'}
            {savedCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;