/**
 * @fileoverview Insurance Manager Frontend Dashboard Component
 */

import React, { useState, useEffect } from "react";
import axios from "../../api/axios";

const InsuranceManager = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/insurance/policies");
        setPolicies(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPolicies();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white">Studio Completion Bonds & Risk Insurance</h1>
      {loading ? (
        <div className="text-slate-400">Loading active policies...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {policies.map((p) => (
            <div key={p._id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <h3 className="text-lg font-bold text-indigo-400">{p.policyType}</h3>
              <p className="text-sm text-slate-300">Coverage: ₹{(p.coverageAmount / 1000000).toFixed(2)}M</p>
              <p className="text-sm text-emerald-400">Weekly Premium: ₹{p.weeklyPremium?.toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InsuranceManager;
