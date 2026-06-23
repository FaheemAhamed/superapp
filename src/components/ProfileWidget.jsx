import { useStore } from "@/store/useStore";

export default function ProfileWidget() {
  const { activeUser, categories } = useStore();
  
  // Safe fallback if categories are missing
  const displayCategories = categories?.length ? categories : ["Horror", "Action", "Thriller", "Fiction"];

  return (
    <div
      className="w-[892px] bg-[#5746EA] rounded-[33.43px] relative font-['Roboto'] overflow-hidden"
      style={{ minHeight: '561.24px', paddingBottom: '40px' }}
    >
      
      {/* Avatar Image */}
      <div 
        className="absolute left-[54.54px] top-[51.02px] w-[209.36px] h-[459.2px] border-[5.28px] border-white rounded-[329px] overflow-hidden"
        style={{ filter: "drop-shadow(0px 8.8px 7px rgba(0,0,0,0.31))" }}
      >
        <img 
          src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(activeUser?.username || 'default')}`}
          alt="Avatar" 
          className="w-full h-full object-cover bg-white" 
        />
      </div>

      {/* Text Info Container */}
      <div className="absolute left-[327.24px] top-[78px] w-[500px] flex flex-col gap-[14px] text-white">
        <div className="text-[36.95px] font-normal leading-tight tracking-[0.02em] truncate">
          {activeUser?.name || "KK Vinay"}
        </div>
        <div className="text-[36.95px] font-normal leading-tight tracking-[0.02em] truncate">
          {activeUser?.email || "Vinay090@gmail.com"}
        </div>
        <div className="text-[72.13px] font-medium leading-[1.1] tracking-[0.02em] truncate">
          {activeUser?.username || "vinay060"}
        </div>
      </div>

      {/* Dynamic Categories — flex-wrap, auto-grows */}
      <div className="absolute left-[327.24px] top-[325.48px] w-[500px] flex flex-wrap content-start gap-x-[15.84px] gap-y-[21.11px]">
        {displayCategories.map(cat => (
          <div key={cat} className="w-[237.51px] h-[61.58px] bg-[#9F94FF] rounded-[36.95px] flex items-center shrink-0">
            <span className="ml-[44px] text-white text-[28.15px] font-normal leading-[105.69%] tracking-[0.02em]">
              {cat}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}
