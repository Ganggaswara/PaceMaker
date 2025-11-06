import React, { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "./apiClient";

// Buat konteks
const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const queryClient = useQueryClient();

  // GET ALL TRANSACTIONS
  const {
    data: transactionsData,
    isLoading: transactionsLoading,
    isError: transactionsError,
    refetch: refetchTransactions
  } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      try {
        const res = await apiClient.get("/transactions");
        console.log("Transactions API Response:", res.data);
        // Return the entire response data which includes pagination info
        return res.data;
      } catch (error) {
        console.error("Transactions API Error:", error);
        return { data: [], meta: {} };
      }
    },
  });

  // Extract transactions array from the paginated response
  // Kompatibel dengan struktur: { success: ..., data: { ...paginationFields, data: [transaksi] } }
  const transactions = transactionsData?.data?.data || [];
  const pagination = {
    currentPage: transactionsData?.data?.current_page || 1,
    lastPage: transactionsData?.data?.last_page || 1,
    perPage: transactionsData?.data?.per_page || 15,
    total: transactionsData?.data?.total || 0,
  };

  // GET ALL MEMBERS
  const {
    data: members,
    isLoading: membersLoading,
    isError: membersError,
    refetch: refetchMembers
  } = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      try {
        const res = await apiClient.get("/members");
        console.log("Members API Response:", res.data);

        // Ambil array dari res.data.data.data (karena data-nya nested)
        const result = Array.isArray(res.data?.data?.data)
          ? res.data.data.data
          : [];

        console.log("Members processed result:", result);
        return result;
      } catch (error) {
        console.error("Members API Error:", error);
        return [];
      }
    },
  });

  // GET DAILY RECAP
  const getDailyRecap = async (date) => {
    const res = await apiClient.get(`/transactions/recap/daily`, {
      params: date ? { date } : {}
    });
    return res.data;
  };

  // GET MONTHLY RECAP
  const getMonthlyRecap = async (month) => {
    const res = await apiClient.get(`/transactions/recap/monthly`, {
      params: month ? { month } : {}
    });
    return res.data;
  };

  // GET MEMBER RECAP
  const getMemberRecap = async (memberId, period) => {
    const res = await apiClient.get(`/transactions/recap/member/${memberId}`, {
      params: period ? { period } : {}
    });
    return res.data;
  };

  // STORE TRANSACTION
  const addTransaction = async (transactionData) => {
    try {
      // Format data sesuai struktur API
      const formattedData = {
        member_id: transactionData.member_id,
        products: transactionData.products.map(p => ({
        product_id: p.product_id ?? p.id,
        quantity: p.quantity
      })),
        payment_method: transactionData.payment_method,
        notes: transactionData.notes,
        transaction_date: transactionData.transaction_date
      };

      const response = await apiClient.post("/transactions", formattedData);
      queryClient.invalidateQueries(["transactions"]);
      queryClient.invalidateQueries(["members"]);
      return response.data;
    } catch (error) {
      console.error("Add Transaction Error:", error.response?.data || error);
      throw error;
    }
  };

  // UPDATE TRANSACTION
  const updateTransaction = async (id, transactionData) => {
    try {
      // Format data sesuai struktur API
      const formattedData = {
        discount: transactionData.discount,
        tax: transactionData.tax,
        status: transactionData.status,
        payment_method: transactionData.payment_method,
        notes: transactionData.notes,
        transaction_date: transactionData.transaction_date
      };

      const response = await apiClient.put(`/transactions/${id}`, formattedData);
      queryClient.invalidateQueries(["transactions"]);
      queryClient.invalidateQueries(["members"]);
      return response.data;
    } catch (error) {
      console.error("Update Transaction Error:", error.response?.data || error);
      throw error;
    }
  };

  // DELETE TRANSACTION
  const deleteTransaction = useMutation({
    mutationFn: async (id) => await apiClient.delete(`/transactions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["transactions"]);
      queryClient.invalidateQueries(["members"]);
    },
  });

  // GET TRANSACTION BY ID
  const getTransactionById = async (id) => {
    const res = await apiClient.get(`/transactions/${id}`);
    return res.data.data;
  };

  // STORE MEMBER
  const addMember = async (memberData) => {
    try {
      const response = await apiClient.post("/members", memberData);
      queryClient.invalidateQueries(["members"]);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // UPDATE MEMBER
  const updateMember = async (id, memberData) => {
    try {
      const response = await apiClient.put(`/members/${id}`, memberData);
      queryClient.invalidateQueries(["members"]);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // DELETE MEMBER
  const deleteMember = useMutation({
    mutationFn: async (id) => await apiClient.delete(`/members/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["members"]);
    },
  });

  // GET MEMBER BY ID
  const getMemberById = async (id) => {
    const res = await apiClient.get(`/members/${id}`);
    return res.data.data;
  };

  // GET MEMBER STATISTICS
  const getMemberStatistics = async () => {
    const res = await apiClient.get("/members/statistics");
    return res.data.data;
  };

  // TOGGLE MEMBER STATUS
  const toggleMemberStatus = useMutation({
    mutationFn: async (id) => await apiClient.patch(`/members/${id}/toggle-status`),
    onSuccess: () => {
      queryClient.invalidateQueries(["members"]);
    },
  });

  // GET MEMBER TRANSACTION HISTORY
  const getMemberTransactionHistory = async (memberId, filters) => {
    const res = await apiClient.get(`/members/${memberId}/transactions`, {
      params: filters
    });
    return res.data;
  };

  // Export PROVIDER
  return (
    <TransactionContext.Provider
      value={{
        // Transaction data
        transactions,
        transactionsLoading,
        transactionsError,
        refetchTransactions,
        pagination,

        // Member data
        members,
        membersLoading,
        membersError,
        refetchMembers,

        // Transaction functions
        getDailyRecap,
        getMonthlyRecap,
        getMemberRecap,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        getTransactionById,

        // Member functions
        addMember,
        updateMember,
        deleteMember,
        getMemberById,
        getMemberStatistics,
        toggleMemberStatus,
        getMemberTransactionHistory,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => useContext(TransactionContext);
