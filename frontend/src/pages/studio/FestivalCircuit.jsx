/**
 * @fileoverview Film Festival Circuit Page Component
 */

import React, { useState, useEffect } from "react";
import axios from "../../api/axios";

const FestivalCircuit = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchSubmissions();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white">Film Festival & Awards Circuit</h1>
      {loading ? (
        <div className="text-slate-400">Loading festival entries...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {submissions.map((sub) => (
            <div key={sub._id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <h3 className="text-lg font-bold text-amber-400">{sub.festivalName}</h3>
              <p className="text-sm text-slate-300">Jury Score: {sub.juryScore}/100</p>
              <p className="text-sm text-indigo-400">Award: {sub.awardWon}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FestivalCircuit;
