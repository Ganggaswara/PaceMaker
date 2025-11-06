import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, CreditCard, Plus, Minus } from "lucide-react";
import qrisImage from "../../assets/qris.jpg";
import { Toaster, toast } from "react-hot-toast";
import { useCart } from "../../hooks/useBag";
import { getTotalPrice } from "../../utils/helpers";
import Header from "../../components/user/Header";
import CartSidebar from "../../components/user/Bagsidebar";
import { useLocation } from "react-router-dom";

const Checkout = () => {
  const location = useLocation();
  const [paymentMethod, setPaymentMethod] = useState("E-Wallet");
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const didLoadRef = useRef(false);

  const { cart, updateQuantity } = useCart();

  const handleCartToggle = () => setIsCartVisible(!isCartVisible);
  const handleCartClose = () => setIsCartVisible(false);

  const handleCheckoutFromCart = () => {
    const stored = localStorage.getItem("checkoutItems");
    let currentCheckout = stored ? JSON.parse(stored) : [];

    const merged = [...currentCheckout, ...cart];
    const unique = merged.filter(
      (item, index, self) =>
        index ===
        self.findIndex(
          (i) => i.id === item.id && i.selectedSize === item.selectedSize
        )
    );

    localStorage.setItem("checkoutItems", JSON.stringify(unique));
    setCheckoutItems(unique);
    toast.success("Barang dari keranjang ditambahkan ke ringkasan pesanan!");
  };

  useEffect(() => {
  if (didLoadRef.current) return;
  didLoadRef.current = true;

  const storedDirectItem = localStorage.getItem("directCheckoutItem");
  const storedCheckoutItems = localStorage.getItem("checkoutItems");
  const storedCartCheckout = localStorage.getItem("checkoutFromCart");

  let directItems = [];
  let existingItems = [];
  let cartItemsToAdd = [];

  if (storedCheckoutItems) {
    existingItems = JSON.parse(storedCheckoutItems);
  }

  if (storedDirectItem) {
    directItems = [JSON.parse(storedDirectItem)];
    localStorage.removeItem("directCheckoutItem");
  }

  if (storedCartCheckout) {
    cartItemsToAdd = JSON.parse(storedCartCheckout);
    localStorage.removeItem("checkoutFromCart");
  }

  // Gabungkan semua (tanpa duplikasi)
  const merged = [...existingItems, ...directItems, ...cartItemsToAdd];
  const unique = merged.filter(
    (item, index, self) =>
      index ===
      self.findIndex(
        (i) => i.id === item.id && i.selectedSize === item.selectedSize
      )
  );

  setCheckoutItems(unique);
  localStorage.setItem("checkoutItems", JSON.stringify(unique));
}, [location.key]);


  // 🔹 Tambahkan fungsi update jumlah produk di ringkasan
  const handleQuantityChange = (itemId, size, delta) => {
    setCheckoutItems((prevItems) => {
      const updated = prevItems
        .map((item) =>
          item.id === itemId && item.selectedSize === size
            ? {
                ...item,
                quantity: Math.max(0, (item.quantity || 1) + delta),
              }
            : item
        )
        .filter((item) => item.quantity > 0); // hapus jika quantity = 0

      localStorage.setItem("checkoutItems", JSON.stringify(updated));
      return updated;
    });
  };

  const totalPrice = getTotalPrice(checkoutItems);
  const tax = (parseFloat(totalPrice) * 0.1).toFixed(2);
  const shipping = checkoutItems.length > 0 ? 10.0 : 0.0;
  const grandTotal = (
    parseFloat(totalPrice) +
    parseFloat(tax) +
    shipping
  ).toFixed(2);

  const handleSubmit = () => {
    if (checkoutItems.length === 0) {
      toast.error("Tidak ada produk untuk checkout!");
      return;
    }
    toast.success(
      `Pembayaran dengan ${paymentMethod} berhasil! Admin akan segera verifikasi.`,
      { duration: 3000 }
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-gray-800 text-white">
      <Toaster position="top-center" />

      <Header
        isCheckoutPage={true}
        cart={cart}
        onCartToggle={handleCartToggle}
      />

      <div className="pt-20 px-6 pb-16">
        <div className="max-w-6xl mx-auto animate-fadeIn">
          <h1 className="text-4xl font-extrabold text-center mb-12 tracking-tight">
            🛍️ Checkout
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Order Summary */}
            <Card className="bg-gray-900/80 border-gray-800 shadow-lg hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl font-bold">
                  <ShoppingCart className="w-5 h-5 text-blue-400" />
                  Ringkasan Pesanan
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {checkoutItems.length === 0 ? (
                  <div className="text-center py-10 text-gray-400">
                    <p>Tidak ada produk untuk checkout 😢</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {checkoutItems.map((item) => (
                      <div
                        key={item.id + "-" + item.selectedSize}
                        className="flex items-center justify-between p-3 bg-gray-800/70 rounded-lg hover:bg-gray-700/60 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-md border border-gray-700"
                          />
                          <div>
                            <h3 className="font-semibold">{item.name}</h3>
                            <p className="text-gray-400 text-sm">
                              {item.selectedSize} - $ {item.price}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <button
                                onClick={() =>
                                  handleQuantityChange(item.id, item.selectedSize, -1)
                                }
                                className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="px-2 font-semibold">
                                {item.quantity || 1}
                              </span>
                              <button
                                onClick={() =>
                                  handleQuantityChange(item.id, item.selectedSize, 1)
                                }
                                className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                        <span className="font-bold text-blue-400">
                          $ {(item.price * (item.quantity || 1)).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {checkoutItems.length > 0 && (
                  <>
                    <Separator className="bg-gray-700 my-4" />
                    <div className="space-y-3 text-gray-300">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>$ {totalPrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax (10%)</span>
                        <span>$ {tax}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ongkir</span>
                        <span>$ {shipping.toFixed(2)}</span>
                      </div>
                      <Separator className="bg-gray-700" />
                      <div className="flex justify-between font-bold text-lg text-blue-400">
                        <span>Total</span>
                        <span>$ {grandTotal}</span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Payment Section */}
            <Card className="bg-gray-900/80 border-gray-800 shadow-lg transition-all duration-300 transform ">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl font-bold">
                  <CreditCard className="w-5 h-5 text-blue-400" />
                  Metode Pembayaran
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-8">
                <div>
                  <label
                    htmlFor="paymentMethod"
                    className="block text-gray-300 mb-2 font-medium"
                  >
                    Pilih Metode Pembayaran:
                  </label>
                  <select
                    id="paymentMethod"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  >
                    <option value="Kartu Kredit/Debit">
                      Kartu Kredit/Debit
                    </option>
                    <option value="E-Wallet">E-Wallet (QRIS)</option>
                    <option value="Transfer Bank (VA)">
                      Transfer Bank (VA)
                    </option>
                    <option value="PayLater">PayLater</option>
                  </select>
                </div>

                {/* Form Kartu Kredit/Debit */}
                {paymentMethod === "Kartu Kredit/Debit" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 mb-2 font-medium">
                        Nomor Kartu
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2 font-medium">
                        Nama Pemegang Kartu
                      </label>
                      <input
                        type="text"
                        placeholder="JOHN DOE"
                        className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-300 mb-2 font-medium">
                          Tanggal Kadaluarsa
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          maxLength="5"
                          className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2 font-medium">
                          CVV
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          maxLength="3"
                          className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-4">
                      🔒 Transaksi Anda aman dan terenkripsi
                    </p>
                  </div>
                )}

                {/* Form E-Wallet (QRIS) */}
                {paymentMethod === "E-Wallet" && (
                  <div className="text-center">
                    <p className="text-gray-400 mb-4">
                      Silakan scan QRIS di bawah untuk melakukan pembayaran:
                    </p>
                    <div className="p-4 bg-gray-800 rounded-2xl inline-block shadow-inner">
                      <img
                        src={qrisImage}
                        alt="QRIS Pembayaran"
                        className="w-64 mx-auto rounded-lg border border-gray-700 shadow-md hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-4">
                      Setelah pembayaran, kirim bukti transfer ke admin untuk
                      konfirmasi.
                    </p>
                  </div>
                )}

                {/* Form Transfer Bank (VA) */}
                {paymentMethod === "Transfer Bank (VA)" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 mb-2 font-medium">
                        Pilih Bank
                      </label>
                      <select className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                        <option value="">-- Pilih Bank --</option>
                        <option value="BCA">BCA Virtual Account</option>
                        <option value="Mandiri">Mandiri Virtual Account</option>
                        <option value="BNI">BNI Virtual Account</option>
                        <option value="BRI">BRI Virtual Account</option>
                        <option value="Permata">Permata Virtual Account</option>
                      </select>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                      <p className="text-gray-400 text-sm mb-2">
                        Nomor Virtual Account akan digenerate setelah konfirmasi:
                      </p>
                      <div className="bg-gray-900 p-3 rounded text-center">
                        <span className="text-2xl font-mono text-blue-400">
                          8808 1234 5678 9012
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-3">
                        * Nomor VA di atas adalah contoh. Nomor asli akan dikirim
                        setelah konfirmasi pesanan.
                      </p>
                    </div>
                    <div className="bg-blue-900/20 border border-blue-700/50 p-3 rounded-lg">
                      <p className="text-sm text-blue-300">
                        💡 Transfer sesuai nominal <strong>$ {grandTotal}</strong> untuk
                        verifikasi otomatis
                      </p>
                    </div>
                  </div>
                )}

                {/* Form PayLater */}
                {paymentMethod === "PayLater" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 mb-2 font-medium">
                        Pilih Provider PayLater
                      </label>
                      <select className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                        <option value="">-- Pilih Provider --</option>
                        <option value="Kredivo">Kredivo</option>
                        <option value="Akulaku">Akulaku</option>
                        <option value="Indodana">Indodana</option>
                        <option value="Atome">Atome</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2 font-medium">
                        Nomor Handphone
                      </label>
                      <input
                        type="tel"
                        placeholder="08123456789"
                        className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2 font-medium">
                        Email
                      </label>
                      <input
                        type="email"
                        placeholder="email@example.com"
                        className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                    <div className="bg-yellow-900/20 border border-yellow-700/50 p-4 rounded-lg">
                      <h4 className="font-semibold text-yellow-300 mb-2">
                        📋 Cicilan 3 Bulan Tanpa Bunga
                      </h4>
                      <div className="space-y-1 text-sm text-gray-300">
                        <p>Total Pembayaran: <strong>$ {grandTotal}</strong></p>
                        <p>Cicilan per bulan: <strong>$ {(grandTotal / 3).toFixed(2)}</strong></p>
                        <p className="text-xs text-gray-500 mt-2">
                          * Syarat dan ketentuan berlaku sesuai provider
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleSubmit}
                  disabled={checkoutItems.length === 0}
                  className="w-full py-4 text-lg font-semibold bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50"
                >
                  Konfirmasi Pembayaran
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <CartSidebar
        cart={cart}
        updateQuantity={updateQuantity}
        clearCart={handleCartClose}
        isVisible={isCartVisible}
        onClose={handleCartClose}
        onCheckoutFromCart={handleCheckoutFromCart}
      />
    </div>
  );
};

export default Checkout;
