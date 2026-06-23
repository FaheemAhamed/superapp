import React from 'react';

export default function CategoryCard({ cat, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{ backgroundColor: cat.bg }}
      className={`relative rounded-[14px] md:rounded-[20px] p-3 md:p-4 lg:p-5 text-left w-full aspect-square flex flex-col justify-between transition-all ${
        selected ? "border-[4px] md:border-[5px] border-[#11b800]" : "border-[4px] md:border-[5px] border-transparent"
      }`}
    >
      <div className="font-bold text-white text-xs sm:text-sm md:text-lg lg:text-xl xl:text-2xl z-10 tracking-wide leading-none">{cat.name}</div>
      <div className="rounded-[8px] md:rounded-[10px] overflow-hidden w-full h-[55px] sm:h-[65px] md:h-[80px] lg:h-[100px] mt-auto">
        <img src={cat.img} alt={cat.name} className="w-full h-full object-cover" />
      </div>
    </button>
  );
}
