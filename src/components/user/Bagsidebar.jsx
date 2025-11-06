import React from "react";
import { getTotalItems, getTotalPrice } from "../../utils/helpers";
import { Link, useNavigate, useLocation } from "react-router-dom";

const CartSidebar = ({
  cart,
  updateQuantity,
  clearCart,
  isVisible,
  onClose,
  onCheckoutFromCart, // Callback untuk handle checkout dari cart
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isCheckoutPage = location.pathname === "/checkout";

  const handleBackdropClick = () => onClose();

  const handleCheckoutClick = () => {
    if (isCheckoutPage) {
      // Jika sudah di halaman checkout, trigger callback untuk menambahkan cart items
      if (onCheckoutFromCart) {
        onCheckoutFromCart();
      }
      onClose();
    } else {
      // Jika belum di halaman checkout, simpan cart ke localStorage dan navigate
      console.log("Saving cart to localStorage:", cart);
      localStorage.setItem("checkoutFromCart", JSON.stringify(cart));
      
      // Trigger custom event
      window.dispatchEvent(new CustomEvent("checkoutItemAdded"));
      
      navigate("/checkout");
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity duration-300 ${
        isVisible
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
      onClick={handleBackdropClick}
    >
      <div
        className={`absolute right-0 top-0 h-full w-full md:w-96 bg-white text-black transform transition-transform duration-300 ease-in-out ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-2xl font-black">BAG ({getTotalItems(cart)})</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
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
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🛒</div>
                <p className="text-gray-600">Your bag is empty</p>
                <p className="text-gray-500 text-sm">
                  Add some kicks to get started
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-black text-sm">{item.name}</h4>
                      {item.selectedSize && (
                        <p className="text-gray-500 text-xs mb-1">
                          Size: {item.selectedSize}
                        </p>
                      )}
                      <p className="text-gray-600 text-sm">${item.price}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity - 1,
                              item.selectedSize
                            )
                          }
                          className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 text-sm"
                        >
                          -
                        </button>
                        <span className="font-black text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity + 1,
                              item.selectedSize
                            )
                          }
                          className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 text-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="font-black text-sm self-start">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-6 border-t border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <span className="font-black text-lg">TOTAL</span>
                <span className="font-black text-2xl">
                  ${getTotalPrice(cart)}
                </span>
              </div>
              <button
                onClick={handleCheckoutClick}
                className="cursor-pointer w-full bg-black text-white py-4 rounded-lg font-bold hover:bg-gray-800 transition-colors text-center"
              >
                {isCheckoutPage ? "Add to Order Summary" : "Checkout"}
              </button>
              <button
                onClick={onClose}
                className="w-full mt-4 text-gray-600 font-medium hover:text-gray-800 transition-colors"
              >
                CONTINUE SHOPPING
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;
