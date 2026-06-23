import React from 'react';
import { X, Star, SpinnerGap } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

export default function MovieModal({ isOpen, onClose, movie, details }) {
  return (
    <AnimatePresence>
      {isOpen && movie && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4 md:p-10 perspective-[1000px]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
            onClick={onClose}
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
                src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/400x600.png?text=No+Poster"} 
                alt="" 
                className="w-full h-full object-contain md:object-cover" 
              />
            </div>
            
            <div className="p-8 md:p-12 relative flex-1 flex flex-col justify-center font-sans min-h-[400px]">
              <button
                onClick={onClose}
                className="absolute top-6 right-6 text-white/50 hover:text-white bg-white/5 rounded-full p-2 transition-colors hover:rotate-90 hover:scale-110 transform"
              >
                <X weight="bold" size={20} />
              </button>
              
              <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-white">{movie.Title}</h3>
              
              {!details ? (
                 <div className="flex items-center mt-6 text-[#72DB73] font-medium gap-2">
                   <SpinnerGap className="animate-spin" size={24} /> Fetching Details...
                 </div>
              ) : (
                <>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-[#878787] mt-4 font-medium">
                    <span className="bg-white/10 text-white px-3 py-1 rounded-full text-xs">{details.Year}</span>
                    <span>{details.Runtime}</span>
                    <span className="border border-[#878787] px-2 py-0.5 rounded text-xs">{details.Rated}</span>
                    <div className="flex items-center gap-1 text-[#f1c75b]">
                      <Star weight="fill" size={14} />
                      <span className="text-white/90">{details.imdbRating}</span>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <span className="inline-block text-xs font-bold text-[#72DB73] tracking-wider uppercase mb-3">
                      {details.Genre}
                    </span>
                    <p className="text-base md:text-lg text-[#d9d9d9] leading-relaxed max-w-prose line-clamp-4">
                      {details.Plot}
                    </p>
                    <div className="mt-8 pt-6 border-t border-white/10">
                      <p className="text-sm font-medium text-[#878787]">
                        <span className="text-white/60 uppercase tracking-widest text-xs block mb-1">Director</span> 
                        {details.Director}
                      </p>
                      <p className="text-sm font-medium text-[#878787] mt-3">
                        <span className="text-white/60 uppercase tracking-widest text-xs block mb-1">Starring</span> 
                        {details.Actors}
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
  );
}
