import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTransactions } from "../../utils/TransactionContext";
import toast, { Toaster } from "react-hot-toast";

export default function MemberManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortDirection, setSortDirection] = useState("desc");

  const {
    members,
    membersLoading,
    deleteMember,
    toggleMemberStatus,
    getMemberStatistics
  } = useTransactions();

  // Filter dan pagination logic
  const filteredAndPaginatedMembers = useMemo(() => {
    let filtered = members || [];

    // Filter berdasarkan search term (name or email)
    if (searchTerm && filtered.length > 0) {
      filtered = filtered.filter(
        (member) =>
          member?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter berdasarkan status
    if (selectedStatus && filtered.length > 0) {
      filtered = filtered.filter(
        (member) => member?.status === selectedStatus
      );
    }

    // Filter berdasarkan membership type
    if (selectedType && filtered.length > 0) {
      filtered = filtered.filter(
        (member) => member?.membership_type === selectedType
      );
    }

    // Sort logic
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'total_spending':
          aValue = parseFloat(a.total_spending) || 0;
          bValue = parseFloat(b.total_spending) || 0;
          break;
        case 'total_transactions':
          aValue = parseInt(a.total_transactions) || 0;
          bValue = parseInt(b.total_transactions) || 0;
          break;
        case 'membership_date':
          aValue = new Date(a.membership_date);
          bValue = new Date(b.membership_date);
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        default:
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedMembers = filtered.slice(startIndex, endIndex);

    return {
      members: paginatedMembers,
      totalItems: filtered.length,
      totalPages: Math.ceil(filtered.length / itemsPerPage),
    };
  }, [members, searchTerm, selectedStatus, selectedType, sortBy, sortDirection, currentPage, itemsPerPage]);

  // Reset page ketika filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatus, selectedType]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Apakah kamu yakin ingin menghapus member ini?"
    );
    if (!confirmDelete) return;
    try {
      await deleteMember.mutateAsync(id);
      toast.success("Member berhasil dihapus!");
    } catch (error) {
      toast.error("Terjadi kesalahan saat menghapus member.");
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleMemberStatus.mutateAsync(id);
      toast.success("Status member berhasil diubah!");
    } catch (error) {
      toast.error("Terjadi kesalahan saat mengubah status member.");
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: "bg-green-100 text-green-800 ring-green-200",
      inactive: "bg-gray-100 text-gray-800 ring-gray-200",
      suspended: "bg-red-100 text-red-800 ring-red-200"
    };

    const statusLabels = {
      active: "Aktif",
      inactive: "Tidak Aktif",
      suspended: "Ditangguhkan"
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[status] || statusConfig.active}`}>
        {statusLabels[status] || status}
      </span>
    );
  };

  const getMembershipTypeBadge = (type) => {
    const typeConfig = {
      basic: "bg-gray-100 text-gray-800 ring-gray-200",
      premium: "bg-purple-100 text-purple-800 ring-purple-200",
      vip: "bg-yellow-100 text-yellow-800 ring-yellow-200"
    };

    const typeLabels = {
      basic: "Basic",
      premium: "Premium",
      vip: "VIP"
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${typeConfig[type] || typeConfig.basic}`}>
        {typeLabels[type] || type}
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  if (membersLoading) {
    return (
      <div className="p-4 bg-white rounded shadow flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Memuat data member...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded shadow">

    <div className="mb-4 flex justify-start">
      <Link
        to="/admin/add-member"
        className="px-4 py-2 text-white rounded-md bg-linear-to-r from-blue-400 to-blue-800 hover:from-blue-500 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Tambah Member
      </Link>
    </div>

      {/* Filter Section */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cari Member
            </label>
            <input
              type="text"
              placeholder="Cari berdasarkan nama atau email..."
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
              <option value="active">Aktif</option>
              <option value="inactive">Tidak Aktif</option>
              <option value="suspended">Ditangguhkan</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipe Member
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Tipe</option>
              <option value="basic">Basic</option>
              <option value="premium">Premium</option>
              <option value="vip">VIP</option>
            </select>
          </div>

          {/* Sort Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Urutkan Berdasarkan
            </label>
            <select
              value={`${sortBy}_${sortDirection}`}
              onChange={(e) => {
                const [field, direction] = e.target.value.split('_');
                setSortBy(field);
                setSortDirection(direction);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="created_at_desc">Tanggal Daftar (Terbaru)</option>
              <option value="created_at_asc">Tanggal Daftar (Terlama)</option>
              <option value="name_asc">Nama (A-Z)</option>
              <option value="name_desc">Nama (Z-A)</option>
              <option value="total_spending_desc">Total Belanja (Tertinggi)</option>
              <option value="total_spending_asc">Total Belanja (Terendah)</option>
              <option value="total_transactions_desc">Jumlah Transaksi (Terbanyak)</option>
              <option value="total_transactions_asc">Jumlah Transaksi (Tersedikit)</option>
              <option value="membership_date_desc">Tanggal Member (Terbaru)</option>
              <option value="membership_date_asc">Tanggal Member (Terlama)</option>
            </select>
          </div>
        </div>

        {/* Clear Filters */}
        <div className="mt-3 flex justify-end">
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedStatus("");
              setSelectedType("");
              setSortBy("created_at");
              setSortDirection("desc");
              setCurrentPage(1);
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Reset Filter
          </button>
        </div>

        {/* Results Info */}
        <div className="mt-3 text-sm text-gray-600">
          Menampilkan {filteredAndPaginatedMembers.members?.length || 0} dari{" "}
          {filteredAndPaginatedMembers.totalItems} member
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-linear-to-r from-blue-600 to-blue-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Kontak
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Tipe & Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Total Belanja
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Jumlah Transaksi
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Tanggal Bergabung
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredAndPaginatedMembers.members?.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50 transition-colors duration-200 group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                          {member.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {member.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {member.email}
                    </div>
                    {member.phone && (
                      <div className="text-sm text-gray-500">
                        {member.phone}
                      </div>
                    )}
                    {member.address && (
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {member.address}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-2">
                      <div>
                        {getMembershipTypeBadge(member.membership_type)}
                      </div>
                      <div>
                        {getStatusBadge(member.status)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-lg font-bold text-green-600">
                      {formatCurrency(member.total_spending)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {member.total_transactions}
                    </div>
                    <div className="text-sm text-gray-500">
                      transaksi
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(member.membership_date)}
                    </div>
                    {member.birth_date && (
                      <div className="text-sm text-gray-500">
                        Lahir: {formatDate(member.birth_date)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-3">
                      <Link
                        to={`/admin/member/${member.id}`}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                      >
                        👁️ Detail
                      </Link>
                      <button
                        onClick={() => handleToggleStatus(member.id)}
                        className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 ${
                          member.status === 'active'
                            ? 'text-white bg-orange-600 hover:bg-orange-700 focus:ring-orange-500'
                            : 'text-white bg-green-600 hover:bg-green-700 focus:ring-green-500'
                        }`}
                      >
                        {member.status === 'active' ? '⏸️ Nonaktif' : '▶️ Aktif'}
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
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
        {filteredAndPaginatedMembers.members?.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-b-xl">
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-gray-100 p-3 mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Tidak ada member
              </h3>
              <p className="text-gray-500 mb-6 max-w-sm">
                {searchTerm || selectedStatus || selectedType
                  ? `Tidak ada member yang sesuai dengan filter yang dipilih.`
                  : `Belum ada member yang ditambahkan ke sistem.`}
              </p>
              {(searchTerm || selectedStatus || selectedType) && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedStatus("");
                    setSelectedType("");
                    setSortBy("created_at");
                    setSortDirection("desc");
                    setCurrentPage(1);
                  }}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
                >
                  Hapus Filter
                </button>
              )}
            </div>
          </div>
        )}

        {/* Pagination */}
        {filteredAndPaginatedMembers.totalPages > 1 &&
          filteredAndPaginatedMembers.members?.length > 0 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-xl">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Menampilkan{" "}
                  <span className="font-medium">
                    {filteredAndPaginatedMembers.members?.length}
                  </span>{" "}
                  dari{" "}
                  <span className="font-medium">
                    {filteredAndPaginatedMembers.totalItems}
                  </span>{" "}
                  member
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
                      { length: filteredAndPaginatedMembers.totalPages },
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
                          filteredAndPaginatedMembers.totalPages
                        )
                      )
                    }
                    disabled={
                      currentPage === filteredAndPaginatedMembers.totalPages
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
        Halaman {currentPage} dari {filteredAndPaginatedMembers.totalPages} (
        {filteredAndPaginatedMembers.totalItems} total member)
      </div>
      <Toaster />
    </div>
  );
}
