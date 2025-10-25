import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import service from "../backend/cust";
import { useLocation } from "react-router-dom";

const DashBoard = () => {
  const [customer, setCustomer] = useState(() => {
    const stored = localStorage.getItem("customer");
    return stored ? JSON.parse(stored) : null;
  });
  
  

  const [last10Txn, setTxn] = useState([]);

  const myQrValue = () => {
    if (!customer) return "";
    const baseUrl = window.location.origin;
    return `${baseUrl}/topay?account_id=${customer.id}&scheme=${customer.scheme}`;
  };

  useEffect(() => {
    const fetchTxn = async () => {
      if (customer?.id) {
        try {
          const txnList = await service.getalast10Txn(customer.id);
          // Ensure it’s an array, even if single object
          setTxn(Array.isArray(txnList) ? txnList : [txnList]);
        } catch (err) {
          console.error("Error fetching transactions:", err);
        }
      }
    };
    fetchTxn();
  }, [customer]);

  return (
    <div className="min-h-screen bg-gray-100 font-['Roboto'] flex flex-col items-center">
      {/* Header */}
      <header className="w-full bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold text-gray-800">
            Hi, {customer ? customer.name || "User" : "Loading..."}
          </h1>
          <p className="text-sm text-gray-500">{customer?.id}</p>
        </div>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Google_Pay_Logo.svg/2560px-Google_Pay_Logo.svg.png"
          alt="GPay"
          className="h-6"
        />
      </header>

      {/* QR Code Section */}
      <section className="bg-white rounded-2xl shadow-md p-6 mt-6 w-[90%] max-w-md flex flex-col items-center">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Receive Money
        </h2>
        {customer ? (
          <QRCodeSVG value={myQrValue()} size={160} />
        ) : (
          <p>Loading QR...</p>
        )}
        <p className="text-sm text-gray-500 mt-3 text-center">
          Scan this QR code to pay {customer?.name || "you"} instantly
        </p>
      </section>

      {/* Recent Transactions */}
      <section className="w-[90%] max-w-md mt-8 mb-10">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Recent Transactions
        </h3>

        <div className="bg-white rounded-2xl shadow-sm divide-y">
          {last10Txn.length === 0 ? (
            <p className="text-gray-500 text-center py-6">
              No recent transactions
            </p>
          ) : (
            last10Txn.map((txn) => {
              const isSent = txn.debtor?.account?.id === customer?.id;
              const amount = txn.paymentInfo?.instructedAmount?.amount || 0;
              const formattedDate = new Date(txn.transactionDate).toLocaleString(
                "en-IN",
                { dateStyle: "medium", timeStyle: "short" }
              );

              return (
                <div
                  key={txn.id}
                  className="flex justify-between items-center p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex flex-col">
                    <p className="font-medium text-gray-800">
                      {isSent
                        ? txn.creditor?.name || "Receiver"
                        : txn.debtor?.name || "Sender"}
                    </p>
                    <p className="text-xs text-gray-500 max-w-[220px] truncate">
                      {txn.remittanceInfo?.unstructured || "No note"}
                    </p>
                  </div>

                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        isSent ? "text-red-500" : "text-green-600"
                      }`}
                    >
                      {isSent ? "-" : "+"}₹{amount.toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs text-gray-400">{formattedDate}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};

export default DashBoard;
