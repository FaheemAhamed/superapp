export const fetchNewsData = async (apiKey, fallbackNews) => {
  let fetchedArticles = [];

  if (apiKey) {
    apiKey = apiKey.replace(/['"]/g, '');
    
    if (apiKey.startsWith('pub_')) {
      // NewsData.io Key
      try {
        const res = await fetch(`https://newsdata.io/api/1/news?apikey=${apiKey}&language=en&image=1`);
        if (res.ok) {
          const json = await res.json();
          if (json.results && json.results.length > 0) {
            fetchedArticles = json.results.map(a => ({
              title: a.title,
              image_url: a.image_url,
              pubDate: a.pubDate,
              description: a.description || a.content
            }));
          }
        }
      } catch (e) {
        console.warn("NewsData.io API call failed, will try fallback.", e);
      }
    } else {
      // NewsAPI.org Key
      try {
        const res = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`);
        if (res.ok) {
          const json = await res.json();
          if (json.articles && json.articles.length > 0) {
            fetchedArticles = json.articles.map(a => ({
              title: a.title,
              image_url: a.urlToImage,
              pubDate: a.publishedAt,
              description: a.description || a.content
            }));
          }
        }
      } catch (e) {
        console.warn("NewsAPI.org API call failed, will try fallback.", e);
      }
    }
  }

  // 1st Fallback: saurav.tech free mirror
  if (fetchedArticles.length === 0) {
    try {
      const res = await fetch("https://saurav.tech/NewsAPI/top-headlines/category/general/us.json");
      if (res.ok) {
        const json = await res.json();
        if (json.articles && json.articles.length > 0) {
          fetchedArticles = json.articles.map(a => ({
            title: a.title,
            image_url: a.urlToImage,
            pubDate: a.publishedAt,
            description: a.description || a.content
            }));
          }
        }
      } catch (e) {
        console.warn("Saurav.tech NewsAPI mirror failed, using local fallback.", e);
      }
  }

  // 2nd Fallback: Local static mock news
  if (fetchedArticles.length === 0) {
    fetchedArticles = fallbackNews;
  }

  // Clean and validate articles
  let filtered = fetchedArticles.filter(a => a.image_url && a.title);
  if (filtered.length === 0) {
    filtered = fetchedArticles.filter(a => a.title);
  }

  if (filtered.length > 0) {
    return filtered;
  } else {
    throw new Error("No news found");
  }
};
