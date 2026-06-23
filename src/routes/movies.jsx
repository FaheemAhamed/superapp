import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import { X, Star, SpinnerGap } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

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
      let apiKeyUrl = import.meta.env.VITE_OMDB_API_KEY || "";
      let apiKey = "622e6ff1"; 
      const match = apiKeyUrl.match(/apikey=([^&"]+)/);
      if (match) apiKey = match[1];

      const results = {};
      for (const cat of categories) {
        try {
          // Fetch movies matching the category
          const res = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(cat)}&type=movie&apikey=${apiKey}`);
          const data = await res.json();
          if (data.Search) {
            results[cat] = data.Search.slice(0, 4); // Only need 4 per row
          }
        } catch (e) {
          console.error(`Failed to fetch OMDB for ${cat}`, e);
        }
      }
      setMoviesByCat(results);
      setLoading(false);
    };
    fetchAll();
  }, [categories]);

  // Fetch OMDB detailed API call for the clicked movie modal
  useEffect(() => {
    if (!selectedMovie) return;
    setMovieDetails(null);
    let apiKeyUrl = import.meta.env.VITE_OMDB_API_KEY || "";
    let apiKey = "622e6ff1"; 
    const match = apiKeyUrl.match(/apikey=([^&"]+)/);
    if (match) apiKey = match[1];

    fetch(`https://www.omdbapi.com/?i=${selectedMovie.imdbID}&apikey=${apiKey}`)
      .then(r => r.json())
      .then(data => setMovieDetails(data))
      .catch(console.error);
  }, [selectedMovie]);

  // Screen scaling logic
  useEffect(() => {
    const handleResize = () => {
      const scaleX = window.innerWidth / 1728;
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
                {moviesByCat[cat].map((m) => {
                  const poster = m.Poster !== "N/A" ? m.Poster : "https://via.placeholder.com/400x600.png?text=No+Poster";
                  return (
                    <div 
                      key={m.imdbID}
                      className="relative rounded-xl overflow-hidden cursor-pointer active:scale-95 transition-transform shadow-lg aspect-video"
                      onClick={() => setSelectedMovie(m)}
                    >
                      <img src={poster} alt={m.Title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-2">
                        <p className="text-white font-semibold text-xs leading-tight line-clamp-2">{m.Title}</p>
                        <p className="text-[#878787] text-xs">{m.Year}</p>
                      </div>
                    </div>
                  );
                })}
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
                  
                  {moviesByCat[cat].map((m, j) => {
                    const poster = m.Poster !== "N/A" ? m.Poster : "https://via.placeholder.com/400x600.png?text=No+Poster";
                    return (
                      <div 
                        key={m.imdbID}
                        className="absolute cursor-pointer hover:scale-105 transition-all duration-300 transform-gpu overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
                        style={{ 
                          left: `${cols[j]}px`, 
                          top: `${imageTop}px`,
                          width: '342px',
                          height: '192px',
                          borderRadius: '10px'
                        }}
                        onClick={() => setSelectedMovie(m)}
                      >
                        <img 
                          src={poster} 
                          alt={m.Title}
                          className="w-full h-full object-cover"
                        />
                        {/* Subtle overlay for the title on hover to make it usable */}
                      <div className="absolute inset-0 bg-black/70 opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                        <p className="text-white font-bold text-xl leading-tight line-clamp-2">{m.Title}</p>
                        <div className="flex items-center gap-1 mt-1 text-[#f1c75b] text-sm font-medium">
                          <span>{m.Year}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })
        )}
      </div>
    </div>

      {/* Detail Modal Overlay */}
      <AnimatePresence>
        {selectedMovie && (
          <div className="fixed inset-0 z-50 grid place-items-center p-4 md:p-10 perspective-[1000px]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
              onClick={() => setSelectedMovie(null)}
            />
            
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#181d37] border border-white/10 shadow-[0_40px_100px_-20px_rgba(0,0,0,1)] rounded-3xl max-w-4xl w-full overflow-hidden flex flex-col md:flex-row relative z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full md:w-[350px] shrink-0 relative h-64 md:h-auto bg-black">
                <img 
                  src={selectedMovie.Poster !== "N/A" ? selectedMovie.Poster : "https://via.placeholder.com/400x600.png?text=No+Poster"} 
                  alt="" 
                  className="w-full h-full object-contain md:object-cover" 
                />
              </div>
              
              <div className="p-8 md:p-12 relative flex-1 flex flex-col justify-center font-sans min-h-[400px]">
                <button
                  onClick={() => setSelectedMovie(null)}
                  className="absolute top-6 right-6 text-white/50 hover:text-white bg-white/5 rounded-full p-2 transition-colors hover:rotate-90 hover:scale-110 transform"
                >
                  <X weight="bold" size={20} />
                </button>
                
                <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-white">{selectedMovie.Title}</h3>
                
                {!movieDetails ? (
                   <div className="flex items-center mt-6 text-[#72DB73] font-medium gap-2">
                     <SpinnerGap className="animate-spin" size={24} /> Fetching Details...
                   </div>
                ) : (
                  <>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-[#878787] mt-4 font-medium">
                      <span className="bg-white/10 text-white px-3 py-1 rounded-full text-xs">{movieDetails.Year}</span>
                      <span>{movieDetails.Runtime}</span>
                      <span className="border border-[#878787] px-2 py-0.5 rounded text-xs">{movieDetails.Rated}</span>
                      <div className="flex items-center gap-1 text-[#f1c75b]">
                        <Star weight="fill" size={14} />
                        <span className="text-white/90">{movieDetails.imdbRating}</span>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <span className="inline-block text-xs font-bold text-[#72DB73] tracking-wider uppercase mb-3">
                        {movieDetails.Genre}
                      </span>
                      <p className="text-base md:text-lg text-[#d9d9d9] leading-relaxed max-w-prose line-clamp-4">
                        {movieDetails.Plot}
                      </p>
                      <div className="mt-8 pt-6 border-t border-white/10">
                        <p className="text-sm font-medium text-[#878787]">
                          <span className="text-white/60 uppercase tracking-widest text-xs block mb-1">Director</span> 
                          {movieDetails.Director}
                        </p>
                        <p className="text-sm font-medium text-[#878787] mt-3">
                          <span className="text-white/60 uppercase tracking-widest text-xs block mb-1">Starring</span> 
                          {movieDetails.Actors}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
