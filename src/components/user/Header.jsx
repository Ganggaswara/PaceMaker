import React, { useState, useContext } from "react";
import { getTotalItems } from "../../utils/helpers";
import { UserContext } from "../../layouts/UserLayout";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

const Header = ({
  isHeaderSolid,
  searchTerm,
  setSearchTerm,
  cart,
  clearCart,
  onCartToggle,
  setSelectedGender,
  setSelectedCategory,
  submitSearch,
  clearSearch,
  selectedCategory,
  selectedGender,
  isCheckoutPage = false, // Add this line

}) => {
  const { setIsNewProductsMode } = React.useContext(UserContext);
  const [isNewClicked, setIsNewClicked] = useState(false);

  const handleNavigation = (gender, category) => {
    setSelectedGender(gender);
    setSelectedCategory(category);
    if (gender === "all" && category === "all") {
      setIsNewClicked(true);
      setIsNewProductsMode(true); // Set new products mode
    } else {
      setIsNewClicked(false);
      setIsNewProductsMode(false); // Disable new products mode
    }
    document
      .getElementById("products-section")
      .scrollIntoView({ behavior: "smooth" });
  };

  // Effect to reset NEW state when category changes from external source
  React.useEffect(() => {
    // Reset NEW state if category changes to anything other than 'all'
    // (because 'all' could be from either ALL SHOES or NEW button)
    if (selectedCategory !== "all" || selectedGender !== "all") {
      setIsNewClicked(false);
      setIsNewProductsMode(false);
    }
  }, [selectedCategory, selectedGender, setIsNewProductsMode]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      submitSearch();
      // Reset NEW clicked state when searching
      setIsNewClicked(false);
      setIsNewProductsMode(false);
      // Scroll to products section after Enter is pressed
      setTimeout(() => {
        document
          .getElementById("products-section")
          .scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const handleClearSearch = () => {
    clearSearch();
    // Reset states when clearing search
    setIsNewClicked(false);
    setIsNewProductsMode(false);
  };

  // Function to check if a category is active
  const isCategoryActive = (category, gender = null) => {
    if (category === "all" && gender === "all") {
      // NEW hanya aktif jika user sudah mengklik NEW
      return isNewClicked;
    }
    if (gender && category) {
      return selectedGender === gender && selectedCategory === category;
    }
    return false;
  };

  if (isCheckoutPage) {
    return (
      <header className="fixed top-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-xl mb-[5px] font-black ml-4 sm:ml-8 md:ml-16 lg:ml-[100px] text-white" >
            PaceMaker®
          </Link>

          {/* Cart Button */}
          <button 
            onClick={onCartToggle}
            className="relative p-2 text-white hover:text-blue-400 transition-colors cursor-pointer"
          >
            <ShoppingCart className="w-6 h-6" />
            {cart.length > 0 && (
              <span className="absolute -top-0 -right-0 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {cart.reduce((total, item) => total + (item.quantity || 1), 0)}
              </span>
            )}
          </button>
        </div>
      </header>
    );
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-black border-b border-gray-700 transition-all duration-300 w-full ${
        isHeaderSolid
          ? "bg-black border-b border-gray-700"
          : "bg-black/30 backdrop-blur-md border-b border-gray-800/30"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
              <Link to="/">
                <h1 className="text-xl mb-[5px] font-black ml-4 sm:ml-8 md:ml-16 lg:ml-[100px] text-white">
                PaceMaker®
                </h1>
              </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 ml-2 sm:ml-4 md:ml-8 lg:ml-[50px]">
            <div className="relative mt-[5px]">
              <a
                href="#products-section"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation("all", "all");
                }}
                className="font-bold text-medium cursor-pointer text-sm bg-linear-to-r from-[#FF6B6B] via-[#4ECDC4] to-[#45B7D1] text-transparent bg-clip-text hover:opacity-80 transition-colors py-2"
              >
                NEW
              </a>
              {isCategoryActive("all", "all") && (
                <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-linear-to-r from-[#FF6B6B] via-[#4ECDC4] to-[#45B7D1] rounded-full"></div>
              )}
            </div>

            {/* Men Dropdown */}
            <div className="relative group">
              <button className="font-sm cursor-pointer text-sm hover:text-gray-400 transition-colors py-2">
                MEN
              </button>
              {isCategoryActive("running", "men") ||
              isCategoryActive("basketball", "men") ||
              isCategoryActive("training", "men") ||
              isCategoryActive("hiking", "men") ? (
                <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-white rounded-full"></div>
              ) : null}
              <div className="absolute top-full left-0 mt-1 w-48 bg-black border border-gray-800 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top scale-95 group-hover:scale-100 backdrop-blur-lg">
                <div className="py-2 px-4">
                  {["running", "basketball", "training", "hiking"].map(
                    (category) => (
                      <a
                        key={category}
                        href="#products-section"
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavigation("men", category);
                        }}
                        className="block py-2 text-sm text-gray-400 hover:text-white hover:translate-x-2 transition-all duration-300"
                      >
                        {category.toUpperCase()}
                      </a>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Women Dropdown */}
            <div className="relative group">
              <button className="font-sm cursor-pointer text-sm hover:text-gray-400 transition-colors py-2">
                WOMEN
              </button>
              {isCategoryActive("running", "women") ||
              isCategoryActive("basketball", "women") ||
              isCategoryActive("training", "women") ||
              isCategoryActive("hiking", "women") ? (
                <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-white rounded-full"></div>
              ) : null}
              <div className="absolute top-full left-0 mt-1 w-48 bg-black border border-gray-800 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top scale-95 group-hover:scale-100 backdrop-blur-lg">
                <div className="py-2 px-4">
                  {["running", "basketball", "training", "hiking"].map(
                    (category) => (
                      <a
                        key={category}
                        href="#products-section"
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavigation("women", category);
                        }}
                        className="block py-2 text-sm text-gray-400 hover:text-white hover:translate-x-2 transition-all duration-300"
                      >
                        {category.toUpperCase()}
                      </a>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Kids Dropdown */}
            <div className="relative group">
              <button className="font-sm text-sm cursor-pointer hover:text-gray-400 transition-colors py-2">
                KIDS
              </button>
              {isCategoryActive("running", "kids") ||
              isCategoryActive("basketball", "kids") ||
              isCategoryActive("training", "kids") ||
              isCategoryActive("hiking", "kids") ? (
                <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-white rounded-full"></div>
              ) : null}
              <div className="absolute top-full left-0 mt-1 w-48 bg-black border border-gray-800 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top scale-95 group-hover:scale-100 backdrop-blur-lg">
                <div className="py-2 px-4">
                  {["running", "basketball", "training", "hiking"].map(
                    (category) => (
                      <a
                        key={category}
                        href="#products-section"
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavigation("kids", category);
                        }}
                        className="block py-2 text-sm text-gray-400 hover:text-white hover:translate-x-2 transition-all duration-300"
                      >
                        {category.toUpperCase()}
                      </a>
                    )
                  )}
                </div>
              </div>
            </div>
          </nav>
          <div className="flex items-center space-x-6">
            <div className="relative hidden md:flex items-center">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className="border-b border-gray-300 px-4 py-2 focus:outline-none focus:border-white placeholder-gray-300 w-48 mb-[5px]"
              />
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="ml-2 p-1 text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="w-4 h-4"
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
              )}
            </div>
            <button className="relative cursor-pointer">
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            <button 
            onClick={onCartToggle}
            className="relative group mr-4 text-white hover:text-blue-400 transition-colors cursor-pointer"
          >
            <ShoppingCart className="w-6 h-6" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {cart.reduce((total, item) => total + (item.quantity || 1), 0)}
              </span>
            )}
          </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {false && (
        <div
          className={`md:hidden transition-all duration-300 py-4 ${
            isHeaderSolid
              ? "bg-black border-t border-gray-800"
              : "bg-black/30 backdrop-blur-md border-t border-gray-800/30"
          }`}
        >
          <div className="px-4 mb-6">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-gray-900 border-b border-gray-700 px-4 py-3 focus:outline-none focus:border-white placeholder-white"
            />
          </div>
          <nav className="px-4 space-y-4">
            <a
              href="#"
              className="block py-2 font-medium hover:text-gray-300 transition-colors"
            >
              NEW
            </a>
            <a
              href="#"
              className="block py-2 font-medium hover:text-gray-300 transition-colors"
            >
              MEN
            </a>
            <a
              href="#"
              className="block py-2 font-medium hover:text-gray-300 transition-colors"
            >
              WOMEN
            </a>
            <a
              href="#"
              className="block py-2 font-medium hover:text-gray-300 transition-colors"
            >
              KIDS
            </a>
            <a
              href="#"
              className="block py-2 font-medium hover:text-gray-300 transition-colors"
            >
              SALE
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
