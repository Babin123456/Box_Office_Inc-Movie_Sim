import { useCallback, useEffect, useState, useMemo } from "react";
import api from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Search, Filter, ArrowUpDown, Film } from "lucide-react";

const MovieLibrary = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("releaseWeekDesc");

  const fetchReleasedMovies = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/movies/released");
      setMovies(res.data.movies || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReleasedMovies();
  }, [fetchReleasedMovies]);

  const filteredAndSortedMovies = useMemo(() => {
    let result = movies.filter(m => m.title.toLowerCase().includes(search.toLowerCase()));

    switch(sortBy) {
        case "boxOfficeDesc": result.sort((a, b) => b.worldwideGross - a.worldwideGross); break;
        case "profitDesc": result.sort((a, b) => b.profit - a.profit); break;
        case "criticScoreDesc": result.sort((a, b) => b.criticScore - a.criticScore); break;
        case "audienceScoreDesc": result.sort((a, b) => b.audienceScore - a.audienceScore); break;
        case "releaseWeekDesc": result.sort((a, b) => b.releaseWeek - a.releaseWeek); break;
        default: break;
    }

    return result;
  }, [movies, search, sortBy]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-white">Movie Library</h1>
          <p className="text-slate-400 mt-2">Historical records of all your released productions.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                    type="text"
                    placeholder="Search movies..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-[#111827] border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-white outline-none focus:border-violet-600"
                />
            </div>
            <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#111827] border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-600"
            >
                <option value="releaseWeekDesc">Newest First</option>
                <option value="boxOfficeDesc">Highest Grossing</option>
                <option value="profitDesc">Most Profitable</option>
                <option value="criticScoreDesc">Highest Critic Score</option>
                <option value="audienceScoreDesc">Highest Audience Score</option>
            </select>
        </div>

        {loading ? (
          <div className="text-white text-center py-10">Loading library...</div>
        ) : filteredAndSortedMovies.length === 0 ? (
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
            No movies in the library.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 text-xs uppercase font-bold">
                  <th className="px-4 py-4">Movie</th>
                  <th className="px-4 py-4">Verdict</th>
                  <th className="px-4 py-4">Scores</th>
                  <th className="px-4 py-4">Box Office</th>
                  <th className="px-4 py-4">Profit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredAndSortedMovies.map((movie) => (
                  <tr key={movie._id} className="hover:bg-slate-800/30 transition">
                    <td className="px-4 py-4">
                        <div className="font-bold text-white">{movie.title}</div>
                        <div className="text-xs text-slate-500">Released Week {movie.releaseWeek}</div>
                    </td>
                    <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                            ["HIT", "BLOCKBUSTER", "LEGENDARY"].includes(movie.verdict) ? 'bg-green-500/20 text-green-500' :
                            ["FLOP", "DISASTER"].includes(movie.verdict) ? 'bg-red-500/20 text-red-500' : 'bg-slate-500/20 text-slate-400'
                        }`}>
                            {movie.verdict}
                        </span>
                    </td>
                    <td className="px-4 py-4">
                        <div className="flex gap-2 text-xs">
                            <span className="text-green-500 font-bold">C: {movie.criticScore}</span>
                            <span className="text-yellow-500 font-bold">A: {movie.audienceScore}</span>
                        </div>
                    </td>
                    <td className="px-4 py-4 text-white font-medium text-sm">
                        ₹{movie.worldwideGross?.toLocaleString()}
                    </td>
                    <td className={`px-4 py-4 font-bold text-sm ${movie.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        ₹{movie.profit?.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MovieLibrary;
