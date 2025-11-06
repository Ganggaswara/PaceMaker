import React from 'react';

const ProductSkeleton = () => (
  <div className="animate-pulse">
    <div className="rounded-lg bg-gray-800 h-80 mb-4"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-800 rounded w-3/4"></div>
      <div className="h-4 bg-gray-800 rounded w-full"></div>
      <div className="h-4 bg-gray-800 rounded w-1/2"></div>
    </div>
  </div>
);

export default ProductSkeleton;