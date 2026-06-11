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
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Active Productions</h1>
            <p className="text-slate-400 mt-1 text-sm sm:text-base">Manage your movies currently in development and production.</p>
          </div>
          <Link
            to="/movies/create"
            className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition self-start sm:self-auto w-full sm:w-auto cursor-pointer"
          >
            <Plus size={20} /> New Movie
          </Link>
        </div>

        {loading ? (
          <div className="text-white text-center py-10">Loading active movies...</div>
        ) : movies.length === 0 ? (
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-8 sm:p-12 text-center">
            <Film size={48} className="text-slate-600 mx-auto mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">No Active Movies</h2>
            <p className="text-slate-400 mb-6 text-sm sm:text-base">Start your first production to begin your journey.</p>
            <Link to="/movies/create" className="text-violet-500 font-bold hover:underline">Start a Production →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {movies.map((movie) => (
              <div key={movie._id} className="bg-[#111827] border border-slate-800 rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row gap-6 items-center">
                <div className="w-full md:w-32 h-32 md:h-48 bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 shrink-0 border border-slate-700">
                  <Film size={32} />
                </div>

                <div className="flex-1 space-y-4 w-full">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="text-lg sm:text-2xl font-bold text-white line-clamp-1">{movie.title}</h3>
                      <span className="text-xs sm:text-sm text-violet-400 font-medium uppercase tracking-wider">{movie.status.replace('_', ' ')}</span>
                    </div>
                    <div className="text-right shrink-0">
                        <div className="text-xs text-slate-400">Quality</div>
                        <div className="text-lg sm:text-xl font-bold text-white">{movie.quality}</div>
                    </div>
                  </div>

                  <div className="w-full bg-slate-800 rounded-full h-2.5">
                    <div
                      className="bg-violet-600 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${movie.productionProgress}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between text-xs sm:text-sm text-slate-400">
                    <span>Progress: {movie.productionProgress}%</span>
                    <span>Hype: {movie.hype}</span>
                  </div>

                  <div className="flex justify-between items-center pt-2 gap-4">
                    <div className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider italic">
                        {movie.remainingWeeks} Weeks Remaining
                    </div>
                    <div className="flex gap-3">
                        <Link
                        to={`/movies/${movie._id}`}
                        className="bg-slate-800 hover:bg-slate-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 transition cursor-pointer"
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
