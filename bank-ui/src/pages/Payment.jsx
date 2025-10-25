import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import service from "../backend/cust";

const Payment = () => {
  const navigate = useNavigate();
  const [fromAccount] = useState(() => {
    const stored = localStorage.getItem("customer");
    return stored ? JSON.parse(stored) : null;
  });

  const [note, setNote] = useState("");
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const accountId = params.get("account_id");
  const scheme = params.get("scheme");

  const toAccount = {
    id: accountId,
    scheme: scheme,
  };

  const submitPayment =async () => {
    // validation
    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    setError("");
    setIsProcessing(true);

    const resp = await service.pay({fromAccount,toAccount,amount,note})
    
      alert("✅ Payment successful!");
      setIsProcessing(false);
      setAmount("");
      setNote("");
      navigate("/dashboard");

      
  // simulate server delay
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 font-['Roboto']">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-6 transition-all duration-300 hover:shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Send Money</h2>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Google_Pay_Logo.svg/2560px-Google_Pay_Logo.svg.png"
            alt="GPay"
            className="h-7"
          />
        </div>

        {/* From Account */}
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-1">From Account</p>
          <div className="border rounded-lg px-3 py-2 bg-gray-50">
            <p className="text-gray-700 text-sm font-medium">
              {fromAccount ? fromAccount.id || "My Account" : "Not logged in"}
            </p>
          </div>
        </div>

        {/* Receiver Account */}
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-1">Receiver Account</p>
          <input
            type="text"
            value={toAccount.id || ""}
            disabled
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-700 cursor-not-allowed"
          />
        </div>

        {/* Amount */}
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-1">Amount (₹)</p>
          <input
            id="amount"
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="1"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>

        {/* Note */}
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-1">Note (Optional)</p>
          <input
            type="text"
            placeholder="Add a note..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Pay Button */}
        <button
          onClick={submitPayment}
          disabled={isProcessing}
          className={`w-full py-3 rounded-full text-base font-medium transition-all duration-200 ${
            isProcessing
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md"
          }`}
        >
          {isProcessing ? "Processing..." : "Pay Now"}
        </button>

        {/* Footer */}
        <p className="text-xs text-center text-gray-400 mt-4">
          Secure payment powered by <span className="font-semibold">PayLink</span>
        </p>
      </div>
    </div>
  );
};

export default Payment;
