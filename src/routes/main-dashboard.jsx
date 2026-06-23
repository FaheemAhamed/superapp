import ProfileWidget from "@/components/widgets/ProfileWidget";
import WeatherWidget from "@/components/widgets/WeatherWidget";
import NewsWidget from "@/components/widgets/NewsWidget";
import TimerWidget from "@/components/widgets/TimerWidget";
import NotesWidget from "@/components/widgets/NotesWidget";
import ScaleToFit from "@/components/ScaleToFit";
import { useStore } from "@/store/useStore";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MainDashboard() {
  const [scale, setScale] = useState(1);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { categories, activeUser, logout } = useStore();

  // Compute ProfileWidget's true native height based on category count
  const numCategories = categories?.length || 4;
  const catRows = Math.ceil(numCategories / 2);
  const profileNativeHeight = Math.max(561.24, 325.48 + catRows * (61.58 + 21.11) + 40);

  useEffect(() => {
    const handleResize = () => {
      const scaleX = window.innerWidth / 1728;
      const scaleY = window.innerHeight / 1117;
      setScale(Math.min(scaleX, scaleY));
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-[100dvh] w-full bg-[#000000] font-sans">

      {/* ── MOBILE LAYOUT (hidden on md+) ── */}
      <div className="flex md:hidden flex-col gap-4 p-4 pb-6 overflow-x-hidden">
        {/* Mobile Header */}
        <div className="flex items-center justify-between pt-2">
          <h1 className="text-[#72DB73] text-3xl font-bold" style={{ fontFamily: "'Single Day', cursive" }}>Super app</h1>
          <div className="relative">
            <img
              src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(activeUser?.username || 'user')}`}
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
                    <p className="text-sm text-white font-medium truncate">{activeUser?.name}</p>
                  </div>
                  <button onClick={() => navigate('/movies')} className="w-full text-left px-4 py-3 text-white hover:bg-white/5 font-medium">Browse Movies</button>
                  <button onClick={() => { logout(); navigate('/login'); }} className="w-full text-left px-4 py-3 text-[#FF6A6A] hover:bg-white/5 font-medium border-t border-white/10">Log out</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <ScaleToFit nativeWidth={892} nativeHeight={profileNativeHeight}>
          <ProfileWidget />
        </ScaleToFit>

        <ScaleToFit nativeWidth={470} nativeHeight={535}>
          <NotesWidget />
        </ScaleToFit>

        <ScaleToFit nativeWidth={1038} nativeHeight={333}>
          <TimerWidget />
        </ScaleToFit>

        <ScaleToFit nativeWidth={892} nativeHeight={311}>
          <WeatherWidget />
        </ScaleToFit>

        <ScaleToFit nativeWidth={463} nativeHeight={907}>
          <NewsWidget />
        </ScaleToFit>

        {/* End of content navigation */}
        <div className="flex justify-center mt-4 pb-4">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="text-[#72DB73] font-semibold text-lg hover:underline transition-colors"
          >
            Minimize
          </button>
        </div>
      </div>

      {/* ── DESKTOP LAYOUT (hidden on mobile) ── */}
      <div className="hidden md:flex h-[100dvh] w-full items-center justify-center overflow-hidden relative">
        <div 
          className="w-[1728px] h-[1117px] relative shrink-0"
          style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}
        >
          <div className="absolute left-[94px] top-[96px]" style={{ transform: 'scale(0.568385)', transformOrigin: 'top left' }}>
            <ProfileWidget />
          </div>
          <div className="absolute left-[94px] top-[454px]" style={{ transform: 'scale(0.568385)', transformOrigin: 'top left' }}>
            <WeatherWidget />
          </div>
          <div className="absolute left-[662px] top-[96px]">
            <NotesWidget />
          </div>
          <div className="absolute left-[1200px] top-[96px]">
            <NewsWidget />
          </div>
          <div className="absolute left-[94px] top-[670px]">
            <TimerWidget />
          </div>
          
          {/* Browse Button */}
          <button 
            onClick={() => navigate('/movies')}
            className="absolute left-[1436px] top-[1031px] w-[220px] h-[50.12px] bg-[#148A08] rounded-[34.78px] text-white font-medium text-[20px] tracking-[0.02em] leading-[92.2%] text-center flex items-center justify-center hover:bg-[#117607] transition-colors whitespace-nowrap"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Browse Movies
          </button>
        </div>

        <button 
          onClick={() => navigate('/dashboard')}
          className="absolute top-10 right-10 text-white/70 hover:text-white font-medium text-lg transition-colors z-50 underline underline-offset-4"
        >
          Minimize Dashboard
        </button>
      </div>

    </div>
  );
}
