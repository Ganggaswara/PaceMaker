import { useState } from 'react';

export const useFilters = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchSubmitted, setIsSearchSubmitted] = useState(false);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedGender('all');
    setSearchTerm('');
    setIsSearchSubmitted(false);
  };

  const submitSearch = () => {
    setIsSearchSubmitted(true);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setIsSearchSubmitted(false);
  };

  return {
    selectedCategory,
    setSelectedCategory,
    selectedGender,
    setSelectedGender,
    searchTerm,
    setSearchTerm,
    isSearchSubmitted,
    submitSearch,
    clearSearch,
    resetFilters
  };
};
