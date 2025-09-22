// Filter functions
export const filterShoes = (shoes, selectedCategory, selectedGender, searchTerm, isAllShoesMode = false, isNewProductsMode = false) => {
  return shoes.filter(shoe => {
    // Special case for ALL SHOES mode (from CategoryFilter)
    if (isAllShoesMode && selectedCategory === 'all') {
      const matchesCategory = true; // Show all categories
      const matchesGender = true; // Show all genders

      // Jika searchTerm kosong, jangan filter berdasarkan search
      if (!searchTerm || searchTerm.trim() === '') {
        return matchesCategory && matchesGender;
      }

      // Jika ada searchTerm, filter berdasarkan nama dan deskripsi
      const matchesSearch = shoe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           shoe.description.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCategory && matchesGender && matchesSearch;
    }

    // Special case for NEW products mode (from Header NEW button)
    if (isNewProductsMode && selectedCategory === 'all' && selectedGender === 'all') {
      const matchesNew = shoe.isNew === true;
      const matchesCategory = true; // Show all categories for NEW
      const matchesGender = true; // Show all genders for NEW

      // Jika searchTerm kosong, jangan filter berdasarkan search
      if (!searchTerm || searchTerm.trim() === '') {
        return matchesNew && matchesCategory && matchesGender;
      }

      // Jika ada searchTerm, filter berdasarkan nama dan deskripsi
      const matchesSearch = shoe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           shoe.description.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesNew && matchesCategory && matchesGender && matchesSearch;
    }

    // Normal filtering for other categories
    const matchesCategory = selectedCategory === 'all' || shoe.category === selectedCategory;
    const matchesGender = selectedGender === 'all' || shoe.gender === selectedGender;

    // Jika searchTerm kosong, jangan filter berdasarkan search
    if (!searchTerm || searchTerm.trim() === '') {
      return matchesCategory && matchesGender;
    }

    // Jika ada searchTerm, filter berdasarkan nama dan deskripsi
    const matchesSearch = shoe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shoe.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesGender && matchesSearch;
  });
};

// Cart utility functions
export const getTotalItems = (cart) => {
  return cart.reduce((total, item) => total + item.quantity, 0);
};

export const getTotalPrice = (cart) => {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
};

// Body scroll management
export const toggleBodyScroll = (isMenuOpen) => {
  if (isMenuOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'unset';
  }
};