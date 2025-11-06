import React, { useState, useMemo } from "react";
import { useTransactions } from "../../utils/TransactionContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, TrendingUp, Users, DollarSign, ShoppingCart, CreditCard } from "lucide-react";

export default function TransactionRecap() {
  const [selectedPeriod, setSelectedPeriod] = useState('daily');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  const {
    getDailyRecap,
    getMonthlyRecap,
    members,
    dailyRecapData,
    monthlyRecapData
  } = useTransactions();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatMonth = (monthString) => {
    return new Date(monthString + '-01').toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long'
    });
  };

  // Daily Recap Card Component
  const DailyRecapCard = ({ data, date }) => {
    if (!data) return null;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Rekap Transaksi Harian
          </h2>
          <p className="text-lg text-gray-600">
            {formatDate(date)}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-linear-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-900">
                Total Transaksi
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">
                {data.summary.total_transactions}
              </div>
              <p className="text-xs text-blue-600">
                transaksi hari ini
              </p>
            </CardContent>
          </Card>

          <Card className="bg-linear-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-900">
                Total Pendapatan
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                {formatCurrency(data.summary.total_revenue)}
              </div>
              <p className="text-xs text-green-600">
                dari transaksi selesai
              </p>
            </CardContent>
          </Card>

          <Card className="bg-linear-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-900">
                Menunggu Konfirmasi
              </CardTitle>
              <CalendarDays className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-900">
                {data.summary.total_pending}
              </div>
              <p className="text-xs text-yellow-600">
                transaksi pending
              </p>
            </CardContent>
          </Card>

          <Card className="bg-linear-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-900">
                Tingkat Keberhasilan
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">
                {data.summary.total_transactions > 0
                  ? Math.round((data.summary.total_completed / data.summary.total_transactions) * 100)
                  : 0}%
              </div>
              <p className="text-xs text-purple-600">
                transaksi selesai
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Payment Methods */}
        {data.summary.payment_methods && Object.keys(data.summary.payment_methods).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Metode Pembayaran
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(data.summary.payment_methods).map(([method, stats]) => (
                  <div key={method} className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">
                      {stats.count}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatCurrency(stats.total)}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {method === 'e-wallet' ? 'E-Wallet' :
                       method === 'cash' ? 'Tunai' :
                       method === 'card' ? 'Kartu' : 'Transfer'}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Transaksi Hari Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.transactions && data.transactions.length > 0 ? (
              <div className="space-y-3">
                {data.transactions.slice(0, 10).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {transaction.transaction_number}
                      </div>
                      <div className="text-sm text-gray-600">
                        {transaction.member?.name} • {transaction.product?.name}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">
                        {formatCurrency(transaction.grand_total)}
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                        transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {transaction.status === 'completed' ? 'Selesai' :
                         transaction.status === 'pending' ? 'Pending' : 'Dibatalkan'}
                      </div>
                    </div>
                  </div>
                ))}
                {data.transactions.length > 10 && (
                  <div className="text-center pt-2">
                    <span className="text-sm text-gray-500">
                      dan {data.transactions.length - 10} transaksi lainnya
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Tidak ada transaksi hari ini
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  // Monthly Recap Card Component
  const MonthlyRecapCard = ({ data, month }) => {
    if (!data) return null;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Rekap Transaksi Bulanan
          </h2>
          <p className="text-lg text-gray-600">
            {formatMonth(month)}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-linear-to-br from-indigo-50 to-indigo-100 border-indigo-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-indigo-900">
                Total Transaksi
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-900">
                {data.summary.total_transactions}
              </div>
              <p className="text-xs text-indigo-600">
                transaksi bulan ini
              </p>
            </CardContent>
          </Card>

          <Card className="bg-linear-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-900">
                Total Pendapatan
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                {formatCurrency(data.summary.total_revenue)}
              </div>
              <p className="text-xs text-green-600">
                dari transaksi selesai
              </p>
            </CardContent>
          </Card>

          <Card className="bg-linear-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-900">
                Rata-rata Harian
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">
                {formatCurrency(data.summary.total_revenue / 30)}
              </div>
              <p className="text-xs text-orange-600">
                pendapatan per hari
              </p>
            </CardContent>
          </Card>

          <Card className="bg-linear-to-br from-teal-50 to-teal-100 border-teal-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-teal-900">
                Tingkat Keberhasilan
              </CardTitle>
              <CalendarDays className="h-4 w-4 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-900">
                {data.summary.total_transactions > 0
                  ? Math.round((data.summary.total_completed / data.summary.total_transactions) * 100)
                  : 0}%
              </div>
              <p className="text-xs text-teal-600">
                transaksi selesai
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Daily Breakdown */}
        {data.summary.daily_breakdown && Object.keys(data.summary.daily_breakdown).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Breakdown per Hari
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(data.summary.daily_breakdown)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([date, stats]) => (
                    <div key={date} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {formatDate(date)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {stats.count} transaksi
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">
                          {formatCurrency(stats.total)}
                        </div>
                        <div className="text-sm text-gray-500">
                          rata-rata {formatCurrency(stats.total / stats.count)}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Top Members */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Top Member Bulan Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            {members && members.length > 0 ? (
              <div className="space-y-3">
                {members
                  .filter(member => member.total_spending > 0)
                  .sort((a, b) => b.total_spending - a.total_spending)
                  .slice(0, 5)
                  .map((member, index) => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {member.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {member.total_transactions} transaksi
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">
                          {formatCurrency(member.total_spending)}
                        </div>
                        <div className="text-sm text-gray-500">
                          total belanja
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Belum ada data member
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Period Selection */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Rekap Transaksi
          </h1>
          <p className="text-gray-600 mt-1">
            Laporan transaksi harian dan bulanan
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant={selectedPeriod === 'daily' ? 'default' : 'outline'}
            onClick={() => setSelectedPeriod('daily')}
            className="flex items-center gap-2"
          >
            <CalendarDays className="h-4 w-4" />
            Harian
          </Button>
          <Button
            variant={selectedPeriod === 'monthly' ? 'default' : 'outline'}
            onClick={() => setSelectedPeriod('monthly')}
            className="flex items-center gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            Bulanan
          </Button>
        </div>
      </div>

      {/* Date/Month Selection */}
      <div className="flex flex-col sm:flex-row gap-4">
        {selectedPeriod === 'daily' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pilih Tanggal
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {selectedPeriod === 'monthly' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pilih Bulan
            </label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>

      {/* Recap Content */}
      {selectedPeriod === 'daily' && (
        <DailyRecapCard
          data={dailyRecapData}
          date={selectedDate}
        />
      )}

      {selectedPeriod === 'monthly' && (
        <MonthlyRecapCard
          data={monthlyRecapData}
          month={selectedMonth}
        />
      )}
    </div>
  );
}
