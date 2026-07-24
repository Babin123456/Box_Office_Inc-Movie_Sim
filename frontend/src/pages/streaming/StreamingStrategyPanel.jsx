/**
 * @fileoverview Streaming Release Strategy Panel
 *
 * Displays projected streaming revenue potential and recommends
 * the optimal hybrid release strategy (theatrical window vs streaming pivot).
 */

import React, { useState, useEffect } from "react";
import axios from "../../api/axios";

const STRATEGY_LABELS = {
  THEATRICAL_EXTENDED: { label: "Extended Theatrical Run", color: "text-emerald-400", icon: "🎬" },
  HYBRID_DAY_DATE: { label: "Hybrid Day-and-Date", color: "text-amber-400", icon: "📺" },
  EARLY_STREAMING_PIVOT: { label: "Early Streaming Pivot", color: "text-rose-400", icon: "🚀" },
};

const StreamingStrategyPanel = ({ movieId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!movieId) return;
    const fetchStrategy = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`/api/streaming/movies/${movieId}/strategy`);
        setData(res.data.data);
      } catch (err) {
        setError("Failed to load streaming strategy.");
      } finally {
        setLoading(false);
      }
    };
    fetchStrategy();
  }, [movieId]);

  if (loading) return <div className="p-4 text-center text-slate-400 animate-pulse">Analyzing release strategy...</div>;
  if (error) return <div className="p-4 text-center text-rose-400">{error}</div>;
  if (!data) return null;

  const strategy = STRATEGY_LABELS[data.hybridStrategy?.recommendation] || {};
  const revenueM = ((data.revenuePotential?.streamingPotential || 0) / 1_000_000).toFixed(1);
  const conversionPct = ((data.revenuePotential?.conversionRate || 0) * 100).toFixed(2);

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 space-y-4 shadow-lg">
      <h3 className="text-base font-bold text-white flex items-center gap-2">
        📊 Streaming Release Strategy
        <span className="text-xs text-slate-400 font-normal">{data.title}</span>
      </h3>

      <div className="grid grid-cols-2 gap-3 text-center text-sm">
        <div className="bg-slate-800/70 rounded-lg p-3 border border-slate-700">
          <span className="text-slate-400 block text-xs mb-1">Revenue Potential</span>
          <span className="text-indigo-400 font-bold text-lg">₹{revenueM}M</span>
        </div>
        <div className="bg-slate-800/70 rounded-lg p-3 border border-slate-700">
          <span className="text-slate-400 block text-xs mb-1">Viewer Conversion</span>
          <span className="text-emerald-400 font-bold text-lg">{conversionPct}%</span>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 flex items-start gap-3">
        <span className="text-2xl">{strategy.icon || "📋"}</span>
        <div>
          <p className="text-xs text-slate-400 mb-0.5">Recommended Strategy</p>
          <p className={`font-semibold text-sm ${strategy.color || "text-white"}`}>{strategy.label || data.hybridStrategy?.recommendation}</p>
          <p className="text-xs text-slate-500 mt-1">
            Suggested streaming window: Week {data.hybridStrategy?.streamingWindowWeek}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StreamingStrategyPanel;
