import { useEffect, useState } from "react";
import service from "../backend/cust";
import { AlertTriangle, Search, ChevronLeft, ChevronRight } from "lucide-react";
import conf from "../conf/conf";

const Bank = () => {
  const [transactions, setTransactions] = useState([]);
  const [totalFlagged, setTotalFlagged] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState(null);

  useEffect(() => {
    fetchFlaggedTransactions();
  }, [page]);

  const fetchFlaggedTransactions = async () => {
    setLoading(true);
    try {
      const res = await service.getFlaggedTransactions(page, pageSize);
      setTransactions(res.content);
      setTotalFlagged(res.totalElements);
    } catch (err) {
      console.error("Error fetching flagged transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  // Connect to SSE endpoint on backend
  const eventSource = new EventSource(conf.backendUrl+"sse/alerts");

  eventSource.onmessage = (event) => {
    try {
      const alert = JSON.parse(event.data);
      // Prepend new transaction to current state
      setTransactions(prev => [alert, ...prev]);

      // Update total flagged count
      setTotalFlagged(prev => prev + 1);
    } catch (err) {
      console.error("Error parsing SSE alert:", err);
    }
  };

  eventSource.onerror = (err) => {
    console.error("SSE connection error:", err);
    eventSource.close(); // close on error
  };

  return () => eventSource.close(); // cleanup on unmount
}, []);


  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-['Roboto']">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-700 to-blue-600 text-white shadow-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-yellow-300" />
          <h1 className="text-2xl font-semibold tracking-tight">Fraud Alert Monitoring</h1>
        </div>
        <div className="text-sm text-gray-200">
          Core Banking Internal • Last updated: {new Date().toLocaleTimeString()}
        </div>
      </header>

      {/* Summary Section */}
      <section className="p-6 grid grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <p className="text-sm text-gray-500">Total Flagged</p>
          <h2 className="text-3xl font-bold text-red-600">{totalFlagged}</h2>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <p className="text-sm text-gray-500">Under Review</p>
          <h2 className="text-3xl font-bold text-yellow-500">{Math.floor(totalFlagged * 0.4)}</h2>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <p className="text-sm text-gray-500">Cleared / Safe</p>
          <h2 className="text-3xl font-bold text-green-600">{Math.floor(totalFlagged * 0.6)}</h2>
        </div>
      </section>

      {/* Flagged Transactions Table */}
      <section className="p-6">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="flex justify-between items-center border-b px-6 py-3">
            <h2 className="text-lg font-semibold">Flagged Transactions</h2>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by Debtor or Creditor..."
                className="border rounded-lg pl-8 pr-3 py-1.5 text-sm"
              />
            </div>
          </div>
          <table className="w-full text-sm text-left border-t">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-6 py-3">Txn ID</th>
                <th className="px-6 py-3">Debtor</th>
                <th className="px-6 py-3">Creditor</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Reason</th>
              </tr>
            </thead>
            <tbody>
              {!loading && transactions.length > 0 ? (
                transactions.map((txn) => (
                  <tr
                    key={txn.id}
                    onClick={() => setSelectedTxn(txn)}
                    className="hover:bg-blue-50 cursor-pointer border-b"
                  >
                    <td className="px-6 py-3 font-mono text-blue-600">{txn.id}</td>
                    <td className="px-6 py-3">{txn.debtor?.name}</td>
                    <td className="px-6 py-3">{txn.creditor?.name}</td>
                    <td className="px-6 py-3 text-red-500 font-semibold">
                      ₹{txn.paymentInfo?.instructedAmount?.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-3">
                      {new Date(txn.transactionDate).toLocaleString()}
                    </td>
                    <td className="px-6 py-3 text-gray-600">{txn.reason || "Suspicious activity"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    {loading ? "Loading transactions..." : "No flagged transactions found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center px-6 py-3 border-t bg-gray-50">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              disabled={page === 0}
              className="flex items-center gap-1 text-sm text-blue-600 disabled:opacity-40"
            >
              <ChevronLeft size={16} /> Prev
            </button>
            <span className="text-sm text-gray-600">
              Page {page + 1} of {Math.ceil(totalFlagged / pageSize)}
            </span>
            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={transactions.length < pageSize}
              className="flex items-center gap-1 text-sm text-blue-600 disabled:opacity-40"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Transaction Details Drawer */}
      {selectedTxn && (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50 transition-opacity duration-300"
    onClick={() => setSelectedTxn(null)}
  >
    <div
      className="bg-white w-[460px] h-full p-6 rounded-l-3xl shadow-2xl flex flex-col overflow-y-auto animate-slide-in"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-3 mb-4">
        <h3 className="text-2xl font-semibold text-gray-900">Transaction Details</h3>
        <button
          className="text-gray-500 hover:text-gray-700 text-xl"
          onClick={() => setSelectedTxn(null)}
        >
          ✕
        </button>
      </div>

      {/* Transaction Summary */}
      <div className="bg-gradient-to-r from-red-100 to-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-5">
        <p className="text-sm text-gray-600">Status</p>
        <p className="text-lg font-semibold text-red-600">
          ⚠ Flagged for Review
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {selectedTxn.reason || "Detected via anomaly-based fraud detection"}
        </p>
      </div>

      {/* Core Details */}
      <div className="space-y-5">
        {/* Payment Info */}
        <section>
          <h4 className="text-lg font-medium text-gray-800 mb-2">
            💳 Payment Information
          </h4>
          <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-1">
            <p><strong>Transaction ID:</strong> {selectedTxn.id}</p>
            <p><strong>Payment Ref:</strong> {selectedTxn.paymentInfo?.instructionId}</p>
            <p>
              <strong>Amount:</strong>{" "}
              <span className="font-semibold text-red-600">
                ₹{selectedTxn.paymentInfo?.instructedAmount?.amount.toLocaleString()}
              </span>{" "}
              ({selectedTxn.paymentInfo?.instructedAmount?.currency})
            </p>
            <p><strong>Date:</strong> {new Date(selectedTxn.transactionDate).toLocaleString()}</p>
          </div>
        </section>

        {/* Debtor Info */}
        <section>
          <h4 className="text-lg font-medium text-gray-800 mb-2">🏦 Debtor</h4>
          <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-1">
            <p><strong>Name:</strong> {selectedTxn.debtor?.name}</p>
            <p><strong>Account ID:</strong> {selectedTxn.debtor?.account?.id}</p>
            <p><strong>Scheme:</strong> {selectedTxn.debtor?.account?.scheme}</p>
          </div>
        </section>

        {/* Creditor Info */}
        <section>
          <h4 className="text-lg font-medium text-gray-800 mb-2">💰 Creditor</h4>
          <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-1">
            <p><strong>Name:</strong> {selectedTxn.creditor?.name}</p>
            <p><strong>Account ID:</strong> {selectedTxn.creditor?.account?.id}</p>
            <p><strong>Scheme:</strong> {selectedTxn.creditor?.account?.scheme}</p>
          </div>
        </section>

        {/* Remittance Info */}
        <section>
          <h4 className="text-lg font-medium text-gray-800 mb-2">🧾 Remittance</h4>
          <div className="bg-gray-50 rounded-lg p-3 text-sm">
            <p>{selectedTxn.remittanceInfo?.unstructured || "No remittance note"}</p>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex justify-between mt-6">
          <button
            className="px-4 py-2 text-sm rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800"
            onClick={() => setSelectedTxn(null)}
          >
            Close
          </button>
          <button
            onClick={() => alert("Transaction marked as safe")}
            className="px-5 py-2 text-sm rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium shadow-md transition-all"
          >
            ✅ Mark as Safe
          </button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default Bank;
