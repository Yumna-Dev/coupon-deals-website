// src/App.jsx
import React, { useState, useMemo, useCallback } from 'react';
import { mockCoupons, categories } from './data/mockData';
import CouponCard from './components/CouponCard';
import CouponModal from './components/CouponModal';
import SearchBar from './components/SearchBar';
import Header from './components/Header';

function App() {
  // State Management
  const [coupons, setCoupons] = useState(mockCoupons);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

 // ==================== SMART FILTERING LOGIC ====================
const filteredCoupons = useMemo(() => {
  const searchLower = searchTerm.toLowerCase().trim();
  
  return coupons.filter(coupon => {
    // If showing only saved coupons, check that first
    if (showSaved && !coupon.isSaved) {
      return false;
    }

    // Smart search: Check if search term exactly matches a category
    const exactCategoryMatch = categories.find(
      cat => cat.toLowerCase() === searchLower && cat !== 'All'
    );

    // If search term exactly matches a category, prioritize that
    if (exactCategoryMatch) {
      return coupon.category === exactCategoryMatch;
    }

    // Normal filtering when no exact category match
    const matchesSearch = searchLower === '' || 
      coupon.title.toLowerCase().includes(searchLower) ||
      coupon.description.toLowerCase().includes(searchLower) ||
      coupon.store.toLowerCase().includes(searchLower) ||
      coupon.category.toLowerCase().includes(searchLower);

    const matchesCategory = selectedCategory === 'All' || coupon.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
}, [coupons, searchTerm, selectedCategory, showSaved, categories]);

  // ==================== COMPUTED VALUES ====================
  const savedCount = coupons.filter(coupon => coupon.isSaved).length;

  // ==================== CALLBACKS ====================
  const handleSaveCoupon = useCallback((couponId) => {
    setCoupons(prevCoupons => 
      prevCoupons.map(coupon => 
        coupon.id === couponId 
          ? { ...coupon, isSaved: !coupon.isSaved }
          : coupon
      )
    );
  }, [setCoupons]);

  const handleViewDetails = useCallback((coupon) => {
    setSelectedCoupon(coupon);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedCoupon(null);
  }, []);

  // ==================== RENDER ====================
  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        savedCount={savedCount}
        onShowSaved={() => setShowSaved(!showSaved)}
        showSaved={showSaved}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
        />

        {/* Saved Coupons Header */}
        {showSaved && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Saved Coupons ({savedCount})
            </h2>
          </div>
        )}

        {/* Results Count */}
        {filteredCoupons.length > 0 && (
          <div className="mb-4 text-sm text-gray-600">
            Showing {filteredCoupons.length} of {coupons.length} coupons
          </div>
        )}

        {/* Empty State */}
        {filteredCoupons.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {showSaved ? 'No saved coupons found.' : 'No coupons found matching your criteria.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCoupons.map(coupon => (
              <CouponCard
                key={coupon.id}
                coupon={coupon}
                onSave={handleSaveCoupon}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}

        {/* Modal */}
        <CouponModal
          coupon={selectedCoupon}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveCoupon}
        />
      </main>
    </div>
  );
}

export default App;