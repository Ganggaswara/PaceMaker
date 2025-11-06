import React, { useState, useEffect } from "react";
import { useProducts } from "../../utils/ProductContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import getImageUrl from "../../utils/getImageUrl";
import { useQuery } from "@tanstack/react-query";

// nama class ProductForm
export default function ProductForm() {
  // ambil fungsi addProduct dan getCategories dari context
  const { addProduct, getCategories } = useProducts();

  // Fetch kategori menggunakan React Query
  const { data: categoriesData = [] } = useQuery({
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

  const [previewUrl, setPreviewUrl] = useState(null);

  // mengosongkan state errors
  const [errors, setErrors] = useState({});

  // gunakan useNavigate untuk navigasi setelah submit
  const navigate = useNavigate();

  // fungsi untuk menangani perubahan input, dan memperbarui formData
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    let processedValue = files ? files[0] : value;

    // Convert isNew field to proper boolean
    if (name === "isNew") {
      processedValue = value === "true";
    }

    setFormData({
      ...formData,
      [name]: processedValue,
    });
  };

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

  // fungsi untuk menangani submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Basic validation
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = ["Nama produk wajib diisi"];
    if (!formData.category_id || formData.category_id === "")
      newErrors.category_id = ["Kategori wajib dipilih"];
    if (formData.name.length > 255)
      newErrors.name = ["Nama produk terlalu panjang (maksimal 255 karakter)"];
    if (!formData.price || formData.price <= 0)
      newErrors.price = ["Harga harus lebih dari 0"];
    if (!formData.description.trim())
      newErrors.description = ["Deskripsi wajib diisi"];
    if (formData.description.length < 10)
      newErrors.description = ["Deskripsi minimal 10 karakter"];
    if (formData.description.length > 1000)
      newErrors.description = [
        "Deskripsi terlalu panjang (maksimal 1000 karakter)",
      ];
    if (formData.rating < 1 || formData.rating > 5)
      newErrors.rating = ["Rating harus antara 1-5"];

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("⚠ Periksa kembali data yang dimasukkan.");
      return;
    }

    const data = new FormData();

    // Process form data and handle type conversions for backend
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        switch (key) {
          case "category_id":
          case "price":
          case "rating":
            // Convert to number for numeric fields
            data.append(key, Number(value));
            break;
          case "isNew":
            // Convert boolean to string
            data.append(key, value.toString());
            break;
          case "img":
            // File upload - only append if it's a File object
            if (value instanceof File) {
              data.append(key, value);
            }
            break;
          default:
            // String fields
            data.append(key, String(value));
        }
      }
    });

    try {
      // Debug: log form data being sent
      console.log("Sending form data:");
      for (let [key, value] of data.entries()) {
        console.log(`${key}:`, value, `(type: ${typeof value})`);
      }

      // panggil addProduct dan menyimpan response
      const response = await addProduct(data);
      // tampilkan notifikasi sukses
      toast.success("Produk berhasil disimpan!");
      setTimeout(() => navigate("/admin/products"), 1000);
    } catch (error) {
      // menangkap
      if (error.response?.status === 422) {
        console.log("422 Validation Error Details:", error.response.data);
        setErrors(error.response.data.errors || {});
        toast.error("⚠ Periksa kembali data yang dimasukkan.");
      } else {
        console.log("Other error:", error.response?.data || error.message);
        toast.error("❌ Gagal menyimpan produk.");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white shadow-md rounded-2xl p-6 space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
        Tambah Produk
      </h2>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">
          Nama Produk
        </label>
        <input
          name="name"
          placeholder="Nama Produk"
          onChange={handleChange}
          className={`border rounded-md p-2 w-full ${
            errors.name ? "border-red-500" : ""
          }`}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label className="block font-medium text-gray-600 mb-1">Kategori</label>
        <select
          name="category_id"
          value={formData.category_id}
          onChange={handleChange}
          className={`border rounded-md p-2 w-full ${
            errors.category_id ? "border-red-500" : ""
          }`}
        >
          <option value="">--Pilih Kategori--</option>
          {categoriesData.map((cat) => (
            <option key={cat.category_id} value={cat.category_id}>
              {cat.category}
            </option>
          ))}
        </select>
        {errors.category_id && (
          <p className="text-red-500 text-sm mt-1">{errors.category_id[0]}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">Harga</label>
        <input
          name="price"
          type="number"
          placeholder="Harga Produk"
          onChange={handleChange}
          className={`border rounded-md p-2 w-full ${
            errors.price ? "border-red-500" : ""
          }`}
        />
        {errors.price && (
          <p className="text-red-500 text-sm mt-1">{errors.price[0]}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">Slug</label>
        <input
          name="slug"
          placeholder="product-slug-url"
          onChange={handleChange}
          className={`border rounded-md p-2 w-full ${
            errors.slug ? "border-red-500" : ""
          }`}
        />
        {errors.slug && (
          <p className="text-red-500 text-sm mt-1">{errors.slug[0]}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">
          Produk Baru
        </label>
        <select
          name="isNew"
          onChange={handleChange}
          className={`border rounded-md p-2 w-full ${
            errors.isNew ? "border-red-500" : ""
          }`}
        >
          <option value={true}>Ya</option>
          <option value={false}>Tidak</option>
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
          className={`border rounded-md p-2 w-full ${
            errors.gender ? "border-red-500" : ""
          }`}
        >
          <option value="unisex">Unisex</option>
          <option value="male">Pria</option>
          <option value="female">Wanita</option>
        </select>
        {errors.gender && (
          <p className="text-red-500 text-sm mt-1">{errors.gender[0]}</p>
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
          Deskripsi
        </label>
        <textarea
          name="description"
          placeholder="Tuliskan deskripsi produk"
          onChange={handleChange}
          rows="3"
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">
          Gambar Produk <span className="text-gray-400 text-xs">(Opsional)</span>
        </label>
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Preview"
            className="mt-2 max-h-48 object-cover rounded"
          />
        ) : (
          <img
            src="/images/placeholder.png"
            className="mt-2 mb-4 max-h-48 object-cover rounded"
          />
        )}
        <input
          name="img"
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-2 bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-600 hover:file:bg-blue-200"
        />
        <p className="text-xs text-gray-500 mt-1">
          Biarkan kosong jika tidak ingin menambahkan gambar
        </p>
        {errors.img && (
          <p className="text-red-500 text-sm mt-1">{errors.img[0]}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
      >
        Simpan Produk
      </button>
    </form>
  );
}
