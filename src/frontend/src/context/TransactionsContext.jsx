// src/context/TransactionsContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const TransactionsContext = createContext();

export const TransactionsProvider = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch transactions from backend
  const fetchTransactions = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5001/api/transactions/${userId}`);
      setTransactions(res.data || []);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // Add a new transaction
  const addTransaction = async (transaction) => {
    if (!userId) return;
    try {
      await axios.post(`http://localhost:5001/api/transactions/${userId}`, transaction);
      await fetchTransactions(); // Refresh after adding
    } catch (err) {
      console.error("Failed to add transaction:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [userId]);

  return (
    <TransactionsContext.Provider value={{ transactions, loading, fetchTransactions, addTransaction }}>
      {children}
    </TransactionsContext.Provider>
  );
};

// Custom hook to use transactions context
export const useTransactions = () => useContext(TransactionsContext);
