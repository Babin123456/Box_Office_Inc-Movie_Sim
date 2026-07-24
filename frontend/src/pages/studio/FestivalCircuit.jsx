/**
 * @fileoverview Film Festival Circuit Page Component
 */

import React, { useState, useEffect } from "react";
import axios from "../../api/axios";

const FestivalCircuit = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/festivals/active");
      setSubmissions(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleWithdraw = async (submissionId) => {
    try {
      await axios.post("/api/festivals/withdraw", { submissionId });
      fetchSubmissions();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to withdraw submission");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white">Film Festival & Prestige Circuit</h1>
      {loading ? (
        <div className="text-slate-400">Loading festival entries...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {submissions.map((sub) => (
            <div key={sub._id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-amber-400">{sub.festivalName}</h3>
                <span className="text-xs px-2 py-1 bg-slate-800 text-slate-300 rounded">{sub.status}</span>
              </div>
              <p className="text-sm text-slate-300">Jury Score: {sub.juryScore}/100</p>
              <p className="text-sm text-indigo-400">Award: {sub.awardWon}</p>
              {sub.marketDistributionOffer > 0 && (
                <p className="text-sm text-emerald-400">Distributor Acquisition Offer: ₹{(sub.marketDistributionOffer / 1000000).toFixed(2)}M</p>
              )}
              {sub.status === "SUBMITTED" && (
                <button
                  onClick={() => handleWithdraw(sub._id)}
                  className="mt-2 text-xs bg-rose-600/80 hover:bg-rose-600 text-white px-3 py-1 rounded"
                >
                  Withdraw Entry
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FestivalCircuit;

