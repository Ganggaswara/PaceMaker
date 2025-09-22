import React from "react";
import Header from "./components/Header";
import HeroSection from "./components/Hero";
import CategoryFilter from "./components/CategoryFilter";
import ProductGrid from "./components/ProductGrid";
import ProductCheckout from "./components/ProductCheckout";
import TestimonialSection from "./components/TestimonialSection";
import CartSidebar from "./components/Bagsidebar";
import Footer from "./components/Footer";
import { useCart } from "./hooks/useBag";
import { useFilters } from "./hooks/useFilters";
import { useHeroSlides } from "./hooks/useHeroSlides";
import { useHeaderScroll } from "./hooks/useHeaderScroll";
import { useLoading } from "./hooks/useLoading";
import { shoes } from "./utils/data";
import { filterShoes } from "./utils/helpers";

const App = () => {
  // Cart
  const { cart, addToCart, updateQuantity, clearCart } = useCart();

  // Filters/Search
  const {
    selectedCategory,
    setSelectedCategory,
    selectedGender,
    setSelectedGender,
    searchTerm,
    setSearchTerm,
    isSearchSubmitted,
    submitSearch,
    clearSearch,
  } = useFilters();

  // Header scroll state
  const isHeaderSolid = useHeaderScroll();

  // Hero slides
  const { currentSlide, setCurrentSlide } = useHeroSlides();

  // Local UI state
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [isCheckoutVisible, setIsCheckoutVisible] = React.useState(false);
  const [isAllShoesMode, setIsAllShoesMode] = React.useState(false);
  const [isNewProductsMode, setIsNewProductsMode] = React.useState(false);
  const [isCartVisible, setIsCartVisible] = React.useState(false);

  // Loading state based on filters
  const isLoading = useLoading(selectedCategory, 1500);

  // Handler for category selection
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId === "all") {
      setIsAllShoesMode(true);
      setIsNewProductsMode(false);
      // Notify Header that this is ALL SHOES mode, not NEW mode
      if (onNewProductsMode) {
        onNewProductsMode(false);
      }
    } else {
      setIsAllShoesMode(false);
      setIsNewProductsMode(false);
    }
  };

  // Handler for new testimonial submission
  const handleTestimonialSubmit = (e) => {
    e.preventDefault();
    if (newTestimonial.name && newTestimonial.comment) {
      const testimonial = {
        id: testimonials.length + 1,
        name: newTestimonial.name,
        avatar: newTestimonial.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase(),
        rating: newTestimonial.rating,
        comment: newTestimonial.comment,
        date: "Just now",
      };
      setTestimonials([testimonial, ...testimonials]);
      setNewTestimonial({ name: "", rating: 5, comment: "" });
    }
  };

  // Render stars for rating
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400" : "text-gray-400"
        }`}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ));
  };

  // Handler for NEW products mode
  const handleNewProductsMode = (isNewMode) => {
    setIsNewProductsMode(isNewMode);
    if (isNewMode) {
      setIsAllShoesMode(false);
    }
  };

  // Handler for cart visibility
  const handleCartToggle = () => {
    setIsCartVisible(!isCartVisible);
  };

  const handleCartClose = () => {
    setIsCartVisible(false);
  };

  const filteredShoes = filterShoes(
    shoes,
    selectedCategory,
    selectedGender,
    searchTerm,
    isAllShoesMode,
    isNewProductsMode
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <Header
        isHeaderSolid={isHeaderSolid}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        cart={cart}
        clearCart={clearCart}
        onCartToggle={handleCartToggle}
        setSelectedGender={setSelectedGender}
        setSelectedCategory={setSelectedCategory}
        submitSearch={submitSearch}
        clearSearch={clearSearch}
        selectedCategory={selectedCategory}
        selectedGender={selectedGender}
        onNewProductsMode={handleNewProductsMode}
      />

      {/* Hero Section */}
      <HeroSection
        currentSlide={currentSlide}
        setCurrentSlide={setCurrentSlide}
      />

      {/* Categories Filter */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onCategorySelect={handleCategorySelect}
      />

      {/* Products Grid */}
      <ProductGrid
        isLoading={isLoading}
        filteredShoes={filteredShoes}
        setSelectedProduct={setSelectedProduct}
        setIsCheckoutVisible={setIsCheckoutVisible}
        searchTerm={searchTerm}
        isSearchSubmitted={isSearchSubmitted}
      />

      {/* Testimonials Section */}
      <TestimonialSection />

      {/* Product Checkout Section */}
      <ProductCheckout
        isCheckoutVisible={isCheckoutVisible}
        setIsCheckoutVisible={setIsCheckoutVisible}
        selectedProduct={selectedProduct}
        addToCart={addToCart}
      />

      {/* Cart Sidebar */}
      <CartSidebar
        cart={cart}
        updateQuantity={updateQuantity}
        clearCart={handleCartClose}
        isVisible={isCartVisible}
        onClose={handleCartClose}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
