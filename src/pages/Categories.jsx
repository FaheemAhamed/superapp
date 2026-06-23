import { useNavigate } from "react-router-dom";
import { useStore } from "@/store/useStore";
import { WarningCircle } from "@phosphor-icons/react";
import CategoryCard from "@/components/CategoryCard";

const CATEGORIES = [
  { name: "Action", bg: "#FF5209", img: "https://images.unsplash.com/photo-1518929458119-e5bf444c30f4?auto=format&fit=crop&w=400&q=70" },
  { name: "Drama", bg: "#D7A4FF", img: "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=400&q=70" },
  { name: "Romance", bg: "#11B800", img: "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?auto=format&fit=crop&w=400&q=70" },
  { name: "Thriller", bg: "#84C2FF", img: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&w=400&q=70" },
  { name: "Western", bg: "#902500", img: "https://images.unsplash.com/photo-1533450718592-29d45635f0a9?auto=format&fit=crop&w=400&q=70" },
  { name: "Horror", bg: "#7358FF", img: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=400&q=70" },
  { name: "Fantasy", bg: "#FF4ADE", img: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=70" },
  { name: "Music", bg: "#E61E32", img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=70" },
  { name: "Fiction", bg: "#6CD061", img: "https://images.unsplash.com/photo-1519999482648-25049ddd37b1?auto=format&fit=crop&w=400&q=70" },
];

export default function Categories() {
  const navigate = useNavigate();
  const { categories, setCategories, activeUser } = useStore();

  const toggle = (name) => {
    if (categories.includes(name)) setCategories(categories.filter((c) => c !== name));
    else setCategories([...categories, name]);
  };

  const remove = (name) => {
    setCategories(categories.filter((c) => c !== name));
  };

  const canContinue = categories.length >= 3;

  return (
    <div className="min-h-[100dvh] bg-[#000000] text-white p-5 md:p-8 xl:py-4 font-sans flex items-center justify-center">
      <div className="w-full max-w-[1728px] px-4 md:px-8 xl:px-[122px] mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8 items-start lg:items-center justify-between">
        
        {/* Left Side */}
        <div className="w-full lg:w-[40%] flex flex-col justify-center">
          <h2 className="brand-title text-4xl md:text-6xl mb-2 md:mb-4 lg:mb-6 text-[#11b800]">Super app</h2>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-[1.2] tracking-wide mb-3 md:mb-6">
            Choose your <br />
            entertainment <br />
            category
          </h1>

          {activeUser && (
            <div className="flex flex-wrap gap-2 md:gap-3 min-h-[36px] mb-3 md:mb-4">
              {categories.map((c) => (
                <div
                  key={c}
                  className="rounded-full bg-[#148a08] text-white px-4 py-1.5 flex items-center gap-2 text-sm md:text-lg font-medium"
                >
                  {c}
                  <button onClick={() => remove(c)} className="text-[#0a4f04] hover:text-black font-bold leading-none">
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {!canContinue && (
            <div className="text-[#e61e32] flex items-center gap-2 text-sm md:text-base tracking-wide font-medium">
              <WarningCircle weight="fill" className="w-5 h-5 shrink-0" />
              Minimum 3 categories required
            </div>
          )}
        </div>

        {/* Right Side */}
        <div className="w-full lg:w-[60%] flex flex-col items-center lg:items-end pb-24 md:pb-0">
          <div className="grid grid-cols-3 gap-3 md:gap-4 lg:gap-5 w-full max-w-[800px]">
            {CATEGORIES.map((cat) => {
              const selected = categories.includes(cat.name);
              return (
                <CategoryCard
                  key={cat.name}
                  cat={cat}
                  selected={selected}
                  onClick={() => toggle(cat.name)}
                />
              );
            })}
          </div>

          {/* Desktop continue button */}
          <div className="hidden md:flex mt-6 w-full max-w-[800px] justify-end">
            <button
               onClick={() => navigate("/dashboard")}
               disabled={!canContinue}
               className={`rounded-full text-white px-10 py-3 text-lg font-semibold tracking-wide transition-colors ${
                 canContinue ? "bg-[#11b800] hover:bg-[#148a08]" : "bg-gray-500 cursor-not-allowed opacity-50"
               }`}
            >
              Next Page
            </button>
          </div>
        </div>
      </div>

      {/* Mobile fixed continue button */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-black/80 backdrop-blur border-t border-white/10 z-50">
        <button
          onClick={() => navigate("/dashboard")}
          disabled={!canContinue}
          className={`w-full rounded-full text-white py-4 text-base font-bold tracking-wide transition-colors ${
            canContinue ? "bg-[#11b800] active:bg-[#148a08]" : "bg-gray-600 cursor-not-allowed opacity-50"
          }`}
        >
          {canContinue ? "Continue →" : `Select ${3 - categories.length} more`}
        </button>
      </div>
    </div>
  );
}
