import React from "react";
import HeroSection from "../../components/user/Hero";
import CategoryFilter from "../../components/user/CategoryFilter";
import ProductGrid from "../../components/user/ProductGrid";
import ProductCheckout from "../../components/user/ProductCheckout";
import TestimonialSection from "../../components/user/TestimonialSection";
import { UserContext } from "../../layouts/UserLayout";

export default function Home() {
  const {
    // Cart
    addToCart,

    // Filters
    selectedCategory,
    setSelectedCategory,
    selectedGender,
    searchTerm,
    isSearchSubmitted,

    // UI State
    selectedProduct,
    setSelectedProduct,
    isCheckoutVisible,
    setIsCheckoutVisible,

    // Handlers
    handleCategorySelect,

    // Computed values
    filteredShoes,
    isLoading,

    // Hero
    currentSlide,
    setCurrentSlide,
  } = React.useContext(UserContext);

  return (
    <>
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
    </>
  );
}
