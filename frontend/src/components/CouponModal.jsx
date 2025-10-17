// src/components/CouponModal.jsx
import React from 'react';

const CouponModal = ({ coupon, isOpen, onClose, onSave }) => {
  if (!isOpen || !coupon) return null;

  const isExpiringSoon = (expiryDate) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const days = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return days <= 3 && days > 0;
  };

  const isExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date();
  };

  const getDaysUntilExpiry = (expiryDate) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
  };

  const daysUntilExpiry = getDaysUntilExpiry(coupon.expiryDate);
  const expired = isExpired(coupon.expiryDate);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <img 
            src={coupon.image} 
            alt={coupon.title}
            className="w-full h-64 object-cover"
          />
          
          {/* Expiry Badges */}
          {expired && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded">
              EXPIRED
            </div>
          )}
          
          {isExpiringSoon(coupon.expiryDate) && !expired && (
            <div className="absolute top-2 left-2 bg-orange-500 text-white text-sm font-bold px-3 py-1 rounded">
              ENDS IN {daysUntilExpiry} DAY{daysUntilExpiry !== 1 ? 'S' : ''}
            </div>
          )}
          
          <button
            onClick={onClose}
            className="absolute top-2 right-2 bg-white rounded-full p-2 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>
        
        <div className="p-6">
          {/* Urgent Expiry Alert */}
          {isExpiringSoon(coupon.expiryDate) && !expired && (
            <div className="mb-4 bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <span className="text-orange-500">⚡</span>
                <p className="text-orange-700 text-sm font-medium">
                  Hurry! This deal expires in {daysUntilExpiry} day{daysUntilExpiry !== 1 ? 's' : ''}.
                </p>
              </div>
            </div>
          )}

          {expired && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <span className="text-red-500">❌</span>
                <p className="text-red-700 text-sm font-medium">
                  This coupon has expired and is no longer valid.
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-800">{coupon.title}</h2>
            <span className={`text-sm font-medium px-3 py-1 rounded ${
              expired 
                ? 'bg-gray-100 text-gray-500' 
                : 'bg-green-100 text-green-800'
            }`}>
              {coupon.discount}
            </span>
          </div>
          
          <p className="text-gray-600 mb-4">{coupon.description}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <span className="text-sm text-gray-500">Store</span>
              <p className="font-medium">{coupon.store}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Category</span>
              <p className="font-medium">{coupon.category}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Expiry Date</span>
              <p className={`font-medium ${expired ? 'text-red-500' : ''}`}>
                {coupon.expiryDate}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Code</span>
              <p className={`font-medium px-2 py-1 rounded ${
                expired ? 'bg-gray-200 text-gray-500' : 'bg-yellow-100'
              }`}>
                {coupon.code}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => {
                if (!expired) {
                  navigator.clipboard.writeText(coupon.code);
                  alert('Coupon code copied to clipboard!');
                }
              }}
              className={`flex-1 py-2 px-4 rounded font-medium transition-colors ${
                expired
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              disabled={expired}
            >
              {expired ? 'Expired' : 'Copy Code'}
            </button>
            <button
              onClick={() => onSave(coupon.id)}
              disabled={expired}
              className={`px-4 py-2 rounded font-medium ${
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
    </div>
  );
};

export default CouponModal;