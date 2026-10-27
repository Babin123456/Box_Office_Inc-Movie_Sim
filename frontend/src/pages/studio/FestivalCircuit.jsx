import { useState, useEffect } from "react";
import api from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
  Award,
  Film,
  Plus,
  Sparkles,
  DollarSign,
  Star,
  Trophy,
  Trash2,
  CheckCircle2,
  Clock,
  Quote,
  Briefcase,
  Layers,
  ChevronRight,
} from "lucide-react";

const FESTIVAL_ROSTER = [
  {
    name: "CANNES",
    label: "Cannes Film Festival",
    fee: 500000,
    prestige: "A-List International",
    reward: "Palme d'Or / Grand Prix",
    location: "Cannes, France",
  },
  {
    name: "VENICE",
    label: "Venice International Film Festival",
    fee: 400000,
    prestige: "A-List International",
    reward: "Golden Lion / Grand Prix",
    location: "Venice Lido, Italy",
  },
  {
    name: "TIFF",
    label: "Toronto International Film Festival",
    fee: 300000,
    prestige: "Audience & Oscar Catalyst",
    reward: "People's Choice Award",
    location: "Toronto, Canada",
  },
  {
    name: "SUNDANCE",
    label: "Sundance Film Festival",
    fee: 250000,
    prestige: "Indie Premiere Vanguard",
    reward: "Grand Jury Prize",
    location: "Park City, Utah",
  },
];

