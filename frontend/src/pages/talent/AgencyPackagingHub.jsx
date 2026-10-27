import React, { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../api/axios";
import {
  Briefcase,
  Award,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Percent,
  Clock,
  Layers,
  ShieldCheck,
} from "lucide-react";

const formatCurrency = (val) => {
  if (!val) return "$0";
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(2)}M`;
  if (val >= 1_000) return `$${(val / 1_000).toFixed(0)}k`;
  return `$${val.toLocaleString()}`;
};

const AgencyPackagingHub = () => {
  const [agencies, setAgencies] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("PACKAGES");
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [signing, setSigning] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [agenciesRes, packagesRes] = await Promise.all([
        api.get("/talent-agencies/agencies"),
        api.get("/talent-agencies/available-packages"),
      ]);

      if (agenciesRes.data?.success) {
        setAgencies(agenciesRes.data.data || []);
      }
      if (packagesRes.data?.success) {
        setPackages(packagesRes.data.data || []);
      }
    } catch (err) {
      console.error("Failed to load talent agency packaging data", err);
      setFeedback({
        type: "error",
        message: err.response?.data?.message || "Failed to connect to agency network.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSignPackage = async (pkg) => {
    try {
      setSigning(true);
      setFeedback(null);

      const res = await api.post("/talent-agencies/package", {
        agencyName: pkg.agencyName,
        packageValue: pkg.packageValue,
        talentCount: pkg.talentCount,
      });

      if (res.data?.success) {
        setFeedback({
          type: "success",
          message: `${res.data.message}! Discount saved ${res.data.data?.discountInfo?.discountPercentage}% on talent packaging fees.`,
        });
        setSelectedPackage(null);
        await fetchData();
      }
    } catch (err) {
      setFeedback({
        type: "error",
        message: err.response?.data?.message || "Failed to execute package signing.",
      });
    } finally {
      setSigning(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-violet-900/60 via-slate-900 to-indigo-950/60 p-6 rounded-2xl border border-violet-800/40 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-violet-400 font-semibold text-xs uppercase tracking-wider mb-1">
              <Briefcase size={16} />
              Hollywood Executive Talent Packaging
            </div>
            <h1 className="text-3xl font-black text-white">Talent Agency Representation Hub</h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Partner with the Big Four Hollywood talent agencies (CAA, WME, UTA, Gersh) to secure pre-packaged star talent combinations with negotiated bundle discounts and cross-talent production synergies.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("PACKAGES")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "PACKAGES"
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Available Packages ({packages.length})
            </button>
            <button
              onClick={() => setActiveTab("AGENCIES")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "AGENCIES"
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Agency Standings ({agencies.length})
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-sm transition-all ${
              feedback.type === "success"
                ? "bg-emerald-950/60 border-emerald-800 text-emerald-200"
                : "bg-rose-950/60 border-rose-800 text-rose-200"
            }`}
          >
            <div className="flex items-center gap-2">
              {feedback.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span>{feedback.message}</span>
            </div>
            <button
              onClick={() => setFeedback(null)}
              className="text-xs opacity-70 hover:opacity-100 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center text-slate-400 animate-pulse">
            Loading agency network contracts & package catalogs...
          </div>
        ) : activeTab === "PACKAGES" ? (
          /* Package Deals Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-violet-700/60 transition-all rounded-2xl p-6 shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-violet-950/80 border border-violet-800 text-violet-300">
                      {pkg.agencyName}
                    </span>
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                      Save {pkg.discountPercentage || 10}%
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{pkg.title}</h3>
                  <p className="text-sm text-slate-400 mb-4">{pkg.description}</p>

                  {/* Synergy Perks */}
                  <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 space-y-2 mb-4">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles size={14} className="text-amber-400" />
                      Package Synergy Bonuses
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                        <span className="block text-[10px] text-slate-400">Opening Hype</span>
                        <span className="text-sm font-bold text-amber-400">
                          +{pkg.synergyBonus?.hypeBoost}%
                        </span>
                      </div>
                      <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                        <span className="block text-[10px] text-slate-400">Production Quality</span>
                        <span className="text-sm font-bold text-indigo-400">
                          +{pkg.synergyBonus?.qualityBoost} pts
                        </span>
                      </div>
                      <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                        <span className="block text-[10px] text-slate-400">Cost Efficiency</span>
                        <span className="text-sm font-bold text-emerald-400">
                          {Math.round((pkg.synergyBonus?.budgetEfficiency || 0.1) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 block line-through">
                      Standard: {formatCurrency(pkg.packageValue)}
                    </span>
                    <span className="text-lg font-black text-white">
                      {formatCurrency(pkg.finalPrice || pkg.packageValue * 0.9)}
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedPackage(pkg)}
                    className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    Negotiate Deal
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Agency Standings Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {agencies.map((agency) => (
              <div
                key={agency._id || agency.agencyName}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-extrabold text-lg text-white">{agency.agencyName}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{agency.specialty}</p>
                  </div>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                      agency.tier === "PREFERRED"
                        ? "bg-purple-950 text-purple-300 border border-purple-800"
                        : "bg-slate-800 text-slate-300 border border-slate-700"
                    }`}
                  >
                    {agency.tier} Partner
                  </span>
                </div>

                {/* Relationship Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium text-slate-300">
                    <span>Agency Standing</span>
                    <span className="text-violet-400 font-bold">{agency.relationshipScore} / 100</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-violet-600 to-indigo-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${agency.relationshipScore}%` }}
                    />
                  </div>
                </div>

                {/* Perk & Stats */}
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <ShieldCheck size={14} className="text-violet-400" />
                    <span>Special Perk: <strong className="text-white">{agency.perk}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Layers size={14} className="text-emerald-400" />
                    <span>Packages Executed: <strong className="text-emerald-400">{agency.packagedDealsCount}</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Confirmation Modal */}
        {selectedPackage && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <h3 className="text-xl font-bold text-white">Execute Agency Package Deal</h3>
              <p className="text-sm text-slate-400">
                You are negotiating the <strong className="text-white">{selectedPackage.title}</strong> with{" "}
                <strong className="text-violet-400">{selectedPackage.agencyName}</strong>.
              </p>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>List Package Value:</span>
                  <span>{formatCurrency(selectedPackage.packageValue)}</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Agency Discount:</span>
                  <span>-{selectedPackage.discountPercentage || 10}%</span>
                </div>
                <div className="border-t border-slate-800 pt-2 flex justify-between text-white font-bold text-base">
                  <span>Total Payable:</span>
                  <span className="text-emerald-400">
                    {formatCurrency(selectedPackage.finalPrice || selectedPackage.packageValue * 0.9)}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPackage(null)}
                  disabled={signing}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSignPackage(selectedPackage)}
                  disabled={signing}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white cursor-pointer shadow-lg shadow-violet-600/30"
                >
                  {signing ? "Signing Deal..." : "Confirm & Sign Deal"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AgencyPackagingHub;
