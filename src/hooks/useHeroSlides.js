import { useState, useEffect } from "react";
import { heroSlides } from "../utils/data";

export const useHeroSlides = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(current => (current + 1) % heroSlides.length);
    }, 4000); 

    return () => clearInterval(interval);
  }, []);

  return { currentSlide, setCurrentSlide };
};