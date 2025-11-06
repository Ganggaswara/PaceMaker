import { useState, useCallback } from 'react';

export const useFilters = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchSubmitted, setIsSearchSubmitted] = useState(false);

  const resetFilters = useCallback(() => {
    setSelectedCategory('all');
    setSelectedGender('all');
    setSearchTerm('');
    setIsSearchSubmitted(false);
  }, []);

  const submitSearch = useCallback(() => {
    setIsSearchSubmitted(true);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setIsSearchSubmitted(false);
  }, []);

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
