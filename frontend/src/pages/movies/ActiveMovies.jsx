import { useCallback, useEffect, useState } from "react";
import api from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Film, Plus, Play, Info } from "lucide-react";
import { Link } from "react-router-dom";

const ActiveMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMovies = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/movies/active");
      setMovies(res.data.movies || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white">Active Productions</h1>
            <p className="text-slate-400 mt-2">Manage your movies currently in development and production.</p>
          </div>
          <Link
            to="/movies/create"
            className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition"
          >
            <Plus size={20} /> New Movie
          </Link>
        </div>

        {loading ? (
          <div className="text-white text-center py-10">Loading active movies...</div>
        ) : movies.length === 0 ? (
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-12 text-center">
            <Film size={48} className="text-slate-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">No Active Movies</h2>
            <p className="text-slate-400 mb-6">Start your first production to begin your journey.</p>
            <Link to="/movies/create" className="text-violet-500 font-bold hover:underline">Start a Production →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {movies.map((movie) => (
              <div key={movie._id} className="bg-[#111827] border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center">
                <div className="w-full md:w-32 h-48 bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 shrink-0 border border-slate-700">
                  <Film size={32} />
                </div>

                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold text-white">{movie.title}</h3>
                      <span className="text-sm text-violet-400 font-medium">{movie.status.replace('_', ' ')}</span>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-slate-400">Quality</div>
                        <div className="text-xl font-bold text-white">{movie.quality}</div>
                    </div>
                  </div>

                  <div className="w-full bg-slate-800 rounded-full h-2.5">
                    <div
                      className="bg-violet-600 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${movie.productionProgress}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between text-sm text-slate-400">
                    <span>Progress: {movie.productionProgress}%</span>
                    <span>Hype: {movie.hype}</span>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <div className="text-slate-400 text-xs font-bold uppercase tracking-wider italic">
                        {movie.remainingWeeks} Weeks Remaining
                    </div>
                    <div className="flex gap-3">
                        <Link
                        to={`/movies/${movie._id}`}
                        className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition"
                        >
                        <Info size={16} /> Details
                        </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ActiveMovies;
