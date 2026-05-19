import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";


export default function FraudDashboard() {
    const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
  cnic: "",
    amount: "",
    time: "",
    merchantRisk: "",
    isOnline: false,
    isForeign: false,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [counts, setCounts] = useState({ total: 0, fraud: 0, safe: 0 });

  const convertTimeToNumber = (timeStr) => {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(":");
    return Number(hours) + Number(minutes) / 60;
  };


  const fetchStats = async () => {
  try {
    const res = await fetch("http://localhost:3000/fraud/stats");
    const data = await res.json();

    setCounts({
      total: data.total,
      fraud: data.fraud,
      safe: data.safe,
    });
  } catch (error) {
    console.log("Failed to load stats", error);
  }
};

useEffect(() => {
  fetchStats();
}, []);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, 
        [name]: type === "checkbox" ? checked : value });
  };

  const toggleFlag = (name) => {
    setForm((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const res = await fetch("http://localhost:3000/fraud/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({
          name: form.name,
  cnic: form.cnic,
          amount: Number(form.amount),
          time: convertTimeToNumber(form.time),
          merchantRisk: Number(form.merchantRisk),
          isOnline: form.isOnline,
          isForeign: form.isForeign,
        }),
      });

      const data = await res.json();
      if (data.success) {
  fetchStats();
}

      

      setResult(data);
    } catch (error) {
        console.log("Error connecting to fraud API", error);
      setResult({ success: false, message: "Could not reach the fraud API. Check that localhost:3000 is running." });
    } finally {
      setLoading(false);
    }
  };

  const isFraud = result?.success && result?.result === "FRAUD";
  const isSuccess = result?.success;
  const confidence = result?.confidence ? (result.confidence * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-xl space-y-4">
       <button
  onClick={() => navigate("/transactions")}
  className="w-full bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 text-gray-900 px-5 py-3.5 rounded-xl flex items-center justify-between transition-all"
>
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
        <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
      </svg>
    </div>
    <div className="text-left">
      <p className="text-sm font-medium leading-none">Transaction list</p>
      <p className="text-xs text-gray-400 mt-1">View all checked transactions</p>
    </div>
  </div>
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
</button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3l8 4v5c0 4.418-3.582 8-8 9-4.418-1-8-4.582-8-9V7l8-4z"/>
              <path d="M9 12l2 2 4-4"/>
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Fraud Detection System</h1>
            <p className="text-sm text-gray-500">AI-powered transaction risk analysis</p>
          </div>
        </div>

        
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Checks run", value: counts.total, color: "text-gray-900" },
            { label: "Flagged", value: counts.fraud, color: "text-red-600" },
            { label: "Cleared", value: counts.safe, color: "text-emerald-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-gray-100 rounded-xl p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">{label}</p>
              <p className={`text-2xl font-semibold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

   
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5">

      
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
              Transaction details
            </p>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="flex flex-col gap-1">
                <input
  type="text"
  name="name"
  placeholder="Customer Name"
  value={form.name}
  onChange={handleChange}
  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
/>

<input
  type="text"
  name="cnic"
  placeholder="CNIC"
  value={form.cnic}
  onChange={handleChange}
  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
/>
                <label className="text-sm text-gray-500">Amount (USD)</label>
                <input
                  type="number"
                  name="amount"
                  placeholder="e.g. 1500"
                  value={form.amount}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-500">Transaction time</label>
                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-500">Merchant type</label>
              <select
                name="merchantRisk"
                value={form.merchantRisk}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
              >
                <option value="">Select merchant type</option>
                <option value={0.1}>Trusted merchant</option>
                <option value={0.4}>Normal merchant</option>
                <option value={0.7}>Suspicious merchant</option>
                <option value={0.9}>High-risk merchant</option>
              </select>
            </div>
          </div>


          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="14" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
              Transaction flags
            </p>

            <div className="grid grid-cols-2 gap-3">
     
              <button
                type="button"
                onClick={() => toggleFlag("isOnline")}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                  form.isOnline
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 ${form.isOnline ? "text-blue-600" : "text-gray-400"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                <div>
                  <p className={`text-sm font-medium ${form.isOnline ? "text-blue-700" : "text-gray-700"}`}>Online</p>
                  <p className={`text-xs ${form.isOnline ? "text-blue-500" : "text-gray-400"}`}>Card not present</p>
                </div>
              </button>

           
              <button
                type="button"
                onClick={() => toggleFlag("isForeign")}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                  form.isForeign
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 ${form.isForeign ? "text-blue-600" : "text-gray-400"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18M3 6h18M3 18h18"/><path d="M12 3c-4 3-4 15 0 18M12 3c4 3 4 15 0 18"/></svg>
                <div>
                  <p className={`text-sm font-medium ${form.isForeign ? "text-blue-700" : "text-gray-700"}`}>International</p>
                  <p className={`text-xs ${form.isForeign ? "text-blue-500" : "text-gray-400"}`}>Cross-border</p>
                </div>
              </button>
            </div>
          </div>

    
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Analysing...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3l18 18M10.5 10.677a2 2 0 002.823 2.823"/><path d="M7.362 7.561A7.03 7.03 0 002 12s3 7 10 7a7.03 7.03 0 005.44-2.561"/><path d="M22 12s-3-7-10-7c-.84 0-1.648.095-2.412.269"/></svg>
                Analyse transaction
              </>
            )}
          </button>
        </div>

     
        {result && (
          <div className={`rounded-2xl p-5 border ${
            !isSuccess
              ? "bg-red-50 border-red-200"
              : isFraud
              ? "bg-red-50 border-red-200"
              : "bg-emerald-50 border-emerald-200"
          }`}>
            {!isSuccess ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-200 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                </div>
                <div>
                  <p className="font-medium text-red-800">Connection error</p>
                  <p className="text-sm text-red-600">{result.message}</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isFraud ? "bg-red-200" : "bg-emerald-200"}`}>
                    {isFraud ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-emerald-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    )}
                  </div>
                  <div>
                    <p className={`font-semibold text-lg ${isFraud ? "text-red-800" : "text-emerald-800"}`}>
                      {isFraud ? "Fraudulent transaction" : "Legitimate transaction"}
                    </p>
                    <p className={`text-sm ${isFraud ? "text-red-500" : "text-emerald-600"}`}>
                      {result.fraud ? "Flagged as suspicious" : "Cleared for processing"}
                    </p>
                  </div>
                </div>

        
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-500">Model confidence</span>
                    <span className={`font-medium ${isFraud ? "text-red-700" : "text-emerald-700"}`}>{confidence}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-black/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${isFraud ? "bg-red-500" : "bg-emerald-500"}`}
                      style={{ width: `${confidence}%` }}
                    />
                  </div>
                </div>

      
                <div className="mt-3">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                    result.fraud ? "bg-red-200 text-red-800" : "bg-emerald-200 text-emerald-800"
                  }`}>
                    {result.fraud ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    )}
                    {result.fraud ? "Fraud flag active" : "No fraud flag"}
                  </span>
                </div>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
}