// src/components/CouponCard.jsx
import React from 'react';

const CouponCard = ({ coupon, onSave, onViewDetails }) => {
  // Fixed expiry notification logic
  const isExpiringSoon = (expiryDate) => {
    try {
      // Handle different date formats
      const expiry = new Date(expiryDate);
      const today = new Date();
      
      // Set both to start of day for accurate day calculation
      const expiryStart = new Date(expiry.getFullYear(), expiry.getMonth(), expiry.getDate());
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      const days = Math.ceil((expiryStart - todayStart) / (1000 * 60 * 60 * 24));
      return days <= 3 && days >= 0; // 0 means expires today
    } catch (error) {
      console.error('Date parsing error:', error);
      return false;
    }
  };

  const isExpired = (expiryDate) => {
    try {
      const expiry = new Date(expiryDate);
      const today = new Date();
      
      // Set both to start of day
      const expiryStart = new Date(expiry.getFullYear(), expiry.getMonth(), expiry.getDate());
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      return expiryStart < todayStart;
    } catch (error) {
      console.error('Date parsing error:', error);
      return false;
    }
  };

  const getDaysUntilExpiry = (expiryDate) => {
    try {
      const expiry = new Date(expiryDate);
      const today = new Date();
      
      const expiryStart = new Date(expiry.getFullYear(), expiry.getMonth(), expiry.getDate());
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      const days = Math.ceil((expiryStart - todayStart) / (1000 * 60 * 60 * 24));
      return Math.max(0, days); // Never return negative days
    } catch (error) {
      console.error('Date parsing error:', error);
      return 999; // Large number meaning not expiring soon
    }
  };

  const daysUntilExpiry = getDaysUntilExpiry(coupon.expiryDate);
  const expiringSoon = isExpiringSoon(coupon.expiryDate);
  const expired = isExpired(coupon.expiryDate);

  // Debug logging (remove in production)
  console.log(`Coupon: ${coupon.title}`, {
    expiryDate: coupon.expiryDate,
    daysUntilExpiry,
    expiringSoon,
    expired
  });

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ${
      expired ? 'opacity-60 grayscale' : ''
    }`}>
      <div className="relative">
        <img 
          src={coupon.image} 
          alt={coupon.title}
          className="w-full h-48 object-cover"
        />
        
        {/* Expiry Badge Overlay */}
        {expired && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            EXPIRED
          </div>
        )}
        
        {expiringSoon && !expired && (
          <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
            ENDS IN {daysUntilExpiry} DAY{daysUntilExpiry !== 1 ? 'S' : ''}
          </div>
        )}
        
        {/* Saved Badge */}
        {coupon.isSaved && !expired && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            SAVED
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{coupon.title}</h3>
          <span className={`text-xs font-medium px-2 py-1 rounded ${
            expired 
              ? 'bg-gray-100 text-gray-500' 
              : 'bg-green-100 text-green-800'
          }`}>
            {coupon.discount}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3">{coupon.description}</p>
        
        <div className="flex justify-between items-center mb-3">
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
            {coupon.category}
          </span>
          <span className={`text-xs ${
            expired ? 'text-red-500' : expiringSoon ? 'text-orange-500' : 'text-gray-500'
          }`}>
            Expires: {coupon.expiryDate}
            {expiringSoon && !expired && ` (${daysUntilExpiry} days)`}
          </span>
        </div>

        {/* Additional Expiry Warning */}
        {expiringSoon && !expired && (
          <div className="mb-3 bg-orange-50 border border-orange-200 rounded p-2">
            <p className="text-orange-700 text-xs font-medium">
              ⚡ Expiring soon! Use this coupon in the next {daysUntilExpiry} day{daysUntilExpiry !== 1 ? 's' : ''}.
            </p>
          </div>
        )}

        <div className="flex justify-between items-center">
          <button
            onClick={() => onViewDetails(coupon)}
            className={`text-sm font-medium ${
              expired 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-blue-600 hover:text-blue-800'
            }`}
            disabled={expired}
          >
            {expired ? 'Expired' : 'View Details'}
          </button>
          <button
            onClick={() => onSave(coupon.id)}
            disabled={expired}
            className={`px-3 py-1 rounded text-sm font-medium ${
              expired
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : coupon.isSaved 
                  ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {expired ? 'Expired' : coupon.isSaved ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CouponCard;