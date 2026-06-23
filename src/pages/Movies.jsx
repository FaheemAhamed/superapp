import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import { SpinnerGap } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { fetchMoviesByCategory, fetchMovieDetails } from "@/services/movieApi";
import MovieCard from "@/components/MovieCard";
import MovieModal from "@/components/MovieModal";

export default function Movies() {
  const { activeUser, categories, setCategories, logout } = useStore();
  const [moviesByCat, setMoviesByCat] = useState({});
  const [loading, setLoading] = useState(true);
  
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);
  const [scale, setScale] = useState(1);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  // Enforce minimum 3 categories if empty
  useEffect(() => {
    if (activeUser && categories.length < 3) {
      setCategories(["Action", "Thriller", "Horror"]);
    }
  }, [activeUser, categories, setCategories]);

  // Fetch OMDB list for each category
  useEffect(() => {
    if (categories.length === 0) return;
    const fetchAll = async () => {
      setLoading(true);
      try {
        const results = await fetchMoviesByCategory(categories);
        setMoviesByCat(results);
      } catch (e) {
        console.error("Failed to fetch movies by category:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [categories]);

  // Fetch OMDB detailed API call for the clicked movie modal
  useEffect(() => {
    if (!selectedMovie) return;
    setMovieDetails(null);
    const fetchDetails = async () => {
      try {
        const details = await fetchMovieDetails(selectedMovie.imdbID);
        setMovieDetails(details);
      } catch (e) {
        console.error("Failed to fetch movie details:", e);
      }
    };
    fetchDetails();
  }, [selectedMovie]);

  // Screen scaling logic
  useEffect(() => {
    const handleResize = () => {
      const scaleX = window.innerWidth / 1728;
      const scaleY = window.innerHeight / 1117;
      setScale(Math.min(scaleX, 1));
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!activeUser) return null;

  const shownCategories = categories.filter(c => moviesByCat[c] && moviesByCat[c].length > 0);
  const rowHeight = 290;
  const canvasHeight = Math.max(1117, 300 + shownCategories.length * rowHeight + 100);

  return (
    <div className="w-full min-h-[100dvh] bg-black font-['Roboto'] relative">
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Single+Day&display=swap');`}
      </style>

      {/* ── MOBILE LAYOUT (hidden on md+) ── */}
      <div className="flex md:hidden flex-col gap-6 p-4 pb-24" style={{ background: "linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0.8) 100%)" }}>
        {/* Mobile Header */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-[#72DB73] text-2xl font-normal" style={{ fontFamily: "'Single Day', cursive" }}>Super app</span>
          <div className="relative">
            <img 
              src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(activeUser.username)}`}
              alt="Avatar"
              className="w-10 h-10 rounded-full border border-white/40 cursor-pointer"
              onClick={() => setShowDropdown(!showDropdown)}
            />
            <AnimatePresence>
              {showDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-44 bg-[#181d37] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50"
                >
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-sm text-white font-medium truncate">{activeUser.name}</p>
                  </div>
                  <button onClick={() => navigate('/dashboard')} className="w-full text-left px-4 py-3 text-white hover:bg-white/5 font-medium">← Dashboard</button>
                  <button onClick={() => { logout(); navigate("/login"); }} className="w-full text-left px-4 py-3 text-[#FF6A6A] hover:bg-white/5 font-medium border-t border-white/10">Log out</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <p className="text-white text-lg font-semibold">Entertainment for you</p>

        {loading ? (
          <div className="flex flex-col items-center py-20 gap-4">
            <SpinnerGap className="animate-spin text-[#72DB73]" size={48} />
            <p className="text-white font-medium">Loading...</p>
          </div>
        ) : (
          shownCategories.map((cat) => (
            <div key={cat} className="flex flex-col gap-3">
              <h2 className="text-[#878787] text-base font-semibold uppercase tracking-widest">{cat}</h2>
              <div className="grid grid-cols-2 gap-3">
                {moviesByCat[cat].map((m) => (
                  <MovieCard
                    key={m.imdbID}
                    movie={m}
                    variant="mobile"
                    onClick={() => setSelectedMovie(m)}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── DESKTOP LAYOUT (hidden on mobile) ── */}
      <div className="hidden md:flex justify-center overflow-x-hidden">
        {/* Main Canvas */}
        <div 
          className="relative shrink-0"
          style={{ 
            width: '1728px', 
            height: `${canvasHeight}px`,
            transform: `scale(${scale})`, 
            transformOrigin: "top center",
            background: "linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0.37) 100%)"
          }}
        >
          <div 
            className="absolute left-[52px] top-[26px] text-[#72DB73] text-[47.33px] font-normal leading-[139.69%]"
            style={{ fontFamily: "'Single Day', cursive" }}
          >
            Super app
          </div>

          <div className="absolute left-[1556px] top-[41px] z-30">
            <img 
              src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(activeUser.username)}`}
              alt="Avatar"
              className="w-[81px] h-[81px] rounded-full border-[1.4px] border-[#FFFCFC] cursor-pointer object-cover relative z-20"
              style={{ filter: "drop-shadow(0px 2.5px 2px rgba(0, 0, 0, 0.31))" }}
              onClick={() => setShowDropdown(!showDropdown)}
            />
            <AnimatePresence>
              {showDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-4 w-48 bg-[#181d37] border border-white/10 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden z-10"
                >
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-sm text-white font-medium truncate">{activeUser.name}</p>
                    <p className="text-xs text-[#878787] truncate">{activeUser.email}</p>
                  </div>
                  <button 
                    onClick={() => navigate("/dashboard")}
                    className="w-full text-left px-4 py-3 text-white hover:bg-white/5 font-medium transition-colors cursor-pointer"
                  >
                    Back to Dashboard
                  </button>
                  <button 
                    onClick={() => { logout(); navigate("/login"); }}
                    className="w-full text-left px-4 py-3 text-[#FF6A6A] hover:bg-white/5 font-medium transition-colors cursor-pointer border-t border-white/10"
                  >
                    Log out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="absolute left-[92px] top-[129px] w-[560px] h-[42px] text-white text-[30.42px] font-semibold leading-[139.69%] tracking-[0.02em]">
            Entertainment according to your choice
          </div>

          {loading ? (
            <div className="absolute left-[864px] top-[500px] -translate-x-1/2 flex flex-col items-center">
              <SpinnerGap className="animate-spin text-[#72DB73]" size={64} />
              <p className="text-white mt-4 text-2xl font-medium">Loading...</p>
            </div>
          ) : (
            shownCategories.map((cat, i) => {
              const titleTop = 198 + i * rowHeight;
              const imageTop = 267 + i * rowHeight;
              const cols = [92, 493, 894, 1295];
              
              return (
                <div key={cat}>
                  <div 
                    className="absolute text-[#878787] text-[30px] font-medium leading-[139.69%] tracking-[0.02em]"
                    style={{ left: '92px', top: `${titleTop}px` }}
                  >
                    {cat}
                  </div>
                  
                  {moviesByCat[cat].map((m, j) => (
                    <MovieCard
                      key={m.imdbID}
                      movie={m}
                      variant="desktop"
                      style={{ 
                        left: `${cols[j]}px`, 
                        top: `${imageTop}px`
                      }}
                      onClick={() => setSelectedMovie(m)}
                    />
                  ))}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Detail Modal Overlay */}
      <MovieModal
        isOpen={selectedMovie !== null}
        onClose={() => setSelectedMovie(null)}
        movie={selectedMovie}
        details={movieDetails}
      />
    </div>
  );
}
