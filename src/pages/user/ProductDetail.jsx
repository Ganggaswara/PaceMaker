import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingCart, ArrowLeft, Star } from "lucide-react";
import { useCart } from "../../hooks/useBag";
import { useProducts } from "../../utils/ProductContext";
import getImageUrl from "../../utils/getImageUrl";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { getProductById } = useProducts();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductById(id);
        setProduct(res);
      } catch (e) {
        setProduct(null);
      }
    };
    fetchProduct();
  }, [id, getProductById]);

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleAddToCart = () => {
    if (product && selectedSize) {
      addToCart({ ...product, size: selectedSize, quantity });
      alert("Added to cart!");
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Product not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="mb-6 border-gray-600 text-gray-300 hover:bg-gray-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            {/** Prefer backend storage paths via helper */}
            {(() => {
              const img = getImageUrl(product?.img_url || product?.image || "");
              return (
                <img
                  src={img || "/images/placeholder.jpg"}
                  alt={product.name}
                  onError={(e) => {
                    e.currentTarget.src = "/images/placeholder.jpg";
                  }}
                  className="w-full h-96 object-cover rounded-2xl"
                />
              );
            })()}
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <img
                  key={i}
                  src={getImageUrl(product?.img_url || product?.image || "") || "/images/placeholder.jpg"}
                  alt={product.name}
                  onError={(e) => {
                    e.currentTarget.src = "/images/placeholder.jpg";
                  }}
                  className={`w-full h-20 object-cover rounded cursor-pointer ${i === 0 ? "" : "opacity-50"}`}
                />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <Badge className="mb-2 bg-blue-100 text-blue-800">
                {product?.category?.name || product?.category || "all"}
              </Badge>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating ?? 5)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-400"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-400">({product.rating ?? 5})</span>
              </div>
              <p className="text-2xl font-bold text-green-400">
                ${typeof product.price === "number" ? product.price : parseFloat(product.price) || 0}
              </p>
            </div>

            <div>
              <p className="text-gray-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Select Size</h3>
              <div className="grid grid-cols-4 gap-2">
                {["7", "8", "9", "10", "11", "12"].map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    onClick={() => setSelectedSize(size)}
                    className={
                      selectedSize === size ? "bg-blue-600" : "border-gray-600"
                    }
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="border-gray-600"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center text-lg">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(1)}
                  className="border-gray-600"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Add to Cart */}
            <Button
              onClick={handleAddToCart}
              disabled={!selectedSize}
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 text-lg"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart - ${(product.price * quantity).toFixed(2)}
            </Button>

            {/* Product Info */}
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between">
                  <span>Gender:</span>
                  <span className="capitalize">{(product.gender || "all")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span className="capitalize">{product?.category?.name || product?.category || "all"}</span>
                </div>
                {(product.isNew ?? product.is_new) && (
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge className="bg-green-100 text-green-800">
                      New Arrival
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
