import React, { useState, useMemo } from 'react';
import { useTransactions } from '../../utils/TransactionContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function TransactionList() {
  const { 
    transactions, 
    transactionsLoading: isLoading, 
    transactionsError: isError, 
    deleteTransaction,
    pagination
  } = useTransactions();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Apakah kamu yakin ingin menghapus transaksi ini?');
    if (!confirmDelete) return;
    try {
      await deleteTransaction.mutateAsync(id);
      toast.success('Transaksi berhasil dihapus!');
    } catch (error) {
      toast.error('Terjadi kesalahan saat menghapus transaksi.');
    }
  };

  const filteredAndPaginatedTransactions = useMemo(() => {
    let filtered = transactions || [];

    if (searchTerm) {
      filtered = filtered.filter(transaction => {
        const searchLower = searchTerm.toLowerCase();
        return (
          transaction.transaction_number?.toLowerCase().includes(searchLower) ||
          transaction.member?.name?.toLowerCase().includes(searchLower) ||
          String(transaction.grand_total).includes(searchLower) ||
          transaction.status?.toLowerCase().includes(searchLower) ||
          transaction.payment_method?.toLowerCase().includes(searchLower)
        );
      });
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedTransactions = filtered.slice(startIndex, endIndex);

    return {
      transactions: paginatedTransactions,
      totalItems: filtered.length,
      totalPages: Math.ceil(filtered.length / itemsPerPage)
    };
  }, [transactions, searchTerm, currentPage, itemsPerPage]);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading transactions.</p>;

  return (
    <div className="p-4 bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4">Manajemen Transaksi</h1>

      <div className="mb-4">
        <Link to="/admin/add-transaction" className="text-blue-600 hover:underline">
          Tambah Transaksi
        </Link>
      </div>

      {/* Search Section */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cari Transaksi
            </label>
            <input
              type="text"
              placeholder="Cari berdasarkan nomor transaksi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <table className="table-auto w-full border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">#</th>
            <th className="p-2 border">No. Transaksi</th>
            <th className="p-2 border">Member</th>
            <th className="p-2 border">Total</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Tanggal</th>
            <th className="p-2 border">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredAndPaginatedTransactions.transactions?.map((transaction, index) => (
            <tr key={transaction.id}>
              <td className="p-2 border">
                {(currentPage - 1) * itemsPerPage + index + 1}
              </td>
              <td className="p-2 border">{transaction.transaction_number}</td>
              <td className="p-2 border">{transaction.member?.name}</td>
              <td className="p-2 border">Rp. {transaction.grand_total}</td>
              <td className="p-2 border">
                <span className={`px-2 py-1 rounded text-sm ${
                  transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                  transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  transaction.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {transaction.status}
                </span>
              </td>
              <td className="p-2 border">
                {new Date(transaction.transaction_date).toLocaleDateString('id-ID')}
              </td>
              <td className="p-2 border space-x-2">
                <Link
                  to={`/admin/edit-transaction/${transaction.id}`}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(transaction.id)}
                  className="text-red-600 hover:underline"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Empty State */}
      {filteredAndPaginatedTransactions.transactions?.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Tidak ada transaksi yang ditemukan.</p>
        </div>
      )}

      {/* Pagination */}
      {filteredAndPaginatedTransactions.totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {Array.from({ length: filteredAndPaginatedTransactions.totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-2 text-sm font-medium border rounded-md ${
                currentPage === page
                  ? 'text-white bg-blue-600 border-blue-600'
                  : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, filteredAndPaginatedTransactions.totalPages))}
            disabled={currentPage === filteredAndPaginatedTransactions.totalPages}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}