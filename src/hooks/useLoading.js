import { useState, useEffect } from 'react';

export const useLoading = (dependency, delay = 1000) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [dependency, delay]);

  return isLoading;
};
