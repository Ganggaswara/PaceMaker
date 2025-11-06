import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTransactions } from "../../utils/TransactionContext";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

// nama komponen
export default function TransactionManagement() {
  // State untuk pagination dan filter
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedMember, setSelectedMember] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const {
    transactions,
    members,
    transactionsLoading,
    membersLoading,
    transactionsError,
    membersError,
    deleteTransaction,
    updateTransaction
  } = useTransactions();

  // Filter dan pagination logic
  const filteredAndPaginatedTransactions = useMemo(() => {
    // Pastikan transactions adalah array
    let filtered = Array.isArray(transactions) ? transactions : [];

    // Filter berdasarkan search term (transaction number)
    if (searchTerm) {
      filtered = filtered.filter(
        (transaction) =>
          transaction?.transaction_number?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter berdasarkan status
    if (selectedStatus) {
      filtered = filtered.filter(
        (transaction) => transaction?.status === selectedStatus
      );
    }

    // Filter berdasarkan member
    if (selectedMember) {
      filtered = filtered.filter(
        (transaction) => transaction?.member_id === parseInt(selectedMember)
      );
    }

    // Filter berdasarkan date range
    if (startDate && endDate) {
      filtered = filtered.filter((transaction) => {
        if (!transaction?.transaction_date) return false;
        const transactionDate = new Date(transaction.transaction_date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return transactionDate >= start && transactionDate <= end;
      });
    }

    // Pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedTransactions = filtered.slice(startIndex, endIndex);

    return {
      transactions: paginatedTransactions,
      totalItems: filtered.length,
      totalPages: Math.ceil(filtered.length / itemsPerPage),
    };
  }, [transactions, searchTerm, selectedStatus, selectedMember, startDate, endDate, currentPage, itemsPerPage]);

  // Reset page ketika filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatus, selectedMember, startDate, endDate]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Apakah kamu yakin ingin menghapus transaksi ini?"
    );
    if (!confirmDelete) return;
    try {
      await deleteTransaction.mutateAsync(id);
      toast.success("Transaksi berhasil dihapus!");
    } catch (error) {
      toast.error("Terjadi kesalahan saat menghapus transaksi.");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateTransaction(id, { status: newStatus });
      toast.success("Status transaksi berhasil diubah!");
    } catch (error) {
      toast.error("Terjadi kesalahan saat mengubah status transaksi.");
    }
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
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[status] || statusConfig.pending}`}>
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
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ring-1 ring-blue-200">
        {methodLabels[method] || method}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Debug logging
  useEffect(() => {
    console.log('Members data:', members);
    console.log('Members is array:', Array.isArray(members));
    console.log('Members type:', typeof members);
  }, [members]);

  // Error Handling
  if (transactionsError || membersError) {
    console.error('Transaction Error:', transactionsError);
    console.error('Members Error:', membersError);
    return (
      <div className="p-4 bg-white rounded shadow">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Terjadi kesalahan saat memuat data</p>
          <p className="text-sm mt-2">Mohon refresh halaman atau coba lagi nanti</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh Halaman
          </button>
        </div>
      </div>
    );
  }

  // Loading State
  if (transactionsLoading || membersLoading) {
    return (
      <div className="p-4 bg-white rounded shadow flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Memuat data transaksi...</p>
        </div>
      </div>
    );
  }

  // Validasi data transactions
  if (!transactions) {
    return (
      <div className="p-4 bg-white rounded shadow">
        <div className="text-center text-yellow-600">
          <p className="text-lg font-semibold">Tidak ada data transaksi</p>
          <p className="text-sm mt-2">Silakan tambah transaksi baru</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded shadow">

    <div className="mb-4 flex justify-start">
      <Link
        to="/admin/add-transaction"
        className="px-4 py-2 text-white rounded-md bg-linear-to-r from-green-400 to-green-800 hover:from-green-500 hover:to-green-900 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        Tambah Transaksi
      </Link>
    </div>

      {/* Filter Section */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Search Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cari No. Transaksi
            </label>
            <input
              type="text"
              placeholder="Cari berdasarkan nomor transaksi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Status</option>
              <option value="pending">Menunggu</option>
              <option value="completed">Selesai</option>
              <option value="cancelled">Dibatalkan</option>
              <option value="refunded">Dikembalikan</option>
            </select>
          </div>

          {/* Member Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Member
            </label>
            <select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Member</option>
              {Array.isArray(members) && members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Filter */}
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Mulai
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Akhir
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedStatus("");
                setSelectedMember("");
                setStartDate("");
                setEndDate("");
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Results Info */}
        <div className="mt-3 text-sm text-gray-600">
          Menampilkan{" "}
          {Array.isArray(filteredAndPaginatedTransactions.transactions)
            ? filteredAndPaginatedTransactions.transactions.length
            : 0}{" "}
          dari {filteredAndPaginatedTransactions.totalItems} transaksi
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-linear-to-r from-green-600 to-green-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  No. Transaksi
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Produk
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Jumlah
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Pembayaran
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {Array.isArray(filteredAndPaginatedTransactions.transactions) &&
                filteredAndPaginatedTransactions.transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 transition-colors duration-200 group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {transaction.transaction_number}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {transaction.member?.name || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {transaction.member?.email || ''}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {transaction.products?.length > 0 ? (
                        transaction.products.length === 1 ? (
                          transaction.products[0].name
                        ) : (
                          `${transaction.products.length} produk`
                        )
                      ) : 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {transaction.products?.map((product, index) => (
                        <div key={product.product_id}>
                          {index + 1}. {product.name} (ID: {product.product_id})
                        </div>
                      )) || ''}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {transaction.products?.map((product, index) => (
                        <div key={product.product_id}>
                          {product.pivot.quantity} x {formatCurrency(product.pivot.unit_price)}
                        </div>
                      )) || '0 x 0'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-lg font-bold text-green-600">
                      {formatCurrency(transaction.grand_total)}
                    </div>
                    {transaction.discount > 0 && (
                      <div className="text-sm text-red-500">
                        Diskon: {formatCurrency(transaction.discount)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(transaction.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getPaymentMethodBadge(transaction.payment_method)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(transaction.transaction_date).toLocaleDateString('id-ID')}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(transaction.transaction_date).toLocaleTimeString('id-ID')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-3">
                      <Link
                        to={`/admin/transaction/${transaction.id}`}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                      >
                        👁️ Detail
                      </Link>
                      <select
                        value={transaction.status}
                        onChange={(e) => handleStatusChange(transaction.id, e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="pending">Menunggu</option>
                        <option value="completed">Selesai</option>
                        <option value="cancelled">Dibatalkan</option>
                        <option value="refunded">Dikembalikan</option>
                      </select>
                      <button
                        onClick={() => handleDelete(transaction.id)}
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
        {(!Array.isArray(filteredAndPaginatedTransactions.transactions) ||
          filteredAndPaginatedTransactions.transactions.length === 0) && (
          <div className="text-center py-12 bg-gray-50 rounded-b-xl">
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-gray-100 p-3 mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Tidak ada transaksi
              </h3>
              <p className="text-gray-500 mb-6 max-w-sm">
                {searchTerm || selectedStatus || selectedMember || startDate || endDate
                  ? `Tidak ada transaksi yang sesuai dengan filter yang dipilih.`
                  : `Belum ada transaksi yang ditambahkan ke sistem.`}
              </p>
              {(searchTerm || selectedStatus || selectedMember || startDate || endDate) && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedStatus("");
                    setSelectedMember("");
                    setStartDate("");
                    setEndDate("");
                    setCurrentPage(1);
                  }}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-sm"
                >
                  Hapus Filter
                </button>
              )}
            </div>
          </div>
        )}

        {/* Pagination */}
        {filteredAndPaginatedTransactions.totalPages > 1 &&
          Array.isArray(filteredAndPaginatedTransactions.transactions) &&
          filteredAndPaginatedTransactions.transactions.length > 0 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-xl">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Menampilkan{" "}
                  <span className="font-medium">
                    {Array.isArray(filteredAndPaginatedTransactions.transactions)
                      ? filteredAndPaginatedTransactions.transactions.length
                      : 0}
                  </span>{" "}
                  dari{" "}
                  <span className="font-medium">
                    {filteredAndPaginatedTransactions.totalItems}
                  </span>{" "}
                  transaksi
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Sebelumnya
                  </button>

                  <div className="flex items-center space-x-1">
                    {Array.from(
                      { length: filteredAndPaginatedTransactions.totalPages },
                      (_, i) => i + 1
                    ).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 text-sm font-medium border rounded-lg transition-colors duration-200 ${
                          currentPage === page
                            ? "text-white bg-green-600 border-green-600 shadow-sm"
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
                          filteredAndPaginatedTransactions.totalPages
                        )
                      )
                    }
                    disabled={
                      currentPage === filteredAndPaginatedTransactions.totalPages
                    }
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Selanjutnya
                  </button>
                </div>
              </div>
            </div>
          )}
      </div>

      {/* Pagination Info */}
      <div className="mt-4 text-center text-sm text-gray-600">
        Halaman {currentPage} dari {filteredAndPaginatedTransactions.totalPages} (
        {filteredAndPaginatedTransactions.totalItems} total transaksi)
      </div>
      <Toaster />
    </div>
  );
}
