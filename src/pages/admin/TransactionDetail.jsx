import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useTransactions } from "../../utils/TransactionContext";
import toast, { Toaster } from "react-hot-toast";

export default function TransactionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const {
    transactions,
    members,
    deleteTransaction,
    updateTransaction,
    transactionsLoading
  } = useTransactions();

  const transaction = transactions?.find(t => t.id === parseInt(id));

  useEffect(() => {
    if (transaction) {
      // Format data sesuai struktur API
      setFormData({
        discount: transaction.discount || 0,
        tax: transaction.tax || 0,
        status: transaction.status || 'pending',
        payment_method: transaction.payment_method || 'cash',
        notes: transaction.notes || '',
        transaction_date: transaction.transaction_date ? 
          new Date(transaction.transaction_date).toISOString().split('T')[0] : 
          new Date().toISOString().split('T')[0]
      });
    }
  }, [transaction]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      await updateTransaction.mutateAsync(id, formData);
      setIsEditing(false);
      toast.success("Transaksi berhasil diperbarui!");
    } catch (error) {
      toast.error("Terjadi kesalahan saat memperbarui transaksi.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values
    if (transaction) {
      setFormData({
        quantity: transaction.quantity,
        unit_price: transaction.unit_price,
        discount: transaction.discount,
        tax: transaction.tax,
        status: transaction.status,
        payment_method: transaction.payment_method,
        notes: transaction.notes || '',
        transaction_date: transaction.transaction_date.split('T')[0]
      });
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Apakah kamu yakin ingin menghapus transaksi ini?"
    );
    if (!confirmDelete) return;

    try {
      await deleteTransaction.mutateAsync(id);
      toast.success("Transaksi berhasil dihapus!");
      navigate('/admin/transactions');
    } catch (error) {
      toast.error("Terjadi kesalahan saat menghapus transaksi.");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: "bg-yellow-100 text-yellow-800 ring-yellow-200",
      completed: "bg-green-100 text-green-800 ring-green-200",
      cancelled: "bg-red-100 text-red-800 ring-red-200",
      refunded: "bg-gray-100 text-gray-800 ring-gray-200"
    };

    const statusLabels = {
      pending: "Menunggu",
      completed: "Selesai",
      cancelled: "Dibatalkan",
      refunded: "Dikembalikan"
    };

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig[status] || statusConfig.pending}`}>
        {statusLabels[status] || status}
      </span>
    );
  };

  const getPaymentMethodBadge = (method) => {
    const methodLabels = {
      cash: "Tunai",
      card: "Kartu",
      transfer: "Transfer",
      "e-wallet": "E-Wallet"
    };

    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 ring-1 ring-blue-200">
        {methodLabels[method] || method}
      </span>
    );
  };

  const getMembershipTypeBadge = (type) => {
    const typeConfig = {
      basic: "bg-gray-100 text-gray-800 ring-gray-200",
      premium: "bg-purple-100 text-purple-800 ring-purple-200",
      vip: "bg-gold-100 text-gold-800 ring-gold-200"
    };

    const typeLabels = {
      basic: "Basic",
      premium: "Premium",
      vip: "VIP"
    };

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${typeConfig[type] || typeConfig.basic}`}>
        {typeLabels[type] || type}
      </span>
    );
  };

  if (transactionsLoading) {
    return (
      <div className="p-4 bg-white rounded shadow flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Memuat detail transaksi...</p>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="p-4 bg-white rounded shadow flex items-center justify-center min-h-96">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Transaksi tidak ditemukan
          </h3>
          <Link
            to="/admin/transactions"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Kembali ke Daftar Transaksi
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = formData.quantity * formData.unit_price;
  const grandTotal = totalPrice - formData.discount + formData.tax;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-green-600 to-green-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Detail Transaksi
              </h1>
              <p className="text-green-100 mt-1">
                {transaction.transaction_number}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {!isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    🗑️ Hapus
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    💾 Simpan
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                  >
                    ❌ Batal
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Transaction Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Transaction Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Informasi Transaksi
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">No. Transaksi:</span>
                    <span className="font-medium">{transaction.transaction_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tanggal:</span>
                    <span className="font-medium">
                      {new Date(transaction.transaction_date).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    {isEditing ? (
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="pending">Menunggu</option>
                        <option value="completed">Selesai</option>
                        <option value="cancelled">Dibatalkan</option>
                        <option value="refunded">Dikembalikan</option>
                      </select>
                    ) : (
                      getStatusBadge(transaction.status)
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Metode Pembayaran:</span>
                    {isEditing ? (
                      <select
                        name="payment_method"
                        value={formData.payment_method}
                        onChange={handleInputChange}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="cash">Tunai</option>
                        <option value="card">Kartu</option>
                        <option value="transfer">Transfer</option>
                        <option value="e-wallet">E-Wallet</option>
                      </select>
                    ) : (
                      getPaymentMethodBadge(transaction.payment_method)
                    )}
                  </div>
                </div>
              </div>

              {/* Member Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Informasi Member
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nama:</span>
                    <span className="font-medium">{transaction.member?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{transaction.member?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tipe Member:</span>
                    {getMembershipTypeBadge(transaction.member?.membership_type)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Belanja:</span>
                    <span className="font-medium text-green-600">
                      {formatCurrency(transaction.member?.total_spending || 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Product Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Informasi Produk
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Produk:</span>
                    <span className="font-medium">{transaction.product?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kategori:</span>
                    <span className="font-medium">{transaction.product?.category?.name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gender:</span>
                    <span className="font-medium">
                      {transaction.product?.gender === 'men' ? 'Pria' :
                       transaction.product?.gender === 'women' ? 'Wanita' : 'Unisex'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Transaction Calculation */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Perhitungan
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Jumlah:</span>
                    {isEditing ? (
                      <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        min="1"
                        className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm text-right focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    ) : (
                      <span className="font-medium">{transaction.quantity}</span>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Harga Satuan:</span>
                    {isEditing ? (
                      <input
                        type="number"
                        name="unit_price"
                        value={formData.unit_price}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className="w-32 px-2 py-1 border border-gray-300 rounded-md text-sm text-right focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    ) : (
                      <span className="font-medium">{formatCurrency(transaction.unit_price)}</span>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-medium">{formatCurrency(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Diskon:</span>
                    {isEditing ? (
                      <input
                        type="number"
                        name="discount"
                        value={formData.discount}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className="w-32 px-2 py-1 border border-gray-300 rounded-md text-sm text-right focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    ) : (
                      <span className="font-medium text-red-600">
                        -{formatCurrency(transaction.discount)}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pajak:</span>
                    {isEditing ? (
                      <input
                        type="number"
                        name="tax"
                        value={formData.tax}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className="w-32 px-2 py-1 border border-gray-300 rounded-md text-sm text-right focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    ) : (
                      <span className="font-medium text-blue-600">
                        +{formatCurrency(transaction.tax)}
                      </span>
                    )}
                  </div>
                  <hr className="border-gray-300" />
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-900">Grand Total:</span>
                    <span className="text-green-600">{formatCurrency(grandTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {transaction.notes && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Catatan
              </h3>
              <p className="text-gray-700">{transaction.notes}</p>
            </div>
          )}

          {/* Edit Notes */}
          {isEditing && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Edit Catatan
              </h3>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Tambahkan catatan..."
              />
            </div>
          )}

          {/* Edit Transaction Date */}
          {isEditing && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Edit Tanggal Transaksi
              </h3>
              <input
                type="date"
                name="transaction_date"
                value={formData.transaction_date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <Link
              to="/admin/transactions"
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              ← Kembali ke Daftar Transaksi
            </Link>
            <Link
              to={`/admin/members/${transaction.member_id}`}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Lihat Member →
            </Link>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
