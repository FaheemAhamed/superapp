import React from 'react';

export default function CategoryCard({ cat, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{ backgroundColor: cat.bg }}
      className={`relative rounded-[14px] md:rounded-[20px] p-3 md:p-[20px] text-left w-full aspect-square md:aspect-[250/251] flex flex-col justify-between transition-all ${
        selected ? "border-[4px] md:border-[6px] border-[#11b800]" : "border-[4px] md:border-[6px] border-transparent"
      }`}
    >
      <div className="font-bold text-white text-sm md:text-[28px] z-10 tracking-wide leading-none">{cat.name}</div>
      <div className="rounded-[8px] md:rounded-[11.66px] overflow-hidden w-full h-[60px] md:h-[118px] mt-auto">
        <img src={cat.img} alt={cat.name} className="w-full h-full object-cover" />
      </div>
    </button>
  );
}
