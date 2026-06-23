import { useState, useEffect } from "react";
import { SpinnerGap } from "@phosphor-icons/react";
import { fetchNewsData } from "@/services/newsApi";

const FALLBACK_NEWS = [
  {
    title: "SpaceX Starship Prepares for Next Historic Orbital Flight Test",
    image_url: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80",
    pubDate: new Date().toISOString(),
    description: "SpaceX is completing final preparations for the next orbital launch of Starship, the largest and most powerful space booster ever built. Engineers have implemented several improvements to the stage separation mechanism and thermal protection tiles based on data from previous test flights."
  },
  {
    title: "New AI Developments Promise Breakthroughs in Medical Diagnostics",
    image_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    pubDate: new Date().toISOString(),
    description: "Researchers have unveiled a new class of deep learning models capable of identifying rare cardiovascular anomalies from standard ultrasound scans with over 98% accuracy. This breakthrough could drastically reduce diagnostic times in emergency care facilities globally."
  },
  {
    title: "Global Renewable Energy Generation Reaches Historic Highs in 2025",
    image_url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80",
    pubDate: new Date().toISOString(),
    description: "Wind and solar energy generation have expanded at a record-breaking pace over the last twelve months, now accounting for over 35% of the world's total electricity production. Experts predict that if the current rate of infrastructure growth continues, coal-fired plants will be phased out sooner than expected."
  },
  {
    title: "Mysterious Deep-Ocean Ecosystem Discovered Near Mariana Trench",
    image_url: "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?auto=format&fit=crop&w=800&q=80",
    pubDate: new Date().toISOString(),
    description: "Marine biologists exploring uncharted hydrothermal vents near the Mariana Trench have cataloged dozens of previously unknown species, including bioluminescent organisms and unique chemosynthetic bacteria that thrive in extreme temperatures and high pressure."
  }
];

export default function NewsWidget() {
  const [newsList, setNewsList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const apiKey = import.meta.env.VITE_NEWS_API_KEY;
        const articles = await fetchNewsData(apiKey, FALLBACK_NEWS);
        setNewsList(articles);
      } catch (e) {
        console.error("News fetch failed:", e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  // Automatic switching interval
  useEffect(() => {
    if (newsList.length <= 1) return; // No need to switch if 0 or 1 item
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % newsList.length);
    }, 2000);

    // Clean up interval to avoid memory leaks
    return () => clearInterval(interval);
  }, [newsList.length]);

  if (loading) {
    return (
      <div className="w-[463px] h-[907px] relative bg-white rounded-[19px] flex items-center justify-center">
        <SpinnerGap className="animate-spin text-black" size={48} />
      </div>
    );
  }

  if (error || newsList.length === 0) {
    return (
      <div className="w-[463px] h-[907px] relative bg-white rounded-[19px] flex items-center justify-center p-8 text-center text-[#272727] text-xl font-['Roboto']">
        Failed to load live news. Check API Key.
      </div>
    );
  }

  const news = newsList[currentIndex];

  // Parse Date
  const pubDate = new Date(news.pubDate || Date.now());
  const dateStr = `${pubDate.getMonth() + 1}-${pubDate.getDate()}-${pubDate.getFullYear()}`;
  const timeStr = pubDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const textContent = news.description || news.content || "No description available for this article.";

  return (
    <div className="w-[463px] h-[907px] relative font-['Roboto']">
      
      {/* Image */}
      <div className="absolute left-0 top-0 w-[463px] h-[555px] rounded-t-[19px] overflow-hidden bg-zinc-200">
        <img 
          src={news.image_url || "https://images.unsplash.com/photo-1522199755839-a2bacb67c546?auto=format&fit=crop&w=600&q=80"} 
          alt={news.title} 
          className="w-full h-full object-cover" 
        />
      </div>

      {/* Bottom White Area */}
      <div className="absolute left-0 top-[555px] w-[463px] h-[352px] bg-[#FFFFFF] rounded-b-[19px]"></div>

      {/* Dark Overlay */}
      <div className="absolute left-0 top-[396px] w-[463px] h-[159px] bg-[rgba(0,0,0,0.74)]"></div>

      {/* Overlay Text */}
      <div className="absolute left-[28px] top-[420px] w-[400px] h-[80px] text-white text-[32px] font-medium leading-[123.69%] tracking-[0.02em] line-clamp-2">
        {news.title}
      </div>

      <div className="absolute left-[28px] top-[509px] w-[90px] h-[26px] text-white text-[18.25px] font-semibold leading-[141.69%] tracking-[0.02em]">
        {dateStr}
      </div>

      <div className="absolute left-[134.92px] top-[511.21px] w-[100px] h-[21px] text-white text-[18.25px] font-semibold leading-[21px]">
        {timeStr}
      </div>

      {/* Vertical Line Divider */}
      <div className="absolute left-[124px] top-[515px] w-[13px] h-0 border-[2px] border-white origin-left rotate-90"></div>

      {/* Paragraph Text */}
      <div className="absolute left-[34px] top-[579px] w-[395px] h-[300px] text-[#333333] text-[22px] font-normal leading-[150%] text-left line-clamp-[8] text-ellipsis overflow-hidden">
        {textContent}
      </div>

    </div>
  );
}
