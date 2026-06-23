import { useState, useEffect } from "react";
import { SpinnerGap } from "@phosphor-icons/react";

export default function NewsWidget() {
  const [newsList, setNewsList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        let apiKey = import.meta.env.VITE_NEWS_API_KEY;
        if (!apiKey) throw new Error("Missing API Key");
        
        // Remove quotes if any are present in the env file
        apiKey = apiKey.replace(/['"]/g, '');

        const res = await fetch(`https://newsdata.io/api/1/news?apikey=${apiKey}&language=en&image=1`);
        if (!res.ok) throw new Error("API error");
        
        const json = await res.json();
        if (json.results && json.results.length > 0) {
          // Keep articles that actually have an image
          const articles = json.results.filter(a => a.image_url && a.title);
          if (articles.length > 0) {
            setNewsList(articles);
          } else {
            setNewsList(json.results); // Fallback to all if none have images
          }
        } else {
          throw new Error("No news found");
        }
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
      <div className="absolute left-[42px] top-[579px] w-[380px] h-[300px] text-[#272727] text-[18.25px] font-normal leading-[161.69%] text-justify line-clamp-[10] text-ellipsis overflow-hidden">
        {textContent}
      </div>

    </div>
  );
}
