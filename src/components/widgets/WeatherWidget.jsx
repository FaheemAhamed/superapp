import { CloudRain, Wind, Drop, Thermometer, Sun, Cloud, CloudSnow, CloudLightning, SpinnerGap } from "@phosphor-icons/react";
import { useState, useEffect } from "react";

const WeatherIcon = ({ condition }) => {
  const main = condition?.toLowerCase() || '';
  if (main.includes('rain') || main.includes('drizzle')) return <CloudRain weight="bold" className="absolute left-[70px] top-[140px] w-[70px] h-[70px] text-white" />;
  if (main.includes('clear')) return <Sun weight="bold" className="absolute left-[70px] top-[140px] w-[70px] h-[70px] text-white" />;
  if (main.includes('snow')) return <CloudSnow weight="bold" className="absolute left-[70px] top-[140px] w-[70px] h-[70px] text-white" />;
  if (main.includes('thunder')) return <CloudLightning weight="bold" className="absolute left-[70px] top-[140px] w-[70px] h-[70px] text-white" />;
  return <Cloud weight="bold" className="absolute left-[70px] top-[140px] w-[70px] h-[70px] text-white" />;
};

export default function WeatherWidget() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    // Live clock for the header
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchWeather = async (lat, lon) => {
      try {
        const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
        if (!apiKey) throw new Error("Missing API Key");
        
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
        if (!res.ok) throw new Error("API error");
        
        const json = await res.json();
        setData({
          temp: Math.round(json.main.temp),
          pressure: json.main.pressure,
          humidity: json.main.humidity,
          wind: (json.wind.speed * 3.6).toFixed(1), // convert m/s to km/h
          condition: json.weather[0].main,
        });
      } catch(e) {
        console.error("Weather fetch failed:", e);
        setData({
          temp: '--',
          pressure: '--',
          humidity: '--',
          wind: '--',
          condition: "Unavailable"
        });
      } finally {
        setLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        (err) => fetchWeather(51.5074, -0.1278), // London fallback if denied
        { timeout: 5000 }
      );
    } else {
      fetchWeather(51.5074, -0.1278);
    }
  }, []);

  const dateStr = `${now.getMonth() + 1}-${now.getDate()}-${now.getFullYear()}`;
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="w-[892px] h-[311.41px] relative font-['Roboto'] overflow-hidden rounded-[33.43px]">
      
      {/* Background (Rectangle 20) */}
      <div className="absolute inset-0 bg-[#101744]"></div>
      
      {/* Top Pink Header (Rectangle 31) */}
      <div className="absolute left-0 top-0 w-[892px] h-[96.77px] bg-[#FF4ADE] rounded-t-[33.43px]"></div>

      {/* Header Text — inside pink bar (h-[96.77px]) */}
      <div className="absolute left-[126px] top-[14px] w-[290px] h-[68px] text-white text-[38px] font-semibold leading-[141.69%] tracking-[0.02em] flex items-center">
        {dateStr}
      </div>
      <div className="absolute left-[510px] top-[14px] w-[270px] h-[68px] text-white text-[38px] font-semibold flex items-center">
        {timeStr}
      </div>

      {loading ? (
        <div className="absolute inset-x-0 bottom-0 top-[96.77px] flex items-center justify-center text-white">
          <SpinnerGap className="animate-spin" size={48} />
        </div>
      ) : (
        <>
          {/* Left Section (Weather) */}
          <WeatherIcon condition={data.condition} />
          <div className="absolute left-[32px] top-[236.55px] w-[146.23px] text-center text-white text-[31.43px] font-normal leading-[139.69%] line-clamp-1 break-words">
            {data.condition}
          </div>

          {/* Line 2 */}
          <div className="absolute left-[272.97px] top-[164px] w-[1.37px] h-[79.37px] bg-white"></div>

          {/* Center Section (Temp & Pressure) */}
          <div className="absolute left-[348.36px] top-[114.36px] w-[172.09px] h-[78.22px] text-white text-[78.22px] font-normal leading-[139.69%]">
            {data.temp}°C
          </div>
          <Thermometer weight="bold" className="absolute left-[350px] top-[230px] w-[30px] h-[30px] text-white" />
          <div className="absolute left-[395.91px] top-[226.41px] w-[150px] h-[27.33px] text-white text-[24.6px] font-normal leading-[139.69%]">
            {data.pressure} mbar
          </div>
          <div className="absolute left-[395.91px] top-[260.57px] w-[102.5px] h-[27.33px] text-white text-[24.6px] font-normal leading-[139.69%]">
            Pressure
          </div>

          {/* Line 3 */}
          <div className="absolute left-[574.97px] top-[164px] w-[1.37px] h-[79.37px] bg-white"></div>

          {/* Right Section (Wind & Humidity) */}
          <Wind weight="bold" className="absolute left-[650px] top-[125px] w-[35px] h-[35px] text-white" />
          <div className="absolute left-[700.54px] top-[124.92px] w-[150px] h-[27.33px] text-white text-[24.6px] font-normal leading-[139.69%]">
            {data.wind} km/h
          </div>
          <div className="absolute left-[700.54px] top-[159.08px] w-[102.5px] h-[27.33px] text-white text-[24.6px] font-normal leading-[139.69%]">
            Wind
          </div>

          <Drop weight="bold" className="absolute left-[650px] top-[230px] w-[30px] h-[30px] text-white" />
          <div className="absolute left-[700.56px] top-[223.44px] w-[102.5px] h-[27.33px] text-white text-[24.6px] font-normal leading-[139.69%]">
            {data.humidity}%
          </div>
          <div className="absolute left-[700.56px] top-[257.61px] w-[102.5px] h-[27.33px] text-white text-[24.6px] font-normal leading-[139.69%]">
            Humidity
          </div>
        </>
      )}

    </div>
  );
}
