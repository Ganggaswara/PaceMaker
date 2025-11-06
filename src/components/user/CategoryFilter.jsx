import React from 'react';
import { categories } from '../../utils/data';

const CategoryFilter = ({ selectedCategory, setSelectedCategory, onCategorySelect }) => {
  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    if (onCategorySelect) {
      onCategorySelect(categoryId);
    }
  };
  return (
    <section className="py-8 bg-black border-t border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-2 md:gap-6">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`px-4 py-3 font-black cursor-pointer text-sm tracking-wider transition-all hover:text-white ${
                selectedCategory === category.id
                  ? 'text-white border-b-2 border-white'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryFilter;
