import React, { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "./apiClient";

// Buat konteks
const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const queryClient = useQueryClient();

  // GET ALL PRODUCTS
  const {
    data: products,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await apiClient.get("/products");
      return res.data.data;
    },
  });

  // SHOW PRODUCT DETAIL
  const getProductById = async (id) => {
    const res = await apiClient.get(`/products/${id}`);
    return res.data.data;
  };

  // store product
  const addProduct = async (formData) => {
    try {
      const response = await apiClient.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      queryClient.invalidateQueries(["products"]);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // UPDATE PRODUCT
  const updateProduct = useMutation({
    mutationFn: async ({ id, formData }) => {
      const response = await apiClient.post(`/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
    },
  });


  // DELETE PRODUCT
  const deleteProduct = useMutation({
    mutationFn: async (id) => await apiClient.delete(`/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
    },
  });

  // SHOW CATEGORY DETAIL
  const getCategories = async () => {
    try {
      const res = await apiClient.get("/categories");
      return res.data.data;
    } catch (error) {
      console.error("Categories API Error:", error);
      throw error;
    }
  };
  // Export PROVIDER
  return (
    <ProductContext.Provider
      value={{
        products,
        isLoading,
        isError,
        getProductById,
        addProduct,
        updateProduct: updateProduct.mutateAsync, // ✅ ganti ini
        deleteProduct,
        getCategories,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);
