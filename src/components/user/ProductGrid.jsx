import React, { useState, useEffect, useCallback, useMemo } from "react";
import ProductSkeleton from "./ProductSkeleton";
import HighlightText from "./HighlightText";

const ProductGrid = ({
  isLoading,
  filteredShoes,
  setSelectedProduct,
  setIsCheckoutVisible,
  searchTerm,
  isSearchSubmitted,
}) => {
  // Show 8 items at a time
  const [visibleCount, setVisibleCount] = useState(8);

  // Reset visible items when the result set changes or when search changes
  useEffect(() => {
    setVisibleCount(8);
  }, [filteredShoes.length, searchTerm, isSearchSubmitted]);

  const visibleShoes = useMemo(() => {
    return filteredShoes.slice(0, visibleCount);
  }, [filteredShoes, visibleCount]);

  const nextShoes = useMemo(() => {
    return filteredShoes.slice(
      visibleCount,
      Math.min(visibleCount + 8, filteredShoes.length)
    );
  }, [filteredShoes, visibleCount]);

  const handleShowMore = useCallback(() => {
    const newCount = Math.min(visibleCount + 8, filteredShoes.length);
    setVisibleCount(newCount);
  }, [visibleCount, filteredShoes.length]);
  return (
    <>
      {/* Local keyframes for smooth item reveal */}
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      <section id="products-section" className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {isLoading
              ? // Show skeleton loading
                Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={index}
                      className="group cursor-pointer transform transition-all duration-50"
                    >
                      <ProductSkeleton />
                    </div>
                  ))
              : // Show actual products
                visibleShoes.map((shoe, idx) => (
                  <div
                    key={shoe.id}
                    className="group cursor-pointer ml-[10px] mr-[10px]"
                    style={{
                      animation:
                        idx >= Math.max(0, visibleCount - 8)
                          ? "fadeInUp 400ms ease-out both"
                          : undefined,
                    }}
                    onClick={() => {
                      setSelectedProduct(shoe);
                      setIsCheckoutVisible(true);
                    }}
                  >
                    <div className="relative overflow-hidden rounded-lg bg-gray-900 shadow-lg hover:shadow-2xl transition-all duration-600">
                      <div className="overflow-hidden">
                        <img
                          src={shoe.image || "/images/placeholder.jpg"}
                          alt={shoe.name}
                          onError={(e) => {
                            e.currentTarget.src = "/images/placeholder.jpg";
                          }}
                          className="w-full h-80 object-cover transform transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:filter group-hover:brightness-110"
                        />
                      </div>
                      {Boolean(shoe.isNew) && (
                        <div className="absolute top-4 left-4 bg-linear-to-b from-[#FF8A65] via-[#81C784] to-[#4FC3F7] text-white px-3 py-1 font-bold text-xs uppercase tracking-wider rounded-full shadow-lg transform transition-transform duration-500 group-hover:scale-110">
                          NEW
                        </div>
                      )}
                    </div>
                    <div className="mt-4 space-y-2">
                      <h3 className="font-black text-lg">
                        {isSearchSubmitted ? (
                          <HighlightText
                            text={shoe.name}
                            searchTerm={searchTerm}
                          />
                        ) : (
                          shoe.name
                        )}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {shoe.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-black text-xl">
                          ${shoe.price}
                        </span>
                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 text-yellow-400 fill-current"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                          <span className="ml-1 text-sm text-gray-400">
                            {shoe.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
          {/* Interactive Show More with blurred preview of next items */}
          {!isLoading &&
            visibleCount < filteredShoes.length &&
            nextShoes.length > 0 && (
              <div className="relative mt-12">
                {/* Preview strip: show top-half of next batch with blur */}
                <div className="pointer-events-none overflow-hidden h-44 rounded-2xl relative">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 filter blur-[2px] opacity-70">
                    {nextShoes.map((shoe) => (
                      <div key={shoe.id} className="rounded-lg bg-gray-900/60">
                        <div className="overflow-hidden rounded-lg">
                          <img
                            src={shoe.image || "/images/placeholder.jpg"}
                            alt={shoe.name}
                            onError={(e) => {
                              e.currentTarget.src = "/images/placeholder.jpg";
                            }}
                            className="w-full h-56 object-cover"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Gradient mask to make it fade into the grid */}
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent"></div>
                  {/* Subtle backdrop blur on top */}
                  <div className="pointer-events-none absolute inset-0 backdrop-blur-sm rounded-2xl"></div>
                </div>

                {/* Floating Show More button */}
                <div className="absolute left-1/2 -translate-x-1/2 -top-6">
                  <button
                    onClick={handleShowMore}
                    className="px-4 py-4 border border-white/80 text-white font-black tracking-wider bg-black/40 hover:bg-white hover:text-black transition-colors backdrop-blur-md rounded-full"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}

          {!isLoading && filteredShoes.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🥲</div>
              <h3 className="text-2xl font-black mb-2">NO SHOES FOUND</h3>
              <p className="text-gray-400">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default ProductGrid;
