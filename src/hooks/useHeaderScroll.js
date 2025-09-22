import { useState, useEffect } from "react";

export const useHeaderScroll = () => {
  const [isHeaderSolid, setIsHeaderSolid] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const productsSection = document.getElementById('products-section');
      if (productsSection) {
        const productsSectionTop = productsSection.offsetTop;
        setIsHeaderSolid(window.scrollY >= productsSectionTop - 80);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return isHeaderSolid;
};
