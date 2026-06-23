import React from 'react';

export default function MovieCard({ movie, onClick, variant = "desktop", className, style }) {
  const poster = movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/400x600.png?text=No+Poster";

  if (variant === "mobile") {
    return (
      <div 
        className={`relative rounded-xl overflow-hidden cursor-pointer active:scale-95 transition-transform shadow-lg aspect-video ${className || ''}`}
        onClick={onClick}
        style={style}
      >
        <img src={poster} alt={movie.Title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-2">
          <p className="text-white font-semibold text-xs leading-tight line-clamp-2">{movie.Title}</p>
          <p className="text-[#878787] text-xs">{movie.Year}</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`absolute cursor-pointer hover:scale-105 transition-all duration-300 transform-gpu overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)] ${className || ''}`}
      style={{ 
        width: '342px',
        height: '192px',
        borderRadius: '10px',
        ...style
      }}
      onClick={onClick}
    >
      <img 
        src={poster} 
        alt={movie.Title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/70 opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <p className="text-white font-bold text-xl leading-tight line-clamp-2">{movie.Title}</p>
        <div className="flex items-center gap-1 mt-1 text-[#f1c75b] text-sm font-medium">
          <span>{movie.Year}</span>
        </div>
      </div>
    </div>
  );
}
