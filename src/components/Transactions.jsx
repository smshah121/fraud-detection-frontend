import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchTransactions = async () => {
    try {
      const res = await fetch("http://localhost:3000/fraud");
      const data = await res.json();
      setTransactions(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">

        <h1 className="text-2xl font-bold text-gray-800">
          All Transactions History
        </h1>

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate("/")}
          className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm transition"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* CONTENT */}
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : transactions.length === 0 ? (
        <p className="text-gray-500">No transactions found</p>
      ) : (
        <div className="grid gap-4">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition"
            >

              {/* NAME + CNIC */}
              <div className="mb-2">
                <p className="text-gray-800 font-semibold">
                  {tx.name}
                </p>
                <p className="text-xs text-gray-500">
                  CNIC: {tx.cnic}
                </p>
              </div>

              {/* AMOUNT */}
              <p className="text-sm text-gray-700">
                Amount:{" "}
                <span className="font-medium">
                  ${tx.amount}
                </span>
              </p>

              {/* RESULT */}
              <p className="mt-1">
                <b>Result:</b>{" "}
                <span
                  className={`font-semibold ${
                    tx.result === "FRAUD"
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {tx.result}
                </span>
              </p>

              {/* CONFIDENCE */}
              <p className="text-sm text-gray-700 mt-1">
                Confidence:{" "}
                <span className="font-medium">
                  {(tx.confidence * 100).toFixed(1)}%
                </span>
              </p>

              {/* DATE */}
              <p className="text-xs text-gray-400 mt-2">
                {new Date(tx.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}