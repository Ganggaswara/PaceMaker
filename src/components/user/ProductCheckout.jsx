import React from "react";
import { Link, useNavigate } from "react-router-dom";

const ProductCheckout = ({
  isCheckoutVisible,
  setIsCheckoutVisible,
  selectedProduct,
  addToCart,
}) => {
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = React.useState(null);

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleCheckout = () => {
    if (selectedSize) {
      const checkoutItem = {
        ...selectedProduct,
        selectedSize,
        quantity: 1,
        isDirectCheckout: true,
      };

      console.log("Saving to localStorage:", checkoutItem);
      // Simpan produk ke localStorage
      localStorage.setItem("directCheckoutItem", JSON.stringify(checkoutItem));
      
      // Trigger custom event untuk notify Checkout component
      window.dispatchEvent(new CustomEvent("checkoutItemAdded"));
      
      console.log("Navigating to /checkout");
      // Arahkan ke halaman checkout
      navigate("/checkout");
      setIsCheckoutVisible(false);
    } else {
      alert("Please select a size first");
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 backdrop-blur-sm bg-black/30 transition-all duration-400 ${
        isCheckoutVisible
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
      onClick={() => setIsCheckoutVisible(false)}
    >
      <div
        className={`absolute right-0 top-0 h-full w-full md:w-[600px] bg-white text-black transform transition-all duration-600 ease-out overflow-y-auto shadow-2xl ${
          isCheckoutVisible
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {selectedProduct && (
          <div className="h-full flex flex-col">
            {/* Close Button */}
            <button
              onClick={() => setIsCheckoutVisible(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-black transition-colors z-10 p-2 rounded-full hover:bg-gray-500"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Product Image */}
            <div className="relative h-[400px] bg-gray-100 flex items-center justify-center">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="max-w-full max-h-100 object-contain p-6 transform transition-transform duration-400 hover:scale-110"
              />
              {selectedProduct.isNew && (
                <div className="absolute top-4 left-4 bg-linear-to-b from-[#FF8A65] via-[#81C784] to-[#4FC3F7] text-white px-3 py-1 text-xs font-bold uppercase rounded-full">
                  New Arrival
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="flex-1 p-8 space-y-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  {selectedProduct.name}
                </h2>
                <p className="text-gray-600 text-sm">
                  {selectedProduct.description}
                </p>

                <div className="flex items-center mt-4">
                  <span className="text-2xl font-bold text-gray-900 mr-4">
                    ${selectedProduct.price}
                  </span>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(selectedProduct.rating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      ({selectedProduct.rating})
                    </span>
                  </div>
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Select Size
                </h3>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    "36",
                    "37",
                    "38",
                    "39",
                    "40",
                    "41",
                    "42",
                    "43",
                    "44",
                    "45",
                  ].map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSizeSelect(size)}
                      className={`cursor-pointer py-2 border rounded-md transition-colors text-sm font-xl ${
                        selectedSize === size
                          ? "bg-gray-400 text-white border border-black"
                          : "hover:bg-gray-200 border border-gray-300"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={() => {
                    if (selectedSize) {
                      addToCart({ ...selectedProduct, selectedSize });
                      setIsCheckoutVisible(false);
                      setSelectedSize(null); // Reset size selection
                    } else {
                      alert("Please select a size first");
                    }
                  }}
                  className="cursor-pointer w-full bg-black text-white py-4 rounded-lg font-bold hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={!selectedSize}
                >
                  Add to Bag
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={!selectedSize}
                  className="cursor-pointer w-full bg-blue-600 text-white py-4 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Checkout
                </button>
              </div>

              {/* Product Features */}
              <div className="border-t pt-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Product Features
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Lightweight and comfortable</li>
                  <li>• Breathable mesh upper</li>
                  <li>• Responsive cushioning</li>
                  <li>• Durable rubber outsole</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCheckout;
