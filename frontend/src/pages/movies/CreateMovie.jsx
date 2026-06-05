import { useState, useEffect, useCallback } from "react";
import api from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { Film, Users, PenTool, Briefcase, IndianRupee } from "lucide-react";

const CreateMovie = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [scripts, setScripts] = useState([]);
  const [directors, setDirectors] = useState([]);
  const [actors, setActors] = useState([]);
  const [crewTeams, setCrewTeams] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    scriptId: "",
    directorId: "",
    leadActorId: "",
    crewTeamId: "",
    marketingBudget: 0
  });

  const loadData = useCallback(async () => {
    try {
      const [sRes, dRes, aRes, cRes] = await Promise.all([
        api.get("/scripts/owned"),
        api.get("/directors/owned"),
        api.get("/actors/owned"),
        api.get("/crew/owned")
      ]);
      setScripts(sRes.data.scripts.filter(s => s.status === "AVAILABLE"));
      setDirectors(dRes.data.directors.filter(d => d.status === "AVAILABLE"));
      setActors(aRes.data.actors.filter(a => a.status === "AVAILABLE"));
      setCrewTeams(cRes.data.crewTeams.filter(c => c.status === "AVAILABLE"));
    } catch (error) {
      console.error("Failed to load movie creation data", error);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post("/movies", formData);
      alert("Movie production started!");
      navigate("/movies");
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to start production");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-white">Start New Production</h1>
          <p className="text-slate-400 mt-2">Assemble your dream team and create the next blockbuster.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-[#111827] border border-slate-800 rounded-3xl p-8 space-y-6">
            <div>
              <label className="block text-slate-300 mb-2 font-semibold">Movie Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-600"
                placeholder="Enter movie title..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-slate-300 mb-2 font-semibold flex items-center gap-2">
                  <Film size={18} className="text-violet-500" /> Select Script
                </label>
                <select
                  required
                  value={formData.scriptId}
                  onChange={(e) => setFormData({ ...formData, scriptId: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-600"
                >
                  <option value="">Select a script</option>
                  {scripts.map(s => (
                    <option key={s.id} value={s.id}>{s.title} ({s.rarity})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-2 font-semibold flex items-center gap-2">
                  <PenTool size={18} className="text-violet-500" /> Select Director
                </label>
                <select
                  required
                  value={formData.directorId}
                  onChange={(e) => setFormData({ ...formData, directorId: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-600"
                >
                  <option value="">Select a director</option>
                  {directors.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.rarity})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-2 font-semibold flex items-center gap-2">
                  <Users size={18} className="text-violet-500" /> Lead Actor
                </label>
                <select
                  required
                  value={formData.leadActorId}
                  onChange={(e) => setFormData({ ...formData, leadActorId: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-600"
                >
                  <option value="">Select an actor</option>
                  {actors.map(a => (
                    <option key={a.id} value={a.id}>{a.name} ({a.rarity})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-2 font-semibold flex items-center gap-2">
                  <Briefcase size={18} className="text-violet-500" /> Crew Team
                </label>
                <select
                  required
                  value={formData.crewTeamId}
                  onChange={(e) => setFormData({ ...formData, crewTeamId: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-600"
                >
                  <option value="">Select a crew team</option>
                  {crewTeams.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.rarity})</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-2 font-semibold flex items-center gap-2">
                <IndianRupee size={18} className="text-violet-500" /> Marketing Budget
              </label>
              <input
                type="number"
                value={formData.marketingBudget}
                onChange={(e) => setFormData({ ...formData, marketingBudget: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-600"
                placeholder="Enter marketing budget..."
              />
              <p className="text-xs text-slate-500 mt-1">Increasing marketing budget boosts initial hype.</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white py-4 rounded-2xl font-bold text-lg transition disabled:bg-slate-700"
          >
            {loading ? "Starting Production..." : "Start Production"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateMovie;
