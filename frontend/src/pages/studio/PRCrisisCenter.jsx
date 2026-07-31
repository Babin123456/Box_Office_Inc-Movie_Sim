import React, { useState, useEffect } from "react";
import api from "../../api/apiClient";

const PRCrisisCenter = () => {
  const [crises, setCrises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchCrises();
  }, []);

  const fetchCrises = async () => {
    try {
      setLoading(true);
      const res = await api.get("/crisis/active");
      if (res.data.success) {
        setCrises(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load PR crises", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (crisisId, strategy) => {
    try {
      const res = await api.post("/crisis/resolve", { crisisId, strategy });
      if (res.data.success) {
        setMessage(res.data.message);
        fetchCrises();
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to resolve crisis.");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-2">PR Crisis Command Center</h1>
      <p className="text-gray-400 mb-6">Manage studio scandals, media controversies, and reputation damage control.</p>

      {message && <div className="mb-4 p-4 bg-indigo-900/50 border border-indigo-500 rounded-lg text-indigo-200">{message}</div>}

      {loading ? (
        <div className="text-gray-400">Scanning studio PR feeds...</div>
      ) : crises.length === 0 ? (
        <div className="bg-gray-800 p-8 rounded-xl text-center border border-gray-700">
          <p className="text-green-400 font-semibold text-lg">No active studio crises reported.</p>
          <p className="text-gray-400 text-sm mt-1">Your public relations standing remains spotless.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {crises.map((c) => (
            <div key={c._id} className="bg-gray-800 p-6 rounded-xl border border-red-900/50">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold text-red-400">{c.title}</h3>
                <span className="text-xs bg-red-950 text-red-300 font-bold px-3 py-1 rounded-full uppercase">
                  {c.severity} SEVERITY
                </span>
              </div>
              <p className="text-gray-300 text-sm mb-4">{c.description}</p>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => handleResolve(c._id, "PUBLIC_APOLOGY")} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm font-semibold">
                  Public Apology ($50k)
                </button>
                <button onClick={() => handleResolve(c._id, "PRESS_TOUR")} className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-semibold">
                  Press Tour ($100k)
                </button>
                <button onClick={() => handleResolve(c._id, "SETTLEMENT_PAYOUT")} className="bg-yellow-700 hover:bg-yellow-600 text-white px-4 py-2 rounded text-sm font-semibold">
                  Financial Settlement ($250k)
                </button>
                <button onClick={() => handleResolve(c._id, "LEGAL_ACTION")} className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded text-sm font-semibold">
                  Legal Action ($500k)
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PRCrisisCenter;
