export const fetchMoviesByCategory = async (categories) => {
  let apiKeyUrl = import.meta.env.VITE_OMDB_API_KEY || "";
  let apiKey = "622e6ff1"; 
  const match = apiKeyUrl.match(/apikey=([^&"]+)/);
  if (match) apiKey = match[1];

  const results = {};
  for (const cat of categories) {
    try {
      const res = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(cat)}&type=movie&apikey=${apiKey}`);
      const data = await res.json();
      if (data.Search) {
        results[cat] = data.Search.slice(0, 4); // Only need 4 per row
      }
    } catch (e) {
      console.error(`Failed to fetch OMDB for ${cat}`, e);
    }
  }
  return results;
};

export const fetchMovieDetails = async (imdbID) => {
  let apiKeyUrl = import.meta.env.VITE_OMDB_API_KEY || "";
  let apiKey = "622e6ff1"; 
  const match = apiKeyUrl.match(/apikey=([^&"]+)/);
  if (match) apiKey = match[1];

  const res = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`);
  if (!res.ok) throw new Error("OMDB detailed fetch failed");
  return res.json();
};
