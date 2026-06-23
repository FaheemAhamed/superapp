export const fetchWeatherData = async (lat, lon, apiKey) => {
  const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
  if (!res.ok) throw new Error("API error");
  const json = await res.json();
  return {
    temp: Math.round(json.main.temp),
    pressure: json.main.pressure,
    humidity: json.main.humidity,
    wind: (json.wind.speed * 3.6).toFixed(1), // convert m/s to km/h
    condition: json.weather[0].main,
  };
};