const FestivalCircuit = () => {
  const [submissions, setSubmissions] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState("");
  const [selectedFestival, setSelectedFestival] = useState("CANNES");
  const [actionMessage, setActionMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signingDealId, setSigningDealId] = useState(null);

  const fetchSubmissionsAndMovies = async () => {
    try {
      setLoading(true);
      const [subsRes, moviesRes] = await Promise.allSettled([
        api.get("/festivals/active"),
        api.get("/movies/studio"),
      ]);

      if (subsRes.status === "fulfilled" && subsRes.value.data?.success) {
        setSubmissions(subsRes.value.data.data || []);
      }
      if (moviesRes.status === "fulfilled" && moviesRes.value.data?.data) {
        setMovies(moviesRes.value.data.data || []);
      }
    } catch (err) {
      console.error("Failed to load festival circuit data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissionsAndMovies();
  }, []);

  const handleSubmitToFestival = async (e) => {
    e.preventDefault();
    if (!selectedMovieId) return;

    try {
      setIsSubmitting(true);
      const res = await api.post("/festivals/submit", {
        movieId: selectedMovieId,
        festivalName: selectedFestival,
      });

      if (res.data?.success) {
        const sub = res.data.data;
        setActionMessage(
          `Official Premiere Concluded at ${sub.festivalName}! Result: ${sub.status} (Jury Score: ${sub.juryScore}/100) ${
            sub.awardWon !== "NONE" ? `• Award: ${sub.awardWon.replace(/_/g, " ")}` : ""
          }`
        );
        setShowModal(false);
        setSelectedMovieId("");
        await fetchSubmissionsAndMovies();
      }
    } catch (err) {
      setActionMessage(err.response?.data?.message || "Failed to submit film to festival.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWithdraw = async (submissionId) => {
    try {
      const res = await api.post("/festivals/withdraw", { submissionId });
      if (res.data?.success) {
        setActionMessage("Festival submission successfully withdrawn.");
        await fetchSubmissionsAndMovies();
      }
    } catch (err) {
      setActionMessage(err.response?.data?.message || "Failed to withdraw submission.");
    }
  };

  const handleAcceptDeal = async (submissionId, distributorName) => {
    try {
      setSigningDealId(`${submissionId}-${distributorName}`);
      const res = await api.post("/festivals/accept-distribution", {
        submissionId,
        distributorName,
      });

      if (res.data?.success) {
        setActionMessage(res.data.message);
        await fetchSubmissionsAndMovies();
      }
    } catch (err) {
      setActionMessage(err.response?.data?.message || "Failed to sign distribution contract.");
    } finally {
      setSigningDealId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
              <Award className="text-amber-400" size={36} /> Film Festival & Prestige Circuit
            </h1>
            <p className="text-slate-400 mt-2">
              Screen premiere films at Cannes, Venice, TIFF, and Sundance. Earn standing ovations, international awards, and ignite competitive distributor acquisition bidding.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="py-3 px-5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm inline-flex items-center gap-2 shadow-lg shadow-amber-900/30 transition"
          >
            <Plus size={18} /> Submit Film Entry
          </button>
        </div>

        {/* Festival Showcase Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FESTIVAL_ROSTER.map((fest) => (
            <div
              key={fest.name}
              className="bg-[#111827] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-amber-500/40 transition"
            >
              <div>
                <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase">{fest.prestige}</span>
                <h3 className="text-lg font-bold text-white mt-0.5">{fest.label}</h3>
                <p className="text-xs text-slate-400 mt-1">{fest.location}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-400">Entry: ₹{(fest.fee / 100000).toFixed(1)}L</span>
                <span className="text-amber-300 font-semibold">{fest.reward.split("/")[0]}</span>
              </div>
            </div>
          ))}
        </div>

        {actionMessage && (
          <div className="p-4 bg-amber-950/60 border border-amber-700/60 rounded-2xl text-amber-200 text-sm flex items-center justify-between shadow-lg">
            <span>{actionMessage}</span>
            <button onClick={() => setActionMessage("")} className="text-amber-400 hover:text-white font-bold text-xs ml-4">
              Dismiss
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center min-h-[40vh] text-slate-400 font-bold">
            Scanning festival jury results and distributor bids...
          </div>
        ) : submissions.length === 0 ? (
          <div className="bg-[#111827] border border-slate-800 rounded-3xl p-12 text-center space-y-4">
            <Trophy className="mx-auto text-amber-400" size={54} />
            <h2 className="text-2xl font-bold text-white">No Festival Submissions On Record</h2>
            <p className="text-slate-400 max-w-md mx-auto text-sm">
              Your studio has not submitted any projects to international festival circuits yet. Submitting critically acclaimed films unlocks major distributor acquisition offers, standing ovations, and critic hype bonuses.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="py-2.5 px-5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs inline-flex items-center gap-2"
            >
              <Plus size={16} /> Enter Festival Circuit
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {submissions.map((sub) => {
              const deliberation = sub.juryDeliberation || {};
              const pillars = deliberation.pillarScores || {};
              const bids = sub.distributionBids || [];
              const isAcquired = sub.status === "ACQUIRED" || Boolean(sub.acceptedDeal?.distributorName);

              return (
                <div
                  key={sub._id}
                  className="bg-[#111827] border border-slate-800 hover:border-slate-700 transition rounded-3xl p-6 sm:p-8 space-y-6"
                >
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">{sub.festivalName}</span>
                        {deliberation.standingOvationMinutes > 0 && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                            <Clock size={12} /> {deliberation.standingOvationMinutes} Min Standing Ovation
                          </span>
                        )}
                      </div>
                      <h2 className="text-2xl font-bold text-white mt-1">
                        {sub.movieId?.title || "Studio Feature"}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold ${
                          sub.status === "ACQUIRED"
                            ? "bg-purple-950 text-purple-300 border border-purple-700"
                            : sub.status === "AWARDED"
                            ? "bg-amber-950 text-amber-300 border border-amber-700"
                            : sub.status === "ACCEPTED"
                            ? "bg-emerald-950 text-emerald-300 border border-emerald-700"
                            : "bg-slate-800 text-slate-400 border border-slate-700"
                        }`}
                      >
                        {sub.status}
                      </span>
                    </div>
                  </div>

                  {/* Jury Deliberation Critique Quote */}
                  {deliberation.consensusQuote && (
                    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-start gap-3 text-slate-300">
                      <Quote className="text-amber-400 shrink-0 mt-0.5" size={20} />
                      <p className="text-sm italic font-serif leading-relaxed">
                        &ldquo;{deliberation.consensusQuote}&rdquo;
                      </p>
                    </div>
                  )}

                  {/* Deliberation Pillars Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                    <div>
                      <span className="text-[11px] text-slate-400 font-semibold block">Direction</span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full rounded-full" style={{ width: `${pillars.direction || 50}%` }} />
                        </div>
                        <span className="text-xs font-bold text-white">{pillars.direction || 50}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 font-semibold block">Screenplay</span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-blue-500 h-full rounded-full" style={{ width: `${pillars.screenplay || 50}%` }} />
                        </div>
                        <span className="text-xs font-bold text-white">{pillars.screenplay || 50}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 font-semibold block">Performances</span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${pillars.performances || 50}%` }} />
                        </div>
                        <span className="text-xs font-bold text-white">{pillars.performances || 50}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 font-semibold block">Thematic Depth</span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-purple-500 h-full rounded-full" style={{ width: `${pillars.thematicResonance || 50}%` }} />
                        </div>
                        <span className="text-xs font-bold text-white">{pillars.thematicResonance || 50}</span>
                      </div>
                    </div>
                  </div>

                  {/* Accolade & Score Overview */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                      <span className="text-[11px] text-slate-400 font-semibold block">Jury Score</span>
                      <span className="text-2xl font-black text-amber-400">{sub.juryScore}/100</span>
                    </div>
                    <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                      <span className="text-[11px] text-slate-400 font-semibold block">Festival Accolade</span>
                      <span className="text-lg font-black text-indigo-300">
                        {sub.awardWon !== "NONE" ? sub.awardWon.replace(/_/g, " ") : "Official Selection"}
                      </span>
                    </div>
                    <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                      <span className="text-[11px] text-slate-400 font-semibold block">Critic Hype Multiplier</span>
                      <span className="text-2xl font-black text-emerald-400">
                        {sub.criticHypeBoost ? `${sub.criticHypeBoost}x` : "1.0x"}
                      </span>
                    </div>
                  </div>

                  {/* Distributor Acquisition Contracts */}
                  <div className="border-t border-slate-800 pt-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                        <Briefcase size={16} className="text-amber-400" /> Distributor Acquisition Bidding
                      </h4>
                      {isAcquired && (
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 size={14} /> Deal Inked with {sub.acceptedDeal?.distributorName}
                        </span>
                      )}
                    </div>

                    {isAcquired ? (
                      <div className="bg-purple-950/40 border border-purple-800/60 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                          <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">Signed Acquisition Rights</span>
                          <h5 className="text-base font-bold text-white mt-0.5">{sub.acceptedDeal?.distributorName}</h5>
                          <p className="text-xs text-slate-400">
                            Worldwide distribution secured with an advance payment of ₹{(sub.acceptedDeal?.advancePayment / 100000).toFixed(1)} Lakhs.
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] text-slate-400 block font-semibold">Royalty Cut</span>
                          <span className="text-sm font-bold text-amber-300">{sub.acceptedDeal?.boxOfficeRoyaltyCut}% Box Office</span>
                        </div>
                      </div>
                    ) : bids.length === 0 ? (
                      <div className="text-xs text-slate-500 italic bg-slate-900/40 p-3 rounded-xl border border-slate-800/60">
                        No distributor acquisition offers available for this entry. Submissions scoring 65+ receive competing acquisition offers.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {bids.map((bid) => {
                          const isSigning = signingDealId === `${sub._id}-${bid.distributorName}`;
                          return (
                            <div
                              key={bid.distributorName}
                              className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 transition rounded-2xl p-4 flex flex-col justify-between space-y-3"
                            >
                              <div>
                                <span className="text-[11px] font-bold text-amber-400 block uppercase">{bid.territory}</span>
                                <h5 className="text-base font-bold text-white mt-0.5">{bid.distributorName}</h5>
                                <div className="mt-2 space-y-1 text-xs text-slate-300">
                                  <div className="flex justify-between">
                                    <span className="text-slate-400">Advance Offer:</span>
                                    <span className="font-bold text-emerald-400">₹{(bid.advancePayment / 100000).toFixed(1)} Lakhs</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-400">Royalty Cut:</span>
                                    <span className="font-semibold text-slate-200">{bid.boxOfficeRoyaltyCut}%</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-400">P&A Commitment:</span>
                                    <span className="font-semibold text-slate-200">₹{(bid.marketingCommitment / 100000).toFixed(1)}L</span>
                                  </div>
                                </div>
                              </div>

                              <button
                                onClick={() => handleAcceptDeal(sub._id, bid.distributorName)}
                                disabled={isSigning}
                                className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                              >
                                {isSigning ? "Signing Contract..." : "Inks Acquisition Deal"}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {sub.status === "SUBMITTED" && (
                    <button
                      onClick={() => handleWithdraw(sub._id)}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 transition flex items-center justify-center gap-1.5"
                    >
                      <Trash2 size={14} /> Withdraw Festival Entry
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Submission Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Award className="text-amber-400" size={24} /> Festival Entry Submission
                </h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white font-bold text-sm">
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitToFestival} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Select Film to Enter
                  </label>
                  <select
                    value={selectedMovieId}
                    onChange={(e) => setSelectedMovieId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500"
                    required
                  >
                    <option value="">-- Choose a Film --</option>
                    {movies.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Target Film Festival Circuit
                  </label>
                  <select
                    value={selectedFestival}
                    onChange={(e) => setSelectedFestival(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500"
                  >
                    {FESTIVAL_ROSTER.map((f) => (
                      <option key={f.name} value={f.name}>
                        {f.label} (Fee: ₹{(f.fee / 100000).toFixed(1)}L)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 px-4 rounded-xl text-sm font-bold bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !selectedMovieId}
                    className="flex-1 py-3 px-4 rounded-xl text-sm font-bold bg-amber-600 hover:bg-amber-500 text-white disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting..." : "Submit to Jury"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FestivalCircuit;
