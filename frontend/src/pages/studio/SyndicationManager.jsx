import React, { useState, useEffect } from "react";
import api from "../../api/apiClient";

const SyndicationManager = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const res = await api.get("/syndication/deals");
      if (res.data.success) {
        setDeals(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load syndication deals", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-2">Television & Syndication Licensing</h1>
      <p className="text-gray-400 mb-6">Manage TV broadcast networks and syndication royalty agreements for catalog movies.</p>

      {loading ? (
        <div className="text-gray-400">Loading active licensing deals...</div>
      ) : deals.length === 0 ? (
        <div className="bg-gray-800 p-8 rounded-xl text-center border border-gray-700">
          <p className="text-gray-400">No active syndication deals negotiated yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {deals.map((deal) => (
            <div key={deal._id} className="bg-gray-800 p-5 rounded-xl border border-gray-700">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg text-white">{deal.networkName}</h3>
                  <span className="text-xs bg-indigo-900 text-indigo-300 px-2 py-0.5 rounded uppercase font-semibold">
                    {deal.dealType}
                  </span>
                </div>
                <span className={`text-xs px-2 py-1 rounded font-bold ${deal.status === "ACTIVE" ? "bg-green-900 text-green-300" : "bg-gray-700 text-gray-400"}`}>
                  {deal.status}
                </span>
              </div>
              <div className="text-sm space-y-1 text-gray-300">
                <p>Upfront Bonus: <span className="text-green-400 font-semibold">${deal.upfrontBonus?.toLocaleString()}</span></p>
                <p>Weekly Royalty: <span className="text-green-400 font-semibold">${deal.weeklyRoyalty?.toLocaleString()}/wk</span></p>
                <p>Weeks Remaining: <span className="text-yellow-400 font-semibold">{deal.weeksRemaining} / {deal.totalWeeksDuration}</span></p>
                <p>Total Collected: <span className="text-indigo-400 font-semibold">${deal.totalPayoutCollected?.toLocaleString()}</span></p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SyndicationManager;
