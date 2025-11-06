import React, { useCallback, useMemo, createContext } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/user/Header";
import Footer from "../components/user/Footer";
import CartSidebar from "../components/user/Bagsidebar";
import { useCart } from "../hooks/useBag";
import { useFilters } from "../hooks/useFilters";
import { useHeroSlides } from "../hooks/useHeroSlides";
import { useHeaderScroll } from "../hooks/useHeaderScroll";
import { useProducts } from "../utils/ProductContext";
import { filterShoes } from "../utils/helpers";
import getImageUrl from "../utils/getImageUrl";

export const UserContext = createContext({
  cart: [],
  addToCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  selectedCategory: 'all',
  setSelectedCategory: () => {},
  selectedGender: 'all',
  setSelectedGender: () => {},
  searchTerm: '',
  setSearchTerm: () => {},
  isSearchSubmitted: false,
  submitSearch: () => {},
  clearSearch: () => {},
  selectedProduct: null,
  setSelectedProduct: () => {},
  isCheckoutVisible: false,
  setIsCheckoutVisible: () => {},
  isAllShoesMode: false,
  setIsAllShoesMode: () => {},
  isNewProductsMode: false,
  setIsNewProductsMode: () => {},
  isCartVisible: false,
  setIsCartVisible: () => {},
  handleCartToggle: () => {},
  handleCartClose: () => {},
  handleNewProductsMode: () => {},
  handleCategorySelect: () => {},
  filteredShoes: [],
  isLoading: false,
  currentSlide: 0,
  setCurrentSlide: () => {},
});

const UserLayout = () => {
  const location = useLocation();

  // ✅ Cek apakah sedang di halaman checkout
  const hideLayout = location.pathname === "/checkout";

  const { products, isLoading } = useProducts();

  const { cart, addToCart, updateQuantity, clearCart } = useCart();
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

  const isHeaderSolid = useHeaderScroll();
  const { currentSlide, setCurrentSlide } = useHeroSlides();
  

  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [isCheckoutVisible, setIsCheckoutVisible] = React.useState(false);
  const [isAllShoesMode, setIsAllShoesMode] = React.useState(false);
  const [isNewProductsMode, setIsNewProductsMode] = React.useState(false);
  const [isCartVisible, setIsCartVisible] = React.useState(false);

  const handleCartToggle = useCallback(() => {
    setIsCartVisible(!isCartVisible);
  }, [isCartVisible]);

  const handleCartClose = useCallback(() => {
    setIsCartVisible(false);
  }, []);

  const handleNewProductsMode = useCallback(() => {
    setIsNewProductsMode(!isNewProductsMode);
  }, [isNewProductsMode]);

  const handleCategorySelect = useCallback(
    (categoryId) => {
      setSelectedCategory(categoryId);
      if (categoryId === "all") {
        setIsAllShoesMode(true);
        setIsNewProductsMode(false);
      } else {
        setIsAllShoesMode(false);
        setIsNewProductsMode(false);
      }
    },
    [setSelectedCategory]
  );

  // Normalisasi harga yang aman dari string berformat (misal: "Rp 1.500.000")
  const parsePriceSafe = (val) => {
    if (typeof val === "number") return val;
    if (typeof val === "string") {
      const digits = val.replace(/[^\d]/g, "");
      const num = Number(digits);
      return Number.isFinite(num) ? num : 0;
    }
    return 0;
  };

  const parseRatingSafe = (val) => {
    const num = typeof val === "number" ? val : Number(val);
    if (!Number.isFinite(num) || num <= 0) return 5;
    return num;
  };

  const normalizedProducts = useMemo(() => {
    return (products || []).map((p) => ({
      id: p.id,
      name: p.name,
      price: parsePriceSafe(p.price),
      category:
        typeof p.category === "string"
          ? p.category.toLowerCase()
          : p?.category?.name?.toLowerCase() || "all",
      image: getImageUrl(p.img_url || p.image || ""),
      description: p.description || "",
      rating: parseRatingSafe(p.rating),
      isNew: Boolean(p.isNew ?? p.is_new ?? false),
      gender: typeof p.gender === "string" ? p.gender.toLowerCase() : "all",
      slug: p.slug || "",
    }));
  }, [products]);

  const filteredShoes = useMemo(() => {
    return filterShoes(
      normalizedProducts,
      selectedCategory,
      selectedGender,
      searchTerm,
      isAllShoesMode,
      isNewProductsMode
    );
  }, [
    normalizedProducts,
    selectedCategory,
    selectedGender,
    searchTerm,
    isAllShoesMode,
    isNewProductsMode,
  ]);

  const contextValue = useMemo(
    () => ({
      cart,
      addToCart,
      updateQuantity,
      clearCart,
      selectedCategory,
      setSelectedCategory,
      selectedGender,
      setSelectedGender,
      searchTerm,
      setSearchTerm,
      isSearchSubmitted,
      submitSearch,
      clearSearch,
      selectedProduct,
      setSelectedProduct,
      isCheckoutVisible,
      setIsCheckoutVisible,
      isAllShoesMode,
      setIsAllShoesMode,
      isNewProductsMode,
      setIsNewProductsMode,
      isCartVisible,
      setIsCartVisible,
      handleCartToggle,
      handleCartClose,
      handleNewProductsMode,
      handleCategorySelect,
      filteredShoes,
      isLoading,
      currentSlide,
      setCurrentSlide,
    }),
    [
      cart,
      addToCart,
      updateQuantity,
      clearCart,
      selectedCategory,
      selectedGender,
      searchTerm,
      isSearchSubmitted,
      selectedProduct,
      isCheckoutVisible,
      isAllShoesMode,
      isNewProductsMode,
      isCartVisible,
      handleCartToggle,
      handleCartClose,
      handleNewProductsMode,
      handleCategorySelect,
      filteredShoes,
      isLoading,
      currentSlide,
    ]
  );

  const headerProps = useMemo(
    () => ({
      isHeaderSolid,
      searchTerm,
      setSearchTerm,
      cart,
      clearCart,
      onCartToggle: handleCartToggle,
      setSelectedGender,
      setSelectedCategory,
      submitSearch,
      clearSearch,
      selectedCategory,
      selectedGender,
    }),
    [
      isHeaderSolid,
      searchTerm,
      cart,
      clearCart,
      handleCartToggle,
      setSelectedGender,
      setSelectedCategory,
      submitSearch,
      clearSearch,
      selectedCategory,
      selectedGender,
    ]
  );

  const cartSidebarProps = useMemo(
    () => ({
      cart,
      updateQuantity,
      clearCart: handleCartClose,
      isVisible: isCartVisible,
      onClose: handleCartClose,
    }),
    [cart, updateQuantity, handleCartClose, isCartVisible]
  );

  return (
    <UserContext.Provider value={contextValue}>
      <div className="min-h-screen bg-black text-white overflow-x-hidden">
        {/* ✅ Sembunyikan Header dan Footer hanya di halaman checkout */}
        {!hideLayout && <Header {...headerProps} />}
        <Outlet />
        {!hideLayout && <Footer />}

        {/* Sidebar tetap aktif di semua halaman */}
        <CartSidebar {...cartSidebarProps} />
      </div>
    </UserContext.Provider>
  );
};

export default UserLayout;
