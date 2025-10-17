// src/components/LoadingStates.jsx
import React from 'react';
import { Loader2 } from 'lucide-react';

// Full page loading spinner
export const PageLoader = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
      <p className="text-gray-600">Loading amazing deals...</p>
    </div>
  </div>
);

// Skeleton card for coupon loading
export const CouponSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
    <div className="w-full h-48 bg-gray-300" />
    <div className="p-4">
      <div className="flex justify-between items-start mb-2">
        <div className="h-6 bg-gray-300 rounded w-2/3" />
        <div className="h-6 bg-gray-300 rounded w-16" />
      </div>
      <div className="h-4 bg-gray-300 rounded w-full mb-2" />
      <div className="h-4 bg-gray-300 rounded w-4/5 mb-3" />
      <div className="flex justify-between items-center mb-3">
        <div className="h-6 bg-gray-300 rounded w-20" />
        <div className="h-4 bg-gray-300 rounded w-24" />
      </div>
      <div className="flex justify-between items-center">
        <div className="h-8 bg-gray-300 rounded w-24" />
        <div className="h-8 bg-gray-300 rounded w-16" />
      </div>
    </div>
  </div>
);

// Grid of skeleton cards
export const CouponGridSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <CouponSkeleton key={index} />
    ))}
  </div>
);

// Inline loading button
export const LoadingButton = ({ children, loading, ...props }) => (
  <button disabled={loading} {...props}>
    {loading ? (
      <span className="flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading...
      </span>
    ) : (
      children
    )}
  </button>
);

// Overlay loader for modals
export const OverlayLoader = () => (
  <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
  </div>
);