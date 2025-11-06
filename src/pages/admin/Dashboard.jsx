import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../../utils/ProductContext";
import getImageUrl from "../../utils/getImageUrl";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

// nama komponen
export default function Dashboard() {
  // State untuk pagination dan filter
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const { products, isLoading, isError, deleteProduct, getCategories } =
    useProducts();

  // Fallback products data untuk testing dengan nested category structure
  const fallbackProducts = [
    {
      id: 1,
      product_id: 1,
      name: "Nike Air Max Running",
      description: "Sepatu lari premium untuk performa maksimal",
      category: { id: 1, name: "Running" },
      price: 1500000,
      slug: "nike-air-max-running",
      rating: 4.5,
      isNew: true,
      gender: "men"
    },
    {
      id: 2,
      product_id: 2,
      name: "Adidas Basketball Pro",
      description: "Sepatu basket profesional dengan grip terbaik",
      category: { id: 2, name: "Basketball" },
      price: 1200000,
      slug: "adidas-basketball-pro",
      rating: 4.8,
      isNew: false,
      gender: "men"
    },
    {
      id: 3,
      product_id: 3,
      name: "Training Gloves",
      description: "Sarung tangan training untuk gym",
      category: { id: 3, name: "Training" },
      price: 250000,
      slug: "training-gloves",
      rating: 4.2,
      isNew: true,
      gender: "unisex"
    },
    {
      id: 4,
      product_id: 4,
      name: "Hiking Boots Waterproof",
      description: "Sepatu hiking anti air untuk petualangan",
      category: { id: 4, name: "Hiking" },
      price: 800000,
      slug: "hiking-boots-waterproof",
      rating: 4.6,
      isNew: false,
      gender: "women"
    }
  ];

  // Use fallback data if API doesn't return products
  const actualProducts = products && products.length > 0 ? products : fallbackProducts;

  // Fetch categories dengan fallback data untuk testing
  const { data: categories = [], isLoading: categoriesLoading, isError: categoriesError } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  // Filter dan pagination logic
  const filteredAndPaginatedProducts = useMemo(() => {
    let filtered = actualProducts || [];

    // Filter berdasarkan search term
    if (searchTerm && filtered.length > 0) {
      filtered = filtered.filter(
        (product) =>
          product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product?.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter berdasarkan kategori
    if (selectedCategory && filtered.length > 0) {
      filtered = filtered.filter(
        (product) => product?.category?.id === parseInt(selectedCategory)
      );
    }

    // Pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = filtered.slice(startIndex, endIndex);

    return {
      products: paginatedProducts,
      totalItems: filtered.length,
      totalPages: Math.ceil(filtered.length / itemsPerPage),
    };
  }, [actualProducts, searchTerm, selectedCategory, currentPage, itemsPerPage]);

  // Reset page ketika filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  // Early returns - pindah ke sini setelah semua hooks dideklarasikan
  if (isLoading || categoriesLoading) {
    return (
      <div className="p-4 bg-white rounded shadow flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Memuat data produk...</p>
        </div>
      </div>
    );
  }

  if (isError || categoriesError) {
    return (
      <div className="p-4 bg-white rounded shadow flex items-center justify-center min-h-96">
        <div className="text-center text-red-600">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          <p className="font-medium">Terjadi kesalahan saat memuat data</p>
          <p className="text-sm text-gray-500 mt-1">Silakan refresh halaman atau coba lagi nanti</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Refresh Halaman
          </button>
        </div>
      </div>
    );
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Apakah kamu yakin ingin menghapus produk ini?"
    );
    if (!confirmDelete) return;
    try {
      await deleteProduct.mutateAsync(id);
      toast.success("Produk berhasil dihapus!");
    } catch (error) {
      toast.error("Terjadi kesalahan saat menghapus produk.");
    }
  };

  return (
    
    <div className="p-4 bg-white rounded shadow">
      
    <div className="mb-4 flex justify-start">
      <button
        onClick={() => window.location.href = "/admin/add-product"} // ini akan mengarahkan ke halaman /admin/add-product
        className="px-4 py-2 text-white rounded-md bg-linear-to-r from-blue-400 to-blue-800 hover:from-blue-500 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Tambah Produk
      </button>
    </div>
      {/* Filter Section */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          {/* Search Input */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cari Produk
            </label>
            <input
              type="text"
              placeholder="Cari berdasarkan nama produk..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter */}
          <div className="md:w-64">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kategori
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Kategori</option>
              {categories?.map((category, index) => (
                <option
                  key={category?.category_id || `category-${index}`}
                  value={category?.category_id || ""}
                >
                  {category?.category || "Kategori"}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          <div>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("");
                setCurrentPage(1);
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Results Info */}
        <div className="mt-3 text-sm text-gray-600">
          Menampilkan {filteredAndPaginatedProducts.products?.length || 0} dari{" "}
          {filteredAndPaginatedProducts.totalItems} produk
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-linear-to-r from-blue-600 to-blue-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  No
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Produk
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Detail
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Harga
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredAndPaginatedProducts.products?.map((p, index) => (
                <tr
                  key={p?.id || p?.product_id || `product-${index}`}
                  className="hover:bg-gray-50 transition-colors duration-200 group"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="shrink-0 h-22 w-25">
                        <img
                          loading="lazy"
                          className="h-20 w-25 rounded-lg object-cover shadow-sm ring-2 ring-gray-100 group-hover:ring-blue-200 transition-all duration-200"
                          src={
                            p?.img_url
                              ? getImageUrl(p.img_url)
                              : "/images/placeholder.png"}
                          alt={p?.name || "Product"}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                          {p?.name || "N/A"}
                        </div>
                        {p?.description && (
                          <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {p.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-2">
                      <div>
                        <code className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 ring-1 ring-gray-200">
                          {p?.slug || "N/A"}
                        </code>
                      </div>
                      <div>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ring-1 ring-blue-200">
                          {p?.category?.name ||
                            `ID: ${p?.category?.id || "N/A"}`}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-lg font-bold text-green-600">
                      $ {p?.price?.toLocaleString() || p?.price || "0"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center">
                        <div className="flex items-center mr-2">
                          <span className="text-yellow-400 text-sm mr-1">
                            ★
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {p?.rating || 0}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            p?.isNew
                              ? "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200"
                              : "bg-gray-100 text-gray-800 ring-1 ring-gray-200"
                          }`}
                        >
                          {p?.isNew ? "✨ Baru" : "📦 Bekas"}
                        </span>
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            p?.gender === "men"
                              ? "bg-blue-100 text-blue-800 ring-1 ring-blue-200"
                              : p?.gender === "women"
                              ? "bg-pink-100 text-pink-800 ring-1 ring-pink-200"
                              : "bg-purple-100 text-purple-800 ring-1 ring-purple-200"
                          }`}
                        >
                          {p?.gender === "men"
                            ? "👨 Pria"
                            : p?.gender === "women"
                            ? "👩 Wanita"
                            : "👥 Unisex"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-3">
                    <Link
                        to={`/admin/edit-product/${p.id}`}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                      >
                        ✏️ Edit
                      </Link>
                      
                      <button
                        onClick={() => handleDelete(p?.product_id || p?.id)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                      >
                        🗑️ Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredAndPaginatedProducts.products?.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-b-xl">
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-gray-100 p-3 mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  ></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Tidak ada produk
              </h3>
              <p className="text-gray-500 mb-6 max-w-sm">
                {searchTerm || selectedCategory
                  ? `Tidak ada produk yang sesuai dengan filter yang dipilih.`
                  : `Belum ada produk yang ditambahkan ke sistem.`}
              </p>
              {(searchTerm || selectedCategory) && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("");
                    setCurrentPage(1);
                  }}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    ></path>
                  </svg>
                  Hapus Filter
                </button>
              )}
            </div>
          </div>
        )}

        {/* Pagination */}
        {filteredAndPaginatedProducts.totalPages > 1 &&
          filteredAndPaginatedProducts.products?.length > 0 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-xl">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Menampilkan{" "}
                  <span className="font-medium">
                    {filteredAndPaginatedProducts.products?.length}
                  </span>{" "}
                  dari{" "}
                  <span className="font-medium">
                    {filteredAndPaginatedProducts.totalItems}
                  </span>{" "}
                  produk
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 19l-7-7 7-7"
                      ></path>
                    </svg>
                    Sebelumnya
                  </button>

                  <div className="flex items-center space-x-1">
                    {Array.from(
                      { length: filteredAndPaginatedProducts.totalPages },
                      (_, i) => i + 1
                    ).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 text-sm font-medium border rounded-lg transition-colors duration-200 ${
                          currentPage === page
                            ? "text-white bg-blue-600 border-blue-600 shadow-sm"
                            : "text-gray-700 bg-white border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(
                          prev + 1,
                          filteredAndPaginatedProducts.totalPages
                        )
                      )
                    }
                    disabled={
                      currentPage === filteredAndPaginatedProducts.totalPages
                    }
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Selanjutnya
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
      </div>

      {/* Pagination Info */}
      <div className="mt-4 text-center text-sm text-gray-600">
        Halaman {currentPage} dari {filteredAndPaginatedProducts.totalPages} (
        {filteredAndPaginatedProducts.totalItems} total produk)
      </div>
      <Toaster />
    </div>
  );
}
