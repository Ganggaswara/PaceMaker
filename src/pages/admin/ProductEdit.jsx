import React, { useState, useEffect } from "react";
import { useProducts } from "../../utils/ProductContext";
import toast from "react-hot-toast";
import getImageUrl from "../../utils/getImageUrl";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

// nama class ProductEdit
export default function ProductEdit() {
  const { id } = useParams();

  // ambil fungsi updateProduct dari context
  const { updateProduct, getProductById, getCategories } = useProducts();

  // Fetch categories
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  // mengosongkan state formData dan errors
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category_id: 1,
    description: "",
    slug: "",
    rating: 5,
    isNew: true,
    gender: "unisex",
    img: null,
  });

  // mengosongkan state errors
  const [errors, setErrors] = useState({});

  // preview URL for image
  const [previewUrl, setPreviewUrl] = useState(null);

  // gunakan useNavigate untuk navigasi setelah submit
  const navigate = useNavigate();

  // Ambil data produk berdasarkan ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductById(id);
        setFormData({
          name: res.name || "",
          price: res.price || "",
          description: res.description || "",
          category_id: res.category?.category_id || 1,
          stock: res.stock || "",
          slug: res.slug || "",
          rating: res.rating || 5,
          isNew: res.isNew || false,
          gender: res.gender || "unisex",
          img: res.img_url || null,
        });
      } catch (err) {
        toast.error("Gagal memuat data produk.");
      }
    };
    fetchProduct();
  }, [id, getProductById]);

  // build preview URL when img changes
  useEffect(() => {
    if (!formData.img) {
      setPreviewUrl(null);
      return;
    }

    if (typeof formData.img === "string") {
      setPreviewUrl(getImageUrl(formData.img));
      return;
    }

    const objectUrl = URL.createObjectURL(formData.img);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [formData.img]);

  // fungsi untuk menangani perubahan input, dan memperbarui formData
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    let processedValue = files ? files[0] : value;

    // Convert isNew field to proper boolean
    if (name === "isNew") {
      processedValue = value === "true";
    }

    // Convert rating to number
    if (name === "rating") {
      processedValue = parseFloat(value) || 0;
    }

    setFormData({
      ...formData,
      [name]: processedValue,
    });
  };

  // fungsi untuk menangani submit form
    const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // validasi frontend
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = ["Nama produk wajib diisi"];
    if (!formData.price || formData.price <= 0)
      newErrors.price = ["Harga harus lebih dari 0"];
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("⚠ Periksa kembali data yang dimasukkan.");
      return;
    }

    const data = new FormData();
    data.append("_method", "PUT");
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "isNew") {
        data.append(key, value ? "1" : "0");
      } else if (value instanceof File) {
        data.append("img", value);
      } else if (value !== null && value !== undefined && value !== "") {
        data.append(key, value);
      }
    });

    try {
      console.log("Updating product with ID:", id);
      await updateProduct({ id: id, formData: data });
      toast.success("Produk berhasil diperbarui!");
      navigate("/admin/products");
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
        toast.error("⚠ Periksa kembali data yang dimasukkan.");
      } else {
        toast.error("❌ Gagal menyimpan produk.");
      }
    }
  };

  
  // Early return jika categories sedang loading
  if (categoriesLoading) {
    return (
      <div className="max-w-md mx-auto bg-white shadow-md rounded-2xl p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Memuat data kategori...</p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white shadow-md rounded-2xl p-6 space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
        Edit Produk
      </h2>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">
          Nama Produk
        </label>
        <input
          name="name"
          placeholder="Nama Produk"
          onChange={handleChange}
          value={formData.name}
          className={`border rounded-md p-2 w-full ${
            errors.name ? "border-red-500" : ""
          }`}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">
          Kategori
        </label>
        <select
          name="category_id"
          value={formData.category_id}
          onChange={handleChange}
          className={`border rounded-md p-2 w-full ${
            errors.category_id ? "border-red-500" : ""
          }`}
        >
          <option value="">Pilih Kategori</option>
          {categories.map((category) => (
            <option key={category.category_id} value={category.category_id}>
              {category.category}
            </option>
          ))}
        </select>
        {errors.category_id && (
          <p className="text-red-500 text-sm mt-1">{errors.category_id[0]}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">
          Deskripsi
        </label>
        <textarea
          name="description"
          placeholder="Deskripsi produk"
          onChange={handleChange}
          value={formData.description}
          rows="3"
          className={`border rounded-md p-2 w-full ${
            errors.description ? "border-red-500" : ""
          }`}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description[0]}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">Harga</label>
        <input
          name="price"
          type="number"
          placeholder="Harga Produk"
          onChange={handleChange}
          value={formData.price}
          className={`border rounded-md p-2 w-full ${
            errors.price ? "border-red-500" : ""
          }`}
        />
        {errors.price && (
          <p className="text-red-500 text-sm mt-1">{errors.price[0]}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">Rating</label>
        <input
          name="rating"
          type="number"
          min="1"
          max="5"
          step="0.1"
          placeholder="Rating (1-5)"
          onChange={handleChange}
          value={formData.rating}
          className={`border rounded-md p-2 w-full ${
            errors.rating ? "border-red-500" : ""
          }`}
        />
        {errors.rating && (
          <p className="text-red-500 text-sm mt-1">{errors.rating[0]}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">
          Produk Baru
        </label>
        <select
          name="isNew"
          onChange={handleChange}
          value={formData.isNew}
          className={`border rounded-md p-2 w-full ${
            errors.isNew ? "border-red-500" : ""
          }`}
        >
          <option value="true">Ya</option>
          <option value="false">Tidak</option>
        </select>
        {errors.isNew && (
          <p className="text-red-500 text-sm mt-1">{errors.isNew[0]}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">Gender</label>
        <select
          name="gender"
          onChange={handleChange}
          value={formData.gender}
          className={`border rounded-md p-2 w-full ${
            errors.gender ? "border-red-500" : ""
          }`}
        >
          <option value="unisex">Unisex</option>
          <option value="men">Pria</option>
          <option value="women">Wanita</option>
        </select>
        {errors.gender && (
          <p className="text-red-500 text-sm mt-1">{errors.gender[0]}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">
          Preview Gambar
        </label>
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Preview"
            className="mt-2 max-h-48 object-cover rounded"
          />
        )}
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">
          Gambar Produk <span className="text-gray-400 text-xs">(Opsional)</span>
        </label>
        <input
          name="img"
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-2 bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-600 hover:file:bg-blue-200"
        />
        <p className="text-xs text-gray-500 mt-1">
          Biarkan kosong jika tidak ingin mengubah gambar
        </p>
        {errors.img && (
          <p className="text-red-500 text-sm mt-1">{errors.img[0]}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
      >
        Simpan Produk
      </button>
    </form>
  );
}
