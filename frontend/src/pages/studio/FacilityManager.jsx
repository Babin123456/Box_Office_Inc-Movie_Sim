import React, { useState, useEffect } from "react";
import api from "../../api/apiClient";

const FacilityManager = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const res = await api.get("/facilities/list");
      if (res.data.success) {
        setFacilities(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load facilities", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRental = async (facilityId, isRented) => {
    try {
      const res = await api.post("/facilities/rental", {
        facilityId,
        isRentedToThirdParty: !isRented,
      });
      if (res.data.success) {
        fetchFacilities();
      }
    } catch (err) {
      console.error("Failed to toggle rental", err);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-2">Studio Facilities & Infrastructure</h1>
      <p className="text-gray-400 mb-6">Manage studio real estate, soundstages, LED virtual production stages, and third-party rentals.</p>

      {loading ? (
        <div className="text-gray-400">Loading studio facility assets...</div>
      ) : facilities.length === 0 ? (
        <div className="bg-gray-800 p-8 rounded-xl text-center border border-gray-700">
          <p className="text-gray-400">No physical facility assets constructed yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {facilities.map((f) => (
            <div key={f._id} className="bg-gray-800 p-5 rounded-xl border border-gray-700">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-lg text-white">{f.facilityType.replace(/_/g, " ")}</h3>
                <span className="text-xs bg-emerald-900 text-emerald-300 font-bold px-2.5 py-1 rounded">
                  TIER {f.tierLevel}
                </span>
              </div>
              <div className="text-sm space-y-1 text-gray-300 mb-4">
                <p>Quality Boost: <span className="text-green-400 font-semibold">+{f.qualityBoost} pts</span></p>
                <p>Weekly Maintenance: <span className="text-red-400 font-semibold">${f.maintenanceCostPerWeek?.toLocaleString()}</span></p>
                <p>Rental Yield: <span className="text-yellow-400 font-semibold">${f.rentalIncomePerWeek?.toLocaleString()}/wk</span></p>
              </div>
              <button
                onClick={() => handleToggleRental(f._id, f.isRentedToThirdParty)}
                className={`w-full py-2 rounded text-sm font-semibold transition ${f.isRentedToThirdParty ? "bg-amber-600 hover:bg-amber-500 text-white" : "bg-emerald-600 hover:bg-emerald-500 text-white"}`}
              >
                {f.isRentedToThirdParty ? "Stop Rental (Use In-House)" : "Lease Out to Third-Party"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FacilityManager;
